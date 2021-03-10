import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

exports.list = async (req, res) => {
  const me = Number(req.userId);

  try {
    const profiles = await prisma.user.findMany({
      where: {
        AND: [
          {
            followedBy: {
              none: {
                id: me,
              },
            },
          },
          {
            id: {
              not: me,
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        followedBy: true,
        following: true,
      },
    });

    return res.status(200).json(profiles);
  } catch (error) {
    console.log(error.message);
  }
};

exports.index = async (req, res) => {
  const { username } = req.params;

  try {
    const profile = await prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        posts: {
          include: {
            comments: true,
          },
        },
        followedBy: true,
        following: true,
      },
    });

    return res.status(200).json(profile);
  } catch (error) {
    console.log(error.message);
  }
};
