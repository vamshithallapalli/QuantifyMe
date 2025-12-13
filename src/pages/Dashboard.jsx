import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import AddIncome from "../components/Modals/AddIncome";
import AddExpense from "../components/Modals/AddExpense";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { collection, addDoc, query, getDocs } from "firebase/firestore";
import TransactionsTable from "../components/TransactionsTable";
import ChartComponent from "../components/Charts";
import { Empty } from "antd";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: Number(values.amount) || 0, // FIX HERE
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  const addTransaction = async (transaction) => {
    //add the doc
    if (!user) {
      toast.error("You must be logged in to add transactions.");
      return;
    }
    try {
      await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      toast.success("Transaction Added!");
      setTransactions((prev) => [...prev, transaction]);
    } catch (e) {
      toast.error("Couldn't add Transaction");
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push(doc.data());
      });
      setTransactions(transactionArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  };

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transacation) => {
      if (transacation.type === "income") {
        incomeTotal += transacation.amount;
      } else {
        expenseTotal += transacation.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  };

  let sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />
          {transactions.length !== 0 ? (
            <ChartComponent sortedTransactions={sortedTransactions} />
          ) : (
            <Empty description="No transactions yet" />
          )}

          <AddIncome
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />

          <AddExpense
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />

          <TransactionsTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
