import { prettyFormatNumber } from './util'

export default class Timer {

  #time: number
  #ts: [number, number] | null

  constructor() {
    this.#time = 0
    this.#ts = null
  }

  get sec(): number {
    return 1e-9 * this.#time
  }

  get msec(): number {
    return 1e-6 * this.#time
  }

  get nsec(): number {
    return this.#time
  }

  reset(): this {
    this.#time = 0
    this.#ts = null
    return this
  }

  start(): this {
    this.#ts = this.#ts || process.hrtime()
    return this
  }

  stop(): this {
    const [sec, nsec] = process.hrtime(this.#ts || undefined)
    this.#time += 1e9 * sec + nsec
    this.#ts = null
    return this
  }

  toString(locale: string = 'en'): string {
    if (typeof locale !== 'string') throw new Error('locale must be a string')
    return prettyFormatNumber(this.sec, 4, 's', .5, locale)
  }

}
