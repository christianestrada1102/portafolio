/**
 * RollingButton — hover slice/roll effect
 * El texto original sube y una copia entra desde abajo.
 * Pure CSS via Tailwind, sin GSAP ni plugins de pago.
 */
export default function RollingButton({ children, className = '', ...props }) {
  return (
    <button
      className={`relative overflow-hidden group ${className}`}
      {...props}
    >
      {/* texto visible */}
      <span className="flex items-center justify-center gap-2 transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:-translate-y-full">
        {children}
      </span>
      {/* copia que entra desde abajo */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center gap-2 translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </button>
  );
}
