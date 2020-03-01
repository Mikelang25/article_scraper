var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require('path')

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = 3000;

var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


app.get("/scrape", function (req, res) {
    axios.get("https://screenrant.com/movie-news/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("article").each(function (i, element) {
            var result = {};
            result._id = $(this).find(".bc-info").find(".bc-title").children("a").text();
            result.summary = $(this).find(".bc-excerpt").text();
            result.author = $(this).find(".bc-info").find(".bc-details").children("a").prop("title");
            result.datePub = $(this).find(".bc-info").find(".bc-details").children("time").text();
            result.link = "https://screenrant.com" + $(this).find(".bc-img-link").attr("href");
            console.log(result)

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.send("Scrape Complete");
    });
});


app.get("/findarticles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
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