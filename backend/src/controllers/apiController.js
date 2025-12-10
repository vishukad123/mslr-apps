const pool = require('../db');

exports.getReferendumsByStatus = async (req, res) => {
  const { status } = req.query;
  try {
    const [refs] = await pool.query('SELECT * FROM referendum WHERE status = ?', [status]);
    const result = [];
    for (let r of refs) {
      const [opts] = await pool.query('SELECT o.opt_id, o.option_text, COUNT(h.voted_option_id) as votes FROM referendum_options o LEFT JOIN voter_history h ON o.opt_id = h.voted_option_id WHERE o.referendum_id = ? GROUP BY o.opt_id', [r.referendum_id]);
      result.push({ referendum_id: r.referendum_id, status: r.status, referendum_title: r.title, referendum_desc: r.description, referendum_options: { options: opts } });
    }
    res.json({ Referendums: result });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getReferendumById = async (req, res) => {
  const { id } = req.params;
  try {
    const [ref] = await pool.query('SELECT * FROM referendum WHERE referendum_id = ?', [id]);
    if (!ref.length) return res.status(404).json({ error: 'Not found' });

    const [opts] = await pool.query('SELECT o.opt_id, o.option_text, COUNT(h.voted_option_id) as votes FROM referendum_options o LEFT JOIN voter_history h ON o.opt_id = h.voted_option_id WHERE o.referendum_id = ? GROUP BY o.opt_id', [id]);
    res.json({ referendum_id: id, status: ref[0].status, referendum_title: ref[0].title, referendum_desc: ref[0].description, referendum_options: { options: opts } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};