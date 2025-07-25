const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// GET /api/users → Only admin
router.post("/", auth, authorize(["admin"]), userController.AdminCreateUser);

router.get("/", auth, authorize(["admin"]), userController.AdminSearchUsers);

router.delete("/:id", auth, authorize(["admin"]), userController.deleteUser);

router.get("/:id", auth, authorize(["admin"]), userController.getSingleUserById);

router.put('/:id/role', auth, authorize(['admin']), userController.updateUser);

module.exports = router;
