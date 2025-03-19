const bodyParser = require('body-parser');
const express = require('express');
const connection = require('./database');
const session = require ('express-session')

const app = express(); 

connection.connect((err) => {
    if (err) {
        console.log("error conntecting to DB : " + err)
        return
    }

    console.log("Connected to database!")
})

app.use("/", express.static("www"));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 
    }
}))


//send("registered <a href='index.html'>successfully</a>");
app.post("/register", (req, res) =>{
    var user = (req.body.username); 
    var pswrd = (req.body.password);
    var cnfrmpswrd = (req.body.check);
    if (pswrd == cnfrmpswrd) {
        connection.query("INSERT INTO users (username, password) VALUES (?, ?)", [user, pswrd], 
            function (err, results, fields) {
                if (err) {
                    res.send("Error" + err)
                    return
                }
                res.redirect("index.html")          
            }  
        )
    }
})

app.post("/login", (req, res) => {
    console.log(req.body.user + " "  + req.body.pswrd)
    if (!req.body.user || !req.body.pswrd) {
        res.status(400).send({
            "message": "Missing username or password"
        })
        return
    }
    var user = req.body.user; 
    var pswrd = req.body.pswrd;
    console.log("SELECT * FROM players WHERE username = '" + user  + "' and password = '"  + pswrd  + "'")
    connection.query("SELECT * FROM players WHERE username = ? and password = ?", [user, pswrd], 
        function (err, results, fields) {
            if (err){
                res.status(500).send({
                    "message": err
                })
                return
            }

            if (results.length == 0){
                res.status(404).json({
                    "message": "Player not found"
                })
            }else{
                req.session.user = user 
                res.status(200).json({
                    "username": req.session.user, 
                    "gold": results[0].gold, 
                    "message": "logged in successfully. Welcome" + req.session.user
                })
            }
        }
    )
})

app.get("/lobby", (req,res) =>{
    if (req.session.user){
        res.redirect("lobby.html")
    }else{
        res.send("no game for you <br/><a href='/index.html'>Login</a>")
    }
})

app.get("/user-info", (req,res) => { 
    if (req.session.user) {
        res.json({ username: req.session.user }); 
    }
})

app.get("/game", (req,res) => {
    // Always confirm the user is logged in.
    if (req.session.user){
        res.send("Load the game for user " + req.session.user + "<br/><a href='/logout.>Logout</a>")
    }else{ 
        res.send("no game for you <br/><a href='/index.html'>Login</a>")
    }
    // Need to make a query to the DB asking for the game state.
})

app.get("/logout", (req,res) =>{
    req.session.destroy()
    res.send("log-out successfully <br/>go to<a href='/index.html'>log-in page</a>")
})

app.listen(4000, () =>{
    console.log('server is running at http://localhost:4000/');
}); 