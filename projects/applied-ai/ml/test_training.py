import importlib.util
import unittest
from pathlib import Path
import json
import numpy as np

ROOT=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('training',ROOT/'train.py')
training=importlib.util.module_from_spec(spec)
spec.loader.exec_module(training)

class TrainingTests(unittest.TestCase):
    def setUp(self):
        self.rows=json.loads((ROOT/'data/tickets.json').read_text())['rows']

    def test_dataset_is_disjoint_by_scenario_and_text(self):
        training.validate_dataset(self.rows)
        duplicate=dict(self.rows[0],split='test',id='DUPLICATE')
        with self.assertRaises(ValueError):training.validate_dataset(self.rows+[duplicate])

    def test_vocab_only_uses_training_documents(self):
        rows=[dict(r) for r in self.rows]
        for r in rows:
            if r['split']=='test':r['text']+=' ZZZONLYINTEST'
        artifact,report,pipeline=training.train_model(rows)
        self.assertFalse(any('zzzonlyintest' in v for v in artifact['vocabulary']))
        self.assertEqual(report['test']['support'],sum(r['split']=='test' for r in rows))

    def test_exported_probabilities_match_sklearn(self):
        artifact,_,pipeline=training.train_model(self.rows)
        for row in self.rows[:8]:
            result=training.predict(row['text'],artifact)
            np.testing.assert_allclose(result['probabilities'],pipeline.predict_proba([row['text']])[0],rtol=1e-10,atol=1e-10)

if __name__=='__main__':unittest.main()
