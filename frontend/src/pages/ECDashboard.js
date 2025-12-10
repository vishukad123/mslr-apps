import React, { useEffect, useState } from 'react';
import { Container, Button, Card, CardContent, Typography } from '@material-ui/core';
import axios from 'axios';
import Header from '../components/Header';

const ECDashboard = () => {
  const [referendums, setReferendums] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/ec/referendums`)
      .then(res => setReferendums(res.data))
      .catch(() => alert('Error fetching EC referendums'));
  }, []);

  const createReferendum = () => {
    alert("Feature not implemented yet — but button works!");
  };

  return (
    <>
      <Header title="Election Commission Dashboard">
        <Button variant="contained" color="default" onClick={createReferendum}>
          Add Referendum
        </Button>
      </Header>

      <Container style={{ marginTop: '30px' }}>
        {referendums.map(r => (
          <Card key={r.referendum_id} style={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h6">{r.title}</Typography>
              <Typography>{r.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </Container>
    </>
  );
};

export default ECDashboard;
