const Inventory = require('../models/inventory');

exports.list = (req, res) => {
  Inventory.find({},(err, inventories) => {
      if (err) {
          res.status(500).json(err);
      }
      res.json(inventories);
  });
}

exports.getById = (req, res) => {
  if (req.params && req.params.id) {
      Inventory.findOne({ _id: req.params.id }, (err, inventory) => {
          if (err) {
              return res.status(500).json(err);
          }
          if (!inventory) {
            return res.status(400).json({ error: "Inventory does not exist" });
          }
          return res.status(200).json(inventory);
      })
  } else {
      return res.status(400).json({ error: "No params received" });
  }
}

exports.create = (req, res) => {
  if (req.body) {
      Inventory.create(req.body, (err, inventory) => {
          if (err) {
            console.log(err);
            return res.status(400).json({ error: "Bad request. Too few arguments." });
          }
          return res.status(200).json(inventory);
      });
  } else {
      return res.status(400).json({ error: "Bad request. Too few arguments." });
  }
}

exports.deleteById = (req, res) => {
  if (req.params && req.params.id) {
      Inventory.findOneAndDelete({ _id: req.params.id }, (err, inventory) => {
          if (err) {
              return res.status(500).json(err);
          }
          if (!inventory) {
            return res.status(400).json({ error: "Inventory does not exist" });
          }
          return res.status(200).json(inventory);
      })
  } else {
      return res.status(400).json({ error: "No params received" });
  }
}

exports.putById = (req, res) => {
  if (req.params && req.params.id) {
      if (req.body) {
          Inventory.findOneAndUpdate({ _id: req.params.id }, req.body, (err, inventory) => {
              if (err) {
                  return res.status(500).json(err);
              }
              if (!inventory) {
                return res.status(400).json({ error: "Inventory does not exist" });
              }
              return res.status(200).json(inventory);
          });
      } else {
          return res.status(400).json({ error: "No params received" });
      }
  }
}