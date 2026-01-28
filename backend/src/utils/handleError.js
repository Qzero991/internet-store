const { ValidationError } = require('sequelize');

// Универсальный обработчик ошибок
const handleControllerError = (req, res, err, context) => {
  if (
    (req.method === 'POST' || req.method === 'PUT') &&
    (!req.body || Object.keys(req.body).length === 0)
  ) {
    return res.status(400).json({ error: 'Request body is empty' });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors.map(e => e.message)
    });
  }

  console.error(`${context} ERROR:`, err);
  return res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = handleControllerError