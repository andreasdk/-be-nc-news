const app = require('./app')

const { PORT = 22108 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));