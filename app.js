const express = require('express');
const {getTopics} = require('./controllers/controllers');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);


app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'Error 404 - Route not found' });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Error 500 - Internal server error' });
  next();
});


module.exports = app;