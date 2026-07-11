const CatchError = (err, req, res, next) => {
  // console.log(JSON.stringify(err, null, 2));
  if (err.code === 11000) {
    err.statusCode = 400;
    err.message = "Email duplicated!!"
  }

  res.status(500).json({
    message: err.message || "Internal Error",
    statusCode: err.statusCode || 500,
  });
};
module.exports = CatchError;
