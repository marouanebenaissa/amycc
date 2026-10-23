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
      <label className="block text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-500 ms-1">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
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
        'w-full px-3 py-2.5 text-sm rounded-lg border transition-all outline-none',
        'focus:ring-2 focus:ring-[#0068ff] focus:border-[#0068ff]',
        error
          ? 'border-red-400 bg-red-50'
          : 'border-slate-200 bg-white hover:border-slate-300',
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
        'w-full px-3 py-2.5 text-sm rounded-lg border transition-all outline-none resize-vertical',
        'focus:ring-2 focus:ring-[#0068ff] focus:border-[#0068ff]',
        error
          ? 'border-red-400 bg-red-50'
          : 'border-slate-200 bg-white hover:border-slate-300',
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
        'w-full px-3 py-2.5 text-sm rounded-lg border transition-all outline-none bg-white',
        'focus:ring-2 focus:ring-[#0068ff] focus:border-[#0068ff]',
        error ? 'border-red-400' : 'border-slate-200 hover:border-slate-300',
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
      <div className="flex-1 h-px bg-slate-100" />
      <span className="text-2xs font-bold uppercase tracking-widest text-slate-400">{title}</span>
      <div className="flex-1 h-px bg-slate-100" />
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
        'px-4 py-2 text-xs font-semibold rounded-lg transition-colors',
        active ? 'bg-[#0068ff] text-white' : 'text-slate-500 hover:bg-slate-100',
      ].join(' ')}
    >
      {locale.toUpperCase()} — {label}
    </button>
  )
}
