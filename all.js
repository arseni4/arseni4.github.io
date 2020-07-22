function t228_highlight() {
    var url = window.location.href;
    var pathname = window.location.pathname;
    if (url.substr(url.length - 1) == "/") {
        url = url.slice(0, -1)
    }
    if (pathname.substr(pathname.length - 1) == "/") {
        pathname = pathname.slice(0, -1)
    }
    if (pathname.charAt(0) == "/") {
        pathname = pathname.slice(1)
    }
    if (pathname == "") {
        pathname = "/"
    }
    $(".t228__list_item a[href='" + url + "']").addClass("t-active");
    $(".t228__list_item a[href='" + url + "/']").addClass("t-active");
    $(".t228__list_item a[href='" + pathname + "']").addClass("t-active");
    $(".t228__list_item a[href='/" + pathname + "']").addClass("t-active");
    $(".t228__list_item a[href='" + pathname + "/']").addClass("t-active");
    $(".t228__list_item a[href='/" + pathname + "/']").addClass("t-active")
}

function t228_checkAnchorLinks(recid) {
    if ($(window).width() >= 960) {
        var t228_navLinks = $("#rec" + recid + " .t228__list_item a:not(.tooltipstered)[href*='#']");
        if (t228_navLinks.length > 0) {
            setTimeout(function() {
                t228_catchScroll(t228_navLinks)
            }, 500)
        }
    }
}

function t228_catchScroll(t228_navLinks) {
    var t228_clickedSectionId = null,
        t228_sections = new Array(),
        t228_sectionIdTonavigationLink = [],
        t228_interval = 100,
        t228_lastCall, t228_timeoutId;
    t228_navLinks = $(t228_navLinks.get().reverse());
    t228_navLinks.each(function() {
        var t228_cursection = t228_getSectionByHref($(this));
        if (typeof t228_cursection.attr("id") != "undefined") {
            t228_sections.push(t228_cursection)
        }
        t228_sectionIdTonavigationLink[t228_cursection.attr("id")] = $(this)
    });
    t228_updateSectionsOffsets(t228_sections);
    t228_sections.sort(function(a, b) {
        return b.attr("data-offset-top") - a.attr("data-offset-top")
    });
    $(window).bind('resize', t_throttle(function() {
        t228_updateSectionsOffsets(t228_sections)
    }, 200));
    $('.t228').bind('displayChanged', function() {
        t228_updateSectionsOffsets(t228_sections)
    });
    setInterval(function() {
        t228_updateSectionsOffsets(t228_sections)
    }, 5000);
    t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);
    t228_navLinks.click(function() {
        var t228_clickedSection = t228_getSectionByHref($(this));
        if (!$(this).hasClass("tooltipstered") && typeof t228_clickedSection.attr("id") != "undefined") {
            t228_navLinks.removeClass('t-active');
            $(this).addClass('t-active');
            t228_clickedSectionId = t228_getSectionByHref($(this)).attr("id")
        }
    });
    $(window).scroll(function() {
        var t228_now = new Date().getTime();
        if (t228_lastCall && t228_now < (t228_lastCall + t228_interval)) {
            clearTimeout(t228_timeoutId);
            t228_timeoutId = setTimeout(function() {
                t228_lastCall = t228_now;
                t228_clickedSectionId = t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId)
            }, t228_interval - (t228_now - t228_lastCall))
        } else {
            t228_lastCall = t228_now;
            t228_clickedSectionId = t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId)
        }
    })
}

function t228_updateSectionsOffsets(sections) {
    $(sections).each(function() {
        var t228_curSection = $(this);
        t228_curSection.attr("data-offset-top", t228_curSection.offset().top)
    })
}

