import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import images from 'rollup-plugin-image-files';
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json';
import sass from 'rollup-plugin-sass';

export default {
  input: 'src/index.js',
  output: {
    file: __dirname + '/dist/index.js',
    format: 'cjs',
  },
  external: [
    'react',
    'react-proptypes',
    'react-router-dom',
    'styled-components',
    '8x.js',
    '@8xprotocol/artifacts',
    'bignumber.js',
    'riot-observable',
    'lodash',
    'react-copy-to-clipboard',
    'react-transition-group',
    '/fp/isNil',
  ],
  plugins: [
    images(),
    sass({
      output: __dirname + '/dist/bundle.css',
      insert: true
    }),
    json(),
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs({
      namedExports: {
        'node_modules/react-copy-to-clipboard/lib/index.js': ['CopyToClipboard'],
        'node_modules/react-is/index.js': ['isValidElementType'],
        'node_modules/xmlhttprequest/lib/XMLHttpRequest.js': ['child_process', 'fs', 'http', 'https', 'url',],
        'node_modules/abi-decoder/node_modules/bignumber.js/bignumber.js': ['crypto'],
        'node_modules/styled-components/dist/styled-components.esm.js': ['stream'],
        'node_modules/xhr2/lib/xhr2.js': ['os']
      }
    })
  ]
}