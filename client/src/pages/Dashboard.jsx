import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashUsers from "../components/DashUsers";
import DashShops from "../components/DashShops";
import DashStores from "../components/DashStores";
import DashProducts from "../components/DashProducts";
import DashboardComp from "../components/DashboardComp";
import DashPOS from "../components/DashPOS";

export default function Dashboard() {
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
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* Profile */}
      {tab === "profile" && <DashProfile />}
      {/* users */}
      {tab === "users" && <DashUsers />}
      {/* shops */}
      {tab === "shops" && <DashShops />}
      {/* stores */}
      {tab === "stores" && <DashStores />}
      {/* products */}
      {tab === "products" && <DashProducts />}
      {/* dash */}
      {tab === "dash" && <DashboardComp />}
      {/* pos */}
      {tab === "pos" && <DashPOS />}
    </div>
  );
}
