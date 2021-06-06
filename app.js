const express = require('express')
const path = require('path')

const app = express()
const port = 3000

require("dotenv").config();

app.use(express.static(__dirname + '/public/'));
app.use(express.json());
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;
app.use(bodyParser.urlencoded({extended: false}));

const MongoClient = require('mongodb').MongoClient;
const url = process.env.ATLAS_URI;
const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

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

    app.get('/add_book_plan', (req, res) => {
      res.render(path.join(__dirname + '/public/add_book_plan.ejs'));
    });

    app.get('/update_book', (req, res) => {
      var cursor = db.collection('books').find({}).toArray((err, result) => {
        console.log('Connecting with database - update book page');

        if (err) throw err;

        console.log('Connected with database - update book page');
        let book = result.find(o => o._id == req.query.book_id);
        res.render(path.join(__dirname + '/public/update_book.ejs'), {
          current_book : book
        });
      });
    });

    app.post('/update', (req, res) => {
      var item = {
        is_read: true,
        rate: req.body.rateBook,
        note: req.body.noteBook,
        day: req.body.day,
        year: req.body.year,
        month: req.body.month,
        quote: req.body.quote
      };
      var id = req.query.book_id;
      db.collection('books').updateOne({"_id":ObjectID(id)}, {$set: item}, function(err, result) {
        if (err) throw err;
        console.log('Item updated', result.ops);
      });
      res.redirect('/booktrack');
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

    app.post('/insert_plan', (req, res) => {
      var item = {
        title: req.body.titleBook,
        author: req.body.authorBook,
        pages: req.body.pagesBook,
        is_read: false,
        cover: req.body.coverBook,
      };
      db.collection('books').insertOne(item, function(err, result) {
        if (err) throw err;
        console.log('Item(book plan) inserted', result.ops);
      });
      res.redirect('/booktrack');
    });

    app.get('/year', (req, res) => {
      var cursor = db.collection('books').find({}).toArray((err, result) => {
        console.log('Try connecting with database - year page');

        if (err) throw err;

        console.log('Connected with database - year page');

        res.render(path.join(__dirname + '/public/year.ejs'), {
          books: result,
          current_year : req.query.choosen_year
        });
      });
    });

    app.get('/book_page', (req, res) => {
      var cursor = db.collection('books').find({}).toArray((err, result) => {
        console.log('Connecting with database - book page');

        if (err) throw err;

        console.log('Connected with database - book page');
        let book = result.find(o => o._id == req.query.book_id);
        res.render(path.join(__dirname + '/public/book_page.ejs'), {
          current_book : book
        });
      });
    });

    app.get('/book_plans', (req, res) => {
      var cursor = db.collection('books').find({is_read: false}).toArray((err, result) => {
        if (err) throw err;
        console.log('Connected with database - book plans (is read: false)');
        res.render(path.join(__dirname + '/public/book_plans.ejs'), {
          books: result
        });
      });
    });
    
    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`)
    });
});

client.close();







