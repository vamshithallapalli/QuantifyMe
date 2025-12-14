import { Card, Row, Modal } from "antd";
import React from "react";
import "./style.css";
import Button from "../Button";
const { confirm } = Modal;

const Cards = ({
  showExpenseModal,
  showIncomeModal,
  income,
  expense,
  totalBalance,
  onResetBalance,
}) => {
  const showResetConfirm = () => {
    confirm({
      title: "Reset Balance?",
      content:
        "This will delete all income and expenses. This action can be undone.",
      okText: "Yes, Reset",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        onResetBalance();
      },
    });
  };
  return (
    <div>
      <Row className="my-row">
        <Card className="my-card" title="Current Balance">
          <p>₹{totalBalance}</p>
          <Button text="Reset Balance" blue={true} onClick={showResetConfirm} />
        </Card>
        <Card className="my-card" title="Total Income">
          <p>₹{income}</p>
          <Button text="Add Income" blue={true} onClick={showIncomeModal} />
        </Card>
        <Card className="my-card" title="Total Expenses">
          <p>₹{expense}</p>
          <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
        </Card>
      </Row>
    </div>
  );
};

export default Cards;
