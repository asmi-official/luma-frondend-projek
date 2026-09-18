import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../../components/global/DashboardLayout'
import ProductForm from '../../components/product/ProductForm'
import type { ProductFormValues } from './types'

export default function UpdateProduct() {
    const { control, handleSubmit } = useForm<ProductFormValues>({
        defaultValues: {
            name: '',
            category: '',
            sku: '',
            unit: '',
            cost_price: 0,
            sell_price: 0,
            stock: 0,
            description: '',
            active: true,
            image: null,
        },
    })

    const onSubmit = (values: ProductFormValues) => {
        console.log(values)
    }

    return (
        <DashboardLayout pageTitle="Produk">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-5 px-7 pt-6 pb-4"
            >
                <div className="flex w-full items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold leading-[1.2] text-[#20242d]">Edit Produk</h1>
                        <p className="text-sm leading-[1.4] text-[#6a7789]">
                            Perbarui detail produk di katalog bisnis Anda.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outlined"
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
                            Ubah
                        </Button>
                    </div>
                </div>

                <ProductForm control={control} />
            </form>
        </DashboardLayout>
    )
}
