import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  CircularProgress 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'שגיאה בהתחברות');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            התחברות
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="אימייל"
              type="email"
              margin="normal"
              required
              value={formData.email}
              onChange={(e) => setFormData({
                ...formData,
                email: e.target.value
              })}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="סיסמה"
              type="password"
              margin="normal"
              required
              value={formData.password}
              onChange={(e) => setFormData({
                ...formData,
                password: e.target.value
              })}
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'התחבר'}
            </Button>
          </form>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              color="primary"
              onClick={() => navigate('/register')}
              disabled={loading}
            >
              אין לך חשבון? הירשם כאן
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 


// import React, { useState } from 'react';
// import { 
//   Box, 
//   TextField, 
//   Button, 
//   Typography, 
//   Paper 
// } from '@mui/material';

// const LoginForm = ({ onLogin }) => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onLogin(formData);
//   };

//   return (
//     <Box 
//       component={Paper} 
//       p={3} 
//       maxWidth={400} 
//       mx="auto" 
//       mt={4}
//     >
//       <Typography variant="h5" mb={2}>
//         התחברות
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           fullWidth
//           label="אימייל"
//           type="email"
//           margin="normal"
//           required
//           value={formData.email}
//           onChange={(e) => setFormData({
//             ...formData,
//             email: e.target.value
//           })}
//         />
//         <TextField
//           fullWidth
//           label="סיסמה"
//           type="password"
//           margin="normal"
//           required
//           value={formData.password}
//           onChange={(e) => setFormData({
//             ...formData,
//             password: e.target.value
//           })}
//         />
//         <Button 
//           type="submit" 
//           variant="contained" 
//           fullWidth 
//           sx={{ mt: 2 }}
//         >
//           התחבר
//         </Button>
//       </form>
//     </Box>
//   );
// };

// export default LoginForm