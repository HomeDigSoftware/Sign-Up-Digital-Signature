import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Divider, 
  Alert, 
  Snackbar 
} from '@mui/material';
import userService from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userService.getProfile();
        setProfileData({
          name: response.data.name || '',
          email: response.data.email || ''
        });
      } catch (err) {
        setError('שגיאה בטעינת פרטי המשתמש');
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await userService.updateProfile(profileData);
      setSuccess('פרטי המשתמש עודכנו בהצלחה');
      setOpenSnackbar(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // וידוא שהסיסמאות תואמות
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('הסיסמאות החדשות אינן תואמות');
      setLoading(false);
      return;
    }

    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('הסיסמה שונתה בהצלחה');
      setOpenSnackbar(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        פרופיל משתמש
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          עדכון פרטים אישיים
        </Typography>
        
        <Box component="form" onSubmit={handleProfileSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="שם מלא"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="כתובת אימייל"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleProfileChange}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            עדכון פרטים
          </Button>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          שינוי סיסמה
        </Typography>
        
        <Box component="form" onSubmit={handlePasswordSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            name="currentPassword"
            label="סיסמה נוכחית"
            type="password"
            id="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="סיסמה חדשה"
            type="password"
            id="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="אימות סיסמה חדשה"
            type="password"
            id="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            שינוי סיסמה
          </Button>
        </Box>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 