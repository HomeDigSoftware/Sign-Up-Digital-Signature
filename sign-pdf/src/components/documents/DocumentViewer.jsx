import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { documentService } from '../../services/document.service';
import PdfViewer from '../PdfViewer';

export default function DocumentViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfBlob, setPdfBlob] = useState(null);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const data = await documentService.getDocument(id);
      setDocument(data);
      
      // יצירת Blob מה-URL של הקובץ
      const response = await fetch(data.fileUrl);
      const blob = await response.blob();
      setPdfBlob(blob);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/documents')}
            sx={{ mt: 2 }}
          >
            חזרה לרשימת המסמכים
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/documents')}
          sx={{ mb: 2 }}
        >
          חזרה לרשימת המסמכים
        </Button>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            {document?.fileName}
          </Typography>

          <Box sx={{ mt: 2, height: '70vh' }}>
            {pdfBlob && (
              <PdfViewer
                file={pdfBlob}
                signaturePosition={document?.signaturePosition}
                readOnly={true}
              />
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
