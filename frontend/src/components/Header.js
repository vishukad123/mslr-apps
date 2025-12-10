import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ title, children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Left - Title */}
        <Typography variant="h5" style={{ fontWeight: 600 }}>
          {title}
        </Typography>

        {/* Right - Optional Actions + Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {children}
          <Button 
            variant="contained" 
            color="secondary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

      </Toolbar>
    </AppBar>
  );
};

export default Header;
