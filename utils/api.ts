import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001',
});

// Translation POST
export const postTranslation = (data: any) => {
  return instance.post('/translation', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Survey POST
export const postSurvey = (data: any) => {
  return instance.post('/survey-sql', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export default instance;