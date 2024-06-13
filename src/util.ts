export function prettyFormatNumber(value: number, precision: number = 3, unit: string = '', shift: number = 0, locale: string = 'en'): string {
  const decimalValue = Number(value)
  const logMagnitude = Math.log10(decimalValue)
  const intMagnitude = Math.floor(logMagnitude)
  const restMagnitude = (10 ** (logMagnitude - intMagnitude) - 1) / 9
  const magnitude = intMagnitude + restMagnitude
  const decimalPrecision = 10 ** (intMagnitude - precision)
  const roundedValue = Math.round(decimalValue / decimalPrecision) * decimalPrecision
  const quantifierList = ['p', 'n', 'µ', 'm', '', 'k', 'M', 'G', 'T']
  const quantifierFactor = 3 * Math.floor(Math.max(-4, Math.min(4, (magnitude - shift) / 3)))
  const quantifier = quantifierList[4 + quantifierFactor / 3]
  const valuePrefix = Math.abs(decimalValue - roundedValue) <= Number.EPSILON ? '' : '~ '
  const valueSuffix = quantifier || unit ? ' ' + quantifier + unit : ''
  const valueFormatted = (roundedValue / 10 ** quantifierFactor).toLocaleString(locale, { maximumSignificantDigits: precision + 1 })
  return valuePrefix + valueFormatted + valueSuffix
}

/** @see https://vt100.net/docs/vt510-rm/SGR.html */
export function SGR(value: number): string {
  return `\x1b[${value}m`
}