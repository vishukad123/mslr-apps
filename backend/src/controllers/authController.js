const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateEmail, validatePassword, validateDOB, validateSCC } = require('../utils/validators');
const { VALID_SCC } = require('../utils/constants');

exports.register = async (req, res) => {
  const { email, name, dob, password, scc } = req.body;

  if (!validateEmail(email) || !validatePassword(password) || !validateDOB(dob) || !validateSCC(scc, VALID_SCC)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const [existing] = await pool.query('SELECT * FROM voters WHERE voter_email = ? OR scc = ?', [email, scc]);
    if (existing.length) return res.status(400).json({ error: 'Email or SCC already used' });

    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO voters (voter_email, fullname, dob, passwordhash, scc) VALUES (?, ?, ?, ?, ?)', [email, name, dob, hash, scc]);

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await pool.query('SELECT * FROM voters WHERE voter_email = ?', [email]);
    if (!user.length || !await bcrypt.compare(password, user[0].passwordhash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user[0].voter_email, role: 'voter' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, name: user[0].fullname });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.ecLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email !== 'ec@referendum.gov.sr' || password !== 'Shangrilavote&2025@') {  // Exact match from spec (lower 'v' in vote)
    return res.status(401).json({ error: 'Invalid EC credentials' });
  }

  const token = jwt.sign({ id: email, role: 'ec' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, name: 'EC Admin' });
};