import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, TextField, Grid, Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, MenuItem, Select } from '@material-ui/core';
import { Accordion, AccordionSummary, AccordionDetails, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
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
  const [filteredReferendums, setFilteredReferendums] = useState([]);
  const [filter, setFilter] = useState('all');
  const [totalUsers, setTotalUsers] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', options: [] });
  const [editChanged, setEditChanged] = useState(false);
  const [optionError, setOptionError] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [pendingReferendum, setPendingReferendum] = useState(null);
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
    axios.get(`${process.env.REACT_APP_API_URL}/ec/total-users`)
      .then(res => setTotalUsers(res.data.count))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let filtered = referendums;
    if (filter !== 'all') filtered = referendums.filter(r => r.status === filter);
    setFilteredReferendums(filtered);
  }, [referendums, filter]);

  const handleEdit = (referendum) => {
    setEditData(referendum);
    setEditForm({
      title: referendum.title,
      options: referendum.options.map(o => ({ option_text: o.option_text }))
    });
    setEditChanged(false);
    setOptionError('');
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (field, value) => {
    const newForm = { ...editForm, [field]: value };
    setEditForm(newForm);
    setEditChanged(
      newForm.title !== editData.title ||
      JSON.stringify(newForm.options) !== JSON.stringify(editData.options.map(o => ({ option_text: o.option_text })))
    );
  };

  const handleOptionChange = (idx, value) => {
    const newOptions = editForm.options.map((opt, i) => i === idx ? { option_text: value } : opt);
    setEditForm(f => ({ ...f, options: newOptions }));
    setEditChanged(
      editForm.title !== editData.title ||
      JSON.stringify(newOptions) !== JSON.stringify(editData.options.map(o => ({ option_text: o.option_text })))
    );
    setOptionError('');
  };

  const handleAddOption = () => {
    const trimmed = editForm.options.map(o => o.option_text.trim());
    if (trimmed.includes('')) {
      setOptionError('Option cannot be empty.');
      return;
    }
    const newOption = '';
    setEditForm(f => ({ ...f, options: [...f.options, { option_text: newOption }] }));
    setEditChanged(true);
    setOptionError('');
  };

  const handleOptionBlur = (idx) => {
    const value = editForm.options[idx].option_text.trim();
    if (!value) {
      setOptionError('Option cannot be empty.');
      return;
    }
    // Check for duplicates
    const allOptions = editForm.options.map(o => o.option_text.trim());
    if (allOptions.filter(opt => opt === value).length > 1) {
      setOptionError('Duplicate options are not allowed.');
    } else {
      setOptionError('');
    }
  };

  const handleStatusChange = (referendum, checked) => {
    setPendingReferendum(referendum);
    setPendingStatus(checked ? 'open' : 'closed');
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (pendingReferendum) {
      setReferendums(referendums.map(r => r.referendum_id === pendingReferendum.referendum_id ? { ...r, status: pendingStatus } : r));
    }
    setStatusDialogOpen(false);
    setPendingReferendum(null);
    setPendingStatus(null);
  };

  const cancelStatusChange = () => {
    setStatusDialogOpen(false);
    setPendingReferendum(null);
    setPendingStatus(null);
  };

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
      <Container style={{ marginTop: '30px' }}>
        <Grid container alignItems="center" spacing={2} style={{ marginBottom: 8 }}>
          <Grid item xs={6} style={{ display: 'flex', alignItems: 'center' }}>
            <Select value={filter} onChange={e => setFilter(e.target.value)} style={{ minWidth: 120, marginRight: 16 }}>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
              <MenuItem value="all">All</MenuItem>
            </Select>
            <Typography variant="subtitle1" style={{ fontWeight: 600, marginLeft: 16 }}>Title</Typography>
          </Grid>
          <Grid item xs={3}><Typography variant="subtitle1" style={{ fontWeight: 600 }}>Votes</Typography></Grid>
          <Grid item xs={3}><Typography variant="subtitle1" style={{ fontWeight: 600 }}>Status</Typography></Grid>
          <Grid item xs={12} style={{ textAlign: 'right', position: 'absolute', right: 32, top: 90 }}>
            <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
              Create Referendum
            </Button>
          </Grid>
        </Grid>
        {filteredReferendums.map(r => (
          <Accordion key={r.referendum_id} style={{ marginBottom: 8, background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #eee' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="body1">{r.title}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">{(r.options?.reduce((sum, o) => sum + (o.votes || 0), 0)) || 0} / {totalUsers}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Switch
                    checked={r.status === 'open'}
                    onChange={(_, checked) => handleStatusChange(r, checked)}
                    color="primary"
                  />
                  <Chip label={r.status === 'open' ? 'Open' : 'Closed'} color={r.status === 'open' ? 'primary' : 'default'} style={{ marginLeft: 8 }} />
                </Grid>
                    {/* Status Change Confirmation Dialog */}
                    <Dialog open={statusDialogOpen} onClose={cancelStatusChange} maxWidth="xs" fullWidth>
                      <DialogTitle>Change Status</DialogTitle>
                      <DialogContent>
                        <Typography>Are you sure you want to change the status of referendum?</Typography>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={cancelStatusChange} color="secondary">Cancel</Button>
                        <Button onClick={confirmStatusChange} color="primary">Confirm</Button>
                      </DialogActions>
                    </Dialog>
              </Grid>
            </AccordionSummary>
            <AccordionDetails style={{ display: 'flex', flexDirection: 'column' }}>
              <TableContainer component={Paper} style={{ boxShadow: 'none', marginBottom: 8 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><b>Option</b></TableCell>
                      <TableCell><b>Votes</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {r.options && r.options.length > 0 ? (
                      r.options.map((opt, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{opt.option_text}</TableCell>
                          <TableCell>{opt.votes}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2}>No options available.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <div style={{ width: '100%', textAlign: 'right', marginTop: 8 }}>
                <IconButton onClick={() => handleEdit(r)}><EditIcon /></IconButton>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
        <ToastContainer />
      </Container>

      {/* Edit Modal */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Referendum</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={editForm.title}
            onChange={e => handleEditFormChange('title', e.target.value)}
            disabled={editData?.status === 'open'}
          />
          <Typography variant="subtitle2" style={{ marginTop: 16 }}>Options:</Typography>
          {editForm.options.length > 0 ? (
            editForm.options.map((opt, idx) => (
              <TextField
                key={idx}
                label={`Option ${idx + 1}`}
                fullWidth
                margin="normal"
                value={opt.option_text}
                onChange={e => handleOptionChange(idx, e.target.value)}
                onBlur={() => handleOptionBlur(idx)}
                error={!!optionError}
                helperText={optionError && idx === editForm.options.length - 1 ? optionError : ''}
                disabled={editData?.status === 'open'}
              />
            ))
          ) : (
            <Typography variant="body2">No options available.</Typography>
          )}
          <Button onClick={handleAddOption} color="primary" style={{ marginTop: 8 }} disabled={!!optionError || editData?.status === 'open'}>
            Add Option
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">Cancel</Button>
          <Button color="primary" disabled={!editChanged || !!optionError}>Save</Button>
        </DialogActions>
      </Dialog>
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