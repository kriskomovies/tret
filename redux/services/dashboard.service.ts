import { api, handleApiError } from './api.utils';
import { DashboardStats, TopProduct } from '../../types/models';

export const dashboardService = {
  async getOverviewStats(): Promise<DashboardStats | { error: boolean; message: string }> {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getTopProducts(): Promise<TopProduct[] | { error: boolean; message: string }> {
    try {
      const response = await api.get('/dashboard/top-products');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getSalesTarget(): Promise<{ target: number; current: number } | { error: boolean; message: string }> {
    try {
      const response = await api.get('/dashboard/sales-target');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getChartData(period: string = 'monthly'): Promise<{ date: string; value: number }[] | { error: boolean; message: string }> {
    try {
      const response = await api.get(`/dashboard/chart?period=${period}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Mock data for development
  getMockData() {
    return {
      stats: {
        total_profit: 82373.21,
        total_order: 7234,
        impression: 3100000,
        profit_change: 3.4,
        order_change: -2.8,
        impression_change: 4.8,
      },
      topProducts: [
        {
          id: 1,
          name: 'Maneki Neko Poster',
          sold: 1249,
          change: 15.2,
          image: '/products/maneki.jpg'
        },
        {
          id: 2,
          name: 'Echoes Necklace',
          sold: 1145,
          change: 13.9,
          image: '/products/necklace.jpg'
        },
        {
          id: 3,
          name: 'Spiky Ring',
          sold: 1073,
          change: 8.5,
          image: '/products/ring.jpg'
        }
      ],
      salesTarget: {
        target: 1800,
        current: 1300
      },
      chartData: Array.from({ length: 12 }, (_, i) => ({
        date: `${i + 1} Jun`,
        value: 270 + Math.random() * 300
      }))
    };
  }
}; 