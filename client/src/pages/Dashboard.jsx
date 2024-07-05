import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashUsers from "../components/DashUsers";
import DashShops from "../components/DashShops";
import DashStores from "../components/DashStores";
import DashProducts from "../components/DashProducts";
import DashboardComp from "../components/DashboardComp";
import DashPOS from "../components/seller/DashPOS";
import SellerDashboardHome from "../components/seller/SellerDashboardHome";
import DashSellerProducts from "../components/seller/DashSellerProducts";
import DashSellerInvetory from "../components/seller/DashSellerInvetory";
import DashSellerSendStock from "../components/seller/DashSellerSendStock";
import DashDamageProduct from "../components/DashDamageProduct";
import DashSaleHistory from "../components/DashSaleHistory";

import DashSalesReport from "../components/DashSalesReport";
import StoreKeeperDashboardHome from "../components/storeKeeper/StoreKeeperDashboardHome";
import DashStoreKeeperProducts from "../components/storeKeeper/DashStoreKeeperProducts";


export default function Dashboard() {
  const loaction = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser } = useSelector((state) => state.user);

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
      {/* invetory */}
      {tab === "invetory" && <DashSellerInvetory />}

      {/* damage product */}
      {tab === "damageproducts" && <DashDamageProduct />}

      {/* sendstock */}
      {tab === "sendstock" && currentUser.role === "Seller" && (
        <DashSellerSendStock />
      )}

      {/* products */}
      {tab === "products" && currentUser.role === "Admin" && <DashProducts />}
      {tab === "products" && currentUser.role === "Seller" && (
        <DashSellerProducts />
      )}
      {tab === "products" && currentUser.role === "StoreKeeper" && (
        <DashStoreKeeperProducts />)}
      {/* dash */}
      {tab === "dash" && currentUser.role === "Admin" && <DashboardComp />}
      {tab === "dash" && currentUser.role === "Seller" && (
        <SellerDashboardHome />
      )}
      {tab === "dash" && currentUser.role === "StoreKeeper" && (<StoreKeeperDashboardHome />)}
      {/* pos */}
      {tab === "pos" && <DashPOS />}
      {/* salesReport */}
      {tab === "salesReport" && <DashSalesReport />}

      {/*Sale Histor*/}
      {tab === "saleHistory" && <DashSaleHistory />}
    </div>
  );
}
