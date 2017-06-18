import hopp from 'hopp'

export const css =
  hopp([ 'src/css/*.css' ])
    .dest('dist/css')

export const js =
  hopp([ 'src/js/*.js' ])
    .dest('dist/js')

export const watch =
  hopp.watch([ 'js', 'css' ])

export default [
  'js',
  'css'
]