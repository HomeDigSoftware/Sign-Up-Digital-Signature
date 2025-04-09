import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import {
  PictureAsPdf as PdfIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { documentService } from '../../services/document.service';

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getDocuments();
      
      // וידוא שהנתונים הם מערך
      if (Array.isArray(data)) {
        setDocuments(data);
      } else {
        console.error('Unexpected data format:', data);
        setError('התקבל פורמט נתונים לא צפוי מהשרת');
      }
    } catch (err) {
      console.error('Load documents error:', err);
      setError(err.message || 'שגיאה בטעינת המסמכים');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (documentId) => {
    navigate(`/documents/${documentId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            המסמכים שלי
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {Array.isArray(documents) && documents.length > 0 ? (
             <List>
             {documents.map((doc) => (
               <ListItem key={doc._id}>
                 <ListItemText
                   primary={doc.filename} // הוספת שם הקובץ המקורי
                   secondary={new Date(doc.createdAt).toLocaleDateString('he-IL', {
                     year: 'numeric',
                     month: 'long',
                     day: 'numeric',
                     hour: '2-digit',
                     minute: '2-digit'
                   })}
                 />
                  <IconButton
                    edge="end"
                    onClick={() => handleViewDocument(doc._id || doc.id)}
                    color="primary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="textSecondary" align="center">
              אין מסמכים להצגה
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
} 