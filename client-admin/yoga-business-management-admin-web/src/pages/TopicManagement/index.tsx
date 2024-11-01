import * as React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridSelectionModel } from '@mui/x-data-grid';
import MainLayout from '../../components/SIdeBar';
import { Button, Pagination, TablePagination } from '@mui/material';
import axios from 'axios';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../redux';
import { apiURL } from '../../config/constanst';

import { toast } from 'react-toastify';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import { divIcon } from 'leaflet';

interface IUser {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    address?: IAddress;
}

export interface IAddress {
    addressId: number;
    homeNumber: string;
    city: {
        id: number;
        name: string;
    };
    district: {
        id: number;
        name: string;
    };
    ward: {
        id: number;
        name: string;
    };
}

const TopicManagement = () => {


    return (
        <MainLayout
            title="Quản lý chủ đề"
            content={
                <div>
                    Giao diện quản lý chủ đề
                </div>
            }
        />
    );
};

export default TopicManagement;
