var http = require('node:http');
var formidable = require('formidable');
var fs = require ('fs');


const server = http.createServer(async (req, res) => {
  if (req.url === '/upload' && req.method.toLowerCase() === 'post') {
    // parse a file upload
    const form = new formidable.IncomingForm();
    let fields;
    let files;
    try {
        [fields, files] = await form.parse(req);
    } catch (err) {
        // example to check for a very specific error
        if (err.code === formidableErrors.maxFieldsExceeded) {

        }
        console.error(err);
        res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        res.end(String(err));
        return;
    }
    var oldpath = files.multipleFiles[0].filepath;
    console.log(oldpath);
    var newpath = '/home/anita/tmp/' + files.multipleFiles[0].originalFilename;
    fs.rename(oldpath, newpath, function (err) {
       if (err) throw err;
       res.writeHead(200, {'Content-Type': 'text/html'});
       res.write('<h1> File uploaded! </h1> \n\n');
       res.end();
       // res.writeHead(200, { 'Content-Type': 'application/json' });
       // res.end('JSON.stringify({ fields, files }, null, 2));
    });
    return;
  }

  // show a file upload form
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <h2>With Node.js <code>"http"</code> module</h2>
    <form action="upload" enctype="multipart/form-data" method="post">
      <div>Text field title: <input type="text" name="title" /></div>
      <div>File: <input type="file" name="multipleFiles" multiple="multiple" /></div>
      <input type="submit" value="Upload" />
    </form>
  `);
});

server.listen(8080, () => {
  console.log('Server listening on http://localhost:8080/ ...');
});