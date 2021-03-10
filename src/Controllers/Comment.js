import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

exports.store = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'User does not exist.' });
    }

    const post = await prisma.post.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!post) {
      return res.status(400).json({ error: 'User does not exist.' });
    }

    const comment = await prisma.comment.create({
      data: {
        user: {
          connect: {
            id: Number(req.userId),
          },
        },
        post: {
          connect: {
            id: Number(id),
          },
        },
        text: req.body.text,
      },
    });

    return res.status(200).json(comment);
  } catch (error) {
    console.log(error.message);
  }
};
