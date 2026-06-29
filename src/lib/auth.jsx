import { createContext, useContext, useState, useEffect } from 'react'

const ADMIN_EMAIL = 'nahidurzaman1903@gmail.com'
const ADMIN_PASS  = 'nahidurzaman_portfolio'
const SESSION_KEY = 'nzt_admin_session'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true'
  })

  const login = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setIsAdmin(true)
      sessionStorage.setItem(SESSION_KEY, 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    sessionStorage.removeItem(SESSION_KEY)
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
