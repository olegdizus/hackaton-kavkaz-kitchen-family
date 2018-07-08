$(function () {

    $('#ShowAllComment').on('click', function () {
        GetAllComments(ShowAllComments);
    });

    $('#HideAllComment').on('click', function () {

        ShowLastComment();

    });

});



function GetAllComments(callback) {

    var variantId = parseInt($("#KpiVariants").val());
    var date = $('#currDate').data('date');
    var employeeId = parseInt($("#menuId").val());



    $.ajax({
        url: basePath + "SalesPlansKpi/GetAllComments",
        data: {
            variantId: variantId,
            date: date,
            employeeId: employeeId,
        },
        type: 'post',
        success: function (response) {
            if (response.success === false) {
                if (response.message != null) {
                    alert(response.message);
                }
            } else {

                callback(response.result);
            }

        },
        error: function () {
            alert('При получении списка комментариев произошла ошибка!');
        }
    });


}


function ShowAllComments(comments) {

    $("#allComments").empty();

    for (var i = 0; i < comments.length; i++) {

        $("#allComments").append('<p>' + comments[i] + '</p>');
    }

    $('.lastComment').slideUp();
    $('.allComment').slideDown();
}

function ShowLastComment() {

    $('.lastComment').slideDown();
    $('.allComment').slideUp();
}