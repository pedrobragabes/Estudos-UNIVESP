# UNIVESP Study App

Plataforma de estudos interativa para alunos da UNIVESP, com flashcards, quizzes, simulados e tutor com IA (Google Gemini).

## Funcionalidades

- **Flashcards** — revisão rápida por matéria
- **Quiz** — múltipla escolha com temporizador (modos Normal e Difícil)
- **Simulado** — 15 questões mistas com tempo
- **Tutor IA** — chat com Google Gemini para tirar dúvidas
- **Folha de Fórmulas** — referência rápida de COM150

## Matérias

- Fundamentos Matemáticos para Computação (COM150 - Turma 004)
- Fundamentos de Internet e Web (COM130 - Turma 004)
- Algoritmos e Programação de Computadores II (COM120 - Turma 004)

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm (incluso com o Node.js)
- Chave de API do Google Gemini ([obter aqui](https://aistudio.google.com/app/apikey))

### Instalação

```bash
# Entre na pasta do projeto
cd univesp-app

# Instale as dependências
npm install
```

### Configurar a chave da API

Crie o arquivo `.env.local` na raiz de `univesp-app/`:

```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

> O arquivo `.env.local` já está no `.gitignore` — sua chave não será versionada.

### Rodar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173) no navegador.

### Build para produção

```bash
npm run build
npm run preview   # para visualizar o build
```

## Atalhos de teclado

| Tecla | Ação |
|-------|------|
| `Espaço` | Virar flashcard |
| `→` | Próximo card |
| `←` | Card anterior |

## Tecnologias

- React 18 + Vite
- Google Generative AI (Gemini)
- Armazenamento local (localStorage) para progresso
