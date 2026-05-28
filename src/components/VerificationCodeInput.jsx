import { useRef } from 'react'

export default function VerificationCodeInput({ value, onChange, disabled = false }) {
  const inputRefs = useRef([])
  const digits = value.padEnd(6, ' ').slice(0, 6).split('')

  const setCode = (nextDigits) => {
    onChange(nextDigits.join('').replace(/\D/g, '').slice(0, 6))
  }

  const focusInput = (index) => {
    inputRefs.current[index]?.focus()
    inputRefs.current[index]?.select()
  }

  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element
          }}
          className="h-12 rounded-[10px] border border-[#C9D8EA] bg-white text-center text-[22px] font-extrabold text-[#0D2E8B] outline-none transition focus:border-[#13B5C8] focus:ring-4 focus:ring-[#13B5C8]/15 disabled:bg-[#F3F6FA]"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={digit.trim()}
          onChange={(event) => {
            const nextValue = event.target.value.replace(/\D/g, '')
            const nextDigits = value.padEnd(6, ' ').slice(0, 6).split('')

            if (!nextValue) {
              nextDigits[index] = ' '
              setCode(nextDigits)
              return
            }

            nextDigits[index] = nextValue.slice(-1)
            setCode(nextDigits)
            if (index < 5) focusInput(index + 1)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !digits[index].trim() && index > 0) {
              focusInput(index - 1)
            }
          }}
          onPaste={(event) => {
            event.preventDefault()
            const pastedCode = event.clipboardData
              .getData('text')
              .replace(/\D/g, '')
              .slice(0, 6)

            onChange(pastedCode)
            focusInput(Math.min(pastedCode.length, 5))
          }}
          aria-label={`Цифра ${index + 1}`}
        />
      ))}
    </div>
  )
}
