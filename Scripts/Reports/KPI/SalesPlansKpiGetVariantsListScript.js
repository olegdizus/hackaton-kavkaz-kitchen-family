function UpdateVariants() {

    function setEditVariantMode(editMode) {
        if (editMode == true) {
            $('#KpiVariants').removeAttr('disabled');
            $('#changeVariantBtn').hide();
            $('#saveVariantBtn').show();
            $('#cancelVariantBtn').show();
        } else {
            $('#KpiVariants').attr('disabled', 'disabled');
            $('#changeVariantBtn').show();
            $('#saveVariantBtn').hide();
            $('#cancelVariantBtn').hide();
        }
    }

    function getCurrentVariantId() {
        return $('#currentVariant').val();
    }

    function getCurrentDateString() {

        return $('#currDate').data('date');
    }

    function updateCurrentVariantId(newVariantId) {
        return $('#currentVariant').val(newVariantId);
    }

    var emploeeId = getEmploeeId();

    $.ajax({
        type: 'GET',
        async: false,
        data: {
            employee_id: emploeeId,
            date: getCurrentDateString()
        },
        async: false,
        url: basePath + "SalesPlansKpi/GetCurrentVariant",
        success: function (data) {
            $('#KpiVariants').val(data.variant);
            updateCurrentVariantId(data.variant);
        }
    });

    $('#changeVariantBtn').click(function () {
        setEditVariantMode(true);
    });

    $('#saveVariantBtn').click(function() {
        var variantId = getCurrentVariantId();

        var newVariantId = $('#KpiVariants').val();

        if (variantId != newVariantId) {

            $.ajax({
                url: basePath + "SalesPlansKpi/SetEmployeeVariantByMonth",
                type: 'post',
                data: {
                    employee_id: emploeeId,
                    variant_id: newVariantId,
                    date: date
                },
                success: function() {
                   
                    updateCurrentVariantId(newVariantId);

                    BuildGrid(emploeeId, getCurrentDateString());
                },
                error: function() {
                    alert('При записи данных произошла ошибка');
                    
                    setCurrentVariantAndResetMode();

                    return;
                }
            });
        }

        setEditVariantMode(false);
    });

    $('#cancelVariantBtn').click(function () {
        
        setCurrentVariantAndResetMode();
    });

    function setCurrentVariantAndResetMode() {

        var variantId = getCurrentVariantId();
     
        $('#KpiVariants').val(variantId);

        setEditVariantMode(false);
    }
};