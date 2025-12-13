import { Button, DatePicker, Form, Input, Modal, Select } from "antd";
import React from "react";

const AddIncome = ({ isIncomeModalVisible, handleIncomeCancel, onFinish }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Income"
      open={isIncomeModalVisible}
      onCancel={handleIncomeCancel}
      footer={null}
    >
      <Form
        form={form}
        style={{ fontWeight: 600 }}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "income");
          form.resetFields();
          handleIncomeCancel();   // <-- auto close
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of transaction!",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>
        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            {
              required: true,
              message: "Please input the income Amount!",
            },
          ]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>

        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            {
              required: true,
              message: "Please select the income date!",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className="custom-input" />
        </Form.Item>

        <Form.Item
          style={{ fontWeight: 600 }}
          label="Tag"
          name="tag"
          rules={[
            {
              required: true,
              message: "Please select a tag!",
            },
          ]}
        >
          <Select className="select-input-2">
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button className="btn btn-blue" type="primary" htmlType="submit">
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddIncome;
