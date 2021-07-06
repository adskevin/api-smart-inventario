const express = require('express');
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const port = 3001;
var dbString = "";
var CodeGenerator = require('node-code-generator');
var generator = new CodeGenerator();
const { findRoom, createRoom, joinRoom, closeRoom, getRoomByUserId, getPopulatedRoom, leaveRoom } = require('./controllers/room_controller');
// const { getActiveRoom } = require('./controllers/user_controller');
const { setActiveSocket } = require('./controllers/user_controller');


try {
  let result = require('dotenv').config();
  if(result.error) {
    console.log(result.error);
  } else {
    dbString = process.env.MDB_CONN_STRING;
  }
} catch (error) {
  console.log('Erro ao carregar a dependência "dotenv" - ' + error);
}

//Importa Rotas
const authRoute = require('./routes/auth_route');
const registerRoute = require('./routes/register_route');
const userRoute = require('./routes/user_route');

// for parsing application/json
app.use(express.json());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// use a middleware for authentication in socket.io
io.use(function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
        jwt.verify(socket.handshake.query.token, process.env.SECRET_KEY, function(err, decoded) {
            if (err) {
                console.log('Authentication error');
                return next(new Error('Authentication error'));
            }
            socket.decoded = decoded;
            next();
        });
    }
    else {
        console.log('Authentication error');
        next(new Error('Authentication error'));
    }    
  })
  .on('connection', async (socket) => {
      await setActiveSocket(socket.decoded.id, socket.id);
      console.log(socket.decoded.email + ' connected');
      //Whenever someone disconnects this piece of code executed
      socket.on('disconnect', async () => {
        try {
          await setActiveSocket(socket.decoded.id, 'null');
          console.log(socket.decoded.email + ' disconnected');
        } catch {
          console.log('failed clearing socket id');
        }
      });

      socket.on('message', async (msg) => {
          if (msg.type) {
              let userId = socket.decoded.id;
              switch (msg.type) {
                  case 'create-room':
                      console.log('create-room for the user: ' + socket.decoded.email);
                      // melhorar o gerador de códigos, para garantir não duplicados
                      let code = generator.generateCodes('###-###', 1)[0];
                      let roomInfo = {
                          email: socket.decoded.email,
                          owner: socket.decoded.email,
                          code: code
                      }
                      createRoom(roomInfo).then((room) => {
                          socket.emit('message', {
                            type: 'room-created',
                            room: room
                          });
                      });
                      break;
                  case 'room-close': {
                      console.log('room-close');
                      console.log('room-close for the user: ' + socket.decoded.email);
                      // console.log(socket.decoded);
                      // console.log(msg);
                      let room = await getRoomByUserId(userId);
                      console.log(room);
                      if(!room) {
                        return false;
                      }
                      room.participants.map(element => {
                        console.log(element);
                        socket.broadcast.to(element.activeSocketId).emit('message', {
                          type: 'room-close'
                        });
                      });
                      closeRoom(userId);
                      break;
                  }
                  case 'join-room-request':
                      console.log('join-room-request');
                      msg.userId = userId;
                      msg.activeSocketId = socket.id;
                      let result = await joinRoom(msg);
                      await notifyAll(msg, socket);
                      const roomOwner = result.to;
                      await socket.broadcast.to(roomOwner).emit('message', {
                        type: 'join-room-request',
                        from: socket.id,
                        roomOwnerId: roomOwner,
                        room: result.room
                      });
                      break;
                  case 'join-room-info':
                      console.log('join-room-info');
                      console.log(msg);
                      let room = await getPopulatedRoom(msg.roomCode);
                      console.log(room);
                      socket.broadcast.to(msg.offer.to).emit('message', {
                        type: 'join-room-info',
                        offer: msg.offer,
                        from: socket.id,
                        roomOwnerId: msg.to,
                        room: room
                      });
                      break;
                  case 'join-room-answer':
                      console.log('join-room-answer');
                      // console.log(msg);
                      socket.broadcast.to(msg.to).emit('message', {
                          type: 'join-room-answer',
                          answer: msg.answer,
                          from: socket.id,
                          roomOwnerId: msg.to
                      });
                      break;
                  case 'room-leave':
                      console.log('room-leave');
                      const leaveRoomResult = await leaveRoom(userId);
                      if(leaveRoomResult) {
                        await notifyAll(leaveRoomResult, socket);
                      }
                      break;
                  case 'iceCandidate':
                    // console.log('iceCandidate');
                    // console.log(msg);
                    socket.broadcast.to(msg.to).emit('message', {
                      type: 'iceCandidate',
                      iceCandidate: msg.iceCandidate
                    });
                    break;
                  default:
                      console.log('nothing to do');
              }
          }
      });
  })

  async function notifyAll(msg, socket) {
    console.log('notifyAll called');
    console.log(msg);
    let room = await getPopulatedRoom(msg.code);
    console.log(room);
    if(room) {
      await socket.broadcast.to(room.owner.activeSocketId).emit('message', {
        type: 'user-list-change',
        room: room
      });
      if(room.participants.length > 0) {
        console.log('send to participants');
        console.log('type user-list-change');
        console.log(room.code);
        console.log('');
        room.participants.forEach(async (element) => {
          console.log('to user');
          await socket.broadcast.to(element.activeSocketId).emit('message', {
            type: 'user-list-change',
            room: room
          });
        });
      }
    }
    console.log('end notify all');
  }

//Configuração do Mongoose
mongoose.connect(dbString, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(()=> {
    console.log('BD conectado');
  })
  .catch((error)=> {
    console.log('Error ao conectar ao BD');
  });
mongoose.Promise = global.Promise;

//Uso do CORS
app.use(cors());

//Test route
app.use('/welcome', (req, res) => {
  console.log('Welcome Sent');
  res.status(200).send({ text: 'welcome' });
})

//Uso das rotas
app.use('/auth', authRoute);
app.use('/register', registerRoute);
app.use('/users', userRoute);

http.listen(process.env.PORT || port, () => {
    console.log("app listening on http://localhost:" + port);
});