import React, { useState } from 'react';
import PdfViewer from './PdfViewer';
import SignaturePadComponent from './SignaturePad';
import axios from 'axios';

const SignPdf = () => {
  const [pdfUrl, setPdfUrl] = useState('/path/to/pdf'); // יש לשים את כתובת ה־PDF
  const [signatureData, setSignatureData] = useState(null);
  const [signaturePosition, setSignaturePosition] = useState(null);

  const onSignature = (signatureData) => {
    setSignatureData(signatureData);
  };

  const onClickSignatureLocation = (event) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setSignaturePosition({ x, y });
  };

  const saveSignatureToBackend = async () => {
    if (signatureData) {
      try {
        const response = await axios.post('/api/save-signature', {
          signature: signatureData,
          position: signaturePosition,
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error saving signature:', error);
      }
    }
  };

  return (
    <div>
      <h1>Sign the PDF</h1>
      <div onClick={onClickSignatureLocation} style={{ position: 'relative', display: 'inline-block' }}>
        <PdfViewer fileUrl={pdfUrl} />
        {signaturePosition && (
          <div
            style={{
              position: 'absolute',
              top: signaturePosition.y + 'px',
              left: signaturePosition.x + 'px',
              border: '2px dashed red',
              padding: '10px',
            }}
          >
            Signature Position
          </div>
        )}
      </div>
      <SignaturePadComponent onSignature={onSignature} />
      <img src={signatureData} alt="Signature" />
      <button onClick={saveSignatureToBackend}>Save Signature</button>
    </div>
  );
};

export default SignPdf;
