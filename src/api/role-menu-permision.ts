import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/axios'
import type { FilterCondition } from '../lib/queryFilter'

const ROLE_MENU_PERMISSIONS_QUERY_KEY = ['role-menu-permissions']

export type CreateRoleMenuPermissionPayload = {
  flex_param_menu_id: string[]
  role_name: string
  description?: string
  icon?: string
  color_icon?: string
  color_bg_icon?: string
  active?: boolean
}

export type RoleMenuItem = {
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
  created_by: string
  updated_by: string
  deleted_by: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type RoleMenuPermission = {
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
  created_by: string
  updated_by: string
  deleted_by: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  menus: RoleMenuItem[]
}

export type RoleMenuPermissionRelation = {
  id: string
  flex_param_menu_id: string
  flex_param_role_id: string
  owner_id: string | null
  user_id: string
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  deleted_at: string | null
  deleted_by: string | null
}

export type CreateRoleMenuPermissionResponse = {
  status: string
  message: string
  data: RoleMenuPermissionRelation[]
}

export async function createRoleMenuPermission(payload: CreateRoleMenuPermissionPayload) {
  const { data } = await api.post<CreateRoleMenuPermissionResponse>('/role-menu-permissions', payload)
  return data
}

export function useCreateRoleMenuPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRoleMenuPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_MENU_PERMISSIONS_QUERY_KEY })
    },
  })
}

export type RoleMenuPermissionColumn =
  | 'id'
  | 'type_param'
  | 'value_param'
  | 'description'
  | 'icon'
  | 'color_icon'
  | 'color_bg_icon'
  | 'active'
  | 'level'
  | 'user_id'
  | 'owner_id'
  | 'header_id'
  | 'created_at'
  | 'created_by'
  | 'updated_at'
  | 'updated_by'

export type RoleMenuPermissionListMeta = {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type RoleMenuPermissionListResponse = {
  status: string
  message: string
  data: RoleMenuPermission[]
  meta: RoleMenuPermissionListMeta
}

export type RoleMenuPermissionListQuery = {
  filter?: FilterCondition<RoleMenuPermissionColumn>[]
  sort?: RoleMenuPermissionColumn
  order?: 'asc' | 'desc'
  limit?: number
}

export async function getRoleMenuPermissions(
  query: RoleMenuPermissionListQuery & { page: number },
) {
  const { filter, sort, order, limit, page } = query
  const params: Record<string, string> = { page: String(page) }

  if (limit !== undefined) params.limit = String(limit)
  if (sort !== undefined) params.sort = sort
  if (order !== undefined) params.order = order
  if (filter?.length) params.filter = JSON.stringify(filter)

  const { data } = await api.get<RoleMenuPermissionListResponse>('/role-menu-permissions', {
    params,
  })
  return data
}

export function useInfiniteRoleMenuPermissions(query?: RoleMenuPermissionListQuery) {
  return useInfiniteQuery({
    queryKey: [...ROLE_MENU_PERMISSIONS_QUERY_KEY, query],
    queryFn: ({ pageParam }) => getRoleMenuPermissions({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.meta
      return page < total_pages ? page + 1 : undefined
    },
  })
}

export type DeleteRoleMenuPermissionResponse = {
  status: string
  message: string
}

export async function deleteRoleMenuPermission(flexParamRoleId: string) {
  const { data } = await api.delete<DeleteRoleMenuPermissionResponse>(
    `/role-menu-permissions/${flexParamRoleId}`,
  )
  return data
}

export function useDeleteRoleMenuPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRoleMenuPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_MENU_PERMISSIONS_QUERY_KEY })
    },
  })
}

export type UpdateRoleMenuPermissionPayload = {
  flex_param_role_id: string
  flex_param_menu_id: string[]
  role_name?: string
  description?: string
  icon?: string
  color_icon?: string
  color_bg_icon?: string
  active?: boolean
}

export type UpdateRoleMenuPermissionResponse = {
  status: string
  message: string
  data: RoleMenuPermission
}

export async function updateRoleMenuPermission({
  flex_param_role_id,
  ...body
}: UpdateRoleMenuPermissionPayload) {
  const { data } = await api.put<UpdateRoleMenuPermissionResponse>(
    `/role-menu-permissions/${flex_param_role_id}`,
    body,
  )
  return data
}

export function useUpdateRoleMenuPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateRoleMenuPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLE_MENU_PERMISSIONS_QUERY_KEY })
    },
  })
}

export type RoleMenuPermissionDetailResponse = {
  status: string
  message: string
  data: RoleMenuPermission
}

export async function getRoleMenuPermissionDetail(roleName: string) {
  const { data } = await api.get<RoleMenuPermissionDetailResponse>('/role-menu-permissions/detail', {
    params: { role_name: roleName },
  })
  return data
}

export function useRoleMenuPermissionDetail(roleName: string | undefined) {
  return useQuery({
    queryKey: [...ROLE_MENU_PERMISSIONS_QUERY_KEY, 'detail', roleName],
    queryFn: () => getRoleMenuPermissionDetail(roleName as string),
    enabled: !!roleName,
  })
}
