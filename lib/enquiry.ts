export const TEAM_SIZES = ['1–10', '11–50', '51–200', '201–1,000', '1,000+'] as const

export const INTERESTS = [
  'Private VPC & on-prem',
  'Self-healing remediation',
  'SOC 2 & HIPAA audit trails',
  'Custom connectors',
] as const

export type EnquiryField = 'name' | 'email' | 'company' | 'teamSize' | 'message'

export type EnquiryState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<EnquiryField, string>>
  values?: Record<string, string>
}
