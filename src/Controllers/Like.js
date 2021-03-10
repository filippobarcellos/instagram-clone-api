import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

exports.create = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(req.userId),
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'User does not exist.' });
    }

    const post = await prisma.post.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        likes: true,
      },
    });

    const postAlreadyLikedByUser = post.likes
      .map((p) => p.userId)
      .includes(req.userId);

    const likesCount = post.likesCount;

    if (postAlreadyLikedByUser) {
      return res.status(400).json({ error: 'User already liked the post.' });
    }

    await prisma.like.create({
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
      },
    });

    await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        likesCount: likesCount + 1,
      },
    });

    return res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: Number(req.userId),
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'User does not exist.' });
    }

    const post = await prisma.post.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        likes: true,
      },
    });

    const likesCount = post.likesCount;

    const like = await prisma.like.findFirst({
      where: {
        AND: [
          {
            user: {
              id: Number(req.userId),
            },
          },
          {
            post: {
              id: Number(id),
            },
          },
        ],
      },
    });

    if (!like) {
      return res
        .status(400)
        .json({ error: 'User has not liked the post yet.' });
    }

    await prisma.like.delete({
      where: {
        id: like.id,
      },
    });

    await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        likesCount: likesCount - 1,
      },
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error.message);
  }
};
