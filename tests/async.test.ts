import { asyncAction } from '../src/async'
jest.setTimeout(30000)

const wait = (t: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, t)
  })
}

const testData = Array(5).fill(async (i: unknown) => {
  await wait(100)
  if (typeof i === 'number') {
    return i + 1
  }
  return 0
})

test('asyncAction():', async () => {
  return asyncAction(testData, 0).then((res) => {
    expect(res).toBe(5)
  })
})
