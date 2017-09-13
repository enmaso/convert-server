const http = require('http')
const childProcess = require('child_process')
const fs = require('fs')

childProcess.exec('convert -version', (err, stdout, stderr) => {
  if(err) {
    console.error('convert required')
    process.exit(1)
  }
})

const HTTP_PORT = process.argv[2] || 8300

/**
  curl http://localhost:8300/pdf/png --upload-file myfile.pdf > myfile.png
  curl -T myfile.pdf http://localhost:8300/pdf/png > myfile.png
  curl -X PUT --data-binary @myfile.pdf http://localhost:8300/pdf/png > myfile.png
**/
const server = http.createServer((req, res) => {
  if(req.method == 'POST' || req.method == 'PUT') {
    let uri = req.url.split('/')
    uri.shift()
    let convertFrom = uri.shift()
    let convertTo = uri.shift()
    let ts = Date.now()
    let filepath = `${__dirname}/${ts}.${convertFrom}`
    let stream = fs.createWriteStream(filepath)
    req.on('data', data => {
      stream.write(data)
    })
    req.on('end', () => {
      stream.end()
      childProcess.exec(`convert '${filepath}' ${filepath}.${convertTo}`, (err, stdout, stderr) => {
        if(!err) {
          let buffer = fs.readFileSync(`${filepath}.${convertTo}`)
          res.write(buffer, 'binary')
          res.end(null, 'binary')
          fs.unlinkSync(filepath)
          fs.unlinkSync(`${filepath}.${convertTo}`)
        } else {
          console.error(stderr)
          fs.unlinkSync(filepath)
          res.statusCode = 500
          res.write('Internal Server Error')
          res.end()
        }
      })
    })
  } else {
    res.statusCode = 400
    res.write('Must use POST or PUT method')
    res.end()
  }
})

server.listen(HTTP_PORT, err => {
  console.log(`convert-server running on port ${HTTP_PORT}`)
})

/**
  Imagemagick, Jasper, Ghostscript, Jpeg, libpng, etc needed to be more gooderer
**/