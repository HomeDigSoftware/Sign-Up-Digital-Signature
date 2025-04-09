import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const fileService = {
  async uploadFile(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) {
            onProgress(percentCompleted);
          }
        }
      });
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'שגיאה בהעלאת הקובץ');
    }
  },

  async getFiles() {
    try {
      const response = await axios.get(`${API_URL}/files`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'שגיאה בטעינת הקבצים');
    }
  }
};

export default fileService;