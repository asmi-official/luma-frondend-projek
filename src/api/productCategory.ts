import { useFlexParams } from './flexParams'

const PRODUCT_CATEGORY_TYPE_PARAM = 'CATEGORY_OWNER'

export type ProductCategoryOption = {
  value: string
  label: string
}

/** Product categories as dropdown options: value is the category id, label is its name. */
export function useProductCategoryOptions(): ProductCategoryOption[] {
  const { data } = useFlexParams({
    filter: [{ key: 'type_param', operator: 'equal', value: PRODUCT_CATEGORY_TYPE_PARAM }],
    limit: 100,
  })

  return (data?.data ?? []).map((category) => ({
    value: category.id,
    label: category.value_param,
  }))
}
