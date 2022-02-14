const db = require('../db/connection');

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics;').then((result) => result.rows);
};

exports.selectArticleByID = (id) => {
    console.log(id);
    return db
    .query('SELECT * FROM articles WHERE article_id = $1;', 
    [id]
    )
    .then(({ rows }) => {
      return rows[0]});
};