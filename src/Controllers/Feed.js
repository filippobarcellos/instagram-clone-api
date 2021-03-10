const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.list = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(req.userId),
      },
      include: {
        following: true,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    const usersFollowed = user.following.map((u) => u.id);

    const posts = await prisma.post.findMany({
      where: {
        userId: {
          in: usersFollowed,
        },
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

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error.message);
  }
};
