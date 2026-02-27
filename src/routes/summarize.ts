import { Router, Request, Response } from 'express';
import { summarizeText } from '../services/aiService';
import { z } from 'zod';

const router = Router();

const summarizeSchema = z.object({
  text: z.string().min(50, "O texto deve ter pelo menos 50 caracteres."),
  maxSentences: z.number().optional().default(3)
});

// Como o server.ts já usa app.use('/sumarizar', ...), aqui usamos apenas '/'
router.post('/', async (req: Request, res: Response) => {
  try {
    const { text, maxSentences } = summarizeSchema.parse(req.body);

    const summary = await summarizeText(text, maxSentences);

    return res.status(200).json({
      summary: summary,
      meta: {
        maxSentences: maxSentences,
        model: "llama3-8b-groq",
        characters: text.length
      }
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      // Corrigido: Zod usa .issues para listar os erros de validação
      return res.status(400).json({ error: error.issues });
    }

    console.error("Erro na rota:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      message: error.message 
    });
  }
});

export default router;