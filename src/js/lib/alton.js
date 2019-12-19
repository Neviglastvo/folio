// !function(e){"use strict";var t={firstClass:"header",fullSlideContainer:"full",singleSlideClass:"slide",nextElement:"div",previousClass:null,lastClass:"footer",slideNumbersContainer:"slide-numbers",bodyContainer:"pageWrapper",scrollMode:"featuredScroll",useSlideNumbers:!1,slideNumbersBorderColor:"#fff",slideNumbersColor:"#000",animationType:"slow",callback:!1};e.fn.alton=function(s){function l(t){if("featuredScroll"===t){for(w=p.length-1;w>=0;w-=1)r()&&e(p[w]).height()>O?e(p[w]).css("height",e(p[w]).height()):(e(p[w]).css("height",O),e(p[w]).outerHeight(O));if(N.useSlideNumbers&&!r()){e("."+N.bodyContainer).append('<div id="'+N.slideNumbersContainer+'"></div>'),e("#"+N.slideNumbersContainer).css({height:"100%",position:"fixed",top:0,right:"0px",bottom:"0px",width:"86px","z-index":999}),r()&&e("#"+N.slideNumbersContainer).css({height:"auto","min-height":"100%"}),e("."+N.bodyContainer+" #"+N.slideNumbersContainer).append("<ul></ul>"),e("."+N.bodyContainer+" #"+N.slideNumbersContainer+" ul").css({transform:"translateY(-50%)","-moz-transform":"translateY(-50%)","-ms-transform":"translateY(-50%)","-o-transform":"translateY(-50%)","-webkit-transform":"translateY(-50%)",top:"50%",position:"fixed"});for(var s=0;E>s;)e("."+N.bodyContainer+" #"+N.slideNumbersContainer+" ul").append('<li class="paginate"></ul>'),o()?e(".paginate").css({cursor:"pointer","border-radius":"50%","list-style":"none",background:N.slideNumbersBorderColor,"border-color":N.slideNumbersBorderColor,"border-width":"2px","border-style":"solid",height:"11px",width:"11px",margin:"5px 0"}):e(".paginate").css({cursor:"pointer","border-radius":"50%","list-style":"none",background:N.slideNumbersBorderColor,"border-color":N.slideNumbersBorderColor,"border-width":"2px","border-style":"solid",height:"10px",width:"10px",margin:"5px 0"}),s+=1;g="getElementsByClassName"in document?document.getElementsByClassName("paginate"):document.querySelectorAll(".paginate")}}else e("."+N.firstClass).css("height",O+10),e("."+N.firstClass).hasClass("active")||(e("."+N.firstClass).toggleClass("active"),o()&&e(".paginate.active").css({"margin-left":"-1px","border-color":"#"+N.slideNumbersBorderColor,"border-style":"solid","border-width":"2px",height:"8px",width:"8px"}))}function o(){var e=window.navigator.userAgent,t=e.indexOf("MSIE ");return t>0||navigator.userAgent.match(/Trident.*rv\:11\./)?!0:!1}function r(){return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|Windows Phone|Tizen|Bada)/)}function n(t,s){s&&e(g[e(t).parent().children().index(t)]).hasClass("active")?(e(g[e(t).parent().children().index(t)]).toggleClass("active"),e(g[e(t).parent().children().index(t)]).css("background",N.slideNumbersBorderColor)):e(g[e(t).parent().children().index(t)]).hasClass("active")||(e(g[e(t).parent().children().index(t)]).toggleClass("active"),e(g[e(t).parent().children().index(t)]).css("background",N.slideNumbersColor))}function i(t){N.useSlideNumbers&&(t?e("#"+N.slideNumbersContainer).fadeIn():e("#"+N.slideNumbersContainer).fadeOut())}function a(t){var s=document.getElementsByClassName(y);e(document).scrollTo(e(s[t])),T=s[t],D=e(T).prev().hasClass(y)?e(T).prev():e("."+N.firstClass),k=e(T).next().hasClass(y)?e(T).next():e("."+N.lastClass),n(e("#"+N.slideNumbersContainer+" li.active"),!0),n(s[t],!1),"function"==typeof N.callback&&N.callback()}function d(){(e(k).length>0||e(D).length>0)&&(e(window).scrollTop()>=e("."+y+":first").offset().top&&e(window).scrollTop()+e(window).outerHeight()!==e(document).outerHeight()?(N.useSlideNumbers&&n(T,!0),e("."+y).each(function(){v=e(this).offset().top,v<=e(window).scrollTop()&&(D=e(this).prev().hasClass(y)?e(this).prev():e("."+N.firstClass),T=e(this),k=T.next().hasClass(y)?e(this).next():e("."+N.lastClass),M=!1)}),N.useSlideNumbers&&n(T,!1),e(document).scrollTo(T)):(N.useSlideNumbers&&(B!==e("."+y+":last-child")[0]?i(!1):(i(!0),n(T,!1))),e(document).scrollTo(T)))}function u(e){void 0!==e&&(e=e||window.event,e.preventDefault&&(e.stopPropagation(),e.returnValue=!1))}function c(e){return u(e)}function m(){return window.pageYOffset||P.scrollTop}function f(t){return b=e("body,html").is(":animated")||e("body").is(":animated")||e("html").is(":animated"),"mousewheel"==t.type||"DOMMouseScroll"==t.type?(clearTimeout(e.data(this,"scrollTimer")),e(document).unbind({scroll:f}),e.data(this,"scrollTimer",setTimeout(function(){Y=!1,e(document).bind({scroll:f})},35)),t.originalEvent.detail>1&&!Y||t.originalEvent.wheelDelta<-1&&!Y?(A+=1,e(document).moveDown(),Y=!0,u()):(t.originalEvent.detail<-1&&!Y||t.originalEvent.wheelDelta>1&&!Y)&&(H+=1,e(document).moveUp(),Y=!0,u())):"scroll"==t.type&&(u(),Y=!1,clearTimeout(e.data(this,"scrollTimer")),e.data(this,"scrollTimer",setTimeout(function(){d()},500))),!1}function h(t){if(C=m(),t.originalEvent.detail>0||t.originalEvent.wheelDelta<0){if(!(e(k).offset().top>0&&C<e("."+N.firstClass).outerHeight()))return!0;if(e("."+N.firstClass).hasClass("active"))return e("."+N.firstClass).toggleClass("active"),e(document).scrollTo(k),D=T,T=k,c(t);if(!e("html, body").is(":animated"))return!0}else if(!e("."+N.firstClass).hasClass("active")&&e(window).scrollTop()<=e("."+N.firstClass).outerHeight())e("."+N.firstClass).toggleClass("active"),e(document).scrollTo(D),k=T,T=D;else if(!e("html, body").is(":animated"))return!0;return!1}var p,b,g,C,v,w,N=e.extend(!0,{},t,s),y=N.singleSlideClass,S=!1,x=!1,T=e("."+N.firstClass),k=e("."+y+":first"),D=null,B=e("."+N.lastClass),E=e("."+N.fullSlideContainer).children().length,M=!0,H=0,A=0,O=e(window).outerHeight(),Y=!1,P=window.document.documentElement;p="getElementsByClassName"in document?document.getElementsByClassName(y):document.querySelectorAll("."+y),T.length||(T=k,k=T.next()),B.length||(B=e("."+y+":last")),B=B[0],"headerScroll"===N.scrollMode&&(T=e("."+N.firstClass),k=e("."+N.bodyContainer+":first")),e.fn.moveDown=function(){C=m(),C>=0&&C<=e(T).scrollTop()&&M===!0?(D=T,T=k,k=T.next(),N.useSlideNumbers&&(B===e("."+y+":last-child")[0]?(n(D,!0),n(T,!1)):(n(T,!1),i(!0))),M=!1,e(document).scrollTo(T)):!b&&k&&e(T).offset().top<C+1&&(k.hasClass(y)?(D=T,T=k,k=e(T).next(),N.useSlideNumbers&&(n(D,!0),n(T,!1)),e(document).scrollTo(T)):B!==e("."+y+":last-child")[0]&&(D=e("."+y+":last-child")[0],T=B,k=null,e(window).scrollTop()+O+10>=e(document).outerHeight()-e(B).outerHeight()&&N.useSlideNumbers&&(n(D,!1),i(!1)),e(document).scrollTo(T),e.event.trigger({type:"lastSlide",slide:B,time:new Date}))),"function"==typeof N.callback&&N.callback()},e.fn.moveUp=function(){C=m(),e("."+N.fullSlideContainer).offset().top+1>C&&D&&C>0?(e(T).offset().top>=C?(T=e("."+N.firstClass),D=null,k=e("."+y),N.useSlideNumbers&&(i(!1),n(k,!1)),M=!0):(T=D,D=null,k=e("."+y),N.useSlideNumbers&&(n(T,!0),n(D,!0))),e(document).scrollTo(T)):!b&&e("."+N.fullSlideContainer).offset().top<C&&(T=D,D=e(T).prev(),k=e(T).next(),N.useSlideNumbers&&(n(T,!1),n(k,!0),i(!0)),e(document).scrollTo(T)),x=!0,S=!1,"function"==typeof N.callback&&N.callback()},e.fn.scrollTo=function(t){t!==B?e("body,html").stop(!0,!0).animate({scrollTop:e(t).offset().top},{duration:875}):e("body,html").stop(!0,!0).animate({scrollTop:e(document).outerHeight()-O},{duration:875})},e(document).ready(function(){if(l(N.scrollMode),"featuredScroll"!==N.scrollMode||r()||d(),"featuredScroll"===N.scrollMode&&!r()){e("#"+N.slideNumbersContainer+" li").on("click",function(){a(e(this).parent().children().index(this))});var t=[];onkeydown=onkeyup=function(s){switch(s=s||event,t[s.which]="keyup"==s.type,s.which){case 40:s.preventDefault(),e(document).moveDown(s);break;case 32:s.preventDefault(),t[16]===!0?e(document).moveUp(s):e(document).moveDown(s);break;case 33:e(document).moveDown(s),s.preventDefault();break;case 34:s.preventDefault(),e(document).moveUp(s);break;case 38:s.preventDefault(),e(document).moveUp(s);break;case 36:s.preventDefault(),0!==e("."+N.firstClass).length?(N.useSlideNumbers&&n(T,!0),D=null,T="."+N.firstClass,k=e("."+y+":first"),N.useSlideNumbers&&n(T,!1),e(document).scrollTo("."+N.firstClass)):(N.useSlideNumbers&&n(T,!0),D=null,T=e(".pane:first"),k=T.next(),e(document).scrollTo(e(".pane")[0]),N.useSlideNumbers&&n(T,!1));break;case 35:0!==e("."+N.firstClass).length?(N.useSlideNumbers&&(n(e(T),!0),n(e(".pane:last"),!1)),D=e(".pane:last")):(N.useSlideNumbers&&(n(e(T),!0),n(e(B),!1)),D=e(B).prev()),T=e(B),k=null,s.preventDefault(),e(document).scrollTo(B)}}}r()||("featuredScroll"===N.scrollMode?e(document).bind({"DOMMouseScroll mousewheel scroll":f}):"headerScroll"===N.scrollMode&&e(document).bind({"DOMMouseScroll mousewheel":h}),e(window).resize(function(){e(p).each(function(){e(this).css("height",e(window).outerHeight()),e(this).outerHeight(e(window).outerHeight())})}))})}}(jQuery);

