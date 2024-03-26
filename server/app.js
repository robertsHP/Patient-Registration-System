const express = require('express');
const path = require('path')
const app = express();
const bodyParser = require('body-parser');

const port = 5000;

app.use(bodyParser.json());
// app.use(express.static('public')) //serve public folder
// app.use(express.static(path.join(__dirname, 'client/build')));
//Remove in production
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
//






app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get("/api", (req, res) => {
    res.json({
        name: "John Doe",
        age: 20,
        courses: ["Math", "Science", "English"]
    });
});
app.post('/api', (req, res) => {
    console.log(req.body);
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});