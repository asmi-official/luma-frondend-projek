import type { FlexParam } from "../../api/flexParams";

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
