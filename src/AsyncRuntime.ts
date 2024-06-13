import ProgressBar from './ProgressBar'
import AsyncTest from './AsyncTest'

export default class AsyncRuntime<T> {

  #tests: Array<AsyncTest<T>>
  #generator: (index: number) => Promise<T> | T
  #progress: ProgressBar

  constructor(generator: (index: number) => Promise<T> | T) {
    if (typeof generator !== 'function') throw new Error('generator must be a function')
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

  register(test: AsyncTest<T>): this {
    if (!(test instanceof AsyncTest)) throw new Error('test must be an instance of AsyncTest')
    this.#tests.push(test)
    return this
  }

  async exec(repetitions: number = 1, length: number = 1): Promise<this> {
    if (!Number.isInteger(repetitions)) throw new Error('repetitions must be an integer')
    if (repetitions <= 0) throw new Error('repetitions must be greater than 0')
    if (!Number.isInteger(length)) throw new Error('length must be an integer')
    if (length <= 0) throw new Error('length must be greater than 0')
    const dataArr = await Promise.all(new Array(length).fill(null).map(async (value, index) => this.#generator(index)))
    this.#progress.start(repetitions * this.#tests.length, 0)
    for (let k = 0; k < repetitions; k++) {
      const testArr = this.#tests.toSorted(() => Math.random() - .5)
      for (let test of testArr) {
        await test.exec(dataArr)
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