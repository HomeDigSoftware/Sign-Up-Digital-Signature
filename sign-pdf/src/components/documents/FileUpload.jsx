import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Container,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  Create as CreateIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PdfViewer from '../PdfViewer';
import { documentService } from '../../services/document.service';


export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [openPreview, setOpenPreview] = useState(false);
  const [isMarkingMode, setIsMarkingMode] = useState(false);
  const [signaturePosition, setSignaturePosition] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showPreviewButton, setShowPreviewButton] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const canvasRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (file) => {
    setError('');
    
    if (!file) {
      return;
    }

    // בדיקת סוג הקובץ
    if (file.type !== 'application/pdf') {
      setError('ניתן להעלות קבצי PDF בלבד');
      return;
    }

    // בדיקת גודל הקובץ (מקסימום 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('גודל הקובץ לא יכול לעלות על 5MB');
      return;
    }

    setFile(file);
    // יצירת URL לתצוגה מקדימה
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const handlePreviewOpen = () => {
    setOpenPreview(true);
    // אם אין מיקום חתימה, נכנס למצב סימון אוטומטית
    if (!signaturePosition) {
      setIsMarkingMode(true);
    }
  };

  const handlePreviewClose = () => {
    setOpenPreview(false);
    setIsMarkingMode(false);
    // אם יש מיקום חתימה, נציג את כפתור התצוגה המקדימה
    if (signaturePosition) {
      setShowPreviewButton(true);
    }
  };

  const handleMarkPosition = (position) => {
    const normalizedPosition = {
      x: position.x,
      y: position.y,
      width: 200, // רוחב קבוע לתיבת החתימה
      height: 100 // גובה קבוע לתיבת החתימה
    };
    setSignaturePosition(normalizedPosition);
    setIsMarkingMode(false);
  };

  const handleUpload = async () => {
    if (!file || !signaturePosition || loading) return;

    setLoading(true);
    setError('');
    
    try {
      await documentService.uploadDocument(file, signaturePosition);
      setUploadSuccess(true);
      setTimeout(() => {
        navigate('/documents');
      }, 2000);
    } catch (err) {
      setError(err.message || 'שגיאה בהעלאת המסמך');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError('');
    setSignaturePosition(null);
    setShowPreviewButton(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            העלאת מסמך לחתימה
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 2,
              p: 3,
              mb: 2,
              textAlign: 'center',
              backgroundColor: 'background.default',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept=".pdf"
              onChange={handleFileSelect}
            />
            
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" gutterBottom>
              גרור קובץ PDF לכאן
            </Typography>
            <Typography variant="body2" color="textSecondary">
              או לחץ לבחירת קובץ
            </Typography>
          </Box>

          {file && (
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                mt: 2, 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PdfIcon color="primary" />
                <Typography>
                  {file.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {showPreviewButton ? (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handlePreviewOpen}
                      startIcon={<VisibilityIcon />}
                    >
                      צפה במסמך ומיקום החתימה
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setIsMarkingMode(true);
                        setOpenPreview(true);
                      }}
                      startIcon={<CreateIcon />}
                      color="secondary"
                    >
                      שנה מיקום חתימה
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handlePreviewOpen}
                    startIcon={<CreateIcon />}
                    color="primary"
                  >
                    סמן מיקום חתימה
                  </Button>
                )}
                <IconButton 
                  size="small" 
                  onClick={removeFile}
                  disabled={loading}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Paper>
          )}

          {file && signaturePosition && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleUpload}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'מעלה...' : 'העלה מסמך'}
            </Button>
          )}

          {uploadSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              המסמך הועלה בהצלחה! מעביר לרשימת המסמכים...
            </Alert>
          )}
        </Paper>
      </Box>

      <Dialog
        open={openPreview}
        onClose={handlePreviewClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ height: '80vh', p: 2, position: 'relative' }}>
          <Box sx={{ height: '100%', position: 'relative' }}>
            {file && (
              <PdfViewer 
                file={file}
                isMarkingMode={isMarkingMode}
                onMarkPosition={handleMarkPosition}
                signaturePosition={signaturePosition}
              />
            )}
            
            {/* תפריט כלים */}
            {isMarkingMode && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 2,
                  p: 1,
                  zIndex: 1
                }}
              >
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  לחץ על המקום הרצוי במסמך לסימון מיקום החתימה
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => setIsMarkingMode(false)}
                >
                  בטל מצב סימון
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviewClose} color="primary">
            {signaturePosition ? 'אשר וסגור' : 'סגור'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}