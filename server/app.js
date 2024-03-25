const express = require('express');
const app = express();
const port = 5000;

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});