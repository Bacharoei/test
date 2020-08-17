const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getAllUsers,
  deleteUser,
  deleteAll,
} = require("../controller/users");

router.post("/signup", signup);
router.post("/login", login);
router.delete("/", deleteAll);
router.get("/", getAllUsers);

module.exports = router;
