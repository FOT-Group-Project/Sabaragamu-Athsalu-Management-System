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
} from "flowbite-react";
import { FaUserEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { HiHome } from "react-icons/hi";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Profile from "../assets/add-pic.png";
import {
  HiOutlineExclamationCircle,
  HiPlusCircle,
  HiUserAdd,
  HiOutlineArrowCircleRight,
} from "react-icons/hi";

export default function DashPOS() {
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/product/getallproducts`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
        if (data.product.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-3 w-full">
      <Breadcrumb aria-label="Default breadcrumb example">
        <Link to="/dashboard?tab=dash">
          <Breadcrumb.Item href="" icon={HiHome}>
            Home
          </Breadcrumb.Item>
        </Link>
        <Breadcrumb.Item>POS</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
        Point of Sale
      </h1>

      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="md:w-full mr-5">
          {products.length > 0 ? (
            <>
              <Table hoverable className="shadow-md w-full">
                <TableHead>
                  <TableHeadCell>Product Name</TableHeadCell>
                  <TableHeadCell>SKU</TableHeadCell>
                  <TableHeadCell>Manufacturer</TableHeadCell>
                  <TableHeadCell>Price</TableHeadCell>
                  <TableHeadCell>Quantity</TableHeadCell>
                  <TableHeadCell></TableHeadCell>
                  <TableHeadCell>
                    <span className="sr-only">Edit</span>
                  </TableHeadCell>
                </TableHead>
                {products.map((product) => (
                  <Table.Body className="divide-y" key={product.id}>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell>
                        <b>{product.itemName}</b>
                      </TableCell>
                      <TableCell>PD{product.id}</TableCell>
                      <TableCell>{product.manufacturer}</TableCell>
                      <TableCell>Rs. {product.itemPrice}</TableCell>
                      <TableCell>86 </TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setOpenModalEdit(true);
                            setFormData(product);
                          }}
                          color="gray"
                        >
                          Add
                          <HiOutlineArrowCircleRight className="ml-3 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </Table.Body>
                ))}
              </Table>
            </>
          ) : (
            <p>You have no store yet!</p>
          )}
        </div>

        <div className="md:w-96">
          <div className="flex gap-3 justify-between">
            <Button
              className="mb-3"
              color="blue"
              size="sm"
              onClick={() => setOpenModal(true)}
            >
              <HiPlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
            <Button
              className="mb-3"
              color="blue"
              size="sm"
              onClick={() => setOpenModal(true)}
            >
              <MdDeleteForever className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
          <div className="justify-between text-center ">
            <p>Lahiru Prasad</p>
            <hr className="md-2 mt-2" />
          </div>
          <div>
            {products.length > 0 ? (
              <>
                <Table hoverable className="shadow-md w-full mt-2">
                  <TableHead>
                    <TableHeadCell>Product Name</TableHeadCell>
                    <TableHeadCell>QTY</TableHeadCell>
                    <TableHeadCell>Price</TableHeadCell>
                    <TableHeadCell></TableHeadCell>
                  </TableHead>
                  {products.map((product) => (
                    <Table.Body className="divide-y" key={product.id}>
                      <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell>
                          <b>{product.itemName}</b>
                        </TableCell>
                        <TableCell>86</TableCell>
                        <TableCell>Rs.{product.itemPrice}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              setOpenModalEdit(true);
                              setFormData(product);
                            }}
                            color="gray"
                          >
                            <MdDeleteForever className=" h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </Table.Body>
                  ))}
                </Table>
              </>
            ) : (
              <p>You have no store yet!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
