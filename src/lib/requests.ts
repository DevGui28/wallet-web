import axiosInstance from '@/api/axiosInstance'

export const handleGetExpenses = async () => {
  const { data } = await axiosInstance.get('/expense')
  return data
}

export const handleGetSalaries = async () => {
  const { data } = await axiosInstance.get('/salary')
  return data
}

export const handleGetInstallments = async () => {
  const { data } = await axiosInstance.get('/installments')
  return data
}
