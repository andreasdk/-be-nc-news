const db = require('../db/connection');


exports.selectAllUsers = () => {
    return db
    .query('SELECT username FROM users;', 
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Page Not Found' });
      }
      return rows;
    });
};