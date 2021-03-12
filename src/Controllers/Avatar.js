const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const uploadConfig = require('../config/upload');

const prisma = new PrismaClient();

exports.update = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: Number(req.userId) },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        image: true,
        bio: true,
        followedBy: true,
        following: true,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(req.userId),
      },
      data: {
        image: req.file.path,
        imageId: req.file.filename,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error.message);
  }
};
