import React from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ title, children }) => {
  const { user, logout } = useAuth();
  
    // Get first name from user context if available
    let firstName = '';
    if (user && user.name) {
      firstName = user.name.split(' ')[0];
    }
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

        {/* Right - User Info + Optional Actions + Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user && user.name && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar style={{ background: '#fff', color: '#1976d2', width: 32, height: 32 }}>
                <AccountCircleIcon />
              </Avatar>
              <Typography variant="subtitle1" style={{ color: '#fff', fontWeight: 500 }}>
                Hi, {firstName}
              </Typography>
            </div>
          )}
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
