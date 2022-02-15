const {selectArticleByID, patchArticleModel} = require('../models/articleModels.js');


exports.getArticleByID = (req, res, next) => {
  const { id }  = req.params;
  selectArticleByID(id).then((article) => {
    res.status(200).send({ article });
  })
  .catch(next);
};

exports.patchArticleByID = (req, res, next) => {
  const body = req.body;
  const { id }  = req.params;

  patchArticleModel(id, body).then((article) => {
    res.status(201).send({ article });
  })
  .catch(next);
};