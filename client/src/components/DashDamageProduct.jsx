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
