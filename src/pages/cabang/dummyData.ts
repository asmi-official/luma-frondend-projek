import type { FlexParam } from "../../api/flexParams";

export interface BranchDummyMeta {
  code: string;
  manager: string;
  sales: string;
  transactions: number;
  expenses: string;
}

export const DUMMY_BRANCH_DETAILS: Record<string, BranchDummyMeta> = {
  "dummy-cabang-01": {
    code: "KMR-01",
    manager: "Dewi Anggraini",
    sales: "Rp 42.500.000",
    transactions: 512,
    expenses: "Rp 12.100.000",
  },
  "dummy-cabang-02": {
    code: "KLG-02",
    manager: "Rian Saputra",
    sales: "Rp 38.200.000",
    transactions: 470,
    expenses: "Rp 10.800.000",
  },
  "dummy-cabang-03": {
    code: "BSD-03",
    manager: "Nadia Kusuma",
    sales: "Rp 51.750.000",
    transactions: 601,
    expenses: "Rp 15.300.000",
  },
  "dummy-cabang-04": {
    code: "DGB-04",
    manager: "Fajar Nugroho",
    sales: "Rp 33.900.000",
    transactions: 388,
    expenses: "Rp 9.450.000",
  },
  "dummy-cabang-05": {
    code: "MLB-05",
    manager: "Rina Wulandari",
    sales: "Rp 8.200.000",
    transactions: 95,
    expenses: "Rp 2.100.000",
  },
  "dummy-cabang-06": {
    code: "SDM-06",
    manager: "Andi Wijaya",
    sales: "Rp 46.300.000",
    transactions: 549,
    expenses: "Rp 13.700.000",
  },
  "dummy-cabang-07": {
    code: "CHB-07",
    manager: "Siti Amalla",
    sales: "Rp 29.400.000",
    transactions: 340,
    expenses: "Rp 8.100.000",
  },
  "dummy-cabang-08": {
    code: "PIK-08",
    manager: "Tono Saputra",
    sales: "Rp 55.600.000",
    transactions: 612,
    expenses: "Rp 16.200.000",
  },
  "dummy-cabang-09": {
    code: "SPL-09",
    manager: "Wahyu Pratama",
    sales: "Rp 21.750.000",
    transactions: 260,
    expenses: "Rp 6.400.000",
  },
  "dummy-cabang-10": {
    code: "LGN-10",
    manager: "Rina Wulandari",
    sales: "Rp 5.100.000",
    transactions: 62,
    expenses: "Rp 1.800.000",
  },
};

function branch(id: string, name: string, active: boolean, createdAt: string): FlexParam {
  return {
    id,
    type_param: "BRANCH_OWNER",
    value_param: name,
    description: null,
    user_id: "dummy-user",
    owner_id: null,
    photo_id: null,
    photo_url: null,
    header_id: null,
    level: null,
    icon: "building-2",
    color_icon: "#4e5bd6",
    color_bg_icon: "#eef0ff",
    active,
    created_at: createdAt,
    created_by: "dummy-user",
    updated_at: createdAt,
    updated_by: "dummy-user",
    deleted_at: null,
    deleted_by: null,
  };
}

export const DUMMY_BRANCHES: FlexParam[] = [
  branch("dummy-cabang-01", "Cabang Kemang Raya", true, "2026-10-16T09:00:00.000Z"),
  branch("dummy-cabang-02", "Cabang Kelapa Gading", true, "2026-10-15T09:00:00.000Z"),
  branch("dummy-cabang-03", "Cabang BSD City", true, "2026-10-14T09:00:00.000Z"),
  branch("dummy-cabang-04", "Cabang Dago Bandung", true, "2026-10-13T09:00:00.000Z"),
  branch("dummy-cabang-05", "Cabang Malioboro Jogja", false, "2026-10-12T09:00:00.000Z"),
  branch("dummy-cabang-06", "Cabang Sudirman CBD", true, "2026-10-11T09:00:00.000Z"),
  branch("dummy-cabang-07", "Cabang Cihampelas Bandung", true, "2026-10-10T09:00:00.000Z"),
  branch("dummy-cabang-08", "Cabang PIK Jakarta", true, "2026-10-09T09:00:00.000Z"),
  branch("dummy-cabang-09", "Cabang Simpang Lima Semarang", true, "2026-10-08T09:00:00.000Z"),
  branch("dummy-cabang-10", "Cabang Legian Bali", false, "2026-10-07T09:00:00.000Z"),
];
