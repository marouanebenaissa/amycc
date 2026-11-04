'use client'

import { useState } from 'react'

interface FaqItem {
  q: string
  a: string
}

interface FaqAccordionProps {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  function toggle(idx: number) {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx
        return (
          <div
            key={idx}
            className={`rounded-2xl border transition-all overflow-hidden ${
              isOpen
                ? 'bg-[#FAF8F5] border-[#231f20]/30 shadow-subtle'
                : 'bg-white border-[#e5e0d6] hover:border-[#cfc7b9]'
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-start focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="text-sm sm:text-base font-bold text-[#231f20] flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isOpen ? 'bg-[#231f20] text-white' : 'bg-[#FAF8F5] text-[#bd3227]'
                  }`}
                >
                  {idx + 1}
                </span>
                <span>{item.q}</span>
              </span>

              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ms-3 transition-transform duration-300 text-xs font-bold ${
                  isOpen
                    ? 'rotate-180 bg-[#231f20] text-white'
                    : 'bg-[#FAF8F5] text-[#231f20]'
                }`}
              >
                ▼
              </span>
            </button>

            {isOpen && (
              <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#5C5A55] leading-relaxed border-t border-[#E5E0D6] pt-4">
                {item.a}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
