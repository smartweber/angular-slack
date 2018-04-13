const User = require('../api/user/model');

const userObjects = [
  { 
    username: 'alices',
    email: 'alice@cc.cc',
    password: 'Pass123!',
  },
  { 
    username: 'bobs',
    email: 'bob@cc.cc',
    password: 'Pass123!',
  },
  { 
    username: 'chriss',
    email: 'chris@cc.cc',
    password: 'Pass123!',
  }
];

if (process.env.NODE_ENV === 'development' || 
    process.env.NODE_ENV  === 'testing') {
  User.count({}, (err, count) => {
    if (count < 1) {
      userObjects.forEach((r) => {
        const newUser = new User({
          username: r.username,
          email: r.email,
          password: r.password
        });
        newUser.save();
      });
      console.log('User Seed Done');
    }
  });
}
