import Button from '@mui/material/Button'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useProductDetail, useUpdateProduct } from '../../api/product'
import DashboardLayout from '../../components/global/DashboardLayout'
import ProductForm from '../../components/product/ProductForm'
import type { ProductFormValues } from './types'

export default function UpdateProduct() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const { control, handleSubmit, setValue, reset } = useForm<ProductFormValues>({
        defaultValues: {
            name: '',
            category: '',
            category_id: '',
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

    const { data: productDetail } = useProductDetail(id)

    useEffect(() => {
        if (!productDetail) return
        const product = productDetail.data
        reset({
            name: product.name,
            category: product.category,
            category_id: product.category_id,
            sku: product.sku,
            unit: product.unit,
            cost_price: Number(product.cost_price),
            sell_price: Number(product.sell_price),
            stock: product.stock,
            description: product.description ?? '',
            active: product.active,
            image: null,
        })
    }, [productDetail, reset])

    const updateProductMutation = useUpdateProduct()

    const onSubmit = (values: ProductFormValues) => {
        if (!id) return

        updateProductMutation.mutate(
            {
                id,
                name: values.name,
                category: values.category,
                category_id: values.category_id,
                unit: values.unit,
                cost_price: values.cost_price,
                sell_price: values.sell_price,
                stock: values.stock,
                description: values.description,
                active: values.active,
                photo: values.image,
            },
            {
                onSuccess: () => navigate('/product'),
            },
        )
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
                            onClick={() => navigate('/product')}
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
                            disabled={updateProductMutation.isPending}
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
                            {updateProductMutation.isPending ? 'Menyimpan...' : 'Ubah'}
                        </Button>
                    </div>
                </div>

                <ProductForm
                    control={control}
                    setValue={setValue}
                    existingPhotoUrl={productDetail?.data.photo_url}
                />
            </form>
        </DashboardLayout>
    )
}
