import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginMember: null, // 초기 값은 null로 설정합니다.
};

const loginMemberSlice = createSlice({
  name: "loginMember",
  initialState,
  reducers: {
    setLoginMember: (state, action) => {
      state.loginMember = action.payload;
    },
  },
});

export const { setLoginMember } = loginMemberSlice.actions;
export default loginMemberSlice.reducer;