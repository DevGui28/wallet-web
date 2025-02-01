# Sábio Financeiro - Frontend

Este repositório contém o código-fonte do **frontend** do **Sábio Financeiro**, uma plataforma de gerenciamento financeiro pessoal. O frontend foi desenvolvido utilizando **Next.js** e **useQuery**, proporcionando uma experiência de usuário rápida e responsiva.

---

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização do lado do servidor (SSR) e geração estática (SSG).
- **useQuery**: Gerenciamento de requisições e cache de dados.
- **Tailwind CSS**: Estilização rápida e responsiva.
- **React Hook Form**: Validação e gerenciamento de formulários.
- **Axios**: Cliente HTTP para comunicação com o backend.

---

## Funcionalidades Principais

- **Autenticação:** Páginas de login e registro integradas com o backend.
- **Dashboard:** Visualização de resumo financeiro e gráficos.
- **Gerenciamento de Transações:** Adição, edição e exclusão de despesas e receitas.
- **Relatórios:** Visualização de relatórios detalhados.
- **Responsividade:** Design adaptável para diferentes dispositivos.

---

## Como Executar o Projeto

### Pré-requisitos

- **Node.js** (v18 ou superior)
- **Git**

### Passos para Configuração

1. **Clone o repositório:**

   ```bash
   git clone git@github.com:feroddev/wallet-web.git
   cd wallet-web
   ```

2. **Instale as dependências:**

   ```bash
   yarn install
   ```

3. **Configure as variáveis de ambiente:**

   - Crie um arquivo `.env.local` na raiz do projeto (use o `.env.example` como modelo).

4. **Inicie o servidor de desenvolvimento:**

   ```bash
   yarn dev
   ```

5. **Acesse a aplicação:**
   - O frontend estará disponível em `http://localhost:3000`.

---

## Estrutura do Projeto

```
wallet-web/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   ├── pages/             # Páginas da aplicação
│   ├── hooks/             # Hooks personalizados
│   ├── services/          # Integração com a API do backend
│   └── utils/             # Funções utilitárias
├── .env.example           # Exemplo de variáveis de ambiente
├── next.config.js         # Configurações do Next.js
└── README.md              # Este arquivo
```
