import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';

import UserController from './Controllers/User';
import SessionController from './Controllers/Session';
import AvatarController from './Controllers/Avatar';
import FollowController from './Controllers/Follow';
import ProfileController from './Controllers/Profile';
import PostController from './Controllers/Post';
import FeedController from './Controllers/Feed';
import LikeController from './Controllers/Like';
import CommentController from './Controllers/Comment';

import ensureAuth from './middlewares/auth';

const routes = Router();
const upload = multer(uploadConfig);

// Users
routes.post('/api/users', UserController.store);
routes.get('/api/users', ensureAuth, UserController.list);
routes.get('/api/users/:username', ensureAuth, UserController.index);
routes.put('/api/users', ensureAuth, UserController.update);

// Follow & Unfollow
routes.put('/api/users/:id/follow', ensureAuth, FollowController.follow);
routes.put('/api/users/:id/unfollow', ensureAuth, FollowController.unfollow);

// Avatar
routes.patch(
  '/api/users/avatar',
  ensureAuth,
  upload.single('image'),
  AvatarController.update
);

// Session
routes.post('/api/session', SessionController.store);

// Profile
routes.get('/api/profiles', ensureAuth, ProfileController.list);
routes.get('/api/profiles/:username', ensureAuth, ProfileController.index);

// Post
routes.post(
  '/api/posts',
  ensureAuth,
  upload.single('image'),
  PostController.store
);

routes.get('/api/posts/:id', ensureAuth, PostController.index);

// Feed
routes.get('/api/feed', ensureAuth, FeedController.list);

// Like
routes.post('/api/posts/:id/like', ensureAuth, LikeController.create);
routes.delete('/api/posts/:id/unlike', ensureAuth, LikeController.delete);

// Comment
routes.post('/api/posts/:id/comment', ensureAuth, CommentController.store);

export default routes;
