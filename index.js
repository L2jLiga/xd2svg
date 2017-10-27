(() => {
  'use strict';

  const [
    fs,
    path,
    express,
    bodyParser
  ] = [
    require('fs'),
    require('path'),
    require('express'),
    require('body-parser')
  ];

  // Node express server setup.

  const server = express();

  const serverPort = 9987;

  const staticResourcesDir = 'web';

  server.set('port', serverPort);

  server.use(express.static(path.join(__dirname, staticResourcesDir)));

  server.get('*', function (req, res) {
    if (req.method === 'GET') {
      try {
        fs.accessSync(path.join(__dirname, staticResourcesDir, req.path));
      } catch (error) {
        console.error('File path: ', path.join(__dirname, staticResourcesDir, req.path));

        console.log(`Request "${req.path}" can not be served as a static file. Redirecting to index.html`);

        res.sendFile(path.join(__dirname, staticResourcesDir, 'index.html'));
      }
    }
  });

  server.use(bodyParser.json());

  server.use(bodyParser.urlencoded(
    {
      extended: true
    }
  ));

  // Start Server.

  server.listen(serverPort, function () {
    console.log(`Express server listening on port ${serverPort}`);
  });
})();