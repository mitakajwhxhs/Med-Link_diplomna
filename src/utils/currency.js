const bgnToEurRate = 1.95583

export function bgnToEuro(value) {
  const amount = Number(value || 0)
  return Number((amount / bgnToEurRate).toFixed(2))
}

export function formatEuroPrice(value) {
  const amount = Number(value || 0)

  return `${amount.toFixed(2)} EUR`
}
