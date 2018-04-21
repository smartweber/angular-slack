const express = require('express');
const router = express.Router();
const User = require('../models/user');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Chat = require('../models/Chat.js');
server.listen(4000);

//POST register route
router.post('/register', function (req, res, next) {

  if (req.body.email &&
    req.body.username &&
    req.body.password) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    };

    User.create(userData, function (error, user) {
      if (error) {
        return res.status(401).json({ status: false, message: error });
      } else {
        delete user.password;
        return res.status(200).json({ status: true, user: user });
      }
    });

  } else {
    return res.status(400).json({ status: false, message: 'All fields required.' });
  }

});

//POST login route
router.post('/login', function (req, res, next) {

  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        return res.status(401).json({ status: false, message: 'Wrong email or password.' });
      } else {
        delete user.password;
        return res.status(200).json({ status: true, user: user });
      }
    });
  } else {
    return res.status(400).json({ status: false, message: 'All fields required.' });
  }

});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return res.status(401).json({ status: false, message: 'Fail to logout.' });
      } else {
        return res.status(200).json({ status: true, message: 'Success.' });
      }
    });
  }
});

// socket io
io.on('connection', function (socket) {
  console.log('User connected');
  socket.on('disconnect', function() {
    console.log('User disconnected');
  });
  socket.on('save-message', function (data) {
    console.log(data);
    io.emit('new-message', { message: data });
  });

  socket.on('keydown-event-raise', function (data) {
    console.log(data);
    io.emit('keydown-event-send', { name: data.name });
  });
});

/* GET ALL CHATS */
router.get('/allChats', function(req, res, next) {
  Chat.find({
    "updated_at": 
    {
      $gte: new Date((new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))
    }
  }, function (err, chats) {
    if (err) return next(err);
    res.json(chats);
  });
});

/* SAVE CHAT */
router.post('/saveChat', function(req, res, next) {
  Chat.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;