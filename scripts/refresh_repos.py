#!/usr/bin/env python3
"""Snapshot only PUBLIC GitHub repositories; never enumerate private repos."""
from pathlib import Path
import json, subprocess, datetime
root=Path(__file__).resolve().parents[1]
out=root/'src'/'data'/'repositories.json'
out.parent.mkdir(parents=True,exist_ok=True)
raw=subprocess.check_output(['gh','api','--paginate','--slurp','users/Saiiru/repos?per_page=100&type=owner'],text=True)
repos=[repo for page in json.loads(raw) for repo in page if not repo.get('private')]
seen=set()
records=[]
def categorize(repo):
    n=repo['name'].lower()
    if any(x in n for x in ['glados','dumm','lollms','odysseus','prompt','sdw24','ccg-workflow','ai-']): return 'IA e dados'
    if any(x in n for x in ['esp32','pomodoro','badge','bootloader','dotfiles','dwm','cyberarch','quickshell','homelab','gfx803','zen','wallpaper','i3status','materialshell']): return 'Sistemas e maker'
    lang=(repo.get('language') or '').lower()
    if lang in ['java','kotlin','go','python','ruby'] or any(x in n for x in ['api','spring','poo','backend','fullstack13','bancoatm']): return 'APIs e backend'
    if lang in ['typescript','javascript','html','css','vue','svelte'] or any(x in n for x in ['angular','front','lab','web','portfolio','dtmoney','spacetime','rentx']): return 'Web e interfaces'
    return 'Estudos e recursos'
for repo in repos:
    name=repo['name']
    if name.lower() in seen: continue
    seen.add(name.lower())
    records.append({
        'name':name, 'description':(repo.get('description') or '').strip(),
        'url':repo['html_url'],'language':repo.get('language') or '',
        'category':categorize(repo),'fork':bool(repo.get('fork')),
        'archived':bool(repo.get('archived')),'stars':repo.get('stargazers_count') or 0,
        'updated':(repo.get('updated_at') or '')[:10],
        'homepage':repo.get('homepage') or ''
    })
records.sort(key=lambda r:(r['fork'],r['name'].casefold()))
now=datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=-3))).date().isoformat()
data={'generatedAt':now,'owner':'Saiiru','source':'https://api.github.com/users/Saiiru/repos','repositories':records}
out.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
index=root/'PROJECT_INDEX.md'
lines=['# Índice completo de repositórios públicos','',
f'Atualizado em {now} via API pública do GitHub. **{len(records)} repositórios**, incluindo projetos originais, estudos e forks.','',
'> Este é um inventário, não uma lista de produtos concluídos. O marcador **Fork** indica código originado de outro autor.','',
'Os três laboratórios de IA e seus testes estão no diretório projects/applied-ai.','',
'| Repositório | Área | Linguagem | Origem |','| --- | --- | --- | --- |']
for r in records:
    lines.append(f"| [{r['name']}]({r['url']}) | {r['category']} | {r['language'] or '—'} | {'Fork' if r['fork'] else 'Próprio'} |")
lines+=['','## Como atualizar','',
'Execute python3 scripts/refresh_repos.py com gh autenticado. O script usa a API pública e não inclui repositórios privados.']
index.write_text('\n'.join(lines)+'\n',encoding='utf-8')
print(f'PUBLIC_REPOS={len(records)} OWN={sum(not r["fork"] for r in records)} FORKS={sum(r["fork"] for r in records)}')
