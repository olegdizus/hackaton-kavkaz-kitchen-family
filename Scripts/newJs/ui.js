$(document).ready(function () {
    //return;
    $('#right_block').prepend($('#zoom'));

    $('#map, #left_block').css('height', $(window).height());

    //анимация боковой панели
    $('#left_nav > li').on('click', function () {

        //$(this).siblings('li').removeClass('active');
        $(this).toggleClass('active');

    });

    $('#menu').on('click', function () {
        hideActiveNavBlocks('#menu_block');
        $('#menu_block').fadeToggle().addClass('active');
    });

    $('#search').on('click', function () {
        hideActiveNavBlocks('#search_block');
        $('#search_block').fadeToggle().addClass('active');

        var arraySearch = $('#search_field').val().replace(',', '').split(' ');

        if ((arraySearch[0].length != 0) && ($('#search_result_ul').html().trim().length != 0)) {
            $('#search_result').slideDown(function () {
                $(this).addClass('active');
            });

            $('#search_result_block').scroller('reset');
            $('#search_result .scroller-handle').css('height', '143px');
        }
    });

    //раскрытие меню
    $('#menu_block > div.menu').on('click', function () {
        $('div.submenu.active').slideToggle().removeClass('active');
        $(this).siblings('div.menu').removeClass('active');
        $(this).siblings('div.menu').children('div').removeClass('active');
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $(this).children('div').removeClass('active');
        } else {
            $(this).addClass('active');
            $(this).children('div').addClass('active');
            $(this).next('div.submenu').slideToggle().addClass('active');
        }
    });

    //Закрываем окно поиска
    $('#search_close').on('click', function () {
        $('#search_block').fadeOut();
        $('#search').removeClass('active');
    });

    //Разворачиваем/сворачиваем клавиатуру
    $('#keyboard_title').on('click', function () {
        $('#keyboard').slideToggle();
        $('#status_bar').toggleClass('active');
        $('#search_result').slideUp();
    });

    $('#search_result_block').scroller({
        trackMargin: 20,
        handleSize: 145
    });

    $('.ui-keyboard-enter[data-action="enter"]').on('click', function (e) {
        e.preventDefault();
        console2.log('click');
    });

    //Переключаем вкладки в модальном окне
    $('.vsp_modal_menu ul li').on('click', function () {
        $(this).siblings('li').removeClass('active');
        $(this).addClass('active');
        $(this).closest('.vsp_modal_menu').next('.vsp_modal_content').children('ul').find('li').eq($(this).index()).fadeIn().siblings('.vsp_modal_content > ul > li').hide().removeClass('active');
        //$(this).closest('.vsp_modal_content > ul > li').eq(1).addClass('active');
        //console2.log($(this).index());
    });

    //Закрываем модальное окно
    $('.modal_close').on('click', function () {
        $(this).closest('.vsp_modal').fadeOut();
    });

    //Активируем клавиатуру
    $('#search_field').keyboard({
        layout: 'russian-qwerty',
        usePreview: false,
        stayOpen: true,
        alwaysOpen: true,
        initialFocus: false,
        openOn: '',
        appendTo: $("#keyboard"),


        display: {
            'bksp': "\u21e6",
            //'bksp': '<img src="~/NewImages/bksp.png"/>',
            'default': 'АБВ',
            'meta1': '.?123',
            'shift': '\u21e7',
            //'shift': '<img src="~/NewImages/shift.png"/>',
            'space': 'Пробел',
            'enter': 'Перейти'
        },
        position: {
            of: $('#keyboard')
        },
        css: {
            input: ''
        }
    }).addTyping();


    $('#keyboard_title').bind("taphold", tapholdHandler);

    function tapholdHandler(event) {
        console2.log('tapped');
    }

    //Отркываем окно информации о слое
    $('.info').on('click', function (e) {
        e.stopPropagation();
        $('.info_block.active').fadeOut(function () {
            $(this).removeClass('active');
        });
        $(this).children('.info_block').fadeIn(function () {
            $(this).addClass('active');
        });
    });

    //Закрываем окно информации о слое
    $('.info_block_close').on('click', function (e) {
        e.stopPropagation();
        $(this).closest('.info_block').fadeOut();
        $(this).removeClass('active');
    });

    //Анимируем раздел "Ссылки в меню"
    $('.links_item').hover(function () {
        $(this).addClass('active');
    }, function () {
        $(this).removeClass('active');
    });

});

