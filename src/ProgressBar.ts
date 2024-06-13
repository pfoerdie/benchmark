import { SingleBar } from 'cli-progress'

const SGR = (value: number) => `\x1b[${value}m`
const CHARS = ['\u2800', '\u2840', '\u2844', '\u2846', '\u2847', '\u28c7', '\u28e7', '\u28f7', '\u28ff']

export default class ProgressBar extends SingleBar {

  constructor() {
    super({
      stream: process.stdout,
      fps: 30,
      etaBuffer: 300,
      barsize: 60,
      hideCursor: true,
      linewrap: true,
      format: `progress: [${SGR(1)}${SGR(32)}{bar}${SGR(39)}${SGR(22)}] ${SGR(1)}{percentage}%${SGR(22)}`
        + ` | time: ${SGR(1)}{duration}s${SGR(22)}`
        + ` | eta: ${SGR(1)}{eta}s${SGR(22)}`,
      formatBar(progress, { barsize = 40 }) {
        const base = CHARS.length - 1
        const total = base * barsize
        const current = Math.round(progress * total)
        if (current === total) return ''.padStart(barsize, CHARS.at(-1))
        const filled = Math.floor(current / base)
        const rest = current % base
        return CHARS[rest].padStart(filled + 1, CHARS.at(-1)).padEnd(barsize, CHARS.at(0))
      }
    })
  }

}