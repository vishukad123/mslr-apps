import React, { useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import axios from 'axios';
import ReferendumCard from '../components/ReferendumCard';
import Header from '../components/Header';

const VoterDashboard = () => {
  const [referendums, setReferendums] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/voter/referendums`)
      .then(res => setReferendums(res.data))
      .catch(() => alert('Error fetching referendums'));
  }, []);

  const handleVote = async (refId, optId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/voter/vote`, {
        referendum_id: refId,
        option_id: optId
      });
      alert('Vote cast!');
      window.location.reload();
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <>
      <Header title="Voter Dashboard" />

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
