import { React, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Avatar,
  Button,
  Breadcrumb,
  Modal,
  Checkbox,
  Label,
  Alert,
  TextInput,
  Select,
  Spinner,
  Badge,
} from "flowbite-react";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { HiHome } from "react-icons/hi";
import { useSelector } from "react-redux";
import "react-circular-progressbar/dist/styles.css";
import {
  HiOutlineExclamationCircle,
  HiPlusCircle,
  HiUserAdd,
  HiXCircle,
  HiCheckCircle,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

export default function DashSellerProducts() {
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    try {
      const shopIdRes = await fetch(`/api/shop/getshop/${currentUser.id}`);
      const shopIdData = await shopIdRes.json();
      if (shopIdRes.ok) {
        const productsRes = await fetch(
          `/api/shop-item/getshopitems/${shopIdData.shops[0].id}`
        );
        const productsData = await productsRes.json();
        if (productsRes.ok) {
          setProducts(productsData.shopItems);
          if (productsData.shopItems.length < 9) {
            setShowMore(false);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentUser.id]);

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
            <Breadcrumb.Item>Shop Products</Breadcrumb.Item>
          </Breadcrumb>

          <h1 className="mt-3 mb-5 text-left font-semibold text-xl">
            Shop Products
          </h1>

          {products.length > 0 ? (
            <>
              <Table hoverable className="shadow-md w-full">
                <TableHead>
                  <TableHeadCell>Product Name</TableHeadCell>
                  <TableHeadCell>SKU</TableHeadCell>
                  <TableHeadCell>Type</TableHeadCell>
                  <TableHeadCell>Manufacturer</TableHeadCell>

                  <TableHeadCell>Quantity</TableHeadCell>
                  <TableHeadCell>Price</TableHeadCell>
                </TableHead>
                {products.map((product) => (
                  <Table.Body className="divide-y" key={product.id}>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell>
                        <b>{product.item.itemName}</b>
                      </TableCell>
                      <TableCell>{product.item.sku}</TableCell>
                      <TableCell>{product.item.itemType}</TableCell>
                      <TableCell>{product.item.manufacturer}</TableCell>
                      <TableCell>
                        <Badge
                          className="pl-3 pr-3 w-28"
                          color={product.quantity > 0 ? "green" : "red"}
                          icon={
                            product.quantity > 0 ? HiCheckCircle : HiXCircle
                          }
                        >
                          {product.quantity} in stock
                        </Badge>
                      </TableCell>
                      <TableCell>Rs. {product.item.itemPrice}</TableCell>
                    </TableRow>
                  </Table.Body>
                ))}
              </Table>
            </>
          ) : (
            <p>You have no store yet!</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
