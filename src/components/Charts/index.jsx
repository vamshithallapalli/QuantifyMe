import React from "react";
import "./style.css";
import { Line, Pie } from "@ant-design/charts";
import { Empty } from "antd";

const ChartComponent = ({ sortedTransactions }) => {
  const safeData = Array.isArray(sortedTransactions) ? sortedTransactions : [];
  const data = safeData.map((item) => ({
    date: item?.date || "",
    amount: item?.amount || 0,
  }));

  const spendingData = safeData
    .filter((transaction) => transaction.type === "expense")
    .map((transaction) => ({
      tag: transaction.tag || "Other",
      amount: transaction.amount || 0,
    }));

  let newSpending = [
    { tag: "food", amount: 0 },
    { tag: "office", amount: 0 },
    { tag: "education", amount: 0 },
    { tag: "grocery", amount: 0 },
    { tag: "emi", amount: 0 },
  ];

  spendingData.forEach((item) => {
    if (item.tag === "food") {
      newSpending[0].amount += item.amount;
    } else if (item.tag === "office") {
      newSpending[1].amount += item.amount;
    } else if (item.tag === "education") {
      newSpending[2].amount += item.amount;
    } else if (item.tag === "grocery") {
      newSpending[3].amount += item.amount;
    } else {
      newSpending[4].amount += item.amount;
    }
  });

  const config = {
    data,
    width: 500,
    // autoFit: true,
    xField: "date",
    yField: "amount",
    smooth: true, // 👈 makes the line curved
  };
  const spendingConfig = {
    data: newSpending,
    width: 500,
    // autoFit: true,
    angleField: "amount",
    colorField: "tag",
  };
  let pieChart;
  let chart;
  return (
    <div className="chart-wrapper">
      <div style={{ boxShadow: "var(--shadow-color)" }}>
        <h2 style={{ padding: "5px", textAlign: "center" }}>Your Analytics</h2>
        <Line
          {...config}
          onReady={(chartInstance) => (chart = chartInstance)}
        />
      </div>

      <div style={{ boxShadow: "var(--shadow-color)" }}>
        <h2 style={{ padding: "5px", textAlign: "center" }}>Your Spendings</h2>
        {spendingData.length === 0 ? (
          <Empty description="No spendings yet" />
        ) : (
          <Pie
            {...spendingConfig}
            onReady={(chartInstance) => (pieChart = chartInstance)}
          />
        )}
      </div>
    </div>
  );
};

export default ChartComponent;
