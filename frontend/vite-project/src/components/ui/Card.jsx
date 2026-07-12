export default function Card({
  children,
  className = "",
  ...props
}) {
  return (
    <div
      className={`
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-sm
        p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}