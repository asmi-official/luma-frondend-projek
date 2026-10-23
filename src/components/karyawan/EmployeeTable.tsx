import { StatusBadge } from "../cabang/StatusBadge";
import { EmployeeActionMenu } from "./EmployeeActionMenu";
import type { Employee } from "../../api/karyawan";
import { useNavigate } from "react-router-dom";

interface EmployeeTableProps {
  employees: Employee[];
  openMenuId: string | null;
  onToggleMenu: (id: string) => void;
  onViewDetail: (employee: Employee) => void;
  onManageAccess: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const COLUMNS = [
  { label: "Karyawan", width: "26%" },
  { label: "Email", width: "22%" },
  { label: "Role", width: "14%" },
  { label: "Cabang", width: "12%" },
  { label: "Status", width: "10%" },
  { label: "Terakhir Login", width: "12%" },
  { label: "Aksi", width: "6%" },
];

const formatLastLogin = (lastLogin: string | null) =>
  lastLogin
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(lastLogin))
    : "Belum pernah login";

export function EmployeeTable({
  employees,
  openMenuId,
  onToggleMenu,
  onViewDetail,
  onManageAccess,
  onDelete,
}: EmployeeTableProps) {
  return (
    <div className="w-full rounded-[12px] border border-[#eceef2] bg-white overflow-x-auto">
      <table className="w-full min-w-[800px] table-fixed border-collapse text-left">
        <colgroup>
          {COLUMNS.map((col) => (
            <col key={col.label} style={{ width: col.width }} />
          ))}
        </colgroup>
        <thead className="bg-[#fbfbfc]">
          <tr className="border-b border-[#eceef2]">
            {COLUMNS.map((col, i) => (
              <th
                key={col.label}
                className={`whitespace-nowrap px-4 py-3 text-xs font-medium leading-4 text-[#7e8999] ${
                  i === 0 ? "rounded-tl-[12px]" : ""
                } ${i === COLUMNS.length - 1 ? "rounded-tr-[12px]" : ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp.id}
              className="border-b border-[#f0f1f5] last:border-b-0 hover:bg-[#fcfcff]"
            >
              <td
                className="px-4 py-[11px] cursor-pointer"
                onClick={() => onViewDetail(emp)}
              >
                <p className="truncate text-sm font-semibold leading-5 text-[#303641] hover:text-[#4e5bd6]">
                  {emp.name}
                </p>
                <p className="mt-0.5 text-[11px] leading-4 text-[#9aa5b5]">
                  {emp.employeeId}
                </p>
              </td>
              <td className="truncate px-4 py-[11px] text-[13px] text-[#556070]">
                {emp.email}
              </td>
              <td className="truncate px-4 py-[11px] text-[13px] font-medium text-[#20242d]">
                {emp.role}
              </td>
              <td className="truncate px-4 py-[11px] text-[13px] text-[#556070]">
                {emp.branch ?? "-"}
              </td>
              <td className="px-4 py-[11px]">
                <StatusBadge active={emp.active} />
              </td>
              <td className="truncate px-4 py-[11px] text-xs text-[#6a7789]">
                {formatLastLogin(emp.lastLogin)}
              </td>
              <td className="relative px-4 py-[11px]">
                <EmployeeActionMenu
                  employee={emp}
                  isOpen={openMenuId === emp.id}
                  onToggle={() => onToggleMenu(emp.id)}
                  onViewDetail={() => onViewDetail(emp)}
                  onManageAccess={() => onManageAccess(emp)}
                  onDelete={() => onDelete(emp)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
