import { React, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
} from "react-icons/hi";

export default function DashShops() {
  const { currentUser } = useSelector((state) => state.user);
  const [shops, setShops] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [shopIdToDelete, setShopIdToDelete] = useState("");

  const[openModal, setOpenModal] = useState(false);
  const[openModalEdit, setOpenModalEdit] = useState(false);

  const [formData, setFormData] = useState({});

  const [createUserError, setCreateUserError] = useState(null);
  const [createLoding, setCreateLoding] = useState(false);
  
  const [seller, setSellers] = useState([]);

  const fetchSeller = async () => {
    try {
      const res = await fetch(`/api/user/getsellers`);
      const data = await res.json();
      if (res.ok) {
        setSellers(data.sellers);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchShops = async () => {
    try {
      const res = await fetch(`/api/shop/getshops`);
      const data = await res.json();
      if (res.ok) {
        setShops(data.shops);
        if (data.shop.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currentUser.role == "Admin") {
      fetchShops();
      fetchSeller();
    }

  }, [shops.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoding(true);
    try {
      const res = await fetch("/api/shop/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateUserError(data.message);
        setCreateLoding(false);
        return;
      }

      if (res.ok) {
        setCreateUserError(null);
        setCreateLoding(false);
        setOpenModal(false);
        fetchShops();
      }
    } catch (error) {
      // setCreateUserError("Something went wrong");
      setCreateLoding(false);
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    setCreateLoding(true);
    console.log(formData.id);
    try {
      const res = await fetch(`/api/shop/updateshop/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateUserError(data.message);
        setCreateLoding(false);
        return;
      }

      if (res.ok) {
        setCreateUserError(null);
        setCreateLoding(false);
        setOpenModalEdit(false);
        fetchShops();
        navigate("/dashboard?tab=shop");
      }
    } catch (error) {
      // setCreateUserError("Something went wrong");
      setCreateLoding(false);
    }
  };

  const handleDeleteShop = async () => {
    try {
      const res = await fetch(`/api/shop/deleteshop/${shopIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setShops((prev) => prev.filter((shop) => shop.id !== shopIdToDelete));
        setShowModal(false);
        fetchShops();
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

 

  return (
    <div className="p-3 w-full">
      <Breadcrumb aria-label="Default breadcrumb example">
        <Breadcrumb.Item href="#" icon={HiHome}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item>Shops</Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="mt-3 mb-3 text-left font-semibold text-xl">All Shops</h1>
      <div className="flex gap-3 justify-end">
        <Button
          className="mb-3"
          color="blue"
          size="sm"
          onClick={() => setOpenModal(true)}
        >
          <HiPlusCircle className="mr-2 h-4 w-4" />
          Add Shops
        </Button>
        <Button
          className="mb-3"
          color="blue"
          size="sm"
          onClick={() => setOpenModal(true)}
        >
          <HiUserAdd className="mr-2 h-4 w-4" />
          Assign Seller to Shop
        </Button>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Create New Shop</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-grow gap-4"
            >
              {createUserError && (
                <Alert color="failure">{createUserError}</Alert>
              )}
              <div className="flex gap-2 mb-4">
                <div>
                  <div className="mb-2 block">
                    <Label value="Shop Name" />
                  </div>
                  <TextInput
                    id="shopName"
                    type="text"
                    placeholder="Main Shop"
                    required
                    shadow
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label value="Shop Address" />
                  </div>
                  <TextInput
                    id="address"
                    type="text"
                    placeholder="Raathnapura"
                    required
                    shadow
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label value="Shop Phone Number" />
                  </div>
                  <TextInput
                    id="phone"
                    type="text"
                    placeholder="+94XX XXX XXXX"
                    required
                    shadow
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label value="Select Seller" />
                  </div>
                  <Select
                    id="sellerId"
                    onChange={handleChange}
                    required
                    shadow
                  >
                    <option value="">Select Seller</option>
                    {seller.map((seller) => (
                      <option key={seller.id} value={seller.id}>
                        {seller.firstname}
                      </option>
                    ))}
                  </Select>
                </div>
                </div>
                  

              <div className="flex gap-2 justify-end">
                <Button color="blue" type="submit" disabled={createLoding}>
                  {createLoding ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Create Shops"
                  )}
                </Button>
                <Button
                  size="sm"
                  color="gray"
                  onClick={() => setOpenModal(false)}
                >
                  Decline
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={openModalEdit} onClose={() => setOpenModalEdit(false)}>
        <Modal.Header>Edit Shop</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form
              onSubmit={handleSubmitUpdate}
              className="flex flex-col flex-grow gap-4"
            >
              {createUserError && (
                <Alert color="failure">{createUserError}</Alert>
              )}
              <div className="flex gap-2 mb-4">
                <div>
                  <div className="mb-2 block">
                    <Label value="Shop Name" />
                  </div>
                  <TextInput
                    id="shopName"
                    type="text"
                    placeholder="Main Shop"
                    required
                    shadow
                    onChange={handleChange}
                    value={formData.shopName}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label value="Shop Address" />
                  </div>
                  <TextInput
                    id="address"
                    type="text"
                    placeholder="Raathnapura"
                    required
                    shadow
                    onChange={handleChange}
                    value={formData.address}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label value="Shop Phone Number" />
                  </div>
                  <TextInput
                    id="phone"
                    type="text"
                    placeholder="+94XX XXX XXXX"
                    required
                    shadow
                    onChange={handleChange}
                    value={formData.phone}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button color="blue" type="submit" disabled={createLoding}>
                  {createLoding ? (
                    <>
                      <Spinner size="sm" />
                      <span className="pl-3">Loading...</span>
                    </>
                  ) : (
                    "Update Shop"
                  )}
                </Button>
                <Button
                  size="sm"
                  color="gray"
                  onClick={() => setOpenModalEdit(false)}
                >
                  Decline
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      {currentUser.role == "Admin" && shops.length > 0 ? (
        <>
          <Table hoverable className="shadow-md w-full">
            <TableHead>
              <TableHeadCell>Shop ID</TableHeadCell>
              <TableHeadCell>Shop Name</TableHeadCell>
              <TableHeadCell>Address</TableHeadCell>
              <TableHeadCell>Phone Number</TableHeadCell>
              <TableHeadCell></TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Edit</span>
              </TableHeadCell>
            </TableHead>
            {shops.map((shop) => (
              <Table.Body className="divide-y" key={shop.id}>
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                 
                  <TableCell>ST:{shop.id}</TableCell>
                  <TableCell>{shop.shopName}</TableCell>
                  <TableCell>{shop.address}</TableCell>
                  <TableCell>{shop.phone}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Button.Group>
                      <Button
                        onClick={() => {
                          setOpenModalEdit(true);
                          setFormData(shop);
                        }}
                        color="gray"
                      >
                        <FaUserEdit className="mr-3 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setShowModal(true);
                          setShopIdToDelete(shop.id);
                        }}
                        color="gray"
                      >
                        <MdDeleteForever className="mr-3 h-4 w-4" />
                        Delete
                      </Button>
                    </Button.Group>
                  </TableCell>
                </TableRow>
              </Table.Body>
            ))}
          </Table>
          {/* {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )} */}
        </>
      ) : (
        <p>You have no Shop yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteShop}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}