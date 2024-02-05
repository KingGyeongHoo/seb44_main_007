import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    payInfo:{
        next_redirect_pc_url: null,
        tid: null // 초기 값은 null로 설정합니다.
    }
    
};

const payInfoSlice = createSlice({
  name: "payInfo",
  initialState,
  reducers: {
    setPayInfo: (state, action) => {
      state.payInfo = action.payload
    },
  },
});

export const { setPayInfo } = payInfoSlice.actions;
export default payInfoSlice.reducer;