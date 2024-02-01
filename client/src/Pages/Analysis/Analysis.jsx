import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

import rightArrow from '../../Images/right_arrow.png'
import leftArrow from '../../Images/left_arrow.png'

import axios from 'axios'
import apiUrl from '../../API_URL';

// component import
import PieGraph from "./PieGraph";
import PieGraphList from "./PieGraphList";
import CategoryCompare from "./CategoryCompare";
import LineGraph from "./LineGraph";

const lastDummy = [
  {
    tradeId: 1,
    type: "지출",
    tradeName: "커피",
    amount: 4900,
    note: "메가커피에서 커피 수혈",
    date: "2023-06-01",
    category: "식비_간식",
  },
  {
    tradeId: 2,
    type: "지출",
    tradeName: "아이스크림",
    amount: 1200,
    note: "너무 더워서 아이스크림 하나 쪽쪽",
    date: "2023-06-01",
    category: "식비_간식",
  },
  {
    tradeId: 3,
    type: "지출",
    tradeName: "맥주",
    amount: 32000,
    note: "톰 크루즈와 부평에서 시원한 맥주 한잔",
    date: "2023-06-01",
    category: "식비_간식",
  },
  {
    incomeId: 1,
    type: "수입",
    tradeName: "n빵",
    amount: 14500,
    note: "톰형 반띵하기로 해놓고 환율+해외송금 수수료 핑계대면서 14500원만 보냄",
    date: "2023-06-02",
    category: "기타수입",
  },
  {
    tradeId: 4,
    type: "지출",
    tradeName: "냉면",
    amount: 9000,
    note: "해장에는 역시 냉면",
    date: "2023-06-02",
    category: "식비_간식",
  },
  {
    tradeId: 5,
    type: "지출",
    tradeName: "누진세",
    amount: 16000,
    note: "뉴진스 콘서트 예매한다는게 누진세를 내버림",
    date: "2023-06-02",
    category: "보험_세금",
  },
  {
    tradeId: 6,
    type: "지출",
    tradeName: "셔츠",
    amount: 45000,
    note: "매우 맘에 듬",
    date: "2023-06-02",
    category: "의류_미용",
  },
  {
    tradeId: 7,
    type: "지출",
    tradeName: "이마트",
    amount: 4900,
    note: "커피 구매",
    date: "2023-06-03",
    category: "생활_마트",
  },
  {
    fixedId: 1,
    type: "지출",
    tradeName: "월세",
    amount: 400000,
    note: "월세 지출,,,,",
    date: "2023-06-03",
    category: "주거_통신",
  },
  {
    tradeId: 8,
    type: "지출",
    tradeName: "야구 경기 관람",
    amount: 12000,
    note: "길바닥에 돈을 버리고 왔다.",
    date: "2023-06-04",
    category: "교육_문화",
  },
  {
    tradeId: 9,
    type: "지출",
    tradeName: "유니폼 구매",
    amount: 55000,
    note: "방바닥 닦을 걸레가 하나 더 생겼나",
    date: "2023-06-04",
    category: "식비_간식",
  },
  {
    tradeId: 10,
    type: "지출",
    tradeName: "맥주",
    amount: 50000,
    note: "찬호형과 경기를 곱씹으며 맥주 한잔",
    date: "2023-06-04",
    category: "식비_간식",
  },
  {
    incomeId: 2,
    type: "지출",
    tradeName: "교통비",
    amount: 50000,
    note: "지하철",
    date: "2023-06-05",
    category: "교통_차량",
  },
  {
    incomeId: 3,
    type: "지출",
    tradeName: "찬호형 n빵",
    amount: 30000,
    note: "송금 메모가 '제가LA에있을' 에서 끊겨 있다.",
    date: "2023-06-05",
    category: "의료_건강",
  },
];
// Dummy Data Import

