const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const key = require('../keys/key');
const tourRouter = require('../routes/tours');
const userRouter = require('../routes/users');

mongoose.set('useCreateIndex', true);

const morgan = require('morgan');

const app = express();

const PORT = process.env.PORT || 8081;

app.use(morgan('combined'));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS, DELETE');
  res.header('Access-Control-Allow-Headers',
      'Authorization, auth-token, Origin, X-Requested-With, Content-Type, Accept, token');
next();
});

app.use('/tours', tourRouter);
app.use('/user', userRouter);

app.get('/', (req,res)=> {
  res.send('welcome');
});

mongoose.connect(key, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}, (err, database) => {
  if (err) {
    console.log(err);
  }
})
    .then(() => console.log('db connected...'))
    .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log('server started');
});

