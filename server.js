const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require('path')

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");
const PORT = 3000;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


app.get("/scrape",(req, res) => {
    axios.get("https://screenrant.com/movie-news/").then(response => {
        const $ = cheerio.load(response.data);
        const articles = [];
        $("article").each(function (i, element) {
            let result = {};
            result._id = $(this).find(".bc-info").find(".bc-title").children("a").text();
            result.summary = $(this).find(".bc-excerpt").text();
            result.author = $(this).find(".bc-info").find(".bc-details").children("a").prop("title");
            result.datePub = $(this).find(".bc-info").find(".bc-details").children("time").text();
            result.link = "https://screenrant.com" + $(this).find(".bc-img-link").attr("href");
            articles.push(result)
        });
        res.json(articles)
    });
});

app.get("/findarticles",(req, res) => {
    db.Article.find({})
        .then(dbArticle => res.json(dbArticle))
        .catch(err => res.json(err));
});

app.post("/savearticle", function (req, res) {
    db.Article.create(req.body)
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
});

app.get("/findarticles/:id", function (req, res) {
    

});

app.post("/articles/:id", function (req, res) {


});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/index.html'))
});

app.get('/articles', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/articles.html'))
});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});