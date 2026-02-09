import express, { type Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {customerRoutes, accountRoutes} from './routes';

dotenv.config();

const app: Express = express();

// Middlewares to control the flow of data
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/accounts', accountRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`🎸 Servidor corriendo en puerto ${PORT}`);
});