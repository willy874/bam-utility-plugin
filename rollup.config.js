import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import image from '@rollup/plugin-image'
import typescript from 'rollup-plugin-typescript'
import dts from "rollup-plugin-dts";

const plugins = [
  image(),
  typescript(),
  resolve(),
  commonjs(),
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
      file: 'dist/utils.mjs'
    },
    plugins,
    external
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/utils.cjs.js',
      format: 'cjs'
    },
    plugins,
    external
  },
  {
    input: 'src/index.ts',
    output: [{ file: "dist/types.d.ts", format: "es" }],
    plugins: [dts()],
  },
]
