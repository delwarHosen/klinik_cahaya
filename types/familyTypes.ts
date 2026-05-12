export interface FamilyMember {
  member_name: string
  ic_number: string
  date_of_birth: string
  relationship: string
  gender: string
  allergies: { name: string; type: string | null; severity: string | null }[]
}

export const EMPTY_MEMBER: FamilyMember = {
  member_name: '',
  ic_number: '',
  date_of_birth: '',
  relationship: '',
  gender: '',
  allergies: [],
}

export const MAX_MEMBERS = 9
export const GENDER_OPTIONS = ['male', 'female', 'other']