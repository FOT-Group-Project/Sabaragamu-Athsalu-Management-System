import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiUserGroup,
  HiHome,
  HiTrendingUp,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";
import { Button, Table, Breadcrumb } from "flowbite-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Chart from 'chart.js/auto';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [sales, setSales] = useState([]);
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [totalSaleAmountToday, setTotalSaleAmountToday] = useState(0);
  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalIncomeLastMonth, setTotalIncomeLastMonth] = useState(0);
  const [totalIncomeLastDay, setTotalIncomeLastDay] = useState(0);
  const [totalSalesLastDay, setTotalSalesLastDay] = useState(0);
  const [totalCustomersLastMonth, setTotalCustomersLastMonth] = useState(0);
  const [chart, setChart] = useState(null);

  //calculate total sales amount
  const calculateTotalSalesAmount = () => {
    return sales.reduce((acc, sale) => acc + (sale.quantity * sale.unitPrice), 0);
  };
  
  //calculate total sales amount today
  const calculateTotalSalesAmountToday = () => {
    const today = new Date().toLocaleDateString('en-CA');
    return sales
      .filter((sale) => new Date(sale.buyDateTime).toLocaleDateString('en-CA') === today)
      .reduce((acc, sale) => acc + (sale.quantity * sale.unitPrice), 0);
  };
  
  //calculate total sales count
  const calculateTotalSalesCount = () => {
    return sales.length;
  };

  //calculate total income last month
  const calculateTotalIncomeLastMonth = () => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthSales = sales.filter((sale) => new Date(sale.buyDateTime) >= lastMonth);
    return lastMonthSales.reduce((acc, sale) => acc + (sale.quantity * sale.unitPrice), 0);
  }

  //calculate total income last day
  const calculateTotalIncomeLastDay = () => {
    const lastDay = new Date();
    lastDay.setDate(lastDay.getDate() - 1);
    const lastDaySales = sales.filter((sale) => new Date(sale.buyDateTime) >= lastDay);
    return lastDaySales.reduce((acc, sale) => acc + (sale.quantity * sale.unitPrice), 0);
  }
  
  //calculate total sales last day
  const calculateTotalSalesLastDay = () => {
    const lastDay = new Date();
    lastDay.setDate(lastDay.getDate() - 1);
    return sales.filter((sale) => new Date(sale.buyDateTime) >= lastDay).length;
  }

  // Calculate total customers last month
  const calculateTotalCustomersLastMonth = () => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthUsers = users.filter((user) => new Date(user.createdAt) >= lastMonth);
    return new Set(lastMonthUsers.map((user) => user.id)).size;
  };

  //update total sales amount, total sales count, total customers, total income last month
  useEffect(() => {
    const totalAmount = calculateTotalSalesAmount();
    const totalAmountToday = calculateTotalSalesAmountToday();
    const totalSalesCount = calculateTotalSalesCount();
    const totalCustomers = new Set(users.map((user) => user.id)).size;
    const totalIncomeLastMonth = calculateTotalIncomeLastMonth();
    const totalIncomeLastDay = calculateTotalIncomeLastDay();
    const totalSalesLastDay = calculateTotalSalesLastDay();
    const totalCustomersLastMonth = calculateTotalCustomersLastMonth();
    

    setTotalSaleAmount(Number(totalAmount.toFixed(2)));
    setTotalSaleAmountToday(Number(totalAmountToday.toFixed(2)));
    setTotalSalesCount(totalSalesCount);
    setTotalCustomers(totalCustomers);
    setTotalIncomeLastMonth(Number(totalIncomeLastMonth.toFixed(2)));
    setTotalIncomeLastDay(Number(totalIncomeLastDay.toFixed(2)));
    setTotalSalesLastDay(totalSalesLastDay);
    setTotalCustomersLastMonth(totalCustomersLastMonth);

    // Initialize the chart if it's not already initialized
    if (!chart) {
      const creditSales = sales.filter(sale => sale.type === 'Credit').reduce((acc, sale) => acc + (sale.quantity * sale.unitPrice), 0);
      const cashSales = sales.filter(sale => sale.type === 'Cash').reduce((acc, sale) => acc + (sale.quantity * sale.unitPrice), 0);

      const ctx = document.getElementById('pieChart').getContext('2d');
      const newChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Credit Sales', 'Cash Sales'],
          datasets: [{
            data: [creditSales, cashSales],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)', // Red
              'rgba(54, 162, 235, 0.5)'   // Blue
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }]
        },
      });
      

      setChart(newChart);
    } else {
      // Update the chart data if it's already initialized
      const creditSales = sales.filter(sale => sale.type === 'Credit').reduce((acc, sale) => acc + (sale.quantity * sale.unitPrice), 0);
      const cashSales = sales.filter(sale => sale.type === 'Cash').reduce((acc, sale) => acc + (sale.quantity * sale.unitPrice), 0);

      chart.data.datasets[0].data = [creditSales, cashSales];
      chart.update();
    }

  },[sales, users]);

  //fetch sales, users and products
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch("/api/sales-report/getsales");
        const data = await res.json();
        if (res.ok) {
          setSales(data.sales);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchSales();

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUsers();

    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product/getallproducts");
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-3 w-full md:mx-auto">
            <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
      <Breadcrumb aria-label="Default breadcrumb example">
        <Breadcrumb.Item href="#" icon={HiHome}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item>Products</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mt-3 mb-3 text-left font-semibold text-xl">Dashboard</h1>

      <div className="flex-wrap flex gap-4 justify-around">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-56 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Total Income </h3>
              <p className="text-2xl font-semibold">Rs {totalSaleAmount}</p>
            </div>
            <HiOutlineCurrencyDollar className="bg-blue-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-green-500 font-semibold flex items-center ">
              <HiArrowNarrowUp />
              Rs {totalIncomeLastMonth} Last Month
            </span>
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-56 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">Income today</h3>
              <p className="text-2xl font-semibold">Rs {totalSaleAmountToday}</p>
            </div>
            <HiOutlineCurrencyDollar className="bg-red-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-green-500 font-semibold flex items-center ">
              <HiArrowNarrowUp />
              Rs {totalIncomeLastDay} Last Day
            </span>
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-56 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Toatal Sales
              </h3>
              <p className="text-2xl font-semibold">{totalSalesCount}</p>
            </div>
            <HiTrendingUp className="bg-green-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-green-500 font-semibold flex items-center ">
              <HiArrowNarrowUp />{totalSalesLastDay} Last Day
            </span>
          </div>
        </div>

        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-56 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                Total Customer
              </h3>
              <p className="text-2xl font-semibold">{totalCustomers}</p>
            </div>
            <HiUserGroup className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-green-500 font-semibold flex items-center ">
              <HiArrowNarrowUp />{totalCustomersLastMonth} Last Month
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-8 py-3 mx-auto justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold">Sales Overview</h1>
            {/* <Link to="/dashboard?tab=salesReport">
              <Button color="green">See all</Button>
            </Link> */}
          </div>
          <canvas id="pieChart" width="400" height="400"></canvas>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-lg font-semibold">Income Overview</h1>
            <Link to="/dashboard?tab=salesReport">
              <Button color="green">See all</Button>
            </Link>
          </div>
        </div>
      </div>
              
      </motion.div>
      </AnimatePresence>
    </div>
  );
}
