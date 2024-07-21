import {
  Alert,
  Breadcrumb,
  Button,
  Label,
  Modal,
  Pagination,
  Spinner,
  Table,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { AnimatePresence, motion } from "framer-motion";
import { React, useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { FaUserEdit } from "react-icons/fa";
import {
  HiHome,
  HiOutlineExclamationCircle,
  HiPlusCircle,
} from "react-icons/hi";
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashProducts() {
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setproductIdToDelete] = useState("");
  const [stores, setStores] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const [formData, setFormData] = useState({});

  const [createUserError, setCreateUserError] = useState(null);
  const [createLoding, setCreateLoding] = useState(null);

  // Pagiation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const onPageChange = (page) => setCurrentPage(page);

  const currentData = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/product/getallproducts`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products);
        // if (data.product.length < 9) {
        //   setShowMore(false);
        // }
        // console.log(data.products);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [products.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoding(true);
    try {
      const res = await fetch("/api/product/addproduct", {
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
        fetchProducts();
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
      const res = await fetch(`/api/product/updateproduct/${formData.id}`, {
        method: "PATCH",
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
        fetchProducts();
        navigate("/dashboard?tab=store");
      }
    } catch (error) {
      // setCreateUserError("Something went wrong");
      setCreateLoding(false);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const res = await fetch(
        `/api/product/deleteproduct/${productIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) =>
          prev.filter((store) => store.id !== productIdToDelete)
        );
        setShowModal(false);
        fetchProducts();
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
            <Breadcrumb.Item>Products</Breadcrumb.Item>
          </Breadcrumb>

          <h1 className="mt-3 mb-3 text-left font-semibold text-xl">
            All Products
          </h1>
          <div className="flex gap-3 justify-end">
            <Button
              className="mb-3"
              color="blue"
              size="sm"
              onClick={() => setOpenModal(true)}
              style={{
                display:
                  currentUser.role === "Accountant" ||
                    currentUser.role === "Director" ||
                    currentUser.role === "StoreKeeper"
                    ? "none"
                    : "inline-block",
              }}
            >
              <HiPlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>

          <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header>Create New Product</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-grow gap-4"
                  >
                    {createUserError && (
                      <Alert color="failure">{createUserError}</Alert>
                    )}
                    <div className="flex gap-5">
                      <div>
                        <div className="mb-2 block">
                          <Label value="Product Name" />
                        </div>
                        <TextInput
                          id="itemName"
                          type="text"
                          placeholder="Batic Shirt"
                          required
                          shadow
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="SKU" />
                        </div>
                        <TextInput
                          id="sku"
                          type="text"
                          placeholder="PHS-001"
                          required
                          shadow
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label value="Product Type" />
                        </div>
                        <TextInput
                          id="itemType"
                          type="text"
                          placeholder="Shirt"
                          required
                          shadow
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label value="Manufacturer" />
                        </div>
                        <TextInput
                          id="manufacturer"
                          type="text"
                          placeholder="Parakaduwa Factory"
                          required
                          shadow
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="Price" />
                        </div>
                        <TextInput
                          id="itemPrice"
                          type="number"
                          placeholder="1000.00"
                          required
                          shadow
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        color="blue"
                        type="submit"
                        disabled={createLoding}
                      >
                        {createLoding ? (
                          <>
                            <Spinner size="sm" />
                            <span className="pl-3">Loading...</span>
                          </>
                        ) : (
                          "Create Products"
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
            </motion.div>
          </Modal>

          <Modal show={openModalEdit} onClose={() => setOpenModalEdit(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header>Edit Product</Modal.Header>
              <Modal.Body>
                <div className="space-y-6">
                  <form
                    onSubmit={handleSubmitUpdate}
                    className="flex flex-col flex-grow gap-4"
                  >
                    {createUserError && (
                      <Alert color="failure">{createUserError}</Alert>
                    )}
                    <div className="flex gap-5">
                      <div>
                        <div className="mb-2 block">
                          <Label value="Product Name" />
                        </div>
                        <TextInput
                          id="itemName"
                          type="text"
                          placeholder="Batic Shirt"
                          required
                          shadow
                          onChange={handleChange}
                          defaultValue={formData.itemName}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="SKU" />
                        </div>
                        <TextInput
                          id="sku"
                          type="text"
                          placeholder="PHS-001"
                          required
                          shadow
                          onChange={handleChange}
                          defaultValue={formData.sku}
                        />
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label value="Product Type" />
                        </div>
                        <TextInput
                          id="itemType"
                          type="text"
                          placeholder="Shirt"
                          required
                          shadow
                          onChange={handleChange}
                          defaultValue={formData.itemType}
                        />
                      </div>

                      <div>
                        <div className="mb-2 block">
                          <Label value="Manufacturer" />
                        </div>
                        <TextInput
                          id="manufacturer"
                          type="text"
                          placeholder="Parakaduwa Factory"
                          required
                          shadow
                          onChange={handleChange}
                          defaultValue={formData.manufacturer}
                        />
                      </div>
                      <div>
                        <div className="mb-2 block">
                          <Label value="Price" />
                        </div>
                        <TextInput
                          id="itemPrice"
                          type="number"
                          placeholder="1000.00"
                          required
                          shadow
                          onChange={handleChange}
                          defaultValue={formData.itemPrice}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        color="blue"
                        type="submit"
                        disabled={createLoding}
                      >
                        {createLoding ? (
                          <>
                            <Spinner size="sm" />
                            <span className="pl-3">Loading...</span>
                          </>
                        ) : (
                          "Update Product"
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
            </motion.div>
          </Modal>

          {products.length > 0 ? (
            <>
              <Table hoverable className="shadow-md w-full">
                <TableHead>
                  <TableHeadCell>Product Name</TableHeadCell>
                  <TableHeadCell>SKU</TableHeadCell>
                  <TableHeadCell>Type</TableHeadCell>
                  <TableHeadCell>Manufacturer</TableHeadCell>
                  <TableHeadCell>Price</TableHeadCell>
                  <TableHeadCell></TableHeadCell>
                  <TableHeadCell>
                    <span className="sr-only">Edit</span>
                  </TableHeadCell>
                </TableHead>
                {currentData.map((product) => (
                  <Table.Body className="divide-y" key={product.id}>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <TableCell>
                        <b>{product.itemName}</b>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.itemType}</TableCell>
                      <TableCell>{product.manufacturer}</TableCell>
                      <TableCell>Rs. {product.itemPrice}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <Button.Group>
                          <Button
                            onClick={() => {
                              setOpenModalEdit(true);
                              setFormData(product);
                            }}
                            color="gray"
                            style={{
                              display:
                                currentUser.role === "Accountant" ||
                                  currentUser.role === "Director" ||
                                  currentUser.role === "StoreKeeper"
                                  ? "none"
                                  : "inline-block",
                            }}
                          >
                            <FaUserEdit className="mr-3 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              setShowModal(true);
                              setproductIdToDelete(product.id);
                            }}
                            color="gray"
                            style={{
                              display:
                                currentUser.role === "Accountant" ||
                                  currentUser.role === "Director" ||
                                  currentUser.role === "StoreKeeper"
                                  ? "none"
                                  : "inline-block",
                            }}
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

              {/* Pagination */}
              <div className="flex overflow-x-auto sm:justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    showIcons
                  />
                </div>
              </>
            ) : (
              <p>You have no store yet!</p>
          )}
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size="md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <Modal.Header />
              <Modal.Body>
                <div className="text-center">
                  <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                  <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this user?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <Button color="failure" onClick={handleDeleteProduct}>
                      Yes, I'm sure
                    </Button>
                    <Button color="gray" onClick={() => setShowModal(false)}>
                      No, cancel
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </motion.div>
          </Modal>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
