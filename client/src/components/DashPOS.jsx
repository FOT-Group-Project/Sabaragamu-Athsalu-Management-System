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
} from "react-icons/hi";

export default function DashPOS() {
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
        <div className="md:w-full bg-slate-700">
          <h1>Test</h1>
        </div>
        <div className="md:w-96 bg-slate-100">
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
          <div className="justify-between text-center">
            <p>Lahiru Prasad</p>
            <hr className="md-2 mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
