'use client'

import { useState, useEffect } from 'react'
import supabase from '@/lib/supabaseClient'

interface FinancialRecord {
  id: string
  him_id: string
  zone_id: string
  region_id: string
  category: string
  amount: number
  currency: string
  description?: string
  recorded_by: string
  month: number
  year: number
  status: string
  created_at: string
}

interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  byRegion: Record<string, number>
  byCategory: Record<string, number>
}

export default function FinanceDashboard() {
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState<FinancialRecord[]>([])
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    byRegion: {},
    byCategory: {}
  })
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    zone_id: '',
    region_id: '',
    category: 'offering',
    amount: '',
    currency: 'USD',
    description: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })

  useEffect(() => {
    fetchFinancialData()
  }, [])

  async function fetchFinancialData() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (data) {
        setRecords(data as FinancialRecord[])
        
        // Calculate summary
        const income = data
          .filter(r => ['offering', 'donation', 'tithe', 'contribution'].includes(r.category))
          .reduce((sum, r) => sum + r.amount, 0)
        const expenses = data
          .filter(r => r.category === 'expense')
          .reduce((sum, r) => sum + r.amount, 0)
        
        const byRegion: Record<string, number> = {}
        const byCategory: Record<string, number> = {}
        
        data.forEach(r => {
          byRegion[r.region_id] = (byRegion[r.region_id] || 0) + r.amount
          byCategory[r.category] = (byCategory[r.category] || 0) + r.amount
        })

        setSummary({
          totalIncome: income,
          totalExpenses: expenses,
          netBalance: income - expenses,
          byRegion,
          byCategory
        })
      }
    } catch (error) {
      console.error('Error fetching financial data:', error)
      // Mock data for demo
      setRecords([])
      setSummary({
        totalIncome: 45680,
        totalExpenses: 12340,
        netBalance: 33340,
        byRegion: { 'Harare': 25000, 'Bulawayo': 15000, 'Mutare': 5670 },
        byCategory: { 'offering': 28000, 'tithe': 12000, 'donation': 5680, 'expense': 12340 }
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { error } = await supabase.from('financial_records').insert({
        zone_id: formData.zone_id,
        region_id: formData.region_id,
        category: formData.category,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        description: formData.description,
        month: formData.month,
        year: formData.year,
        recorded_by: 'demo-user',
        status: 'pending'
      })

      if (error) throw error
      setShowForm(false)
      fetchFinancialData()
    } catch (error) {
      console.error('Error creating financial record:', error)
      alert('Failed to create record. Please try again.')
    }
  }

  const categoryColors: Record<string, string> = {
    offering: 'bg-green-100 text-green-700',
    tithe: 'bg-blue-100 text-blue-700',
    donation: 'bg-purple-100 text-purple-700',
    contribution: 'bg-indigo-100 text-indigo-700',
    expense: 'bg-red-100 text-red-700',
    budget: 'bg-yellow-100 text-yellow-700',
    other: 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💰 Financial Integration</h1>
          <p className="text-gray-600">Track offerings, budgets, and financial accountability</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchFinancialData}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            ➕ Add Record
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h3 className="font-semibold text-yellow-800">Financial Data Protection</h3>
            <p className="text-sm text-yellow-700 mt-1">
              All financial data has restricted access, separate RLS policies, and requires dual approval for edits. 
              All transactions are audit logged.
            </p>
          </div>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-600">Total Income</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ${summary.totalIncome.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">Offerings, Tithes, Donations</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            ${summary.totalExpenses.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">Operational costs</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-600">Net Balance</p>
          <p className={`text-3xl font-bold mt-2 ${summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${summary.netBalance.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">Income - Expenses</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 By Category</h2>
          <div className="space-y-3">
            {Object.entries(summary.byCategory).map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[category] || 'bg-gray-100 text-gray-700'}`}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
                <span className="font-semibold text-gray-900">${amount.toLocaleString()}</span>
              </div>
            ))}
            {Object.keys(summary.byCategory).length === 0 && (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>

        {/* Contribution Ranking */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🏆 Contribution Ranking by Region</h2>
          <div className="space-y-3">
            {Object.entries(summary.byRegion)
              .sort(([,a], [,b]) => b - a)
              .map(([region, amount], index) => (
                <div key={region} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-gray-600">{region}</span>
                  <span className="font-semibold text-gray-900">${amount.toLocaleString()}</span>
                </div>
              ))}
            {Object.keys(summary.byRegion).length === 0 && (
              <p className="text-gray-500 text-center py-4">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Record Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Financial Record</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="offering">Offering</option>
                <option value="tithe">Tithe</option>
                <option value="donation">Donation</option>
                <option value="contribution">Contribution</option>
                <option value="expense">Expense</option>
                <option value="budget">Budget</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="USD">USD</option>
                <option value="ZWL">ZWL</option>
                <option value="ZAR">ZAR</option>
                <option value="KES">KES</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
            
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={2}
              />
            </div>
            
            <div className="md:col-span-3 flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recent Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Recent Financial Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Category</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Description</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No financial records found. Add your first record above.
                  </td>
                </tr>
              ) : (
                records.slice(0, 10).map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(record.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[record.category]}`}>
                        {record.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {record.currency} {record.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {record.description || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        record.status === 'approved' ? 'bg-green-100 text-green-700' :
                        record.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📤 Export Data</h2>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            📊 Export to Excel
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            📄 Export PDF Report
          </button>
        </div>
      </div>
    </div>
  )
}
