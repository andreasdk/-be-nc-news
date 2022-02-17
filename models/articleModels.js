const db = require('../db/connection');

exports.selectAllArticles = () => {
  return db
  .query('SELECT * FROM articles ORDER BY created_at DESC;', 
  )
  .then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Page Not Found' });
    }
    return rows;
  });
};


exports.selectArticleByID = (id) => {
    return db
    .query('SELECT a.*, COUNT(c.comment_id)::int AS comment_count FROM articles a FULL JOIN comments c ON a.article_id = c.article_id WHERE a.article_id = $1 GROUP BY a.article_id;', 
    [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Page Not Found' });
      }
      return rows[0];
    });
};


exports.patchArticleModel = (id, votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [votes, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};