var _item_id, _url, _callback;

function showDeleteModal(item_id, url, header, callback, buttonText) {
    _item_id = item_id;
    _url = url;
    _callback = callback,

    $('#headerModal').html(header);

    if (buttonText) {
        $('#deleteModalButton').html(buttonText);
    }

    $('#deleteModalButton').click(function () {
        deleteItem(_item_id);
    });

    $('#closeModalButton').click(function () {
        $('#deleteModal').arcticmodal('close');
    });

    $('#deleteModal').arcticmodal();
}

$('#deleteModalButton').click(function () {
    deleteItem(_item_id, _url, _callback);
});

function deleteItem(item_id, url) {
    if (url) {
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'Post',
            data: {
                __RequestVerificationToken: $("input[name=__RequestVerificationToken]").val(),
                id: item_id
            },
            success: function () {
                if (_callback) {
                    _callback();
                }

                $('#deleteModal').arcticmodal('close');
            }
        });
    };
}