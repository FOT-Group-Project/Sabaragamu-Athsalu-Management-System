import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import DashDamageProduct from "../components/DashDamageProduct";
import DashProducts from "../components/DashProducts";
import DashProfile from "../components/DashProfile";
import DashSaleHistory from "../components/DashSaleHistory";
import DashShops from "../components/DashShops";
import DashSidebar from "../components/DashSidebar";
import DashStores from "../components/DashStores";
import DashUsers from "../components/DashUsers";
import DashboardComp from "../components/DashboardComp";
import DashCustomerReturnItem from "../components/seller/DashCustomerReturnItem";
import DashPOS from "../components/seller/DashPOS";
import DashSellerInvetory from "../components/seller/DashSellerInvetory";
import DashSellerProducts from "../components/seller/DashSellerProducts";
import DashSellerSendStock from "../components/seller/DashSellerSendStock";
import SellerDashboardHome from "../components/seller/SellerDashboardHome";

import DashSalesReport from "../components/DashSalesReport";
// import AccountantDashboardHome from "../components/accountant/AccountantDashboardHome";
// import DashDirectorProducts from "../components/director/DashDirectorProducts";
// import DirectorDashboardHome from "../components/director/DirectorDashboardHome";
import StockQADashboardHome from "../components/stockqa/StockQADashboardHome";
import DashStoreKeeperProducts from "../components/storeKeeper/DashStoreKeeperProducts";
import DashStoreKeeperSendStock from "../components/storeKeeper/DashStoreKeeperSendStock";
import StoreKeeperDashboardHome from "../components/storeKeeper/StoreKeeperDashboardHome";

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

      {tab === "sendstock" && currentUser.role === "StoreKeeper" && (
        <DashStoreKeeperSendStock />
      )}

      {/* products */}
      {tab === "products" && currentUser.role === "Admin" && <DashProducts />}
      {tab === "products" && currentUser.role === "Seller" && (
        <DashSellerProducts />
      )}

      {tab === "products" && currentUser.role === "Director" && (
        <DashProducts />
      )}

      {tab === "products" && currentUser.role === "Accountant" && (
        <DashProducts />
      )}

      {tab === "products" && currentUser.role === "StockQA" && <DashProducts />}
      {tab === "products" && currentUser.role === "StoreKeeper" && (
        <DashProducts />
      )}

      {/* add store products */}

      {tab === "storeproducts" && currentUser.role === "StoreKeeper" && (
        <DashStoreKeeperProducts />
      )}

      {/* dash */}
      {tab === "dash" && currentUser.role === "Admin" && <DashboardComp />}
      {tab === "dash" && currentUser.role === "Accountant" && <DashboardComp />}
      {tab === "dash" && currentUser.role === "Director" && <DashboardComp />}
      {tab === "dash" && currentUser.role === "Seller" && (
        <SellerDashboardHome />
      )}
      {tab === "dash" && currentUser.role === "StoreKeeper" && (
        <StoreKeeperDashboardHome />
      )}

      {/* {tab === "dash" && currentUser.role === "Director" && (
        <DirectorDashboardHome />
      )} */}

      {/* {tab === "dash" && currentUser.role === "Accountant" && (
        <AccountantDashboardHome />
      )} */}

      {tab === "dash" && currentUser.role === "StockQA" && (
        <StockQADashboardHome />
      )}

      {/* pos */}
      {tab === "pos" && <DashPOS />}
      {/* salesReport */}
      {tab === "salesReport" && <DashSalesReport />}

      {/*Sale Histor*/}
      {tab === "saleHistory" && <DashSaleHistory />}

      {/*Return Items */}
      {tab === "returnItems" && currentUser.role === "Seller" && (
        <DashCustomerReturnItem />
      )}

      {tab === "returnItems" && currentUser.role === "Accountant" && (
        <DashCustomerReturnItem />
      )}

      {tab === "returnItems" && currentUser.role === "Director" && (
        <DashCustomerReturnItem />
      )}

      {tab === "returnItems" && currentUser.role === "Admin" && (
        <DashCustomerReturnItem />
      )}
    </div>
  );
}
