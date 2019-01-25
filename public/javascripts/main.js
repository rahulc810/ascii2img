$(document).ready(function () {
    $('#rawImg').change(function(){
        adjustFileSelection();
    });

    $('#plus').click(function(event){zoom(true)});
    $('#minus').click(function(event){zoom(false)});

    $("#submit").click(function (event) {
        slowGear(false);
        event.preventDefault();
        var form = $('#ascii2img')[0];
        var data = new FormData(form);

        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/ascii2img",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data) {
                updateControls(data);
            },
            error: function (e) {
                console.log(e.responseText);
                updateControls("Something went wrong!")
            }
        });
    });
});

const FONT_STEP = 2;


const zoom=function(flag){
    const elem = $('#result-wrapper');
    const result = $(".ascii");
    let size = parseFloat(result.css("font-size"));

    if(flag){
        size = (parseFloat(size) + FONT_STEP) + 'px';
    }else{
        size = (parseFloat(size) - FONT_STEP) + 'px';
    }
    parseFloat(result.css({'font-size': size}));
}


const slowGear = function(slow){
    if(slow === true){
        document.getElementById("innergear").setAttribute("dur", "22.8s");
    }else{
        document.getElementById("innergear").setAttribute("dur", "2.8s");
    }
}

const adjustFileSelection = function(){
    if($('#rawImg').val() && $('#rawImg').val().length> 0){
        $('.icon').removeClass('empty');
        $('.icon').addClass('filled');
    }else{
        $('.icon').removeClass('filled');
        $('.icon').addClass('empty');
    }
}


const updateControls=function(data){
    slowGear(true);
    $('#rawImg').val('');
    $("#result").text(data);
    adjustFileSelection();
    //Move toolbar to bottom left
    $('#controls').animate({bottom: "2%", left: "2%"}, 1000);
    //display zoom in and out controls
    $('.font-control').animate({opacity: "1"}, 1000);
}