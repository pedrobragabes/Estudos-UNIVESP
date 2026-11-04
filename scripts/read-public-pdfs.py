"""Download only public PDF URLs observed in the AVA DOM; preserve local evidence."""
import concurrent.futures, hashlib, json, pathlib, urllib.request
from pypdf import PdfReader
root = pathlib.Path(__file__).resolve().parents[1] / '.sources' / 'ava-2026-b4'
data = json.loads((root / 'capture.json').read_text(encoding='utf-8'))
urls = {}
for c in data['inventory']:
    for s in c['sections']:
        for a in s['links']:
            if '.pdf' in a['url'] and any(host in a['url'] for host in ['assets.univesp.br/', 'www.cs.cmu.edu/', 'www.ime.usp.br/', 'edisciplinas.usp.br/']):
                urls[a['url']] = dict(a, course=c['title'], section=s['title'].strip())
for p in data['collected']:
    for a in p.get('links', []):
        if '.pdf' in a['url'] and any(host in a['url'] for host in ['assets.univesp.br/', 'www.cs.cmu.edu/', 'www.ime.usp.br/', 'edisciplinas.usp.br/']):
            urls[a['url']] = dict(a, course=p['course'], section=p['section'])
(root / 'pdf').mkdir(exist_ok=True)
def read(item):
    url, source = item
    name = hashlib.sha256(url.encode()).hexdigest()[:12]
    file = root / 'pdf' / (name + '.pdf')
    try:
        if not file.exists():
            request = urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0'})
            with urllib.request.urlopen(request, timeout=35) as response:
                file.write_bytes(response.read())
        reader = PdfReader(file)
        pages = [p.extract_text() or '' for p in reader.pages]
        textfile = file.with_suffix('.txt')
        textfile.write_text('\n\n'.join(f'--- Página {i+1} ---\n{p}' for i,p in enumerate(pages)), encoding='utf-8')
        return dict(source, status='text-extracted', pages=len(pages), text='\n\n'.join(pages), file=str(file), chars=sum(map(len,pages)))
    except Exception as e:
        return dict(source, status='unavailable', error=str(e))
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
    result = list(pool.map(read, urls.items()))
(root / 'pdf-analysis.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps([dict(title=x['title'], url=x['url'],status=x['status'],pages=x.get('pages'),chars=x.get('chars')) for x in result], ensure_ascii=False))
