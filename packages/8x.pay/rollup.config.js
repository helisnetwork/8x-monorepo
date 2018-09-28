import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import sassRollupPlugin from 'rollup-plugin-sass';
import images from 'rollup-plugin-image-files';
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json';

export default {
  input: 'src/index.js',
  output: {
    file: '/dist/index.js',
    format: 'cjs'
  },
  external: [
    'react',
    'react-proptypes'
  ],
  plugins: [
    resolve(),
    sassRollupPlugin(),
    images(),
    json(),
    babel({
      exclude: 'node_modules/**'
    }),
    commonjs({
      namedExports: {
        'node_modules/react-copy-to-clipboard/lib/index.js': ['CopyToClipboard'],
        'node_modules/react-is/index.js': ['isValidElementType']
      }
    })
  ]
}