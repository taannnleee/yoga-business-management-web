import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../store';
import LogoutConfirmDialog from '../LogoutConfirmDialog';
import { useHistory } from 'react-router-dom';
import { Client, StompSubscription } from '@stomp/stompjs';
import axiosInstance from 'utils/axiosClient';

interface IHeaderProps {
  title: string;
}

const Header: React.FC<IHeaderProps> = (props) => {
  const history = useHistory();
  const { user } = useAppSelector((state: IRootState) => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const logOut = async () => {
    try {
      const response = await axiosInstance.post(`/auth/logout`);

      if (response.status === 200) {
        // Xóa token khỏi localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        toast.success('Đăng xuất thành công');
        history.push('/login');
      } else {
        toast.error('Đăng xuất thất bại, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Logout error', error);
      toast.error('Đăng xuất thất bại, vui lòng thử lại.');
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-b-gray-300 px-12 py-[16.5px]">
      <h2 className="text-2xl font-bold text-gray-600">{props.title}</h2>
      <div className="flex items-center space-x-4">
        <p className="text-lg font-bold text-gray-500">Xin chào {user?.username} !</p>
        <button
          className="rounded-full bg-gray-100 px-3 py-1 font-bold text-gray-800 hover:opacity-50"
          onClick={() => setOpen(true)}
        >
          Đăng xuất
        </button>
      </div>
      <LogoutConfirmDialog open={open} onClose={() => setOpen(false)} onConfirm={logOut} />
    </div>
  );
};

export default Header;
