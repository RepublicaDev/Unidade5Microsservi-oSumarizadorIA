import express from 'express';
import summarizeRouter from './routes/summarize';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Definindo que todas as rotas do summarizeRouter comecem com /sumarizar
app.use('/sumarizar', summarizeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor ON em http://localhost:${PORT}`));