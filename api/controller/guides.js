const mongoose = require("mongoose");
const Guides = require("../models/guideModel");

module.exports = {
  //create a signle Guide
  createGuide: async (req, res) => {
    const { path: image } = req.file;
    const { name, title, desc, category, featured } = req.body;
    const guide = new Guides({
      _id: new mongoose.Types.ObjectId(),
      name,
      title,
      desc,
      category,
      image,
      featured,
    });

    try {
      await guide.save();
      res.json(guide);
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  },

  // get all guides
  getAllGuides: (req, res) => {
    Guides.find()
      .then((guides) => {
        res.status(200).json(guides);
      })
      .catch((error) => {
        res.status(500).json({
          error,
        });
      });
  },

  //getSigneGuide

  getSingleGuide: (req, res) => {
    const guideId = req.params._id;

    Guides.findById(guideId)
      .then((guide) => {
        if (!guide) {
          return res.status(404).json({
            message: "guide not found",
          });
        }
        res.status(200).json(guide);
      })
      .catch((error) => {
        res.status(500).json({
          error,
          message: `can't find guide with id ${guideId}`,
        });
      });
  },

  updateGuide: (req, res) => {
    const guideId = req.params._id;
    Guides.findById(guideId)
      .then((guide) => {
        if (!guide) {
          return res.status(404).json({
            message: "Guide not found",
          });
        }
      })
      .then(() => {
        Guides.updateOne({ _id: guideId }, req.body)
          .then(() => {
            res.status(200).send({
              message: "updated",
            });
          })
          .catch((error) => {
            res.status(500).json({
              error,
            });
          });
      });
  },

  //deleteGuide

  deleteGuide: (req, res) => {
    const guideId = req.params._id;
    Guides.findById(guideId)
      .then((guide) => {
        if (!guide) {
          return res.status(404).json({
            message: "Guide not found",
          });
        }
      })
      .then(() => {
        Guides.deleteOne({ _id: guideId })
          .then(() => {
            res.status(200).send({
              message: "deleted",
            });
          })
          .catch((error) => {
            res.status(500).json({
              error,
            });
          });
      });
  },
};
