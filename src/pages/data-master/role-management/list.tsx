import Button from '@mui/material/Button'
import { useEffect, useRef, useState } from 'react'
import {
  useDeleteRoleMenuPermission,
  useInfiniteRoleMenuPermissions,
  type RoleMenuPermission,
} from '../../../api/role-menu-permision'
import CreateRoleModal from '../../../components/data-master/role-management/CreateRoleModal'
import RoleCard from '../../../components/data-master/role-management/RoleCard'
import StatCard from '../../../components/data-master/role-management/StatCard'
import ConfirmDeleteModal from '../../../components/global/ConfirmDeleteModal'
import DashboardLayout from '../../../components/global/DashboardLayout'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import PlusIcon from '../../../icon/PlusIcon'
import ShieldIcon from '../../../icon/ShieldIcon'
import UsersRoundIcon from '../../../icon/UsersRoundIcon'
import type { Role, RoleFormValues } from './types'

type RoleWithVisual = Role & {
  icon: string | null
  colorIcon: string | null
  colorBgIcon: string | null
}

export default function RoleManagementList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<RoleWithVisual | null>(null)
  const [roleToEdit, setRoleToEdit] = useState<RoleMenuPermission | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const deleteRoleMutation = useDeleteRoleMenuPermission()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteRoleMenuPermissions({
    sort: 'created_at',
    order: 'desc',
    limit: 20,
  })

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const permissionRows = data?.pages.flatMap((page) => page.data) ?? []

  const roles: RoleWithVisual[] = permissionRows.map((row) => ({
    id: row.id,
    name: row.value_param,
    description: row.description ?? '',
    accessLevel: 'Penuh',
    permissions: row.menus.map((menu) => menu.value_param),
    userCount: 0,
    icon: row.icon,
    colorIcon: row.color_icon,
    colorBgIcon: row.color_bg_icon,
  }))

  const totalRole = roles.length
  const totalPengguna = roles.reduce((sum, role) => sum + role.userCount, 0)
  const totalAksesPenuh = roles.filter((role) => role.accessLevel === 'Penuh').length

  const handleSubmitRole = (values: RoleFormValues) => {
    console.log(values)
    setIsModalOpen(false)
    setRoleToEdit(null)
  }

  const handleOpenCreate = () => {
    setRoleToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (roleName: string) => {
    const row = permissionRows.find((permission) => permission.value_param === roleName)
    if (!row) return
    setRoleToEdit(row)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setRoleToEdit(null)
  }

  const handleConfirmDelete = () => {
    if (!roleToDelete) return
    deleteRoleMutation.mutate(roleToDelete.id, {
      onSuccess: () => setRoleToDelete(null),
    })
  }

  return (
    <DashboardLayout pageTitle="Role Pengguna">
      <div className="flex w-full flex-col gap-5 px-7 pt-6 pb-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold leading-[1.2] text-[#20242d]">Role Pengguna</h1>
            <p className="text-sm leading-[1.4] text-[#6a7789]">
              Atur peran dan hak akses setiap anggota tim Anda
            </p>
          </div>

          <Button
            type="button"
            variant="contained"
            onClick={handleOpenCreate}
            startIcon={<PlusIcon size={18} className="text-[#fdfeff]" />}
            sx={{
              height: '40px',
              bgcolor: '#4e5bd6',
              color: '#fdfeff',
              textTransform: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#3f4bc0', boxShadow: 'none' },
            }}
          >
            Tambah Role
          </Button>
        </div>

        <div className="flex w-full items-stretch gap-4">
          <StatCard
            icon={<ShieldIcon size={18} className="text-[#3e49ab]" />}
            iconBg="#edeffb"
            borderColor="#b8c6ff"
            value={totalRole}
            label="Total Role"
          />
          <StatCard
            icon={<UsersRoundIcon size={18} className="text-[#19875a]" />}
            iconBg="#e6f7f0"
            borderColor="#aeffde"
            value={totalPengguna}
            label="Total Pengguna"
          />
          <StatCard
            icon={<ShieldIcon size={18} className="text-[#cb7b00]" />}
            iconBg="#fff6e6"
            borderColor="#ffe7bd"
            value={totalAksesPenuh}
            label="Akses Penuh"
          />
        </div>

        <div className="grid w-full grid-cols-2 gap-4">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              icon={
                <DynamicLucideIcon
                  name={role.icon ?? 'shield'}
                  size={18}
                  style={{ color: role.colorIcon ?? '#4e5bd6' }}
                />
              }
              iconBg={role.colorBgIcon ?? '#edeffb'}
              borderColor={role.colorIcon ?? '#b8c6ff'}
              onEdit={() => handleOpenEdit(role.name)}
              onDelete={() => setRoleToDelete(role)}
            />
          ))}
        </div>

        <div ref={sentinelRef} className="h-px w-full" />
        {isFetchingNextPage && (
          <p className="w-full text-center text-xs text-[#8f99a7]">Memuat lebih banyak...</p>
        )}
      </div>

      <CreateRoleModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitRole}
        roleToEdit={roleToEdit}
      />

      <ConfirmDeleteModal
        open={roleToDelete !== null}
        itemName={roleToDelete?.name ?? ''}
        isLoading={deleteRoleMutation.isPending}
        onCancel={() => setRoleToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </DashboardLayout>
  )
}
