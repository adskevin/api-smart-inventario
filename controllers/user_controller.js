const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helper = require('../helpers/user_helper');

exports.list = (req, res) => {
    User.find({},(err, users) => {
        if (err) {
            res.status(500).json(err);
        }
        res.json(users);
    });
}

exports.findUser = (req, res) => {
    if (req.query && req.query.name) {
        const userParam = req.query.name;
        User.findOne({ name: userParam }, (err, user) => {
            if (err) {
                res.status(500).json(err);
            }
            if (user) {
                user.password = "";
                res.json(user);
            } else {
                res.status(400).json({ error: "Bad request." });
            }
        });
    }
}

exports.deleteById = (req, res) => {
    if (req.params && req.params.id) {
        User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
            if (err) {
                return res.status(500).json(err);
            }
            if (!user) {
              return res.status(400).json({ error: "User does not exists" });
            }
            return res.status(200).json(user);
        })
    } else {
        return res.status(400).json({ error: "No params received" });
    }
}

exports.putById = (req, res) => {
    console.log(req.body);
    if (req.params && req.params.id) {
        if (req.body) {
            User.findOne({ _id: req.params.id }, (err, user) => {
                if (err) {
                    return res.status(500).json(err);
                }
                if (!user) {
                  return res.status(400).json({ error: "User does not exists" });
                }
                if (req.body.name) {
                  user.name = req.body.name;
                }
                if (req.body.role) {
                  user.role = req.body.role;
                }
                user.save();
                return res.status(200).json(user);
            })
        } else {
            return res.status(400).json({ error: "No params received" });
        }
    }
}

exports.registerUser = (req, res) => {
    if (req.body && helper.verifyFields(req.body)) {
        bcrypt.hash(req.body.password, 10, function(err, hashedPassword) {
            if (err) return res.status(400).json({ error: "Bad request" });
            User.create({
                name: req.body.name,
                password: hashedPassword,
                email: req.body.email,
                role: 'user'
            }, (err, user) => {
                if (err) {
                  console.log(err);
                  return res.status(400).json({ error: "Bad request. Too few arguments." });
                }
                user.password = "";
                return res.status(200).json(user);
            });
        });
    } else {
        return res.status(400).json({ error: "Bad request. Too few arguments." });
    }
}

exports.validateField = async (req, res) => {
  if(!req.body) return res.status(400).json({ error: "Bad request." });
  if(req.body.login && req.body.login !== '') {
    try {
      const user = await User.findOne({ login: req.body.login });
      if (!user) {
        return res.json({ isFieldValid: true });
      }
      return res.json({ isFieldValid: false });
    } catch (err) {
      console.log(err);
    }
  }
  if(req.body.email && req.body.email !== '') {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.json({ isFieldValid: true });
      }
      return res.json({ isFieldValid: false });
    } catch (err) {
      console.log(err);
    }
  }
  return res.status(400).json({ error: "Bad request." });
}

exports.checkRole = async (req, res, next) => {
  if(!req.decodedUser) return res.status(400).json({ error: "Bad request. (role)" });
  if(req.decodedUser && req.decodedUser.role) {
    if(req.decodedUser.role !== 'admin') {
      if (req.method !== "PUT") {
        return res.status(400).json({ error: "Bad request." });
      }
      if (req.params && req.params.id && (req.decodedUser._id !== req.params.id)) {
        return res.status(401).json({ error: "Unauthorized." });
      }
      if (req.body.role && req.body.role === "admin") {
        return res.status(401).json({ error: "Unauthorized. You can not make yourself an Administrator" });
      }
    }
  }
  next();
}