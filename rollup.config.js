import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';
import serve from 'rollup-plugin-serve';

const mode = process.env.NODE_ENV || 'development';
const dev = mode === 'development';

export default {
  input: 'src/main.ts',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    sourcemap: dev
  },
  plugins: [
    typescript({
      sourceMap: dev,
      target: 'esnext'
    }),
    scss({
      sass: require('sass'),
      watch: 'src/styles'
    }),
    serve('public')
  ]
};