function hideActiveNavBlocks(id) {
    if ($('.main_controls').not(id).hasClass('active')) { //скрываем основые блоки управления
        //$('.main_controls.active').fadeOut().removeClass('active');
    }
}

//подключаем таблицу с показателями
function AddIndicatorsTable(layer) {

    var indicatorLinkCtrl = $('#indicatorReportLink');
    
    indicatorLinkCtrl.attr('href',
        indicatorLinkCtrl
        .attr('href')
        .replace(new RegExp("layerMask=[-0-9]+"), "layerMask=" + layer));

    $('#main_table').css('left', $(window).width() / 2 - 311);
    $('#main_table').css('top', $(window).height() / 2 - 301);
  
}

function ZoomControlAddButtons(zoomControl, map) {
    var zoomName = 'leaflet-control-zoom',
        parentContainer = L.DomUtil.create('div', 'right_block');

    $(parentContainer).append($('#right_block'));

    $(parentContainer).addClass('right_block');
    var container = L.DomUtil.create('div', zoomName + ' leaflet-bar zoom', parentContainer);

    zoomControl._map = map;

    zoomControl._zoomInButton = zoomControl._createButton(
        '<div class="zoom_in"></div>', 'Zoom in', zoomName + '-in zoom_in', container, zoomControl._zoomIn, zoomControl);
    zoomControl._zoomOutButton = zoomControl._createButton(
        '<div class="zoom_out"></div>', 'Zoom out', zoomName + '-out zoom_out', container, zoomControl._zoomOut, zoomControl);

    map.on('zoomend zoomlevelschange', zoomControl._updateDisabled, zoomControl);
    container.id = "zoom";
   // container.style = "margin-right: 15px; margin-top: 10px; margin-bottom: 20px;";

    return parentContainer;
}

