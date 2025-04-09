import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const userService = {
  async updateProfile(userData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/users/update`, userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'שגיאה בעדכון פרטי המשתמש');
    }
  },
  
  async changePassword(passwordData) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/users/change-password`, passwordData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'שגיאה בשינוי הסיסמה');
    }
  },
  
  async getProfile() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'שגיאה בטעינת פרטי המשתמש');
    }
  }
};

export default userService; 