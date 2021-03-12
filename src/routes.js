const { Router } = require('express');
const multer = require('multer');

const parser = require('./config/upload');

const UserController = require('./Controllers/User');
const SessionController = require('./Controllers/Session');
const AvatarController = require('./Controllers/Avatar');
const FollowController = require('./Controllers/Follow');
const ProfileController = require('./Controllers/Profile');
const PostController = require('./Controllers/Post');
const FeedController = require('./Controllers/Feed');
const LikeController = require('./Controllers/Like');
const CommentController = require('./Controllers/Comment');

const ensureAuth = require('./middlewares/auth');

const routes = Router();

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
  parser.single('image'),
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
  parser.single('image'),
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

module.exports = routes;
