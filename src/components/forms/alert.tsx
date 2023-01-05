/**
 * Alert Functionality
 */
type AlertType = "error" | "warning" | "success"

// Global Alert div.
export function Alert({ children, type }: { children: string; type: AlertType }) {
  const textColor = type === "error" ? "text-rose-400" : type === "warning" ? "text-orange-400" : "text-sky-400"

  return <div className={`px-3 ${textColor}`}>{children}</div>
}

// Use role="alert" to announce the error message.
export const AlertInput = ({ children }: {children: string | undefined}) =>
  Boolean(children) ? (
    <span className="absolute mt-0.5 text-sm text-red-600" role="alert">
      {children}
    </span>
  ) : null;