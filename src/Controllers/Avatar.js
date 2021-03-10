import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import uploadConfig from '../config/upload';

const prisma = new PrismaClient();

exports.update = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: Number(req.userId) },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        posts: true,
        followedBy: true,
        following: true,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.avatar) {
      //remove previous
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      const userAvatar = await fs.promises.stat(userAvatarFilePath);

      if (userAvatar) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    await prisma.user.update({
      where: {
        id: Number(req.userId),
      },
      data: {
        image: req.file.filename,
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
  }
};