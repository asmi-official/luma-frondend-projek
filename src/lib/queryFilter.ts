export type FilterOperator =
  | 'equal'
  | 'notEqual'
  | 'like'
  | 'in'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'

export type SortOrder = 'asc' | 'desc'

export type FilterCondition<TKey extends string = string> =
  | {
      key: TKey
      operator: Exclude<FilterOperator, 'in'>
      value: string | number | boolean
    }
  | {
      key: TKey
      operator: 'in'
      value: Array<string | number>
    }

export type ListQueryParams<TKey extends string = string> = {
  filter?: FilterCondition<TKey>[]
  sort?: TKey
  order?: SortOrder
  page?: number
  limit?: number
}

export function buildListQueryParams<TKey extends string = string>({
  filter,
  sort,
  order,
  page,
  limit,
}: ListQueryParams<TKey>): Record<string, string> {
  const params: Record<string, string> = {}

  if (filter?.length) {
    params.filter = JSON.stringify(filter)
  }

  if (sort !== undefined) {
    params.sort = sort
  }

  if (order !== undefined) {
    params.order = order
  }

  if (page !== undefined) {
    params.page = String(page)
  }

  if (limit !== undefined) {
    params.limit = String(limit)
  }

  return params
}
