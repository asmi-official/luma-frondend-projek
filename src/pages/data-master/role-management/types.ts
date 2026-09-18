export type AccessLevel = 'Penuh' | 'Tinggi' | 'Menengah' | 'Dasar'

export type Role = {
  id: string
  name: string
  description: string
  accessLevel: AccessLevel
  permissions: string[]
  userCount: number
}

export type RoleFormValues = {
  name: string
  description: string
  icon: string
  color: string
  menuAccess: string[]
}
