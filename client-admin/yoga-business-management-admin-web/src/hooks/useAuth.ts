import { useEffect, useState } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { auth } from '../common/config/firebase';
import { IRootState } from '../redux';
import { setAccessToken, setUser } from '../redux/slices/auth';
import { useAppSelector } from './useRedux';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { apiURL } from '../config/constanst';

export const useAuth = () => {
  const [loginWithGoogle] = useSignInWithGoogle(auth);

  //login
  const [loginError, setLoginError] = useState<string>();
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const isAuth = useAppSelector((state: IRootState) => state.auth.accessToken);

  const { user } = useAppSelector((state: IRootState) => state.auth);
  const history = useHistory();

  const dispatch = useDispatch();

  const login = async (username: string, password: string) => {
    console.log('Username, password', username);
    try {
      setLoginLoading(true);
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const result = await response.json();
      if (response) {
        toast.success('Login successfully', {
          position: 'top-right',
          autoClose: 0,
          theme: 'colored',
          hideProgressBar: true,
        });
        history.push('/home');
        console.log('response: ', result.data.accesstoken);
        localStorage.setItem('accessToken', result.data.accesstoken);
        localStorage.setItem('refreshToken', result.data.accesstoken);
        // dispatch(setUser(response?.data?.data as any));
        // dispatch(setAccessToken(response?.data?.data?.accessToken));
      } else {
        toast.error('Phone number or password in incorrect', {
          position: 'top-right',
          theme: 'colored',
          hideProgressBar: true,
        });
      }
    } catch (error) {
      console.log(error);
      setLoginError(error as string);
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
