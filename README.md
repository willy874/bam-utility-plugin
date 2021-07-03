# BAM UTILITY PLUGINS

各種通用函式，所做的判斷與處理適用於 Browser 與 Nodejs。

## FileName

處理關於 `名稱` 的字串處理。如果 path-browserify 無法滿足需求的時候，可以搭配該模組來進行大小駝峰的拆解轉換規則。

```js
import { FileName } from 'bam-utility-plugins'

const filename1 = new FileName('bamboo.ex_str test.txt')

console.log(filename1.ConverBigHump())
// BambooExStrTest
console.log(filename1.ConverLittleHump())
// bambooExStrTest
console.log(filename1.data.join('-'))
// bamboo-ex-str-test

const filename2 = new FileName('bambooExStrTest.txt')

console.log(filename2.ConverBigHump())
// BambooExStrTest
console.log(filename2.data.join('-'))
// bamboo-Ex-Str-Test
console.log(filename2.data.map((s) => s.toLowerCase()).join('-'))
// bamboo-ex-str-test
```

## Observable & SubScriber

用於處理連續非同步的事件。

```js
import { Observable } from 'bam-utility-plugins'

const getIndexPlus = async (i) => i + 1

const = observable = new Observable((subscriber) => {
  const arr = Array(3).fill()
  arr.forEach((data) => {
    console.log('log', data)
    return await getIndex(data)
  })
  subscriber.error(() => {
    console.log('error')
  })
  subscriber.end((data) => {
    console.log('end', data)
  })
})

observable.run(0)

// log 0
// log 1
// log 2
// end 3
```

## valueString

將值轉為字串。

```js
import { valueString } from 'bam-utility-plugins'

valueString(undefined) // 'undefined'
valueString(null) // 'null'
valueString(0) // '0'
valueString('') //  "''"
valueString('') //  "''"
valueString(NaN) // 'NaN'
```
