import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import image from '@rollup/plugin-image'
import typescript from 'rollup-plugin-typescript'

const plugins = [
  image(),
  typescript(),
  resolve(),
  commonjs()
]
const external = []

export default [{
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs'
    },
    plugins,
    external
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/function.mjs'
    },
    plugins,
    external
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/function.cjs.js',
      format: 'cjs'
    },
    plugins,
    external
  }
]
