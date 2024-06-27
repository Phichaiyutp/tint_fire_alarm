const notFoundHandler = (req, res, next) => {
    res.status(404).json({
      message: 'No such route exists',
    });
  };
  
  const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500).json({
      message: 'Error Message',
    });
  };
  
  module.exports = {
    notFoundHandler,
    errorHandler,
  };
  