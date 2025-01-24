import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { DashboardStats, TopProduct } from '../../types/models';
import { dashboardService } from '../services/dashboard.service';

interface DashboardState {
  stats: DashboardStats | null;
  topProducts: TopProduct[];
  salesTarget: {
    target: number;
    current: number;
  } | null;
  chartData: { date: string; value: number }[];
  loading: boolean;
  error: string | null;
}

interface DashboardData {
  stats: DashboardStats;
  topProducts: TopProduct[];
  salesTarget: {
    target: number;
    current: number;
  };
  chartData: { date: string; value: number }[];
}

const initialState: DashboardState = {
  stats: null,
  topProducts: [],
  salesTarget: null,
  chartData: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchDashboardData = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>('dashboard/fetchData', async (_, { rejectWithValue }) => {
  try {
    // For development, use mock data
    return dashboardService.getMockData();
    
    // For production, uncomment these lines:
    /*
    const [stats, topProducts, salesTarget, chartData] = await Promise.all([
      dashboardService.getOverviewStats(),
      dashboardService.getTopProducts(),
      dashboardService.getSalesTarget(),
      dashboardService.getChartData(),
    ]);

    return {
      stats,
      topProducts,
      salesTarget,
      chartData,
    };
    */
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboard: (state: DashboardState) => {
      state.stats = null;
      state.topProducts = [];
      state.salesTarget = null;
      state.chartData = [];
      state.error = null;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<DashboardState>) => {
    builder
      .addCase(fetchDashboardData.pending, (state: DashboardState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state: DashboardState, action: PayloadAction<DashboardData>) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.topProducts = action.payload.topProducts;
        state.salesTarget = action.payload.salesTarget;
        state.chartData = action.payload.chartData;
      })
      .addCase(fetchDashboardData.rejected, (state: DashboardState, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer; 