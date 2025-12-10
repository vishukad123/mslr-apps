const pool = require('../db');

exports.getAllReferendums = async (req, res) => {
  try {
    const [refs] = await pool.query('SELECT * FROM referendum');
    const result = [];
    for (let r of refs) {
      const [opts] = await pool.query('SELECT o.opt_id, o.option_text, COUNT(h.voted_option_id) as votes FROM referendum_options o LEFT JOIN voter_history h ON o.opt_id = h.voted_option_id WHERE o.referendum_id = ? GROUP BY o.opt_id', [r.referendum_id]);
      result.push({ ...r, options: opts });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createReferendum = async (req, res) => {
  const { title, description, options } = req.body;

  try {
    const [result] = await pool.query('INSERT INTO referendum (title, description, status) VALUES (?, ?, "closed")', [title, description]);
    const id = result.insertId;

    for (let opt of options) {
      await pool.query('INSERT INTO referendum_options (referendum_id, option_text) VALUES (?, ?)', [id, opt]);
    }

    res.json({ message: 'Created' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.editReferendum = async (req, res) => {
  const { id } = req.params;
  const { title, description, options } = req.body;

  try {
    const [ref] = await pool.query('SELECT * FROM referendum WHERE referendum_id = ? AND status = "closed"', [id]);
    if (!ref.length) return res.status(400).json({ error: 'Cannot edit open referendum' });

    await pool.query('UPDATE referendum SET title = ?, description = ? WHERE referendum_id = ?', [title, description, id]);

    await pool.query('DELETE FROM referendum_options WHERE referendum_id = ?', [id]);
    for (let opt of options) {
      await pool.query('INSERT INTO referendum_options (referendum_id, option_text) VALUES (?, ?)', [id, opt]);
    }

    res.json({ message: 'Updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.setStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query('UPDATE referendum SET status = ? WHERE referendum_id = ?', [status, id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};