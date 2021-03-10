import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

exports.store = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: Number(req.userId) },
    });

    if (!user) {
      return res.status(401).json({ error: 'user does not exist' });
    }

    const newPost = await prisma.post.create({
      data: {
        ...req.body,
        image: req.file.filename,
        user: {
          connect: {
            id: Number(req.userId),
          },
        },
      },
    });

    return res.status(200).json(newPost);
  } catch (error) {
    console.log(error.message);
  }
};

exports.index = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
  }
};
