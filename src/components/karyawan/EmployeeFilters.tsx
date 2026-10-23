import FilterDropdown from "../global/FilterDropdown";
import DynamicLucideIcon from "../../icon/DynamicLucideIcon";

type EmployeeFiltersProps = {
  search: string;
  onSearchChange: (val: string) => void;
  role: string | null;
  onRoleChange: (val: string | null) => void;
  status: string | null;
  onStatusChange: (val: string | null) => void;
};

export function EmployeeFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
}: EmployeeFiltersProps) {
  return (
    <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#e9e9ea] bg-white p-3">
        <DynamicLucideIcon name="search" size={18} className="text-[#8f99a7]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama produk atau SKU...."
          className="w-full text-sm text-[#20242d] placeholder:text-[#8f99a7] focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <FilterDropdown
          allLabel="Semua Role"
          options={[
            { value: "Kasir", label: "Kasir" },
            { value: "Staff", label: "Staff" },
            { value: "Manager", label: "Manager" },
            { value: "Owner", label: "Owner" },
          ]}
          value={role}
          onChange={onRoleChange}
        />
        <FilterDropdown
          allLabel="Semua Status"
          options={[
            { value: "active", label: "Aktif" },
            { value: "inactive", label: "Nonaktif" },
          ]}
          value={status}
          onChange={onStatusChange}
        />
      </div>
    </div>
  );
}
