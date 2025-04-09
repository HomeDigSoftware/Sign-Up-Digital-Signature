import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { RTL } from './components/layouts/RTL';
import Navbar from './components/layouts/Navbar';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { AuthProvider } from './context/AuthContext';
import FileUpload from './components/documents/FileUpload';
import RequireAuth from './components/auth/RequireAuth';
import DocumentList from './components/documents/DocumentList';
import DocumentViewer from './components/documents/DocumentViewer';

// יצירת ערכת נושא מותאמת לעברית
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      'Rubik',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RTL>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <div className="app">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/upload" 
                  element={
                    <RequireAuth>
                      <FileUpload />
                    </RequireAuth>
                  } 
                />
                <Route 
                  path="/documents" 
                  element={
                    <RequireAuth>
                      <DocumentList />
                    </RequireAuth>
                  } 
                />
                <Route 
                  path="/documents/:id" 
                  element={
                    <RequireAuth>
                      <DocumentViewer />
                    </RequireAuth>
                  } 
                />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </RTL>
    </ThemeProvider>
  );
}

export default App;



// import React from 'react';
// import { BrowserRouter } from 'react-router-dom';
// import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
// import { AuthProvider } from './context/AuthContext';
// import { RTL } from './components/layouts/RTL';
// import Navbar from './components/layouts/Navbar';
// import LoginForm from './components/auth/LoginForm';

// // יצירת ערכת נושא מותאמת לעברית
// const theme = createTheme({
//   direction: 'rtl',
//   typography: {
//     fontFamily: [
//       'Rubik',
//       'Arial',
//       'sans-serif'
//     ].join(','),
//   },
//   palette: {
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//   },
// });

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <RTL>
//         <CssBaseline />
//         <AuthProvider>
//           <BrowserRouter>
//             <Navbar />
//             <LoginForm />
//             {/* כאן יבואו הנתיבים */}
//           </BrowserRouter>
//         </AuthProvider>
//       </RTL>
//     </ThemeProvider>
//   );
// }

// export default App;