const app = require('./app'),
port = process.env.PORT || 80;

app.listen(port, () => console.log(`\nExpress departing now from port ${port}!\n`));