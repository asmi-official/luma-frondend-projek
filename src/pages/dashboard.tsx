import DashboardLayout from '../components/global/DashboardLayout'

export default function Dashboard() {
  return (
    <DashboardLayout pageTitle="Dashboard">
      <div className="flex w-full flex-col gap-5 px-7 pt-6 pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold leading-[1.2] text-[#20242d]">Dashboard</h1>
          <p className="text-sm leading-[1.4] text-[#6a7789]">
            Selamat datang di Luma. Kelola bisnis Anda dari sini.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
