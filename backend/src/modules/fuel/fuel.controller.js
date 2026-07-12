const repo = require('./fuel.repo');

async function list(req, res, next) {
  try {
    const fuel_logs = await repo.list();
    res.status(200).json({ fuel_logs });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const fuel_log = await repo.create(req.body, req.user.id);
    res.status(201).json({ fuel_log });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create };
