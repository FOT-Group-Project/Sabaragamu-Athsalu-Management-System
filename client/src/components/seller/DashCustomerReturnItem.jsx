import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Button,
  Breadcrumb,
  TextInput,
  Modal,
} from "flowbite-react";
import { HiHome } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Label } from "flowbite-react";
import Select from "react-select";

export default function DashCustomerReturnItem() {
  const { currentUser } = useSelector((state) => state.user);
  const [sales, setSales] = useState([]);
  const [returnItems, setReturnItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReturnItems, setFilteredReturnItems] = useState([]);
  const [returnDateTime, setReturnDateTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState("");
  const [billIds, setBillIds] = useState([]);
  const [billDetailsMap, setBillDetailsMap] = useState({});
  const [selectedReturnItems, setSelectedReturnItems] = useState([]);
  const [returnCounts, setReturnCounts] = useState({});

  // Determine if the filter is active
  const isFilterActive = searchQuery.length > 0 || returnDateTime !== null;

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle date input change
  const handleDateChange = (e) => {
    setReturnDateTime(e.target.value);
  };

  // Handle bill selection
  const handleBillSelection = (selectedOption) => {
    setSelectedBillId(selectedOption);
    setSelectedReturnItems([]);
    setReturnCounts({});
  };

  // Handle return item selection for a specific dropdown index
  const handleReturnItemSelection = (selectedOption, index) => {
    setSelectedReturnItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = selectedOption ? selectedOption.value : null;
      return newItems;
    });
  };

  // Handle return count change
  const handleReturnCountChange = (count) => {
    setReturnCounts(parseInt(count));
    console.log(returnCounts);
  };

  // Handle add return
  const handleaddReturn = async () => {
    try {
      // Validate data
      const returnItemsWithCounts = selectedReturnItems.map(
        (returnItem, index) => {
          const item = billDetailsMap[selectedBillId.value][index];
          return {
            customerId: item.customerId,
            itemId: item.itemId,
            shopId: item.shopId,
            returnDateTime: new Date().toISOString(),
            buyDateTime: item.buyDateTime,
            reason: "No reason specified",
            quantity: returnCounts || 0,
          };
        }
      );

      const res = await fetch(
        `/api/customerreturnitem/addcustomerreturnitems`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(returnItemsWithCounts),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setIsModalOpen(false);
        const fetchShopId = async () => {
          try {
            const res = await fetch(`/api/shop/getshop/${currentUser.id}`);
            const data = await res.json();
            if (res.ok) {
              if (Array.isArray(data.shops) && data.shops.length > 0) {
                const shopId = data.shops[0].id;
                fetchReturnItemsbyShopId(shopId);
                fetchSalesByShopId(shopId);
              } else {
                console.error("No shops found for the current user.");
              }
            } else {
              console.error("API response error:", data);
            }
          } catch (error) {
            console.error("Error fetching shop ID:", error);
          }
        };

        fetchShopId();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error adding return items:", error);
    }
  };

  // Add another dropdown for return item selection
  const addAnotherReturnItem = () => {
    if (
      selectedReturnItems.length < billDetailsMap[selectedBillId.value].length
    ) {
      setSelectedReturnItems([...selectedReturnItems, null]);
    } else {
      alert(
        "You cannot add more return items than the available items in the bill."
      );
    }
  };

  // Fetch return items
  const fetchReturnItems = async () => {
    try {
      const res = await fetch(`/api/customerreturnitem/getreturns`);
      const data = await res.json();
      if (res.ok) {
        setReturnItems(data.sales);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch sales by shop ID
  const fetchSalesByShopId = async (shopId) => {
    try {
      const res = await fetch(`api/sales-report/getsales/${shopId}`);
      const data = await res.json();
      if (res.ok) {
        // Group sales by customerId, shopId, and buyDateTime
        const groupedSales = groupSales(data.sales);
        const generatedBillIds = groupedSales.map(generateBillId);
        const billDetailsMap = generateBillDetailsMap(groupedSales);
        setSales(groupedSales);
        setBillIds(generatedBillIds);
        setBillDetailsMap(billDetailsMap);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Function to group sales by customerId, shopId, and buyDateTime
  const groupSales = (sales) => {
    const groupedSales = {};
    sales.forEach((sale) => {
      const key = `${sale.customerId}-${sale.shopId}-${sale.buyDateTime}`;
      if (!groupedSales[key]) {
        groupedSales[key] = [sale];
      } else {
        groupedSales[key].push(sale);
      }
    });
    return Object.values(groupedSales);
  };

  // Function to generate bill ID
  const generateBillId = (bill) => {
    const { customerId, shopId, buyDateTime } = bill[0];
    const formattedDate = new Date(buyDateTime)
      .toLocaleDateString()
      .replace(/\//g, "-");
    const formattedTime = new Date(buyDateTime)
      .toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/:/g, "");
    return `BILL-${customerId}-${shopId}-${formattedDate}-${formattedTime}`;
  };

  const generateBillDetailsMap = (groupedSales) => {
    const billDetailsMap = {};
    groupedSales.forEach((bill) => {
      const billId = generateBillId(bill);
      billDetailsMap[billId] = bill;
    });
    return billDetailsMap;
  };

  // Fetch return items by shop ID
  const fetchReturnItemsbyShopId = async (shopId) => {
    try {
      const res = await fetch(
        `/api/customerreturnitem/getreturnsbyshop/${shopId}`
      );
      const data = await res.json();
      if (res.ok) {
        setReturnItems(data.sales);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Filter return items based on search query and return date
  useEffect(() => {
    if (isFilterActive) {
      setFilteredReturnItems(
        returnItems.filter((item) => {
          const matchesSearchQuery =
            item.Customer.firstname
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.Customer.lastname
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.Product.itemName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.quantity.toString().includes(searchQuery.toLowerCase()) ||
            item.BuyItem.unitPrice
              .toString()
              .includes(searchQuery.toLowerCase()) ||
            item.buyDateTime
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.returnDateTime
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.BuyItem.unitPrice * item.quantity)
              .toString()
              .includes(searchQuery.toLowerCase());
          // Check if return date matches
          const matchesReturnDate = returnDateTime
            ? new Date(item.returnDateTime).toISOString().split("T")[0] ===
              returnDateTime
            : true;

          return matchesSearchQuery && matchesReturnDate;
        })
      );
    } else {
      setFilteredReturnItems(returnItems);
    }
  }, [searchQuery, returnDateTime, returnItems]);

  // Fetch return items based on user role
  useEffect(() => {
    if (currentUser.role === "Admin") {
      fetchReturnItems();
    } else if (currentUser.role === "Seller") {
      const fetchShopId = async () => {
        try {
          const res = await fetch(`/api/shop/getshop/${currentUser.id}`);
          const data = await res.json();
          if (res.ok) {
            if (Array.isArray(data.shops) && data.shops.length > 0) {
              const shopId = data.shops[0].id;
              fetchReturnItemsbyShopId(shopId);
              fetchSalesByShopId(shopId);
            } else {
              console.error("No shops found for the current user.");
            }
          } else {
            console.error("API response error:", data);
          }
        } catch (error) {
          console.error("Error fetching shop ID:", error);
        }
      };

      fetchShopId();
    }
  }, [currentUser], [returnItems]);

  //console.log(returnCounts);

  return (
    <div className="p-3 w-full">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumb aria-label="Default breadcrumb example">
            <Link to="/dashboard?tab=dash">
              <Breadcrumb.Item href="" icon={HiHome}>
                Home
              </Breadcrumb.Item>
            </Link>
            <Breadcrumb.Item>Return Items</Breadcrumb.Item>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
              Return Items : Report
            </h1>

            <Button color="blue" className="h-10  ml-2">
              Export to Excel
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center">
              <TextInput
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search"
                className="w-full md:w-52 h-10 mb-2 md:mb-0 md:mr-2"
              />
              <div className="flex items-center space-x-2">
                <Label>Filter by Return Date</Label>
                <TextInput
                  id="date"
                  type="date"
                  value={returnDateTime || ""}
                  onChange={handleDateChange}
                  className="w-full md:w-48 h-10 mb-2 md:mb-0 md:mr-2"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                // style={{ backgroundColor: "red" }}
                onClick={() => setIsModalOpen(true)}
                className="h-10 w-32 ml-2 bg-red-500 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-700"
              >
                Add Retuns
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <Table hoverable className="shadow-md w-full">
              <TableHead>
                <TableHeadCell>Customer Name</TableHeadCell>
                <TableHeadCell>Product Name</TableHeadCell>
                <TableHeadCell>Quantity</TableHeadCell>
                <TableHeadCell>Unit Price</TableHeadCell>
                <TableHeadCell>Buy Date Time</TableHeadCell>
                <TableHeadCell>Return Date Time</TableHeadCell>
                <TableHeadCell>Reason</TableHeadCell>
                <TableHeadCell>Amount Paid</TableHeadCell>
              </TableHead>
              <TableBody>
                {(isFilterActive ? filteredReturnItems : returnItems).map(
                  (sale) => (
                    <TableRow
                      key={sale.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <TableCell>
                        {`${sale.Customer.firstname} ${sale.Customer.lastname}`}
                      </TableCell>
                      <TableCell>{sale.Product.itemName}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell>{sale.BuyItem.unitPrice}</TableCell>
                      <TableCell>
                        {new Date(sale.buyDateTime).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(sale.returnDateTime).toLocaleString()}
                      </TableCell>
                      <TableCell>{sale.reason}</TableCell>
                      <TableCell>
                        {sale.BuyItem.unitPrice * sale.quantity}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>

          <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
              <div className="relative w-full max-w-5xl mx-auto my-6">
                <div className="relative flex flex-col w-full bg-white border rounded-lg shadow-lg outline-none focus:outline-none">
                  <div className="flex items-center justify-between p-5 border-b border-solid rounded-t border-gray-300">
                    <h3 className="text-lg font-semibold">Add Return Item</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  <div className="p-6 flex-auto">
                    <Label
                      htmlFor="billIdDropdown"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Select Bill Invoice Number
                    </Label>
                    <Select
                      id="billIdDropdown"
                      options={billIds.map((billId) => ({
                        value: billId,
                        label: billId,
                      }))}
                      value={selectedBillId}
                      onChange={handleBillSelection}
                      isClearable
                      isSearchable
                      placeholder="Search and select a Bill ID"
                    />
                    {selectedBillId && billDetailsMap[selectedBillId.value] && (
                      <div className="mt-4 flex">
                        {/* Bill Details Section */}
                        <div className="w-1/2 pr-4">
                          <h3 className="text-lg font-semibold mb-2">
                            Bill Details
                          </h3>
                          <div className="relative flex flex-col w-full bg-white border rounded-lg shadow-lg outline-none focus:outline-none">
                            <div className="relative p-6 flex-auto">
                              <div className="mb-8">
                                <div className="flex items-center">
                                  <h2 className="text-lg font-bold mb-2">
                                    Bill To:
                                  </h2>
                                  <div className="text-gray-700 mb-2 ml-2">
                                    {
                                      billDetailsMap[selectedBillId.value][0]
                                        .Customer.firstname
                                    }{" "}
                                    {
                                      billDetailsMap[selectedBillId.value][0]
                                        .Customer.lastname
                                    }
                                  </div>
                                </div>
                                <hr className="mb-2" />
                              </div>
                              <table className="w-full mb-8">
                                <thead>
                                  <tr>
                                    <th className="text-left font-bold text-gray-700">
                                      Description
                                    </th>
                                    <th className="text-right font-bold text-gray-700">
                                      Quantity
                                    </th>
                                    <th className="text-right font-bold text-gray-700">
                                      Unit Price
                                    </th>
                                    <th className="text-right font-bold text-gray-700">
                                      Total Price
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {billDetailsMap[selectedBillId.value].map(
                                    (item) => (
                                      <tr key={item.id}>
                                        <td className="text-left">
                                          {item.Product.itemName}
                                        </td>
                                        <td className="text-right">
                                          {item.quantity}
                                        </td>
                                        <td className="text-right">
                                          {item.unitPrice.toFixed(2)}
                                        </td>
                                        <td className="text-right">
                                          {item.unitPrice *
                                            item.quantity.toFixed(2)}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                                <tfoot>
                                  <tr>
                                    <td className="text-left font-bold text-gray-700">
                                      Total
                                    </td>
                                    <td className="text-right font-bold text-gray-700"></td>
                                    <td className="text-right font-bold text-gray-700"></td>
                                    <td className="text-right font-bold text-gray-700">
                                      Rs.
                                      {billDetailsMap[selectedBillId.value]
                                        .reduce(
                                          (total, item) =>
                                            total +
                                            item.unitPrice * item.quantity,
                                          0
                                        )
                                        .toFixed(2)}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </div>
                        {/* Return Items Section */}
                        <div className="w-1/2 pl-4">
                          {selectedReturnItems.map((selectedItem, index) => (
                            <div key={index} className="mb-4 flex">
                              <div className="w-1/2 pr-2">
                                <Label
                                  htmlFor={`returnItemDropdown-${index}`}
                                  className="block mb-2 text-sm font-medium text-gray-700"
                                >
                                  Select Return Item
                                </Label>
                                <Select
                                  id={`returnItemDropdown-${index}`}
                                  options={billDetailsMap[selectedBillId.value]
                                    .filter(
                                      (item) =>
                                        !selectedReturnItems.includes(item.id)
                                    )
                                    .map((item) => ({
                                      value: item.id,
                                      label: item.Product.itemName,
                                    }))}
                                  value={
                                    selectedItem
                                      ? {
                                          value: selectedItem,
                                          label: billDetailsMap[
                                            selectedBillId.value
                                          ].find(
                                            (item) => item.id === selectedItem
                                          )?.Product.itemName,
                                        }
                                      : null
                                  }
                                  onChange={(option) =>
                                    handleReturnItemSelection(option, index)
                                  }
                                  isClearable
                                  isSearchable
                                />
                              </div>
                              <div className="w-1/2 pl-2">
                                <Label
                                  htmlFor={`returnCountInput-${index}`}
                                  className="block mb-2 text-sm font-medium text-gray-700"
                                >
                                  Return Count
                                </Label>
                                <TextInput
                                  id={`returnCountInput-${index}`}
                                  type="number"
                                  //value={returnCounts[selectedItem] || ""}
                                  onChange={(e) =>
                                    handleReturnCountChange( e.target.value)
                                  }
                                  className="w-full h-10"
                                />
                              </div>
                            </div>
                          ))}
                          <Button
                            color="blue"
                            onClick={addAnotherReturnItem}
                            className="mr-2 mt-2"
                            disabled={
                              selectedReturnItems.length >=
                              billDetailsMap[selectedBillId.value].length
                            }
                          >
                            Add Item for Return
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
                    <Button
                      className="h-10 w-32 ml-2 bg-red-500 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-700"
                      onClick={handleaddReturn}
                    >
                      Add Returns
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
