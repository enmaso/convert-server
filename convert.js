const http = require('http')
const exec = require('child_process').exec
const fs = require('fs')
const port = process.env.PORT || 8080

const server = http.createServer((req, res) => {
  let ts = Date.now()
  let filepath = `${__dirname}/${ts}`
  let stream = fs.createWriteStream(filepath)
  let uri = req.url.split('/')
  uri.shift()
  let ext = uri.shift()
  req.on('data', data => {
    stream.write(data)
  })
  req.on('end', () => {
    stream.end()
    let cmd = `convert ${filepath}[0] ${filepath}.${ext}`
    exec(cmd, (err, stdout, stderr) => {
      if(err) {
        res.statusCode = 500
        res.end()
        fs.unlinkSync(filepath)
      }
      let buffer = fs.readFileSync(`${filepath}.${ext}`)
      res.write(buffer, 'binary')
      res.end(null, 'binary')
      fs.unlinkSync(filepath)
      fs.unlinkSync(`${filepath}.${ext}`)
    })
  })
})

server.listen(port, (err) => {
  if (err) console.error(err)
  console.log('convert-server running on', port)
})

module.exports.listen = () => {
  server.listen.apply(server, arguments)
}

module.exports.close = (callback) => {
  server.close(callback)
}
