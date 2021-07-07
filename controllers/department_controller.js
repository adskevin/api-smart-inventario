const Department = require('../models/department');

exports.list = (req, res) => {
  Department.find({},(err, departments) => {
      if (err) {
          res.status(500).json(err);
      }
      res.json(departments);
  });
}

exports.create = (req, res) => {
  if (req.body && req.body.description) {
      Department.create({
          description: req.body.description
      }, (err, department) => {
          if (err) {
            console.log(err);
            return res.status(400).json({ error: "Bad request. Too few arguments." });
          }
          return res.status(200).json(department);
      });
  } else {
      return res.status(400).json({ error: "Bad request. Too few arguments." });
  }
}

exports.deleteById = (req, res) => {
  if (req.params && req.params.id) {
      Department.findOneAndDelete({ _id: req.params.id }, (err, department) => {
          if (err) {
              return res.status(500).json(err);
          }
          if (!department) {
            return res.status(400).json({ error: "Department does not exist" });
          }
          return res.status(200).json(department);
      })
  } else {
      return res.status(400).json({ error: "No params received" });
  }
}

exports.putById = (req, res) => {
  if (req.params && req.params.id) {
      if (req.body) {
          Department.findOne({ _id: req.params.id }, (err, department) => {
              if (err) {
                  return res.status(500).json(err);
              }
              if (!department) {
                return res.status(400).json({ error: "Department does not exist" });
              }
              if (!req.body.description) {
                return res.status(400).json({ error: "Invalid parameter" });
              }
              department.description = req.body.description;
              department.save();
              return res.status(200).json(department);
          })
      } else {
          return res.status(400).json({ error: "No params received" });
      }
  }
}