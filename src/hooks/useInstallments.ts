import { InstallmentsContext } from '@/context/InstallmentsContext'
import { useContext } from 'react'

export const useInstallments = () => useContext(InstallmentsContext)
