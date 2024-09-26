const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong, try again later.' });
  };
  
  module.exports = errorMiddleware;
  