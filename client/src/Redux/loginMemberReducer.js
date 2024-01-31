import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginMember: {}
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