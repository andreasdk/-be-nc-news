const {selectTopics, selectArticleByID} = require('../models/models.js');


exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
      res.status(200).send({ topics });
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