exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502")
    res.status(400).send({ msg: "Bad Request" });
    else next(err);
};
  
  
exports.handle500Errors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal server error" });
};