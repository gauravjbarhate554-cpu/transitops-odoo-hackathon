const service = require('./maintenance.service');

async function list(req, res, next) {
  try {
    const logs = await service.list(req.query);
    res.status(200).json({ maintenance_logs: logs });
  } catch (err) {
    next(err);
  }
}

async function open(req, res, next) {
  try {
    const log = await service.open(req.body, req.user.id);
    res.status(201).json({ maintenance_log: log });
  } catch (err) {
    next(err);
  }
}

async function close(req, res, next) {
  try {
    const log = await service.close(req.params.id, req.body.cost);
    res.status(200).json({ maintenance_log: log });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, open, close };
