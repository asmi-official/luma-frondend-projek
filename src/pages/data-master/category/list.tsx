import Button from '@mui/material/Button'
import { useEffect, useRef, useState } from 'react'
import { useDeleteFlexParam, useInfiniteFlexParams } from '../../../api/flexParams'
import CategoryCard from '../../../components/data-master/category/CategoryCard'
import CreateCategoryModal from '../../../components/data-master/category/CreateCategoryModal'
import StatCard from '../../../components/data-master/role-management/StatCard'
import ConfirmDeleteModal from '../../../components/global/ConfirmDeleteModal'
import DashboardLayout from '../../../components/global/DashboardLayout'
import BoxIcon from '../../../icon/BoxIcon'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import PlusIcon from '../../../icon/PlusIcon'
import { useAuthStore } from '../../../store/authStore'
import type { Category, CategoryFormValues } from './types'

const CATEGORY_TYPE_PARAM = 'CATEGORY_OWNER'

export default function CategoryList() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
    const sentinelRef = useRef<HTMLDivElement>(null)

    const user = useAuthStore((state) => state.user)
    const ownerId = user ? (user.role === 'Owner' ? user.id : user.header_id) : undefined

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteFlexParams({
        filter: [
            { key: 'type_param', operator: 'equal', value: CATEGORY_TYPE_PARAM },
            ...(ownerId ? [{ key: 'owner_id' as const, operator: 'equal' as const, value: ownerId }] : []),
        ],
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

    const flexParamRows = data?.pages.flatMap((page) => page.data) ?? []

    const categories: Category[] = flexParamRows.map((row) => ({
        id: row.id,
        name: row.value_param,
        description: row.description ?? '',
        itemCount: 0,
        active: row.active,
        icon: row.icon ?? 'tags',
        colorIcon: row.color_icon ?? '#4e5bd6',
        colorBgIcon: row.color_bg_icon ?? '#edeffb',
    }))

    const totalCategory = categories.length
    const activeCategory = categories.filter((category) => category.active).length
    const totalItems = categories.reduce((sum, category) => sum + category.itemCount, 0)

    const handleOpenCreate = () => {
        setCategoryToEdit(null)
        setIsModalOpen(true)
    }

    const handleOpenEdit = (category: Category) => {
        setCategoryToEdit(category)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setCategoryToEdit(null)
    }

    const deleteFlexParamMutation = useDeleteFlexParam()

    const handleSubmitCategory = (_values: CategoryFormValues) => {
        handleCloseModal()
    }

    const handleConfirmDelete = () => {
        if (!categoryToDelete) return
        deleteFlexParamMutation.mutate(categoryToDelete.id, {
            onSuccess: () => setCategoryToDelete(null),
        })
    }

    return (
        <DashboardLayout pageTitle="Kategori">
            <div className="flex w-full flex-col gap-5 px-7 pt-6 pb-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold leading-[1.2] text-[#20242d]">Kategori</h1>
                        <p className="text-sm leading-[1.4] text-[#6a7789]">
                            Kelola kategori produk & layanan untuk katalog bisnis Anda.
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
                        Tambah Kategori
                    </Button>
                </div>

                <div className="flex w-full items-stretch gap-4">
                    <StatCard
                        icon={<DynamicLucideIcon name="tags" size={18} className="text-[#3e49ab]" />}
                        iconBg="#edeffb"
                        borderColor="#b8c6ff"
                        value={totalCategory}
                        label="Total Kategori"
                    />
                    <StatCard
                        icon={<DynamicLucideIcon name="check" size={18} className="text-[#19875a]" />}
                        iconBg="#e6f7f0"
                        borderColor="#aeffde"
                        value={activeCategory}
                        label="Kategori Aktif"
                    />
                    <StatCard
                        icon={<BoxIcon size={18} className="text-[#cb7b00]" />}
                        iconBg="#fff6e6"
                        borderColor="#ffe7bd"
                        value={totalItems}
                        label="Item Terkategori"
                    />
                </div>

                <div className="grid w-full grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onEdit={() => handleOpenEdit(category)}
                            onDelete={() => setCategoryToDelete(category)}
                        />
                    ))}
                </div>

                <div ref={sentinelRef} className="h-px w-full" />
                {isFetchingNextPage && (
                    <p className="w-full text-center text-xs text-[#8f99a7]">Memuat lebih banyak...</p>
                )}
            </div>

            <CreateCategoryModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitCategory}
                categoryToEdit={categoryToEdit}
            />

            <ConfirmDeleteModal
                open={categoryToDelete !== null}
                itemName={categoryToDelete?.name ?? ''}
                isLoading={deleteFlexParamMutation.isPending}
                onCancel={() => setCategoryToDelete(null)}
                onConfirm={handleConfirmDelete}
            />
        </DashboardLayout>
    )
}
