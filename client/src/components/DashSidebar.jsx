import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { useSelector } from "react-redux";
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
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(loaction.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [loaction.search]);

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      className="w-full md:w-56"
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
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
              href="#"
              icon={HiUsers}
              active={tab === "users"}
              as="div"
            >
              Users
            </Sidebar.Item>
          </Link>

          <Sidebar.Item icon={HiShoppingBag}>Products</Sidebar.Item>

          <Sidebar.Item href="#" icon={IoMdHome}>
            Shops
          </Sidebar.Item>

          <Sidebar.Item href="#" icon={HiBuildingStorefront}>
            Stores
          </Sidebar.Item>

          <Sidebar.Item href="#" icon={HiShoppingBag}>
            Documents
          </Sidebar.Item>

          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
