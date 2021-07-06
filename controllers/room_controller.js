const User = require('../models/user');
const Room = require('../models/room');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

exports.createRoom = async (roomInfo) => {
    return await User.findOne({
        email: roomInfo.email
    }).then(async (user) => {
        user.password = "";
        const room = new Room({
            name: 'Sala de ' + roomInfo.email,
            owner: user,
            code: roomInfo.code
        }).populate('owner');
        return await room.save().then((room) => {
            return room;
        }).catch((err) => {
            return false;
        });
    }).catch((err) => {
        return false;
    });
};

exports.closeRoom = async (userId) => {
  if (userId) {
      try {
          let result = await Room.deleteMany({ owner: userId });
          console.log(result.deletedCount);
          return result.deletedCount;
      } catch (err) {
          return err;
      }
  }
}

exports.findRoom = async (code) => {
    if (code) {
        return await Room.findOne({
            code: code
        }).populate('owner').then((room) => {
            room.owner.password = "";
            return room;
        }).catch((err) => {
            return false;
        });
    }
}

exports.joinRoom = async (msg) => {
    if (msg.code) {
        try {
            // let room = await Room.findOneAndUpdate({ code: msg.code }, { $push: { participants: msg.userId } }).populate('owner').populate('participants');
            let room = await Room.findOne({ code: msg.code });
            room.participants.push(msg.userId);
            await room.save();
            room = await Room.findOne({ code: msg.code }).populate('owner').populate('participants');
            console.log('updated room');
            console.log(room);
            room.owner.password = '';
            const result = {
                from: msg.activeSocketId,
                to: room.owner.activeSocketId,
                offer: msg.offer,
                room: room
            }
            return result;
        } catch (err) {
            return err;
        }
    }
}

exports.leaveRoom = async (userId) => {
    console.log(userId);
    const room = await Room.findOne({ participants: { $elemMatch: {$eq: userId} } })
    console.log(room);
    if(room) {
      const index = room.participants.indexOf(userId);
      if (index > -1) {
        room.participants.splice(index, 1);
        await room.save();
        return room;
      }
    }
    return false;
}

exports.getRoomByUserId = async (userId) => {
  if(!userId) {
    return false;
  }
  console.log('roombyuser');
  console.log(userId);
  const room = await Room.findOne({ owner: userId }).populate('participants');
  if(!room) {
    return false;
  }
  return room
}

exports.getPopulatedRoom = async (roomCode) => {
  let room = await Room.findOne({ code: roomCode }).populate('participants').populate('owner');
  return room;
}


// const servers = {
//     iceServers: [
//       {
//         urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
//       },
//     ],
//     iceCandidatePoolSize: 10,
// };
// exports.registerUser = (req, res) => {
//     if (req.body && req.body.email && req.body.password) {
//         bcrypt.hash(req.body.password, 10, function(err, hashedPassword) {
//             if (err) return res.status(400).send("Bad request");
//             User.create({
//                 email: req.body.email,
//                 password: hashedPassword
//             }, (err, user) => {
//                 if (err) return console.log(err);
//                 user.password = "";
//                 return res.status(200).send(user);
//             });
//         });
//     } else {
//         return res.status(400).send("Bad request");
//     }
// }