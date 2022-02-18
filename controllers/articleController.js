const {selectArticleByID, patchArticleModel, selectAllArticles, selectArticleCommentsByID, postCommentModel} = require('../models/articleModels.js');
const {checkUserExists, checkTopicExists} = require('../models/utils')


exports.getAllArticles = (req, res, next) => {
	const { sort_by, order, topic } = req.query

	return Promise.all([
		selectAllArticles(sort_by, order, topic),
		topic ? checkTopicExists(topic) : null,
	])
		.then(([articles]) => {
			res.status(200).send({ articles })
		})
		.catch(err => {
			next(err)
		})
}


exports.getArticleByID = (req, res, next) => {
  const { id }  = req.params;
  selectArticleByID(id).then((article) => {
    res.status(200).send({ article });
  })
  .catch(next);
};


exports.getArticleCommentsByID = (req, res, next) => {
  const { id }  = req.params;
  Promise.all([selectArticleCommentsByID(id),selectArticleByID(id)])
  .then((promises) => {
    res.status(200).send({ comments: promises[0] });
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

exports.postCommentById = (req, res, next) => {
	const {id} = req.params;
  const comment_data = req.body;
  const username = req.body.username;
  
  checkUserExists(username)
  .then(() => {
    return postCommentModel(id, comment_data)
  })
  .then(comment => {
    res.status(201).send({ comment })
  })
  .catch(err => {
    next(err)
  })
}