function UIInit() {

    var SlideShow = function () {
    };


    SlideShow.prototype = {
        timerId: null,
        layerss: null,

        Start: function () {
            var showRate = $('#slide_show_slider').slider('value') * 1000;

            if (this.timerId == null) {
                map.setZoom(8);

                this.timerId = setInterval(function loop() {
                    if (this.layerss == null)
                        //this.layerss = $(".layer_content").parent().toArray();
                        this.layerss = $(".submenu").children();


                    //var e = this.layerss[0].attr('id');

                    var next = null;

                    var checkBoxes = $('.SlideShowCheckBox');

                    for (var i = 0; i < this.layerss.length; i++) {
                        var elem = this.layerss[i];
                        if ($(elem).hasClass("active")) {
                            layersOnOff($(elem));

                            var index = (i + 1) % this.layerss.length;

                            while (!$(checkBoxes[index]).is(':checked')) {
                                i++;

                                index = (i + 1) % this.layerss.length;
                            }

                            next = this.layerss[(i + 1) % this.layerss.length];
                            break;
                        }
                    }

                    if (next == null)
                        next = this.layerss[0];

                    var layerMenuItem = $(next);
                    layersOnOff(layerMenuItem);

                    UpdateDateLayer(layerMenuItem.attr('id'));

                    $('#current_layer').text(layerMenuItem.find('.title').text());

                    return loop;
                }(),
                showRate);

                if ($('#left_block_bg').css('display') != 'none')
                    $('#hide').click();

                $('#current_layer').show();

            }
        },

        Stop: function () {
            if (this.timerId != null) {
                clearInterval(this.timerId);
                this.timerId = null;

                if ($('#left_block_bg').css('display') == 'none')
                    $('#show').click();

                $('#current_layer').hide();
            }
        }
    };
    //    window.onresize = function () {
    //        document.body.style.zoom = $(window).height() / 1080;
    //    };

    //    $(window).resize(function () {
    //        document.body.style.zoom = $(window).height() / 1080;
    //    });

    var height = $(window).height();
    var width = $(window).width();

    var slideShow = new SlideShow();

    $('#left_block').css('height', height);
    $('#left_block_bg').css('height', height);
    $('#left_block_bg_show').css('height', height);
    $('#map').css('height', height);
    $('#map').css('width', width);

    //$('#search').css('top', height / 3);
    //$('#preferences').css('top', height - 100);

   mapcontroller.Init();

    var curLayer = QueryString['layer'];

    if (curLayer) {
        layersOnOff($('#' + curLayer));
    } else {
        layersOnOff($('#' + defaultLayer));
    }

    UpdateLevel();

    $('.layer_zoom').css('top', '7px');
    $('.layer_zoom').css('right', '10px');

    $('#layers_content, #search_result').scroller();
    $('.nagruzka_content, #pereformat_content, #bankomat_vsp_main, #terminal_vsp_main, #content_vsp_main, #layer_info_content, #charts-scroller').scroller();
    $('#table-scroller').scroller();

    $('ul.first').click(function () {
        $(this).toggleClass('selected_ul');
        $(this).next('div.child').slideToggle('fast', function () {
            $('#layers_content').scroller('reset');
        });
    });

    $('#slide_show_slider').slider({
        min: 10,
        max: 300,
        value: 10,
        step: 10,
        change: function (event, ui) {
            $('#slide_show_rate_value').val(ui.value);
        }
    });
    $('#slide_show_rate_value').val($('#slide_show_slider').slider('value'));

    $('.SlideShowCheckBox').change(
        function (e) {
            var countsCheck = $('.SlideShowCheckBox:checked').length;
            if (countsCheck == 1) {
                $('.SlideShowCheckBox:checked').attr('disabled', true);

                alert("Не возможно снять все слои. В начале выберите необходимые, затем уберите лишние.");
            } else {
                if (countsCheck == 2)
                    $('.SlideShowCheckBox:checked').removeAttr('disabled');
            }
        });

    $('body').click(function (e) {
        e.stopPropagation();
        if (e.target.id !== 'layer_info' && e.target.id !== 'layer_info_content') {
            $('#layer_info').fadeOut(function () {
                $('img.info_selected').removeClass('info_selected')
                                            .attr('src', pathname + 'images/i.png');
            });
        }
    });

    //if ($(window).height() < 975) {
    height = $(window).height() - $('#weather').height() - ($('#buttons').height() + 20) - ($('#link').height() + 60) - 8 - 30;
    $('#layers').css('height', height);
    $('#layers_content').css('height', height - 8);
    //}

    $('#buttons > img').mousedown(function () {
        $(this).attr('src', pathname + 'images/' + $(this).attr('id') + '_selected.png');
    });

    $('#buttons > img').hover(function () {
        $(this).attr('src', pathname + 'images/' + $(this).attr('id') + '_hovered.png');
    }, function () {
        $(this).attr('src', pathname + 'images/' + $(this).attr('id') + '.png');
    });

    //$('#layers_content > div > ul li:first-child').addClass('layer_first');

    $('.submenu_item').on('click', function () {


        layersOnOff($(this));
    });

    function layersOnOff(layer) {

        var layerid = layer.attr('id');
        layer.siblings('div.submenu_item').removeClass('active');
        layer.addClass('active');

        $('#current_layer').text(layer.find('.title').text());

        mapcontroller.OffLayer(layer.siblings('div.submenu_item').attr('id'));
        mapcontroller.OnLayer(layerid);

        mapcontroller.RecalculateData();
        AddIndicatorsTable(mapcontroller.currentMask);
        UpdateDateLayer(layerid);
    }

    $('#layers .float_right').click(function (e) {
        e.stopPropagation();

        if ($(this).children('img').hasClass('info_selected')) {
            $('#layer_info').fadeOut(function () {
                $('img.info_selected').removeClass('info_selected')
                                                .attr('src', pathname + 'images/i.png');
            });
        } else {
            $('img.info_selected').removeClass('info_selected')
                                            .attr('src', pathname + 'images/i.png');
            //alert('Вы просматриваете информацию по слою ' + $(this).closest('li').attr('id'));
            //var layer_top_margin = e.pageY - (343 / 2);
            var layer_top_margin = ($(this).position().top + 213) - (343 / 2);
            $('#layer_info_overlay').show();
            $('#layer_info').css('top', layer_top_margin);
            $('#layer_info').fadeIn();

            $(this)
                .children('img')
                .attr('src', pathname + 'images/i_selected.png')
                .addClass('info_selected');

            //var content = mapcontroller.GetLayerInfo($(this).closest('li').attr('id'));
            var content = $(this).next().next().html();
            $('#layer_info_content').children().html(content);
        }

    });

    $('#buttons > img').click(function () {
        mapcontroller.SelectRegion($(this).attr('id'));
    });

    $('#skbank_menu_regions > div').click(function () {
        mapcontroller.SelectRegion($(this).attr('id'));
    });

    $('#skbank_menu_item > div').click(function () {
        var attr = $(this).attr('id');
        mapcontroller.SelectRegion(attr);
    });

    $('#links .links').click(function () {
        //$('#search_modal_new').scroller('reset');
        $('#links_modal').css('left', $(window).width() / 2 - 311);
        $('#links_modal').css('top', $(window).height() / 2 - 301);
        $('#links_modal_close').css('top', $(window).height() / 2 - 321);
        $('#links_modal_close').css('left', $(window).width() / 2 + 310);
        $('#links_modal').fadeIn();
        $('#links_modal_close').fadeIn();
    });

    $('#links_modal_close').click(function () {
        $(this).fadeOut();
        $('#links_modal').fadeOut();
    });

    var SearchFocus = true;
    $('#search').click(function () {
        $(this).toggleClass('modal_opened');
        $('#search_modal').css('left', $(window).width() / 2 - 311);
        $('#search_modal').css('top', $(window).height() / 2 - 301);
        $('#search_modal_close').css('top', $(window).height() / 2 - 321);
        $('#search_modal_close').css('left', $(window).width() / 2 + 310);
        if ($('#search_modal').hasClass('searched')) {
            $('#search_result').fadeIn();
        }
        if ($(this).hasClass('modal_opened')) {
            $(this).children('img').attr('src', pathname + 'images/' + $(this).attr('id') + '_selected.png');
            $('#search_modal').fadeIn();
            $('#search_modal_close').fadeIn();
            if (SearchFocus) {
                $('#search_field').focus();
            }
        } else {
            $(this).children('img').attr('src', pathname + 'images/' + $(this).attr('id') + '.png');
            $('#search_modal').fadeOut();
            $('#search_result').fadeOut();
            $('#search_modal_close').fadeOut();
        }
    });

    $('#slide_show').click(function () {
        slideShow.Start();
        $('#preferences_modal_close').click();
    });

    $('#map').click(function () {
        slideShow.Stop();
    });

    $('#gotoMyGeoposition').click(function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                map.setView(L.latLng(position.coords.latitude, position.coords.longitude), 18);
            });
        } else {
            alert("Геолокация не поддерживается данной версией браузера");
        }
    });

    $('#preferences').click(function () {

        //window.location.href = pathname +'admin';

        $(this).toggleClass('modal_opened');

        $('#preferences_modal').css('left', $(window).width() / 2 - 311);
        $('#preferences_modal').css('top', $(window).height() / 2 - 301);
        $('#preferences_modal_close').css('top', $(window).height() / 2 - 321);
        $('#preferences_modal_close').css('left', $(window).width() / 2 + 310);
        if ($(this).hasClass('modal_opened')) {
            $(this).children('img').attr('src', pathname + 'images/' + $(this).attr('id') + '_selected.png');
            $('#preferences_modal').fadeIn();
            $('#preferences_modal_close').fadeIn();
        } else {
            $(this).children('img').attr('src', pathname + 'images/' + $(this).attr('id') + '.png');
            $('#preferences_modal').fadeOut();
            $('#preferences_modal_close').fadeOut();
        }

    });


    $('#preferences_modal_close').click(function () {
        $('#preferences').toggleClass('modal_opened');
        if ($('#preferences').hasClass('modal_opened')) {
            $('#preferences > img').attr('src', pathname + 'images/preferences_selected.png');
            $('#preferences_modal').fadeIn();
            $('#preferences_modal_close').fadeIn();
        } else {
            $('#preferences > img').attr('src', pathname + 'images/preferences.png');
            $('#preferences_modal').fadeOut();
            $('#preferences_modal_close').fadeOut();
        }

        $('#preferences').toggleClass('active');
    });

    $('#layer_info_close').click(function () {
        $('#layer_info').fadeOut(function () {
            $('img.info_selected')
                        .removeClass('info_selected')
                        .attr('src', pathname + 'images/i.png');
        });
    });

    $('#search_modal img').click(function () {
        //searchResalt(1);
    });

    $('#submit_search').on('click', function (e) {
        e.preventDefault();
        $('#keyboard').slideUp(function () {
            $('#status_bar').removeClass('active');
        });
        $('#search_result').slideDown(function () {
            $(this).addClass('active');
        });
        $('#search_result_block').scroller('reset');
        $('#search_result .scroller-handle').css('height', '143px');

        searchResalt(1);
    });

    $('#search_field').keypress(function (e) {
        if (e.which == 13) {
            searchResalt(1);
            $(this).getkeyboard().accept();

            //var html = $('#search_result_template').html();
            //var t = $(html).find('div').append('<b>test</b>').html();
        }
    });

    function searchResalt(currentPage) {

        var arraySearch = $('#search_field').val().replace(',', '').split(' ');
        var coordinates = [];
        var j = 0;
        for (var i = 0; i < arraySearch.length; i++) {
            if (number_type(arraySearch[i])) {
                coordinates[j++] = arraySearch[i];
            }
        }

        if (coordinates.length == 2) {
            //alert(coordinates[0] + ', ' + coordinates[1]);
            map.setView(L.latLng(coordinates[0], coordinates[1]), map.getZoom());
        }
        else {
            if (currentPage == 1) {
                $('#search_result_ul').empty();
                $('#search_result_ul').append('<li style="padding-left: 290px; padding-top: 170px; border-bottom: 0px;"><img src="' + pathname + 'images/ajax-loader.gif" alt="" /></li>');
            }
            $.ajax({
                url: pathname + 'GraphicEnitites.asmx/GetSearch',
                dataType: 'json',
                data: {
                    format: 'json',
                    query: $('#search_field').val(),
                    page: currentPage
                },
                success: function (data) {
                    if (currentPage == 1) {
                        $('#search_result_ul').empty();
                    }
                    if (data != null) {
                        if (data.length == 0) {
                            $('#search_result_ul').append('<li>По Вашему запросу ничего не найдено.</li>');
                        } else {
                            //for (var el in data) {
                            //    $('#' + layer + ' .' + el).text(data[el]);
                            //}
                            SearchFocus = false;
                            $.each(data, function () {
                                $('#search_result_ul').append('<li '
                                    + ' lat="' + this['Latitude']
                                    + '" long="' + this['Longitude']
                                    + '" layerId="' + this['LayerId']
                                    + '" groupId="' + this['GroupId']
                                    + '" ><div class="icon" style="background-image: url(\''
                                    + absoluteUrl + 'NewImages/' + this['imgLayerGS'] + '\');"'
                                    + '/><div class = "search_result_item"><div class="search_result_item_title color">' + this['Addres'] + '</div>' + this['Name'] + '</div></li>');
                            });

                            var cnt = data[0].Cnt;
                            var nextPage = 1 + data[0].Page;
                            if (cnt > 0) {
                                $('#search_result_ul').append('<li style="font-size:large; color:dimgrey; width:100%; text-align:center; margin-top: 7px;" page="' + nextPage + '">Найдено еще ' + cnt + ' объектов</li>');
                            }
                        }
                    }
                },
                error: function (a, b, c) {
                    ServerLogError(a + b + c);
                }
            });
        }
    }



    $('#search_result_ul').on('click', 'li', function (e) {

        var page = $(this).attr('page');
        if (page != null) {
            $(this).empty();
            $(this).append('<img style="padding-left: 290px;" src="' + pathname + 'images/ajax-loader.gif" alt="" />');
            searchResalt(page);
            $(this).remove();
            return;
        }

        map.setView(L.latLng($(this).attr('lat'), $(this).attr('long')), 18);

        $('#search_block').fadeOut();
        $('#search').removeClass('active');

        var groupId = $(this).attr('groupId');
        var layerId = $(this).attr('layerId');
        if (groupId != null && layerId != null) {
            QueryExtendInfoCardDefault(e, groupId, layerId);
        }
    });

    if ($(window).height() < 901) {

        $('#slide_show').css('bottom', '480px');

        $('#search').css('bottom', '380px');
        $('#gotoMyGeoposition').css('bottom', '480px');

        //$("#zoom").append($("#gotoMyGeoposition"));

        $('#search_modal').css('top', '50px');
        $('#search_modal_close').css('top', '30px');
        $('#refresh').css('bottom', '105px');
        $('#preferences').css('bottom', '10px');
    } else {


        $('#slide_show').css('bottom', '480px');

        //$("#zoom").append($("#right_block"));

        $('#search').css('bottom', '380px');
        $('#gotoMyGeoposition').css('bottom', '480px');
        $('#search_modal').css('top', '360px');
        $('#search_modal_close').css('top', '340px');
        $('#refresh').css('bottom', '105px');
        $('#preferences').css('bottom', '10px');
    }

    if ($(window).height() < 975) {
        //$('#left_block').css('overflow-y', 'scroll');
        //$('#left_block').css('width', '545px');
        //$('#left_block_bg').css('width', '567px');
        //$('#layer_info').css('left', '560px');
    }

    if ($(window).height() < 850) {
        $('#search, #search_modal').css('bottom', '380px');
        $('#refresh').css('bottom', '105px');
        $('#preferences').css('bottom', '10px');
    }

    $('#hide, #show').css('top', $(window).height() / 2 - $('#hide').height() / 2);

    $('#hide').click(function () {
        $('#left_block').animate({ width: 'toggle' }, 350);
        $(this).parent('div').animate({ width: 'toggle' }, 350);
    });

    $('#show').click(function () {
        $('#left_block').animate({ width: 'toggle' }, 350);
        $('#left_block_bg').animate({ width: 'toggle' }, 350);
    });

    //$('li.search_terminal').click(function () {
    //    alert($(this).children('div').children('div').children('div').text());
    //});

    $('#search_modal_close').click(function () {
        /*$('#search').toggleClass('modal_opened');
        if ($('#search').hasClass('modal_opened')) {
        $('#search > img').attr('src', pathname + 'images/search_selected.png');
        $('#search_modal').fadeIn();
        $('#search_modal_close').fadeIn();
        } else {
        $('#search > img').attr('src', pathname + 'images/search.png');
        $('#search_modal').fadeOut();
        $('#search_result').fadeOut();
        $('#search_modal_close').fadeOut();
        }*/
        $('#search > img').attr('src', pathname + 'images/search.png');
        $('#search_modal').fadeOut();
        $('#search_result').fadeOut();
        $('#search_modal_close').fadeOut();
    });

    $('#search_result > ul > li').click(function () {
        alert($(this).children('div').children('div').children('div.search_result_title').text());
    });

    $('li.search_terminal').click(function () {
        alert($(this).children('div').children('div').children('div').text());
    });

    $('#search_modal_close').click(function () {
        $('#search').toggleClass('modal_opened');
        if ($('#search').hasClass('modal_opened')) {
            $('#search > img').attr('src', 'images/search_selected.png');
            $('#search_modal').fadeIn();
            $('#search_modal_close').fadeIn();
        } else {
            $('#search > img').attr('src', 'images/search.png');
            $('#search_modal').fadeOut();
            $('#search_result').fadeOut();
            $('#search_modal_close').fadeOut();
        }
    });

    $('#vsp_modal').css('top', $(window).height() / 2 - $('#vsp_modal').height() / 2);
    $('#vsp_modal').css('left', $(window).width() / 2 - $('#vsp_modal').width() / 2);

    $('#refresh').click(function () {
        //window.location = location.href.substring(0, location.href.length - window.location.search.length) + "?layer=" + currentLayer;
        if ($('#isRefreshTiles').length == 0) map.UpdateMap(0);
        else map.UpdateMap($('#isRefreshTiles')[0].checked);

        setTimeout(function () { $('#refresh').toggleClass('active'); }, 1000);
    });

    $('#table').click(function () {
        if ($('#table').hasClass('active')) {
            //alert('показываем таблицу');
            hideActiveNavBlocks('#main_table');
            $('#main_table').fadeToggle().addClass('active');

           // AddIndicatorsTable(mapcontroller.currentMask);

        } else {
            //alert('убираем таблицу');
            hideActiveNavBlocks('#main_table');
            $('#main_table').fadeToggle().addClass('active');
        }

    });

    $('.charts_close > img').on('click', function () {
        $(this).closest('div.charts').fadeOut();
    });


    $('#refreshData').click(function () {
        mapcontroller.RecalculateData();
    });

}

function number_type(str) {
    str = str.replace(/ /g, "");
    str = str.replace(/,/g, ".");

    var re = /[0-9].[0-9]/
    if (!isNaN(parseFloat(+str))) {
        if (re.test(str))
            return true;
        else
            return false;
    }
    else {
        return false;
    }
}
