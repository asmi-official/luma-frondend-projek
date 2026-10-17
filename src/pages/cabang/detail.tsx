import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/global/DashboardLayout";
import { useFlexParams } from "../../api/flexParams";
import {
  ChevronLeft,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  CircleDollarSign,
  FileText,
  CreditCard,
  Package,
} from "lucide-react";
import {
  BranchHeader,
  StatCard,
  ListCard,
  IconTile,
} from "../../components/cabang/BranchDetailComponents";
import { DUMMY_BRANCH_DETAILS } from "./dummyData";

/* ---------- Data constants ---------- */

const TRANSACTIONS = [
  { name: "Trx #48213", meta: "14:32 • Dewi Anggraini • QRIS", amount: "Rp68.000" },
  { name: "Trx #48212", meta: "14:10 • Rian Saputra • Tunai", amount: "Rp45.000" },
  { name: "Trx #48211", meta: "13:52 • Dewi Anggraini • QRIS", amount: "Rp122.000" },
  { name: "Trx #48210", meta: "13:20 • Rian Saputra • QRIS", amount: "Rp35.000" },
];

const EXPENSES = [
  { name: "Belanja Bahan Baku", meta: "Hari Ini • Dewi Anggraini", amount: "Rp850.000" },
  { name: "Listrik & Air", meta: "Kemarin • Dewi Anggraini", amount: "Rp320.000" },
  { name: "Kebersihan Outlet", meta: "2 hari lalu • Dewi Anggraini", amount: "Rp70.000" },
  { name: "Maintenance Mesin Kopi", meta: "3 hari lalu • Dewi Anggraini", amount: "Rp450.000" },
];

const INVENTORY = [
  { name: "Kopi Arabika 1kg", stock: "Tersisa 3 unit", status: "menipis" as const },
  { name: "Susu UHT Full Cream", stock: "Tersisa 5 unit", status: "menipis" as const },
  { name: "Cup 12oz", stock: "Tersisa 0 unit", status: "habis" as const },
  { name: "Sirup Karamel", stock: "Tersisa 2 unit", status: "menipis" as const },
];

/* ---------- Sub-render components ---------- */

