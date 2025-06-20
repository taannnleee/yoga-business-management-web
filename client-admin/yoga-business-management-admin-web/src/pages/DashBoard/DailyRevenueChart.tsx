'use client';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { format } from 'date-fns';
import axiosInstance from 'utils/axiosClient';

interface DailyRevenueChartProps {
  selectedDate: Date;
}

const DailyRevenueChart: React.FC<DailyRevenueChartProps> = ({ selectedDate }) => {
  const [totalPriceForDay, setTotalPriceForDay] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch daily revenue data from the API
  const fetchOrdersByDate = async (date: string) => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(`/api/admin/get-daily-revenue?updatedAt=${date}`);

      if (response.status !== 200) {
        throw new Error('Failed to fetch data');
      }

      const data = response.data;

      if (data?.data?.length > 0) {
        const totalPriceForDay = data.data.reduce(
          (acc: number, item: any) => acc + item.totalPrice,
          0,
        );
        setTotalPriceForDay(totalPriceForDay);
      } else {
        setTotalPriceForDay(0);
      }
    } catch (error) {
      console.error('Error fetching daily revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    fetchOrdersByDate(formattedDate);
  }, [selectedDate]);

  return (
    <div className="w-full rounded-xl bg-white px-10 py-5 shadow-lg drop-shadow-md">
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <span>Loading...</span> {/* You can replace this with a spinner if needed */}
        </div>
      ) : (
        <Chart
          options={{
            chart: {
              id: 'daily-revenue',
            },
            xaxis: {
              categories: ['Doanh thu'],
            },
            title: {
              text: 'Doanh thu ngày',
            },
          }}
          series={[
            {
              name: 'Doanh thu',
              data: [totalPriceForDay],
            },
          ]}
          type="bar"
          height="300"
          width={700}
        />
      )}
    </div>
  );
};

export default DailyRevenueChart;
