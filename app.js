const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const Mustache = require('mustache');
var bodyParser = require('body-parser')

const mongoURL = 'mongodb://localhost:27017/cookbooks';
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(mongoURL, {useMongoClient: true});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static('./public'));

const CookBook = require ("./models/cookbooks");

app.get('/new', function(req,res) {
  res.render('new_cookbook');
});

app.post('/new', function(req,res) {
  CookBook.create(req.body)
    .then(function (cookbooks) {
      res.redirect('/');
    });
  });

app.get('/:id', function(req, res) {
  CookBook.findOne({_id: req.params.id}).then(function (cookbooks) {
  res.render('cookbook', {cookbooks: cookbooks});
  });
});

app.get('/:id/new_recipe', function(req,res) {
  CookBook.findOne({_id: req.params.id}).then(function (cookbooks) {
  res.render('new_recipe', {cookbooks: cookbooks});
  });
});

app.post('/:id/new_recipe', function(req,res) {
  CookBook.findOne({_id: req.params.id}).then(function (cookbooks) {
    cookbooks.triedRecipe.push(req.body);
    cookbooks.save().then(function () {
      console.log(req.body);
      res.render("new_recipe", {cookbooks: cookbooks});
    });
  });
});

app.get('/:id/edit', function(req,res) {
  CookBook.findOne({_id: req.params.id}).then(function (cookbooks) {
  res.render('edit_cookbook', {cookbooks: cookbooks});
  });
});

app.post('/:id/edit', function(req,res) {
  CookBook.findOneAndUpdate({_id: req.params.id}, req.body).then(function (cookbooks) {
  console.log(req.body);
  // CookBook.update(req.body).then(function (cookbooks) {
    res.redirect('/');

  });
});

app.post('/:id/delete', function(req,res) {
  CookBook.findOneAndRemove({_id: req.params.id}).then(function (cookbooks) {
    res.redirect('/');
  });
});

app.get('/', function(req, res){
    CookBook.find().then(function (cookbooks) {
    res.render('index', {cookbooks: cookbooks});
  });
});

app.listen(3000, function () {
  console.log('Successfully started express application!');
});
