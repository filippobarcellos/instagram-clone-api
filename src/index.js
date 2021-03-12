const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const routes = require('./routes');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT, () => console.log('server is running'));
