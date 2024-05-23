const express = require('express');
const libraryRoutes = require('./SRC/library/routes');
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello Wold!");
})

app.use('/testapi/v1/libraries', libraryRoutes);

app.listen(port, () => console.log('App listening on port', port));