function Row({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[#f8f9fc] last:border-0">
      <div>
        <p className="text-[13px] font-semibold text-[#20242d]">{title}</p>
        <p className="text-[11px] leading-4 text-[#9aa5b5]">{subtitle}</p>
      </div>
      {right}
    </div>
  );
}

function StockBadge({ status }: { status: "menipis" | "habis" }) {
  const isHabis = status === "habis";
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        isHabis ? "bg-[#fef2f2] text-[#d1293d]" : "bg-[#fff6ed] text-[#ef9362]"
      }`}
    >
      {isHabis ? "Habis" : "Menipis"}
    </span>
  );
}

const CARD =
  "rounded-xl border border-[#eef0f4] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]";

/* ---------- Main DetailCabang Component ---------- */

export default function DetailCabang() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: flexData } = useFlexParams({
    filter: [{ key: "type_param", operator: "equal", value: "BRANCH_OWNER" }],
    page: 1,
    limit: 100,
  });

  const branch = flexData?.data?.find((item) => item.id === id);
  const dummyInfo = id ? DUMMY_BRANCH_DETAILS[id] : undefined;

  const branchName = branch ? branch.value_param : (dummyInfo ? "Cabang Kemang Raya" : "Detail Cabang");
  const branchCode = dummyInfo ? dummyInfo.code : (branch ? `CBG-${branch.id.slice(-4).toUpperCase()}` : "KMR-01");
  const branchAddress = branch && branch.description ? branch.description : "Jl. Kemang Raya No. 45, Jakarta Selatan";
  const managerName = dummyInfo ? dummyInfo.manager : (branch?.created_by || "Dewi Anggraini");
  const isActive = branch ? branch.active : true;

  return (
    <DashboardLayout pageTitle="Detail Cabang">
      <div className="flex w-full flex-col gap-6 px-6 pt-5 pb-12 sm:px-8 sm:pt-6">
        {/* Back Link */}
        <div>
          <button
            type="button"
            onClick={() => navigate("/cabang")}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#4e5bd6] hover:underline"
          >
            <ChevronLeft size={16} />
            Kembali ke List Cabang
          </button>
        </div>

        {/* Header branch card */}
        <BranchHeader
          name={branchName}
          code={branchCode}
          address={branchAddress}
          phone="+62 812-3456-7890"
          manager={managerName}
          active={isActive}
        />

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Penjualan Hari Ini"
            value="Rp 4.850.000"
            description="58 transaksi"
            icon={<Wallet size={20} />}
            iconClass="border-[#cdd3ff] bg-[#fcfcff] text-[#6270dd]"
          />
          <StatCard
            label="Transaksi Hari Ini"
            value="58"
            description="Rata-rata Rp 83.600"
            icon={<CreditCard size={20} />}
            iconClass="border-[#e2caff] bg-[#fefcff] text-[#aa75e8]"
          />
          <StatCard
            label="Pengeluaran Hari Ini"
            value="Rp 1.240.000"
            description="6 pencatatan"
            icon={<CircleDollarSign size={20} />}
            iconClass="border-[#ffd1b7] bg-[#fffdfc] text-[#ef9362]"
          />
          <StatCard
            label="Stok Menipis"
            value="5 item"
            description="Perlu restock segera"
            icon={<Package size={20} />}
            iconClass="border-[#9ee7c9] bg-[#fbfffd] text-[#36b985]"
          />
        </div>

        {/* Aktivitas Keuangan Section */}
        <div className={`${CARD} flex flex-col gap-5 p-6`}>
          <div>
            <h2 className="text-base font-semibold text-[#20242d]">
              Aktivitas Keuangan
            </h2>
            <p className="text-xs text-[#9aa5b5]">
              Ringkasan arus kas cabang ini bulan berjalan.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#f0f1f5] bg-[#fafbfc] p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#36b985]">
                <span className="flex size-5 items-center justify-center rounded bg-[#36b985]/10">
                  <ArrowUpRight size={14} />
                </span>
                Pemasukan
              </div>
              <p className="text-xl font-bold text-[#20242d]">Rp 128.400.000</p>
            </div>

            <div className="rounded-xl border border-[#f0f1f5] bg-[#fafbfc] p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#ef9362]">
                <span className="flex size-5 items-center justify-center rounded bg-[#ef9362]/10">
                  <ArrowDownRight size={14} />
                </span>
                Pengeluaran
              </div>
              <p className="text-xl font-bold text-[#20242d]">Rp 34.900.000</p>
            </div>

            <div className="rounded-xl border border-[#f0f1f5] bg-[#fafbfc] p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6270dd]">
                <span className="flex size-5 items-center justify-center rounded bg-[#6270dd]/10">
                  <Wallet size={14} />
                </span>
                Arus Bersih
              </div>
              <p className="text-xl font-bold text-[#20242d]">Rp 93.500.000</p>
            </div>
          </div>
        </div>

        {/* 3 Columns Lists */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <ListCard
            title="Transaksi"
            icon={<Wallet size={16} />}
            iconClass="border-[#cdd3ff] bg-[#fcfcff] text-[#6270dd]"
          >
            {TRANSACTIONS.map((t) => (
              <Row
                key={t.name}
                title={t.name}
                subtitle={t.meta}
                right={
                  <span className="text-[13px] font-bold text-[#20242d]">
                    {t.amount}
                  </span>
                }
              />
            ))}
          </ListCard>

          <ListCard
            title="Pengeluaran"
            icon={<ArrowDownRight size={16} />}
            iconClass="border-[#ffd1b7] bg-[#fffdfc] text-[#ef9362]"
          >
            {EXPENSES.map((e) => (
              <Row
                key={e.name}
                title={e.name}
                subtitle={e.meta}
                right={
                  <span className="text-[13px] font-bold text-[#d1293d]">
                    {e.amount}
                  </span>
                }
              />
            ))}
          </ListCard>

          <ListCard
            title="Status Inventory"
            icon={<Package size={16} />}
            iconClass="border-[#9ee7c9] bg-[#fbfffd] text-[#36b985]"
            onViewAll={() => navigate(`/cabang/detail/${id}/inventory`)}
          >
            {INVENTORY.map((i) => (
              <Row
                key={i.name}
                title={i.name}
                subtitle={i.stock}
                right={<StockBadge status={i.status} />}
              />
            ))}
          </ListCard>
        </div>

        {/* Aktivitas Terbaru */}
        <div className={`${CARD} flex flex-col gap-5 p-6`}>
          <h3 className="text-base font-semibold text-[#20242d]">
            Aktivitas Terbaru
          </h3>
          <div className="flex flex-col gap-5">
            {[
              {
                text: "Transaksi baru sebesar Rp 350.000 tercatat",
                time: "12 menit lalu",
                icon: <FileText size={15} />,
                tile: "border-[#efe6c8] bg-[#f8f3e1] text-[#a08a3c]",
              },
              {
                text: "Pengeluaran operasional dicatat oleh " + managerName,
                time: "1 jam lalu",
                icon: <ArrowLeftRight size={15} className="rotate-90" />,
                tile: "border-[#ffd0d8] bg-[#fdecef] text-[#d1293d]",
              },
              {
                text: "Stok Kopi Arabika ditandai menipis",
                time: "3 jam lalu",
                icon: <Package size={15} />,
                tile: "border-[#e6d6fb] bg-[#f3ecff] text-[#aa75e8]",
              },
            ].map((a) => (
              <div key={a.text} className="flex items-center gap-4">
                <IconTile size="size-8" className={`rounded-lg ${a.tile}`}>
                  {a.icon}
                </IconTile>
                <div>
                  <p className="text-[13px] font-medium leading-5 text-[#20242d]">
                    {a.text}
                  </p>
                  <p className="text-[11px] leading-4 text-[#9aa5b5]">
                    {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pengguna Cabang */}
        <div className={`${CARD} flex flex-col gap-4 p-6`}>
          <div>
            <h3 className="text-base font-semibold text-[#20242d]">
              Pengguna Cabang
            </h3>
            <p className="text-xs text-[#9aa5b5]">
              Karyawan dengan akses ke cabang ini.
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-[#f0f1f5] pt-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-[13px] font-semibold text-[#20242d]">
                {managerName}
              </p>
              <p className="text-[11px] text-[#9aa5b5]">
                {managerName.toLowerCase().replace(/\s+/g, "")}@kopikita.id
              </p>
            </div>
            <span className="text-xs font-medium text-[#7e8999]">Manager</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
