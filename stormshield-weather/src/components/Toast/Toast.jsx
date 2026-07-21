import { AnimatePresence, motion } from 'framer-motion'
import { FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'
import './Toast.css'

const ICONS = {
  default: FiInfo,
  success: FiCheckCircle,
}

export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] ?? ICONS.default
          return (
            <motion.div
              key={toast.id}
              className={`toast glass toast--${toast.type}`}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.94, transition: { duration: 0.18 } }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <Icon className="toast__icon" />
              <span className="toast__message">{toast.message}</span>
              <button
                type="button"
                className="toast__close"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss notification"
              >
                <FiX />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
