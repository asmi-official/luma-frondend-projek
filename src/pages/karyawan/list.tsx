import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  type Employee,
  useDeleteKaryawan,
  useKaryawans,
  useResetKaryawanPassword,
  useToggleKaryawanActive,
} from "../../api/karyawan";
import emptyKaryawanIllustration from "../../assets/empty-karyawan.png";
import { EmployeeFilters } from "../../components/karyawan/EmployeeFilters";
import { EmployeeModals } from "../../components/karyawan/EmployeeModals";
import { EmployeeSummary } from "../../components/karyawan/EmployeeSummary";
import { EmployeeTable } from "../../components/karyawan/EmployeeTable";
import { SuccessToast } from "../../components/global/SuccessToast";
import DashboardLayout from "../../components/global/DashboardLayout";
import EmptyState from "../../components/global/EmptyState";
import PageHeader from "../../components/global/PageHeader";
import Pagination from "../../components/global/Pagination";

const PAGE_SIZE = 10;

export default function KaryawanList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [status, setStatus] = useState<"active" | "inactive" | null>(null);
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [employeeToToggleActive, setEmployeeToToggleActive] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [manageAccessEmployee, setManageAccessEmployee] = useState<Employee | null>(null);
  const [resetPasswordEmployee, setResetPasswordEmployee] = useState<Employee | null>(null);
  const [toastInfo, setToastInfo] = useState<{
    message: string;
    description: string;
  } | null>(
    location.state?.successMessage
      ? {
          message: location.state.successMessage,
          description: location.state.description || "Karyawan baru telah ditambahkan",
        }
      : null,
  );

  const { data, isLoading } = useKaryawans({
    search: search.trim() || undefined,
    role: role ?? undefined,
    status: status ?? undefined,
    sort: "created_at",
    order: "desc",
    page,
    limit: PAGE_SIZE,
  });
  const deleteKaryawanMutation = useDeleteKaryawan();
  const toggleKaryawanMutation = useToggleKaryawanActive();
  const resetPasswordMutation = useResetKaryawanPassword();

  const employees = data?.data ?? [];
  const isEmpty = !isLoading && employees.length === 0;
  const hasActiveFilters = Boolean(search.trim() || role || status);
  const totalEmployees = (data?.total_active ?? 0) + (data?.total_inactive ?? 0);
  const activeEmployees = data?.total_active ?? 0;
  const inactiveEmployees = data?.total_inactive ?? 0;
  const currentPage = data?.meta.page ?? page;
  const totalPages = data?.meta.total_pages ?? 1;
  const rangeStart = employees.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = rangeStart === 0 ? 0 : rangeStart + employees.length - 1;

  const handleToggleMenu = (id: string) => {
    setOpenMenuId((current) => (current === id ? null : id));
  };

  return (
    <DashboardLayout pageTitle="Karyawan">
      <div className="flex w-full flex-col gap-5 px-5 pt-4 pb-6 sm:px-7 sm:pt-6">
        {toastInfo && (
          <SuccessToast
            message={toastInfo.message}
            description={toastInfo.description}
            onClose={() => {
              setToastInfo(null);
              window.history.replaceState({}, document.title);
            }}
          />
        )}

        <PageHeader
          title="Karyawan"
          description="Kelola karyawan dan akses mereka ke Luma."
          actionLabel="Tambah Karyawan"
          onAction={() => navigate("/karyawan/create")}
        />

        <EmployeeFilters
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          role={role}
          onRoleChange={(value) => {
            setRole(value);
            setPage(1);
          }}
          status={status}
          onStatusChange={(value) => {
            setStatus(value as "active" | "inactive" | null);
            setPage(1);
          }}
        />

        <EmployeeSummary
          total={totalEmployees}
          active={activeEmployees}
          inactive={inactiveEmployees}
        />

        {isLoading ? (
          <div className="rounded-xl border border-[#ebedf1] bg-white py-10 text-center text-sm text-[#8f99a7]">
            Memuat data karyawan...
          </div>
        ) : isEmpty ? (
          <EmptyState
            image={emptyKaryawanIllustration}
            title={hasActiveFilters ? "Karyawan tidak ditemukan" : "Belum ada karyawan"}
            description={
              hasActiveFilters
                ? "Coba ubah kata kunci atau filter pencarian Anda."
                : "Tambahkan karyawan pertama untuk mulai mendelegasikan tugas dan operasional kasir atau cabang."
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            <EmployeeTable
              employees={employees}
              openMenuId={openMenuId}
              onToggleMenu={handleToggleMenu}
              onViewDetail={(employee) => {
                setOpenMenuId(null);
                setSelectedEmployee(employee);
              }}
              onManageAccess={(employee) => {
                setOpenMenuId(null);
                setManageAccessEmployee(employee);
              }}
              onDelete={(employee) => {
                setOpenMenuId(null);
                setEmployeeToDelete(employee);
              }}
            />
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={setPage}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              totalItems={data?.meta.total ?? 0}
              itemLabel="karyawan"
            />
          </div>
        )}

        <EmployeeModals
          selectedEmployee={selectedEmployee}
          onCloseDetail={() => setSelectedEmployee(null)}
          onToggleActive={(employee) => {
            setEmployeeToToggleActive(employee);
            setSelectedEmployee(null);
          }}
          onEdit={(employee) => navigate(`/karyawan/${employee.id}/update`)}
          employeeToDelete={employeeToDelete}
          isDeleting={deleteKaryawanMutation.isPending}
          onConfirmDelete={() => {
            if (!employeeToDelete) return;
            deleteKaryawanMutation.mutate(employeeToDelete.id, {
              onSuccess: () => {
                setToastInfo({
                  message: "Karyawan berhasil dihapus",
                  description: "Data karyawan telah berhasil dihapus dari sistem",
                });
                setEmployeeToDelete(null);
              },
            });
          }}
          onCancelDelete={() => setEmployeeToDelete(null)}
          employeeToToggleActive={employeeToToggleActive}
          isTogglingActive={toggleKaryawanMutation.isPending}
          onConfirmToggleActive={() => {
            if (!employeeToToggleActive) return;
            const wasActive = employeeToToggleActive.active;
            toggleKaryawanMutation.mutate(employeeToToggleActive.id, {
              onSuccess: () => {
                setToastInfo({
                  message: wasActive
                    ? "Karyawan berhasil dinonaktifkan"
                    : "Karyawan berhasil diaktifkan",
                  description: wasActive
                    ? "Status karyawan telah diubah menjadi nonaktif"
                    : "Status karyawan telah diubah menjadi aktif",
                });
                setEmployeeToToggleActive(null);
              },
            });
          }}
          onCancelToggleActive={() => setEmployeeToToggleActive(null)}
          manageAccessEmployee={manageAccessEmployee}
          onCloseManageAccess={() => setManageAccessEmployee(null)}
          onResetPassword={(employee) => {
            setManageAccessEmployee(null);
            setResetPasswordEmployee(employee);
          }}
          resetPasswordEmployee={resetPasswordEmployee}
          isResettingPassword={resetPasswordMutation.isPending}
          onCloseResetPassword={() => setResetPasswordEmployee(null)}
          onResetPasswordSuccess={(password) => {
            if (!resetPasswordEmployee) return;
            resetPasswordMutation.mutate(
              { id: resetPasswordEmployee.id, password },
              {
                onSuccess: () => {
                  setToastInfo({
                    message: "Password berhasil diubah",
                    description: "Password baru telah berhasil disimpan untuk karyawan ini",
                  });
                  setResetPasswordEmployee(null);
                },
              },
            );
          }}
        />
      </div>
    </DashboardLayout>
  );
}
