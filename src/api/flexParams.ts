import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import { buildListQueryParams, type ListQueryParams } from '../lib/queryFilter'

const FLEX_PARAMS_QUERY_KEY = ['flex-params']

export type FlexParamColumn =
  | 'id'
  | 'type_param'
  | 'value_param'
  | 'description'
  | 'user_id'
  | 'owner_id'
  | 'photo_id'
  | 'photo_url'
  | 'header_id'
  | 'level'
  | 'icon'
  | 'color_icon'
  | 'color_bg_icon'
  | 'active'
  | 'created_at'
  | 'created_by'
  | 'updated_at'
  | 'updated_by'

export type FlexParam = {
  id: string
  type_param: string
  value_param: string
  description: string | null
  user_id: string
  owner_id: string | null
  photo_id: string | null
  photo_url: string | null
  header_id: string | null
  level: number | null
  icon: string | null
  color_icon: string | null
  color_bg_icon: string | null
  active: boolean
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  deleted_at: string | null
  deleted_by: string | null
}

export type FlexParamListMeta = {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type FlexParamListResponse = {
  status: string
  message: string
  data: FlexParam[]
  meta: FlexParamListMeta
}

export async function getFlexParams(query?: ListQueryParams<FlexParamColumn>) {
  const params = query ? buildListQueryParams(query) : undefined
  const { data } = await api.get<FlexParamListResponse>('/flex-params', { params })
  return data
}

export function useFlexParams(query?: ListQueryParams<FlexParamColumn>) {
  return useQuery({
    queryKey: [...FLEX_PARAMS_QUERY_KEY, query],
    queryFn: () => getFlexParams(query),
  })
}

export function useInfiniteFlexParams(query?: Omit<ListQueryParams<FlexParamColumn>, 'page'>) {
  return useInfiniteQuery({
    queryKey: [...FLEX_PARAMS_QUERY_KEY, 'infinite', query],
    queryFn: ({ pageParam }) => getFlexParams({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.meta
      return page < total_pages ? page + 1 : undefined
    },
  })
}

export type BulkFlexParamItem = {
  type_param: string
  value_param: string
  description?: string
  header_id?: string | null
  icon?: string
  color_icon?: string
  color_bg_icon?: string
  active?: boolean
}

export type BulkCreateFlexParamsPayload = {
  items: BulkFlexParamItem[]
  photos?: File[]
}

export type BulkCreateFlexParamsResponse = {
  status: string
  message: string
  data: FlexParam[]
}

export async function bulkCreateFlexParams({ items, photos }: BulkCreateFlexParamsPayload) {
  const formData = new FormData()
  formData.append('items', JSON.stringify(items))

  for (const photo of photos ?? []) {
    formData.append('photos', photo)
  }

  const { data } = await api.post<BulkCreateFlexParamsResponse>('/flex-params/bulk', formData)
  return data
}

export function useBulkCreateFlexParams() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: bulkCreateFlexParams,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLEX_PARAMS_QUERY_KEY })
    },
  })
}

export type CreateFlexParamPayload = {
  type_param: string
  value_param: string
  description?: string
  header_id?: string
  icon?: string
  color_icon?: string
  color_bg_icon?: string
  active?: boolean
  photo?: File
}

export type CreateFlexParamResponse = {
  status: string
  message: string
  data: FlexParam
}

export async function createFlexParam(payload: CreateFlexParamPayload) {
  const formData = new FormData()
  formData.append('type_param', payload.type_param)
  formData.append('value_param', payload.value_param)

  if (payload.description !== undefined) formData.append('description', payload.description)
  if (payload.header_id !== undefined) formData.append('header_id', payload.header_id)
  if (payload.icon !== undefined) formData.append('icon', payload.icon)
  if (payload.color_icon !== undefined) formData.append('color_icon', payload.color_icon)
  if (payload.color_bg_icon !== undefined) formData.append('color_bg_icon', payload.color_bg_icon)
  if (payload.active !== undefined) formData.append('active', String(payload.active))
  if (payload.photo !== undefined) formData.append('photo', payload.photo)

  const { data } = await api.post<CreateFlexParamResponse>('/flex-params', formData)
  return data
}

export function useCreateFlexParam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFlexParam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLEX_PARAMS_QUERY_KEY })
    },
  })
}

export type DeleteFlexParamResponse = {
  status: string
  message: string
}

export async function deleteFlexParam(id: string) {
  const { data } = await api.delete<DeleteFlexParamResponse>(`/flex-params/${id}`)
  return data
}

export function useDeleteFlexParam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFlexParam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLEX_PARAMS_QUERY_KEY })
    },
  })
}

export type UpdateFlexParamPayload = {
  id: string
  value_param?: string
  description?: string
  icon?: string
  color_icon?: string
  color_bg_icon?: string
  active?: boolean
  photo?: File
}

export type UpdateFlexParamResponse = {
  status: string
  message: string
  data: FlexParam
}

export async function updateFlexParam({ id, ...payload }: UpdateFlexParamPayload) {
  const formData = new FormData()

  if (payload.value_param !== undefined) formData.append('value_param', payload.value_param)
  if (payload.description !== undefined) formData.append('description', payload.description)
  if (payload.icon !== undefined) formData.append('icon', payload.icon)
  if (payload.color_icon !== undefined) formData.append('color_icon', payload.color_icon)
  if (payload.color_bg_icon !== undefined) formData.append('color_bg_icon', payload.color_bg_icon)
  if (payload.active !== undefined) formData.append('active', String(payload.active))
  if (payload.photo !== undefined) formData.append('photo', payload.photo)

  const { data } = await api.put<UpdateFlexParamResponse>(`/flex-params/${id}`, formData)
  return data
}

export function useUpdateFlexParam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateFlexParam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLEX_PARAMS_QUERY_KEY })
    },
  })
}
