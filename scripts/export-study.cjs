/* eslint-disable @typescript-eslint/no-require-imports */
// Export authored lessons independently of the UI. Never export private DOM captures.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const result = ts.transpileModule(source, { compilerOptions: {module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022} });
  module._compile(result.outputText, filename);
};
const root = path.resolve(__dirname, '..');
const { currentTopics } = require('../src/data/curriculum.ts');
const sources = require('../src/data/ava-sources.json');
const base = path.join(root,'docs/acervo/2026-b4');
const programs=[];
for (const t of currentTopics) {
  const l=t.lesson;
  let md=`# ${t.subjectId} · Semana ${t.week} · ${t.title}\n\nExplicações e exercícios autorais baseados nas fontes consultadas em 02/11/2026. A análise integral de livros, vídeos e lives permanece pendente; confira os status abaixo.\n\n## Síntese\n\n${t.summary.join('\n\n')}\n\n## Objetivos\n\n${l.objectives.map(x=>'- '+x).join('\n')}\n`;
  for (const s of l.sections) md+=`\n## ${s.title}\n\n${s.body.join('\n\n')}\n${s.code?'\n```java\n'+s.code+'\n```\n':''}`;
  if(l.formulas.length) md+='\n## Fórmulas e hipóteses\n'+l.formulas.map(f=>`\n$$\n${f.tex}\n$$\n\n${f.meaning}\n`).join('');
  md+='\n## Prática comentada\n'+l.practice.map((p,i)=>`\n### ${i+1}. ${p.prompt}\n\n${p.steps.map((s,n)=>`${n+1}. ${s}`).join('\n')}\n`).join('');
  md+='\n## Erro comum\n\n'+t.pitfall+'\n\n## Flashcards\n\n'+t.cards.map(c=>`- **${c.question}** ${c.answer}`).join('\n');
  md+='\n\n## Questões autorais\n'+t.questions.map((q,i)=>`\n### ${i+1}. ${q.prompt}\n\n${q.options.map((o,n)=>`${String.fromCharCode(65+n)}. ${o}`).join('\n')}\n\n**Gabarito:** ${String.fromCharCode(65+q.correct)}. ${q.explanation}\n`).join('');
  md+='\n## Revisão\n\n'+l.review.map(s=>'- '+s).join('\n');
  if(l.readingNotes?.length) md+='\n\n## Notas críticas de leitura\n\n'+l.readingNotes.map(s=>'- '+s).join('\n');
  md+='\n\n## Fontes e cobertura\n\n'+sources.filter(s=>s.subjectId===t.subjectId&&s.week===t.week).map(s=>`- [${s.title}](${s.url}) · ${s.kind} · ${s.status}. ${s.note}`).join('\n')+'\n';
  const dir=path.join(base,t.subjectId);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,`S${t.week}.md`),md);
  let index=0;
  for(const section of l.sections.filter(s=>s.code)) {
    const dir=path.join(root,'.sources/ava-2026-b4/verification/java',`${t.id}-${++index}`);
    fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'Main.java'),section.code);
    programs.push({topic:t.id,title:section.title,dir});
  }
}
fs.mkdirSync(path.join(root,'.sources/ava-2026-b4/verification'),{recursive:true});
fs.writeFileSync(path.join(root,'.sources/ava-2026-b4/verification/java-programs.json'),JSON.stringify(programs,null,2));
fs.writeFileSync(path.join(base,'README.md'),`# Acervo autoral · 4º bimestre de 2026\n\n21 semanas com explicações, exemplos, exercícios, cartões e fontes. O relatório detalha a coleta de textos, leituras e transcrições, além das limitações de acesso e de análise.\n\n${currentTopics.map(t=>`- [${t.subjectId} · S${t.week} · ${t.title}](${t.subjectId}/S${t.week}.md)`).join('\n')}\n`);
console.log(JSON.stringify({weeks:currentTopics.length,cards:currentTopics.flatMap(t=>t.cards).length,questions:currentTopics.flatMap(t=>t.questions).length,practice:currentTopics.reduce((n,t)=>n+t.lesson.practice.length,0),javaPrograms:programs.length}));
