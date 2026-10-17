import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import { buildListQueryParams, type ListQueryParams } from '../lib/queryFilter'

export const PRODUCTS_QUERY_KEY = ['products']

export type Product = {
  id: string
  sku: string
  name: string
  category: string
  category_id: string
  unit: string
  cost_price: string
  sell_price: string
  stock: number
  description: string | null
  /** The promo this product currently belongs to, null when it has none */
  promo_id: string | null
  /** Rupiah off this product's price (or its own price for a special price promo), decimal as text */
  promo_discount: string | null
  active: boolean
  photo_id: string | null
  photo_url: string | null
  user_id: string
  owner_id: string | null
  company_id: string | null
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  deleted_at: string | null
  deleted_by: string | null
}

export type ProductColumn =
  | 'id'
  | 'sku'
  | 'name'
  | 'category'
  | 'category_id'
  | 'unit'
  | 'cost_price'
  | 'sell_price'
  | 'stock'
  | 'description'
  | 'active'
  | 'created_at'
  | 'created_by'
  | 'updated_at'
  | 'updated_by'

export type ProductListMeta = {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type ProductListResponse = {
  status: string
  message: string
  total_active: number
  total_inactive: number
  data: Product[]
  meta: ProductListMeta
}

export type ProductListQuery = ListQueryParams<ProductColumn> & {
  search?: string
}

export async function getProducts(query?: ProductListQuery) {
  const { search, ...rest } = query ?? {}
  const params = query ? buildListQueryParams(rest) : undefined

  if (search) {
    params!.search = search
  }

  const { data } = await api.get<ProductListResponse>('/products', { params })
  return data
}

export function useProducts(query?: ProductListQuery) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, query],
    queryFn: () => getProducts(query),
  })
}

export function useInfiniteProducts(query?: Omit<ProductListQuery, 'page'>) {
  return useInfiniteQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, 'infinite', query],
    queryFn: ({ pageParam }) => getProducts({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.meta
      return page < total_pages ? page + 1 : undefined
    },
  })
}

export type CreateProductPayload = {
  name: string
  category: string
  category_id: string
  unit: string
  cost_price: number
  sell_price: number
  stock: number
  description?: string
  active?: boolean
  photo?: File | null
}

export type CreateProductResponse = {
  status: string
  message: string
  data: Product
}

export async function createProduct(payload: CreateProductPayload) {
  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('category', payload.category)
  formData.append('category_id', payload.category_id)
  formData.append('unit', payload.unit)
  formData.append('cost_price', String(payload.cost_price))
  formData.append('sell_price', String(payload.sell_price))
  formData.append('stock', String(payload.stock))

  if (payload.description !== undefined) formData.append('description', payload.description)
  if (payload.active !== undefined) formData.append('active', String(payload.active))
  if (payload.photo) formData.append('photo', payload.photo)

  const { data } = await api.post<CreateProductResponse>('/products', formData)
  return data
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
    },
  })
}

export type UpdateProductPayload = {
  id: string
  name: string
  category: string
  category_id: string
  unit: string
  cost_price: number
  sell_price: number
  stock: number
  description?: string
  active?: boolean
  photo?: File | null
}

export type UpdateProductResponse = {
  status: string
  message: string
  data: Product
}

export async function updateProduct({ id, ...payload }: UpdateProductPayload) {
  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('category', payload.category)
  formData.append('category_id', payload.category_id)
  formData.append('unit', payload.unit)
  formData.append('cost_price', String(payload.cost_price))
  formData.append('sell_price', String(payload.sell_price))
  formData.append('stock', String(payload.stock))

  if (payload.description !== undefined) formData.append('description', payload.description)
  if (payload.active !== undefined) formData.append('active', String(payload.active))
  if (payload.photo) formData.append('photo', payload.photo)

  const { data } = await api.put<UpdateProductResponse>(`/products/${id}`, formData)
  return data
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
    },
  })
}

export type ProductDetailResponse = {
  status: string
  message: string
  data: Product
}

export async function getProductDetail(id: string) {
  const { data } = await api.get<ProductDetailResponse>(`/products/${id}`)
  return data
}

export function useProductDetail(id: string | undefined) {
  return useQuery({
    queryKey: [...PRODUCTS_QUERY_KEY, id],
    queryFn: () => getProductDetail(id as string),
    enabled: !!id,
  })
}

export type DeleteProductResponse = {
  status: string
  message: string
}

export async function deleteProduct(id: string) {
  const { data } = await api.delete<DeleteProductResponse>(`/products/${id}`)
  return data
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
    },
  })
}
