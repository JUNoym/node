'use strict';
const http = require('http');
const server = http
    .createServer((req, res) => {
        const now = new Date();
        console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
        // req.connection.remoteAddress は、リクエストが送られた IP 情報を出力する。
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        });

        switch (req.method) {
            case 'GET':
                const fs = require('fs');
                const rs = fs.createReadStream('./form.html')
                //イメージ的には./form.htmlをみてその内容をレスポンスで返している
                rs.pipe(res)
                //ファイルの情報をhtmlのレスポンスとして返している
                break;
            case 'POST':

                let rawData = '';
                req
                    .on('data', chunk => {
                        rawData = rawData + chunk;
                    })
                    .on('end', () => {
                        const decoded = decodeURIComponent(rawData);
                        console.info('[' + now + '] 投稿: ' + decoded);
                        res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
                            decoded + 'が投稿されました</h1></body></html>');
                        res.end();
                    });

                break;
            default:
                break;
        }

    })
    .on('error', e => {
        console.error('[' + new Date() + '] Server Error', e);
    })
    .on('clientError', e => {
        console.error('[' + new Date() + '] Client Error', e);
    });
const port = 8000;
server.listen(port, () => {
    console.info('[' + new Date() + '] Listening on ' + port);
});

