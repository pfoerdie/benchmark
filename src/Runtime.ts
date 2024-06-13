import ProgressBar from './ProgressBar'
import Test from './Test'
import { SGR } from './util'

export default class Runtime<T> {

  #label: string
  #tests: Array<Test<T>>
  #generator: (index: number) => T
  #progress: ProgressBar

  constructor(label: string, generator: (index: number) => T) {
    if (typeof label !== 'string') throw new Error('label must be a string')
    if (label.length === 0) throw new Error('label must not be an empty string')
    if (typeof generator !== 'function') throw new Error('generator must be a function')
    this.#label = label
    this.#tests = []
    this.#generator = generator
    this.#progress = new ProgressBar()
  }

  reset(): this {
    for (let test of this.#tests) {
      test.reset()
    }
    return this
  }

  register(test: Test<T>): this {
    if (!(test instanceof Test)) throw new Error('test must be an instance of Test')
    this.#tests.push(test)
    return this
  }

  exec(repetitions: number = 1, length: number = 1): this {
    if (!Number.isInteger(repetitions)) throw new Error('repetitions must be an integer')
    if (repetitions <= 0) throw new Error('repetitions must be greater than 0')
    if (!Number.isInteger(length)) throw new Error('length must be an integer')
    if (length <= 0) throw new Error('length must be greater than 0')
    console.log(SGR(1) + this.#label + SGR(22))
    const dataArr = new Array(length).fill(null).map((value, index) => this.#generator(index))
    this.#progress.start(repetitions * this.#tests.length, 0)
    for (let k = 0; k < repetitions; k++) {
      const testArr = this.#tests.toSorted(() => Math.random() - .5)
      for (let test of testArr) {
        test.exec(dataArr)
        this.#progress.increment()
      }
    }
    this.#progress.stop()
    return this
  }

  print(locale: string = 'en'): void {
    if (typeof locale !== 'string') throw new Error('locale must be a string')
    const testArr = this.#tests.toSorted((a, b) => a.time - b.time)
    console.table(testArr.map(test => test.result(locale)))
  }

}