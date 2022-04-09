const express = require('express');
const app = express();

app.use(express.json());

app.listen(2000)

module.exports = {app}