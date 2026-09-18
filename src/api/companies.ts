import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'

export type Company = {
  id: string
  company_name: string
  company_cabang: boolean
  user_id: string
  header_id: string | null
  created_by: string
  updated_by: string
  deleted_by: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type CompanyDetailResponse = {
  status: string
  message: string
  data: Company
}

export async function getCompanyDetail(companyId: string) {
  const { data } = await api.get<CompanyDetailResponse>(`/companies/${companyId}`)
  return data
}

export function useCompanyDetail(companyId: string | undefined) {
  return useQuery({
    queryKey: ['companies', companyId],
    queryFn: () => getCompanyDetail(companyId as string),
    enabled: !!companyId,
  })
}
