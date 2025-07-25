// routes/post.routes.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// Editor or admin can create and update
router.post("/", auth, authorize("editor"), postController.createPost);
router.put(
  "/:id",
  auth,
  authorize("editor", "admin"),
  postController.updatePost
);
router.delete("/:id", auth, authorize(["editor"]), postController.deletePost);
router.get(
  "/single/:id",
  auth,
  authorize(["editor"]),
  postController.getSinglePostById
);

// Anyone can view posts
router.get("/", auth, authorize(["editor"]), postController.getAllPosts);
router.get("/all", postController.getPosts);

module.exports = router;
