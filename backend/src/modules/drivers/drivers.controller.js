const service = require('./drivers.service');

async function list(req, res, next) {
  try {
    const drivers = await service.list(req.query);
    res.status(200).json({ drivers });
  } catch (err) {
    next(err);
  }
}

async function listAvailable(req, res, next) {
  try {
    const drivers = await service.listAvailable();
    res.status(200).json({ drivers });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const driver = await service.getById(req.params.id);
    res.status(200).json({ driver });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const driver = await service.create(req.body);
    res.status(201).json({ driver });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const driver = await service.update(req.params.id, req.body);
    res.status(200).json({ driver });
  } catch (err) {
    next(err);
  }
}

function makeTransitionHandler(fn) {
  return async (req, res, next) => {
    try {
      const driver = await fn(req.params.id);
      res.status(200).json({ driver });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  list,
  listAvailable,
  getById,
  create,
  update,
  suspend: makeTransitionHandler(service.suspend),
  reinstate: makeTransitionHandler(service.reinstate),
  offDuty: makeTransitionHandler(service.offDuty),
  onDuty: makeTransitionHandler(service.onDuty),
};
