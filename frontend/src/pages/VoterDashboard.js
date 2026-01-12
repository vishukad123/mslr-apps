import React, { useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ReferendumCard from '../components/ReferendumCard';
import Header from '../components/Header';

const VoterDashboard = () => {
  const [referendums, setReferendums] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/voter/referendums`)
      .then(res => setReferendums(res.data))
      .catch(() => toast.error('Error fetching referendums'));
  }, []);

  const handleVote = async (refId, optId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/voter/vote`, {
        referendum_id: refId,
        option_id: optId
      });
      toast.success('Vote cast!');
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Vote failed');
    }
  };

  return (
    <>
      <Header title="Voter Dashboard" />
      <ToastContainer position="top-center" autoClose={2000} />
      <Container style={{ marginTop: '30px' }}>
        {referendums.map(r => (
          <ReferendumCard
            key={r.referendum_id}
            referendum={r}
            onVote={handleVote}
          />
        ))}
      </Container>
    </>
  );
};

export default VoterDashboard;
