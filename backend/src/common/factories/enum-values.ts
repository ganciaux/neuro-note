export const USER_ROLES = {
  ADMIN: 'user_role_admin',
  STAFF: 'user_role_staff',
} as const;

export const PATIENT_TITLES = {
  MR: 'patient_title_mr',
  MRS: 'patient_title_mrs',
  MS: 'patient_title_ms',
} as const;

export const ADDRESS_ENTITY = {
  USER: 'address_entity_user',
  PATIENT: 'address_entity_patient',
} as const;

export const ADDRESS_TYPE = {
  HOME: 'address_type_home',
  WORK: 'address_type_work',
} as const;

export const ADDRESS_COUNTRY = {
  LU: 'address_country_lu',
  FR: 'address_country_fr',
  BE: 'address_country_be',
} as const;

export const SERVICE_CATEGORY = {
  CONSULT: 'service_category_consult',
  BILAN: 'service_category_bilan',
} as const;

export const REFERENCE_COUNTER = {
  BILL: 'reference_counter_bill',
  PAYMENT: 'reference_counter_payment',
} as const;
