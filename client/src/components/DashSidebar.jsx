import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiUsers,
} from "react-icons/hi";
import { HiBuildingStorefront } from "react-icons/hi2";
import { FaShoppingBag } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";

export default function DashSidebar() {
  const { currentUser } = useSelector((state) => state.user);
  const loaction = useLocation();

  const dispatch = useDispatch();

  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(loaction.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [loaction.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      className="w-full md:w-56 "
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=dash">
            <Sidebar.Item
              className="mt-2 mb-2"
              active={tab === "dash"}
              icon={HiChartPie}
              labelColor="dark"
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              className="mt-2 mb-2"
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.role}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=users">
            <Sidebar.Item
              className="mt-2 mb-2"
              icon={HiUsers}
              active={tab === "users"}
              as="div"
            >
              Users
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=products">
            <Sidebar.Item
              className="mt-2 mb-2"
              icon={HiShoppingBag}
              active={tab === "products"}
            >
              Products
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=shops">
            <Sidebar.Item
              className="mt-2 mb-2"
              icon={IoMdHome}
              active={tab === "shops"}
            >
              Shops
            </Sidebar.Item>
          </Link>

          <Link to="/dashboard?tab=stores">
            <Sidebar.Item
              className="mt-2 mb-2"
              icon={HiBuildingStorefront}
              active={tab === "stores"}
            >
              Stores
            </Sidebar.Item>
          </Link>

          {/* <Sidebar.Item className="mt-2 mb-2" icon={HiShoppingBag}>
            Documents
          </Sidebar.Item> */}

          <Link onClick={handleSignout}>
            <Sidebar.Item
              icon={HiArrowSmRight}
              className="mt-2 mb-2 cursor-pointer"
            >
              Sign Out
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
