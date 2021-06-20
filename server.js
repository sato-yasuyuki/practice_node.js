//express読み込み
const express = require('express');

//mysql読み込み
const mysql = require('mysql');

const app = express();
app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));

// 定数connectionを定義して接続情報の書かれたコードを代入
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yasuyuki16',
    database: 'practioce_node_app'
  });

  connection.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return;
    }
    console.log('success');
  });


app.get('/', (req, res) => {
    res.render('top.ejs');
  });

app.get('/index', (req, res) => {
    connection.query(
        'SELECT * FROM items',
        (error, results) => {
        console.log(results);
        res.render('index.ejs', {items: results});
      }
     );
});

app.get('/new', (req, res) => {
    res.render('new.ejs');
});

app.post('/create', (req, res) => {

  connection.query(
    'INSERT INTO items(name) VALUE(?)',
    [req.body.itemName],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.post('/delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM items WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM items WHERE id = ?',
    [req.params.id],
    (error, results) => {
      //console.log(results);
      //console.log(results[0].id);
      //console.log(results[0].name);

      res.render('edit.ejs', {item: results[0] });
    }
  );
});

app.post('/update/:id', (req, res) => {
  connection.query(
    'UPDATE items SET name = ? WHERE id = ?',
    [req.body.itemName, req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.listen(3001);