const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const prisma = new PrismaClient();

exports.store = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res
        .status(401)
        .json({ error: 'email or password does not match.' });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ error: 'email or password does not match.' });
    }

    const { id, username, image, fullName } = user;

    return res.status(200).json({
      user: {
        id,
        username,
        fullName,
        email,
        image,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  } catch (error) {
    console.log(error.message);
  }
};
