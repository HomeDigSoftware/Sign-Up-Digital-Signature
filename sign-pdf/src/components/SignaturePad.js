import React, { useRef, useEffect } from 'react';
import SignaturePad from 'signature_pad';

const SignaturePadComponent = ({ onSignature }) => {
  const canvasRef = useRef(null);
  let signaturePad;

  useEffect(() => {
    signaturePad = new SignaturePad(canvasRef.current);
  }, []);

  const clearSignature = () => {
    signaturePad.clear();
  };


  const saveSignature = () => {
    if (!signaturePad.isEmpty()) {
      const signatureData = signaturePad.toDataURL();
      onSignature(signatureData);
    } else {
      alert('Please provide a signature.');
    }
  };

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
      <button onClick={clearSignature}>Clear</button>
      <button onClick={saveSignature}>Save Signature</button>
    </div>
  );
};

export default SignaturePadComponent;
