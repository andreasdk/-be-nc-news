const {selectArticleByID} = require('../models/articleModels.js');


exports.getArticleByID = (req, res, next) => {
  const { id }  = req.params;
  selectArticleByID(id).then((article) => {
    res.status(200).send({ article });
  })
  .catch(next);
};