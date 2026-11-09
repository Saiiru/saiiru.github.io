"""Export only web component roles from the user's existing canonical palette."""
from pathlib import Path
import argparse,hashlib,json,tomllib
parser=argparse.ArgumentParser()
parser.add_argument('--source',type=Path,default=Path.home()/'dotfiles/themes/palettes/nord-recon.toml')
parser.add_argument('--check',action='store_true')
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
raw=args.source.expanduser().read_bytes();colors=tomllib.loads(raw.decode())['colors']
roles={'bg':'background','panel':'surface','text':'text','muted':'subtext','line':'border','signal':'focus_text','coral':'danger'}
css='/* Generated from Saiiru/dotfiles themes/palettes/nord-recon.toml. Do not edit roles here. */\n.ca-library[data-palette=nord]{'+''.join('--ca-'+role+':'+colors[key]+';' for role,key in roles.items())+'}\n'
metadata=json.dumps({'source':'Saiiru/dotfiles/themes/palettes/nord-recon.toml','sha256':hashlib.sha256(raw).hexdigest(),'mapping':roles},indent=2)+'\n'
for relative,content in [('core/nord.css',css),('reference/nord-source.json',metadata)]:
 path=root/relative
 if args.check:
  if path.read_text()!=content:raise SystemExit('Adapter differs: '+relative)
 else:path.write_text(content)
print('Nord web adapter matches canonical source' if args.check else 'Nord web adapter exported')
