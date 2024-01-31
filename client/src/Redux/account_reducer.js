import { createSlice } from '@reduxjs/toolkit';

// 총 지출 금액
const expendSlice = createSlice({
  name: 'totalExpend',
  initialState: 0,
  reducers: {
    totalExpend : (state, action) => parseInt(action.payload),
  },
})

export const { totalExpend } = expendSlice.actions;
export const expendReducer = expendSlice.reducer;

// 총 수입 금액
const profitSlice = createSlice({
  name: 'totalProfit',
  initialState: 0,
  reducers: {
    totalProfit : (state, action) => parseInt(action.payload),
  },
})

export const { totalProfit } = profitSlice.actions;
export const profitReducer = profitSlice.reducer;


// 목표 지출 금액 설정
const targetSlice = createSlice({
  name: 'targetExpend',
  initialState: 0,
  reducers: {
    setTargetExpend : (state, action) => action.payload,
  },
});

export const { setTargetExpend } = targetSlice.actions;
export const targetReducer = targetSlice.reducer;
