const express = require('express')
const path = require('path')
const app = express()
const port = 3000

//idk czy to potrzebne xd
app.use(express.static(__dirname + '/public/'));
app.use(express.json());

app.get('/', (req, res) => {
    res.render(path.join(__dirname + '/public/main.ejs'));
})

app.get('/about_me', (req, res) => {
    res.render(path.join(__dirname + '/public/about_me.ejs'));
})

app.get('/bullet_journal', (req, res) => {
  res.render(path.join(__dirname + '/public/bullet_journal.ejs'));
})

//zawsze jest, zeby dzialalo, nasluchiwanie portu!!
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})