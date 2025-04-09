import React, { useRef, useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Box, CircularProgress } from '@mui/material';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfViewer = ({ file, isMarkingMode, onMarkPosition, signaturePosition, readOnly = false }) => {
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1.5);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const renderTaskRef = useRef(null);

  useEffect(() => {
    if (!file) return;

    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);

        // ביטול רינדור קודם אם קיים
        if (renderTaskRef.current) {
          await renderTaskRef.current.cancel();
        }

        const fileUrl = URL.createObjectURL(file);
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        
        const viewport = page.getViewport({ scale });
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const overlayCanvas = overlayCanvasRef.current;
        if (overlayCanvas) {
          overlayCanvas.height = viewport.height;
          overlayCanvas.width = viewport.width;
        }
        
        setPdfDimensions({ width: viewport.width, height: viewport.height });

        renderTaskRef.current = page.render({
          canvasContext: context,
          viewport: viewport
        });

        await renderTaskRef.current.promise;
        
        // חשוב: ציור הסימון רק אחרי שהרינדור הסתיים
        if (signaturePosition) {
          setTimeout(() => drawSignatureBox(signaturePosition), 0);
        }

        URL.revokeObjectURL(fileUrl);
      } catch (err) {
        console.error('PDF loading error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPdf();
  }, [file, scale, signaturePosition]);

  // פונקציה לציור תיבת החתימה
  const drawSignatureBox = (position) => {
    const overlayCanvas = overlayCanvasRef.current;
    if (!overlayCanvas) return;

    const ctx = overlayCanvas.getContext('2d');
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    
    // המרת אחוזים לפיקסלים
    const pixelPosition = {
      x: (position.x * overlayCanvas.width) / 100,
      y: (position.y * overlayCanvas.height) / 100,
      width: 200,
      height: 100
    };
    
    ctx.strokeStyle = readOnly ? '#4caf50' : '#1976d2';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    
    ctx.strokeRect(
      pixelPosition.x - pixelPosition.width/2,
      pixelPosition.y - pixelPosition.height/2,
      pixelPosition.width,
      pixelPosition.height
    );
    
    ctx.font = '16px Arial';
    ctx.fillStyle = readOnly ? '#4caf50' : '#1976d2';
    ctx.textAlign = 'center';
    ctx.fillText(
      'מיקום חתימה',
      pixelPosition.x,
      pixelPosition.y - pixelPosition.height/2 - 10
    );
  };

  // טיפול בלחיצה על הקנבס
  const handleCanvasClick = (e) => {
    if (readOnly || !isMarkingMode || !overlayCanvasRef.current) return;

    const rect = overlayCanvasRef.current.getBoundingClientRect();
    // המרה לאחוזים
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onMarkPosition({ x, y });
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {loading && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <CircularProgress />
        </Box>
      )}
      
      <Box sx={{ position: 'relative' }}>
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: '100%',
            height: 'auto',
            display: loading ? 'none' : 'block'
          }}
        />
        <canvas
          ref={overlayCanvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            maxWidth: '100%',
            height: 'auto',
            cursor: isMarkingMode ? 'crosshair' : 'default'
          }}
          onClick={handleCanvasClick}
        />
      </Box>
    </Box>
  );
};

export default PdfViewer;