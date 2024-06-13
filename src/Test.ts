import { prettyFormatNumber } from './util'
import Timer from './Timer'

export default class Test<T> {

  #label: string
  #tester: (value: T) => any
  #runs: number
  #timer: Timer

  constructor(label: string, tester: (value: T) => any) {
    if (typeof label !== 'string') throw new Error('label must be a string')
    if (label.length === 0) throw new Error('label must not be an empty string')
    if (typeof tester !== 'function') throw new Error('tester must be a function')

    this.#label = label
    this.#tester = tester
    this.#runs = 0
    this.#timer = new Timer()
  }

  get time(): number {
    return this.#timer.sec
  }

  get runs(): number {
    return this.#runs
  }

  reset(): this {
    this.#runs = 0
    this.#timer.reset()
    return this
  }

  exec(dataArr: Array<T>): this {
    if (!Array.isArray(dataArr)) throw new Error('dataArr must be an array')
    if (dataArr.length === 0) throw new Error('dataArr cannot be an empty array')
    for (let data of dataArr) {
      this.#timer.start()
      this.#tester(data)
      this.#timer.stop()
      this.#runs++
    }
    return this
  }

  result(locale: string = 'en'): { test: string, runs: string, time: string, average: string } {
    if (typeof locale !== 'string') throw new Error('locale must be a string')
    return {
      test: this.#label,
      runs: this.#runs.toLocaleString(locale),
      time: prettyFormatNumber(this.#timer.sec, 3, 's', 0, locale),
      average: prettyFormatNumber(this.#runs > 0 ? this.#timer.sec / this.#runs : 0, 3, 's', 0, locale)
    }
  }

}
