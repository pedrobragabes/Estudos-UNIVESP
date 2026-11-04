"""Build a public, credential-free source catalog from private DOM observations."""
import json, pathlib, re, hashlib
base=pathlib.Path(__file__).resolve().parents[1]
root=base/'.sources'/'ava-2026-b4'
data=json.loads((root/'capture.json').read_text(encoding='utf8'))
pdfs=json.loads((root/'pdf-analysis.json').read_text(encoding='utf8'))
transcripts=json.loads((root/'transcript-analysis.json').read_text(encoding='utf8'))
coverage=json.loads((root/'text-coverage.json').read_text(encoding='utf8'))
seen={p['url']:p for p in data['collected']}
sources={}

def video_id(url):
    match=re.search(r'(?:youtu\.be/|embed/|[?&]v=)([\w-]{11})',url)
    return match[1] if match else None

def video_note(url):
    match=next((v for v in transcripts if v['videoId']==video_id(url)),None)
    if match and match['status']=='text-extracted':
        text=(base/match['path']).read_text(encoding='utf8')
        quality=' Legenda automática: nomes, código e fórmulas exigem conferência com os textos.' if 'auto-generated' in text[:200] else ''
        if 'Language: es' in text[:200]: quality=' Legenda automática em espanhol com reconhecimento inadequado; não utilizada como autoridade técnica.'
        return 'partial','Transcrição exportada e trechos temáticos conferidos com os materiais da semana. Não equivale a assistir integralmente ao vídeo.'+quality
    if match:
        return 'pending','Player consultado em 03/11/2026: sem legendas disponíveis. Consulte os textos e slides associados; áudio não analisado integralmente.'
    return 'pending','Versão alternativa de acessibilidade identificada. A versão principal da aula possui transcrição consultada; esta versão não foi analisada separadamente.'

def book_note(title):
    if 'Comece sua startup' in title:
        return 'pending','Biblioteca recusou acesso ao livro: “Infelizmente, você não tem acesso a este livro”. Não foi contornado. A semana usa slides, páginas oficiais, transcrição e outra leitura acessível.'
    note='Trechos indicados coletados no leitor e conceitos pertinentes consultados; figuras e conteúdo integral não foram todos revistos visualmente.'
    if 'Criatividade e inovação' in title:
        note+=' O leitor oferece até a página numerada 136; páginas solicitadas 137–142 não acessíveis nesta edição. Quatro páginas consultadas são páginas em branco.'
    if 'Plano de negócios com o modelo Canvas' in title:
        note+=' Edição disponível tem 122 páginas: consultados capítulo 3 e exemplo do capítulo 5; páginas 168–180 indicadas pelo AVA não existem nessa edição.'
    if '6. Ed.' in title:
        note+=' Reconhecimento textual da 6ª edição é de baixa qualidade; a 10ª edição e os exemplos compilados orientam a explicação de generics.'
    if '7.3' in title:
        note+=' No trecho de redes da 8ª edição, nove posições virtuais retornaram texto vazio; não foram contadas como leitura completa.'
    return 'partial',note
def add(url,title,subject,section,kind,status,note):
    if not url.startswith('https://') or re.search(r'sesskey=|[?&]code=|oauth|token=',url,re.I): return
    key=hashlib.sha256((subject+section+url).encode()).hexdigest()[:16]
    sources[key]=dict(id=key,url=url,title=re.sub(r'\s+',' ',title).strip(),subjectId=subject,week=int(re.search(r'Semana (\d+)',section)[1]) if re.search(r'Semana (\d+)',section) else 0,section=section,kind=kind,status=status,note=note,accessedAt='2026-11-02')
