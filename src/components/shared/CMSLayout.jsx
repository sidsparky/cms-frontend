import Sidebar from './Sidebar'
import TopBar from './TopBar'
import Toast from './Toast'
import { useToast } from '../../hooks/useToast'
import { createContext, useContext } from 'react'

const ToastContext = createContext(null)
export const useToastContext = () => useContext(ToastContext)

export default function CMSLayout({ title, children }) {
  const { toast, showToast } = useToast()

  return (
    <ToastContext.Provider value={showToast}>
      <div style={styles.shell}>
        <Sidebar />
        <div style={styles.main}>
          <TopBar title={title} />
          <div style={styles.content}>
            {children}
          </div>
        </div>
        <Toast toast={toast} />
      </div>
    </ToastContext.Provider>
  )
}

const styles = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f7f5f0',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  content: {
    flex: 1,
    padding: '32px 28px',
    overflowY: 'auto',
  },
}
