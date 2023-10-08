export default function eTime(startTime: [number, number]) {
  return parseFloat((process.hrtime(startTime)[0] * 1000 + process.hrtime(startTime)[1] / 1e6).toFixed(3))
}
