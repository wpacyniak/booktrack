const express = require('express')
const path = require('path')
const app = express()
const port = 3000

//idk czy to potrzebne xd
app.use(express.static(__dirname + '/public/'));
app.use(express.json());

//baaaaaaaza danych
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://wpacyniak:<7092000wp>@books.yprgy.mongodb.net/bookTrack?retryWrites=true&w=majority';
const client = new MongoClient(url, {useNewUrlParser: true});
client.connect((err, database) => {
    //zawsze jest, zeby dzialalo, nasluchiwanie portu!!
    db = client.db("bookTrack")

    app.get('/', (req, res) => {
      res.render(path.join(__dirname + '/public/main.ejs'));
    })

    app.get('/about_me', (req, res) => {
        res.render(path.join(__dirname + '/public/about_me.ejs'));
    })

    app.get('/booktrack', (req, res) => {
      var cursor = db.collection('books').find().toArray(function(err, result) {
        console.log('booktrack connect with web page YAYKS')
        if (err) {return console.log(err) }
        console.log('poszlo', result)
        res.render(path.join(__dirname + '/public/booktrack.ejs'), {books:result});
      })
    })


    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })



})







