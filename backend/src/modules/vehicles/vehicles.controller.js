const service = require('./vehicles.service');

async function list(req, res, next) {
  try {
    const vehicles = await service.list(req.query);
    res.status(200).json({ vehicles });
  } catch (err) {
    next(err);
  }
}

async function listAvailable(req, res, next) {
  try {
    const vehicles = await service.listAvailable(req.query.min_capacity);
    res.status(200).json({ vehicles });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const vehicle = await service.getById(req.params.id);
    res.status(200).json({ vehicle });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const vehicle = await service.create(req.body);
    res.status(201).json({ vehicle });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const vehicle = await service.update(req.params.id, req.body);
    res.status(200).json({ vehicle });
  } catch (err) {
    next(err);
  }
}

async function retire(req, res, next) {
  try {
    const vehicle = await service.retireVehicle(req.params.id);
    res.status(200).json({ vehicle });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, listAvailable, getById, create, update, retire };
