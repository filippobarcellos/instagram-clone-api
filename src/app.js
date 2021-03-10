import express, { Router } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import routes from './routes';
import uploadConfig from './config/upload';

const prisma = new PrismaClient();
const app = express();
const routes = Router();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/files', express.static(uploadConfig.directory));

app.listen(3333, () => console.log('server is running'));
