// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
var util = require('util');

fs.readFile = util.promisify(fs.readFile);
fs.writeFile = util.promisify(fs.writeFile);

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'))
// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
  });


// API
app.get('/api/notes', function(req, res) {
    res.sendFile(path.join(__dirname, 'db/db.json'));
  });

app.post("/api/notes", async function(req,res) {
    try{
    var newNote = req.body;
    var data = await fs.readFile("db/db.json", "utf8");
    var notes = JSON.parse(data);
    notes.push(newNote)
    await fs.writeFile('db/db.json', JSON.stringify(notes));
    res.json("ok")
    }catch(err){
        console.log(err)
    }
})

app.delete("/api/notes/:name/:id", async (req,res)=>{
    try{
        var data = await fs.readFile("db/db.json", "utf8");
        var notes = JSON.parse(data);
        notes.splice(req.params.id,1)
        await fs.writeFile('db/db.json', JSON.stringify(notes));
        res.json("ok")
        }catch(err){
            console.log(err)
        }
})


// // Displays a single character, or returns false
// app.get("/api/characters/:character", function(req, res) {.
//   var chosen = req.params.character;

//   console.log(chosen);

//   for (var i = 0; i < characters.length; i++) {
//     if (chosen === characters[i].routeName) {
//       return res.json(characters[i]);
//     }
//   }

//   return res.json(false);
// });

// // Create New Characters - takes in JSON input
// app.post("/api/characters", function(req, res) {
//   // req.body hosts is equal to the JSON post sent from the user
//   // This works because of our body parsing middleware
//   var newCharacter = req.body;

//   // Using a RegEx Pattern to remove spaces from newCharacter
//   // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
//   newCharacter.routeName = newCharacter.name.replace(/\s+/g, "").toLowerCase();

//   console.log(newCharacter);

//   characters.push(newCharacter);

//   res.json(newCharacter);
// });




// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
