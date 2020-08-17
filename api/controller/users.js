const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  getAllUsers: (req, res) => {
    User.find()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        res.status(500).json({
          error,
        });
      });
  },

  deleteAll: (req, res) => {
    User.findOneAndDelete()
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((error) => {
        res.status(500).json({
          error,
        });
      });
  },

  deleteUser: (req, res) => {
    const userId = req.params._id;
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }
      })
      .then(() => {
        User.deleteOne({ _id: userId })
          .then(() => {
            res.status(200).send({
              message: "user deleted",
            });
          })
          .catch((error) => {
            res.status(500).json({
              error,
            });
          });
      });
  },

  signup: (req, res) => {
    const { email, password, username } = req.body;

    User.find({ email }).then((users) => {
      if (users.length >= 1) {
        return res.status(409).json({
          message: "Email exists",
        });
      }

      bcrypt.hash(password, 10, (error, hash) => {
        if (error) {
          return res.status(500).json({
            error,
          });
        }

        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email,
          password: hash,
          username,
        });

        user
          .save()
          .then((result) => {
            console.log(result);

            res.status(200).json({
              message: "User created",
            });
          })
          .catch((error) => {
            res.status(500).json({
              message: error.message,
            });
          });
      });
    });
  },

  login: (req, res) => {
    const { email, password } = req.body;

    User.find({ email }).then((users) => {
      if (users.length === 0) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      const [user] = users;

      bcrypt.compare(password, user.password, (error, result) => {
        if (error) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }

        if (result) {
          const token = jwt.sign(
            {
              id: user._id,
              email: user.email,
            },
            "API-Prot",
            {
              expiresIn: "1H",
            }
          );

          return res.status(200).json({
            result,
            token,
            email,
            message: "Auth successful",
          });
        }

        res.status(401).json({
          message: "Auth failed",
        });
      });
    });
  },
};
