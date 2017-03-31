var jsdom=require('jsdom');
var $=require('jquery')(jsdom.jsdom().createWindow());


    $("#options").submit(function(e) {
    e.preventDefault();
    $(".options").append("div");
    var text = $("#optionvalues").val();
    $(".options:first-child").html("<h3>"+text+"</h3>");
});

$(".options>div").click(function() {
    var div = $(this);
    $(div+":first-child").append("<button type='button' class='btn btn-danger'>Delete</button>");
    $(".btn-danger").onclick(function(){
    $(div).remove();
});
});

$(".btn-danger").click(function(){
    
})

if ($("#title").val()!=="" && $("div").length>4) {
    $("#submitchart").prop("disabled", false);
}

