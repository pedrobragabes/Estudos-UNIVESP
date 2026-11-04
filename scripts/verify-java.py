import json, pathlib, subprocess
root=pathlib.Path(__file__).resolve().parents[1]/'.sources'/'ava-2026-b4'/'verification'
programs=json.loads((root/'java-programs.json').read_text())
expected=[['Ana: 1','Bia: 0','true'],['1500','1'],['PDF: notas','CSV: notas'],['1','[1, 3]'],['[Ana, Bia]','{Ana=2, Bia=1}','Ana -> 2','Bia -> 1'],['Emprestado','Sem unidades'],['[ANA, ALANA]','[Ana, Bia, Alana]'],['Revisar','null'],['2000'],['Recebido: Ola']]
results=[]
for p,want in zip(programs,expected,strict=True):
    subprocess.run(['javac','-encoding','UTF-8','-Xlint:all','Main.java'],cwd=p['dir'],check=True,capture_output=True,text=True)
    run=subprocess.run(['java','-cp',p['dir'],'Main'],cwd=p['dir'],check=True,capture_output=True,text=True,timeout=15)
    got=run.stdout.strip().splitlines()
    if got!=want:raise AssertionError((p['topic'],got,want))
    results.append(dict(topic=p['topic'],title=p['title'],output=got,status='passed'))
(root/'java-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
print(f'{len(results)} Java programs compiled and executed with expected output.')
