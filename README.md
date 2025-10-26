# Projeto de Testes - ServeRest

Este projeto contém testes automatizados End-to-End (E2E) e API para a aplicação [ServeRest](https://front.serverest.dev/), utilizando Cypress.

## 🚀 Tecnologias Utilizadas

* **Framework de Teste:** [Cypress](https://www.cypress.io/)
* **Geração de Dados:** [@faker-js/faker](https://fakerjs.dev/)
* **Relatórios de Teste:** [Cypress Mochawesome Reporter](https://github.com/LironEr/cypress-mochawesome-reporter)

---

## 📋 Pré-requisitos

Antes de começar, você precisará ter o [Node.js](https://nodejs.org/en/) (versão LTS recomendada) instalado em sua máquina.

---

## ⚙️ Instalação

1.  Clone este repositório:
    ```bash
    git clone https://github.com/jeffbarreto1/serverestCypress.git
    cd serverestCypress
    ```

2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```

---

## ▶️ Executando os Testes

Este projeto possui dois modos principais de execução.

### 1. Modo Interativo (Cypress Open)

Para abrir a interface gráfica do Cypress, executar testes individualmente e ver a execução em tempo real:

```bash
npx cypress open
```

### 1. Modo Headless (Cypress Run)

Para executar todos os testes em segundo plano (ideal para CI/CD) e gerar o relatório de testes:

```bash
npm test
```

## 📊 Visualizando o Relatório

Após a execução do comando ```npm test```, o relatório de testes em HTML será gerado automaticamente.

Abra o arquivo:

```bash
cypress/reports/mochawesome/index.html
```

## 🤖 Automação & CI/CD (GitHub Actions)

Este repositório utiliza um workflow de CI/CD (```.github/workflows/ci.yml```) para automatizar a execução dos testes.

O workflow é acionado automaticamente nos seguintes eventos:

1. Diariamente (Agendado): Executa todos os dias às 7:00 (Horário de Brasília / 10:00 UTC).

2. Push na main: Executa a cada push ou merge na branch principal (main).

3. Pull Request: Executa em toda abertura ou atualização de Pull Request apontado para a branch main (para garantir que novas alterações não quebram os testes).

Após a execução em eventos da branch main ou no agendamento, o workflow publica o relatório final do Mochawesome (com vídeos e screenshots) no GitHub Pages (```https://jeffbarreto1.github.io/serverestCypress/```) .
