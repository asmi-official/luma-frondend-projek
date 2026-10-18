import { Navigate, Route, Routes } from "react-router-dom";
import GuestRoute from "./components/global/GuestRoute";
import ProtectedRoute from "./components/global/ProtectedRoute";
import CabangList from "./pages/cabang/list";
import CreateCabang from "./pages/cabang/create";
import UpdateCabang from "./pages/cabang/update";
import DetailCabang from "./pages/cabang/detail";
import DetailInventory from "./pages/cabang/inventoryDetail";
import Dashboard from "./pages/dashboard";
import InventoryList from "./pages/inventory/list";
import ExpenseList from "./pages/pengeluaran/list";
import CategoryList from "./pages/data-master/category/list";
import CreatePromo from "./pages/data-master/event-promo/create";
import EventPromoList from "./pages/data-master/event-promo/list";
import UpdatePromo from "./pages/data-master/event-promo/update";
import PaymentMethodList from "./pages/data-master/payment-methods/list";
import RoleManagementList from "./pages/data-master/role-management/list";
import Login from "./pages/login";
import ProductList from "./pages/product/list";
import CreateProduct from "./pages/product/create";
import UpdateProduct from "./pages/product/update";
import Register from "./pages/register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/pengeluaran" element={<ExpenseList />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/product/create" element={<CreateProduct />} />
        <Route path="/product/:id/update" element={<UpdateProduct />} />
        <Route path="/cabang" element={<CabangList />} />
        <Route path="/cabang/create" element={<CreateCabang />} />
        <Route path="/cabang/update/:id" element={<UpdateCabang />} />
        <Route path="/cabang/detail/:id" element={<DetailCabang />} />
        <Route path="/cabang/detail/:id/inventory" element={<DetailInventory />} />
        <Route path="/data-master/role-pengguna" element={<RoleManagementList />} />
        <Route path="/data-master/kategori" element={<CategoryList />} />
        <Route path="/data-master/metode-pembayaran" element={<PaymentMethodList />} />
        <Route path="/data-master/event-promo" element={<EventPromoList />} />
        <Route path="/data-master/event-promo/create" element={<CreatePromo />} />
        <Route path="/data-master/event-promo/:id/update" element={<UpdatePromo />} />
      </Route>
    </Routes>
  );
}

export default App;
