const path = require('path');

const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(3000);