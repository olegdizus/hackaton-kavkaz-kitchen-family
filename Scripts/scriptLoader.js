var includedFiles = {};

function includeOnce(path, succesFunc) {
    var file = basePath + path;

    if (includedFiles[path]) {

        if (succesFunc) {
            if (includedFiles[path].length)
                includedFiles[path].push(succesFunc);
            else
                succesFunc();
        }
    } else {
        includedFiles[path] = [succesFunc];

      //  console.log("async includeOnce " + (succesFunc ? true : false) + " " + path);
        try {
            $.ajax({
                url: file,
                dataType: "script",
                async: succesFunc ? true : false,
                //headers: {
                //    "Access-Control-Allow-Origin:": "http://nitrix-intel/Reactive",
                //    "Access-Control-Allow-Methods": "GET, POST,PUT"
                //},
                success: function () {

                    var funcs = includedFiles[path];

                    for (var i = 0; i < funcs.length; i++)
                        if (funcs[i]) {
                            funcs[i]();
                        }

                    includedFiles[path] = [];
                },
                error: function (arg) {
                    console.log(file + " --- " + mydump(arg, 2));
                }
            });
        } catch (e) {
            alert(e);
            console.log(e);
        }
    }
}


function mydump(arr, level) {
    var dumped_text = "";
    if (!level) level = 0;

    var level_padding = "";
    for (var j = 0; j < level + 1; j++) level_padding += "    ";

    if (typeof (arr) == 'object') {
        for (var item in arr) {
            var value = arr[item];

            if (typeof (value) == 'object') {
                dumped_text += level_padding + "'" + item + "' ...\n";
                dumped_text += mydump(value, level + 1);
            } else {
                dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
            }
        }
    } else {
        dumped_text = "===>" + arr + "<===(" + typeof (arr) + ")";
    }
    return dumped_text;
}