/* ===============================================================================
 * alton.js v1.2.1
 * ===============================================================================
 * Copyright 2014 Paper Leaf Design
 * http://www.paper-leaf.com
 *
 * Author: Paper Leaf
 *
 * A full featured scrolling plugin for creating
 * immersive featured sections or headers.
 *
 * Credit:
 * is_mobile() based off these helpful posts
 * - http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-handheld-device-in-jquery
 *
 * Getting stable scroll events was helped hugely by Huge Inc's insights
 * - http://www.hugeinc.com/ideas/perspective/scroll-jacking-on-hugeinc
 *
 * Stabilizing keypress events was helped in large part by jQuery OnePage Scroll
 * - https://github.com/peachananr/onepage-scroll
 *
 * License: GPL v3
 * =============================================================================== */

(function($) {
    /* ===============================================================================
     * Table of Contents
     * -------------------
     *
     * 1. Default Options
     * 2. Global Variables
     * 3. Initiate Layout
     * 4. Mobile Device Check
     * 5. Click to Navigate
     * 6. Update Position
     * 7. Move Up
     * 8. Move Down
     * 9. Prevent Default Animations
     * 10. Scroll To
     * 11. Featured Scroll
     * 12. Header Scroll
     *
     * =============================================================================== */

    /* =============================================================================
     * Default Options
     * -------------------
     * Creating defaults in case the user doesn't feel like adding their own
     * ============================================================================= */
    "use strict";
    var defaults = {
        firstClass: 'header', // classname of the first element in your page content
        fullSlideContainer: 'full', // full page elements container for
        singleSlideClass: 'slide', // class for each individual slide
        nextElement: 'div', // set the first element in the first page series.
        previousClass: null, // null when starting at the top. Will be updated based on current postion
        lastClass: 'footer', // last block to scroll to
        slideNumbersContainer: 'slide-numbers', // ID of Slide Numbers
        bodyContainer: 'pageWrapper', // ID of content container
        scrollMode: 'featuredScroll', // Choose scroll mode
        useSlideNumbers: false, // Enable or disable slider
        slideNumbersBorderColor: '#fff', // outside color for slide numbers
        slideNumbersColor: '#000', // interior color when slide numbers inactive
        animationType: 'slow', // animation type: currently doesn't do anything
        callback: false, // default is no callback
    };

    $.fn.alton = function(options) {
        /* =============================================================================
         * User Settings
         * -------------------
         * Update the default settings with user selected options
         * ============================================================================= */
        var settings = $.extend(true, {}, defaults, options),

            /* =============================================================================
             * Global Variables
             * -------------------
             * Setting up variables that will be used throught the plugin
             * ============================================================================= */
            singleSlideClass = settings.singleSlideClass,
            singleSlide,
            bodyScroll,
            down = false,
            up = false,
            current = $('.' + settings.firstClass),
            next = $('.' + singleSlideClass + ':first'),
            previous = null,
            last = $('.' + settings.lastClass),
            projectCount = $('.' + settings.fullSlideContainer).children().length,
            slideNumbers,
            top = true,
            upCount = 0,
            downCount = 0,
            windowHeight = $(window).outerHeight(),
            animating = false,
            docElem = window.document.documentElement,
            scrollOffset,
            offsetTest,
            i;

        // IE8 Support for getElementsByClassname
        if ('getElementsByClassName' in document) {
            singleSlide = document.getElementsByClassName(singleSlideClass);
        } else {
            singleSlide = document.querySelectorAll('.' + singleSlideClass);
        }

        if (!current.length) {
            current = next;
            next = current.next();
        }
        if (!last.length) {
            last = $('.' + singleSlideClass + ':last');
        }
        last = last[0];

        /* =============================================================================
         * Position Variables
         * -------------------
         * Update postion variable if headerScroll
         * ============================================================================= */
        if (settings.scrollMode === 'headerScroll') {
            current = $('.' + settings.firstClass); // current element is the topmost element
            next = $('.' + settings.bodyContainer + ':first');
        }

        /* ============================================================================
         * Initiate Layout
         * -------------------
         * Get the slides to 100% height, and add pagination
         * ============================================================================ */
        function initiateLayout(style) {
            if (style === 'featuredScroll') {
                for (i = singleSlide.length - 1; i >= 0; i -= 1) {
                    if (is_mobile()) {
                        if ($(singleSlide[i]).height() > windowHeight) {
                            $(singleSlide[i]).css('height', $(singleSlide[i]).height());
                        } else {
                            $(singleSlide[i]).css('height', windowHeight);
                            $(singleSlide[i]).outerHeight(windowHeight);
                        }
                    } else {
                        $(singleSlide[i]).css('height', windowHeight);
                        $(singleSlide[i]).outerHeight(windowHeight);

                    }
                }
                if (settings.useSlideNumbers && !is_mobile()) {
                    // Create Slider Buttons
                    $('.' + settings.bodyContainer).append('<div id="' + settings.slideNumbersContainer + '"></div>');
                    $('#' + settings.slideNumbersContainer).css({
                        'height': '100%',
                        'position': 'fixed',
                        'top': 0,
                        'right': '0px',
                        'bottom': '0px',
                        'width': '86px',
                        'z-index': 999
                    });
                    if (is_mobile()) {
                        $('#' + settings.slideNumbersContainer).css({
                            'height': 'auto',
                            'min-height': '100%'
                        });
                    }
                    $('.' + settings.bodyContainer + ' #' + settings.slideNumbersContainer).append('<ul></ul>');
                    $('.' + settings.bodyContainer + ' #' + settings.slideNumbersContainer + ' ul').css({
                        'transform': 'translateY(-50%)',
                        '-moz-transform': 'translateY(-50%)',
                        '-ms-transform': 'translateY(-50%)',
                        '-o-transform': 'translateY(-50%)',
                        '-webkit-transform': 'translateY(-50%)',
                        'top': '50%',
                        'position': 'fixed'
                    });

                    var testCount = 0;

                    while (testCount < projectCount) {
                        $('.' + settings.bodyContainer + ' #' + settings.slideNumbersContainer + ' ul').append('<li class="paginate"></ul>');
                        if (msieversion()) {
                            $('.paginate').css({
                                'cursor': 'pointer',
                                'border-radius': '50%',
                                'list-style': 'none',
                                'background': settings.slideNumbersBorderColor,
                                'border-color': settings.slideNumbersBorderColor,
                                'border-width': '2px',
                                'border-style': 'solid',
                                'height': '11px',
                                'width': '11px',
                                'margin': '5px 0'
                            });
                        } else {
                            $('.paginate').css({
                                'cursor': 'pointer',
                                'border-radius': '50%',
                                'list-style': 'none',
                                'background': settings.slideNumbersBorderColor,
                                'border-color': settings.slideNumbersBorderColor,
                                'border-width': '2px',
                                'border-style': 'solid',
                                'height': '10px',
                                'width': '10px',
                                'margin': '5px 0'
                            });
                        }

                        testCount += 1;
                    }
                    // Store the slidenumbers
                    // IE8 Support for getElementsByClassname
                    if (('getElementsByClassName' in document)) {
                        slideNumbers = document.getElementsByClassName('paginate');
                    } else {
                        slideNumbers = document.querySelectorAll('.paginate');
                    }
                }
            } else {
                $('.' + settings.firstClass).css('height', windowHeight + 10);
                if (!$('.' + settings.firstClass).hasClass('active')) {
                    $('.' + settings.firstClass).toggleClass('active');
                    if (msieversion()) {
                        $('.paginate.active').css({
                            'margin-left': '-1px',
                            'border-color': '#' + settings.slideNumbersBorderColor,
                            'border-style': 'solid',
                            'border-width': '2px',
                            'height': '8px',
                            'width': '8px'
                        });
                    }
                }
            }
        }

        function msieversion() {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");

            if (msie > 0 || navigator.userAgent.match(/Trident.*rv\:11\./)) { // If Internet Explorer, return version number
                return true;
            } else {
                return false;
            }
        }

        /* ============================================================================
         * Mobile device check
         * -------------------
         * Check if mobile device
         * ============================================================================ */
        function is_mobile() {
            return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|Windows Phone|Tizen|Bada)/);
        }

        /* ============================================================================
         * Update pagination
         * -------------------
         * Updates pagination on scroll down or up when called etc.
         * ============================================================================ */
        function slideIndex(element, toggle) {
            if (toggle && $(slideNumbers[$(element).parent().children().index(element)]).hasClass('active')) {
                $(slideNumbers[$(element).parent().children().index(element)]).toggleClass('active');
                $(slideNumbers[$(element).parent().children().index(element)]).css('background', settings.slideNumbersBorderColor);
            } else if (!$(slideNumbers[$(element).parent().children().index(element)]).hasClass('active')) {
                $(slideNumbers[$(element).parent().children().index(element)]).toggleClass('active');
                $(slideNumbers[$(element).parent().children().index(element)]).css('background', settings.slideNumbersColor);
            }
        }

        /* ============================================================================
         * Slide Numbers Fade
         * -------------------
         * Fades out the slide numbers
         * ============================================================================ */
        function slideNumbersFade(fadeInOut) {
            if (settings.useSlideNumbers) {
                if (fadeInOut) {
                    $('#' + settings.slideNumbersContainer).fadeIn();
                } else {
                    $('#' + settings.slideNumbersContainer).fadeOut();
                }
            }
        }

        /* ============================================================================
         * Click to Navigate
         * -------------------
         * Adds click to navigate functionality to pagination
         * ============================================================================ */
        function clickToNavigate(elementIndex) {
            var elementContainer = document.getElementsByClassName(singleSlideClass);
            $(document).scrollTo($(elementContainer[elementIndex]));
            current = elementContainer[elementIndex];
            if ($(current).prev().hasClass(singleSlideClass)) {
                previous = $(current).prev();
            } else {
                previous = $('.' + settings.firstClass);
            }
            if ($(current).next().hasClass(singleSlideClass)) {
                next = $(current).next();
            } else {
                next = $('.' + settings.lastClass);
            }

            slideIndex($('#' + settings.slideNumbersContainer + ' li.active'), true);
            slideIndex(elementContainer[elementIndex], false);

            // Callback function
            if ( typeof settings.callback == 'function' ) {
                settings.callback();
            }
        }

        /* ============================================================================
         * Update Position
         * -------------------
         * Update current, previous and next, based on window position on load.
         * ============================================================================ */
        function getCurrentPosition() {
            if ($(next).length > 0 || $(previous).length > 0) {
                if ($(window).scrollTop() >= $('.' + singleSlideClass + ':first').offset().top && $(window).scrollTop() + $(window).outerHeight() !== $(document).outerHeight()) {
                    if (settings.useSlideNumbers) {
                        slideIndex(current, true);
                    }
                    $('.' + singleSlideClass).each(function() {
                        offsetTest = $(this).offset().top;
                        if (offsetTest <= $(window).scrollTop()) {
                            if ($(this).prev().hasClass(singleSlideClass)) {
                                previous = $(this).prev();
                            } else {
                                previous = $('.' + settings.firstClass);
                            }
                            current = $(this);
                            if (current.next().hasClass(singleSlideClass)) {
                                next = $(this).next();
                            } else {
                                next = $('.' + settings.lastClass);
                            }
                            top = false;
                        }
                    });
                    if (settings.useSlideNumbers) {
                        slideIndex(current, false);
                    }
                    $(document).scrollTo(current);
                } else {
                    if (settings.useSlideNumbers) {
                        if (last !== $('.' + singleSlideClass + ':last-child')[0]) {
                            slideNumbersFade(false);
                        } else {
                            slideNumbersFade(true);
                            slideIndex(current, false);
                        }
                    }
                    $(document).scrollTo(current);
                }
            }
        }

        /* ============================================================================
         * Prevent Default Animations
         * -------------------
         * Stops default scroll animations when called
         * ============================================================================ */
        function preventDefault(e) {
            if(e !== undefined) {
                e = e || window.event;
                if (e.preventDefault) {
                    e.stopPropagation();
                    e.returnValue = false;
                }
            }
        }

        function stopDefaultAnimate(event) {
            return preventDefault(event);
        }

        /* ============================================================================
         * Move Down
         * -------------------
         * All the code to move the page down
         * ============================================================================ */
        $.fn.moveDown = function() {
            scrollOffset = scrollY();
            if (scrollOffset >= 0 && (scrollOffset <= $(current).scrollTop()) && top === true) {
                // Check if top of page
                // Update the selectors
                previous = current;
                current = next;
                next = current.next();

                // Set Slide Indexes and Fade Slide Numbers
                if (settings.useSlideNumbers) {
                    if (last === $('.' + singleSlideClass + ':last-child')[0]) {
                        slideIndex(previous, true);
                        slideIndex(current, false);
                    } else {
                        slideIndex(current, false);
                        slideNumbersFade(true);
                    }
                }

                // Update top variable
                top = false;
                $(document).scrollTo(current); // Scroll to selected element
            } else if (!bodyScroll && next && $(current).offset().top < scrollOffset + 1) {
                // Check if slide
                if (next.hasClass(singleSlideClass)) {
                    // Update the selectors
                    previous = current;
                    current = next;
                    next = $(current).next();
                    // Set Slide Indexes and Fade Slide Numbers
                    if (settings.useSlideNumbers) {
                        slideIndex(previous, true);
                        slideIndex(current, false);
                    }
                    $(document).scrollTo(current); // Scroll to selected element
                } else if (last !== $('.' + singleSlideClass + ':last-child')[0]) {
                    // Update the selectors
                    previous = $('.' + singleSlideClass + ':last-child')[0];
                    current = last;
                    next = null;
                    if ($(window).scrollTop() + windowHeight + 10 >= $(document).outerHeight() - $(last).outerHeight()) {
                        // Check for bottom
                        // Set Slide Indexes and Fade Slide Numbers
                        if (settings.useSlideNumbers) {
                            slideIndex(previous, false);
                            slideNumbersFade(false);
                        }
                    }
                    $(document).scrollTo(current); // Scroll to selected element
                    $.event.trigger({
                        type: "lastSlide",
                        slide: last,
                        time: new Date()
                    });
                }
            }

            // Callback function
            if ( typeof settings.callback == 'function' ) {
                settings.callback();
            }
        };

        /* ============================================================================
         * Move Up
         * -------------------
         * All the code to move the page up
         * ============================================================================ */
        $.fn.moveUp = function() {
            scrollOffset = scrollY();
            if ($('.' + settings.fullSlideContainer).offset().top + 1 > scrollOffset && previous && scrollOffset > 0) {
                // Check if not scrolling to top of page
                if ($(current).offset().top >= scrollOffset) {
                    // Update the selectors
                    current = $('.' + settings.firstClass);
                    previous = null;
                    next = $('.' + singleSlideClass);

                    // Update and fade slideNumbers
                    if (settings.useSlideNumbers) {
                        slideNumbersFade(false);
                        slideIndex(next, false);
                    }
                    // Update top variable as we are at the top of the page
                    top = true;
                } else {
                    // Update the selectors
                    current = previous;
                    previous = null;
                    next = $('.' + singleSlideClass);

                    // Update and fade slideNumbers
                    if (settings.useSlideNumbers) {
                        slideIndex(current, true);
                        slideIndex(previous, true);
                    }
                }
                $(document).scrollTo(current); // Scroll to proper element
            } else if (!bodyScroll && $('.' + settings.fullSlideContainer).offset().top < scrollOffset) {
                // Update the selectors
                current = previous;
                previous = $(current).prev();
                next = $(current).next();

                // Update and fade slideNumbers
                if (settings.useSlideNumbers) {
                    slideIndex(current, false);
                    slideIndex(next, true);
                    slideNumbersFade(true);
                }

                // Scroll to proper element
                $(document).scrollTo(current);

                // Stop default scrolling
            }

            // Update movement variables
            up = true;
            down = false;

            // Callback function
            if ( typeof settings.callback == 'function' ) {
                settings.callback();
            }

            // Stop default scrolling animations
        };

        /* ============================================================================
         * Scroll To
         * -------------------
         * Scroll to element. This is a public function and can be used in an JS file
         * ============================================================================ */
        $.fn.scrollTo = function(element) {
            if (element !== last) {
                $("body,html").stop(true, true).animate({
                    scrollTop: $(element).offset().top
                }, 1100, $.bez([1, 0.15, 0.52, 0.8]));
            } else {
                $("body,html").stop(true, true).animate({
                    scrollTop: $(document).outerHeight() - windowHeight
                }, 1100, $.bez([1, 0.15, 0.52, 0.8]));
            }
        };

        /* ============================================================================
         * ScrollY
         * -------------------
         * Replacing default scrollY with IE8 Compat
         * ============================================================================ */
        function scrollY() {
            return window.pageYOffset || docElem.scrollTop;
        }

        /* ============================================================================
         * Featured Scroll
         * -------------------
         * Scroll based on the idea of having a header, a full screen featured projects
         * area, and then a footer after
         * ============================================================================ */
        function featuredScroll(e) {
            bodyScroll = $('body,html').is(':animated') || $('body').is(':animated') || $('html').is(':animated'); // Check if body is currently animated

            if (e.type == 'mousewheel' || e.type == "DOMMouseScroll") {  //  <-- fix for firefox
                clearTimeout($.data(this, 'scrollTimer')); // jshint ignore:line
                $(document).unbind({
                    'scroll' : featuredScroll
                });
                $.data(this, 'scrollTimer', setTimeout(function() { // jshint ignore:line
                    animating = false;
                    $(document).bind({
                        'scroll' : featuredScroll
                    });
                }, 35));

                if (e.originalEvent.detail > 1 && !animating || e.originalEvent.wheelDelta < -1 && !animating) {
                    // Check if scrolling down
                    downCount += 1;
                    $(document).moveDown();
                    animating = true;
                    preventDefault();
                } else if (e.originalEvent.detail < -1 && !animating || e.originalEvent.wheelDelta > 1 && !animating) {
                    // Check if not scrolling up
                    upCount += 1;
                    $(document).moveUp();
                    animating = true;
                    preventDefault();
                }
            } else if (e.type == 'scroll') {
                preventDefault();
                animating = false;
                clearTimeout($.data(this, 'scrollTimer')); // jshint ignore:line
                $.data(this, 'scrollTimer', setTimeout(function() { // jshint ignore:line
                    getCurrentPosition();
                }, 500));
            }
            return false;
        }

        /* ============================================================================
         * Header Scroll
         * -------------------
         * Scroll jacking for full size header image, then re-enables native scrolling
         *
         * ============================================================================ */
        function headerScroll(e) {
            scrollOffset = scrollY();
            if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) {
                if ($(next).offset().top > 0 && scrollOffset < $('.' + settings.firstClass).outerHeight()) {
                    if ($('.' + settings.firstClass).hasClass('active')) {
                        $('.' + settings.firstClass).toggleClass('active');
                        $(document).scrollTo(next);
                        previous = current;
                        current = next;
                        return stopDefaultAnimate(e);
                    } else if (!$('html, body').is(':animated')) {
                        return true;
                    }
                } else {
                    return true;
                }
            } else {
                if (!$('.' + settings.firstClass).hasClass('active') && $(window).scrollTop() <= $('.' + settings.firstClass).outerHeight()) {
                    $('.' + settings.firstClass).toggleClass('active');
                    $(document).scrollTo(previous);
                    next = current;
                    current = previous;
                } else if (!$('html, body').is(':animated')) {
                    return true;
                }
            }
            return false;
        }

        /* ============================================================================
         * Function Calls and Ordering
         * -------------------
         * Calling all the functions on document load to make sure nothing breaks
         * ============================================================================ */
        $(document).ready(function() {
            initiateLayout(settings.scrollMode);
            if (settings.scrollMode === 'featuredScroll' && !is_mobile()) {
                getCurrentPosition();
            }
            if (settings.scrollMode === 'featuredScroll' && !is_mobile()) {
                $('#' + settings.slideNumbersContainer + ' li').on("click", function() {
                    clickToNavigate($(this).parent().children().index(this));
                });

                var map = [];
                onkeydown = onkeyup = function(e) {
                    e = e || event; // to deal with IE
                    map[e.which] = e.type == 'keyup';
                    switch (e.which) {
                        case 40: // arrowDown
                            e.preventDefault();
                            $(document).moveDown(e);
                            break;
                        case 32: // pageUp
                            e.preventDefault();
                            if (map['16'] === true) {
                                $(document).moveUp(e);
                            } else {
                                $(document).moveDown(e);
                            }
                            break;
                        case 33: // pageUp
                            $(document).moveDown(e);
                            e.preventDefault();
                            break;
                        case 34: // pageUp
                            e.preventDefault();
                            $(document).moveUp(e);
                            break;
                        case 38: // arrowUp
                            e.preventDefault();
                            $(document).moveUp(e);
                            break;
                        case 36: // home
                            e.preventDefault();
                            if ($('.' + settings.firstClass).length !== 0) {
                                if (settings.useSlideNumbers) {
                                    slideIndex(current, true);
                                }
                                previous = null;
                                current = '.' + settings.firstClass;
                                next = $('.' + singleSlideClass + ':first');

                                if (settings.useSlideNumbers) {
                                    slideIndex(current, false);
                                }
                                $(document).scrollTo('.' + settings.firstClass);
                            } else {
                                if (settings.useSlideNumbers) {
                                    slideIndex(current, true);
                                }
                                previous = null;
                                current = $('.pane:first');
                                next = current.next();
                                $(document).scrollTo($('.pane')[0]);
                                if (settings.useSlideNumbers) {
                                    slideIndex(current, false);
                                }
                            }
                            break;
                        case 35: // end
                            if ($('.' + settings.firstClass).length !== 0) {
                                if (settings.useSlideNumbers) {
                                    slideIndex($(current), true);
                                    slideIndex($('.pane:last'), false);
                                }
                                previous = $('.pane:last');
                            } else {
                                if (settings.useSlideNumbers) {
                                    slideIndex($(current), true);
                                    slideIndex($(last), false);
                                }
                                previous = $(last).prev();
                            }
                            current = $(last);
                            next = null;
                            e.preventDefault();
                            $(document).scrollTo(last);
                    }
                };
            }

            if (!is_mobile()) {
                if (settings.scrollMode === 'featuredScroll') {
                    $(document).bind({
                        'DOMMouseScroll mousewheel scroll': featuredScroll
                    });
                } else if (settings.scrollMode === 'headerScroll') {
                    $(document).bind({
                        'DOMMouseScroll mousewheel': headerScroll
                    });
                }
                $(window).resize(function() {
                    $(singleSlide).each(function() {
                        $(this).css('height', $(window).outerHeight());
                        $(this).outerHeight($(window).outerHeight());
                    });
                });
            }
        });
    };
})(jQuery);
