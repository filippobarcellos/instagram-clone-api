const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.follow = async (req, res) => {
  const userLogged = Number(req.userId);
  const { id } = req.params;

  try {
    await prisma.user.update({
      where: {
        id: userLogged,
      },
      data: {
        following: {
          connect: {
            id: Number(id),
          },
        },
      },
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error.message);
  }
};

exports.unfollow = async (req, res) => {
  const userLogged = Number(req.userId);
  const { id } = req.params;

  try {
    await prisma.user.update({
      where: {
        id: userLogged,
      },
      data: {
        following: {
          disconnect: {
            id: Number(id),
          },
        },
      },
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error.message);
  }
};
