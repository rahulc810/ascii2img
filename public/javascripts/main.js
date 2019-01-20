$(document).ready(function () {

    $('#plus').click(function(event){
        let elem = $('#result-wrapper');
        const step = 2;
        let size = parseFloat($(".ascii").css("font-size"));
        size = (parseFloat(size) + step) + 'px';
        parseFloat($(".ascii").css({'font-size': size}));
    });

    $('#minus').click(function(event){
        let elem = $('#result-wrapper');
        const step = 2;
        let size = parseFloat($(".ascii").css("font-size"));
        size = (parseFloat(size) - step) + 'px';
        parseFloat($(".ascii").css({'font-size': size}));
    });

    $("#submit").click(function (event) {
        //stop submit the form, we will post it manually.
        event.preventDefault();

        // Get form
        var form = $('#ascii2img')[0];

		// Create an FormData object 
        var data = new FormData(form);

		// If you want to add an extra field for the FormData
        //data.append("CustomField", "This is some extra data, testing");

		// disabled the submit button
        $("#btnSubmit").prop("disabled", true);

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
                $("#result").text(data);
                console.log("SUCCESS : ", data);
                $("#btnSubmit").prop("disabled", false);

            },
            error: function (e) {
                $("#result").text(e.responseText);
                console.log("ERROR : ", e);
                $("#btnSubmit").prop("disabled", false);

            }
        });

    });

});
