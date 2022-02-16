import { FileName } from '../src/file-name'

// function log(v: unknown) {
//   console.log(v)
//   return v
// }

test('new FileName():', async () => {
  const fileName = new FileName('ssAdd-See_bb')
  expect(fileName.transformUpperHump()).toBe('SsAddSeeBb')
  expect(fileName.transformLowerHump()).toBe('ssAddSeeBb')
  expect(fileName.transformKebabCase()).toBe('ss-Add-See-bb')
  expect(fileName.transformSnakeCase()).toBe('ss_Add_See_bb')
})
