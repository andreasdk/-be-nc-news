const db = require('../db/connection');

exports.selectAllArticles = (sort_by = 'created_at', order = 'desc', topic) => {
  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, 
	COUNT(comments.article_id) AS comment_count 
	FROM articles
	LEFT JOIN comments ON comments.article_id = articles.article_id`

  const filterValues = []
	if (topic) {
		queryStr += ` WHERE articles.topic ILIKE $1`
		filterValues.push(topic)
	}

  
  queryStr += ` GROUP BY articles.article_id
	ORDER BY ${sort_by} ${order};`

	return db.query(queryStr, filterValues).then(({ rows: articles }) => {
		return articles;
	})
};

exports.selectArticleCommentsByID = (id) => {
  return db
  .query('SELECT comment_id, body, votes, author, created_at FROM comments WHERE article_id = $1;', 
  [id]
  )
  .then(({ rows }) => {
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
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
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

exports.postCommentModel = (id, comment) => {
  const { username, body } = comment;
  
  let queryStr = `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`
  return db
    .query(
      queryStr, [username, body, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      }
      return rows[0];
    });
};

exports.deleteCommentById = (id) => {
	return db
  .query(`DELETE FROM comments WHERE comment_id = $1`, [id])
  .then(({ rows }) => {
    if (rows === 0) {
      return Promise.reject({
        status: 404,
        msg: `No comment exists for: ${id}`,
      });

    }
  });
}

