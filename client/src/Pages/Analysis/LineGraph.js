import React, { useState } from "react";
import styled from "styled-components";

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

const LineGraph = () => {
  const data = [55, 47, 75, 40, 75, 70, 40, 60, 55, 85, 52, 63];
  const day = ['22.08','22.09','22.10','22.11','22.12','23.01','23.02','23.03','23.04','23.05','23.06','23.07',];
  const dataMap = data.map((value) => value * 10020);
  const maxDataValue = Math.max(...data);
  const dataMap2 = data.map((value) => 120 - value);

  const LineConnectorComponent = ({ data }) => {
    return (
      <LineConnector>
        {data.map((value, index) => {
          const nextValue = data[index + 1];
          if (nextValue !== undefined) {
            const x1 = ((index + 0.5) * 100) / data.length + "%";
            const y1 = (maxDataValue - value) + "px"; // Adjust the y position
            const x2 = ((index + 1) * 100) / data.length + 4 + "%";
            const y2 = (maxDataValue - nextValue) + "px"; // Adjust the y position
            return <Line key={index} x1={x1} y1={y1} x2={x2} y2={y2} />;
          }
          return null;
        })}
      </LineConnector>
    );
  };


  const Line = ({ x1, y1, x2, y2 }) => (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="#C5FF78"
      strokeWidth="0.7"
      strokeLinecap="round" // Optional: Add rounded line ends
    />
  );

  const GraphContainer = ({ value, index }) => {
    return (
      <DataWrap>
        <GraphTop value={value}/>
        <GraphBottom>
          <p>{day[index]}</p>
          <p>{dataMap[index].toLocaleString()}원</p>
        </GraphBottom>
      </DataWrap>
    );
  };

  return (
    <GraphWrap>
      <LineConnectorComponent data={data} />
      {dataMap2.map((value, index) => (
        <GraphContainer key={index} value={value} index={index} />
      ))}
    </GraphWrap>
  );
};

export default LineGraph;
