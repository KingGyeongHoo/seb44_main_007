import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist';
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import dataSlice from "./reducers";
import { expendReducer, profitReducer, targetReducer,  } from './account_reducer';
import dataReducer from './submit_data_reducer';
import selectedDateReducer from './date_reducer'
import idReducer from './id_reducer'; // 새로운 slice를 추가합니다.
import { wishListReducer, useableReducer } from './wishlist_reducer';
import paymentReducer from './payment_reducer'; // 새로운 slice를 추가합니다.
import loginMemberReducer from './loginMemberReducer'
import payInfoReducer from './payInfo_reducer'
import thunk from 'redux-thunk';

const persistConfig = {
  key: "root", // localStorage key 
  storage, // localStorage
  whitelist: ["loginMember"], // target (reducer name)
}

const rootReducer = combineReducers({
  data: dataSlice,
  totalExpend: expendReducer, //지출 총 합
  totalProfit: profitReducer, //수익 총 합
  targetExpend: targetReducer, //목표 지출 금액
  accountData: dataReducer, // 데이터 리스트
  selectedDate: selectedDateReducer, //선택한 날짜
  id: idReducer, // 새로운 slice를 rootReducer에 추가합니다.
  wishlist: wishListReducer,
  useAble: useableReducer,
  payment: paymentReducer,
  loginMember: loginMemberReducer,
  payInfo: payInfoReducer
});

const persReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persReducer,
  middleware: [thunk]
});

export default store;
