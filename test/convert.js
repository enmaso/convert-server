const assert = require('assert')
const exec = require('child_process').exec
const fs = require('fs')
const convert = require('../convert')
const port = process.env.PORT || 8080

describe('server', () => {
  before(() => {
    convert.listen()
  })

  after(() => {
    convert.close()
  })
})

describe('PUT /', () => {
  it('returns image binary?', (done) => {
    let file = `${__dirname}/sample.pdf`
    let tmp = `${__dirname}/sample.png`
    let curl = exec(`curl -T ${file} -o ${tmp} localhost:${port}/png`)

    curl.on('exit', code => {
      assert(fs.existsSync(tmp))
      fs.unlinkSync(tmp)
      done()
    })
  }).timeout(10000)
})
