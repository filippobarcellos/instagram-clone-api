const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

exports.store = async (req, res) => {
  const { email, password } = req.body;

  const userExist = await prisma.user.findFirst({ where: { email } });

  if (userExist) {
    return res.status(401).json({ error: 'email already taken' });
  }

  const passwordHashed = await bcrypt.hash(password, 8);

  try {
    const newUser = await prisma.user.create({
      data: {
        ...req.body,
        password: passwordHashed,
      },
    });

    return res.status(200).json(newUser);
  } catch (error) {
    console.log(error.message);
  }
};

exports.list = async (req, res) => {
  try {
    // find users that I am not follow yet
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        image: true,
        bio: true,
        followedBy: true,
        following: true,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
  }
};

exports.index = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        image: true,
        bio: true,
        followedBy: true,
        following: true,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Profile does not exist.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
  }
};

exports.update = async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: Number(req.userId),
      },
      data: {
        ...req.body,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        username: true,
        bio: true,
        image: true,
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
  }
};