function t228_getSectionByHref(curlink) {
    var t228_curLinkValue = curlink.attr('href').replace(/\s+/g, '').replace(/.*#/, '');
    if (curlink.is('[href*="#rec"]')) {
        return $(".r[id='" + t228_curLinkValue + "']")
    } else {
        return $(".r[data-record-type='215']").has("a[name='" + t228_curLinkValue + "']")
    }
}

function t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId) {
    var t228_scrollPosition = $(window).scrollTop(),
        t228_valueToReturn = t228_clickedSectionId;
    if (t228_sections.length != 0 && t228_clickedSectionId == null && t228_sections[t228_sections.length - 1].attr("data-offset-top") > (t228_scrollPosition + 300)) {
        t228_navLinks.removeClass('t-active');
        return null
    }
    $(t228_sections).each(function(e) {
        var t228_curSection = $(this),
            t228_sectionTop = t228_curSection.attr("data-offset-top"),
            t228_id = t228_curSection.attr('id'),
            t228_navLink = t228_sectionIdTonavigationLink[t228_id];
        if (((t228_scrollPosition + 300) >= t228_sectionTop) || (t228_sections[0].attr("id") == t228_id && t228_scrollPosition >= $(document).height() - $(window).height())) {
            if (t228_clickedSectionId == null && !t228_navLink.hasClass('t-active')) {
                t228_navLinks.removeClass('t-active');
                t228_navLink.addClass('t-active');
                t228_valueToReturn = null
            } else {
                if (t228_clickedSectionId != null && t228_id == t228_clickedSectionId) {
                    t228_valueToReturn = null
                }
            }
            return !1
        }
    });
    return t228_valueToReturn
}

function t228_setPath() {}

function t228_setWidth(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t228").each(function() {
            var el = $(this);
            var left_exist = el.find('.t228__leftcontainer').length;
            var left_w = el.find('.t228__leftcontainer').outerWidth(!0);
            var max_w = left_w;
            var right_exist = el.find('.t228__rightcontainer').length;
            var right_w = el.find('.t228__rightcontainer').outerWidth(!0);
            var items_align = el.attr('data-menu-items-align');
            if (left_w < right_w) max_w = right_w;
            max_w = Math.ceil(max_w);
            var center_w = 0;
            el.find('.t228__centercontainer').find('li').each(function() {
                center_w += $(this).outerWidth(!0)
            });
            var padd_w = 40;
            var maincontainer_width = el.find(".t228__maincontainer").outerWidth();
            if (maincontainer_width - max_w * 2 - padd_w * 2 > center_w + 20) {
                if (items_align == "center" || typeof items_align === "undefined") {
                    el.find(".t228__leftside").css("min-width", max_w + "px");
                    el.find(".t228__rightside").css("min-width", max_w + "px");
                    el.find(".t228__list").removeClass("t228__list_hidden")
                }
            } else {
                el.find(".t228__leftside").css("min-width", "");
                el.find(".t228__rightside").css("min-width", "")
            }
        })
    }
}

function t228_setBg(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t228").each(function() {
            var el = $(this);
            if (el.attr('data-bgcolor-setbyscript') == "yes") {
                var bgcolor = el.attr("data-bgcolor-rgba");
                el.css("background-color", bgcolor)
            }
        })
    } else {
        $(".t228").each(function() {
            var el = $(this);
            var bgcolor = el.attr("data-bgcolor-hex");
            el.css("background-color", bgcolor);
            el.attr("data-bgcolor-setbyscript", "yes")
        })
    }
}

function t228_appearMenu(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t228").each(function() {
            var el = $(this);
            var appearoffset = el.attr("data-appearoffset");
            if (appearoffset != "") {
                if (appearoffset.indexOf('vh') > -1) {
                    appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)))
                }
                appearoffset = parseInt(appearoffset, 10);
                if ($(window).scrollTop() >= appearoffset) {
                    if (el.css('visibility') == 'hidden') {
                        el.finish();
                        el.css("top", "-50px");
                        el.css("visibility", "visible");
                        var topoffset = el.data('top-offset');
                        if (topoffset && parseInt(topoffset) > 0) {
                            el.animate({
                                "opacity": "1",
                                "top": topoffset + "px"
                            }, 200, function() {})
                        } else {
                            el.animate({
                                "opacity": "1",
                                "top": "0px"
                            }, 200, function() {})
                        }
                    }
                } else {
                    el.stop();
                    el.css("visibility", "hidden");
                    el.css("opacity", "0")
                }
            }
        })
    }
}

