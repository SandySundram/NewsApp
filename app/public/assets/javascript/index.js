$("#pic-upload").change(function(){
    console.log(this.files);
    var file = new FileReader();
    
    console.log(file.onload);
    file.onload = function(evt){
        console.log(evt.target);
        $("#placeholder-pic").attr('src',evt.target.result);
    };
    file.readAsDataURL(this.files[0]);
})