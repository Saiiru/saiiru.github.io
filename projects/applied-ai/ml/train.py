"""Train Vetor's small supervised text classifier and export browser-safe JSON.

Run from any directory: python ml/train.py. No network, model download, or GPU.
"""
from __future__ import annotations

import argparse
from collections import Counter
import hashlib
import json
import math
from pathlib import Path
import re
import time
import unicodedata

import numpy as np
import sklearn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score
from sklearn.pipeline import Pipeline

ROOT = Path(__file__).resolve().parents[1]
CLASSES = ['Acesso', 'Entrega', 'Estornos', 'Pagamentos']
POLICY = {'minScore': 0.45, 'minMargin': 0.08, 'minKnownRatio': 0.10, 'maxChars': 4000}


def tokens(text):
    normalized = ''.join(c for c in unicodedata.normalize('NFD', str(text)) if not unicodedata.combining(c))
    return re.findall(r'[a-z0-9]{2,}', normalized.lower())


def validate_dataset(rows):
    seen_ids, seen_text, groups = set(), set(), {}
    for r in rows:
        if r['split'] not in {'train', 'validation', 'test', 'ood'}:
            raise ValueError('unknown split')
        if r['split'] != 'ood' and r['label'] not in CLASSES:
            raise ValueError('unknown label')
        key = ' '.join(tokens(r['text']))
        if not key or len(r['text']) > POLICY['maxChars'] or key in seen_text or r['id'] in seen_ids:
            raise ValueError('empty, oversized or duplicate example')
        if r['group'] in groups and groups[r['group']] != r['split']:
            raise ValueError('scenario leaks across splits')
        groups[r['group']] = r['split']
        seen_ids.add(r['id']); seen_text.add(key)
    for split in ['train', 'validation', 'test']:
        if set(r['label'] for r in rows if r['split'] == split) != set(CLASSES):
            raise ValueError(f'{split} must contain all classes')


def predict(text, artifact):
    if not isinstance(text, str) or len(text) > artifact['policy']['maxChars']:
        raise ValueError('text must be a string with at most 4000 characters')
    words = tokens(text)
    features = words + [' '.join(pair) for pair in zip(words, words[1:])]
    counts = Counter(features)
    values = np.array([counts.get(term, 0) * idf for term, idf in zip(artifact['vocabulary'], artifact['idf'])])
    norm = np.linalg.norm(values)
    if norm: values /= norm
    logits = np.asarray(artifact['coef']) @ values + artifact['intercept']
    probs = np.exp(logits - max(logits)); probs /= probs.sum()
    order = np.argsort(-probs, kind='stable')
    i, j = order[:2]
    vocab = set(artifact['vocabulary'])
    known = sum(word in vocab for word in words) / len(words) if words else 0
    p = artifact['policy']
    accepted = bool(words and known >= p['minKnownRatio'] and probs[i] >= p['minScore'] and probs[i]-probs[j] >= p['minMargin'])
    return {'label': artifact['classes'][i] if accepted else 'Revisão manual',
            'suggestedLabel': artifact['classes'][i], 'accepted': accepted,
            'score': float(probs[i]), 'margin': float(probs[i]-probs[j]),
            'knownRatio': known, 'probabilities': probs.tolist()}


def rule_baseline(text):
    for label, pattern in [('Estornos', r'estorno|reembolso|devolu[cç][aã]o'),
                           ('Pagamentos', r'pagamento|cobran[cç]a|cart[aã]o|\bpix\b'),
                           ('Acesso', r'acesso|conta|login|senha|entrar'),
                           ('Entrega', r'entrega|entregador|endere[cç]o|pedido')]:
        if re.search(pattern, text, re.I): return label
    return 'Revisão manual'


