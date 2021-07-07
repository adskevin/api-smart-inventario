const Category = require('../models/category');

exports.list = (req, res) => {
  Category.find({},(err, categories) => {
      if (err) {
          res.status(500).json(err);
      }
      res.json(categories);
  });
}

exports.create = (req, res) => {
  if (req.body && req.body.description) {
      Category.create({
          description: req.body.description
      }, (err, category) => {
          if (err) {
            console.log(err);
            return res.status(400).json({ error: "Bad request. Too few arguments." });
          }
          return res.status(200).json(category);
      });
  } else {
      return res.status(400).json({ error: "Bad request. Too few arguments." });
  }
}

exports.deleteById = (req, res) => {
  if (req.params && req.params.id) {
      Category.findOneAndDelete({ _id: req.params.id }, (err, category) => {
          if (err) {
              return res.status(500).json(err);
          }
          if (!category) {
            return res.status(400).json({ error: "Category does not exist" });
          }
          return res.status(200).json(category);
      })
  } else {
      return res.status(400).json({ error: "No params received" });
  }
}

exports.putById = (req, res) => {
  if (req.params && req.params.id) {
      if (req.body) {
          Category.findOne({ _id: req.params.id }, (err, category) => {
              if (err) {
                  return res.status(500).json(err);
              }
              if (!category) {
                return res.status(400).json({ error: "Category does not exist" });
              }
              if (!req.body.description) {
                return res.status(400).json({ error: "Invalid parameter" });
              }
              category.description = req.body.description;
              category.save();
              return res.status(200).json(category);
          })
      } else {
          return res.status(400).json({ error: "No params received" });
      }
  }
}