'use client';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { format } from 'date-fns';
import MainLayout from '../../components/SIdeBar';
import useWindowDimensions from '../../hooks/useWindowDimension';
import axios from 'axios';
import { apiURL } from '../../config/constanst';
import { useAppSelector } from '../../hooks/useRedux';
import { IRootState } from '../../store';
import RevenueIcon from '../../assets/images/RevenueIcon.png';
import GiveMoneyIcon from '../../assets/images/GiveMoneyIcon.png';
import RevenueOnEveryBid from '../../assets/images/RevenueOnBid.png';
import CreateFeeRevenue from '../../assets/images/CreateFeeRevenue.png';
import axiosInstance from 'utils/axiosClient';

interface ProductWithCategory {
  id: string;
  name: string;
  urlImage: string;
  quantity: string;
}

export default function TrendPrediction() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalPriceForDay, setTotalPriceForDay] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theProdcutOfStore, setTheProductOfStore] = useState<ProductWithCategory[]>([]);

  const [monthlyRevenueData, setMonthlyRevenueData] = useState<number[]>([]);

  // Fetch product data from the API
  const fetchTheProductOfStore = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/api/admin/get-all-category-and-quantity-product`);

      if (response?.data?.status !== 200) {
        throw new Error('Failed to fetch data');
      }

      const data = response.data;
      setTheProductOfStore(data.data);

      const categories = data.data.map((item: ProductWithCategory) => item.name);
      const quantities = data.data.map((item: ProductWithCategory) => parseInt(item.quantity));

      setBarState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories,
          },
        },
        series: [
          {
            name: 'Số lượng',
            data: quantities,
          },
        ],
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch product data from the API
  const fetchStoreRevenueByMonth = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/api/admin/get-month-revenue`);

      if (response?.data?.status !== 200) {
        throw new Error('Failed to fetch revenue data');
      }

      const data = response.data;
      console.log('Revenue response:', data.data);
      setTheProductOfStore(data.data);

      const revenuePerMonth = data.data.map((monthData: any) => {
        return monthData.reduce((sum: number, order: any) => sum + order.totalPrice, 0);
      });

      console.log('Monthly revenue:', revenuePerMonth);
      setMonthlyRevenueData(revenuePerMonth);

      setLineState((prevState) => ({
        ...prevState,
        series: [
          {
            name: 'Doanh thu',
            data: revenuePerMonth,
          },
        ],
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheProductOfStore();
    fetchStoreRevenueByMonth();
  }, []);

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(new Date(newDate));
  };

  const [lineState, setLineState] = useState({
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: [
          'Tháng 1',
          'Tháng 2',
          'Tháng 3',
          'Tháng 4',
          'Tháng 5',
          'Tháng 6',
          'Tháng 7',
          'Tháng 8',
          'Tháng 9',
          'Tháng 10',
          'Tháng 11',
          'Tháng 12',
        ],
      },
    },
    series: [
      {
        name: 'Doanh thu',
        data: monthlyRevenueData,

        // monthlyRevenueData,
      },
    ],
  });

  const [barState, setBarState] = useState({
    options: {
      chart: {
        id: 'basic-line',
      },
      xaxis: {
        categories: [], // Initially empty, will be updated after fetching data
      },
    },
    series: [
      {
        name: 'Số lượng',
        data: [], // Initially empty, will be updated after fetching data
      },
    ],
  });

  const [pieState, setPieState] = useState({
    series: [44, 55, 13, 43, 22, 20, 30, 11],
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Chiếu khấu sản phẩm', 'Phí đăng sản phẩm'],
      theme: {
        monochrome: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  });

  return (
    <MainLayout
      title="Tổng quan thông tin của sàn"
      content={
        <div className="flex flex-col gap-y-10 px-10">
          <div className="w-full rounded-xl bg-white px-10 py-5 shadow-lg drop-shadow-md">
            <p className="mb-4 text-center text-2xl font-bold text-gray-500">
              Xu hướng mua hàng của khách hàng vào các tháng trong năm
            </p>
            <Chart
              options={lineState.options}
              series={lineState.series}
              type="line"
              width="99%"
              height="280"
            />
          </div>
        </div>
      }
    />
  );
}
