import React, { useState, useEffect, PureComponent } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  Label,
  LabelList,
  ResponsiveContainer
} from 'recharts';
import styled from "styled-components";
import {useSelector} from 'react-redux'

const GraphWrap = styled.div`
  padding: 1%;
  width: 100%;
  height: 100%;
  display: flex;
`;
const DataWrap = styled.div`
  position: relative;
  width: 8.3%;
  height: 100%;
`;
const GraphTop = styled.div`
  height: 80%;
  width: 16px;
  background-color: rgb(25, 25, 25);
  margin: auto;
  position: relative;
  border-radius: 3px 3px 0 0;

  &::after {
    content: "";
    position: absolute;
    top: ${(props) => props.value}px;
    left: 50%;
    height: 7px;
    width: 7px;
    background-color: #C5FF78;
    border-radius: 50%;
    transform: translateX(-50%);
  }
`;
const GraphBottom = styled.div`
  border-top: 1px solid rgb(25, 25, 25);
  width: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  > p {
    color: rgb(160, 160, 160);
    font-size: 14px;
    margin-top: 7px;
    &:last-child {
      color: White;
      font-size: 12px;
    margin-top: 4px;
    }
  }
`;

const LineConnector = styled.svg`
  position: fixed;
  top: 746px;
  left: 389px;
  height: 100%;
  width: 71.3%;
  z-index: 2;
`;

const LineGraph = ({selectedMonth}) => {
  const date = new Date()
  const year = date.getFullYear()
  const month = selectedMonth.slice(5, 7)/1
  const monthArray = Array
  .from({ length: 12 }, (_, index) => (selectedMonth.slice(5, 7)/1 + index) % 12 || 12)
  .map(curMonth => {
    if(curMonth >= month){
      if(curMonth < 10){
        return `${year-1}-0${curMonth}`
      } else {
        return `${year-1}-${curMonth}`
      }
    } else {
      if(curMonth < 10){
        return `${year}-0${curMonth}`
      } else {
        return `${year}-${curMonth}`
      }
    }
  });

  const tradeData = useSelector(state => state.loginMember.loginMember.trade)
  const data = monthArray.map(el => {
    return(
      {
        date: el,
        amount: tradeData
        .filter(item => item.date.slice(0, 7) === el && item.type === "지출")
        .reduce((acc, cur) => acc + cur.amount, 0)
      }
    )
  })
  const maxDataValue = Math.max(...data);

  const CustomizedLabel = (props) => {
    const { x, y, value } = props;
  
    return (
      <text x={x} y={y} dx={10} dy={-5}  fill="#8884d8" fontSize={16} textAnchor="middle">
        {value.toLocaleString()}
      </text>
    );
  };

  const formatXAxis  = (tickItem => tickItem.toLocaleString())

  return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
        >
          <XAxis dataKey="date" />
          <Bar dataKey="amount" barSize={20} fill="#413ea0">
            <LabelList
              dataKey="amount"
              position="top"
              fill="#ffffff"
              content={<CustomizedLabel />}
            />
          </Bar>
          <Line type="monotone" dataKey="amount" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
  );
};

export default LineGraph;
