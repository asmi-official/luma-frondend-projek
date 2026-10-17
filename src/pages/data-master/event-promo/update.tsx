import Button from '@mui/material/Button'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { usePromoDetail, useUpdatePromo } from '../../../api/promo'
import PromoForm from '../../../components/data-master/event-promo/PromoForm'
import DashboardLayout from '../../../components/global/DashboardLayout'
import {
    PROMO_DISCOUNT_TYPE_DESCRIPTION,
    PROMO_DISCOUNT_TYPE_TITLE,
    type PromoFormValues,
} from './types'

const LIST_PATH = '/data-master/event-promo'

export default function UpdatePromo() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const [serverError, setServerError] = useState<string | null>(null)

    const { data: promoDetail, isLoading, isError } = usePromoDetail(id)
    const promo = promoDetail?.data
    const updatePromoMutation = useUpdatePromo()

    const { control, handleSubmit, setValue, reset } = useForm<PromoFormValues>({
        defaultValues: {
            name: '',
            description: '',
            products: [],
            discountType: 'percentage',
            discountValue: 0,
            specialPrices: {},
            startDate: '',
            endDate: '',
            useTime: false,
            startTime: '',
            endTime: '',
        },
    })

    useEffect(() => {
        if (!promo) return
        const isSpecialPrice = promo.discount_type === 'special_price'

        reset({
            name: promo.name,
            description: promo.description ?? '',
            products: promo.products.map((product) => ({
                id: product.id,
                name: product.name,
                category: product.category,
                price: Number(product.sell_price),
                photoUrl: product.photo_url,
            })),
            discountType: promo.discount_type,
            discountValue: isSpecialPrice ? 0 : Number(promo.discount_value),
            // For a special price promo each product's own price is kept in its promo_discount
            specialPrices: isSpecialPrice
                ? Object.fromEntries(promo.products.map((product) => [product.id, Number(product.promo_discount ?? 0)]))
                : {},
            startDate: promo.start_date,
            endDate: promo.end_date,
            useTime: Boolean(promo.start_time && promo.end_time),
            startTime: promo.start_time?.slice(0, 5) ?? '',
            endTime: promo.end_time?.slice(0, 5) ?? '',
        })
        // Only re-seed the form when another promo (or a newer version of it) is loaded, not on every refetch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promo?.id, promo?.updated_at, reset])

    if (isError) return <Navigate to={LIST_PATH} replace />

    if (isLoading || !promo) {
        return (
            <DashboardLayout pageTitle="Promo & Event">
                <p className="px-7 py-6 text-sm text-[#8f99a7]">Memuat promo...</p>
            </DashboardLayout>
        )
    }

    // The API does not allow editing a promo that has already finished
    const isFinished = promo.status === 'Selesai'

    const onSubmit = (values: PromoFormValues) => {
        if (!id) return
        setServerError(null)

        const isSpecialPrice = values.discountType === 'special_price'

        updatePromoMutation.mutate(
            {
                id,
                name: values.name.trim(),
                description: values.description.trim(),
                discount_type: values.discountType,
                // A special price promo has no shared value, so its title is sent instead
                discount_value: isSpecialPrice
                    ? PROMO_DISCOUNT_TYPE_TITLE.special_price
                    : String(values.discountValue),
                discount_text: PROMO_DISCOUNT_TYPE_TITLE[values.discountType],
                discount_description: PROMO_DISCOUNT_TYPE_DESCRIPTION[values.discountType],
                // The API rejects a start date before today, so an unchanged (already started) one is left out
                ...(values.startDate !== promo.start_date && { start_date: values.startDate }),
                end_date: values.endDate,
                start_time: values.useTime ? values.startTime : null,
                end_time: values.useTime ? values.endTime : null,
                // An update always sets the promo to Aktif; the API worker moves it to Terjadwal/Selesai later
                status: 'Aktif',
                products: values.products.map((product) => {
                    let promoDiscount = values.discountValue
                    if (isSpecialPrice) {
                        // Each product has its own price
                        promoDiscount = values.specialPrices[product.id] ?? 0
                    } else if (values.discountType === 'percentage') {
                        // The percentage of this product's own price, e.g. 20% of 10000 = 2000
                        promoDiscount = Math.round((product.price * values.discountValue) / 100)
                    }
                    // Fixed: every product gets the same entered amount

                    return { id: product.id, promo_discount: promoDiscount }
                }),
            },
            {
                onSuccess: () => navigate(LIST_PATH),
                onError: (error) => {
                    setServerError(
                        isAxiosError(error) && error.response?.data?.message
                            ? error.response.data.message
                            : 'Gagal menyimpan promo. Coba lagi.',
                    )
                },
            },
        )
    }

    return (
        <DashboardLayout pageTitle="Promo & Event">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-5 px-7 py-6"
            >
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold leading-[1.2] text-[#20242d]">Ubah Promo</h1>
                        <p className="text-sm leading-[1.4] text-[#6a7789]">
                            Perbarui detail promo dan produk yang mendapatkan promo.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => navigate(LIST_PATH)}
                            sx={{
                                height: '40px',
                                textTransform: 'none',
                                borderRadius: '8px',
                                borderColor: '#4e5bd6',
                                color: '#4e5bd6',
                                fontWeight: 600,
                                '&:hover': { borderColor: '#4e5bd6', backgroundColor: '#f7f8fc' },
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isFinished || updatePromoMutation.isPending}
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
                            {updatePromoMutation.isPending ? 'Menyimpan...' : 'Ubah'}
                        </Button>
                    </div>
                </div>

                {isFinished && (
                    <p className="w-full rounded-xl border border-[#fed07a] bg-[#fff6e6] px-4 py-3 text-sm text-[#7a4f00]">
                        Promo yang sudah selesai tidak dapat diubah.
                    </p>
                )}

                {serverError && (
                    <p className="w-full rounded-xl border border-[#f6c7cc] bg-[#fce9ea] px-4 py-3 text-sm text-[#d1293d]">
                        {serverError}
                    </p>
                )}

                <PromoForm control={control} setValue={setValue} originalStartDate={promo.start_date} />
            </form>
        </DashboardLayout>
    )
}
