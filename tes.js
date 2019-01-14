var mysql = require('mysql');
var express = require('express');
var app = express();
var session = require('express-session');
var path = require("path");
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var app = express();
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


var con2 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_user"
});

//PAKE SEQUELIZE

const Sequelize = require('sequelize');
const sequelize = new Sequelize('db_user', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,

define: {
    freezeTableName: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  storage: 'path/to/database.sqlite'
});



app.get('/testsequelize', function (req, res) {
  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
   res.json({ status : "HELLO WORLD"});
})

app.get('/', function (req, res) {
    res.send('WELCOME TO MOBEL LEJEN')
})

app.post('/signup', function (req, res) {
 	var snapshot=req.body;
   	var email="";
  	var username="";
  	var no_telepon= ""; 
  	var password=""; 
  	if (snapshot.email !=null){email=snapshot.email}
  	if (snapshot.username !=null){username=snapshot.username}
  	if (snapshot.no_telepon !=null){no_telepon=snapshot.no_telepon}
  	if (snapshot.password !=null){password=snapshot.password}
 	sequelize.query("INSERT INTO signup (email, username, no_telepon, password) VALUES ('"+email+"','"+username+"', '"+no_telepon+"', '"+password+"')");
   console.log("Anda telah membuat akun");
  res.send("Anda telah membuat akun");
});

app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname + '/login.html'));
});

// app.post('/login', function (request, res) {
//   // res.sendFile(path.join(__dirname + '/login.html'));
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     var snapshot=request.body;
//     var email="";
//     var username="";
//     var password=""; 
//     if (snapshot.email !=null){email=snapshot.email}
//     if (snapshot.username !=null){username=snapshot.username}
//     if (snapshot.password !=null){password=snapshot.password}
//     if (password !=null) {
//     sequelize.query('SELECT * FROM signup WHERE username = "wkwkwk" AND password = "aaassdd" ', {type: Sequelize.QueryTypes.SELECT}).then(myTableRows => { //type: Sequelize.QueryTypes.SELECT agar saat select tidak double response                                          
//       if (myTableRows.length > 0) {
//         // request.session.loggedin = true;
//         // request.session.username = username;
//         // res.redirect('/home');
//         res.send("berasil");
//         console.log(myTableRows.length)
//       } else {
//         res.send('Incorrect Username and/or Password!');
//       }
//        res.end();     
//     });
//   } else {
//     res.send('Please enter Username and Password!');
//     res.end();

//   }
// });
app.post('/login', function (req, res) {
    // res.sendFile(path.join(__dirname + '/login.html'));
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var snapshot=req.body;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var username="";
    var password="";
    if (snapshot.username !=null){username=snapshot.username}
    if (snapshot.password !=null){password=snapshot.password}
    console.log('username'+username);

    if (password !=null) {
      if(username.match(mailformat)){
        sequelize.query("SELECT * FROM signup where email= '"+username+"' and password= '"+password+"' ", {type: Sequelize.QueryTypes.SELECT}).then(myTableRows => { //type: Sequelize.QueryTypes.SELECT agar saat select tidak double response
        console.log(myTableRows)

        if (myTableRows.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/home');
        res.send("berasil");
        console.log(myTableRows.length);}

      //   else {
      //   res.send('Incorrect Username and/or Password!');
      //   console.log("paswot salah");
      // }
    });
  } 

        
        else
        {
        sequelize.query("SELECT * FROM signup where username= '"+username+"' and password= '"+password+"' ", {type: Sequelize.QueryTypes.SELECT}).then(myTableRows => { //type: Sequelize.QueryTypes.SELECT agar saat select tidak double response
        console.log(myTableRows)

        if (myTableRows.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/home');
        res.send("berasil");
        console.log(myTableRows.length);}

         else {
        res.send('Incorrect Username and/or Password!');
        console.log("paswot salah");
      }
      });
  }
}      

  else {
    res.send('Please enter Username and Password!');
            console.log("paswot gk disi");
            res.send("gk disi");
    res.end();

  }


});

app.get('/home', function(request, response) {
  if (request.session.loggedin) {
    response.send('Welcome back, ' + request.session.username + '!');
  } else {
    response.send('Please login to view this page!');
  }
  response.end();
});


app.get('/select', function (req, res) {
   sequelize.query('SELECT * FROM signup', { model: Projects }).then(projects => {
    if (err) throw err;
    console.log(projects);
            

  });
res.send(projects);
})

app.listen(1726);
console.log("Server is listening");