function t228_changebgopacitymenu(recid) {
    var window_width = $(window).width();
    if (window_width > 980) {
        $(".t228").each(function() {
            var el = $(this);
            var bgcolor = el.attr("data-bgcolor-rgba");
            var bgcolor_afterscroll = el.attr("data-bgcolor-rgba-afterscroll");
            var bgopacityone = el.attr("data-bgopacity");
            var bgopacitytwo = el.attr("data-bgopacity-two");
            var menushadow = el.attr("data-menushadow");
            if (menushadow == '100') {
                var menushadowvalue = menushadow
            } else {
                var menushadowvalue = '0.' + menushadow
            }
            if ($(window).scrollTop() > 20) {
                el.css("background-color", bgcolor_afterscroll);
                if (bgopacitytwo == '0' || (typeof menushadow == "undefined" && menushadow == !1)) {
                    el.css("box-shadow", "none")
                } else {
                    el.css("box-shadow", "0px 1px 3px rgba(0,0,0," + menushadowvalue + ")")
                }
            } else {
                el.css("background-color", bgcolor);
                if (bgopacityone == '0.0' || (typeof menushadow == "undefined" && menushadow == !1)) {
                    el.css("box-shadow", "none")
                } else {
                    el.css("box-shadow", "0px 1px 3px rgba(0,0,0," + menushadowvalue + ")")
                }
            }
        })
    }
}

function t228_createMobileMenu(recid) {
    var window_width = $(window).width(),
        el = $("#rec" + recid),
        menu = el.find(".t228"),
        burger = el.find(".t228__mobile");
    burger.click(function(e) {
        menu.fadeToggle(300);
        $(this).toggleClass("t228_opened")
    })
    $(window).bind('resize', t_throttle(function() {
        window_width = $(window).width();
        if (window_width > 980) {
            menu.fadeIn(0)
        }
    }, 200))
}

function t410_init(recid) {
    var el = $('#rec' + recid);
    var firstimgurl = el.find(".t410__wrapper").attr("data-juxtapose-imgurl-first");
    var firstimgdescr = el.find(".t410__wrapper").attr("data-juxtapose-imgdescr-first");
    var firstimgalt = el.find(".t410__wrapper").attr("data-juxtapose-imgalt-first");
    var secondimgurl = el.find(".t410__wrapper").attr("data-juxtapose-imgurl-second");
    var secondimgdescr = el.find(".t410__wrapper").attr("data-juxtapose-imgdescr-second");
    var secondimgalt = el.find(".t410__wrapper").attr("data-juxtapose-imgalt-second");
    new juxtapose.JXSlider('#t410-juxtapose__' + recid + '', [{
        src: firstimgurl,
        label: firstimgdescr
    }, {
        src: secondimgurl,
        label: secondimgdescr
    }], {
        animate: !1,
        showLabels: !0,
        showCredits: !1,
        startingPosition: '50%',
        makeResponsive: !0,
        callback: function() {
            if (firstimgalt.length > 0) {
                el.find('.t410__wrapper .jx-image.jx-left img').attr('alt', firstimgalt)
            }
            if (secondimgalt.length > 0) {
                el.find('.t410__wrapper .jx-image.jx-right img').attr('alt', secondimgalt)
            }
            if (window.$isMobile) {
                el.find('.t410__wrapper').append('<div class="t410__mobile_left"></div><div class="t410__mobile_right"></div>');
                var hanlerWidth = el.find('.jx-handle').width(),
                    leftSide = el.find('.jx-image.jx-left'),
                    rightSide = el.find('.jx-image.jx-right'),
                    leftWidth = leftSide.width() - hanlerWidth / 2,
                    rightWidth = rightSide.width() - hanlerWidth / 2,
                    wrapper = el.find('.t410__wrapper'),
                    mobileLeft = el.find('.t410__mobile_left'),
                    mobileRight = el.find('.t410__mobile_right');
                mobileLeft.css('width', leftWidth);
                mobileRight.css('width', rightWidth);
                wrapper.on('touchend', function() {
                    leftWidth = leftSide.width() - hanlerWidth / 2;
                    rightWidth = rightSide.width() - hanlerWidth / 2;
                    mobileLeft.css('width', leftWidth);
                    mobileRight.css('width', rightWidth)
                })
            }
        }
    })
}

