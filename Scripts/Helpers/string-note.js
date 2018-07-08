function StringNote() {}

StringNote.Lcs = function (sourceContent, differentContent) {

    var n = sourceContent.length;
    var m = differentContent.length;
    var lengths1 = [];
    var lengths2 = [];

    for (var i = 0; i <= m; i++) {
        lengths1[i] = lengths2[i] = 0;
    }

    for (i = n - 1; i >= 0; i--) {
        for (var j = m - 1; j >= 0; j--) {
            if (sourceContent[i].toUpperCase() === differentContent[j].toUpperCase())
                lengths1[j] = lengths2[j + 1] + 100;
            else
                lengths1[j] = Math.max(lengths1[j + 1], lengths2[j]) - i - j - 2;
        }

        var lengths = lengths1;
        lengths1 = lengths2;
        lengths2 = lengths;
    }

    return lengths2[0];
}

StringNote.filterByLcs = function (category, pairs, count) {
    
    var maxNote = -1;

    var processed = [];

    for (var i = 0; i < pairs.length; i++) {

        processed.push({
            note: StringNote.Lcs(pairs[i], category),
            value: pairs[i]
        });
    }

    processed.sort(function(a, b) {
        return b.note - a.note;
    });

    var result = [];

    i = 0;

    var length = processed.length;

    while (i < length && (processed[i].note >= maxNote || i < count)) {

        maxNote = processed[i].note;

        result.push(processed[i].value);

        i++;
    }

    return result;
}