function Analysis() {

  const memberId = localStorage.getItem('memberId')
  const navigate = useNavigate()
    if (memberId === null) {
      navigate("/login");
    }

  //데이터 받아오기
  const [accountData, setAccountData] = useState([]);
  const [lastmonthData, setLastMonthData] = useState(lastDummy); // 전체 데이터(지난달)

  useEffect(() => {
      const getData = async () => {
      try {
          const response = await axios.get(`${apiUrl.url}/trades/${memberId}?startDate=2023-0${month}-01&endDate=2023-0${month}-31`,{
              headers: {
                'ngrok-skip-browser-warning': '69420',
                'withCredentials': true,
                'Authorization': localStorage.getItem('Authorization-Token'),
              },
            });
            setAccountData(response.data);
            // 지난달 데이터 받아오기
            // axios.get(`${apiUrl.url}/trades/${memberId}?startDate=2023-0${month-1}-01&endDate=2023-0${month-1}-31`,{
            //   headers: {
            //     'ngrok-skip-browser-warning': '69420',
            //     'withCredentials': true,
            //     'Authorization': localStorage.getItem('Authorization-Token'),
            //   },
            // })
            // .then(res => setLastMonthData(res.data))
      } catch (error) {
          console.error(error);
      }
    };
    getData();
  }, [memberId]);

  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  // get Data from Redux
  const initData = useSelector((state) => state.data.initData);

  // dataState
  const [monthData, setMonthData] = useState([]); // 전체 데이터(이번달)
  const [spend, setSpend] = useState(0); // 총 지출
  const [income, setIncome] = useState(0); // 총 수입
  const [spendData, setSpendData] = useState([]); // 지출 데이터
  const [incomeData, setIncomeData] = useState([]); //수입 데이터


  // 받아온 데이터를 설정한 달에 맞게 filter
  useEffect(() => {
    const filterData = initData.filter((it) => {
      const date = new Date(it.date);
      const datayear = date.getFullYear();
      const datamonth = date.getMonth() + 1;

      return datayear === year && datamonth === month;
    });
    setMonthData(filterData);
  }, [initData, month, year]);

  // 수입,지출 총 금액 산정
  const totalProfitSelector = useSelector((state) => state.totalProfit); //총 수입
  const totalExpendSelector = useSelector((state) => state.totalExpend); //총 지출
  const accountDataList = accountData;
  
  // //서버
  // useEffect(() => {
  //   const ExpendData = Array.isArray(accountDataList) // 지출 데이터
  //     ? accountDataList.filter((item) => item.type === '지출')
  //     : 0;
  //   setSpendData(ExpendData);
  //   const ProfitData = Array.isArray(accountDataList) //수입 데이터
  //     ? accountDataList.filter((item) => item.type === '수입')
  //     : 0;
  //   setIncomeData(ProfitData);
  // }, [accountDataList]);

  useEffect(() => {
    const filterData1 = monthData.reduce((acc, cur, idx) => {
      if (cur.type === "지출") {
        return (acc += cur.amount);
      }
      return (acc += 0);
    }, 0);
    setSpend(filterData1);
    const filterData2 = monthData.reduce((acc, cur, idx) => {
      if (cur.type === "수입") {
        return (acc += cur.amount);
      }
      return (acc += 0);
    }, 0);
    setIncome(filterData2);
    const filterData3 = monthData.filter((it) => {
      return it.type === "지출";
    });
    setSpendData(filterData3);
    const filterData4 = monthData.filter((it) => {
      return it.type === "수입";
    });
    setIncomeData(filterData4);
  }, [monthData]);


  // function
  const onClickHandler = (e) => {
    const result = e.target.value;
    if (result === "prev") {
      if (month === 1) {
        setYear(year - 1); // 연도 하나 줄어듬
        setMonth(12);
      } else {
        setMonth(month - 1);
      }
    } else {
      if (month === 12) {
        setYear(year + 1); // 연도 하나 늘어남
        setMonth(1);
      } else {
        setMonth(month + 1);
      }
    }
  };
  return (
    <AnalysisPage>    
      <PageTop>
        <PageMoveImg src={leftArrow} onClick={onClickHandler} value="prev" />
        <p>{year}년 {month}월</p>
        <PageMoveImg src={rightArrow} onClick={onClickHandler} value="next" />
      </PageTop>
      <PageWrap>
        <PageMiddle>
          <MiddleLeft>
            <TotalContent>
              <Title>
                <InnerTitle>지출</InnerTitle>
                <span>총</span>
                <p>{totalExpendSelector.toLocaleString()} 원</p>
              </Title>
              <GraphZone>
                <PieGraph data={
                  Array.isArray(accountData) // Check if accountData is an array
                    ? accountData.filter(el => el.type === '지출') // Use filter if it's an array
                    : [] // Otherwise, use an empty array
                } />
                <PieGraphList alt="그래프리스트" data={
                  Array.isArray(accountData) // Check if accountData is an array
                    ? accountData.filter(el => el.type === '지출') // Use filter if it's an array
                    : [] // Otherwise, use an empty array
                } />
              </GraphZone>
            </TotalContent>
            <TotalContent>
              <Title>
                <InnerTitle>수입</InnerTitle>
                <span>총</span>
                <p>{totalProfitSelector.toLocaleString()} 원</p>
              </Title>
              <GraphZone>
                <PieGraph alt="원형그래프" data={
                  Array.isArray(accountData) // Check if accountData is an array
                    ? accountData.filter(el => el.type === '수입') // Use filter if it's an array
                    : [] // Otherwise, use an empty array
                }/>
                <PieGraphList alt="그래프리스트" data={
                  Array.isArray(accountData) // Check if accountData is an array
                    ? accountData.filter(el => el.type === '수입') // Use filter if it's an array
                    : [] // Otherwise, use an empty array
                } />
              </GraphZone>
            </TotalContent>
          </MiddleLeft>
          <MiddleRight>
            <MiddleRightTop>
              <InnerTitle style={{border : 'none'}}>카테고리별 지난달 지출 비교</InnerTitle>
              <RightlegendWrap>
                <Rightlegend>
                  <ListDot style={{backgroundColor : "#F4CD72"}} />
                  <p>이번 달</p>
                </Rightlegend>
                <Rightlegend>
                  <ListDot style={{background: 'linear-gradient(to left, rgba(100,100,100,1), rgba(100,100,100,0.5))'}} />
                  <p>지난 달</p>
                </Rightlegend>
              </RightlegendWrap>
            </MiddleRightTop>
            <MiddleRightBottomWrap>
              <CategoryCompare
                spendData={accountData}
                lastmonthData={lastmonthData}
              />
            </MiddleRightBottomWrap>
          </MiddleRight>
        </PageMiddle>
        <PageBottom>
          <InnerTitle style={{marginBottom: '20px',border : 'none'}}>월별 지출 비교</InnerTitle>
          <LineGraph />
        </PageBottom>
      </PageWrap>
    </AnalysisPage>
  );
}

