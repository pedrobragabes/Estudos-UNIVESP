# Estudos UNIVESP

Projeto de estudos para o curso de Bacharelado em Tecnologia da Informacao da UNIVESP, com foco em revisao ativa por flashcards, simulados e suporte com IA Gemini.

## Descricao curta para o GitHub

Flashcards, quizzes e simulados da UNIVESP com tutor IA Gemini para revisar erros e acelerar os estudos.

## Sobre o projeto

Este repositorio centraliza materiais e uma aplicacao web interativa para estudo das disciplinas do curso.

Funcionalidades principais do app:

- Flashcards por materia
- Quiz com temporizador (Normal e Dificil)
- Simulado com questoes mistas
- Tutor IA com Gemini para duvidas e explicacoes
- Folha de formulas de Calculo I

Materias atualmente cobertas:

- Calculo I
- Algoritmos e Programacao (Python)
- Conceitos de Computacao

## Estrutura

```text
Estudos-UNIVESP/
|- univesp-app/                  # Aplicacao web (React + Vite)
|- docs/                         # Documentacao de planejamento e guias
|- prompt-calculo-gemini.md      # Prompt de tutor para Calculo I
|- prompt-computacao-gemini.md   # Prompt de tutor para Computacao
|- prompt-python-gemini.md       # Prompt de tutor para Python
|- SECURITY.md                   # Politica de seguranca
`- README.md                     # Visao geral do repositorio
```

## Como executar localmente

Pre-requisitos:

- Node.js 18+
- npm
- Chave de API do Gemini (Google AI Studio)

```bash
git clone git@github.com:pedrobragabes/Estudos-UNIVESP.git
cd Estudos-UNIVESP/univesp-app
npm install
```

Crie o arquivo de ambiente a partir do exemplo:

```bash
cp .env.local.example .env.local
```

Edite `.env.local` e defina:

```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

Inicie em desenvolvimento:

```bash
npm run dev
```

Build de producao:

```bash
npm run build
npm run preview
```

## Publicacao no GitHub (git)

Comandos recomendados para primeiro envio:

```bash
git init
git remote add origin git@github.com:pedrobragabes/Estudos-UNIVESP.git
git add .
git status
git commit -m "chore: publicar base do projeto Estudos UNIVESP"
git branch -M main
git push -u origin main
```

## Checklist rapido de seguranca antes do push

- Confirme que `.env.local` nao sera enviado
- Verifique se nao ha chave real em README, codigo ou commits
- Rode `npm audit` dentro de `univesp-app`
- Revise arquivos adicionados com `git status`

## Documentacao

- [Guia da documentacao](docs/README.md)
- [Roadmap](docs/ROADMAP.md)
- [Plano de seguranca](SECURITY.md)

## Licenca

Uso educacional e pessoal. Pode servir como referencia para outros estudantes.
