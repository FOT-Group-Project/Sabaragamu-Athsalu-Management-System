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

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [sales, setSales] = useState([]);
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [totalSaleAmountToday, setTotalSaleAmountToday] = useState(0);
  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

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
  

  //update total sales amount, total sales amount today, total sales count, and total customers
  useEffect(() => {
    const totalAmount = calculateTotalSalesAmount();
    const totalAmountToday = calculateTotalSalesAmountToday();
    const totalSalesCount = calculateTotalSalesCount();
    const totalCustomers = new Set(users.map((user) => user.id)).size;
  
    setTotalSaleAmount(Number(totalAmount.toFixed(2)));
    setTotalSaleAmountToday(Number(totalAmountToday.toFixed(2)));
    setTotalSalesCount(totalSalesCount);
    setTotalCustomers(totalCustomers);
  }, [sales]);
  
  
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user//getusers");
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
  }, [currentUser]);

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
              Rs 11,200 Last Month
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
              Rs 1,200 Last Day
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
              <HiArrowNarrowUp />8 Last Day
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
              <HiArrowNarrowUp />4 Last Month
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-8 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Link to={"/dashboard?tab=products"}>
              {" "}
              <Button color="green">See all</Button>
            </Link>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>user name</Table.HeadCell>
              <Table.HeadCell>position</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user.id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user.profilepicurl}
                        alt="product"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.role}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent products</h1>
            <Link to={"/dashboard?tab=products"}>
              {" "}
              <Button color="green">See all</Button>
            </Link>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Product Name</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>Manufacturer</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
            </Table.Head>
            {products &&
              products.map((product) => (
                <Table.Body key={product.id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{product.itemName}</Table.Cell>
                    <Table.Cell>{product.itemType}</Table.Cell>
                    <Table.Cell>{product.manufacturer}</Table.Cell>
                    <Table.Cell>{product.itemPrice}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
      </motion.div>
      </AnimatePresence>
    </div>
  );
}
