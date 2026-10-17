import Button from '@mui/material/Button'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import {
    useConnectPaymentGateway,
    usePaymentGateway,
    useUpdatePaymentGateway,
} from '../../../api/paymentGateway'
import { useCreatePaymentMethod, usePaymentMethods, useUpdatePaymentMethod } from '../../../api/paymentMethod'
import CreatePaymentMethodModal from '../../../components/data-master/payment-methods/CreatePaymentMethodModal'
import ConnectMidtransDrawer, {
    type MidtransFormValues,
} from '../../../components/data-master/payment-methods/ConnectMidtransDrawer'
import PaymentMethodRow from '../../../components/data-master/payment-methods/PaymentMethodRow'
import StatCard from '../../../components/data-master/role-management/StatCard'
import DashboardLayout from '../../../components/global/DashboardLayout'
import DynamicLucideIcon from '../../../icon/DynamicLucideIcon'
import PlusIcon from '../../../icon/PlusIcon'
import { useAuthStore } from '../../../store/authStore'
import type { PaymentMethodFormValues } from './types'

export default function PaymentMethodList() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isMidtransDrawerOpen, setIsMidtransDrawerOpen] = useState(false)
    const [midtransServerError, setMidtransServerError] = useState<string | null>(null)

    const { data: paymentMethodsData, isLoading: isPaymentMethodsLoading } = usePaymentMethods({
        sort: 'created_at',
        order: 'desc',
        page: 1,
        limit: 100,
    })

    const methods = paymentMethodsData?.data ?? []
    const totalMethod = methods.length
    const activeMethod = methods.filter((method) => method.active).length
    const inactiveMethod = methods.filter((method) => !method.active).length

    const handleOpenCreate = () => {
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    const createPaymentMethodMutation = useCreatePaymentMethod()

    const handleSubmitMethod = (values: PaymentMethodFormValues) => {
        createPaymentMethodMutation.mutate(
            {
                key_payment_param_id: values.flexParamId,
                active: values.name.trim().toLowerCase() === 'tunai',
            },
            {
                onSuccess: () => handleCloseModal(),
            },
        )
    }

    const updatePaymentMethodMutation = useUpdatePaymentMethod()

    const handleToggleActive = (methodId: string, active: boolean) => {
        updatePaymentMethodMutation.mutate({ id: methodId, active })
    }

    const user = useAuthStore((state) => state.user)
    const isOwner = user?.role === 'Owner'

    const { data: paymentGatewayData } = usePaymentGateway(isOwner)
    const isMidtransConnected = !!paymentGatewayData?.data

    const connectPaymentGatewayMutation = useConnectPaymentGateway()
    const updatePaymentGatewayMutation = useUpdatePaymentGateway()
    const isMidtransSubmitting =
        connectPaymentGatewayMutation.isPending || updatePaymentGatewayMutation.isPending

    const handleCloseMidtransDrawer = () => {
        setIsMidtransDrawerOpen(false)
        setMidtransServerError(null)
    }

    const handleSubmitMidtrans = (values: MidtransFormValues) => {
        if (!isOwner) return
        setMidtransServerError(null)

        const payload = {
            merchant_id: values.merchantId,
            client_key: values.clientKey,
            server_key: values.serverKey,
        }

        const mutation = isMidtransConnected
            ? updatePaymentGatewayMutation
            : connectPaymentGatewayMutation

        mutation.mutate(payload, {
            onSuccess: () => {
                handleCloseMidtransDrawer()
            },
            onError: (error) => {
                if (isAxiosError(error) && error.response?.data?.message) {
                    setMidtransServerError(error.response.data.message)
                    return
                }
                setMidtransServerError('Gagal menyimpan koneksi Midtrans. Coba lagi.')
            },
        })
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

                {isOwner && (isMidtransConnected ? (
                    <div className="flex w-full items-center justify-between rounded-2xl border border-[#aeffde] bg-[#e6f7f0] p-4">
                        <div className="flex items-center gap-3">
                            <DynamicLucideIcon name="circle-check" size={18} className="shrink-0 text-[#19875a]" />
                            <p className="text-[13px] leading-[1.4] text-[#0c5132]">
                                <span className="font-semibold">Midtrans terhubung.</span> Merchant ID:{' '}
                                {paymentGatewayData?.data?.merchant_id}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => setIsMidtransDrawerOpen(true)}
                            sx={{
                                height: '36px',
                                borderColor: '#aeffde',
                                color: '#19875a',
                                textTransform: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                '&:hover': { borderColor: '#aeffde', backgroundColor: '#f0faf5' },
                            }}
                        >
                            Perbarui
                        </Button>
                    </div>
                ) : (
                    <div className="flex w-full items-center justify-between rounded-2xl border border-[#fed07a] bg-[#fff6e6] p-4">
                        <div className="flex items-center gap-3">
                            <DynamicLucideIcon name="triangle-alert" size={18} className="shrink-0 text-[#fe9a00]" />
                            <p className="text-[13px] leading-[1.4] text-[#7a4f00]">
                                <span className="font-semibold">Midtrans belum terhubung.</span> Aktifkan
                                terlebih dahulu agar toggle metode pembayaran dapat digunakan
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => setIsMidtransDrawerOpen(true)}
                            sx={{
                                height: '36px',
                                borderColor: '#fed07a',
                                color: '#fe9a00',
                                textTransform: 'none',
                                borderRadius: '8px',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                '&:hover': { borderColor: '#fed07a', backgroundColor: '#fffaf0' },
                            }}
                        >
                            Hubungkan Sekarang
                        </Button>
                    </div>
                ))}

                <div className="flex w-full flex-col items-start overflow-hidden rounded-2xl border border-[#ebedf1] bg-white">
                    <div className="w-full bg-[#fafafb] px-4 py-3">
                        <p className="text-sm font-medium text-[#797c81]">Metode Pembayaran</p>
                    </div>

                    {!isPaymentMethodsLoading && methods.length === 0 && (
                        <p className="w-full py-10 text-center text-sm text-[#8f99a7]">
                            Belum ada metode pembayaran
                        </p>
                    )}

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
                isSubmitting={createPaymentMethodMutation.isPending}
            />

            <ConnectMidtransDrawer
                open={isMidtransDrawerOpen}
                onClose={handleCloseMidtransDrawer}
                onSubmit={handleSubmitMidtrans}
                isSubmitting={isMidtransSubmitting}
                serverError={midtransServerError}
                existingData={
                    paymentGatewayData?.data
                        ? {
                              merchantId: paymentGatewayData.data.merchant_id,
                              clientKey: paymentGatewayData.data.client_key,
                          }
                        : null
                }
            />
        </DashboardLayout>
    )
}
