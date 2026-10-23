import ConfirmDeleteModal from "../../components/global/ConfirmDeleteModal";
import CustomConfirmModal from "../../components/global/CustomConfirmModal";
import EmployeeDetailDrawer from "../../components/karyawan/EmployeeDetailDrawer";
import ManageAccessModal from "../../components/karyawan/ManageAccessModal";
import ResetPasswordModal from "../../components/karyawan/ResetPasswordModal";
import type { Employee } from "../../api/karyawan";

type EmployeeModalsProps = {
  selectedEmployee: Employee | null;
  onCloseDetail: () => void;
  onToggleActive: (emp: Employee) => void;
  onEdit: (emp: Employee) => void;

  employeeToDelete: Employee | null;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  isDeleting?: boolean;

  employeeToToggleActive: Employee | null;
  onConfirmToggleActive: () => void;
  onCancelToggleActive: () => void;
  isTogglingActive?: boolean;

  manageAccessEmployee: Employee | null;
  onCloseManageAccess: () => void;
  onResetPassword: (emp: Employee) => void;

  resetPasswordEmployee: Employee | null;
  onCloseResetPassword: () => void;
  onResetPasswordSuccess: (password: string) => void;
  isResettingPassword?: boolean;
};

export function EmployeeModals({
  selectedEmployee,
  onCloseDetail,
  onToggleActive,
  onEdit,
  employeeToDelete,
  onConfirmDelete,
  onCancelDelete,
  isDeleting = false,
  employeeToToggleActive,
  onConfirmToggleActive,
  onCancelToggleActive,
  isTogglingActive = false,
  manageAccessEmployee,
  onCloseManageAccess,
  onResetPassword,
  resetPasswordEmployee,
  onCloseResetPassword,
  onResetPasswordSuccess,
  isResettingPassword = false,
}: EmployeeModalsProps) {
  return (
    <>
      <EmployeeDetailDrawer
        employee={selectedEmployee}
        onClose={onCloseDetail}
        onToggleActive={() => {
          if (selectedEmployee) {
            onToggleActive(selectedEmployee);
          }
        }}
        onEdit={onEdit}
      />

      <ConfirmDeleteModal
        open={Boolean(employeeToDelete)}
        itemName={employeeToDelete?.name ?? ""}
        isLoading={isDeleting}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />

      <CustomConfirmModal
        open={Boolean(employeeToToggleActive)}
        title={
          employeeToToggleActive?.active
            ? "Nonaktifkan karyawan ini?"
            : "Aktifkan karyawan ini?"
        }
        description={
          <>
            <span className="font-medium">
              {employeeToToggleActive?.name}
            </span>{" "}
            {employeeToToggleActive?.active
              ? "akan dinonaktifkan dan tidak dapat masuk atau menggunakan Luma. Data karyawan tetap tersimpan."
              : "akan diaktifkan kembali dan dapat mengakses sistem. Data karyawan tetap tersimpan."}
          </>
        }
        icon={null}
        iconBgClassName="bg-[#fce9ea] text-[#d1293d]"
        confirmText={
          employeeToToggleActive?.active ? "Ya, Nonaktifkan" : "Ya, Aktifkan"
        }
        confirmButtonClassName="bg-[#d1293d] hover:bg-[#b5222f] text-[#fdfeff]"
        cancelButtonClassName="border-[#d1293d] text-[#d1293d] hover:bg-[#fef2f2]"
        onConfirm={onConfirmToggleActive}
        onCancel={onCancelToggleActive}
        isLoading={isTogglingActive}
      />

      <ManageAccessModal
        employee={manageAccessEmployee}
        onClose={onCloseManageAccess}
        onResetPassword={() => {
          if (manageAccessEmployee) {
            onResetPassword(manageAccessEmployee);
          }
        }}
      />

      <ResetPasswordModal
        employee={resetPasswordEmployee}
        onClose={onCloseResetPassword}
        onSuccess={onResetPasswordSuccess}
        isLoading={isResettingPassword}
      />
    </>
  );
}
