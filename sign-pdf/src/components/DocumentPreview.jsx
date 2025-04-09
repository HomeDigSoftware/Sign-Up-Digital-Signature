import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, CircularProgress } from '@mui/material';
import PdfViewer from './PdfViewer';
import { documentService } from '../services/document.service';

const DocumentPreview = ({ documentId, open, onClose }) => {
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDocument = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // קבלת הקובץ כ-blob
                const response = await documentService.downloadDocument(documentId);
                const blob = new Blob([response.data], { type: 'application/pdf' });
                setPdfFile(blob);
            } catch (err) {
                console.error('Error loading document:', err);
                setError('שגיאה בטעינת המסמך');
            } finally {
                setLoading(false);
            }
        };

        if (documentId) {
            loadDocument();
        }
    }, [documentId]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
        >
            <DialogContent>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <PdfViewer file={pdfFile} readOnly={true} />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DocumentPreview; 