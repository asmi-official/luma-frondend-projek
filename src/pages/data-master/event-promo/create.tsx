import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import PromoForm from '../../../components/data-master/event-promo/PromoForm'
import DashboardLayout from '../../../components/global/DashboardLayout'
import { usePromoStore } from '../../../store/promoStore'
import type { PromoFormValues } from './types'
import { formValuesToPromo } from './utils'

const LIST_PATH = '/data-master/event-promo'

export default function CreatePromo() {
    const navigate = useNavigate()
    const addPromo = usePromoStore((state) => state.addPromo)

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
        addPromo(formValuesToPromo(values))
        navigate(LIST_PATH)
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
                            Simpan
                        </Button>
                    </div>
                </div>

                <PromoForm control={control} setValue={setValue} />
            </form>
        </DashboardLayout>
    )
}
