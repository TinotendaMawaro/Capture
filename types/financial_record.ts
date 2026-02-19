/**
 * Heartfelt International Ministries - Financial Record Type
 * 
 * Financial records track offerings, donations, expenses, and budget allocations
 * IMPORTANT: This data requires separate RLS policies and restricted access
 */

export type FinancialCategory = 
  | 'offering'
  | 'donation'
  | 'tithe'
  | 'expense'
  | 'budget'
  | 'contribution'
  | 'other'

export type FinancialStatus = 'pending' | 'approved' | 'rejected'

export interface FinancialRecord {
  id: string
  him_id: string // Structured ID: RZW01001FIN001
  zone_id: string
  region_id: string
  country_id?: string
  category: FinancialCategory
  amount: number
  currency: string  // Default: USD
  description?: string
  recorded_by: string  // Admin/user ID
  approved_by?: string  // Second approver for edits
  month: number  // 1-12
  year: number
  status: FinancialStatus
  created_at: string
  updated_at: string
}

export interface FinancialRecordInput {
  zone_id: string
  region_id: string
  country_id?: string
  category: FinancialCategory
  amount: number
  currency?: string
  description?: string
  recorded_by: string
  month: number
  year: number
}

/**
 * Financial summary for dashboard aggregation
 */
export interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  offeringTotal: number
  donationTotal: number
  titheTotal: number
  expenseTotal: number
  byRegion: Record<string, number>
  byZone: Record<string, number>
  monthlyTrend: Array<{
    month: number
    year: number
    income: number
    expenses: number
  }>
}

/**
 * Budget tracking per zone/region
 */
export interface Budget {
  id: string
  zone_id?: string
  region_id?: string
  country_id?: string
  category: FinancialCategory
  allocated_amount: number
  spent_amount: number
  remaining_amount: number
  month: number
  year: number
  created_at: string
  updated_at: string
}
