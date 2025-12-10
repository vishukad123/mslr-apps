import React, { useState } from 'react';
import { Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel, Button } from '@material-ui/core';

const ReferendumCard = ({ referendum, onVote }) => {
  const [selected, setSelected] = useState("");

  return (
    <Card variant="outlined" style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h5">{referendum.title}</Typography>
        <Typography>{referendum.description}</Typography>

        <RadioGroup value={selected} onChange={(e) => setSelected(e.target.value)}>
          {referendum.options.map(opt => (
            <FormControlLabel 
              key={opt.opt_id}
              value={String(opt.opt_id)}
              control={<Radio />}
              label={opt.option_text}
            />
          ))}
        </RadioGroup>

        <Button 
          variant="contained" 
          color="primary"
          disabled={!selected}
          onClick={() => onVote(referendum.referendum_id, selected)}
        >
          Vote
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReferendumCard;
