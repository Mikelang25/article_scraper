
$(document).ready(function() {


    $(document).on("click", "#btn-scrape", function() {
        $.get("/scrape", function(data) {
            console.log(data)
            for(var i=0;i<data.length;i++){
                var article = $("<div>").append(
                    $("<p>").html(data[i]._id + "<button class='btn-add'>Add</button>").addClass("title"),
                    $("<p>").text(data[i].summary).addClass("summary"),
                    $("<p>").text(data[i].author).addClass("author"),
                    $("<p>").text(data[i].datePub).addClass("pubDate")
                )
                article.attr("id",data[i]._id)
                article.addClass("article")
                $("#results").append(article);
            }
        });
    });

});