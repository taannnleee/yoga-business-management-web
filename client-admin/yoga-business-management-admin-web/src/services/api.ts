import axios from 'axios';
import { apiURL } from '../config/constanst';
import axiosInstance from 'utils/axiosClient';
export const loginService = async (email: string, password: string) => {
  try {
    const data = await axiosInstance.post(`/auth/signin`, {
      email,
      password,
    });
    if (data) return data;
  } catch (error) {
    console.log(error);
  }
};

export const registerService = async (username: string, email: string, password: string) => {
  try {
    const data = await axiosInstance.post(`/auth/signup`, {
      username,
      email,
      password,
    });
    if (data) return data;
  } catch (error) {
    console.log(error);
  }
};

export const isExistedEmail = async (email: string) => {
  try {
    const isExisted = await axiosInstance.post(
      `/auth/checkemail`,

      {
        email: email,
      },
      {
        withCredentials: true,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      },
    );
    return isExisted;
  } catch (error) {
    console.log(error);
  }
};
