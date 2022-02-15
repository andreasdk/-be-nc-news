const db = require('../db/connection');


exports.selectArticleByID = (id) => {
    return db
    .query('SELECT * FROM articles WHERE article_id = $1;', 
    [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Page Not Found' });
      }
      return rows[0];
    });
};


exports.patchArticleModel = (id, body) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [body.inc_votes, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};