import { z } from 'zod';

export const summarizeSchema = z.object({
  text: z.string()
    .min(50, 'O texto deve ter pelo menos 50 caracteres'),
  maxSentences: z.number()
    .int()
    .min(1)
    .max(5)
    .default(3)
    .optional()
});