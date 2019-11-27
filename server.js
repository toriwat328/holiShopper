// ========================
// Dependencies
// ========================

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const db = mongoose.connection;

require("dotenv").config();


const wishlistController = require("./controllers/wishlist.js");
const usersController = require('./controllers/users.js')
const sessionController = require('./controllers/session.js')

// ========================
// Port
// ========================

const PORT = process.env.PORT;

// ========================
// Database
// ========================

const PROJECT3_DB = process.env.PROJECT3_DB;

mongoose.connect(PROJECT3_DB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
});

// Error / Success
db.on("error", err => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", PROJECT3_DB));
db.on("disconnected", () => console.log("mongo disconnected"));

// ========================
// Middleware
// ========================

// Use public folder for static assets
app.use(express.json());
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.use(
	session({
		secret: "feedmeseymour",
		resave: false,
		saveUninitialized: false
	})
);

app.use("/wishlist", wishlistController);
app.use('/users', usersController)
app.use('/session', sessionController)



// ========================
// Listener
// ========================

app.listen(PORT, () => {
	console.log("listening on port: ", PORT);
});
