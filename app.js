//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose =  require('mongoose');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = {
  email : String,
  password : String
}

const User = new mongoose.model("User", userSchema);

app.get('/', function(req, res){
  res.render('home');
});

app.route('/login')
.get(function(req, res){
  res.render('login');
})
.post(async function(req,res){
  const username = req.body.username;
  const password = req.body.password;

  await User.findOne({email: username}).then(function(foundUser) {
    if(foundUser){
      if(foundUser.password === password){
        console.log("Successfully logined");
        res.render("secrets");
      } else{
        console.log("Password entered is wrong");
      }
    } else{
      console.log("User not found");
    }
  })
  .catch(function(err){
    console.log(err);
  })
});

app.route('/register')
.get(function(req, res){
  res.render('register');
})
.post(function(req,res){
  const newUser = new User({
  email : req.body.username,
  password : req.body.password
})
newUser.save();
res.render("secrets");
});





app.listen(3000, function(){
  console.log("Started at port 3000");
});
