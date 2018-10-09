console.log('saved js file');
$('#saveButton').hide();
$('#deleteButton').hide();
$('#scrapeButton').hide();
$(".commentDiv").hide();

$(document).on('click','.articleRemove',function(){

    let button = $(this);

    $.ajax({
        type: "GET",
        url: "/remove-save/" + button.attr("data-id"),
    
        // On successful call
        success: function(response) {

            button.parent().hide();

            if($('.articleDiv:hidden').length == $('.articleDiv').length){

                let message = $('<div>').attr('id','noData').text('Sorry!, we have no articles to display at this moment. Please go to the home page and scrape new data.');
                $('#articleContainer').append(message);

            }
        }
    });
})


$(document).on('click','.commentSubmit',function(){

    let text = $(this).prev().val();
    let comment = $(this).prev();
    let id = $(this).attr("data-id");
    let comments = $(this).prev().prev().prev();

    if(text == ""){

    }else{
        $.ajax({
            type: "POST",
            url: "/save-comment/" + $(this).attr("data-id"),
            data: {
                comment: text
            },
            // On successful call
            success: function(response) {
    
                $(comment).val("");
                displayAllComments(comments,id);
    
            }
        });
    }
    
})

$(document).on('click','.deleteComment', function(){
    let commentID = $(this).attr('data-commentid');
    let id = $(this).attr('data-id');
    let commentToDelete = $(this).parent();
    let comments = $(this).parent().parent();

    console.log('delete comment'+ id + commentID);

    $.ajax({
        type: "GET",
        url: "/delete-comment/" + id + "/" + commentID,
        // On successful call
        success: function(response) {

            displayAllComments(comments,id);

        }
    });
})

$(document).on('click','.articleCommentExpand',function(){

    $(this).next().next().next().show();
    $(this).attr('class', 'articleCommentCollapse').text('Collapse Comments');
    let comments = $(this).next().next().next().children()[0];
    let button = $(this).next().next().next().children()[3];
    let id = $(button).attr('data-id');

    displayAllComments(comments,id);
})

$(document).on('click','.articleCommentCollapse',function(){

    $(this).next().next().next().hide();
    $(this).attr('class', 'articleCommentExpand').text('Read Comments');
})

function displayAllComments(comments,id){
    $.getJSON("/all-comments/"+id, function(data) {

        $(comments).empty();

        for (let i = 0; i < data.comments.length; i++) {

          if(i%2 == 0){
            $(comments).prepend("<div class='comment-entry' data-id=" + data._id + ">" + data.comments[i] + "<div class='deleteComment' data-id=" + data._id + " data-commentId=" + i + ">X</div></div>");
          }else{
            $(comments).prepend("<div style='background-color: #d6d6d6' class='comment-entry' data-id=" + data._id + ">" + data.comments[i] + "<div class='deleteComment' data-id=" + data._id + " data-commentId=" + i + ">X</div></div>");
          }
        }
    });
}





