const express = require('express');
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
var port = 3001;
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
  if (process.env.PORT) {
    port = process.env.PORT;
  }
  console.log("app listening on http://localhost:" + port);
});