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
//postgres://qpvswfridoytvt:19e712ce8d60843fb87cbde68f4f33cb550c6c068d1dd7caf8e72f3c78160125@ec2-52-71-231-37.compute-1.amazonaws.com:5432/d7e1bbgepam6lr"
