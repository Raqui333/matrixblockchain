const app = require('./src/app.js');

const PORT = 8080;

app.listen(PORT, () => {
  console.log('Blockchain API listening on http://localhost:' + PORT);
});
