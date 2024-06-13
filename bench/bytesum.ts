import { Test, Runtime } from '@pfoerdie/benchmark'
import { randomInt, randomBytes } from 'node:crypto'

const runtime = new Runtime(
  function () {
    return randomBytes(randomInt(100, 1000))
  }
)

runtime.register(new Test(
  'Buffer.reduce with modulus',
  function (buffer) {
    return buffer.reduce((sum, val) => (sum + val) % 0xff, 0x00)
  }
))

runtime.register(new Test(
  'Buffer.forEach with uint8 overflow',
  function (buffer) {
    const sum = Buffer.alloc(1)
    buffer.forEach(val => sum[0] += val)
    return sum[0]
  }
))

runtime.register(new Test(
  'Buffer.reduce with uint8 overflow',
  function (buffer) {
    return buffer.reduce((sum, val) => {
      sum[0] += val
      return sum
    }, Buffer.alloc(1))[0]
  }
))

runtime.register(new Test(
  'for-loop with modulus',
  function (buffer) {
    let sum = 0
    for (let i = 0, l = buffer.length; i < l; i++) {
      sum = (sum + buffer[i]) % 0xff
    }
    return sum
  }
))

runtime.register(new Test(
  'for-loop with uint8 overflow',
  function (buffer) {
    const sum = Buffer.alloc(1)
    for (let i = 0, l = buffer.length; i < l; i++) {
      sum[0] += buffer[i]
    }
    return sum[0]
  }
))

runtime.exec(1000, 2000)
runtime.print()