for c in data['inventory']:
    sid=re.search(r'(PES300|ADM200|COM230)',c['title'])[0]
    for s in c['sections']:
        section=s['title'].strip()
        for a in s['links']:
            url=a['url']; title=a['title']
            if '/mod/' not in url:continue
            kind=url.split('/mod/')[1].split('/')[0]
            status='verified' if kind=='page' and url in seen else 'pending'
            note='Página oficial lida; explicações do acervo são autorais.'
            if kind=='page' and ('Videoaulas' in title or 'Videoaulas' in seen.get(url,{}).get('title','')):
                status='partial';note='Descrição, slides e transcrições disponíveis consultados. A análise textual não equivale a assistir integralmente aos vídeos.'
            if kind=='lti':
                status='pending';note='Lançador LTI verificado. Conteúdo externo ainda não analisado integralmente.'
                if re.search(r'Texto',title,re.I):status,note=book_note(title)
                else:status='partial';note='Lançador e orientação da live consultados. Gravação e áudio não analisados integralmente; não houve ingresso em sala ao vivo.'
            if kind=='forum':status='partial';note='Página e discussões visíveis consultadas. Respostas paginadas não esgotadas; dados pessoais não incorporados ao acervo.'
            if kind=='quiz':status='partial';note='Página de orientações verificada. Nenhuma tentativa iniciada, respondida ou enviada; enunciados internos não extraídos.'
            if kind=='url':status='partial';note='Link e descrição identificados. Destino externo pendente de análise integral.'
            if kind=='feedback':status='excluded';note='Pesquisa administrativa identificada; não enviada e não usada como fonte acadêmica.'
            add(url,title,sid,section,kind,status,note)
for p in data['collected']:
    sid=re.search(r'(PES300|ADM200|COM230)',p['course'])[0]
    for a in p.get('links',[]):
        url=a['url']
        if '/mod/' in url or '/course/' in url or not re.search(r'\.pdf|youtube|youtu.be|apps.univesp',url):continue
        if 'download.php' in url:continue
        match=next((x for x in pdfs if x['url']==url),None)
        if video_id(url):
            status,note=video_note(url)
            add(url,a['title'] or 'Vídeo associado',sid,p['section'],'video',status,note)
        else:
            status='partial' if match and match['status']=='text-extracted' else 'pending'
            note=f"PDF acessível; texto extraído de {match['pages']} páginas. Trechos pertinentes usados como apoio. Figuras, fórmulas e conteúdo integral ainda não foram todos conferidos visualmente." if match and match['status']=='text-extracted' else 'Recurso associado identificado; conteúdo integral pendente.'
            if '/repositorio/' in url:
                status='partial';note='Catálogo e recurso de destino abertos em 03/11/2026. Texto de apresentação e conteúdo textual disponível consultados; todas as interações e animações não foram esgotadas.'
            if match and match['status']=='unavailable':note='Destino consultado: não retornou PDF válido (página HTML). Conteúdo não extraído; mantido como pendência.'
            add(url,a['title'] or url.rsplit('/',1)[-1],sid,p['section'],'pdf' if match else 'external',status,note)
    for f in p.get('frames',[]):
        if 'youtube.com/' in f['url']:
            status,note=video_note(f['url'])
            add(f['url'],'Vídeo associado a '+p['title'],sid,p['section'],'video',status,note)
add('https://docs.oracle.com/javase/specs/jls/se8/html/jls-17.html','Java Language Specification · Threads and Locks','COM230','Semana 7','documentation','verified','Complemento técnico consultado em 03/11/2026 para conferir monitores, wait, sleep e a diferença entre visibilidade de volatile e atomicidade de uma operação composta.')
(base/'src/data/ava-sources.json').write_text(json.dumps(list(sources.values()),ensure_ascii=False,indent=2),encoding='utf8')
report=dict(courses=3,weeks=21,revisionSections=3,resourcesIdentified=220,resourcesVisited=len(data['collected']),pdfs=sum(p['status']=='text-extracted' for p in pdfs),pdfPages=sum(x.get('pages',0) for x in pdfs),statusCounts={s:sum(x['status']==s for x in sources.values()) for s in ['verified','partial','pending','excluded']})
report.update(transcripts=coverage['transcripts'],videos=coverage['videos'],bookPageObservations=sum(x['records'] for x in coverage['books'].values()),libraryChapters=coverage['libraryChapters'])
(base/'src/data/ava-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
print(report)
