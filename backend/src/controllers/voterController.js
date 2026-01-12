const pool = require('../db');

exports.getReferendums = async (req, res) => {
  try {
    const voter_email = req.user.id;
    const [ref] = await pool.query('SELECT * FROM referendum WHERE status = "open"');
    const result = [];
    for (let r of ref) {
      const [opts] = await pool.query('SELECT * FROM referendum_options WHERE referendum_id = ?', [r.referendum_id]);
      const [vote] = await pool.query('SELECT voted_option_id FROM voter_history WHERE voter_email = ? AND voted_referendum_id = ?', [voter_email, r.referendum_id]);
      const hasVoted = vote.length > 0;
      const votedOptionId = hasVoted ? vote[0].voted_option_id : null;
      result.push({ ...r, options: opts, hasVoted, votedOptionId });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.vote = async (req, res) => {
  const { referendum_id, option_id } = req.body;
  const voter_email = req.user.id;

  try {
    const [voted] = await pool.query('SELECT * FROM voter_history WHERE voter_email = ? AND voted_referendum_id = ?', [voter_email, referendum_id]);
    if (voted.length) return res.status(400).json({ error: 'Already voted' });

    await pool.query('INSERT INTO voter_history (voter_email, voted_referendum_id, voted_option_id) VALUES (?, ?, ?)', [voter_email, referendum_id, option_id]);

    // Check for auto-close
    const [totalVoters] = await pool.query('SELECT COUNT(*) as count FROM voters');
    const total = totalVoters[0].count;

    const [votes] = await pool.query('SELECT voted_option_id, COUNT(*) as count FROM voter_history WHERE voted_referendum_id = ? GROUP BY voted_option_id', [referendum_id]);
    const half = total * 0.5;
    const shouldClose = votes.some(v => v.count >= half);

    if (shouldClose) {
      await pool.query('UPDATE referendum SET status = "closed" WHERE referendum_id = ?', [referendum_id]);
    }

    res.json({ message: 'Vote cast' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};