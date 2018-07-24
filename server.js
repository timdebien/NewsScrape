// Dependencies //
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var db = require("./models");

// Models folders //
var Note = require("./models/Note.js");
// var Article = require("./models/Article.js");

// Scraping tools //
var request = require("request");
var cheerio = require("cheerio");

// // Set mongoose to leverage built in JavaScript ES6 Promises
// mongoose.Promise = Promise;

var PORT = process.env.PORT || 3000

var app = express();

// Middlewar`qe //
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));

// Setup Handlebars //
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main",
  partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");

// Database configuration with mongoose //
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
// var db = mongoose.connection;
mongoose.connect(MONGODB_URI)



// Routes //
// home 

app.get("/", function (req, res) {
  console.log("inside home route");
  
  db.Article.find({ "saved": false }, function (error, data) {
    var hbsObject = {
      article: data
    };
    console.log(hbsObject);
    res.render("home", hbsObject);
  });
});

// saved //
app.get("/saved", function (req, res) {
  db.Article.find({ "saved": true }).populate("notes").exec(function (error, articles) {
    var hbsObject = {
      article: articles
    };
    console.log("this is hbsObject", hbsObject);
    
    res.render("saved", hbsObject);
  });
});

// scrape NYTimes //
app.get("/scrape", function (req, res) {
  request("https://www.nytimes.com/", function (err, response, html) {
    var $ = cheerio.load(html);
    $("article").each(function (i, element) {
      var result = {};

      result.title = $(this).children("h2").text();
      result.summary = $(this).children(".summary").text();
      result.link = $(this).children("h2").children("a").attr("href");

      db.Article.create(result).then(data =>{
        console.log(data);
        
      }).catch(err=>{
        console.log(err);
        
      })

      // entry.save(function (err, doc) {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     console.log(doc);
      //   }
      // });
    });
    res.send("Scrape Complete");
  });
});

// get all articles // 
app.get("/articles", function (req, res) {
  Article.find({}, function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});

// grab article by id //
app.get("/articles/:id", function (req, res) {
  Article.findOne({ "_id": req.params.id })
  .populate("note")
  .exec(function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.json(doc);
    }
  });
});

// save article //
app.post("/articles/save/:id", function (req, res) {
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
  .exec(function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.send(doc);
    }
  });
});

// delete saved article //
app.post("/articles/delete/:id", function (req, res) {
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })
   .exec(function (err, doc) {
     if (err) {
       console.log(err);
     } else {
       res.send(doc);
     }
   });
});


// Create a new note
// app.post("/notes/save/:id", function (req, res) {
//   console.log("this is req.body", req.body);
 
//   var newNote = new Note({
//     noteText: req.body.noteText,
//     _headlineId: req.params.id
//   });
//   newNote.save(function (err, note) {
//     if (err) {
//       console.log(err);
//     } else {
//       db.Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "notes": note } })
//       .exec(function (err) {
//         if (err) {
//           res.send(err);
//         } else {
//           res.send(note);
//         }
//       });
//     }
//   });
// });

// // delete a note //
// app.delete("/notes/delete/:note_id/:article_id", function (req, res) {
//   Note.findOneAndRemove({ "_id": req.params.note_id }, function (err) {
//     if (err) {
//       res.send(err);
//     } else {
//       Article.findOneAndUpdate({ "_id": req.params.article_id }, { $pull: { "notes": req.params.note_id } })
//       .exec(function (err) {
//         if (err) {
//           res.send(err);
//         } else {
//           res.send("Note Deleted");
//         }
//       });
//     }
//   });
// });

// Listen on port
app.listen(PORT, function () {
  console.log("App listening on port " + PORT);
});