# convert-server
> Lightweight Nodejs Imagemagick convert server

## Installing requirements
```
sudo apt-get install imagemagick jasper ghostscript
```
Imagemagick should install the basics like jpeg libpng libtiff, etc.. if not, do some googlin'.
## Running convert-server
If you want to has the default port *8300*
```
node index.js
```
If you want to has a different port
```
node index.js 9000
```
## Using convert-server
A pretty straightforward POST or PUT call
```
curl -X PUT --data-binary @yourfile.pdf http://localhost:8300/pdf/png > yourfile.png
```
Where the first query hash is the file type you want to convert from, and the second query hash is the file type you want to convert to.

In the above example, you will be converting from **pdf** to **png**

Make sense? Good.
