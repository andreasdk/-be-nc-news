const db = require('../db/connection');

exports.selectArticleByID = (id) => {
    return db
    .query('SELECT * FROM articles WHERE article_id = $1;', 
    [id]
    )
    .then(({ rows }) => {
      return rows[0]});
};