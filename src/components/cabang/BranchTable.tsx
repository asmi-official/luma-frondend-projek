import type { FlexParam } from "../../api/flexParams";
import { StatusBadge } from "./StatusBadge";
import { LoadingRows } from "./BranchComponents";
import { BranchActionMenu } from "./BranchActionMenu";
import { DUMMY_BRANCH_DETAILS } from "../../pages/cabang/dummyData";

interface BranchTableProps {
  isLoading: boolean;
  isError: boolean;
  branches: FlexParam[];
  openMenuId: string | null;
  onToggleMenu: (id: string) => void;
  onViewDetail: (id: string) => void;
  onToggleActiveBranch: (branch: FlexParam) => void;
  onDeleteBranch: (branch: FlexParam) => void;
  getBranchCode: (id: string) => string;
}

// Total 1124px: 316 / 186 / 150 / 114 / 148 / 146 / 64
const COLUMNS = [
  { label: "Cabang", width: "28.1%" },
  { label: "Penanggung Jawab", width: "16.5%" },
  { label: "Penjualan", width: "13.3%" },
  { label: "Transaksi", width: "10.2%" },
  { label: "Pengeluaran", width: "13.2%" },
  { label: "Status", width: "13%" },
  { label: "Aksi", width: "5.7%" },
];

export function BranchTable({
  isLoading,
  isError,
  branches,
  openMenuId,
  onToggleMenu,
  onViewDetail,
  onToggleActiveBranch,
  onDeleteBranch,
  getBranchCode,
}: BranchTableProps) {
  return (
    <div className="w-full rounded-[12px] border border-[#eceef2] bg-white">
      <table className="w-full table-fixed border-collapse text-left">
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
          {isLoading && <LoadingRows />}
          {isError && (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-12 text-center text-sm text-[#8f99a7]"
              >
                Data cabang gagal dimuat. Silakan coba lagi.
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            branches.map((branch: FlexParam) => {
              const dummyInfo = DUMMY_BRANCH_DETAILS[branch.id];
              const code = dummyInfo
                ? dummyInfo.code
                : getBranchCode(branch.id);
              const manager = dummyInfo ? dummyInfo.manager : (branch.created_by || "Administrator");
              const salesNumber = dummyInfo ? parseInt(dummyInfo.sales.replace(/[^0-9]/g, ""), 10) : 0;
              const sales = salesNumber > 0 ? `Rp ${salesNumber.toLocaleString("id-ID")}` : "Rp 0";
              const transactions = dummyInfo ? dummyInfo.transactions : 0;
              const expenseNumber = dummyInfo ? parseInt(dummyInfo.expenses.replace(/[^0-9]/g, ""), 10) : 0;
              const expenses = expenseNumber > 0 ? `Rp ${expenseNumber.toLocaleString("id-ID")}` : "Rp 0";

              return (
                <tr
                  key={branch.id}
                  className="border-b border-[#f0f1f5] last:border-b-0 hover:bg-[#fcfcff]"
                >
                  <td className="px-4 py-[11px]">
                    <p className="truncate text-sm font-semibold leading-5 text-[#303641]">
                      {branch.value_param}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-4 text-[#9aa5b5]">
                      {code}
                    </p>
                  </td>
                  <td className="truncate px-4 py-[11px] text-[13px] text-[#556070]">
                    {manager}
                  </td>
                  <td className="px-4 py-[11px] text-[13px] font-semibold text-[#20242d]">
                    {sales}
                  </td>
                  <td className="px-4 py-[11px] text-[13px] text-[#556070]">
                    {transactions}
                  </td>
                  <td className="px-4 py-[11px] text-[13px] font-semibold text-[#d1293d]">
                    {expenses}
                  </td>
                  <td className="px-4 py-[11px]">
                    <StatusBadge active={branch.active} />
                  </td>
                  <td className="relative px-4 py-[11px]">
                    <BranchActionMenu
                      branch={branch}
                      isOpen={openMenuId === branch.id}
                      onToggle={() => onToggleMenu(branch.id)}
                      onViewDetail={() => onViewDetail(branch.id)}
                      onToggleActive={() => onToggleActiveBranch(branch)}
                      onDelete={() => onDeleteBranch(branch)}
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
