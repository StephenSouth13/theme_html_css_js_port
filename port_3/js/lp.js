!function(e){var r=[],t=!1,n=!1,i={interval:250,force_process:!1},a=e(window),o=[];function p(){n=!1;for(var t=0,i=r.length;t<i;t++){var a=(f=r[t],e(f).filter((function(){return e(this).is(":appeared")})));if(a.trigger("appear",[a]),o[t]){var p=o[t].not(a);p.trigger("disappear",[p])}o[t]=a}var f}e.expr.pseudos.appeared=e.expr.createPseudo((function(r){return function(r){var t=e(r);if(!t.is(":visible"))return!1;var n=a.scrollLeft(),i=a.scrollTop(),o=t.offset(),p=o.left,f=o.top;return f+t.height()>=i&&f-(t.data("appear-top-offset")||0)<=i+a.height()&&p+t.width()>=n&&p-(t.data("appear-left-offset")||0)<=n+a.width()}})),e.fn.extend({appear:function(r,t){return e.appear(this,t),this}}),e.extend({appear:function(a,f){var u=e.extend({},i,f||{});if(!t){var s=function(){n||(n=!0,setTimeout(p,u.interval))};e(window).scroll(s).resize(s),t=!0}u.force_process&&setTimeout(p,u.interval),function(e){r.push(e),o.push()}(a)},force_appear:function(){return!!t&&(p(),!0)}})}("undefined"!=typeof module?require("jquery"):jQuery);
(function ($) {
    $.fn.serializeFormJSON = function () {
        var ARRAY_DELIM = ';';
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            var val = this.value != null ? this.value : '';
            if (this.name.indexOf('.') > 0) {
                var oo = this.name.split('.');
                var oname = oo[0];
                var osubname = oo[1];
                if (!o[oname]) {
                    o[oname] = {};
                }
                if (o[oname][osubname]) {
                    o[oname][osubname] = o[oname][osubname] + ARRAY_DELIM + val;
                } else {
                    o[oname][osubname] = val;
                }
            } else {
                var name = this.name;
                if (o[name]) {
                    o[name] = o[name] + ARRAY_DELIM + val;
                } else {
                    o[name] = val;
                }
            }
        });
        return o;
    };
    $.fn.imagesLoaded = function( callback ) {
        var i, c = true, t = this, l = t.length;
        for ( i = 0; i < l; i++ ) {
            if (this[i].tagName === "IMG") {
                c = (c && this[i].complete && this[i].height !== 0);
            }
        }
        if (c) {
            if (typeof callback === "function") { callback(); }
        } else {
            setTimeout(function(){
                jQuery(t).imagesLoaded( callback );
            }, 200);
        }
    }
    $.fn.thmobilemenu = function (options) {
        var opt = $.extend(
            {
                menuToggleBtn: ".th-menu-toggle",
                bodyToggleClass: "th-body-visible",
                subMenuClass: "th-submenu",
                subMenuParent: "menu-item-has-children",
                thSubMenuParent: "th-item-has-children",
                subMenuParentToggle: "th-active",
                meanExpandClass: "th-mean-expand",
                subMenuToggleClass: "th-open",
                toggleSpeed: 400,
            },
            options
        );

        return this.each(function () {
            var menu = $(this); // Select menu

            // Menu Show & Hide
            function menuToggle() {
                menu.toggleClass(opt.bodyToggleClass);

                // collapse submenu on menu hide or show
                var subMenu = "." + opt.subMenuClass;
                $(subMenu).each(function () {
                    if ($(this).hasClass(opt.subMenuToggleClass)) {
                        $(this).removeClass(opt.subMenuToggleClass);
                        $(this).css("display", "none");
                        $(this).parent().removeClass(opt.subMenuParentToggle);
                    }
                });
            }

            // Class Set Up for every submenu
            menu.find("." + opt.subMenuParent).each(function () {
                var submenu = $(this).find("ul");
                submenu.addClass(opt.subMenuClass);
                submenu.css("display", "none");
                $(this).addClass(opt.subMenuParent);
                $(this).addClass(opt.thSubMenuParent); // Add th-item-has-children class
                $(this).children("a").append(opt.appendElement);
            });

            // Toggle Submenu
            function toggleDropDown($element) {
                var submenu = $element.children("ul");
                if (submenu.length > 0) {
                    $element.toggleClass(opt.subMenuParentToggle);
                    submenu.slideToggle(opt.toggleSpeed);
                    submenu.toggleClass(opt.subMenuToggleClass);
                }
            }

            // Submenu toggle Button
            var itemHasChildren = "." + opt.thSubMenuParent + " > a";
            $(itemHasChildren).each(function () {
                $(this).on("click", function (e) {
                    e.preventDefault();
                    toggleDropDown($(this).parent());
                });
            });

            // Menu Show & Hide On Toggle Btn click
            $(opt.menuToggleBtn).each(function () {
                $(this).on("click", function () {
                    menuToggle();
                });
            });

            // Hide Menu On outside click
            menu.on("click", function (e) {
                e.stopPropagation();
                menuToggle();
            });

            // Stop Hide full menu on menu click
            menu.find("div").on("click", function (e) {
                e.stopPropagation();
            });
        });
    };
})(jQuery);
function CommonUtil() {
    var me = this;
    var loadedCssMap = {};
    var loadedScriptMap = {};
    this.loadScript = function (url, callback) {
        if (loadedScriptMap[url]) {
            callback();
        } else {
            $.ajax({
                url: url,
                dataType: 'script',
                async: true,
                cache: true
            }).done(function (res) {
                loadedScriptMap[url] = true;
                callback();
            });
        }
    }
    this.loadCss =function (css) {
        if (loadedCssMap[css] == undefined) {
            var styles = document.createElement('link');
            styles.rel = 'stylesheet';
            styles.type = 'text/css';
            styles.media = 'screen';
            styles.href = css;
            document.getElementsByTagName('head')[0].appendChild(styles);
            loadedCssMap[css] = 'loaded';
        }
    }

    this.refreshCaptcha = function() {
        document.getElementById('captchaCodeImg').src = "/oauth/get-captcha?dc=" + new Date().getTime();
    }
    function ApiCallback(func, dynamic) {
        if (func !== null && func !== undefined && func !== "" && typeof func === 'function') {
            var args = [];
            for (var i = 1; i < arguments.length; i++)
                args.push(arguments[i]);
            func.apply(this, args)
        }
    }
    me.genUUID = function (p) {
        var c = 0, i;
        p = (typeof p === "string") ? p : "";
        do {
            i = p + c++;
        } while (document.getElementById(i) !== null);
        return i;
    };
    me.executeAjaxPost = function (url, data, optionCallback) {
        $.ajax({
            type: 'POST',
            url: url,
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data) {
                ApiCallback(optionCallback.success, data);
            },
            error: function (data) {
                ApiCallback(optionCallback.error, data);
            }
        });
    };
    me.executeAjaxGet = function (url, data, optionCallback) {
        var queryString = Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
        }).join('&');
        $.ajax({
            type: 'GET',
            url: url + "?" + queryString,
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                ApiCallback(optionCallback.success, data);
            },
            error: function (data) {
                ApiCallback(optionCallback.error, data);
            }
        });
    };
    me.screen = {};
    me.screen.isMd = function () {
        if ($(window).width() >= 768) {
            return true;
        }
        return false;
    };
    me.screen.isXs = function () {
        if ($(window).width() < 576) {
            return true;
        }
        return false;
    };

    me.analyzeEnviroment = function () {
        var $html = $('html');
        window.isMobile = false;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) { window.isMobile = true; }
        if(window.isMobile){$html.addClass('mobile');}else{$html.addClass('desktop');}
    };
    me.isLoading = function (bool) {
        document.body.style.cursor = bool ? 'progress' : 'default';
    };
}
var COMMON = new CommonUtil();

