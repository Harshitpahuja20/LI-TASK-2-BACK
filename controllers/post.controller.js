const Post = require("../models/post.model");
const logActivity = require("../utils/logger");

exports.createPost = async (req, res) => {
  const { title, content } = req.body;

  try {
    const post = await Post.create({
      title,
      content,
      createdBy: req.user.id,
    });

    // 🔒 Log post creation
    await logActivity({
      action: "POST_CREATED",
      userId: req.user.id,
      targetPostId: post._id,
      details: `Post titled "${title}" created.`,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating post" });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const oldTitle = post.title;
    const oldContent = post.content;

    post.title = title;
    post.content = content;
    await post.save();

    // 🔒 Log post update
    await logActivity({
      action: "POST_UPDATED",
      userId: req.user.id,
      targetPostId: post._id,
      details: `Post updated. Title: "${oldTitle}" → "${title}", Content changed.`,
    });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error updating post" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.user?.id }).populate(
      "createdBy",
      "email role"
    );
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const user = await Post.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Log activity
    setImmediate(() => {
      logActivity({
        action: "Post_DELETED",
        userId: req.user.id, // admin who changed
        targetUserId: req.params.id, // user who got changed
        details: `Post Deleted By Admin`,
      });
    });

    res.status(200).json({
      message: "Post Deleted",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getSinglePostById = async (req, res) => {
  try {
    console.log(req.params.id);
    const user = await Post.findById(req.params.id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post fetched",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "createdBy",
      "name email role"
    );
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};