function t418_checkSize(recid) {
    var el = $("#rec" + recid);
    var sizer = el.find('.t418__height');
    var height = sizer.height();
    var width = sizer.width();
    var ratio = width / height;
    var gallerywrapper = el.find(".t418__checksize");
    var gallerywidth = gallerywrapper.width();
    gallerywrapper.css({
        'height': ((gallerywidth / ratio) + 'px')
    });
    var maxwidth = el.find(".t418__height").width();
    var windowwidth = $(window).width();
    var value = windowwidth - 80;
    if (maxwidth > windowwidth) {
        el.find(".t418__item").css("max-width", value + "px");
        el.find(".t418__img").css("left", "20px");
        el.find(".t418__img").css("right", "20px")
    } else {
        el.find(".t418__item").css("max-width", "");
        el.find(".t418__img").css("left", "");
        el.find(".t418__img").css("right", "")
    }
}

function t418_init(recid) {
    var el = $('#rec' + recid);
    var pos = 0;
    var t418_doResize;
    var totalSlides = el.find('.t418__item').length;
    var sliderWidth = el.find('.t418__item').width();
    $(window).resize(function() {
        if (t418_doResize) clearTimeout(t418_doResize);
        t418_doResize = setTimeout(function() {
            sliderWidth = el.find('.t418__item').width();
            el.find('.t418__slidecontainer').width(sliderWidth * totalSlides);
            console.log(sliderWidth)
        }, 200)
    });
    el.find('.t418__slidecontainer').width(sliderWidth * totalSlides);
    el.find('.t418__next').click(function() {
        slideRight(recid)
    });
    el.find('.t418__previous').click(function() {
        slideLeft(recid)
    });

    function slideLeft(recid) {
        var el = $('#rec' + recid);
        pos--;
        if (pos == -1) {
            pos = totalSlides - 1
        }
        el.find('.t418__slidecontainer').css({
            transform: 'translate(-' + (sliderWidth * pos) + 'px, 0)'
        })
        el.find('.t418__slidecontainer').css("transition-duration", ".3s");
        if (window.lazy == 'y') {
            t_lazyload_update()
        }
    }

    function slideRight(recid) {
        var el = $('#rec' + recid);
        pos++;
        if (pos == totalSlides) {
            pos = 0
        }
        el.find('.t418__slidecontainer').css({
            transform: 'translate(-' + (sliderWidth * pos) + 'px, 0)'
        })
        el.find('.t418__slidecontainer').css("transition-duration", ".3s");
        if (window.lazy == 'y') {
            t_lazyload_update()
        }
    }
    var swipeOptions = {
        triggerOnTouchEnd: !0,
        swipeStatus: swipeStatus,
        allowPageScroll: "vertical",
        threshold: 75
    };
    el.find(".t418__slidecontainer").swipe(swipeOptions);
    el.find(".t418__slidecontainer").swipe({
        tap: function(event, target) {
            slideRight(recid)
        }
    });

    function swipeStatus(event, phase, direction, distance) {
        if (phase == "move" && (direction == "left" || direction == "right")) {
            var duration = 0;
            if (direction == "left") {
                scrollImages((sliderWidth * pos) + distance, duration)
            } else if (direction == "right") {
                scrollImages((sliderWidth * pos) - distance, duration)
            }
        } else if (phase == "cancel") {
            scrollImages(sliderWidth * pos)
        } else if (phase == "end") {
            if (direction == "right") {
                slideLeft(recid)
            } else if (direction == "left") {
                slideRight(recid)
            }
        }
    }

    function scrollImages(distance, duration) {
        el.find(".t418__slidecontainer").css("transition-duration", (duration / 1000).toFixed(1) + "s");
        var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
        el.find(".t418__slidecontainer").css("transform", "translate(" + value + "px, 0)")
    }
}

function t570_init(recid) {
    if ($(window).width() > 750) {
        t570_setMapHeight(recid);
        $(window).load(function() {
            t570_setMapHeight(recid)
        });
        $(window).resize(function() {
            t570_setMapHeight(recid)
        })
    }
}

function t570_setMapHeight(recid) {
    var t570__el = $('#rec' + recid),
        t570__map = t570__el.find('.t-map');
    var t570__textwrapper = t570__el.find('.t570__col_text').height();
    t570__map.css('height', t570__textwrapper).trigger('sizechange')
}

function t585_init(recid) {
    var el = $('#rec' + recid),
        toggler = el.find(".t585__header");
    toggler.click(function() {
        $(this).toggleClass("t585__opened");
        $(this).next().slideToggle();
        if (window.lazy == 'y') {
            t_lazyload_update()
        }
    })
}

