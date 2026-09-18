export type Category = {
  id: string
  name: string
  description: string
  itemCount: number
  active: boolean
  icon: string
  colorIcon: string
  colorBgIcon: string
}

export type CategoryFormValues = {
  name: string
  description: string
  icon: string
  color: string
  active: boolean
}
