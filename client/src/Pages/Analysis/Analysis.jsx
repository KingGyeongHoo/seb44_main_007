import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

import rightArrow from '../../Images/right_arrow.png'
import leftArrow from '../../Images/left_arrow.png'

// component import
import PieGraph from "./PieGraph";
import PieGraphList from "./PieGraphList";
import CategoryCompare from "./CategoryCompare";
import LineGraph from "./LineGraph";

function Analysis() {

  const memberId = localStorage.getItem('memberId')
  const navigate = useNavigate()
    if (memberId === null) {
      navigate("/login");
    }

  //데이터 받아오기
  // const [accountData, setAccountData] = useState([]);
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  const memberData = useSelector(state => state.loginMember.loginMember.trade)
  const [accountData, setAccountData] = useState(memberData.filter(el => el.date.slice(5, 7)/1 === month && el.date.slice(0, 4)/1 === year))
  const [lastmonthData, setLastmonthData] = useState(memberData.filter(el => el.date.slice(5, 7)/1 === month - 1 && (month === 1 ? el.date.slice(0, 4)/1 === year - 1 : el.date.slice(0, 4)/1 === year))) // 전체 데이터(지난달)

  useEffect(() => {
    setAccountData(memberData.filter(el => el.date.slice(5, 7)/1 === month && el.date.slice(0, 4)/1 === year))
    setLastmonthData(memberData.filter(el => el.date.slice(5, 7)/1 === month - 1 && (month === 1 ? el.date.slice(0, 4)/1 === year - 1 : el.date.slice(0, 4)/1 === year)))
  }, [month])

  // 수입,지출 총 금액 산정
  const totalProfitSelector = accountData.filter(el => el.type === "수입").reduce((acc, cur) => acc + cur.amount, 0);
  const totalExpendSelector = accountData.filter(el => el.type === "지출").reduce((acc, cur) => acc + cur.amount, 0);

  // function
  const goToPrev = () => {
      if (month === 1) {
        setYear(year - 1); // 연도 하나 줄어듬
        setMonth(12);
      } else {
        setMonth(month - 1);
      }
  };
  const goToNext = (type) => {
    if (month === 12) {
      setYear(year + 1); // 연도 하나 늘어남
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };
  return (
    <AnalysisPage>    
      <PageTop>
        <PageMoveImg src={leftArrow} onClick={goToPrev} value="prev" />
        <p>{year}년 {month}월</p>
        <PageMoveImg src={rightArrow} onClick={goToNext} value="next" />
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
          <LineGraph selectedMonth={`${year}-${month}`} />
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
  height: 100%;
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

