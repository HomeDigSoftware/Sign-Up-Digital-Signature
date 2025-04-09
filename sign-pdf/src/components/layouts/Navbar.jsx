import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box,
  CircularProgress 
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/"
          sx={{ 
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          מערכת חתימות
        </Typography>
        
        {loading ? (
          <CircularProgress color="inherit" size={20} />
        ) : user ? (
          <Box>
            <Button 
              color="inherit" 
              component={Link} 
              to="/upload"
            >
              העלאת קובץ
            </Button>
            <Button 
              color="inherit"
              onClick={handleLogout}
            >
              התנתק
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/profile"
            >
              פרופיל
            </Button>
          </Box>
        ) : (
          <Box>
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
            >
              התחבר
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/register"
            >
              הרשמה
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
} 

// export default Navbar; 