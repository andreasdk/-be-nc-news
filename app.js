const express = require('express');
const {getArticleByID} = require('./controllers/articleController');
const {getTopics} = require('./controllers/topicsController');
const {
  handlePSQLErrors,
  handle500Errors,
  handleCustomErrors
} = require("./errors/errors");

const app = express();
// app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles/:id', getArticleByID);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Page Not Found" });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);


module.exports = app;