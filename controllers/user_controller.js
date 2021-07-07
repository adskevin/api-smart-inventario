const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const helper = require('../helpers/user_helper');

exports.list = (req, res) => {
    helper.checkRole(req.body);
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
  if(!req.decodedUser) return res.status(400).json({ error: "Bad request." });
  if(req.decodedUser && req.decodedUser.role) {
    if(req.decodedUser.role !== 'admin') {
      return res.status(400).json({ error: "Bad request." });
    }
  }
  next();
}