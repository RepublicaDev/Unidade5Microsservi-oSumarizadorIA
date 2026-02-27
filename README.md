# 🚀 AI Summarizer Microservice (Unidade 5)

Este microserviço é uma API REST robusta desenvolvida em **Node.js** e **TypeScript**. Ele foi projetado para receber textos longos e gerar resumos concisos utilizando inteligência artificial de última geração (Llama 3 via Groq Cloud).

O projeto aplica conceitos de arquitetura limpa, validação de dados rigorosa com **Zod** e integração com APIs externas.

## 🛠️ Tecnologias Utilizadas

- **Node.js** (v22.12.0)
- **TypeScript** (Linguagem principal)
- **Express** (Framework web)
- **Groq SDK** (Interface com a IA)
- **Zod** (Validação de schemas e tipos)
- **Dotenv** (Gerenciamento de variáveis de ambiente)

---

## 🏗️ Arquitetura do Projeto

O código está organizado seguindo a separação de responsabilidades para facilitar a manutenção e escalabilidade:

```text
src/
├── routes/          # Definição de endpoints e lógica de entrada
├── services/        # Integrações com serviços externos (IA)
└── server.ts        # Inicialização do servidor Express