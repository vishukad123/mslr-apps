import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, TextField, List, ListItem, Switch } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Header from '../components/Header';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ECDashboard = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ title: '', description: '', options: ['', ''] });
  const [referendums, setReferendums] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', options: [] });
  const [editing, setEditing] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/ec/referendums`)
      .then(res => setReferendums(res.data))
      .catch(err => {
        console.error(err);
        toast.error('Error loading referendums');
      });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addOption = () => setForm({ ...form, options: [...form.options, ''] });
  const addCreateOption = () => setCreateForm({ ...createForm, options: [...createForm.options, ''] });

  const updateOption = (index, value) => {
    const opts = [...form.options];
    opts[index] = value;
    setForm({ ...form, options: opts });
  };

  // Dialog-related functions moved to component scope
  const updateCreateOption = (index, value) => {
    const opts = [...createForm.options];
    opts[index] = value;
    setCreateForm({ ...createForm, options: opts });
  };

  const resetCreateForm = () => setCreateForm({ title: '', description: '', options: ['', ''] });
  const handleDialogClose = () => {
    setDialogOpen(false);
    resetCreateForm();
  };
  const handleCreateChange = (e) => setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  const isCreateValid = () => {
    if (!createForm.title.trim() || !createForm.description.trim()) return false;
    const filledOptions = createForm.options.filter(opt => opt.trim());
    if (filledOptions.length < 2) return false;
    return true;
  };
  const handleCreateSave = async () => {
    try {
      const payload = {
        ...createForm,
        options: createForm.options.filter(opt => opt.trim())
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/ec/create`, payload);
      toast.success('Referendum created');
      setDialogOpen(false);
      resetCreateForm();
      window.location.reload();
    } catch (err) {
      toast.error('Error creating referendum');
    }
  };

  const saveReferendum = async () => {
    try {
      if (editing) {
        await axios.put(`${process.env.REACT_APP_API_URL}/ec/edit/${editing}`, form);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/ec/create`, form);
      }
      toast.success('Saved');
      window.location.reload();
    } catch (err) {
      toast.error('Error saving');
    }
  };

  const toggleStatus = async (id, status) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/ec/status/${id}`, { status });
      toast.success('Status updated');
      window.location.reload();
    } catch (err) {
      toast.error('Error updating status');
    }
  };

  const edit = (r) => {
    setEditing(r.referendum_id);
    setForm({ title: r.title, description: r.description || '', options: r.options.map(o => o.option_text) });
  };

  return (
    <>
      <Header title="EC Dashboard" />
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', margin: '24px 32px 0 0' }}>
        <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
          Create Referendum
        </Button>
      </div>
      <Container style={{ marginTop: '30px' }}>
        <List>
          {referendums.map(r => (
            <ListItem key={r.referendum_id} style={{ alignItems: 'flex-start' }}>
              <div style={{ width: '100%', display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ flex: 4, minWidth: 200, maxWidth: 350 }}>
                  <Typography>{r.title} ({r.status})</Typography>
                  <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
                    <Switch checked={r.status === 'open'} onChange={(_, checked) => toggleStatus(r.referendum_id, checked ? 'open' : 'closed')} />
                    <Button onClick={() => edit(r)} style={{ marginLeft: 8 }}>Edit</Button>
                  </div>
                </div>
                <div style={{ flex: 8, minWidth: 300, maxWidth: 700, paddingLeft: 24 }}>
                  <Bar
                    data={{
                      labels: r.options.map(o => o.option_text),
                      datasets: [{ label: 'Votes', data: r.options.map(o => o.votes), backgroundColor: '#2980b9' }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: true, position: 'top' } },
                      scales: { x: { title: { display: false } }, y: { beginAtZero: true } }
                    }}
                    height={180}
                  />
                </div>
              </div>
            </ListItem>
          ))}
        </List>
        <ToastContainer />
      </Container>
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Referendum</DialogTitle>
        <DialogContent>
          <TextField
            name="title"
            label="Title"
            value={createForm.title}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="description"
            label="Description"
            value={createForm.description}
            onChange={handleCreateChange}
            fullWidth
            margin="normal"
            multiline
            required
          />
          {createForm.options.map((opt, idx) => (
            <TextField
              key={idx}
              label={`Option ${idx + 1}`}
              value={opt}
              onChange={e => updateCreateOption(idx, e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          ))}
          <Button onClick={addCreateOption} variant="outlined" style={{ marginTop: 8 }}>Add Option</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={handleCreateSave} color="primary" variant="contained" disabled={!isCreateValid()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ECDashboard;