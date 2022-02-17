const {selectArticleByID, patchArticleModel, selectAllArticles, selectArticleCommentsByID} = require('../models/articleModels.js');

exports.getAllArticles = (req, res, next) => {
  selectAllArticles().then((articles) => {
    res.status(200).send({ articles });
  })
  .catch(next);
};

exports.getArticleByID = (req, res, next) => {
  const { id }  = req.params;
  selectArticleByID(id).then((article) => {
    res.status(200).send({ article });
  })
  .catch(next);
};

exports.getArticleCommentsByID = (req, res, next) => {
  const { id }  = req.params;
  selectArticleCommentsByID(id).then((comments) => {
    res.status(200).send({ comments });
  })
  .catch(next);
};

exports.patchArticleByID = (req, res, next) => {
  const body = req.body;
  const votes = body.inc_votes;
  const { id }  = req.params;

  patchArticleModel(id, votes).then((article) => {
    res.status(201).send({ article });
  })
  .catch(next);
};