import axios from 'axios';
import { backendHostPort } from './environment';

export const getConfigsRequest = async (): Promise<any> => {
  try {
    return await axios.get(`${backendHostPort}/configs/`);
  } catch (error) {
    if (error && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
};
