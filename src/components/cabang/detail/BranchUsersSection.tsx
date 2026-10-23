import { User } from "lucide-react";
import type { Cabang } from "../../../api/cabang";

export function BranchUsersSection({ branch }: { branch: Cabang }) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-[#eef0f4] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-semibold text-[#20242d]">
          Pengguna Cabang
        </h2>
        <p className="text-xs text-[#7e8999]">
          Karyawan dengan akses ke cabang ini.
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-[#f0f1f5] pt-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#eef0ff] text-[#4e5bd6]">
            <User size={18} />
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold text-[#20242d]">
              {branch.manager_name ?? branch.created_by ?? "Administrator"}
            </p>
            <p className="text-xs text-[#7e8999]">{branch.email ?? "-"}</p>
          </div>
        </div>
        <span className="rounded-md bg-[#eef0ff] px-2.5 py-1 text-xs font-semibold text-[#4e5bd6]">
          Manager
        </span>
      </div>
    </section>
  );
}
