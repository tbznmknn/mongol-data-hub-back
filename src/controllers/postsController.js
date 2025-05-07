const postService = require("../services/postsService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.createPost = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError("No image uploaded.", 400);
  }

  const imageUrl = req.file.filename;

  const post = req.body;

  const newPost = await postService.createPost(post, imageUrl, req.userId);
  res.status(201).json({ success: true, data: newPost });
});

exports.getPosts = catchAsync(async (req, res) => {
  const { posts, pagination } = await postService.getPosts(req.query);
  res.status(200).json({ success: true, data: posts, pagination });
});

exports.getPostDetail = catchAsync(async (req, res) => {
  const post = await postService.getPostDetail(req.params.id);
  res.status(200).json({ success: true, data: post });
});
exports.getUniquePost = catchAsync(async (req, res) => {
  const post = await postService.getUniquePost(req.params.type);
  res.status(200).json({ success: true, data: post });
});

exports.updatePost = catchAsync(async (req, res) => {
  const imageUrl = req.file ? req.file.filename : null;

  const post = req.body;

  const updatedPost = await postService.updatePost(
    req.params.id,
    post,
    imageUrl
  );
  res.status(200).json({ success: true, data: updatedPost });
});

exports.deletePost = catchAsync(async (req, res) => {
  await postService.deletePost(req.params.id);
  res.status(200).json({ success: true, message: "Post deleted successfully" });
});
