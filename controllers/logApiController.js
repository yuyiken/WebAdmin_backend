const LogAPI = require('../services/logApiService');
const { time } = require('../functions');

exports.logApiEventManager = async (req, res, next) => {
  try {
    // Instantiate the LogAPI class and handle the event
    const logApi = new LogAPI();
    const result = await logApi.OnEvent(req.body);
    console.log(time()+"---------------------REQUEST----------------");
    console.log(req.body);
    console.log(time()+"--------------------------------------------");
    console.log(time()+"---------------------RESPONSE---------------");
    console.log(result);
    console.log(time()+"--------------------------------------------");
    // Return the result as JSON
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};