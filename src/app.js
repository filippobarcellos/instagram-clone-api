const express,
  { Router } = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const routes = require('./routes');
const uploadConfig = require('./config/upload');

const prisma = new PrismaClient();
const app = express();
const routes = Router();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/files', express.static(uploadConfig.directory));

app.listen(process.env.PORT, () => console.log('server is running'));
