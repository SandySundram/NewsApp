$('#saveButton').hide();
$('#deleteButton').hide();
$('#scrapeButton').hide();

$(document).on('click','.articleRemove',function(){
    // alert("clicked");
    let button = $(this);
    // alert("ID: "+button.attr('data-id'));
    $.ajax({
        type: "GET",
        url: "/remove-save/" + button.attr("data-id"),
    
        // On successful call
        success: function(response) {
            // console.log('DONE', response);
            // console.log(button.parent());
          // Remove the p-tag from the DOM
            button.parent().hide();
          // Clear the note and title inputs
            if($('.articleDiv').length == 1){
                console.log('render message');
                let message = $('<div>').attr('id','noData').text('Sorry!, we have no articles to display at this moment. Please go to the home page and scrape new data.');
                $('#articleContainer').append(message);
                // $('#noData').show();
            }else{
                console.log('do nothing');
            }
        }
    });
})