$(document).ready(() => {

    $.get("/findarticles", data => {
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            const article = $("<div>").append(
                $("<p>").html(data[i]._id + "<button class='btn-note'>Notes</button><button class='btn-rm'>Remove</button>").addClass("title"),
                $("<p>").text(data[i].summary).addClass("summary"),
                $("<p>").text(data[i].author).addClass("author"),
                $("<p>").text(data[i].datePub).addClass("pubDate"),
                $("<p>").text(data[i].link).addClass("link")
            )
            article.attr("id", data[i]._id)
            article.addClass("article")
            $("#saved").append(article);
        }
    });

    $(document).on("click", ".btn-note", function () {
        $("#note").text("")
        $("#create-note").val("")
        let selected = $(this).parents(".article").attr("id")
        console.log(selected)

        $.ajax({
            method: "GET",
            url: "/articles/" + selected
        }).then(data => {
            console.log(data)
            const note = data.note ? data.note : "There is no assigned note";
            $("#note").text(note.body);
            $("#current-article").text(data._id)
            $("#modal-note").modal("toggle")
        });
    });

    $(document).on("click", "#btn-addnote", function () {        
        let selected = $("#current-article").text()
        console.log(selected)
        let note = $("#create-note").text()
        $.ajax({
            type: "POST",
            url: "/articlenote/" + selected,
            data: {
                title: $("#current-article").text(),
                body: $("#create-note").val()
            }
        }).then(
            data => {
                if (data) {
                    console.log("Your note has been saved");
                }
            }
        );
        $('#modal-note').modal('hide');
    });

    $(document).on("click", ".btn-rm", function () {  
        let selected = $(this).parents(".article").attr("id")
        $.ajax({
            type: "DELETE",
            url: "/article/" + selected,
        }).then(() => $(this).parents(".article").remove());
    });

});