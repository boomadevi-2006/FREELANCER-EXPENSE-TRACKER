var express = require("express");
var bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/freelancer_expense_tracker", {});

var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function () {
    console.log("Connected to MongoDB");
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve all files from the same project folder
app.use(express.static(__dirname));

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const User = mongoose.model("User", userSchema);

// Handle Signup
app.post("/sign_up", async function (req, res) {
    var { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.send(`<script>alert("Signup Failed! Email already exists."); window.location.href = '/signup.html';</script>`);
    }

    var newUser = new User({ username, email, password });
    await newUser.save();

    console.log("User signed up successfully");
    res.redirect("/login.html");
});

// Handle Login
app.post("/login", async function (req, res) {
    var { username, password } = req.body;

    if (username === "admin" && password === "admin123") {
        console.log("Admin logged in");
        return res.send(`<script>window.location.href = "/admin_dashboard.html";</script>`);
    }

    const user = await User.findOne({ username, password });
    if (!user) {
        return res.send(`<script>alert("Invalid Username or Password! Please try again."); window.location.href = '/login.html';</script>`);
    }

    console.log("User logged in successfully");
    return res.send(`<script>window.location.href = "/user_dashboard.html";</script>`);
});

// CRUD Operations for Users (Admin Dashboard)
app.get("/users", async function (req, res) {
    const users = await User.find();
    res.json(users);
});

app.post("/add_user", async function (req, res) {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.json({ message: "User added successfully!" });
});

app.put("/update_user/:id", async function (req, res) {
    const { id } = req.params;
    const { username, email, password } = req.body;
    await User.findByIdAndUpdate(id, { username, email, password });
    res.json({ message: "User updated successfully!" });
});

app.delete("/delete_user/:id", async function (req, res) {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully!" });
});

// Serve Pages
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/signup.html", function (req, res) {
    res.sendFile(path.join(__dirname, "signup.html"));
});

app.get("/login.html", function (req, res) {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/admin_dashboard.html", function (req, res) {
    res.sendFile(path.join(__dirname, "admin_dashboard.html"));
});

app.get("/user_dashboard.html", function (req, res) {
    res.sendFile(path.join(__dirname, "user_dashboard.html"));
});

// Start Server
app.listen(3000, function () {
    console.log("Server listening at port 3000");
});
