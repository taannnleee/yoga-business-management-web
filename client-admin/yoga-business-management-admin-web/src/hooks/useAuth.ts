import { useEffect, useState } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { auth } from '../common/config/firebase';
import { IRootState } from '../store';
import { useAppSelector } from './useRedux';
import { useHistory } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axiosInstance from 'utils/axiosClient';
import { apiURL } from '../config/constanst';
import axios from 'axios';
export const useAuth = () => {
  const [loginWithGoogle] = useSignInWithGoogle(auth);

  const [loginError, setLoginError] = useState<string>();
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const isAuth = useAppSelector((state: IRootState) => state.auth.accessToken);

  const { user } = useAppSelector((state: IRootState) => state.auth);
  const history = useHistory();

  const dispatch = useDispatch();

  const login = async (username: string, password: string) => {
    try {
      setLoginLoading(true);
      const response = await axios.post(
        `${apiURL}/api/auth/login-admin`,
        {
          username,
          password,
        },
        {
          validateStatus: (status) => true, // Chấp nhận tất cả status code
        },
      );

      const result = response.data;

      toast.success('Đăng nhập thành công', {
        position: 'top-right',
        autoClose: 0,
        theme: 'colored',
        hideProgressBar: true,
      });

      // Lưu token
      localStorage.setItem('accessToken', result.data.accesstoken);
      localStorage.setItem('refreshToken', result.data.accesstoken);

      // Optionally update Redux
      // dispatch(setUser(result.data));
      // dispatch(setAccessToken(result.data.accesstoken));

      history.push('/home/dashboard');

      // Kết nối WebSocket
      const socket = new SockJS(`${apiURL}/ws`);
      const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str: string) => console.log(str),
      });

      stompClient.onConnect = () => {
        console.log('WebSocket Connected');

        stompClient.subscribe('/topic/admin', (message) => {
          if (message.body) {
            alert(message.body);
          }
        });
      };

      stompClient.activate();
    } catch (error: any) {
      console.log(error);
      toast.error('Phone number or password incorrect', {
        position: 'top-right',
        theme: 'colored',
        hideProgressBar: true,
      });
      setLoginError(error?.message || 'Đăng nhập thất bại');
    } finally {
      setLoginLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setLoginLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.log(error);
    } finally {
      setLoginLoading(false);
    }
  };

  return {
    isAuth: !!isAuth,
    login,
    loginError,
    googleLogin,
    loginLoading,
  };
};
