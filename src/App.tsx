import { Navigate, Route, Routes } from 'react-router-dom'
import GuestRoute from './components/global/GuestRoute'
import ProtectedRoute from './components/global/ProtectedRoute'
import CabangList from './pages/cabang/list'
import CreateCabang from './pages/cabang/create'
import UpdateCabang from './pages/cabang/update'
import Dashboard from './pages/dashboard'
import CategoryList from './pages/data-master/category/list'
import PaymentMethodList from './pages/data-master/payment-methods/list'
import RoleManagementList from './pages/data-master/role-management/list'
import Login from './pages/login'
import CreateProduct from './pages/product/create'
import UpdateProduct from './pages/product/update'
import Register from './pages/register'


function App() {
  return (
    <Routes>
      {/* Route untuk guest (belum login) -- kalau sudah login, redirect ke /dashboard */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Route yang butuh login -- kalau belum login, redirect ke /login */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cabang" element={<CabangList />} />
        <Route path="/cabang/create" element={<CreateCabang />} />
        <Route path="/cabang/update/:id" element={<UpdateCabang />} />
        <Route path="/product/create" element={<CreateProduct />} />
        <Route path="/product/:id/update" element={<UpdateProduct />} />
        <Route path="/data-master/role-pengguna" element={<RoleManagementList />} />
        <Route path="/data-master/kategori" element={<CategoryList />} />
        <Route path="/data-master/metode-pembayaran" element={<PaymentMethodList />} />
      </Route>

      {/* Root redirect ke dashboard (ProtectedRoute akan handle kalau belum login) */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
