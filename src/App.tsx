import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from '@/components/landing/LandingPage'
import ImportPage from '@/components/import/ImportPage'
import EditorPage from '@/components/editor/EditorPage'
import CheckoutPage from '@/components/checkout/CheckoutPage'
import DashboardPage from '@/components/dashboard/DashboardPage'
import { useAuthStore } from '@/stores/useAuthStore'

function App() {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    const unsubscribe = initialize()
    return unsubscribe
  }, [initialize])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
