import Button from '@mui/material/Button'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCreatePromo } from '../../../api/promo'
import PromoForm from '../../../components/data-master/event-promo/PromoForm'
import DashboardLayout from '../../../components/global/DashboardLayout'
import {
    PROMO_DISCOUNT_TYPE_DESCRIPTION,
    PROMO_DISCOUNT_TYPE_TITLE,
    type PromoFormValues,
} from './types'

const LIST_PATH = '/data-master/event-promo'

export default function CreatePromo() {
    const navigate = useNavigate()
    const createPromoMutation = useCreatePromo()
    const [serverError, setServerError] = useState<string | null>(null)

    const { control, handleSubmit, setValue } = useForm<PromoFormValues>({
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

    const onSubmit = (values: PromoFormValues) => {
        setServerError(null)

        const isSpecialPrice = values.discountType === 'special_price'

        createPromoMutation.mutate(
            {
                name: values.name.trim(),
                description: values.description.trim(),
                discount_type: values.discountType,
                // A special price promo has no shared value, so its title is sent instead
                discount_value: isSpecialPrice
                    ? PROMO_DISCOUNT_TYPE_TITLE.special_price
                    : String(values.discountValue),
                discount_text: PROMO_DISCOUNT_TYPE_TITLE[values.discountType],
                discount_description: PROMO_DISCOUNT_TYPE_DESCRIPTION[values.discountType],
                start_date: values.startDate,
                end_date: values.endDate,
                ...(values.useTime && { start_time: values.startTime, end_time: values.endTime }),
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
                        <h1 className="text-2xl font-semibold leading-[1.2] text-[#20242d]">Buat Promo</h1>
                        <p className="text-sm leading-[1.4] text-[#6a7789]">
                            Buat promo dan tentukan produk yang mendapatkan promo.
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
                            disabled={createPromoMutation.isPending}
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
                            {createPromoMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </div>
                </div>

                {serverError && (
                    <p className="w-full rounded-xl border border-[#f6c7cc] bg-[#fce9ea] px-4 py-3 text-sm text-[#d1293d]">
                        {serverError}
                    </p>
                )}

                <PromoForm control={control} setValue={setValue} />
            </form>
        </DashboardLayout>
    )
}