var uploadFileDropzone;
function SformComponent(){
    var me = this;
    var sformMap = {};
    this.showSform = function($sformContainer) {
        let code = $sformContainer.data('code');
        $.ajax({
            url: 'https://markety.top/api/v0/sform/'+code+'/get-sform',
            type: "GET",
            contentType: "application/json",
            success: function (sformDTO) {
                if (sformDTO.sformid != null) {
                    sformMap[''+sformDTO.sformid] = sformDTO;
                    me.renderLayout(sformDTO,$sformContainer);
                }
            }
        });
    };
    this.renderLayout = function (sformDTO, $sformContainer){
        $sformContainer.empty();
        $sformContainer.attr('sformid',sformDTO.sformid);
        $sformContainer.append('<div class="sform-content-display"></div>');
        var $sformContent = $sformContainer.find('.sform-content-display');
        $sformContent.append(sformDTO.content);
        if ($sformContent.find('.datepicker').length > 0) {
            $sformContent.find('.datepicker').each(function(){
                $(this).flatpickr({
                    enableTime: true,
                    dateFormat: "d/m/Y H:i",
                    minTime: "06:00",
                    maxTime: "22:00"
                });
            });
        }
        if ($sformContent.find('.btn-submit-sform').length == 0) {
            $sformContent.append('<div class="sform-action"><a href="javascript:void(0)" class="btn btn-outline-primary btn-submit-sform px-3">Submit</a></div>');
        }
        $sformContent.find('.btn-submit-sform').on('click',function(){
            console.info('Submitting Sform...');
            var $theContainer = $(this).closest('.sform-content-display').parent();
            var theSform = sformMap[''+$theContainer.attr('sformid')];
            submitSform($theContainer,theSform);
        });
    };

    function submitSform($sformContainer,sformDTO) {
        var $theBtnSubmit = $sformContainer.find('.btn-submit-sform');
        var sformData = me.getSformData($sformContainer,sformDTO);
        if (sformData != null) {
            COMMON.isLoading(true);
            $theBtnSubmit.addClass('disabled');
            $theBtnSubmit.prepend('<span class="spinner spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  ');
            var passageResult = {};
            passageResult['servicenumber'] = window.location.pathname;
            sformData.passageResult = passageResult;
            $.ajax({
                url: '/api/v0/sform/save-sform-data',
                type: "POST",
                data: JSON.stringify(sformData),
                dataType: "json",
                contentType: "application/json",
                success: function (result) {
                    COMMON.isLoading(false);
                    $theBtnSubmit.removeClass('disabled');
                    $theBtnSubmit.find('.spinner').remove();
                    showSaveSformResult($sformContainer,result);
                }
            });
        } else {
            console.info('getSformData is NULL');
        }
    }
    function showSaveSformResult($sformContainer, result) {
        if (result.errorCode == null) {
            if ($sformContainer.data('redirect')) {
                window.location.href = $sformContainer.data('redirect');
            } else {
                //hide if sform is Modal
                if ($('.modal.fade.show').length) {
                    //check response sform-code
                    $('.modal.fade.show').each(function () {
                        if ($(this).find('.sform-container').length) {
                            $(this).modal('hide');
                        }
                    });
                }
                if ($('.sform-alert-modal').length > 0) {
                    $('.sform-alert-modal').modal('show');
                }
                let $sformAction = $sformContainer.find('.sform-action');
                $sformAction.empty();
                $sformAction.append(`
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                              <strong>Thank you for your request. We'll contact to you soon!</strong>.
                              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>`);
            }
        } else {
            console.log(result);
        }
    }

    this.getSformData = function($containercontent, sform) {
        var isValid = true;
        var sformData = {};
        var sformfieldDataArray = [];
        var datafields = sform.sformfields;
        $containercontent.removeClass('was-validated').addClass('was-validated');

        if (datafields != null && datafields.length > 0) {
            for (var i=0;i<datafields.length;i++) {
                var fi = datafields[i];
                var sformfieldData = {};
                sformfieldData.tag = fi.tag;
                sformfieldData.fieldname = fi.fieldname;
                var tagname = fi.tag+'[name="'+fi.fieldname+'"]';
                if (fi.singlevalue) {
                    var $ele = $containercontent.find(tagname);
                    if (fi.tag == 'input') {
                        sformfieldData.type = $ele.attr('type');
                        if ($ele.attr('type') == 'checkbox' || $ele.attr('type') == 'radio') {
                            var elevalue  = $ele.prop('checked') ? $ele.val() : '';
                            sformfieldData.value = elevalue;
                        } else if($ele.attr('type') == 'file' ){
                            var elevalue  = $ele.attr('data-file') ? $ele.attr('data-file') : '';
                            sformfieldData.value = elevalue;
                        } else {
                            sformfieldData.value = $ele.val();
                        }
                    } else {
                        sformfieldData.value = $ele.val();
                    }

                    //validate tag sformField
                    if (!sformfieldData.value && sformfieldData.type != 'checkbox' && sformfieldData.type != 'radio') {
                        isValid = false;
                        if ($($ele.attr('required') == 'required')) {
                            if ($ele.parent().find('.invalid-feedback').length > 0) {
                                $ele.parent().find('.invalid-feedback').removeClass('d-none');
                            } else {
                                $ele.parent().append('<div class="invalid-feedback">Please input...</div>');
                            }
                        } else {
                            $containercontent.find('.sform-action').append(`
                            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                              <strong>Error!</strong>.
                              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>`);
                        }
                    }
                } else {
                    var vs = [];
                    $containercontent.find(tagname).each(function(){
                        if (fi.tag == 'input') {
                            if ($(this).attr('type') == 'checkbox') {
                                var elevalue  = $(this).prop('checked') ? $(this).val() : '';
                                vs.push(elevalue);
                            } else {
                                vs.push($(this).val());
                            }
                        } else {
                            vs.push($(this).val());
                        }
                    });
                    sformfieldData.values = vs;
                }

                sformfieldDataArray.push(sformfieldData);
            }
        }
        if (!isValid) {
            return null;
        }
        sformData.sformid = sform.sformid;
        sformData.code = sform.code;
        sformData.name = sform.name;
        sformData.data = sformfieldDataArray;
        sformData.content = $containercontent.html();
        return sformData;
    }
}
var SFORM_COMPONENT = new SformComponent();
function BlogComponent() {
    var me = this;

    me.buildUID = function ($e) {
        var id = COMMON.genUUID("HEADING");
        $e.attr('id', id);
        return id;
    }

    function generateToc() {
        let htmlToc = '';
        htmlToc += `<ol id="blog-toc-list" class="level1 ">`;
        $(".blog-content").each(function () {
            $(this).find("h2").each(function () {
                var id = $(this).attr('id') || me.buildUID($(this));
                var text = $(this).text();

                htmlToc += '<li class="heading1"><a href="javascript:void(0)" data-action="scroll-to-element" data-target="'+id+'">'+text+'</a>';
                isLevel2 = false;
                isLevel3 = false;

                $(this).nextUntil("h2").each(function () {
                    var id2 = $(this).attr('id') || me.buildUID($(this));
                    var text2 = $(this).text();
                    let e = $(this);
                    if (e[0].localName === "h3") {
                        if (isLevel3) {
                            htmlToc += `</li></ol>`;
                            isLevel2 = false;
                        }
                        if (isLevel2) {
                            htmlToc += `</li>`;
                        }

                        if (!isLevel2) {
                            htmlToc += `<ol class="level2 ">`;
                            isLevel2 = true;
                        }
                        htmlToc += '<li class="heading2"><a href="javascript:void(0)" data-action="scroll-to-element" data-target="'+id2+'">' + text2 + '</a>';
                    }
                    if (e[0].localName === "h4") {
                        if (!isLevel2) {
                            htmlToc += `<ol class="level2"><li class="heading2">`;
                            isLevel3 = false;
                        }
                        if (!isLevel3) {
                            htmlToc += `<ol class="level3 ">`;
                            isLevel3 = true;
                        }
                        htmlToc += '<li class="heading3"><a href="javascript:void(0)" data-action="scroll-to-element" data-target="'+id2+'">'+text2+'</a></li>';
                    }
                });

                if (isLevel3) {
                    htmlToc += `</a></ol>`;
                }

                if (isLevel2) {
                    htmlToc += `</a></li></ol>`;
                }

                htmlToc += "</a></li>";
            });
        });
        htmlToc += '</ol>';
        $('#blog-toc').html(htmlToc);
        if (htmlToc.indexOf('heading1') < 0) {
            $('#blog-toc').css('display', 'none');
        }
    }

    this.apiGetBlogs = function ($element, opt, callback) {
        var ajaxurl = `/ajax/blogs-for-view.html?keyword=${opt.keyword}&maxSize=${opt.maxSize}&layout=${opt.layout}&layoutitem=${opt.layoutitem}&colmd=${opt.colmd}&catids=${opt.catids}`;
        $element.load(ajaxurl, function() {
            if (ENET_LEAD_SERVICE) {
                ENET_LEAD_SERVICE.renderAfterLoadProduct();
            }
            callback();
        });
    };

    this.apiGetSitepages = function ($element, opt, callback) {
        var ajaxurl = `/ajax/sitepages-for-view.html?keyword=${opt.keyword}&maxSize=${opt.maxSize}&layout=${opt.layout}&layoutitem=${opt.layoutitem}&colmd=${opt.colmd}&catids=${opt.catids}`;
        $element.load(ajaxurl, function() {
            if (ENET_LEAD_SERVICE) {
                ENET_LEAD_SERVICE.renderAfterLoadProduct();
            }
            callback();
        });
    };
    this.excuteEvent = function () {
        $('.catalogue-blog.cat-link').on('click',function(){
            $('.catalogue-blog.cat-link').removeClass('active');
            $(this).addClass('active');
            var cat = $(this).data('cat');
            var targetid = $(this).data('targetid');
            var collapseId = targetid;
            if ($('#' + collapseId).length > 0 && !$('#' + collapseId).hasClass('show')) {
                $('#' + collapseId).addClass('show')
            }
        });

        if ($('.nav-tabs').has('.catalogue.cat-link').length > 0) {
            $('.nav-tabs').has('.catalogue.cat-link').each(function () {
                var $ele = $($(this).find('.catalogue.cat-link:first'));
                $ele.addClass('active');
            });
        }

        $('.catalogue-blog.cat-link-mobile').on('click',function(){
            $('.catalogue-blog.cat-link-mobile').removeClass('active');
            $(this).addClass('active');
        });
    };
    this.renderLayout = function (){
        if ($('#blog-toc').length) {
            generateToc();
        }
        if ($('.enet-ajax-load-blogs').length) {
            $('.enet-ajax-load-blogs').each(function (i) {
                let keyword = $(this).data('enet-keyword') || '';
                let layout = $(this).data('enet-layout');
                let layoutitem = $(this).data('enet-layoutitem');
                let colmd = $(this).data('enet-colmd') || 3;
                let catids = $(this).data('enet-catids') || '';
                me.apiGetBlogs($(this), {
                        'keyword': keyword,
                        'maxSize': 8,
                        'layout': layout,
                        'layoutitem': layoutitem,
                        'colmd': colmd,
                        'catids': catids,
                    }, function () {
                        me.excuteEvent();
                    }
                );
            });
        }

        if ($('.enet-ajax-load-sitepages').length) {
            $('.enet-ajax-load-sitepages').each(function (i) {
                let keyword = $(this).data('enet-keyword');
                let layout = $(this).data('enet-layout');
                let layoutitem = $(this).data('enet-layoutitem');
                let colmd = $(this).data('enet-colmd');
                let catids = $(this).data('enet-catids');
                me.apiGetSitepages($(this), {
                        'keyword': keyword,
                        'maxSize': 8,
                        'layout': layout,
                        'layoutitem': layoutitem,
                        'colmd': colmd,
                        'catids': catids,
                    }, function () {
                    me.excuteEvent();
                    }
                );
            });
        }
    };

    this.isInitialize = function () {
        if ($('#blog-toc').length) {
            return true;
        }
        if ($('.enet-ajax-load-blogs').length) {
            return true;
        }
        if ($('.enet-ajax-load-sitepages').length) {
            return true;
        }
        return false;
    };
    this.init = function () {
        me.renderLayout();
    };
}
var BLOG_COMPONENT = new BlogComponent();
function EnetLeadService(){
    var me  = this;
    this.initialize = function(callback) {
        _initFlaticon();
        _initLayout();
        if($(".swiper-js-container").length) {
            COMMON.loadCss('/static/vendor/swiper/css/swiper.min.css');
            COMMON.loadScript('/static/vendor/swiper/js/swiper.min.js',function(){
                var $swiperContainer = $(".swiper-js-container");
                if ($swiperContainer.length) {
                    $swiperContainer.each(function(i, swiperContainer) {
                        _initSwiper($(swiperContainer));
                    });
                }
            });
        }
        _initSlick();
        _initAnimation();
        _initTooltip();
        callback();
    };
    function _initFlaticon() {
        if ($('i[class*=flaticon]').length) {
            COMMON.loadCss('/static/salon/flaticon/font/flaticon.css');
        }
    };
    function _initSwiper($this) {
        var $el = $this.find('.swiper-container'),
            pagination = $this.find('.swiper-pagination'),
            navNext = $this.find('.swiper-button-next'),
            navPrev = $this.find('.swiper-button-prev');
        var effect = $el.data('swiper-effect') ? $el.data('swiper-effect') : 'slide',
            direction = $el.data('swiper-direction') ? $el.data('swiper-direction') :  'horizontal',
            initialSlide = $el.data('swiper-initial-slide') ? $el.data('swiper-initial-slide') : 0,
            autoHeight = $el.data('swiper-autoheight') ? $el.data('swiper-autoheight') : false,
            autoplay = $el.data('swiper-autoplay') ? $el.data('swiper-autoplay') : false,
            centeredSlides = $el.data('swiper-centered-slides') ? $el.data('swiper-centered-slides') : false,
            paginationType = $el.data('swiper-pagination-type') ? $el.data('swiper-pagination-type') : 'bullets';
        var items = $el.data('swiper-items');
        var itemsSm = $el.data('swiper-sm-items');
        var itemsMd = $el.data('swiper-md-items');
        var itemsLg = $el.data('swiper-lg-items');
        var itemsXl = $el.data('swiper-xl-items');

        var rowitems = $el.data('swiper-row-items');
        var rowitemsSm = $el.data('swiper-sm-row-items');
        var rowitemsMd = $el.data('swiper-md-row-items');
        var rowitemsLg = $el.data('swiper-lg-row-items');
        var rowitemsXl = $el.data('swiper-xl-row-items');

        var spaceBetween = $el.data('swiper-space-between');
        var spaceBetweenSm = $el.data('swiper-sm-space-between');
        var spaceBetweenMd = $el.data('swiper-md-space-between');
        var spaceBetweenLg = $el.data('swiper-lg-space-between');
        var spaceBetweenXl = $el.data('swiper-xl-space-between');

        rowitems = rowitems ? rowitems : 1;
        rowitemsSm = rowitemsSm ? rowitemsSm : rowitems;
        rowitemsMd = rowitemsMd ? rowitemsMd : rowitemsSm;
        rowitemsLg = rowitemsLg ? rowitemsLg : rowitemsMd;
        rowitemsXl = rowitemsXl ? rowitemsXl : rowitemsLg;
        
        items = items ? items : 1;
        itemsSm = itemsSm ? itemsSm : items;
        itemsMd = itemsMd ? itemsMd : itemsSm;
        itemsLg = itemsLg ? itemsLg : itemsMd;
        itemsXl = itemsXl ? itemsXl : itemsLg;

        spaceBetween = !spaceBetween ? 0 : spaceBetween;
        spaceBetweenSm = !spaceBetweenSm ? spaceBetween : spaceBetweenSm;
        spaceBetweenMd = !spaceBetweenMd ? spaceBetweenSm : spaceBetweenMd;
        spaceBetweenLg = !spaceBetweenLg ? spaceBetweenMd : spaceBetweenLg;
        spaceBetweenXl = !spaceBetweenXl ? spaceBetweenLg : spaceBetweenXl;

        var $swiper = new Swiper($el, {
            loop: true,
            pagination: {
                el: pagination,
                clickable: true,
                type: paginationType
            },
            navigation: {
                nextEl: navNext,
                prevEl: navPrev,
            },
            slidesPerView: items,
            spaceBetween: spaceBetween,
            initialSlide: initialSlide,
            autoHeight: autoHeight,
            centeredSlides: centeredSlides,
            mousewheel: false,
            keyboard: {
                enabled: true,
                onlyInViewport: false,
            },
            grabCursor: true,
            autoplay: autoplay,
            effect: effect,
            coverflowEffect: {
                rotate: 10,
                stretch: 0,
                depth: 50,
                modifier: 3,
                slideShadows: false
            },
            speed: 800,
            direction: direction,
            preventClicks: true,
            preventClicksPropagation: true,
            observer: true,
            observeParents: true,
            breakpointsInverse: true,
            breakpoints: {
                575: {
                    slidesPerView: itemsSm,
                    slidesPerColumn: rowitemsSm,
                    spaceBetweenSlides: spaceBetweenSm
                },
                767: {
                    slidesPerView: itemsMd,
                    slidesPerColumn: rowitemsMd,
                    spaceBetweenSlides: spaceBetweenMd
                },
                991: {
                    slidesPerView: itemsLg,
                    slidesPerColumn: rowitemsLg,
                    spaceBetweenSlides: spaceBetweenLg
                },
                1199: {
                    slidesPerView: itemsXl,
                    slidesPerColumn: rowitemsXl,
                    spaceBetweenSlides: spaceBetweenXl
                }
            }
        });
    }

    function _initSlick() {
        if ($(".th-carousel").length > 0) {
            COMMON.loadCss('/static/salon/css/slick.min.css');
            COMMON.loadScript('/static/salon/js/slick.min.js',function(){
                $(".th-carousel").each(function () {
                    var asSlide = $(this);
                    function d(data) {
                        return asSlide.data(data);
                    }

                    // Custom Arrow Button
                    var prevButton =
                            '<button type="button" class="slick-prev"><i class="bi bi-arrow-left"></i></button>',
                        nextButton =
                            '<button type="button" class="slick-next"><i class="bi bi-arrow-right"></i></button>';

                    // Function For Custom Arrow Btn
                    $("[data-slick-next]").each(function () {
                        $(this).on("click", function (e) {
                            e.preventDefault();
                            $($(this).data("slick-next")).slick("slickNext");
                        });
                    });

                    $("[data-slick-prev]").each(function () {
                        $(this).on("click", function (e) {
                            e.preventDefault();
                            $($(this).data("slick-prev")).slick("slickPrev");
                        });
                    });

                    // Check for arrow wrapper
                    if (d("arrows") == true) {
                        if (!asSlide.closest(".arrow-wrap").length) {
                            asSlide.closest(".container").parent().addClass("arrow-wrap");
                        }
                    }

                    asSlide.slick({
                        dots: d("dots") ? true : false,
                        fade: d("fade") ? true : false,
                        arrows: d("arrows") ? true : false,
                        speed: d("speed") ? d("speed") : 1000,
                        asNavFor: d("asnavfor") ? d("asnavfor") : false,
                        autoplay: d("autoplay") == false ? false : true,
                        infinite: d("infinite") == false ? false : true,
                        slidesToShow: d("slide-show") ? d("slide-show") : 1,
                        adaptiveHeight: d("adaptive-height") ? true : false,
                        centerMode: d("center-mode") ? true : false,
                        autoplaySpeed: d("autoplay-speed") ? d("autoplay-speed") : 8000,
                        centerPadding: d("center-padding") ? d("center-padding") : "0",
                        focusOnSelect: d("focuson-select") == false ? false : true,
                        pauseOnFocus: d("pauseon-focus") ? true : false,
                        pauseOnHover: d("pauseon-hover") ? true : false,
                        variableWidth: d("variable-width") ? true : false,
                        vertical: d("vertical") ? true : false,
                        verticalSwiping: d("vertical") ? true : false,
                        prevArrow: d("prev-arrow") ?
                            prevButton : '<button type="button" class="slick-prev"><i class="bi bi-arrow-left"></i></button>',
                        nextArrow: d("next-arrow") ?
                            nextButton : '<button type="button" class="slick-next"><i class="bi bi-arrow-right"></i></button>',
                        rtl: $("html").attr("dir") == "rtl" ? true : false,
                        responsive: [{
                            breakpoint: 1600,
                            settings: {
                                arrows: d("xl-arrows") ? true : false,
                                dots: d("xl-dots") ? true : false,
                                slidesToShow: d("xl-slide-show") ?
                                    d("xl-slide-show") : d("slide-show"),
                                centerMode: d("xl-center-mode") ? true : false,
                                centerPadding: "0",
                            },
                        },
                            {
                                breakpoint: 1400,
                                settings: {
                                    arrows: d("ml-arrows") ? true : false,
                                    dots: d("ml-dots") ? true : false,
                                    slidesToShow: d("ml-slide-show") ?
                                        d("ml-slide-show") : d("slide-show"),
                                    centerMode: d("ml-center-mode") ? true : false,
                                    centerPadding: 0,
                                },
                            },
                            {
                                breakpoint: 1200,
                                settings: {
                                    arrows: d("lg-arrows") ? true : false,
                                    dots: d("lg-dots") ? true : false,
                                    slidesToShow: d("lg-slide-show") ?
                                        d("lg-slide-show") : d("slide-show"),
                                    centerMode: d("lg-center-mode") ?
                                        d("lg-center-mode") : false,
                                    centerPadding: 0,
                                },
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    arrows: d("md-arrows") ? true : false,
                                    dots: d("md-dots") ? true : false,
                                    slidesToShow: d("md-slide-show") ?
                                        d("md-slide-show") : 1,
                                    centerMode: d("md-center-mode") ?
                                        d("md-center-mode") : false,
                                    centerPadding: 0,
                                },
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    arrows: d("sm-arrows") ? true : false,
                                    dots: d("sm-dots") ? true : false,
                                    slidesToShow: d("sm-slide-show") ?
                                        d("sm-slide-show") : 1,
                                    centerMode: d("sm-center-mode") ?
                                        d("sm-center-mode") : false,
                                    centerPadding: 0,
                                },
                            },
                            {
                                breakpoint: 576,
                                settings: {
                                    arrows: d("xs-arrows") ? true : false,
                                    dots: d("xs-dots") ? true : false,
                                    slidesToShow: d("xs-slide-show") ?
                                        d("xs-slide-show") : 1,
                                    centerMode: d("xs-center-mode") ?
                                        d("xs-center-mode") : false,
                                    centerPadding: 0,
                                },
                            },
                            // You can unslick at a given breakpoint now by adding:
                            // settings: "unslick"
                            // instead of a settings object
                        ],
                    });
                });
            });
        }
    }
    function _initTooltip() {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        });
    }
    function _initAnimation() {
        function scrollTrigger(selector, options = {}) {
            let els = document.querySelectorAll(selector)
            els = Array.from(els)
            els.forEach(el => {
                addObserver(el, options)
            })
        }

        function addObserver(el, options) {
            let observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting) {
                        entry.target.classList.add(entry.target.dataset['enetAnimationtype']);
                        observer.unobserve(entry.target)
                    }
                })
            }, options)
            observer.observe(el)
        }

        $('.animate__animated').each(function (i) {
            var isNotAnimationTypes = ['animate__animated',
                'animate__infinite',
                'animate__delay-1s', 'animate__delay-2s',
                'animate__slow','animate__fast'];
            let $element =$($('.animate__animated')[i]);
            let arr = $element.attr('class').split(' ');
            arr.forEach(function (classItem) {
                if (!isNotAnimationTypes.includes(classItem) && classItem.indexOf("animate__") >= 0) {
                    $element.attr('data-enet-animationtype', classItem);
                    $element.removeClass(classItem);
                }
            });
        });

        scrollTrigger('.animate__animated');
    }
    function _initThSticky() {
        var topPos = $(this).scrollTop();
        sticky();
        if (topPos > 150) {
            $('.sticky-wrapper').addClass('will-sticky')
            sticky()
        } else {
            $('.sticky-wrapper').removeClass('sticky')
            $('.sticky-wrapper').removeClass('will-sticky')
        }

        function sticky() {
            if (topPos > 400) {
                $('.sticky-wrapper').addClass('sticky')
                $('.sticky-wrapper').removeClass('will-sticky')
            }
        }
    }

    function _initLayout() {
        if ($("[data-bg-src]").length > 0) {
            $("[data-bg-src]").each(function () {
                var src = $(this).attr("data-bg-src");
                $(this).css("background-image", "url(" + src + ")");
                $(this).removeAttr("data-bg-src").addClass("background-image");
            });
        }
        if ($('.scroll-top').length > 0) {
            var scrollTopbtn = document.querySelector('.scroll-top');
            var progressPath = document.querySelector('.scroll-top path');
            var pathLength = progressPath.getTotalLength();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
            progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
            var updateProgress = function () {
                var scroll = $(window).scrollTop();
                var height = $(document).height() - $(window).height();
                var progress = pathLength - (scroll * pathLength / height);
                progressPath.style.strokeDashoffset = progress;
            }
            updateProgress();
            $(window).scroll(updateProgress);
            var offset = 50;
            var duration = 750;
            jQuery(window).on('scroll', function () {
                if (jQuery(this).scrollTop() > offset) {
                    jQuery(scrollTopbtn).addClass('show');
                    $('.th-header .sticky-active').addClass('sticky');
                } else {
                    jQuery(scrollTopbtn).removeClass('show');
                    $('.th-header .sticky-active').removeClass('sticky');
                }
                _initThSticky();
            });
            jQuery(scrollTopbtn).on('click', function (event) {
                event.preventDefault();
                jQuery('html, body').animate({
                    scrollTop: 0
                }, duration);
                return false;
            })
        }
        _initShape();
        _initOdometer();
        _initCountdown();
        _onePageNav('.onepage-nav');
        _onePageNav('.scroll-down');
    }
    function _onePageNav(element) {
        if ($(element).length > 0) {
            $(element).each(function () {
                var link = $(this).find('a');
                $(this).find(link).each(function () {
                    $(this).on('click', function () {
                        var target = $(this.getAttribute('href'));
                        if (target.length) {
                            event.preventDefault();
                            $('html, body').stop().animate({
                                scrollTop: target.offset().top - 10
                            }, 1000);
                        };

                    });
                });
            })
        }
    }
    function _initShape() {
        if ($(".shape-mockup").length) {
            console.info('Has _initShape');
            $(".shape-mockup").each(function () {
                var $currentShape = $(this),
                    shapeTop = $currentShape.data("top"),
                    shapeRight = $currentShape.data("right"),
                    shapeBottom = $currentShape.data("bottom"),
                    shapeLeft = $currentShape.data("left");
                $currentShape
                    .css({
                        top: shapeTop,
                        right: shapeRight,
                        bottom: shapeBottom,
                        left: shapeLeft,
                    })
                    .removeAttr("data-top")
                    .removeAttr("data-right")
                    .removeAttr("data-bottom")
                    .removeAttr("data-left")
                    .parent()
                    .addClass("shape-mockup-wrap");
                });
        }
    }
    function _initOdometer() {
        if ($(".odometer").length) {
            COMMON.loadScript('/static/vendor/odometer.js',function (){
                $(".odometer").appear();
                $(document.body).on("appear", ".odometer", function (e) {
                    var odo = $(".odometer");
                    odo.each(function () {
                        var countNumber = $(this).attr("data-count");
                        $(this).html(countNumber);
                    });
                    window.odometerOptions = {
                        format: "d",
                    };
                });
            });
        }
    }
    function _initCountdown() {
        if ($(".counter-list").length) {
            $(".counter-list").each(function () {
                var $counter = $(this),
                    countDownDate = new Date($counter.data("offer-date")).getTime(), // Set the date we're counting down toz
                    exprireCls = "expired";

                // Finding Function
                function s$(element) {
                    return $counter.find(element);
                }

                // Update the count down every 1 second
                var counter = setInterval(function () {
                    // Get today's date and time
                    var now = new Date().getTime();

                    // Find the distance between now and the count down date
                    var distance = countDownDate - now;

                    // Time calculations for days, hours, minutes and seconds
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    var hours = Math.floor(
                        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                    );
                    var minutes = Math.floor(
                        (distance % (1000 * 60 * 60)) / (1000 * 60)
                    );
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    // Check If value is lower than ten, so add zero before number
                    days < 10 ? (days = "0" + days) : null;
                    hours < 10 ? (hours = "0" + hours) : null;
                    minutes < 10 ? (minutes = "0" + minutes) : null;
                    seconds < 10 ? (seconds = "0" + seconds) : null;

                    // If the count down is over, write some text
                    if (distance < 0) {
                        clearInterval(counter);
                        $counter.addClass(exprireCls);
                        $counter.find(".message").css("display", "block");
                    } else {
                        // Output the result in elements
                        s$(".day").html(days);
                        s$(".hour").html(hours);
                        s$(".minute").html(minutes);
                        s$(".seconds").html(seconds);
                    }
                }, 1000);
            });
        }

    }

    this.validateEmail = function(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
}

var ENET_LEAD_SERVICE = new EnetLeadService();

$(document).ready(function() {
    let nonejs = (window.location.href.indexOf('nonejs') > -1);
    if (nonejs) {
        return;
    }
    COMMON.analyzeEnviroment();
    var loadMode = $('#load-mode').html() || '';
    window.currentMode = loadMode;
    BLOG_COMPONENT.isInitialize();
    ENET_LEAD_SERVICE.initialize(function(){
        if ($('.sform-container').length) {
            $('.sform-container').each(function () {
                let $ele = $(this);
                SFORM_COMPONENT.showSform($ele);
            });
        }
        if ($(".preloader").length > 0) {
            $(".preloader").css("display", "none");
        }
    });
    
    if ($(".th-menu-wrapper").length) {
        $(".th-menu-wrapper").thmobilemenu();
    }
    if ($(".appointment-sec").length) {
        var $theContainer = $(".appointment-sec");
        var stakeholdercode = $('.stakeholder-code').html();
        MAKE_RESERVATION.initContent(stakeholdercode,$theContainer);
    }
});

