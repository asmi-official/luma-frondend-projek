import Button from '@mui/material/Button'
import { useState } from 'react'
import CreatePaymentMethodModal from '../../../components/data-master/payment-methods/CreatePaymentMethodModal'
import PaymentMethodRow from '../../../components/data-master/payment-methods/PaymentMethodRow'
import StatCard from '../../../components/data-master/role-management/StatCard'
import DashboardLayout from '../../../components/global/DashboardLayout'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import PlusIcon from '../../../icon/PlusIcon'
import type { PaymentMethod, PaymentMethodFormValues } from './types'

const initialMethods: PaymentMethod[] = [
    {
        id: 'virtual-account',
        name: 'Virtual Account',
        description: 'Transfer via VA bank BCA, BNI, BRI, Mandiri',
        active: true,
        icon: 'landmark',
    },
    {
        id: 'qris',
        name: 'QRIS',
        description: 'Scan QR semua e-wallet & bank',
        active: true,
        icon: 'qr-code',
    },
    {
        id: 'tunai',
        name: 'Tunai',
        description: 'Pembayaran langsung secara tunai',
        active: true,
        icon: 'banknote',
    },
]

export default function PaymentMethodList() {
    const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const totalMethod = methods.length
    const activeMethod = methods.filter((method) => method.active).length
    const inactiveMethod = methods.filter((method) => !method.active).length

    const handleOpenCreate = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const handleSubmitMethod = (values: PaymentMethodFormValues) => {
        setMethods((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: values.name,
                description: values.description,
                icon: values.icon,
                active: true,
            },
        ])

        handleCloseModal()
    }

    const handleToggleActive = (methodId: string, active: boolean) => {
        setMethods((prev) =>
            prev.map((method) => (method.id === methodId ? { ...method, active } : method)),
        )
    }

    return (
        <DashboardLayout pageTitle="Metode Pembayaran">
            <div className="flex w-full flex-col gap-5 px-7 pt-6 pb-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold leading-[1.2] text-[#20242d]">Metode Pembayaran</h1>
                        <p className="text-sm leading-[1.4] text-[#6a7789]">
                            Aktifkan metode pembayaran dan atur biaya transaksinya
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
                        Tambah Metode
                    </Button>
                </div>

                <div className="flex w-full items-stretch gap-4">
                    <StatCard
                        icon={<DynamicLucideIcon name="credit-card" size={18} className="text-[#3e49ab]" />}
                        iconBg="#edeffb"
                        borderColor="#b8c6ff"
                        value={totalMethod}
                        label="Total Metode"
                    />
                    <StatCard
                        icon={<DynamicLucideIcon name="circle-check" size={18} className="text-[#19875a]" />}
                        iconBg="#e6f7f0"
                        borderColor="#aeffde"
                        value={activeMethod}
                        label="Metode Aktif"
                    />
                    <StatCard
                        icon={<DynamicLucideIcon name="circle-x" size={18} className="text-[#d1293d]" />}
                        iconBg="#fdecef"
                        borderColor="#ffecf0"
                        value={inactiveMethod}
                        label="Metode Nonaktif"
                    />
                </div>

                <div className="flex w-full flex-col items-start overflow-hidden rounded-2xl border border-[#ebedf1] bg-white">
                    <div className="w-full bg-[#fafafb] px-4 py-3">
                        <p className="text-sm font-medium text-[#797c81]">Metode Pembayaran</p>
                    </div>

                    {methods.map((method, index) => (
                        <PaymentMethodRow
                            key={method.id}
                            method={method}
                            isAlternate={index % 2 === 1}
                            onToggleActive={(active) => handleToggleActive(method.id, active)}
                        />
                    ))}
                </div>
            </div>

            <CreatePaymentMethodModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitMethod}
                methodToEdit={null}
            />
        </DashboardLayout>
    )
}
