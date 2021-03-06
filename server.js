const http = require('http');
const fs = require('fs');
const PORT = 8853;

const doesFileExist = function(filename) {
  return fs.existsSync(filename);
}

const getFileType = function(filename) {
  let fileType = filename.slice(filename.lastIndexOf("."));
  let header = {
    ".jpg": "img/jpg",
    ".jpeg": "img/jepg",
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".gif": "img/gif",
    ".pdf": "text/pdf",
    ".png": "img/png",
    ".txt": "text/txt",
    ".mp3": "application/mp3"
  }
  return header[fileType];
}

const setHomePage = function(response) {
  response.statusCode = 302;
  response.setHeader('Location', "/index.html");
  response.end();
}

const isRandomFile=function(url) {
  let urls=["/"];
  return !urls.includes(url);
}

const handleURls=function(response,fileName,actionOfUrl) {
  if (isRandomFile(fileName)) {
    return displayExistngOrNonExFiles(response,fileName)
  }
  return actionOfUrl[fileName]();
}

const checkUrlAndDisplayContent=function(request,response,fileName) {
  let actionOfUrl={
    "/":function() {
      setHomePage(response);
      return;
    }
  }
  handleURls(response,fileName,actionOfUrl);
}


const displayExistngOrNonExFiles = function(response,fileName) {
  if (doesFileExist('.' + fileName)) {
    response.setHeader("Content-type", getFileType(fileName));
    response.write(fs.readFileSync('.' + fileName));
  } else {
    response.statusCode = 404;
    response.write("File Not Found");
  }
}

const requestHandler = function(request, response) {
  let fileName = request.url;
  checkUrlAndDisplayContent(request,response,fileName);
  response.end();
}


const server = http.createServer(requestHandler);
console.log(`Server is Listening to....${PORT}`);
server.listen(PORT);
