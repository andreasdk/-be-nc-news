exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === "22P02")
      res.status(400).send({ msg: "Bad Request" });
    else if (err.code === "23503")
      res.status(404).send({ msg: "Page Not Found" });
    else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status)
      res.status(err.status).send({ msg: err.msg || "Page Not Found" });
    else next(err);
};

exports.handle500Errors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal server error" });
};