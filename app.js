const express = require('express');
const cors = require('cors');
const {getArticleByID, patchArticleByID, getAllArticles, getArticleCommentsByID, postCommentById, removeCommentByID} = require('./controllers/articleController');
const {getTopics} = require('./controllers/topicsController');
const {getAllUsers} = require('./controllers/userController');
const {
  handlePSQLErrors,
  handle500Errors,
  handleCustomErrors
} = require('./errors/errors');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/topics', getTopics);
app.get('/api/users', getAllUsers);
app.get('/api/articles/', getAllArticles);
app.get('/api/articles/:id', getArticleByID);
app.get('/api/articles/:id/comments', getArticleCommentsByID);
app.post('/api/articles/:id/comments', postCommentById);
app.patch('/api/articles/:id', patchArticleByID);
app.delete('/api/comments/:comment_id', removeCommentByID);



app.all('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Page Not Found' });
});

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);


module.exports = app;