function t696_onSuccess(t696_form) {
    var t696_inputsWrapper = t696_form.find('.t-form__inputsbox');
    var t696_inputsHeight = t696_inputsWrapper.height();
    var t696_inputsOffset = t696_inputsWrapper.offset().top;
    var t696_inputsBottom = t696_inputsHeight + t696_inputsOffset;
    var t696_targetOffset = t696_form.find('.t-form__successbox').offset().top;
    if ($(window).width() > 960) {
        var t696_target = t696_targetOffset - 200
    } else {
        var t696_target = t696_targetOffset - 100
    }
    if (t696_targetOffset > $(window).scrollTop() || ($(document).height() - t696_inputsBottom) < ($(window).height() - 100)) {
        t696_inputsWrapper.addClass('t696__inputsbox_hidden');
        setTimeout(function() {
            if ($(window).height() > $('.t-body').height()) {
                $('.t-tildalabel').animate({
                    opacity: 0
                }, 50)
            }
        }, 300)
    } else {
        $('html, body').animate({
            scrollTop: t696_target
        }, 400);
        setTimeout(function() {
            t696_inputsWrapper.addClass('t696__inputsbox_hidden')
        }, 400)
    }
    var successurl = t696_form.data('success-url');
    if (successurl && successurl.length > 0) {
        setTimeout(function() {
            window.location.href = successurl
        }, 500)
    }
}

function t734_init(recid) {
    var rec = $('#rec' + recid);
    if ($('body').find('.t830').length > 0) {
        if (rec.find('.t-slds__items-wrapper').hasClass('t-slds_animated-none')) {
            t_sldsInit(recid)
        } else {
            setTimeout(function() {
                t_sldsInit(recid)
            }, 500)
        }
    } else {
        t_sldsInit(recid)
    }
    rec.find('.t734').bind('displayChanged', function() {
        t_slds_updateSlider(recid)
    })
}

function t802_insta_init(recid, instauser) {
    var projectid = $('#allrecords').attr('data-tilda-project-id');
    t802_insta_loadflow(recid, projectid, instauser)
}

function t802_insta_loadflow(recid, projectid, instauser) {
    if (instauser == '') {
        var url = "https://insta.tildacdn.com/fish/0.json"
    } else {
        var url = "https://insta.tildacdn.com/json/project" + projectid + "_" + instauser + ".json"
    }
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data) {
            if (typeof data == 'object') {
                t802_insta_draw(recid, data)
            } else {
                console.log('error. insta flow json not object');
                console.log(data)
            }
        },
        error: function() {
            console.log('error load instgram flow')
        },
        timeout: 1000 * 90
    })
}

function t802_insta_draw(recid, obj) {
    if (typeof obj.photos == 'undefined') {
        return
    }
    $.each(obj.photos, function(index, item) {
        t802_insta_drawItem(recid, obj.username, item)
    })
}

function t802_insta_drawItem(recid, username, item) {
    var emptyEl = $("#rec" + recid).find(".t802__imgwrapper_empty").first();
    if (emptyEl.length > 0) {
        emptyEl.removeClass("t802__imgwrapper_empty");
        emptyEl.append('<div class="t802__bgimg" style="background-image:url(' + item.url + ')"></div>');
        emptyEl.wrap('<a href="' + item.link + '" target="_blank"></a>');
        var hoverEl = emptyEl.find(".t802__hover-wrapper");
        if (hoverEl.length > 0 && isMobile == !1) {
            var text = t802_insta_cropText(recid, '@' + username + ': ' + item.text);
            hoverEl.append('<div class="t802__hover-filter"></div>');
            hoverEl.append('<div class="t802__text t-text t-descr_xxs">' + text + '</div>')
        }
    }
}

function t802_insta_cropText(recid, text) {
    var colsInLine = $("#rec" + recid).find("[data-cols-in-line]").attr("data-cols-in-line");
    if (colsInLine == 6) {
        var maxLength = 90
    } else {
        var maxLength = 130
    }
    if (text.length > maxLength) {
        text = text.substring(0, maxLength);
        text = text.substring(0, Math.min(maxLength, text.lastIndexOf(" ")));
        text += ' ...'
    }
    return text
}