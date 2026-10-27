#!/usr/bin/env python3
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlparse,unquote
from collections import Counter
root=Path(__file__).resolve().parents[1]
pages=[p for p in root.rglob('*.html') if p.name != '__preview.html']
errors=[];warnings=[];checked=0;links=0;images=0
for file in pages:
 soup=BeautifulSoup(file.read_text(encoding='utf8'),'html.parser')
 title=soup.find('title');descr=soup.find('meta',attrs={'name':'description'});main=soup.find('main');h1=soup.find_all('h1');
 if not title or not title.get_text(strip=True):errors.append((str(file.relative_to(root)),'missing title'))
 if not descr or not descr.get('content'):errors.append((str(file.relative_to(root)),'missing description'))
 if not main:errors.append((str(file.relative_to(root)),'missing main landmark'))
 if len(h1)!=1:errors.append((str(file.relative_to(root)),f'h1 count {len(h1)}'))
 for img in soup.find_all('img'):
  images+=1
  if not img.get('alt'):errors.append((str(file.relative_to(root)),'img missing alt'))
  s=img.get('src',''); u=urlparse(s)
  if u.scheme in ('http','https'):
   warnings.append((str(file.relative_to(root)),f'external image (not checked offline): {s}'))
   continue
  target=(root/s.lstrip('/')) if s.startswith('/') else file.parent/s
  if s and not target.is_file():errors.append((str(file.relative_to(root)),f'broken image {s}'))
 for tag in soup.select('[href]'):
  ref=tag.get('href','');links+=1
  if not ref or ref.startswith(('#','tel:','mailto:','data:')):continue
  u=urlparse(ref)
  if u.scheme in ('https','http'):continue
  target=root/u.path.lstrip('/') if ref.startswith('/') else file.parent/u.path
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append((str(file.relative_to(root)),f'broken href {ref}'))
 for tag in soup.find_all('script',src=True):
  target=root/tag['src'].lstrip('/')
  if not target.exists():errors.append((str(file.relative_to(root)),f'broken JS {tag["src"]}'))
 checked+=1
counts=Counter((BeautifulSoup(f.read_text(encoding='utf8'),'html.parser').title.get_text() for f in pages))
for t,n in counts.items():
 if n>1:errors.append(('titles',f'duplicate {t}: {n}'))
print('PAGES',checked,'LINKS',links,'IMAGES',images,'ERRORS',len(errors))
for e in errors:print('FAIL',*e)
raise SystemExit(1 if errors else 0)
