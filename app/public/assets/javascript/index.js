$('#saveButton').show();
$('#deleteButton').show();
$('#scrapeButton').show();

$(document).on('click','.articleSave',function(){
    // alert("clicked");
    let button = $(this);
    // alert("ID: "+button.attr('data-id'));
    $.ajax({
        type: "GET",
        url: "/save/" + button.attr("data-id"),
    
        // On successful call
        success: function(response) {
            console.log('DONE', response);
          // Remove the p-tag from the DOM
          button.hide();
          // Clear the note and title inputs
        }
    });
})