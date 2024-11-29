import { createContext, useContext, useState } from 'react'

interface LayoutContext {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

const LayoutContext = createContext<LayoutContext | null>(null)

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context)
    throw new Error('useLayout must be used within an LayoutProvider')
  return context
}
