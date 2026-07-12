const repo = require('./expenses.repo');

async function list(req, res, next) {
  try {
    const expenses = await repo.list();
    res.status(200).json({ expenses });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const expense = await repo.create(req.body, req.user.id);
    res.status(201).json({ expense });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create };
