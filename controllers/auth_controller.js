const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const stunServers = [ process.env.STUN1, process.env.STUN2 ];

exports.auth = (req, res) => {
  console.log(req.body);
    if (req.body && req.body.email && req.body.password) {
        const password = req.body.password
        const email = req.body.email;
        User.findOne({ email: email }, (err, user) => {
            if (err) return res.status(500).send(err);
            if (user != null) {
                const valid = bcrypt.compareSync(password, user.password);
                if(user && valid){
                    const token = jwt.sign({
                        id: user.id,
                        email: user.email
                    }, process.env.SECRET_KEY );
                    // }, process.env.SECRET_KEY, { expiresIn: "1h" });
                    user.password = undefined;
                    res.status(201).send({ token, user, stunServers });
                }
                else {
                    res.status(401).json({ error: "Invalid credentials" });
                }
            } else {
                res.status(400).json({ error: 'User not found' });
            }
        });
    } else {
        return res.status(500).send(err);
    }
}

exports.isTokenValid = (req, res, next) => {
    const token = req.get("x-auth-token");
    if (!token) {
        res.status(401).send("No token");
    }
    else {
        jwt.verify(token, process.env.SECRET_KEY, (err, tokenInfo) => {
            if (err) {
                res.status(200).json({ isTokenValid: false });
            }
            else {
                req.id = tokenInfo.id;
                req.isUser = tokenInfo.user;
                res.status(200).json({ isTokenValid: true });
            }
        })
    }
}
