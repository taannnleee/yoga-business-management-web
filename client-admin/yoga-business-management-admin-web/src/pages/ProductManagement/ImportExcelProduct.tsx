import { useState } from 'react';
import { Button } from '@mui/material';
import axiosInstance from 'utils/axiosClient';
import { toast } from 'react-toastify';

const ImportExcelProduct = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Vui lòng chọn file Excel!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axiosInstance.post('/api/admin/import-products-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Import thành công!');
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi khi import file Excel!');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <Button variant="contained" color="primary" onClick={handleImport}>
        Import Excel
      </Button>
    </div>
  );
};

export default ImportExcelProduct;
