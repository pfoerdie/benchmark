import { Test, Runtime } from '@pfoerdie/benchmark'
import { randomInt } from 'node:crypto'

const runtime = new Runtime(
  'Create a new array with fixed length and fill it with values',
  function () {
    return randomInt(100, 999)
  }
)

runtime.register(new Test(
  'push values into empty array',
  function (length) {
    const result = []
    for (let index = 0; index < length; index++) {
      result.push(index)
    }
    return result
  }
))

runtime.register(new Test(
  'assign values to fixed array',
  function (length) {
    const result = new Array(length)
    for (let index = 0; index < length; index++) {
      result[index] = index
    }
    return result
  }
))

runtime.register(new Test(
  'use Array.fill and Array.map on fixed array',
  function (length) {
    const result = new Array(length)
      .fill(undefined)
      .map((value, index) => index)
    return result
  }
))

runtime.register(new Test(
  'use Array.from with arrayLike and map function',
  function (length) {
    const result = Array.from({ length }, (value, index) => index)
    return result
  }
))

runtime.register(new Test(
  'use Array.from with a generator',
  function (length) {
    const result = Array.from((function* () {
      for (let index = 0; index < length; index++) {
        yield index;
      }
    })())
    return result
  }
))

runtime.exec(200, 500)
runtime.print()