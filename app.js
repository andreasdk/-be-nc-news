const express = require('express');
const {getArticleByID} = require('./controllers/articleController');
const {getTopics} = require('./controllers/topicsController');
const {
  handle500Errors,
} = require("./errors/errors");

const app = express();
// app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles/:id', getArticleByID);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Page Not Found" });
});

app.use(handle500Errors);

module.exports = app;