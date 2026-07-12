const service = require('./trips.service');

async function list(req, res, next) {
  try {
    const trips = await service.list(req.query);
    res.status(200).json({ trips });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const trip = await service.getById(req.params.id);
    res.status(200).json({ trip });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const trip = await service.create(req.body, req.user.id);
    res.status(201).json({ trip });
  } catch (err) {
    next(err);
  }
}

async function dispatch(req, res, next) {
  try {
    const trip = await service.dispatchTrip(req.params.id);
    res.status(200).json({ trip });
  } catch (err) {
    next(err);
  }
}

async function complete(req, res, next) {
  try {
    const trip = await service.completeTrip(req.params.id, req.body);
    res.status(200).json({ trip });
  } catch (err) {
    next(err);
  }
}

async function cancel(req, res, next) {
  try {
    const trip = await service.cancelTrip(req.params.id);
    res.status(200).json({ trip });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, dispatch, complete, cancel };
