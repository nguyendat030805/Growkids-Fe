// features/display/hooks/useDisplayData.ts
import { Logger } from '@/src/core/utils/Logger';
import { useEffect, useState } from 'react';
import { DisplayService } from '../services/DisplayService';
import { DisplayItem } from '../types/DisplayType';

export const useDisplayData = () => {
  const [data, setData] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await DisplayService.fetchItems();
        setData(result);
      } finally {
        setLoading(false);
        Logger.log('Đã tải xong dữ liệu vào Hook');
      }
    };

    loadData();
  }, []);

  return { data, loading };
};
