const express = require('express')
const path = require('path')

const app = express()
const port = 3000

//idk czy to potrzebne xd
app.use(express.static(__dirname + '/public/'));
app.use(express.json());
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

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

    app.get('/add_book', (req, res) => {
      res.render(path.join(__dirname + '/public/add_book.ejs'));
    });

    app.post('/insert', (req, res) => {
      var item = {
        title: req.body.titleBook,
        author: req.body.authorBook,
        pages: req.body.pagesBook,
        is_read: true,
        cover: req.body.coverBook,
        rate: req.body.rateBook,
        note: req.body.noteBook,
        day: req.body.day,
        year: req.body.year,
        month: req.body.month,
        quote: req.body.quote
      };
      db.collection('books').insertOne(item, function(err, result) {
        if (err) throw err;
        console.log('Item inserted', result.ops);
      });
      res.redirect('/booktrack');
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
      var cursor = db.collection('books').find({}).toArray((err, result) => {
        console.log('try connecting with database');

        if (err) throw err;

        console.log('connected with database');
        let book = result.find(o => o._id == req.query.book_id);
        res.render(path.join(__dirname + '/public/book_page.ejs'), {
          current_book : book
        });
      });
    });

    app.get('/book_plans', (req, res) => {
      var cursor = db.collection('books').find({is_read: false}).toArray((err, result) => {
        console.log('try connecting with database');
        if (err) throw err;
        console.log('connected with database');
        res.render(path.join(__dirname + '/public/book_plans.ejs'), {
          books: result
        });
      });
    });
    

//zawsze jest, zeby dzialalo, nasluchiwanie portu!!
    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`)
    });
});

client.close();







