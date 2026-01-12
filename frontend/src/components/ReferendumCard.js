import React, { useState } from 'react';
import { Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel, Button } from '@material-ui/core';

const ReferendumCard = ({ referendum, onVote }) => {
  const [selected, setSelected] = useState(referendum.hasVoted ? String(referendum.votedOptionId) : "");

  React.useEffect(() => {
    if (referendum.hasVoted) {
      setSelected(String(referendum.votedOptionId));
    } else {
      setSelected("");
    }
  }, [referendum.hasVoted, referendum.votedOptionId]);

  return (
    <Card variant="outlined" style={{ marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h5">{referendum.title}</Typography>
        <Typography>{referendum.description}</Typography>

        <RadioGroup
          value={selected}
          onChange={referendum.hasVoted ? undefined : (e) => setSelected(e.target.value)}
        >
          {referendum.options.map(opt => (
            <FormControlLabel 
              key={opt.opt_id}
              value={String(opt.opt_id)}
              control={<Radio disabled={referendum.hasVoted} />}
              label={opt.option_text}
            />
          ))}
        </RadioGroup>

        {referendum.hasVoted ? (
          <Typography color="secondary" style={{ fontWeight: 500, marginTop: 8 }}>
            You have already voted in this referendum. Your choice: {referendum.options.find(o => String(o.opt_id) === String(referendum.votedOptionId))?.option_text}
          </Typography>
        ) : (
          selected && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => onVote(referendum.referendum_id, selected)}
            >
              Vote
            </Button>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default ReferendumCard;
