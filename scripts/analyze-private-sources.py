"""Index already exported source text locally; never publishes book/transcript text."""
import collections
import json
import pathlib
import re
import shutil

base = pathlib.Path(__file__).resolve().parents[1]
root = base / '.sources/ava-2026-b4'
data = json.loads((root / 'capture.json').read_text(encoding='utf8'))
videos = json.loads((root / 'video-inventory.json').read_text(encoding='utf8'))
exports = pathlib.Path.home() / 'AppData/Local/Temp/browser-use/exports'
transcripts = root / 'transcripts'
transcripts.mkdir(exist_ok=True)
available = {}
for path in exports.glob('youtube-*.txt'):
    match = re.search(r'youtube-([\w-]{11})-', path.name)
    if match:
        available[match[1]] = path
for video in videos:
    path = available.get(video['videoId'])
    video['status'] = 'text-extracted' if path else 'unavailable'
    if path:
        target = transcripts / (video['videoId'] + '.txt')
        shutil.copyfile(path, target)
        text = target.read_text(encoding='utf8')
        video['characters'] = len(text)
        video['words'] = len(text.split())
        video['path'] = str(target.relative_to(base))
    else:
        video['note'] = 'Player consultado em 03/11/2026: não há legendas disponíveis; conteúdo apoiado nos textos e slides associados.'
(root / 'transcript-analysis.json').write_text(json.dumps(videos, ensure_ascii=False, indent=2), encoding='utf8')
books = {}
for key, pages in data.items():
    if key.endswith('Readings') or key == 'trottPages':
        books[key] = dict(records=len(pages), uniqueTexts=len({p.get('text','') for p in pages}), empty=sum(not p.get('text','').strip() for p in pages))
report = dict(transcripts=sum(v['status']=='text-extracted' for v in videos), videos=len(videos), words=sum(v.get('words',0) for v in videos), books=books, libraryChapters=len(data['libraryChapters']))
(root / 'text-coverage.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf8')
print(json.dumps(report, ensure_ascii=False, indent=2))
