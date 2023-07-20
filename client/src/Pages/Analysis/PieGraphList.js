import React from "react";
import styled from "styled-components";
import Palette from "../../Palette/Palette";
const ListUL = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: auto;
`;
const Listli = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  color: #ffffff;
  justify-content: space-between;
`;
const ListDot = styled.div`
  width: 10px;
  height: 10px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 10px;
`;
const ListCategory = styled.div`
  font-size: 16px;
  margin-right: 10px;
  width: 80px;
`;
const ListPercentage = styled.div`
  font-size: 16px;
`;
const ListPrice = styled.div`
  font-size: 20px;
  flex: auto;
  text-align: right;
`;

function PieGraphList({ data }) {
  const sum = data.reduce((sums, obj) => {
    const { amount, category } = obj;
    if (sums[category]) {
      sums[category] += amount;
    } else {
      sums[category] = amount;
    }
    return sums;
  }, {});
  const chartData = Object.entries(sum)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  const totalSum = chartData.reduce((sum, obj) => sum + obj.value, 0);

  // Convert data to the desired format
  const ListData = chartData.map((obj) => ({
    category: obj.name,
    percentage: ((obj.value / totalSum) * 100).toFixed(2),
    price: obj.value,
    color: Palette[obj.name.toLowerCase().replace(/ /g, "_")],
  }));

  return (
    <ListUL>
      {ListData.map((it) => {
        return (
          <Listli>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ListDot color={it.color} />
              <ListCategory> {it.category}</ListCategory>
              <ListPercentage> {it.percentage}%</ListPercentage>
            </div>
            <ListPrice> {it.price} 원</ListPrice>
          </Listli>
        );
      })}
    </ListUL>
  );
}

export default PieGraphList;