def train_model(rows):
    validate_dataset(rows)
    train = [r for r in rows if r['split'] == 'train']
    val = [r for r in rows if r['split'] == 'validation']
    test = [r for r in rows if r['split'] == 'test']
    x, y = [r['text'] for r in train], [r['label'] for r in train]
    candidates = []
    for c in [0.5, 1.0, 4.0]:
        pipe = Pipeline([('tfidf', TfidfVectorizer(tokenizer=tokens, token_pattern=None, lowercase=False, ngram_range=(1, 2))),
                         ('classifier', LogisticRegression(C=c, max_iter=1000, random_state=17))])
        pipe.fit(x, y)
        score = f1_score([r['label'] for r in val], pipe.predict([r['text'] for r in val]), average='macro', zero_division=0)
        candidates.append((float(score), c, pipe))
    best_score, c, pipe = max(candidates, key=lambda v: (v[0], -v[1]))
    vectorizer, classifier = pipe['tfidf'], pipe['classifier']
    dataset_hash = hashlib.sha256(json.dumps(rows, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
    artifact = {'schemaVersion': 1, 'name': 'Vetor', 'algorithm': 'TF-IDF + multinomial logistic regression',
                'datasetSha256': dataset_hash, 'dataKind': 'synthetic-ai-assisted', 'sklearnVersion': sklearn.__version__,
                'tokenizer': 'NFD/remove-diacritics/lower/ascii-alnum-min2/word-ngrams-1-2',
                'classes': classifier.classes_.tolist(), 'vocabulary': vectorizer.get_feature_names_out().tolist(),
                'idf': vectorizer.idf_.tolist(), 'coef': classifier.coef_.tolist(),
                'intercept': classifier.intercept_.tolist(), 'policy': POLICY,
                'hyperparameters': {'C': c, 'max_iter': 1000, 'random_state': 17}, 'probabilitiesCalibrated': False}
    truth = [r['label'] for r in test]
    raw = pipe.predict([r['text'] for r in test]).tolist()
    baseline = [rule_baseline(r['text']) for r in test]
    decisions = [predict(r['text'], artifact) for r in test]
    accepted = [(r, d) for r, d in zip(test, decisions) if d['accepted']]
    ood = [r for r in rows if r['split'] == 'ood']
    report = {'schemaVersion': 1, 'scope': 'Small synthetic benchmark, not production evidence. AI-assisted data; not independently reviewed.',
              'datasetSha256': dataset_hash, 'counts': dict(Counter(r['split'] for r in rows)),
              'selection': {'metric': 'validation_macro_f1', 'candidates': [{'C': c0, 'macroF1': s} for s, c0, _ in candidates],
                            'chosenC': c, 'bestValidationMacroF1': best_score, 'policyChosenBeforeTest': POLICY},
              'test': {'support': len(test), 'accuracy': accuracy_score(truth, raw),
                       'macroF1': f1_score(truth, raw, average='macro', zero_division=0),
                       'baselineAccuracy': accuracy_score(truth, baseline),
                       'baselineMacroF1': f1_score(truth, baseline, labels=CLASSES, average='macro', zero_division=0),
                       'coverage': len(accepted)/len(test),
                       'selectiveAccuracy': sum(r['label']==d['label'] for r,d in accepted)/len(accepted) if accepted else None,
                       'labels': CLASSES, 'confusionMatrix': confusion_matrix(truth, raw, labels=CLASSES).tolist(),
                       'classificationReport': classification_report(truth, raw, labels=CLASSES, output_dict=True, zero_division=0),
                       'outcomes': [{'id': r['id'], 'text': r['text'], 'expected': r['label'], 'rawPrediction': pred,
                                     'baselinePrediction': base, **decision} for r,pred,base,decision in zip(test,raw,baseline,decisions)]},
              'ood': {'support': len(ood), 'rejectionRate': sum(not predict(r['text'],artifact)['accepted'] for r in ood)/len(ood) if ood else None,
                      'outcomes': [{'id':r['id'],'text':r['text'],**predict(r['text'],artifact)} for r in ood]}}
    return artifact, report, pipe


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--data',type=Path,default=ROOT/'ml/data/tickets.json')
    parser.add_argument('--out',type=Path,default=ROOT)
    args=parser.parse_args()
    data=json.loads(args.data.read_text())
    started=time.perf_counter()
    artifact,report,_=train_model(data['rows'])
    fixtures=[{'text':r['text'],**predict(r['text'],artifact)} for r in data['rows'] if r['split'] in ['test','ood']]
    for rel,value in [('models/vetor.json',artifact),('reports/vetor.json',report),('ml/fixtures/parity.json',fixtures)]:
        p=args.out/rel;p.parent.mkdir(parents=True,exist_ok=True)
        p.write_text(json.dumps(value,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
    print(json.dumps({'trainSeconds':round(time.perf_counter()-started,3),'features':len(artifact['vocabulary']),
                      'testMacroF1':report['test']['macroF1'],'baselineMacroF1':report['test']['baselineMacroF1'],
                      'coverage':report['test']['coverage'],'oodRejectionRate':report['ood']['rejectionRate']}))

if __name__=='__main__': main()
