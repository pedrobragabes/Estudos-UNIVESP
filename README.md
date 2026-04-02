# Estudos UNIVESP

Projeto de estudos para o curso de Bacharelado em Tecnologia da Informacao da UNIVESP, com foco em revisao ativa por flashcards, simulados e suporte com IA Gemini.

## Sobre o projeto

Este repositorio centraliza materiais e uma aplicacao web interativa para estudo das disciplinas do curso.

Funcionalidades principais do app:

- Flashcards por materia
- Quiz com temporizador (Normal e Dificil)
- Simulado com questoes mistas
- Tutor IA com Gemini para duvidas e explicacoes
- Folha de formulas de COM150

Materias atualmente cobertas:

- Fundamentos Matematicos para Computacao (COM150 - Turma 004)
- Fundamentos de Internet e Web (COM130 - Turma 004)
- Algoritmos e Programacao de Computadores II (COM120 - Turma 004)

## Estrutura

```text
Estudos-UNIVESP/
|- univesp-app/                  # Aplicacao web (React + Vite)
|- docs/                         # Documentacao de planejamento e guias
|- prompts/                      # Prompts de estudo para Gemini
|- pdfs/                         # Materiais em PDF das disciplinas
|- package.json                  # Scripts de execucao pela raiz
|- SECURITY.md                   # Politica de seguranca
`- README.md                     # Visao geral do repositorio
```

## Como executar localmente

Pre-requisitos:

- Node.js 18+
- npm
- Chave de API do Gemini (Google AI Studio)

1. Instale as dependencias do app pela raiz do repositorio:

```bash
npm run install:app
```

2. Crie o arquivo de ambiente a partir do exemplo:

```bash
Copy-Item univesp-app/.env.local.example univesp-app/.env.local
```

3. Edite `univesp-app/.env.local` e defina:

```env
VITE_GEMINI_API_KEY=sua_chave_aqui
```

4. Inicie em desenvolvimento:

```bash
npm run dev
```

5. Build de producao:

```bash
npm run build
npm run preview
```

Se preferir rodar direto na pasta do app:

```bash
cd univesp-app
npm install
npm run dev
```

## Se o site nao abrir

- Confirme que voce esta executando os comandos na raiz do repositorio ou dentro de `univesp-app`.
- Rode novamente `npm run install:app` para garantir dependencias instaladas.
- Verifique se a chave `VITE_GEMINI_API_KEY` foi configurada em `univesp-app/.env.local`.
- Confirme que a versao do Node.js e 18 ou superior.

## Documentacao

- [Guia da documentacao](docs/README.md)
- [Roadmap](docs/ROADMAP.md)
- [Plano de seguranca](SECURITY.md)

## Licenca

Uso educacional e pessoal. Pode servir como referencia para outros estudantes.
