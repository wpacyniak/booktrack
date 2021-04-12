const express = require('express')
const path = require('path')

const app = express()
const port = 3000

//idk czy to potrzebne xd
app.use(express.static(__dirname + '/public/'));
app.use(express.json());

//zmienne do bazy danych
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://wpacyniak:7092000wp@books.yprgy.mongodb.net/bookTrack?retryWrites=true&w=majority";
const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//łączenie z bazą danych, wszystko wewnątrz zeby baza byla ciagle podlaczona
client.connect((err, database) => {
    
    db = client.db("bookTrack");

    app.get('/', (req, res) => {
      res.render(path.join(__dirname + '/public/main.ejs'));
    });

    app.get('/about_me', (req, res) => {
        res.render(path.join(__dirname + '/public/about_me.ejs'));
    });

    app.get('/booktrack', (req, res) => {
        res.render(path.join(__dirname + '/public/booktrack.ejs'));
    });

    app.get('/year', (req, res) => {
      var cursor = db.collection('books').find({}).toArray((err, result) => {
        console.log('try connecting with database');

        if (err) throw err;

        console.log('connected with database');

        res.render(path.join(__dirname + '/public/year.ejs'), {
          books: result,
          current_year : req.query.choosen_year
        });
      });
    });

    app.get('/book_page', (req, res) => {
      var id = req.query.book_id;

      db.collection('books').findOne({'_id':id}).then(function(result) {
        console.log('try finding the book');

        if (err) throw err;

        console.log('find the book');

        res.render(path.join(__dirname + '/public/book_page.ejs'), {
          current_book : result
        });
      });
    });

//zawsze jest, zeby dzialalo, nasluchiwanie portu!!
    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`)
    });
});

client.close();







