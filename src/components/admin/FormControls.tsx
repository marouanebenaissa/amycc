interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}

export function FormField({ label, error, required, children, hint }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-[#231f20]">
        {label}
        {required && <span className="text-[#bd3227] ms-1">*</span>}
      </label>
      {hint && <p className="text-3xs text-[#5C5A55]">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      className={[
        'w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all outline-none text-[#231f20]',
        'focus:ring-2 focus:ring-[#231f20] focus:border-[#231f20]',
        error
          ? 'border-red-400 bg-red-50/50'
          : 'border-[#e5e0d6] bg-white hover:border-[#cfc7b9]',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({ error, className = '', ...props }: TextareaProps) {
  return (
    <textarea
      rows={4}
      className={[
        'w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all outline-none resize-vertical text-[#231f20]',
        'focus:ring-2 focus:ring-[#231f20] focus:border-[#231f20]',
        error
          ? 'border-red-400 bg-red-50/50'
          : 'border-[#e5e0d6] bg-white hover:border-[#cfc7b9]',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[]
  error?: boolean
}

export function Select({ options, error, className = '', ...props }: SelectProps) {
  return (
    <select
      className={[
        'w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all outline-none bg-white text-[#231f20]',
        'focus:ring-2 focus:ring-[#231f20] focus:border-[#231f20]',
        error ? 'border-red-400' : 'border-[#e5e0d6] hover:border-[#cfc7b9]',
        className,
      ].join(' ')}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="flex-1 h-px bg-[#e5e0d6]" />
      <span className="text-3xs font-bold uppercase tracking-widest text-[#5C5A55]">{title}</span>
      <div className="flex-1 h-px bg-[#e5e0d6]" />
    </div>
  )
}

export function LocaleTab({
  locale,
  label,
  active,
  onClick,
}: {
  locale: string
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-4 py-2 text-xs font-bold rounded-xl transition-all',
        active ? 'bg-[#231f20] text-white shadow-xs' : 'text-[#5C5A55] hover:bg-[#FEF6CC]',
      ].join(' ')}
    >
      {locale.toUpperCase()} — {label}
    </button>
  )
}
