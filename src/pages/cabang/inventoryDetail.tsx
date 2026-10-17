import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/global/DashboardLayout";
import { useFlexParams } from "../../api/flexParams";
import {
  BranchInventoryContent,
  type InventoryItem,
} from "../../components/cabang/BranchInventoryContent";
import { DUMMY_BRANCH_DETAILS } from "./dummyData";

const INVENTORY: InventoryItem[] = [
  {
    name: "Kopi Arabika 1kg",
    category: "Bahan Baku",
    stock: 3,
    min: 10,
    status: "Menipis",
  },
  {
    name: "Susu UHT Full Cream",
    category: "Bahan Baku",
    stock: 5,
    min: 15,
    status: "Menipis",
  },
  { name: "Cup 12oz", category: "Kemasan", stock: 0, min: 50, status: "Habis" },
  {
    name: "Sirup Karamel",
    category: "Bahan Baku",
    stock: 2,
    min: 8,
    status: "Menipis",
  },
  {
    name: "Kopi Robusta 1kg",
    category: "Bahan Baku",
    stock: 18,
    min: 10,
    status: "Tersedia",
  },
  {
    name: "Susu Oat",
    category: "Bahan Baku",
    stock: 12,
    min: 8,
    status: "Tersedia",
  },
  {
    name: "Cup 16oz",
    category: "Kemasan",
    stock: 40,
    min: 50,
    status: "Tersedia",
  },
  {
    name: "Sedotan Kertas",
    category: "Kemasan",
    stock: 8,
    min: 20,
    status: "Menipis",
  },
  {
    name: "Sirup Vanilla",
    category: "Bahan Baku",
    stock: 9,
    min: 8,
    status: "Tersedia",
  },
  {
    name: "Tisu Napkin",
    category: "Perlengkapan",
    stock: 25,
    min: 15,
    status: "Tersedia",
  },
];

export default function DetailInventory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: flexData } = useFlexParams({
    filter: [{ key: "type_param", operator: "equal", value: "BRANCH_OWNER" }],
    page: 1,
    limit: 100,
  });
  const branch = flexData?.data?.find((item) => item.id === id);
  const dummyInfo = id ? DUMMY_BRANCH_DETAILS[id] : undefined;
  const branchName = branch ? branch.value_param : (dummyInfo ? "Cabang Kemang Raya" : "Cabang");

  return (
    <DashboardLayout pageTitle="Status Inventory">
      <BranchInventoryContent
        branchName={branchName}
        inventory={INVENTORY}
        onBack={() => navigate(`/cabang/detail/${id ?? ""}`)}
      />
    </DashboardLayout>
  );
}