export default Analysis;

const AnalysisPage = styled.div`
  background-color: rgb(34, 34, 31);
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: calc(100% - 300px);
  height: 100vh;
  color: white;
`;

const PageWrap = styled.div`
  background-color: rgb(34, 34, 31);
  display: flex;
  flex-direction: column;
  padding: 40px;
  height: 100vh;
  color: white;
`;

// PageTop
const PageTop = styled.div`
  display: flex;
  align-items: center;
  > p {
    font-size: 18px;
    font-weight: 500;
    color: rgb(210, 210, 210);
    margin: 0 16px;
  }
`;

const PageMoveImg = styled.img`
  width: 20px;
  filter: invert(69%) sepia(0%) saturate(201%) hue-rotate(210deg) brightness(93%) contrast(90%);
`;

//PageMiddle
const PageMiddle = styled.div`
  display: flex;
  justify-content: space-between;
  height: 600px;
`;
// MiddleLeft
const MiddleLeft = styled.div`
  width: 650px;
  display: flex;
  flex-direction: column;
  margin-right: 100px;
`;

// TotalContent
const TotalContent = styled.div`
  margin-bottom: 20px;
  height: 250px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  > span {
    font-size: 14px;
    margin-right: 8px;
  }
  > p {
    font-size: 18px;
    font-weight: 600;
  }
`;

const InnerTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  border-right: 1px solid rgb(210, 210, 210);
  padding-right: 20px;
  margin-right: 20px;
`
const GraphZone = styled.div`
  width: 100%;
  display: flex;
`;

// MiddleRight
const MiddleRight = styled.div`
  width: 600px;
  display: flex;
  flex-direction: column;
`;
// MiddleRightTop
const MiddleRightTop = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const RightlegendWrap = styled.div`
`;
const Rightlegend = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  > p {
    color: rgb(160, 160, 160);
    font-size: 12px;
  }
`;
const ListDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 20%;
  margin-right: 10px;
`;
// MiddleRightBottom
const MiddleRightBottomWrap = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  flex: 1;
  padding: 0 20px 50px 20px;
`;

const PageBottom = styled.div`
  height: 30%;
`;

