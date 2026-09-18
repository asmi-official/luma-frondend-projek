import { Navigate, Route, Routes } from 'react-router-dom'
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
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product/create" element={<CreateProduct />} />
      <Route path="/product/:id/update" element={<UpdateProduct />} />
      <Route path="/data-master/role-pengguna" element={<RoleManagementList />} />
      <Route path="/data-master/kategori" element={<CategoryList />} />
      <Route path="/data-master/metode-pembayaran" element={<PaymentMethodList />} />
    </Routes>
  )
}

export default App
