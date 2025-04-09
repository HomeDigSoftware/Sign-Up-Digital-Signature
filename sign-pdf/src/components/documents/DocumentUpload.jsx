import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  LinearProgress,
  Alert 
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

export default function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const { user } = useAuth();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
      generatePreview(droppedFile);
    } else {
      setError('ניתן להעלות קבצי PDF בלבד');
    }
  };

  const generatePreview = async (file) => {
    // כאן נשתמש ב-PDF.js ליצירת תצוגה מקדימה
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      generatePreview(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    
    try {
      // כאן תבוא הלוגיקה של העלאת הקובץ
      // await fileService.uploadDocument(file);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        העלאת מסמך לחתימה
      </Typography>

      <Paper
        sx={{
          p: 3,
          mt: 2,
          border: '2px dashed',
          borderColor: 'primary.main',
          backgroundColor: 'background.default',
          cursor: 'pointer',
          textAlign: 'center'
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".pdf"
          hidden
          onChange={handleFileSelect}
        />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          גרור קובץ PDF לכאן או לחץ לבחירה
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {file && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            {file.name}
          </Typography>
          {preview && (
            <Box sx={{ mt: 2, mb: 2 }}>
              {/* כאן יוצג Preview של ה-PDF */}
            </Box>
          )}
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            העלה מסמך
          </Button>
          {loading && <LinearProgress sx={{ mt: 2 }} />}
        </Box>
      )}
    </Box>
  );
} 