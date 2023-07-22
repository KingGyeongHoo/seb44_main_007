import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { totalProfit, totalExpend } from '../../../Redux/account_reducer'
import { selectDate } from '../../../Redux/date_reducer';
import * as S from './accountbookMain_style';
import TargetAmountModal from "./targetAmountModal";
// import { ko } from "date-fns/esm/locale";
import 'react-datepicker/dist/react-datepicker.css';
import { Calender } from './calender';
import leftIcon from '../../../Images/left_arrow.png'
import rightIcon from '../../../Images/right_arrow.png'
import EditDelete from './edit,delete';

import axios from 'axios'
import apiUrl from '../../../API_URL';

const AccountbookMain = () => {
  const memberId = localStorage.getItem('memberId')

  //유저 정보 받아오기
  const [memberName, setMemberName] = useState('');

  useEffect(() => {
      const fetchMember = async () => {
      try {
          const response = await axios.get(`${apiUrl.url}/members/${memberId}`,{
              headers: {
                'ngrok-skip-browser-warning': '69420',
                'withCredentials': true,
                'Authorization': localStorage.getItem('Authorization-Token'),
              },
            });
            setMemberName(response.data.data.name);
      } catch (error) {
          console.error(error);
      }
      };

      fetchMember();
  }, []);

  //데이터 받아오기
  const [accountData, setAccountData] = useState([]);

  useEffect(() => {
      const getData = async () => {
      try {
          const response = await axios.get(`${apiUrl.url}/trades/${memberId}?startDate=2023-07-01&endDate=2023-07-31`,{
              headers: {
                'ngrok-skip-browser-warning': '69420',
                'withCredentials': true,
                'Authorization': localStorage.getItem('Authorization-Token'),
              },
            });
            setAccountData(response.data);
      } catch (error) {
          console.error(error);
      }
    };
    getData();
  }, [memberId]);

  const dispatch = useDispatch();
  // const targetExpend = useSelector((state) => state.targetExpend);
  const totalProfitSelector = useSelector((state) => state.totalProfit);
  const totalExpendSelector = useSelector((state) => state.totalExpend);
  
  const [activeTab, setActiveTab] = useState(0);

  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : '0' + (today.getMonth() + 1);
  const day = today.getDate() > 9 ? today.getDate() : '0' + today.getDate();

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  
  //날짜
  const selectedDate = useSelector((state) => state.selectedDate);
  
  const handleDateChange = (date) => {
    dispatch(selectDate(date));
  };

  const currentDate = selectedDate.selectedDate;

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const day = String(formattedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const formatDateShort = (date) => {
    const formattedDate = new Date(date);
    const month = formattedDate.toLocaleString('en-US', { month: 'short' });
    const day = formattedDate.getDate();
    const formattedString = `${month} ${day}`;
    return formattedString;
}

  // console.log(new Date())
  // console.log(currentDate)
  // console.log(formatDate(currentDate))

  //총 수입, 지출 리듀서
  // const accountDataList = useSelector((state) => state.accountData.accountDataList); 
  const accountDataList = accountData;
  
  useEffect(() => {
    const calTotalProfit = () => {
      const ProfitData = Array.isArray(accountDataList)
      ? accountDataList.filter((item) => item.type === '수입')
        .reduce((sum, item) => sum + item.amount, 0)
      : 0;
      dispatch(totalProfit(ProfitData));
    };
    const calTotalExpend = () => {
      const ExpendData = Array.isArray(accountDataList)
      ? accountDataList.filter((item) => item.type === '지출')
        .reduce((sum, item) => sum + item.amount, 0)
      :0;
      dispatch(totalExpend(ExpendData));
    };

    calTotalProfit();
    calTotalExpend();
  }, [dispatch, accountDataList] );


  // 목표 지출 금액 서버에서 받아오기
  const [amountGoal, setAmountGoal] = useState(10);

  useEffect(() => {
    const getAmountGoal = async () => {
      try {
        const response = await axios.get(`${apiUrl.url}/totals/${memberId}`, {
          headers: {
            'ngrok-skip-browser-warning': '69420',
            'withCredentials': true,
            'Authorization': localStorage.getItem('Authorization-Token'),
          },
        });
        setAmountGoal(response.data[0].goal);
      } catch (error) {
        console.error(error);
      }
    };
    getAmountGoal()
  }, [memberId]);
  
    return (
      <>
      <S.AccountbookPage>
        <S.AccountbookWrapper>
            <S.userWelcome>{memberName}님 환영합니다!</S.userWelcome>
            <S.AccountBox>
              <S.InnerWrapper>
                <S.Title>총 수입</S.Title>
                <S.Amount>{totalProfitSelector.toLocaleString()}</S.Amount>
              </S.InnerWrapper>
              <S.InnerWrapper>
                <S.Title>총 지출</S.Title>
                <S.Amount>{totalExpendSelector.toLocaleString()}</S.Amount>
              </S.InnerWrapper>
              <S.InnerWrapperGoal>
                <S.Title>
                  목표 지출 금액
                  <TargetAmountModal />
                </S.Title>
                <S.AmountGoal>{amountGoal.toLocaleString()}</S.AmountGoal>
              </S.InnerWrapperGoal>
            </S.AccountBox>
            
            <S.AccountbookSection>
              <S.AccountbookHeader>
                <S.TabHeader active={activeTab === 0}>
                  <S.TabHeaderWrapper>
                    <p>날짜 선택</p>
                    <S.CustomDatePicker
                      className='datePicker'
                      value={selectedDate}
                      selected={new Date(currentDate)}
                      onChange={handleDateChange}
                      dateFormat="yyyy-MM-dd"
                    />
                  </S.TabHeaderWrapper>
                </S.TabHeader>
                <S.TabHeader active={activeTab === 1}>
                  <p>Today {`${year}-${month}-${day}`}</p>
                </S.TabHeader>
                <div>
                  <S.TabButton active={activeTab===0} onClick={() => handleTabClick(0)}>일별</S.TabButton>
                  <S.TabButton active={activeTab===1} onClick={() => handleTabClick(1)}>월별</S.TabButton>
                </div>
              </S.AccountbookHeader>
              <S.AccountbookContents>
                <S.TabContents active={activeTab === 0}>
                  <S.DatePage>
                    <img src={leftIcon} alt="<" />
                    <p>날짜 페이지 네이션</p>
                    <img src={rightIcon} alt=">" />
                  </S.DatePage>
                  <S.DateContent>
                    <S.MonthDay>{formatDateShort(currentDate)}</S.MonthDay>
                    <S.DataUl>
                      {Array.isArray(accountDataList)?accountDataList.filter((data) => data.date === formatDate(currentDate)).map((item) => {return(
                        <S.DataLi>
                          <S.Dot category={item.category}/>
                          <S.Category>{item.category}</S.Category>
                          <S.TradeName>{item.tradeName}</S.TradeName>
                          <S.Note>{item.note}</S.Note>
                          <S.AmountLi isIncome={item.type === "수입"}>
                            {item.type === "수입" 
                            ? '+ '+(item.amount.toLocaleString()) 
                            : '- '+(item.amount.toLocaleString())}
                          </S.AmountLi>
                          <EditDelete data={item.tradeId}/>
                        </S.DataLi>
                      );
                      }):''}
                    </S.DataUl>
                  </S.DateContent>
                </S.TabContents>
                <S.TabContents active={activeTab === 1}>
                  <Calender />
                </S.TabContents>
              </S.AccountbookContents>
            </S.AccountbookSection>
          </S.AccountbookWrapper>
        </S.AccountbookPage>
      </>
    );
  };
  
  export default AccountbookMain;
