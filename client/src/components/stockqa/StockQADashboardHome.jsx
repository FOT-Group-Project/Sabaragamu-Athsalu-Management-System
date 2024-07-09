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
import { Button, Table, Breadcrumb, Select } from "flowbite-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Chart from "chart.js/auto";

export default function DashboardComp() { 
  const [users, setUsers] = useState([]);
  const { currentUser } = useSelector((state) => state.user);


  
}