const express = require('express');
const {getArticleByID, patchArticleByID, getAllArticles, getArticleCommentsByID} = require('./controllers/articleController');
const {getTopics} = require('./controllers/topicsController');
const {getAllUsers} = require('./controllers/userController');
const {
  handlePSQLErrors,
  handle500Errors,
  handleCustomErrors
} = require("./errors/errors");

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/users', getAllUsers);
app.get('/api/articles/', getAllArticles);
app.get('/api/articles/:id', getArticleByID);
app.get('/api/articles/:id/comments', getArticleCommentsByID);
app.patch('/api/articles/:id', patchArticleByID);



app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Page Not Found" });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);


module.exports = app;