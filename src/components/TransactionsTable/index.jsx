import React, { useState } from "react";
import "./style.css";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Radio, Select, Space, Table } from "antd";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";

const TransactionsTable = ({
  transactions,
  addTransaction,
  fetchTransactions,
}) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  let filteredTransactions = transactions.filter((item) => {
    const name = item?.name?.toLowerCase() ?? "";
    const type = item?.type ?? "";

    return name.includes(search.toLowerCase()) && type.includes(typeFilter);
  });

  let sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  const exportCSV = () => {
    var csv = unparse({
      fields: ["name", "type", "tag", "date", "amount"],
      data: transactions,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transations.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importCSV = async (e) => {
    e.preventDefault();
    try {
      parse(e.target.files[0], {
        header: true,
        complete: async function (results) {
          for (const transaction of results.data) {
            // ignore empty lines
            if (!transaction.name && !transaction.amount) continue;

            const newTransaction = {
              name: transaction.name || "Untitled",
              type: transaction.type || "expense", // default
              tag: transaction.tag || "",
              date: transaction.date || new Date().toISOString().slice(0, 10),
              amount: parseFloat(transaction.amount) || 0,
            };

            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions added!");
      fetchTransactions();
      e.target.files = null;
    } catch (e) {
      toast.error("Couldn't add Transaction");
    }
  };

  return (
    <>
      <div style={{ width: "100%", padding: "0rem 2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="search by name"
            prefix={<SearchOutlined />}
            style={{ width: "70%", boxShadow: "var(--shadow-color)" }}
          />
          <Select
            className="select-input"
            onChange={(value) => setTypeFilter(value)}
            value={typeFilter}
            placeholder="Filter"
            options={[
              { value: "", label: "All" },
              { value: "income", label: "Income" },
              { value: "expense", label: "Expense" },
            ]}
            style={{ width: "30%", boxShadow: "var(--shadow-color)" }}
          />
        </div>
        <div style={{ boxShadow: "var(--shadow-color)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              margin: "1rem",
            }}
          >
            <h2>My Transactions</h2>
            <div>
              <Radio.Group
                className="input-radio"
                onChange={(e) => setSortKey(e.target.value)}
                value={sortKey}
              >
                <Radio.Button value="">No Sort</Radio.Button>
                <Radio.Button value="date">Sort by Date</Radio.Button>
                <Radio.Button value="amount">Sort by Amount</Radio.Button>
              </Radio.Group>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                width: "480px",
              }}
            >
              <Space wrap>
                <button className="btn" onClick={exportCSV}>
                  Export to CSV
                </button>

                <label htmlFor="file-csv" className="btn btn-blue">
                  Import from CSV
                </label>
              </Space>
              {/* <button className="btn" onClick={exportCSV}>
                Export to CSV
              </button>
              <label for="file-csv" className="btn btn-blue">
                Import from CSV
              </label> */}
              <input
                type="file"
                id="file-csv"
                accept=".csv"
                required
                onChange={importCSV}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <Table
            dataSource={
              Array.isArray(sortedTransactions) ? sortedTransactions : []
            }
            columns={columns}
          />
        </div>
      </div>
    </>
  );
};

export default TransactionsTable;
