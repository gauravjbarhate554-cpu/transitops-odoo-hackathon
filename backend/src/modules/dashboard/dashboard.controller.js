const repo = require('./dashboard.repo');

async function kpis(req, res, next) {
  try {
    const data = await repo.getKpis(req.query);
    res.status(200).json({ kpis: data });
  } catch (err) {
    next(err);
  }
}

module.exports = { kpis };
