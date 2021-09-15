const app = require('./app');

app.listen(app.port, () => console.log(`\nExpress departing now from port ${app.port}!\n`));