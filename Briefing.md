# 📌 Projeto Prático — Microserviço com IA (API de Sumarização)
## IAP – M3 U5 **Projeto de consolidação do módulo**

---

## 🧠 Contexto do Projeto

Este projeto tem como objetivo **consolidar os conhecimentos do módulo** por meio da construção de um **microserviço com IA**, seguindo **o mesmo formato, lógica e fluxo** utilizados no projeto de **Classificação de Feedbacks (Unidade 2)**.

A principal diferença está **apenas no caso de uso**:
- 🔁 **Unidade 2:** Feedback → Classificação de sentimento  
- 🔁 **Unidade 5:** Texto longo → Sumarização  

Ou seja:  
👉 **A estrutura do projeto é a mesma**  
👉 **A lógica de integração com a IA é a mesma**  
👉 **O padrão de API REST é o mesmo**  

O foco aqui **não é aprender algo novo do zero**, mas **aplicar com autonomia** o que já foi visto.

---

## 🎯 Objetivo

Desenvolver um **microserviço funcional** que:
1. Exponha um endpoint **RESTful**
2. Receba dados via **POST**
3. Valide a entrada
4. Faça uma chamada a uma **API de LLM (IA)**
5. Trate a resposta da IA
6. Retorne um **JSON estruturado**

---

## 🧩 Escopo do Projeto

### Tema
**API de Sumarização de Texto**

### Endpoint
`POST /sumarizar`

### Entrada (JSON)
```json
{
  "text": "Texto longo que será resumido...",
  "maxSentences": 3
}
```

### Regras de validação
- `text`: obrigatório | string | mínimo de 50 caracteres
- `maxSentences`: opcional | número entre 1 e 5 | valor padrão: 3

### 📤 Saída esperada (JSON)
```json
{
  "summary": "Resumo gerado pela IA.",
  "meta": {
    "maxSentences": 3,
    "model": "gemini",
    "characters": 1200
  }
}
```

---

## 🔄 Comparação com o Projeto da Unidade 2

| Característica | Unidade 2 – Feedback | Unidade 5 – Sumarização |
|---|---|---|
| Entrada | Recebe feedback | Recebe texto longo |
| Ação | Classifica sentimento | Resume conteúdo |
| Prompt | Prompt estruturado | Prompt estruturado |
| Saída | Retorno em JSON | Retorno em JSON |
| Endpoint | POST | POST |
| Validação | Zod / Manual | Zod / Manual |

👉 **A arquitetura e o fluxo são os mesmos. Muda apenas o objetivo do prompt.**

---

## 🛠️ Tecnologias sugeridas

Você pode usar as mesmas ferramentas já utilizadas anteriormente:
- Node.js
- Express
- Zod (validação)
- Dotenv
- API do Gemini (Google Generative AI)

---

## 🔐 Variáveis de ambiente

Crie um arquivo `.env`:

```
GEMINI_API_KEY=SUA_CHAVE_AQUI
PORT=3000
```

---

## 🤖 Integração com IA (LLM)

A chamada à IA deve seguir o mesmo padrão já trabalhado:
1. Enviar um prompt claro.
2. Controlar o formato da resposta.
3. Tratar a saída antes de devolver ao cliente.

---

## 🧠 Exemplo de Prompt Base

```
Você é um assistente de sumarização. Resuma o texto abaixo em no máximo {maxSentences} frases.

Regras:
- Não invente fatos.
- Não adicione introduções como "Aqui está o resumo".
- Retorne apenas o resumo.

Texto: {texto}
```

---

## 📋 Exemplo de Estrutura do Projeto

```
projeto-sumarizacao/
├── src/
│   ├── server.ts
│   ├── routes/
│   │   └── summarize.ts
│   ├── services/
│   │   └── aiService.ts
│   └── schemas/
│       └── validation.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## 💻 Exemplo de Código - Validação com Zod

```typescript
import { z } from 'zod';

export const summarizeSchema = z.object({
  text: z.string()
    .min(50, 'Text must have at least 50 characters'),
  maxSentences: z.number()
    .int()
    .min(1)
    .max(5)
    .default(3)
    .optional()
});

export type SummarizeRequest = z.infer<typeof summarizeSchema>;
```

---

## 💻 Exemplo de Código - Serviço de IA

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function summarizeText(text: string, maxSentences: number = 3): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const prompt = `Você é um assistente de sumarização. Resuma o texto abaixo em no máximo ${maxSentences} frases.

Regras:
- Não invente fatos.
- Não adicione introduções como "Aqui está o resumo".
- Retorne apenas o resumo.

Texto: ${text}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  return response.text();
}
```

---

## 💻 Exemplo de Código - Rota Express

```typescript
import express, { Request, Response } from 'express';
import { summarizeSchema } from '../schemas/validation';
import { summarizeText } from '../services/aiService';

const router = express.Router();

router.post('/sumarizar', async (req: Request, res: Response) => {
  try {
    // Validação
    const { text, maxSentences } = summarizeSchema.parse(req.body);
    const sentencesCount = maxSentences || 3;

    // Chamada à IA
    const summary = await summarizeText(text, sentencesCount);

    // Resposta estruturada
    res.json({
      summary,
      meta: {
        maxSentences: sentencesCount,
        model: 'gemini',
        characters: text.length
      }
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

---

## 🧪 Testes

Exemplo de teste utilizando cURL:

```bash
curl -X POST http://localhost:3000/sumarizar \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"O aprendizado de máquina é um subcampo da inteligência artificial que permite aos computadores aprender a partir de dados sem serem explicitamente programados. Ele é amplamente utilizado em diversas áreas da tecnologia atual.\",\"maxSentences\":1}"
```

**Resposta esperada:**
```json
{
  "summary": "O aprendizado de máquina é um subcampo da inteligência artificial que permite aos computadores aprender a partir de dados, sendo amplamente utilizado em diversas áreas da tecnologia atual.",
  "meta": {
    "maxSentences": 1,
    "model": "gemini",
    "characters": 213
  }
}
```

---

## 🚀 Como Rodar o Projeto

1. **Instalar dependências:**
```bash
npm install
```

2. **Criar arquivo `.env`:**
```
GEMINI_API_KEY=sua_chave_aqui
PORT=3000
```

3. **Rodar o servidor:**
```bash
npm run dev
```

4. **Testar o endpoint:**
```bash
curl -X POST http://localhost:3000/sumarizar \
  -H "Content-Type: application/json" \
  -d '{"text":"Seu texto aqui com mais de 50 caracteres...","maxSentences":2}'
```

---

## 📦 Entrega

Você deve entregar:
- ✅ Código do microserviço funcional.
- ✅ README explicando como rodar e testar.
- ✅ Pelo menos 1 exemplo de teste do endpoint.
- ✅ Arquivo `.env.example` com as variáveis necessárias.

---

## ✅ Critérios de Avaliação

- ✅ API funciona corretamente.
- ✅ Entrada validada com erro 400 se necessário.
- ✅ Integração real com IA (Gemini).
- ✅ Resposta estruturada em JSON com metadados.
- ✅ Projeto segue o mesmo padrão da Unidade 2.
- ✅ Código limpo e bem documentado.
- ✅ Boa prática 🚀
