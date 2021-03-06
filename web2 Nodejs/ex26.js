//execute by http://localhost:3000/
//ex26. 함수를 이용해서 코드 정리 정돈하기 ---> 중복의 제거 

var http = require('http');
var fs = require('fs');
var url = require('url');

function getHTML(title, list, body){  //body -> template literal, returns a template literal
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `;
}
function mkFileList(filelist){  //returns a list of file in a form of HTML
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i++;
  }
  list = list + '</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){ //제대로 동작하는 경우 ---미리 준비된 url 중에 속하는 경우
      if(queryData.id == undefined){  //home url인 경우
        fs.readdir('./data', function(error, filelist){ //파일목록 가져오기
          var title = 'Welcome';      // home page의 data setting
          var description = "Hello, Node.js";
          var list = mkFileList(filelist);

          var template = getHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);  //화면구성
          response.writeHead(200);  //성공적 전송
          response.end(template);   //화면 구성 data를 response객체에 넘기고 상황 종료
        }); //end of readdir
      } else {  //home url이 아닌 다른 url 의 경우
        fs.readdir('./data', function(error, filelist){ //파일 목록 가져오기
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){ //파일 내용 읽기
            var title = queryData.id;
            var list = mkFileList(filelist);

            var template = getHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
            response.writeHead(200);  //성공적 전송
            response.end(template);
          }); //end of readfile
        });   //end of readdir
      }
    } else {  //에러가 발생하는 경우 --- 미리 준비한 url이 아닌 url이 입력되는 경우
      response.writeHead(404);  //전송 실패
      response.end('Not found');  //실패 메세지를 response 객체에 넘기고 상황종료. 이후 이 메세지가 브라우저에 출력된다
    }

});
app.listen(3000);
