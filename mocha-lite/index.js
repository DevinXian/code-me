import Mocha from './src/mocha.js'
import print from './reporters/sped.js'

new Mocha().run(print)
