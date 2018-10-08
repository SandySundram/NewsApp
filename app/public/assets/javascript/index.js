$('#saveButton').show();
$('#deleteButton').show();
$('#scrapeButton').show();

$(document).on('click','.articleSave',function(){

    let button = $(this);

    $.ajax({
        type: "GET",
        url: "/save/" + button.attr("data-id"),
    
        // On successful call
        success: function(response) {

            button.hide();

        }
    });
})