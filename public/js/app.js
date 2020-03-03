
$(document).ready(() => {


    $(document).on("click", "#btn-scrape", () => {

        $.get("/scrape", data => {
            console.log(data)
            for(let i=0;i<data.length;i++){
                const article = $("<div>").append(
                    $("<p>").html(data[i]._id + "<button class='btn-add'>Add</button>").addClass("title"),
                    $("<p>").text(data[i].summary).addClass("summary"),
                    $("<p>").text(data[i].author).addClass("author"),
                    $("<p>").text(data[i].datePub).addClass("pubDate"),
                    $("<p>").text(data[i].link).addClass("link")
                )
                article.attr("id",data[i]._id)
                article.addClass("article")
                $("#results").append(article);
            }
        });
    });

    $(document).on("click", ".btn-add", function(){
        let selected = {} 
        selected._id = $(this).parents(".article").attr("id")
        selected.summary = $(this).parent().siblings(".summary").text()
        selected.author = $(this).parent().siblings(".author").text()
        selected.datePub = $(this).parent().siblings(".pubDate").text()
        selected.link = $(this).parent().siblings(".link").text()

        console.log(selected)

        $.ajax("/savearticle/",{
            type: "POST",
            data: selected
        }).then(
            data => {
                $(this).parents(".article").remove();
                console.log("Your article has been saved");
            }
        );
    });
});