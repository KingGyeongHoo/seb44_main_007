import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
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

  const CustomizedLabel = (props) => {
    const { x, y, value } = props;
  
    return (
      <text x={x} y={y} dx={10} dy={-5}  fill="#8884d8" fontSize={16} textAnchor="middle">
        {value.toLocaleString()}
      </text>
    );
  };

  return (
    <GraphWrap>
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
    </GraphWrap>
  );
};

export default LineGraph;
