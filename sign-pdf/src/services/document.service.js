import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const documentService = {
  async uploadDocument(file, signaturePosition) {
    const formData = new FormData();
    formData.append('file', file);
    
    // הוספת מיקום החתימה
    if (signaturePosition) {
      formData.append('signaturePosition', JSON.stringify(signaturePosition));
    }

    const response = await axios.post(`${API_URL}/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  },

  async getDocuments() {
    const response = await axios.get(`${API_URL}/files`);
    return response.data;
  },

  // פונקציה חדשה לקבלת מסמך ספציפי
  async getDocument(id) {
    const response = await axios.get(`${API_URL}/files/${id}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  async downloadDocument(id) {
    const response = await axios.get(`${API_URL}/files/${id}/download`, {
      responseType: 'arraybuffer'
    });
    return response.data;
  },

  // פונקציה חדשה לעדכון מיקום חתימה
  async updateSignaturePosition(id, signaturePosition) {
    const response = await axios.patch(`${API_URL}/files/${id}/signature-position`, {
      signaturePosition
    });
    return response.data;
  }
};

export default documentService; 