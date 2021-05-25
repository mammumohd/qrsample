SIA.autocompleteSearch = function() {
    var c = SIA.global;
    var g = c.vars;
    var f = g.win;
    var i = g.doc;
    var a = $("[data-autocomplete-search]");
    var b = null;
    var e = function() {
        var l = -1;
        if (navigator.appName === "Microsoft Internet Explorer") {
            var j = navigator.userAgent;
            var k = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
            if (k.exec(j) !== null) {
                l = parseFloat(RegExp.$1);
            }
        } else {
            if (navigator.appName === "Netscape") {
                var j = navigator.userAgent;
                var k = new RegExp("Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})");
                if (k.exec(j) !== null) {
                    l = parseFloat(RegExp.$1);
                }
            }
        }
        return l;
    };
    var h = function() {
        if (e() === 11) {
            g.html.addClass("ie11");
        }
        a.each(function(k, n) {
            var o = $(n);
            var m = "";
            var l = o.data("autocomplete-source") || "ajax/autocomplete-search.json";
            var j = o.autocomplete({
                open: function() {
                    $(this).autocomplete("widget").jScrollPane({
                        scrollPagePercent: 10
                    }).off("mousewheel.preventScroll").on("mousewheel.preventScroll", function(p) {
                        p.preventDefault();
                        p.stopPropagation();
                    });
                },
                source: function(q, p) {
                    m = q.term;
                    $.get(l + "?term=" + m, function(r) {
                        p(r.searchSuggests);
                    });
                },
                search: function() {
                    var p = $(this);
                    p.autocomplete("widget").removeData("jsp").off("mousewheel.preventScroll");
                },
                close: function() {
                    var p = $(this);
                    p.autocomplete("widget").removeData("jsp").off("mousewheel.preventScroll");
                },
                select: function(p, q) {
                    $(this).val(q.item.value).closest("form").trigger("submit");
                }
            }).data("ui-autocomplete");
            j._renderItem = function(p, q) {
                if (!p.hasClass("auto-suggest")) {
                    p.addClass("auto-suggest");
                }
                return $('<li class="autocomplete-item" data-value="' + (q.value ? q.value : q.label) + '"><a href="javascript:void(0);">' + (q.label ? q.label : "") + "</a></li>").appendTo(p);
            }
            ;
            j._resizeMenu = function() {
                this.menu.element.outerWidth(o.outerWidth());
            }
            ;
            j._move = function(w) {
                var u, q, t = false, r = this.menu.element.data("jsp"), p = $(), s = null;
                if (!r) {
                    if (!this.menu.element.is(":visible")) {
                        this.search(null, event);
                        return;
                    }
                    if (this.menu.isFirstItem() && /^previous/.test(w) || this.menu.isLastItem() && /^next/.test(w)) {
                        this._value(this.term);
                        this.menu.blur();
                        return;
                    }
                    this.menu[w](event);
                } else {
                    var v = r.getContentPositionY();
                    switch (w) {
                    case "next":
                        if (this.element.val() === "") {
                            r.scrollToY(0);
                            p = this.menu.element.find("li:first");
                            u = p.addClass("active").data("ui-autocomplete-item");
                        } else {
                            q = this.menu.element.find("li.active").removeClass("active");
                            p = q.next();
                            u = p.removeClass("active").addClass("active").data("ui-autocomplete-item");
                        }
                        if (!u) {
                            t = true;
                            p = this.menu.element.find("li").removeClass("active").first();
                            u = p.addClass("active").data("ui-autocomplete-item");
                        }
                        this.term = u.value;
                        this.element.val(this.term);
                        if (t) {
                            r.scrollToY(0);
                            t = false;
                        } else {
                            v = r.getContentPositionY();
                            s = p.position().top + p.innerHeight();
                            if (s - this.menu.element.height() > v) {
                                r.scrollToY(Math.max(0, s - this.menu.element.height()));
                            }
                        }
                        break;
                    case "previous":
                        if (this.element.val() === "") {
                            t = true;
                            u = this.menu.element.find("li:last").addClass("active").data("ui-autocomplete-item");
                        } else {
                            q = this.menu.element.find("li.active").removeClass("active");
                            p = q.prev();
                            u = p.removeClass("active").addClass("active").data("ui-autocomplete-item");
                        }
                        if (!u) {
                            t = true;
                            u = this.menu.element.find("li").removeClass("active").last().addClass("active").data("ui-autocomplete-item");
                        }
                        this.term = u.value;
                        this.element.val(this.term);
                        if (t) {
                            r.scrollToY(this.menu.element.find(".jspPane").height());
                            t = false;
                        } else {
                            v = r.getContentPositionY();
                            if (p.position().top <= v) {
                                r.scrollToY(p.position().top);
                            }
                        }
                        break;
                    }
                }
            }
            ;
            o.autocomplete("widget").addClass("autocomplete-menu");
            o.off("blur.autocomplete");
            o.off("focus.highlight").on("focus.highlight", function(p) {
                p.stopPropagation();
                if (c.vars.isIE()) {
                    i.off("mousedown.hideAutocompleteSearch").on("mousedown.hideAutocompleteSearch", function(q) {
                        if (!$(q.target).closest(".ui-autocomplete").length) {
                            o.autocomplete("close");
                        }
                    });
                }
            });
            if (!c.vars.isIE()) {
                o.off("blur.highlight").on("blur.highlight", function() {
                    b = setTimeout(function() {
                        o.autocomplete("close");
                    }, 200);
                });
                o.autocomplete("widget").off("click.clearTimeout").on("click.clearTimeout", function() {
                    clearTimeout(b);
                });
            }
            o.autocomplete("widget").off("scroll.preventScroll mousewheel.preventScroll touchmove.preventScroll").on("scroll.preventScroll mousewheel.preventScroll touchmove.preventScroll", function(p) {
                p.stopPropagation();
            });
            o.off("mousewheel.preventScroll").on("mousewheel.preventScroll", function(p) {
                p.stopPropagation();
            });
            f.off("resize.blurSearch" + k).on("resize.blurSearch" + k, function() {
                var p = a.not(":hidden");
                if (p.length) {
                    var q = p.autocomplete("widget");
                    if (q.length && q.is(":visible")) {
                        p.autocomplete("close");
                    }
                }
            });
        });
    };
    var d = function() {
        h();
    };
    d();
}
;
SIA.initAutocompleteCity = function() {
    l = function() {
        var q = window.navigator;
        return (q.msPointerEnabled && q.msMaxTouchPoints > 1) || (q.pointerEnabled && q.maxTouchPoints > 1);
    }
    ;
    var b = SIA.global;
    var i = b.vars;
    var k = i.doc;
    var h = i.win;
    var c = b.config;
    var g = i.body;
    var l = i.isIETouch();
    var d;
    var a;
    var p;
    var f;
    var m = function(q) {
        var r = {};
        var s = {
            autocompleteFields: "",
            autoCompleteAppendTo: "",
            airportData: [],
            open: function() {},
            change: function() {},
            select: function() {},
            close: function() {},
            search: function() {},
            response: function() {},
            itemShow: 6,
            setWidth: 30
        };
        r.options = $.extend({}, s, q);
        r.autocompleteFields = r.options.autocompleteFields;
        r.airportData = r.options.airportData;
        r.cityData = r.options.cityData;
        r.timer = null;
        r.timerResize = null;
        r.winW = null;
        r.autocompleteFields.each(function(u, x) {
            var z = $(x);
            var w = z.closest("[data-autocomplete]");
            var y = w.find("input");
            var t = w.find("select option");
            if (w.data("origin") && y.val() !== "") {
                t.each(function() {
                    if ($(this).data("text") === y.val()) {
                        a = $(this).data("text");
                        d = $(this).data("country-exclusion");
                    }
                });
            }
            if (w.data("destination") && y.val() !== "") {
                t.each(function() {
                    if ($(this).data("text") === y.val()) {
                        f = $(this).data("text");
                        p = $(this).data("country-exclusion");
                    }
                });
            }
            var v = z.autocomplete({
                minLength: 0,
                open: r.options.open,
                change: r.options.change,
                select: r.options.select,
                close: r.options.close,
                search: r.options.search,
                response: r.options.response,
                source: function(E, D) {
                    var J = []
                      , K = [];
                    if (w.data("origin")) {
                        if ($("body").hasClass("multi-city-page")) {
                            var I = w.closest(".form-group-1").find("[data-destination]");
                        } else {
                            var I = w.closest("form").find("[data-destination]");
                        }
                        var A;
                        if (I.find("input").length > 1) {
                            A = I.find("input")[1].value;
                        } else {
                            A = I.find("input").val();
                        }
                        if (A) {
                            if (A.indexOf("-") != -1) {
                                var F = A.lastIndexOf("-");
                                A = A.substring(F + 1, F + 5).trim();
                            }
                            p = I.find("select").find("option[value=" + A + "]").data("country-exclusion");
                            f = I.find("select").find("option[value=" + A + "]").data("text");
                        } else {
                            p = "";
                            f = "";
                        }
                        if (p && p !== "") {
                            p.indexOf(",") === -1 ? K.push(p) : K = p.split(",");
                        }
                        if (f && f !== "") {
                            K.push(f);
                        }
                    }
                    if (w.data("destination")) {
                        if ($("body").hasClass("multi-city-page")) {
                            var B = w.closest(".form-group-1").find("[data-origin]");
                        } else {
                            var B = w.closest("form").find("[data-origin]");
                        }
                        var A;
                        if (B.find("input").length > 1) {
                            A = B.find("input")[1].value;
                            if (A == "") {
                                A = B.find("input")[0].value;
                            }
                        } else {
                            A = B.find("input").val();
                        }
                        if (A) {
                            if (A.indexOf("-") != -1) {
                                var F = A.lastIndexOf("-");
                                A = A.substring(F + 1, F + 5).trim();
                            }
                            d = B.find("select").find("option[value=" + A + "]").data("country-exclusion");
                            a = B.find("select").find("option[value=" + A + "]").data("text");
                        } else {
                            d = "";
                            a = "";
                        }
                        if (d && d !== "") {
                            d.indexOf(",") === -1 ? K.push(d) : K = d.split(",");
                        }
                        if (a && a !== "") {
                            K.push(a);
                        }
                    }
                    if (!E.term) {
                        J = n(K, r.airportData);
                        J = j(J);
                        D(l ? J.slice(0, 20) : J);
                        return;
                    }
                    try {
                        r.group = "";
                        var H = new RegExp("(^" + $.ui.autocomplete.escapeRegex(E.term) + ")|(\\s" + $.ui.autocomplete.escapeRegex(E.term) + ")|([(+]" + $.ui.autocomplete.escapeRegex(E.term) + ")","ig");
                        var L = [];
                        if (r.cityData.length) {
                            L = $.grep(r.cityData, function(N) {
                                var M = N.label;
                                return (H.test(M) || H.test(x));
                            });
                        }
                        var G = $.grep(r.airportData, function(O) {
                            var M = O.label;
                            var N = O.countrySelectedcity;
                            if (H.test(M)) {
                                H.lastIndex = 0;
                            }
                            return (H.test(M) || H.test(N));
                        });
                        J = n(K, G);
                        J = j(J);
                        if (L.length) {
                            L = n(K, L);
                            D(l ? L.concat(J).slice(0, 20) : L.concat(J));
                        } else {
                            D(l ? J.slice(0, 20) : J);
                        }
                    } catch (C) {
                        D(l ? r.airportData.slice(0, 20) : r.airportData);
                    }
                },
                position: r.options.position,
                appendTo: r.options.autoCompleteAppendTo
            }).data("ui-autocomplete");
            v._renderItem = function(A, B) {
                if (B.group) {
                    r.group = B.group;
                    return $('<li class="group-item">' + B.group + "</li>").appendTo(A);
                } else {
                    if (B.parent === r.group) {
                        return $('<li class="autocomplete-item">').attr("data-value", B.city).attr("data-key", B.key).append('<a class="autocomplete-link">' + B.city + "</a>").appendTo(A);
                    } else {
                        if (B.parent) {
                            return $('<li class="autocomplete-item redundancy">').attr("data-value", B.city).attr("data-key", B.key).append('<a class="autocomplete-link">' + B.city + "</a>").prependTo(A);
                        }
                    }
                    return $('<li class="autocomplete-item">').attr("data-value", B.city).attr("data-key", B.key).append('<a class="autocomplete-link">' + B.city + "</a>").appendTo(A);
                }
            }
            ;
            v._resizeMenu = function() {
                this.menu.element.outerWidth(w.outerWidth() + r.options.setWidth);
            }
            ;
            v._move = function(F) {
                var J, C, G = false, E = this.menu.element.data("jsp"), H = $(), B = null, A = E.getContentPositionY();
                var D = this.menu.element.find("li.autocomplete-item");
                var I = 0;
                switch (F) {
                case "next":
                    if (this.element.val() === "") {
                        E.scrollToY(0);
                        H = D.first();
                        J = H.addClass("active").data("ui-autocomplete-item");
                    } else {
                        C = D.filter("li.autocomplete-item.active").removeClass("active");
                        I = D.index(C);
                        H = D.eq(I + 1);
                        J = H.removeClass("active").addClass("active").data("ui-autocomplete-item");
                    }
                    if (!J) {
                        G = true;
                        H = D.removeClass("active").first();
                        J = H.addClass("active").data("ui-autocomplete-item");
                    }
                    this.term = J.value;
                    r.group = "";
                    this.element.val(this.term);
                    if (G) {
                        E.scrollToY(0);
                        G = false;
                    } else {
                        A = E.getContentPositionY();
                        B = H.position().top + H.innerHeight();
                        if (B - this.menu.element.height() > A) {
                            E.scrollToY(Math.max(0, B - this.menu.element.height()));
                        }
                    }
                    $("#wcag-custom-select").html(J.value);
                    break;
                case "previous":
                    if (this.element.val() === "") {
                        G = true;
                        J = D.last().addClass("active").data("ui-autocomplete-item");
                    } else {
                        C = D.filter("li.autocomplete-item.active").removeClass("active");
                        I = D.index(C);
                        if (I - 1 < 0) {
                            H = $();
                        } else {
                            H = D.eq(I - 1);
                        }
                        J = H.removeClass("active").addClass("active").data("ui-autocomplete-item");
                    }
                    if (!J) {
                        G = true;
                        J = D.removeClass("active").last().addClass("active").data("ui-autocomplete-item");
                    }
                    this.term = J.value;
                    r.group = "";
                    this.element.val(this.term);
                    if (G) {
                        E.scrollToY(this.menu.element.find(".jspPane").height());
                        G = false;
                    } else {
                        A = E.getContentPositionY();
                        if (H.position().top <= A) {
                            E.scrollToY(H.position().top);
                        }
                    }
                    $("#wcag-custom-select").html(J.value);
                    break;
                }
            }
            ;
            z.autocomplete("widget").addClass("autocomplete-menu");
            z.off("blur.autocomplete");
            z.off("focus.highlight").on("focus.highlight", function() {
                var A = $(this);
                r.winW = h.width();
                A.closest(".custom-select").addClass("focus");
                if (b.vars.isIE() && b.vars.isIE() < 9) {
                    if ($("ul.ui-autocomplete:visible").length && $("ul.ui-autocomplete:visible").not(z.autocomplete("widget")).length) {
                        $("ul.ui-autocomplete:visible").not(z.autocomplete("widget")).data("input").autocomplete("close");
                    }
                    k.off("click.hideAutocompleteCity").on("click.hideAutocompleteCity", function(B) {
                        if (!$(B.target).closest(".ui-autocomplete").length && !$(B.target).is(".ui-autocomplete-input")) {
                            z.closest(".custom-select").removeClass("focus");
                            z.autocomplete("close");
                        }
                    });
                }
                SIA.WcagGlobal.customSelectAriaLive(z.closest(".custom-select .select__text"));
                h.off("resize.blur" + u).on("resize.blur" + u, function() {
                    clearTimeout(r.timerResize);
                    r.timerResize = setTimeout(function() {
                        if (r.winW !== h.width()) {
                            z.blur();
                        }
                    }, 100);
                });
            });
            z.off("blur.highlight").on("blur.highlight", function() {
                r.timer = setTimeout(function() {
                    z.closest(".custom-select").removeClass("focus");
                    z.autocomplete("close");
                }, 200);
                h.off("resize.blur" + u);
            });
            z.autocomplete("widget").off("click.clearTimeout").on("click.clearTimeout", function() {
                clearTimeout(r.timer);
            });
            z.off("keypress.preventDefault").on("keypress.preventDefault", function(A) {
                if (A.which === 13) {
                    A.preventDefault();
                    if (z.autocomplete("widget").find("li").length === 1) {
                        z.autocomplete("widget").find("li").trigger("click");
                        return;
                    }
                    z.autocomplete("widget").find("li.active").trigger("click");
                }
            });
            w.children(".ico-dropdown").off("click.triggerAutocomplete").on("click.triggerAutocomplete", function(A) {
                A.preventDefault();
                clearTimeout(r.timer);
                if (z.closest(".custom-select").hasClass("focus")) {
                    z.trigger("blur.highlight");
                } else {
                    z.trigger("focus.highlight");
                }
            });
        });
        o();
    };
    var e = function() {
        var s = g.find("[data-autocomplete]");
        var t = null;
        var r = c.template.loadingStatus;
        var q = (b.vars.isIE() && b.vars.isIE() < 9);
        if (q) {
            r = $(r).appendTo(g);
        }
        if (s.length) {
            s.each(function() {
                var B = $(this)
                  , A = B.find("input:text");
                if (B.data("init-automcomplete")) {
                    return;
                }
                if (B.find("input:text").is("[readonly]")) {
                    B.find("input:text").off("focus").off("click");
                    return;
                }
                var z = B.find("select");
                var C = z.children();
                var x = [];
                var u = [];
                var y = null;
                B.data("minLength", 2);
                B.data("init-automcomplete", true);
                B.find("input:text").focus(function() {});
                if (z.data("city-group")) {
                    var w = function(D) {
                        D.each(function() {
                            x.push({
                                city: $(this).text(),
                                label: $(this).text(),
                                value: $(this).data("text"),
                                parent: $(this).parent().attr("label"),
                                key: $(this).val(),
                                country: $(this).data("country"),
                                countryExclusion: $(this).data("country-exclusion")
                            });
                            u.push({
                                city: $(this).text(),
                                label: $(this).data("text"),
                                value: $(this).data("text"),
                                key: $(this).val(),
                                country: $(this).data("country"),
                                countryExclusion: $(this).data("country-exclusion")
                            });
                        });
                    };
                    C.each(function() {
                        var D = $(this);
                        if (D.attr("label")) {
                            x.push({
                                city: D.attr("label"),
                                label: D.attr("label"),
                                group: D.attr("label"),
                                value: D.attr("label"),
                                key: $(this).val()
                            });
                        } else {
                            x.push({
                                city: D.text(),
                                label: D.text(),
                                value: D.data("text"),
                                key: $(this).val()
                            });
                        }
                        if (D.children().length) {
                            w(D.children());
                        }
                    });
                } else {
                    C.each(function() {
                        x.push({
                            city: $(this).text(),
                            label: $(this).text(),
                            value: $(this).text(),
                            key: $(this).val(),
                            country: $(this).data("country"),
                            countryExclusion: $(this).data("country-exclusion")
                        });
                    });
                }
                z.off("change.selectCity").on("change.selectCity", function() {
                    z.closest("[data-autocomplete]").find("input").val(z.find(":selected").data("text"));
                });
                var v = false;
                B.parents().each(function() {
                    v = $(this).css("position") === "fixed";
                    return !v;
                });
                m({
                    autocompleteFields: B.find("input:text"),
                    autoCompleteAppendTo: g,
                    airportData: x,
                    cityData: u,
                    position: v ? {
                        collision: "flip"
                    } : {
                        my: "left top",
                        at: "left bottom",
                        collision: "none"
                    },
                    open: function() {
                        var D = $(this);
                        D.autocomplete("widget").find(".redundancy").remove();
                        clearTimeout(y);
                        if (v) {
                            D.autocomplete("widget").css({
                                position: "fixed"
                            });
                        }
                        D.autocomplete("widget").jScrollPane({
                            scrollPagePercent: 10
                        }).off("mousewheel.preventScroll").on("mousewheel.preventScroll", function(E) {
                            E.preventDefault();
                        });
                    },
                    response: function(D, E) {
                        if (!E.content.length) {
                            E.content.push({
                                city: L10n.globalSearch.noMatches,
                                label: L10n.globalSearch.noMatches,
                                value: null
                            });
                        }
                    },
                    search: function() {
                        var D = $(this);
                        D.autocomplete("widget").removeData("jsp").off("mousewheel.preventScroll");
                    },
                    close: function() {
                        var D = $(this);
                        D.autocomplete("widget").removeData("jsp").off("mousewheel.preventScroll");
                        D.closest("[data-autocomplete]").removeClass("focus");
                        if (b.vars.isIE() && b.vars.isIE() < 9) {
                            k.off("click.hideAutocompleteCity");
                        }
                        if (!D.val() || D.val() === D.attr("placeholder")) {
                            D.closest("[data-autocomplete]").addClass("default");
                        }
                        y = setTimeout(function() {
                            D.blur();
                            D.addClear("hide");
                        }, 200);
                        if (D.data("autopopulate")) {
                            if (D.val().indexOf("British National") == -1) {
                                $(D.data("autopopulate")).val(D.val()).closest("[data-autocomplete]").removeClass("default");
                                if (D.parents(".grid-col").hasClass("error")) {
                                    $(D.data("autopopulate")).valid();
                                }
                            }
                        }
                        $("#wcag-custom-select").html(D.val());
                        if (D.data("autopopulateholder")) {
                            D.val(D.val() || D.data("autopopulateholder")).closest("[data-autocomplete]").removeClass("default");
                            D.valid();
                        }
                    },
                    select: function(F, G) {
                        var D = $(this)
                          , I = D.parents("[data-autocomplete]");
                        if (!G.item.value) {
                            window.setTimeout(function() {
                                D.trigger("blur.triggerByGroupValidate");
                            }, 400);
                            return;
                        } else {
                            if (D.closest("#travel-widget").data("widget-v1") || D.closest("#travel-widget").data("widget-v2")) {
                                $("#travel-widget .from-select, #travel-widget .to-select").not(I).removeClass("default");
                                if (I.is(".from-select")) {
                                    $("#travel-widget .from-select").not(I).find("input").val(G.item.value);
                                } else {
                                    if (I.is(".to-select")) {
                                        $("#travel-widget .to-select").not(I).find("input").val(G.item.value);
                                    }
                                }
                            }
                        }
                        var H = D.closest("div");
                        D.closest("[data-autocomplete]").removeClass("default");
                        if (q) {
                            r.css({
                                width: H.outerWidth(true),
                                height: H.outerHeight(true),
                                top: H.offset().top,
                                left: H.offset().left,
                                display: "block"
                            });
                        }
                        if (D.parents(".from-select").length) {
                            d = G.item.countryExclusion;
                            a = G.item.value;
                            D.closest(".form-group").data("change", true);
                            if (D.parents(".from-to-container").find(".to-select").length) {
                                if (window.navigator.msMaxTouchPoints) {
                                    D.blur();
                                    clearTimeout(t);
                                    t = setTimeout(function() {
                                        D.parents(".from-to-container").find(".to-select .ico-dropdown").trigger("click.triggerAutocomplete");
                                    }, 500);
                                } else {
                                    clearTimeout(t);
                                    t = setTimeout(function() {
                                        D.parents(".from-to-container").find(".to-select .ico-dropdown").trigger("click.triggerAutocomplete");
                                    }, 100);
                                }
                            } else {
                                if (window.navigator.msMaxTouchPoints) {
                                    D.blur();
                                    clearTimeout(t);
                                    t = setTimeout(function() {
                                        D.closest("form").find("[data-return-flight]").find("[data-start-date]").closest(".input-3").trigger("click.showDatepicker");
                                    }, 500);
                                } else {
                                    clearTimeout(t);
                                    t = setTimeout(function() {
                                        D.closest("form").find("[data-return-flight]").find("[data-start-date]").closest(".input-3").trigger("click.showDatepicker");
                                    }, 100);
                                }
                            }
                        }
                        if (D.parents(".to-select").length) {
                            p = G.item.countryExclusion;
                            f = G.item.value;
                            if ($("#travel-radio-4").length && $("#travel-radio-5").length && ($("#travel-radio-4").is(":visible") || $("#travel-radio-5").is(":visible"))) {
                                if (D.is("#city-2")) {
                                    clearTimeout(t);
                                    t = setTimeout(function() {
                                        if ($("#travel-radio-4").is(":checked")) {
                                            $("#travel-start-day").focus();
                                        } else {
                                            if ($("#travel-radio-5").is(":checked")) {
                                                D.closest(".form-group").siblings("[data-target]").find("[data-oneway]").focus();
                                            }
                                        }
                                    }, 100);
                                }
                            } else {
                                if (D.closest("form").find("[data-return-flight]").length) {
                                    if (window.navigator.msMaxTouchPoints) {
                                        D.blur();
                                        clearTimeout(t);
                                        t = setTimeout(function() {
                                            if (D.closest("form").find("[data-return-flight]").find("[data-start-date]").is(":visible")) {
                                                D.closest("form").find("[data-return-flight]").find("[data-start-date]").focus();
                                            } else {
                                                D.closest("form").find(".form-group").find("[data-oneway]").focus();
                                            }
                                        }, 500);
                                    } else {
                                        clearTimeout(t);
                                        t = setTimeout(function() {
                                            if (D.closest("form").find("[data-return-flight]").find("[data-start-date]").is(":visible")) {
                                                D.closest("form").find("[data-return-flight]").find("[data-start-date]").focus();
                                            } else {
                                                D.closest("form").find(".form-group").find("[data-oneway]").focus();
                                            }
                                        }, 100);
                                    }
                                } else {
                                    if (D.closest("form").find(".form-group").length) {
                                        if (window.navigator.msMaxTouchPoints) {
                                            D.blur();
                                            clearTimeout(t);
                                            t = setTimeout(function() {
                                                D.closest("form").find(".form-group").find("[data-oneway]").focus();
                                            }, 500);
                                        } else {
                                            clearTimeout(t);
                                            t = setTimeout(function() {
                                                if (!$("body").hasClass("multi-city-promo-page")) {
                                                    D.closest("form").find(".form-group").find("[data-oneway]").focus();
                                                } else {
                                                    D.closest(".form-group").find("[data-oneway]").focus();
                                                }
                                            }, 100);
                                        }
                                    } else {
                                        if (D.parents(".from-to-container").children("[data-trigger-date]").length) {
                                            if (window.navigator.msMaxTouchPoints) {
                                                D.blur();
                                                clearTimeout(t);
                                                t = setTimeout(function() {
                                                    D.parents(".from-to-container").children("[data-trigger-date]").find("[data-oneway]").focus();
                                                }, 500);
                                            } else {
                                                clearTimeout(t);
                                                t = setTimeout(function() {
                                                    D.parents(".from-to-container").children("[data-trigger-date]").find("[data-oneway]").focus();
                                                }, 100);
                                            }
                                        } else {
                                            if (D.closest("[data-flight-schedule]").length) {
                                                var E = D.closest("[data-flight-schedule]");
                                                if (E.find("[data-return-flight]").length) {
                                                    clearTimeout(t);
                                                    t = setTimeout(function() {
                                                        E.find("[data-start-date]").focus();
                                                    }, 500);
                                                } else {
                                                    if (E.find("[data-oneway]").length) {
                                                        clearTimeout(t);
                                                        t = setTimeout(function() {
                                                            E.find("[data-oneway]").focus();
                                                        }, 500);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        setTimeout(function() {
                            if (D.closest("form").data("validator")) {
                                D.valid();
                            }
                            D.closest("[data-autocomplete]").siblings(".mobile").find(".select__text").text(G.city).siblings("select").val(G.value);
                            D.trigger("change.programCode");
                        }, 200);
                    },
                    setWidth: 0
                });
                if (A.val() === "" || A.val() === A.attr("placeholder")) {
                    B.closest("[data-autocomplete]").addClass("default");
                } else {
                    B.closest("[data-autocomplete]").removeClass("default");
                }
            });
        }
    };
    var n = function(r, q) {
        var t = q;
        var s = [];
        _.each(r, function(v, u) {
            s = $.grep(t, function(w) {
                if (u !== r.length - 1) {
                    if (w.country) {
                        return w.country !== v;
                    }
                } else {
                    if (w.value) {}
                }
                return w;
            });
            t = s;
        });
        return t;
    };
    var j = function(r) {
        var s = true;
        _.each(r, function(t) {
            s = t.value ? true : false;
        });
        if (!s) {
            r = [];
        }
        var q = [];
        _.each(r, function(t) {
            !t.value ? q.push(t.label) : "";
        });
        _.each(q, function(v) {
            var u = false;
            for (var t = 0; t < r.length; t++) {
                if (r[t].parent === v) {
                    u = true;
                    break;
                }
            }
            if (!u) {
                _.each(r, function(x, w) {
                    if (x.label === v) {
                        r.splice(w, 1);
                    }
                });
            }
        });
        return r;
    };
    var o = function() {
        $("[data-autocomplete]").each(function() {
            var r = $(this)
              , t = r.find("input")
              , q = r.find(".add-clear-text")
              , s = null;
            if (s) {
                clearTimeout(s);
            }
            s = setTimeout(function() {
                if (r.data("origin")) {
                    t.off("keyup.resetAvailableFlight").on("keyup.resetAvailableFlight", function(u) {
                        if (u.keyCode === 8) {
                            d = "";
                            a = "";
                        }
                    });
                    q.off("click.resetAvailableFlight").on("click.resetAvailableFlight", function() {
                        d = "";
                        a = "";
                    });
                }
                if (r.data("destination")) {
                    t.off("keyup.resetAvailableFlight").on("keyup.resetAvailableFlight", function(u) {
                        if (u.keyCode === 8) {
                            p = "";
                            f = "";
                        }
                    });
                    q.off("click.resetAvailableFlight").on("click.resetAvailableFlight", function() {
                        p = "";
                        f = "";
                    });
                }
            }, 1000);
        });
    };
    e();
}
;
SIA.forceInput = function() {
    var b = $("[data-rule-digits]");
    var a = $("[data-rule-onlycharacter]");
    a.off("keydown.forceInput").on("keydown.forceInput", function(f) {
        var d = f.keyCode;
        var c = [9, 8, 32, 37, 39, 46, 13];
        if (d === 9 && f.shiftKey) {
            return true;
        }
        if (c.indexOf(d) >= 0) {
            return true;
        }
        if (d < 65 || d > 90) {
            f.preventDefault();
        }
    });
    b.off("keydown.forceInput").on("keydown.forceInput", function(f) {
        var d = f.keyCode;
        var c = [9, 8, 37, 39, 46, 13];
        if (d === 9 && f.shiftKey) {
            return true;
        }
        if (f.shiftKey || f.altKey) {
            f.preventDefault();
        }
        if (d == 17 || d == 86 || d == 67) {
            return true;
        }
        if (c.indexOf(d) >= 0) {
            return true;
        }
        if ((d > 47 && d < 58) || (d > 95 && d < 106)) {
            return true;
        }
        f.preventDefault();
    });
}
;
(function(e, b, f) {
    var d = "checkChange";
    function a(h, g) {
        this.element = e(h);
        this.options = e.extend({}, e.fn[d].defaults, g);
        this.init();
    }
    function c(g) {
        b.onbeforeunload = b.onbeforeunload || function(i) {
            i = i || b.event;
            var h = g.desktopMessage;
            if (i) {
                i.returnValue = h;
            }
            return h;
        }
        ;
    }
    a.prototype = {
        init: function() {
            var h = this;
            if (h.element.data("check-change") === "important") {
                c(h.options);
            }
            h.element.on("change." + d, ":input", function() {
                c(h.options);
            });
            if (h.element.is("form")) {
                h.element.on("submit." + d, function() {
                    if (h.element.data("validator")) {
                        if (h.element.data("validator").checkForm()) {
                            b.onbeforeunload = null;
                        }
                    } else {
                        b.onbeforeunload = null;
                    }
                }).on("reset." + d, function() {
                    if (h.element.data("check-change") !== "important") {
                        b.onbeforeunload = null;
                    }
                });
            }
            var g = e(".popup--unload");
            if (!g.data("Popup")) {
                g.Popup({
                    overlayBGTemplate: SIA.global.config.template.overlay,
                    modalShowClass: "",
                    triggerCloseModal: ".popup__close, [data-close]"
                });
            }
            e("body").off("click.leave-page").on("click.leave-page", h.options.prompClass, function(l) {
                l.preventDefault();
                var j = e(this);
                var i = j.attr("href");
                var k = j.attr("target");
                g.find("[data-confirm]").off("click.unload").on("click.unload", function() {
                    b.onbeforeunload = null;
                    if (i && i.indexOf("#") === 0) {
                        if (e(i).length) {
                            e("html, body").scrollTop(e(i).offset().top);
                        }
                    } else {
                        if (k && k === "_blank") {
                            b.open(i, k);
                        } else {
                            b.location.href = i;
                        }
                    }
                    g.Popup("hide");
                });
                g.Popup("show");
            });
        },
        changed: function() {
            c(this.options);
        },
        destroy: function() {
            e.removeData(this.element[0], d);
        }
    };
    e.fn[d] = function(g, h) {
        return this.each(function() {
            var i = e.data(this, d);
            if (!i) {
                e.data(this, d, new a(this,g));
            } else {
                if (i[g]) {
                    i[g](h);
                }
            }
        });
    }
    ;
    e.fn[d].defaults = {
        prompClass: "a.prompt-user",
        desktopMessage: "By choosing to leave this page, your selections will no longer be valid and you'll have to start over.",
        iOsMessage: "By choosing to leave this page, your selections will no longer be valid and you'll have to start over."
    };
}(jQuery, window));
SIA.FormCheckChange = function() {
    window.formsToCheck = window.formsToCheck || [];
    $("[data-check-change]").checkChange();
}
;
SIA.FormCheckChange();
(function() {
    var w = this;
    var k = w._;
    var D = {};
    var C = Array.prototype
      , f = Object.prototype
      , r = Function.prototype;
    var H = C.push
      , o = C.slice
      , y = C.concat
      , d = f.toString
      , j = f.hasOwnProperty;
    var L = C.forEach
      , q = C.map
      , E = C.reduce
      , c = C.reduceRight
      , b = C.filter
      , B = C.every
      , p = C.some
      , n = C.indexOf
      , l = C.lastIndexOf
      , u = Array.isArray
      , e = Object.keys
      , F = r.bind;
    var M = function(N) {
        if (N instanceof M) {
            return N;
        }
        if (!(this instanceof M)) {
            return new M(N);
        }
        this._wrapped = N;
    };
    if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = M;
        }
        exports._ = M;
    } else {
        w._ = M;
    }
    M.VERSION = "1.6.0";
    var I = M.each = M.forEach = function(S, P, O) {
        if (S == null) {
            return S;
        }
        if (L && S.forEach === L) {
            S.forEach(P, O);
        } else {
            if (S.length === +S.length) {
                for (var N = 0, R = S.length; N < R; N++) {
                    if (P.call(O, S[N], N, S) === D) {
                        return;
                    }
                }
            } else {
                var Q = M.keys(S);
                for (var N = 0, R = Q.length; N < R; N++) {
                    if (P.call(O, S[Q[N]], Q[N], S) === D) {
                        return;
                    }
                }
            }
        }
        return S;
    }
    ;
    M.map = M.collect = function(Q, P, O) {
        var N = [];
        if (Q == null) {
            return N;
        }
        if (q && Q.map === q) {
            return Q.map(P, O);
        }
        I(Q, function(T, R, S) {
            N.push(P.call(O, T, R, S));
        });
        return N;
    }
    ;
    var g = "Reduce of empty array with no initial value";
    M.reduce = M.foldl = M.inject = function(R, Q, N, P) {
        var O = arguments.length > 2;
        if (R == null) {
            R = [];
        }
        if (E && R.reduce === E) {
            if (P) {
                Q = M.bind(Q, P);
            }
            return O ? R.reduce(Q, N) : R.reduce(Q);
        }
        I(R, function(U, S, T) {
            if (!O) {
                N = U;
                O = true;
            } else {
                N = Q.call(P, N, U, S, T);
            }
        });
        if (!O) {
            throw new TypeError(g);
        }
        return N;
    }
    ;
    M.reduceRight = M.foldr = function(T, Q, N, P) {
        var O = arguments.length > 2;
        if (T == null) {
            T = [];
        }
        if (c && T.reduceRight === c) {
            if (P) {
                Q = M.bind(Q, P);
            }
            return O ? T.reduceRight(Q, N) : T.reduceRight(Q);
        }
        var S = T.length;
        if (S !== +S) {
            var R = M.keys(T);
            S = R.length;
        }
        I(T, function(W, U, V) {
            U = R ? R[--S] : --S;
            if (!O) {
                N = T[U];
                O = true;
            } else {
                N = Q.call(P, N, T[U], U, V);
            }
        });
        if (!O) {
            throw new TypeError(g);
        }
        return N;
    }
    ;
    M.find = M.detect = function(Q, O, P) {
        var N;
        A(Q, function(T, R, S) {
            if (O.call(P, T, R, S)) {
                N = T;
                return true;
            }
        });
        return N;
    }
    ;
    M.filter = M.select = function(Q, N, P) {
        var O = [];
        if (Q == null) {
            return O;
        }
        if (b && Q.filter === b) {
            return Q.filter(N, P);
        }
        I(Q, function(T, R, S) {
            if (N.call(P, T, R, S)) {
                O.push(T);
            }
        });
        return O;
    }
    ;
    M.reject = function(P, N, O) {
        return M.filter(P, function(S, Q, R) {
            return !N.call(O, S, Q, R);
        }, O);
    }
    ;
    M.every = M.all = function(Q, O, P) {
        O || (O = M.identity);
        var N = true;
        if (Q == null) {
            return N;
        }
        if (B && Q.every === B) {
            return Q.every(O, P);
        }
        I(Q, function(T, R, S) {
            if (!(N = N && O.call(P, T, R, S))) {
                return D;
            }
        });
        return !!N;
    }
    ;
    var A = M.some = M.any = function(Q, O, P) {
        O || (O = M.identity);
        var N = false;
        if (Q == null) {
            return N;
        }
        if (p && Q.some === p) {
            return Q.some(O, P);
        }
        I(Q, function(T, R, S) {
            if (N || (N = O.call(P, T, R, S))) {
                return D;
            }
        });
        return !!N;
    }
    ;
    M.contains = M.include = function(O, N) {
        if (O == null) {
            return false;
        }
        if (n && O.indexOf === n) {
            return O.indexOf(N) != -1;
        }
        return A(O, function(P) {
            return P === N;
        });
    }
    ;
    M.invoke = function(P, Q) {
        var N = o.call(arguments, 2);
        var O = M.isFunction(Q);
        return M.map(P, function(R) {
            return (O ? Q : R[Q]).apply(R, N);
        });
    }
    ;
    M.pluck = function(O, N) {
        return M.map(O, M.property(N));
    }
    ;
    M.where = function(O, N) {
        return M.filter(O, M.matches(N));
    }
    ;
    M.findWhere = function(O, N) {
        return M.find(O, M.matches(N));
    }
    ;
    M.max = function(R, P, O) {
        if (!P && M.isArray(R) && R[0] === +R[0] && R.length < 65535) {
            return Math.max.apply(Math, R);
        }
        var N = -Infinity
          , Q = -Infinity;
        I(R, function(V, S, U) {
            var T = P ? P.call(O, V, S, U) : V;
            if (T > Q) {
                N = V;
                Q = T;
            }
        });
        return N;
    }
    ;
    M.min = function(R, P, O) {
        if (!P && M.isArray(R) && R[0] === +R[0] && R.length < 65535) {
            return Math.min.apply(Math, R);
        }
        var N = Infinity
          , Q = Infinity;
        I(R, function(V, S, U) {
            var T = P ? P.call(O, V, S, U) : V;
            if (T < Q) {
                N = V;
                Q = T;
            }
        });
        return N;
    }
    ;
    M.shuffle = function(Q) {
        var P;
        var O = 0;
        var N = [];
        I(Q, function(R) {
            P = M.random(O++);
            N[O - 1] = N[P];
            N[P] = R;
        });
        return N;
    }
    ;
    M.sample = function(O, P, N) {
        if (P == null || N) {
            if (O.length !== +O.length) {
                O = M.values(O);
            }
            return O[M.random(O.length - 1)];
        }
        return M.shuffle(O).slice(0, Math.max(0, P));
    }
    ;
    var a = function(N) {
        if (N == null) {
            return M.identity;
        }
        if (M.isFunction(N)) {
            return N;
        }
        return M.property(N);
    };
    M.sortBy = function(P, O, N) {
        O = a(O);
        return M.pluck(M.map(P, function(S, Q, R) {
            return {
                value: S,
                index: Q,
                criteria: O.call(N, S, Q, R)
            };
        }).sort(function(T, S) {
            var R = T.criteria;
            var Q = S.criteria;
            if (R !== Q) {
                if (R > Q || R === void 0) {
                    return 1;
                }
                if (R < Q || Q === void 0) {
                    return -1;
                }
            }
            return T.index - S.index;
        }), "value");
    }
    ;
    var t = function(N) {
        return function(R, Q, P) {
            var O = {};
            Q = a(Q);
            I(R, function(U, S) {
                var T = Q.call(P, U, S, R);
                N(O, T, U);
            });
            return O;
        }
        ;
    };
    M.groupBy = t(function(N, O, P) {
        M.has(N, O) ? N[O].push(P) : N[O] = [P];
    });
    M.indexBy = t(function(N, O, P) {
        N[O] = P;
    });
    M.countBy = t(function(N, O) {
        M.has(N, O) ? N[O]++ : N[O] = 1;
    });
    M.sortedIndex = function(U, T, Q, P) {
        Q = a(Q);
        var S = Q.call(P, T);
        var N = 0
          , R = U.length;
        while (N < R) {
            var O = (N + R) >>> 1;
            Q.call(P, U[O]) < S ? N = O + 1 : R = O;
        }
        return N;
    }
    ;
    M.toArray = function(N) {
        if (!N) {
            return [];
        }
        if (M.isArray(N)) {
            return o.call(N);
        }
        if (N.length === +N.length) {
            return M.map(N, M.identity);
        }
        return M.values(N);
    }
    ;
    M.size = function(N) {
        if (N == null) {
            return 0;
        }
        return (N.length === +N.length) ? N.length : M.keys(N).length;
    }
    ;
    M.first = M.head = M.take = function(P, O, N) {
        if (P == null) {
            return void 0;
        }
        if ((O == null) || N) {
            return P[0];
        }
        if (O < 0) {
            return [];
        }
        return o.call(P, 0, O);
    }
    ;
    M.initial = function(P, O, N) {
        return o.call(P, 0, P.length - ((O == null) || N ? 1 : O));
    }
    ;
    M.last = function(P, O, N) {
        if (P == null) {
            return void 0;
        }
        if ((O == null) || N) {
            return P[P.length - 1];
        }
        return o.call(P, Math.max(P.length - O, 0));
    }
    ;
    M.rest = M.tail = M.drop = function(P, O, N) {
        return o.call(P, (O == null) || N ? 1 : O);
    }
    ;
    M.compact = function(N) {
        return M.filter(N, M.identity);
    }
    ;
    var x = function(O, P, N) {
        if (P && M.every(O, M.isArray)) {
            return y.apply(N, O);
        }
        I(O, function(Q) {
            if (M.isArray(Q) || M.isArguments(Q)) {
                P ? H.apply(N, Q) : x(Q, P, N);
            } else {
                N.push(Q);
            }
        });
        return N;
    };
    M.flatten = function(O, N) {
        return x(O, N, []);
    }
    ;
    M.without = function(N) {
        return M.difference(N, o.call(arguments, 1));
    }
    ;
    M.partition = function(Q, N) {
        var P = []
          , O = [];
        I(Q, function(R) {
            (N(R) ? P : O).push(R);
        });
        return [P, O];
    }
    ;
    M.uniq = M.unique = function(T, S, R, Q) {
        if (M.isFunction(S)) {
            Q = R;
            R = S;
            S = false;
        }
        var O = R ? M.map(T, R, Q) : T;
        var P = [];
        var N = [];
        I(O, function(V, U) {
            if (S ? (!U || N[N.length - 1] !== V) : !M.contains(N, V)) {
                N.push(V);
                P.push(T[U]);
            }
        });
        return P;
    }
    ;
    M.union = function() {
        return M.uniq(M.flatten(arguments, true));
    }
    ;
    M.intersection = function(O) {
        var N = o.call(arguments, 1);
        return M.filter(M.uniq(O), function(P) {
            return M.every(N, function(Q) {
                return M.contains(Q, P);
            });
        });
    }
    ;
    M.difference = function(O) {
        var N = y.apply(C, o.call(arguments, 1));
        return M.filter(O, function(P) {
            return !M.contains(N, P);
        });
    }
    ;
    M.zip = function() {
        var P = M.max(M.pluck(arguments, "length").concat(0));
        var O = new Array(P);
        for (var N = 0; N < P; N++) {
            O[N] = M.pluck(arguments, "" + N);
        }
        return O;
    }
    ;
    M.object = function(R, O) {
        if (R == null) {
            return {};
        }
        var N = {};
        for (var P = 0, Q = R.length; P < Q; P++) {
            if (O) {
                N[R[P]] = O[P];
            } else {
                N[R[P][0]] = R[P][1];
            }
        }
        return N;
    }
    ;
    M.indexOf = function(R, P, Q) {
        if (R == null) {
            return -1;
        }
        var N = 0
          , O = R.length;
        if (Q) {
            if (typeof Q == "number") {
                N = (Q < 0 ? Math.max(0, O + Q) : Q);
            } else {
                N = M.sortedIndex(R, P);
                return R[N] === P ? N : -1;
            }
        }
        if (n && R.indexOf === n) {
            return R.indexOf(P, Q);
        }
        for (; N < O; N++) {
            if (R[N] === P) {
                return N;
            }
        }
        return -1;
    }
    ;
    M.lastIndexOf = function(R, P, Q) {
        if (R == null) {
            return -1;
        }
        var N = Q != null;
        if (l && R.lastIndexOf === l) {
            return N ? R.lastIndexOf(P, Q) : R.lastIndexOf(P);
        }
        var O = (N ? Q : R.length);
        while (O--) {
            if (R[O] === P) {
                return O;
            }
        }
        return -1;
    }
    ;
    M.range = function(S, P, R) {
        if (arguments.length <= 1) {
            P = S || 0;
            S = 0;
        }
        R = arguments[2] || 1;
        var Q = Math.max(Math.ceil((P - S) / R), 0);
        var N = 0;
        var O = new Array(Q);
        while (N < Q) {
            O[N++] = S;
            S += R;
        }
        return O;
    }
    ;
    var G = function() {};
    M.bind = function(Q, O) {
        var N, P;
        if (F && Q.bind === F) {
            return F.apply(Q, o.call(arguments, 1));
        }
        if (!M.isFunction(Q)) {
            throw new TypeError;
        }
        N = o.call(arguments, 2);
        return P = function() {
            if (!(this instanceof P)) {
                return Q.apply(O, N.concat(o.call(arguments)));
            }
            G.prototype = Q.prototype;
            var S = new G;
            G.prototype = null;
            var R = Q.apply(S, N.concat(o.call(arguments)));
            if (Object(R) === R) {
                return R;
            }
            return S;
        }
        ;
    }
    ;
    M.partial = function(N) {
        var O = o.call(arguments, 1);
        return function() {
            var P = 0;
            var Q = O.slice();
            for (var R = 0, S = Q.length; R < S; R++) {
                if (Q[R] === M) {
                    Q[R] = arguments[P++];
                }
            }
            while (P < arguments.length) {
                Q.push(arguments[P++]);
            }
            return N.apply(this, Q);
        }
        ;
    }
    ;
    M.bindAll = function(O) {
        var N = o.call(arguments, 1);
        if (N.length === 0) {
            throw new Error("bindAll must be passed function names");
        }
        I(N, function(P) {
            O[P] = M.bind(O[P], O);
        });
        return O;
    }
    ;
    M.memoize = function(P, O) {
        var N = {};
        O || (O = M.identity);
        return function() {
            var Q = O.apply(this, arguments);
            return M.has(N, Q) ? N[Q] : (N[Q] = P.apply(this, arguments));
        }
        ;
    }
    ;
    M.delay = function(O, P) {
        var N = o.call(arguments, 2);
        return setTimeout(function() {
            return O.apply(null, N);
        }, P);
    }
    ;
    M.defer = function(N) {
        return M.delay.apply(M, [N, 1].concat(o.call(arguments, 1)));
    }
    ;
    M.throttle = function(O, Q, U) {
        var N, S, V;
        var T = null;
        var R = 0;
        U || (U = {});
        var P = function() {
            R = U.leading === false ? 0 : M.now();
            T = null;
            V = O.apply(N, S);
            N = S = null;
        };
        return function() {
            var W = M.now();
            if (!R && U.leading === false) {
                R = W;
            }
            var X = Q - (W - R);
            N = this;
            S = arguments;
            if (X <= 0) {
                clearTimeout(T);
                T = null;
                R = W;
                V = O.apply(N, S);
                N = S = null;
            } else {
                if (!T && U.trailing !== false) {
                    T = setTimeout(P, X);
                }
            }
            return V;
        }
        ;
    }
    ;
    M.debounce = function(P, R, O) {
        var U, T, N, S, V;
        var Q = function() {
            var W = M.now() - S;
            if (W < R) {
                U = setTimeout(Q, R - W);
            } else {
                U = null;
                if (!O) {
                    V = P.apply(N, T);
                    N = T = null;
                }
            }
        };
        return function() {
            N = this;
            T = arguments;
            S = M.now();
            var W = O && !U;
            if (!U) {
                U = setTimeout(Q, R);
            }
            if (W) {
                V = P.apply(N, T);
                N = T = null;
            }
            return V;
        }
        ;
    }
    ;
    M.once = function(P) {
        var N = false, O;
        return function() {
            if (N) {
                return O;
            }
            N = true;
            O = P.apply(this, arguments);
            P = null;
            return O;
        }
        ;
    }
    ;
    M.wrap = function(N, O) {
        return M.partial(O, N);
    }
    ;
    M.compose = function() {
        var N = arguments;
        return function() {
            var O = arguments;
            for (var P = N.length - 1; P >= 0; P--) {
                O = [N[P].apply(this, O)];
            }
            return O[0];
        }
        ;
    }
    ;
    M.after = function(O, N) {
        return function() {
            if (--O < 1) {
                return N.apply(this, arguments);
            }
        }
        ;
    }
    ;
    M.keys = function(P) {
        if (!M.isObject(P)) {
            return [];
        }
        if (e) {
            return e(P);
        }
        var O = [];
        for (var N in P) {
            if (M.has(P, N)) {
                O.push(N);
            }
        }
        return O;
    }
    ;
    M.values = function(R) {
        var Q = M.keys(R);
        var P = Q.length;
        var N = new Array(P);
        for (var O = 0; O < P; O++) {
            N[O] = R[Q[O]];
        }
        return N;
    }
    ;
    M.pairs = function(R) {
        var P = M.keys(R);
        var O = P.length;
        var Q = new Array(O);
        for (var N = 0; N < O; N++) {
            Q[N] = [P[N], R[P[N]]];
        }
        return Q;
    }
    ;
    M.invert = function(R) {
        var N = {};
        var Q = M.keys(R);
        for (var O = 0, P = Q.length; O < P; O++) {
            N[R[Q[O]]] = Q[O];
        }
        return N;
    }
    ;
    M.functions = M.methods = function(P) {
        var O = [];
        for (var N in P) {
            if (M.isFunction(P[N])) {
                O.push(N);
            }
        }
        return O.sort();
    }
    ;
    M.extend = function(N) {
        I(o.call(arguments, 1), function(O) {
            if (O) {
                for (var P in O) {
                    N[P] = O[P];
                }
            }
        });
        return N;
    }
    ;
    M.pick = function(O) {
        var P = {};
        var N = y.apply(C, o.call(arguments, 1));
        I(N, function(Q) {
            if (Q in O) {
                P[Q] = O[Q];
            }
        });
        return P;
    }
    ;
    M.omit = function(P) {
        var Q = {};
        var O = y.apply(C, o.call(arguments, 1));
        for (var N in P) {
            if (!M.contains(O, N)) {
                Q[N] = P[N];
            }
        }
        return Q;
    }
    ;
    M.defaults = function(N) {
        I(o.call(arguments, 1), function(O) {
            if (O) {
                for (var P in O) {
                    if (N[P] === void 0) {
                        N[P] = O[P];
                    }
                }
            }
        });
        return N;
    }
    ;
    M.clone = function(N) {
        if (!M.isObject(N)) {
            return N;
        }
        return M.isArray(N) ? N.slice() : M.extend({}, N);
    }
    ;
    M.tap = function(O, N) {
        N(O);
        return O;
    }
    ;
    var J = function(U, T, O, P) {
        if (U === T) {
            return U !== 0 || 1 / U == 1 / T;
        }
        if (U == null || T == null) {
            return U === T;
        }
        if (U instanceof M) {
            U = U._wrapped;
        }
        if (T instanceof M) {
            T = T._wrapped;
        }
        var R = d.call(U);
        if (R != d.call(T)) {
            return false;
        }
        switch (R) {
        case "[object String]":
            return U == String(T);
        case "[object Number]":
            return U != +U ? T != +T : (U == 0 ? 1 / U == 1 / T : U == +T);
        case "[object Date]":
        case "[object Boolean]":
            return +U == +T;
        case "[object RegExp]":
            return U.source == T.source && U.global == T.global && U.multiline == T.multiline && U.ignoreCase == T.ignoreCase;
        }
        if (typeof U != "object" || typeof T != "object") {
            return false;
        }
        var N = O.length;
        while (N--) {
            if (O[N] == U) {
                return P[N] == T;
            }
        }
        var S = U.constructor
          , Q = T.constructor;
        if (S !== Q && !(M.isFunction(S) && (S instanceof S) && M.isFunction(Q) && (Q instanceof Q)) && ("constructor"in U && "constructor"in T)) {
            return false;
        }
        O.push(U);
        P.push(T);
        var X = 0
          , W = true;
        if (R == "[object Array]") {
            X = U.length;
            W = X == T.length;
            if (W) {
                while (X--) {
                    if (!(W = J(U[X], T[X], O, P))) {
                        break;
                    }
                }
            }
        } else {
            for (var V in U) {
                if (M.has(U, V)) {
                    X++;
                    if (!(W = M.has(T, V) && J(U[V], T[V], O, P))) {
                        break;
                    }
                }
            }
            if (W) {
                for (V in T) {
                    if (M.has(T, V) && !(X--)) {
                        break;
                    }
                }
                W = !X;
            }
        }
        O.pop();
        P.pop();
        return W;
    };
    M.isEqual = function(O, N) {
        return J(O, N, [], []);
    }
    ;
    M.isEmpty = function(O) {
        if (O == null) {
            return true;
        }
        if (M.isArray(O) || M.isString(O)) {
            return O.length === 0;
        }
        for (var N in O) {
            if (M.has(O, N)) {
                return false;
            }
        }
        return true;
    }
    ;
    M.isElement = function(N) {
        return !!(N && N.nodeType === 1);
    }
    ;
    M.isArray = u || function(N) {
        return d.call(N) == "[object Array]";
    }
    ;
    M.isObject = function(N) {
        return N === Object(N);
    }
    ;
    I(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(N) {
        M["is" + N] = function(O) {
            return d.call(O) == "[object " + N + "]";
        }
        ;
    });
    if (!M.isArguments(arguments)) {
        M.isArguments = function(N) {
            return !!(N && M.has(N, "callee"));
        }
        ;
    }
    if (typeof (/./) !== "function") {
        M.isFunction = function(N) {
            return typeof N === "function";
        }
        ;
    }
    M.isFinite = function(N) {
        return isFinite(N) && !isNaN(parseFloat(N));
    }
    ;
    M.isNaN = function(N) {
        return M.isNumber(N) && N != +N;
    }
    ;
    M.isBoolean = function(N) {
        return N === true || N === false || d.call(N) == "[object Boolean]";
    }
    ;
    M.isNull = function(N) {
        return N === null;
    }
    ;
    M.isUndefined = function(N) {
        return N === void 0;
    }
    ;
    M.has = function(O, N) {
        return j.call(O, N);
    }
    ;
    M.noConflict = function() {
        w._ = k;
        return this;
    }
    ;
    M.identity = function(N) {
        return N;
    }
    ;
    M.constant = function(N) {
        return function() {
            return N;
        }
        ;
    }
    ;
    M.property = function(N) {
        return function(O) {
            return O[N];
        }
        ;
    }
    ;
    M.matches = function(N) {
        return function(P) {
            if (P === N) {
                return true;
            }
            for (var O in N) {
                if (N[O] !== P[O]) {
                    return false;
                }
            }
            return true;
        }
        ;
    }
    ;
    M.times = function(R, Q, P) {
        var N = Array(Math.max(0, R));
        for (var O = 0; O < R; O++) {
            N[O] = Q.call(P, O);
        }
        return N;
    }
    ;
    M.random = function(O, N) {
        if (N == null) {
            N = O;
            O = 0;
        }
        return O + Math.floor(Math.random() * (N - O + 1));
    }
    ;
    M.now = Date.now || function() {
        return new Date().getTime();
    }
    ;
    var m = {
        escape: {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;"
        }
    };
    m.unescape = M.invert(m.escape);
    var K = {
        escape: new RegExp("[" + M.keys(m.escape).join("") + "]","g"),
        unescape: new RegExp("(" + M.keys(m.unescape).join("|") + ")","g")
    };
    M.each(["escape", "unescape"], function(N) {
        M[N] = function(O) {
            if (O == null) {
                return "";
            }
            return ("" + O).replace(K[N], function(P) {
                return m[N][P];
            });
        }
        ;
    });
    M.result = function(N, P) {
        if (N == null) {
            return void 0;
        }
        var O = N[P];
        return M.isFunction(O) ? O.call(N) : O;
    }
    ;
    M.mixin = function(N) {
        I(M.functions(N), function(O) {
            var P = M[O] = N[O];
            M.prototype[O] = function() {
                var Q = [this._wrapped];
                H.apply(Q, arguments);
                return s.call(this, P.apply(M, Q));
            }
            ;
        });
    }
    ;
    var z = 0;
    M.uniqueId = function(N) {
        var O = ++z + "";
        return N ? N + O : O;
    }
    ;
    M.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var v = /(.)^/;
    var h = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\t": "t",
        "\u2028": "u2028",
        "\u2029": "u2029"
    };
    var i = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    M.template = function(V, Q, P) {
        var O;
        P = M.defaults({}, P, M.templateSettings);
        var R = new RegExp([(P.escape || v).source, (P.interpolate || v).source, (P.evaluate || v).source].join("|") + "|$","g");
        var S = 0;
        var N = "__p+='";
        V.replace(R, function(X, Y, W, aa, Z) {
            N += V.slice(S, Z).replace(i, function(ab) {
                return "\\" + h[ab];
            });
            if (Y) {
                N += "'+\n((__t=(" + Y + "))==null?'':_.escape(__t))+\n'";
            }
            if (W) {
                N += "'+\n((__t=(" + W + "))==null?'':__t)+\n'";
            }
            if (aa) {
                N += "';\n" + aa + "\n__p+='";
            }
            S = Z + X.length;
            return X;
        });
        N += "';\n";
        if (!P.variable) {
            N = "with(obj||{}){\n" + N + "}\n";
        }
        N = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + N + "return __p;\n";
        try {
            O = new Function(P.variable || "obj","_",N);
        } catch (T) {
            T.source = N;
            throw T;
        }
        if (Q) {
            return O(Q, M);
        }
        var U = function(W) {
            return O.call(this, W, M);
        };
        U.source = "function(" + (P.variable || "obj") + "){\n" + N + "}";
        return U;
    }
    ;
    M.chain = function(N) {
        return M(N).chain();
    }
    ;
    var s = function(N) {
        return this._chain ? M(N).chain() : N;
    };
    M.mixin(M);
    I(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(N) {
        var O = C[N];
        M.prototype[N] = function() {
            var P = this._wrapped;
            O.apply(P, arguments);
            if ((N == "shift" || N == "splice") && P.length === 0) {
                delete P[0];
            }
            return s.call(this, P);
        }
        ;
    });
    I(["concat", "join", "slice"], function(N) {
        var O = C[N];
        M.prototype[N] = function() {
            return s.call(this, O.apply(this._wrapped, arguments));
        }
        ;
    });
    M.extend(M.prototype, {
        chain: function() {
            this._chain = true;
            return this;
        },
        value: function() {
            return this._wrapped;
        }
    });
    if (typeof define === "function" && define.amd) {
        define("underscore", [], function() {
            return M;
        });
    }
}
).call(this);
SIA.MpIceCheckInComplete = function() {
    $(document).on("click", "#btn-go-back", function() {
        window.location.assign("/home.form");
    });
    // to handle MTT mobile app BP print

    /*addbag*/
    var $$this = "";
    var $baggagescope = [];
    var scrollPosition = 0;
    var activeIndex = "";
    var activeBpIndex = "";
    var isIosDevice = typeof window !== 'undefined' && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    /*addbag*/

    /*hc*/
    var html5QrCode = "";
    /*hc*/

    var templateInstance;
    var templateInstance1;
    var updateProfileModel = {
        index: 0,
        isPassportUpdated: false,
        isEmailUpdated: false,
        isNationalityUpdated: false,
        isCORUpdated: false,
        isMobileUpdated: false,
        passPortNumNew: "",
        passPortNumOld: "",
        passPortPlaceNew: "",
        passPortPlaceOld: "",
        passPortExpDtNew: "",
        passPortExpDtOld: "",
        emailOld: "",
        emailNew: "",
        nationalityOld: "",
        nationalityNew: "",
        COROld: "",
        CORNew: "",
        mobOld: "",
        mobNew: "",
        countryCodeOld: "",
        countryCodeNew: ""
    };
    var templateData = {
        bookReference: "",
        departureCity: "",
        noElementSelected: false,
        booleanValue: false,
        completeCheckinFlag: false,
        arrivalCity: "",
        flightSegments: [],
        flightCabinClass: "",
        delayedFlightNotice: "",
        services: "",
        currentSelectedCancelFlights: "",
        bpIssuedCustomerDetails: [],
        essentialInformation: {
            counterOperatingTime: {}
        },
        showTicket: false,
        msgArr: [],
        ticketNumber: "",
        passengerMilesList: [],
        selectedKrisFlyer: "",
        accruableMilage: "",
        loggedIn: false,
        isKrisflyer: false,
        cancelFlag: false,
        sessionTries: 0,
        sessionTriesLimit: 2,
        sessionUrl: (pageData && pageData.sessionExtension && pageData.sessionExtension.sessionExtensionURL) ? pageData.sessionExtension.sessionExtensionURL : '',
        seconds: (pageData && pageData.sessionExtension && pageData.sessionExtension.promptSeconds) ? pageData.sessionExtension.promptSeconds : 300,
        initialDelay: (pageData && pageData.sessionExtension && pageData.sessionExtension.initialDelaySeconds) ? pageData.sessionExtension.initialDelaySeconds : 600,
        expTime: "",
        delaySeconds: "",
        disableSeatFlag: false,
        dgflightlist1: "",
        isGroupBooking: false,
        dgacceptedTerms: false,
        dgeasaacceptedTerms: false,
        isGrbdBooking: false,
        caasAcceptedTerms: false,
        showhc: false,
        /*hc*/
        flightdatahc: "",
        activeCamPax: "",
        updateProfileModel: Object.assign({}, updateProfileModel)//KF-7974
    };
    var getTemplateMethods = function() {
        return {
            toggleAccordion: toggleAccordion,
            updateKFDetails: updateKFDetails,
            //KF-7974
            setCancelCheckInState: setCancelCheckInState,
            setCancelAllCheckInsState: setCancelAllCheckInsState,
            getCancelCheckInReason: getCancelCheckInReason,
            getCancelAllCheckInsReason: getCancelAllCheckInsReason,
            setSelectedCancelFlights: setSelectedCancelFlights,
            setcancelFlag: setcancelFlag,
            getCancelCheckInBoardingPassIssued: getCancelCheckInBoardingPassIssued,
            getPassengerFullNameFromPassengerID: getPassengerFullNameFromPassengerID,
            isKFPPSpopupEnabled: isKFPPSpopupEnabled,
            getCancelDisabledReason: getCancelDisabledReason,
            getCancelCheckinSegmentSelectAllState: getCancelCheckinSegmentSelectAllState,
            cancelFlight: cancelFlight,
            checkAll: checkAll,
            checkSelectAll: checkSelectAll,
            checkSelectAllPassengers: checkSelectAllPassengers,
            canSelectAll: canSelectAll,
            canSelectAllState: canSelectAllState,
            isAdultCheckedInLegs: isAdultCheckedInLegs,
            checkboxIsSelected: checkboxIsSelected,
            onDisabledBoardingPass: onDisabledBoardingPass,
            getFlightSegment: getFlightSegment,
            euFlagCheck: euFlagCheck,
            sinFlagCheck: sinFlagCheck,
            getIndexOfValue: getIndexOfValue,
            changeSeat: changeSeat,
            formatSeatSelected: formatSeatSelected,
            checkAllPassenger: checkAllPassenger,
            getFormattedTerminalNumber: getFormattedTerminalNumber,
            onMileageSubmit: onMileageSubmit,
            getKFTier: getKFTier,
            getClassName: getClassName,
            triggerPopup: triggerPopup,
            baggageAllowance: baggageAllowance,
            toDate: toDate,
            onClickExtendSession: onClickExtendSession,
            initTriggerDgPopupRestriction: initTriggerDgPopupRestriction,
            onClickExtendSessionCancel: onClickExtendSessionCancel,
            redirectToHomePage: redirectToHomePage,
            checkmbDeeplinkEnable: checkmbDeeplinkEnable,
            setdglightboxcheckbox: setdglightboxcheckbox,
            verifyOTP: verifyOTP,
            resendOTP: resendOTP,
            sendByEmail: sendByEmail,
            kfProfileRedirect: kfProfileRedirect,
            openBaggageInfoBox: openBaggageInfoBox,
            closeBaggageInfoBox: closeBaggageInfoBox,
            onClickStart: onClickStart,
            getNameText: getNameText,
            getBaggageAllowanceText: getBaggageAllowanceText,
            showBorder: showBorder,
            onChangeCount: onChangeCount,
            getCombinedData: getCombinedData,
            onChangeCountCombined: onChangeCountCombined,
            getCombinedBaggageAllowanceText: getCombinedBaggageAllowanceText,
            declareBagSubmit: declareBagSubmit,
            onClickAddCombinePax: onClickAddCombinePax,
            multiPaxSubmit: multiPaxSubmit,
            declareBackButton: declareBackButton,
            isBagDeclareEligible: isBagDeclareEligible,
            getPMsg: getPMsg,
            openHCInfoBox: openHCInfoBox,
            closeHCInfoBox: closeHCInfoBox,
            getFromToText: getFromToText,
            openChooseFile: openChooseFile,
            openForScan: openForScan,
            closeScan: closeScan,
            isCamDisable: isCamDisable,
            isCamEnable: isCamEnable,
            isCamEnableError: isCamEnableError,
            accessCamera: accessCamera,
            deleteAddedFile: deleteAddedFile,
            changeVerifyBtn: changeVerifyBtn,
            submitForVerification: submitForVerification,
            isCamEnableErrorTimeout: isCamEnableErrorTimeout
        }
    };
    var getMainMethods = function() {
        return {
            onAddEmail: onAddEmail,
            removeEmailFields: removeEmailFields,
            validateEmail: validateEmail,
            validateEmailBpass: validateEmailBpass,
            onSubmitValidation: onSubmitValidation,
            onSendEmail: onSendEmail,
            onPrintBoardingPass: onPrintBoardingPass,
            focusInput: focusInput,
            focusInputBpass: focusInputBpass,
            getIndexOfValue: getIndexOfValue,
            onAddEmailBoardingPasses: onAddEmailBoardingPasses,
            onSubmitValidationCheckIn: onSubmitValidationCheckIn,
            disablesendbuttoncheck: disablesendbuttoncheck,
            getBpCheckAll: getBpCheckAll,
            updateCheckAll: updateCheckAll,
            AddBpEmailFields: AddBpEmailFields,
            RemoveBpEmailFields: RemoveBpEmailFields
        }
    };

    var getTemplateFilters = function() {
        return {
            dateParser: dateParser,
            timeParser: timeParser,
            numberWithCommas: numberWithCommas
        }
    };
    var onChangeCheck = function() {
        if ($("#checkbox-name-0").is(':checked') == true) {
            $('input:checkbox').prop('checked', true);
            //KF-11336
            $("#adult-passenger-input-1").removeClass('disabled');
            $("#adult-passenger-input-1").removeAttr('disabled');
        } else {

            $('input:checkbox').filter(function() {
                return !this.disabled;
            }).prop('checked', false);

            if (!$("input:checkbox").is(':checked')) {
                $("#adult-passenger-input-1").addClass('disabled');
                $("#adult-passenger-input-1").attr('disabled', 'true');
            }
        }
    };
    var onChangeCheckLower = function() {
        var passportFlag, nationalityFalg, mobileFlag, emailFlag;
        var isChecked = true;
        var lowerChecked = false;
        if ($('input[name="checkbox-name-odd-1"]').length > 0) {
            passportFlag = true;
        }
        if ($('input[name="checkbox-name-even-1"]').length > 0) {
            nationalityFalg = true;
        }
        if ($('input[name="checkbox-name-even-2"]').length > 0) {
            mobileFlag = true;
        }
        if ($('input[name="checkbox-name-odd-3"]').length > 0) {
            emailFlag = true;
        }
        if (passportFlag == true) {
            if (!$('input[name="checkbox-name-odd-1"]').is(':checked')) {
                isChecked = false;
            } else {
                lowerChecked = true;
            }
        }
        if (nationalityFalg == true) {
            if (!$('input[name="checkbox-name-even-1"]').is(':checked')) {
                isChecked = false;
            } else {
                lowerChecked = true;
            }
        }
        if (mobileFlag == true) {
            if (!$('input[name="checkbox-name-even-2"]').is(':checked')) {
                isChecked = false;
            } else {
                lowerChecked = true;
            }
        }
        if (emailFlag == true) {
            if (!$('input[name="checkbox-name-odd-3"]').is(':checked')) {
                isChecked = false;
            } else {
                lowerChecked = true;
            }
        }
        if (isChecked == true) {
            $('#checkbox-name-0').prop('checked', true);
        } else {
            $('#checkbox-name-0').prop('checked', false);
        }
        if (lowerChecked == true) {
            $("#adult-passenger-input-1").removeClass('disabled');
            $("#adult-passenger-input-1").removeAttr('disabled');
        } else {
            $("#adult-passenger-input-1").addClass('disabled');
            $("#adult-passenger-input-1").attr('disabled', 'true');
        }
    };
    var updateProfile = function($event) {
        var checked = onChangeUpdate();
        if (checked) {
            //CSL ajax
            var request = {};
            request = setUpdateProfileRequest();
            if (undefined != $("#noEmailNoMobile").val()) {
                request['otpMode'] = $("#noEmailNoMobile").val();
            }
            if ($("#noEmailNoMobile").val() == saar5.l9.iceOtp.sms) {
                $("#otpMode").val(saar5.l9.iceOtp.sms);
                $(".popout--authenticationcodemobile .success-alert").addClass("hidden");
                $(".popout--authenticationcodemobile .update-profile-error").addClass("hidden");
                $(".popout--authenticationcodemobile .input-text").val("");
            } else if ($("#noEmailNoMobile").val() == saar5.l9.iceOtp.email) {
                $("#otpMode").val(saar5.l9.iceOtp.email);
                $(".popout--authenticationcodeEmail .success-alert").addClass("hidden");
                $(".popout--authenticationcodeEmail .update-profile-error").addClass("hidden");
                $(".popout--authenticationcodeEmail .input-text").val("");
            }
            if (undefined != $("#otpInSession").val() && $("#otpInSession").val() == "true") {
                triggerVerificationSuccess();
            } else {
                $.ajax({
                    url: "/icheckIN/getOtp.form",
                    type: "POST",
                    data: request,
                    async: false,
                    beforeSend: function() {
                        $("div.overlay-loading").removeClass('hidden');
                    },
                    success: function(response) {
                        var res = null;
                        $(".popout--authenticationcodemobile .left").addClass("hidden");
                        //left
                        $(".popout--authenticationcodeEmail .left").addClass("hidden");
                        //left
                        $(".popout--authenticationcodemobile .security-input-form").removeClass("form-error");
                        $(".popout--authenticationcodeEmail .security-input-form").removeClass("form-error");
                        $(".popout--authenticationcodeEmail .update-profile-error").addClass("hidden");
                        $(".popout--authenticationcodemobile .update-profile-error").addClass("hidden");
                        $(".popout--authenticationcodemobile .success-alert").addClass("hidden");
                        $(".popout--authenticationcodeEmail .success-alert").addClass("hidden");
                        try {
                            res = $.parseJSON(response);
                            var maskedMobile = res.maskedContact;
                            var mask = convertXToDot(maskedMobile);
                            if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
                                $(".popout--authenticationcodemobile .character-container").html(mask).append(res.lastTwoDigit);
                            } else if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
                                $(".popout--authenticationcodeEmail .character-container").html(mask).append("@").append(res.mailDomain).prepend(res.firstThreeChar);
                            }
                            if (undefined != res.status && res.status == saar5.l9.iceOtp.success) {
                                if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
                                    $(".popout--authenticationcodemobile .Krisflyer-membership-text").text(res.otp);
                                } else if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
                                    $(".popout--authenticationcodeEmail .Krisflyer-membership-text").text(res.otp);
                                }
                            } else {
                                showErrorMessage(res);
                            }
                        } catch (e) {
                            if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
                                $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpTechnicalerrormessage);
                                $(".popout--authenticationcodemobile .update-profile-error").removeClass("hidden");
                            } else if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
                                $(".popout--authenticationcodeEmail .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpTechnicalerrormessage);
                                $(".popout--authenticationcodeEmail .update-profile-error").removeClass("hidden");
                            }
                        }
                    }
                });
                //CSL ajax
                var otpPopupValue = ".popout--authenticationcodemobile";
                if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
                    otpPopupValue = '.popout--authenticationcodeEmail';
                }
                $(otpPopupValue).Popup({
                    modalShowClass: '',
                    triggerCloseModal: '.popup__close',
                    closeViaOverlay: false
                });
                $(".overlay-loading").addClass("hidden");
                $('body').find('.update-krisflyer-account').removeClass('update-KF-overlay');
                $('body').find('.update-krisflyer-account').addClass('update-krisflyer-2FAoverlay');
                $(otpPopupValue).Popup("show");
            }
        }
    }
    var skipUpadteProfile = function() {
        var popupValue = ".update-krisflyer-account"
        $(popupValue).Popup("hide");
    }
    var getTemplateUpdatekfProfileMethods = function() {
        return {
            updateProfile: updateProfile,
            skipUpadteProfile: skipUpadteProfile,
            getkfProfileData: getkfProfileData,
            onChangeCheck: onChangeCheck,
            onChangeCheckLower: onChangeCheckLower
        }
    }
    var getkfProfileData = function() {
        return {
            updateProfileModel: Object.assign({}, updateProfileModel)
        }
    };

    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var init = function() {
        Vue.use(VTooltip);
        Vue.component('vue-slide-up-down', VueSlideUpDown);
        Vue.component('ice-checkin-complete', {
            template: "#ice-checkin-complete-template",
            data: function() {
                return templateData
            },
            props: {
                platform: String
            },
            mounted: onMount,
            updated: onUpdate,
            methods: getTemplateMethods(),
            filters: getTemplateFilters()
        });

        /*templateInstance1 = new Vue({
            el: "#app-container",
            data: templateData1,
            mounted: onMount
        });*/
        Vue.component("updatekfprofile", {
            template: "#updateKfProfileAside-template",
            props: {
                updateProfileModel: updateProfileModel,
                value: updateProfileModel
            },
            watch: {
                value: {
                    handler: function(val) {
                        this.$forceUpdate();
                    },
                    deep: true
                }
            },
            mounted: onUpdatekfProfileMount,
            data: getkfProfileData,
            mounted: onUpdatekfProfileMount,
            methods: getTemplateUpdatekfProfileMethods()
        });
        var onUpdatekfProfileMount = function() {}

        /*addbag*/
        Vue.component('baggage-data', {
            template: "#baggagedata",
            data: getBaggageData,
            props: {
                keys: Number,
                flightsdata: Array
            },
            mounted: onBaggageMount,
            methods: getTemplateMethods()
        });

        Vue.component('declare-bag', {
            template: "#declarebag",
            props: {
                paxArray: Array,
                CombinedPaxArray: Array,
                isSinglePaxFlow: Boolean,
                isMultiPaxFlow: Boolean,
                totalAddedBags: Number
            },
            methods: getTemplateMethods()
        });

        Vue.component('bag-count', {
            template: "#bagcount",
            data: getBagCounterData,
            props: {
                index: Number,
                paxtitle: String,
                firstname: String,
                lastname: String,
                concept: String,
                maxallowedweight: Number,
                maxallowedpiece: Number,
                weigthperpiece: Number,
                paxlength: Number
            },
            methods: getTemplateMethods()
        });

        Vue.component('combine-bag-count', {
            template: "#combinedbagcount",
            data: getCombinedBagCounterData,
            props: {
                combinePaxArray: Array
            },
            mounted: onCombinedBagCounterMount,
            methods: getTemplateMethods()
        });

        /*addbag*/

        /*hc*/

        Vue.component('health-cert', {
            template: "#healthCert",
            data: getHealthCertData,
            mounted: onHealthCertMount,
            methods: getTemplateMethods()
        });

        Vue.component('cert-pax', {
            template: "#certPax",
            props: {
                index: Number,
                segindex: Number,
                flightid: String,
                firstname: String,
                lastname: String,
                paxType: String,
                paxlength: Number,
                paxstatus: String,
                changeBtn: Function
            },
            data: certPaxData,
            mounted: onCertPaxMount,
            methods: getTemplateMethods()
        });

        /*hc*/

        templateInstance = new Vue({
            el: "#app-container",
            data: {
                platform: "desktop",
                allCheckedIn: $('#completeCheckinFlag').val() == 'true',
                emailSendCheckIn: [{
                    isError: false
                }],
                emailGetBoarding: [{}],
                flightSegments: [{}],
                getBpPaxEmails: [{}],
                updateProfileModel: Object.assign({}, updateProfileModel)
            },
            methods: getMainMethods()
        });
        if ($("#saveCheckInFailedPax").val() != "" && $("#saveCheckInFailedPax").val() != null && $("#saveCheckInFailedPax").val() != undefined) {
            $("#saveCheckInFailedErrorMsg").removeClass("hidden");
        } else {
            $("#saveCheckInFailedErrorMsg").addClass("hidden");
        }

    };
    var timer = 0;
    var time = 0;
    var popTime = 0;
    var onMount = function() {
        var $this = this;
        /*addbag*/
        $$this = this;
        /*addbag*/
        globalJson.checkinData = $("#paxDetailsJsonString").val();
        var checkInData = $.parseJSON(globalJson.checkinData);
        //$.get("/saar5/_desktop/ajax/ICE_PaxDetailsJson.json", function (response) {
        var data = checkInData.paxRecordVO;
        var flights = data.flights;
        if (pageData && pageData.sessionExtension && pageData.sessionExtension.extendSession == 'true') {
            startSession($this);
        }
        var oalFlag = false;
        if (data.passengers != undefined && data.passengers.length > 0 && data.passengers[0].ffpProgram != 'SQ') {
            oalFlag = true;
        }

        if (typeof $("#ffpNumber").val() != 'undefined' && !oalFlag && $("#ffpNumber").val().trim() != '') {
            $this.loggedIn = true;
        }

        updateKFDetailsBeforeLoad($this);
        $this.bookReference = data.recordLocator;
        $this.isGroupBooking = data.groupBooking;
        $this.accruableMilage = $("#accruableMilage").val();
        $this.departureCity = flights[0].origin.cityName;
        $this.arrivalCity = flights[flights.length - 1].destination.cityName;
        $this.completeCheckinFlag = $('#completeCheckinFlag').val() == 'true';
        $this.showTicket = showTicketNumber();
        $this.ticketNumber = $("#ticketNumber").val();
        $this.disableSeatFlag = $("#disableSeatFlag").val();
        var sortedPassengers = sortPassenger(data.passengers);
        $this.flightSegments = _.map(flights, function(segment, index) {
            segment.active = (index == 0) ? true : false;
            segment.isSelectedAll = false;
            segment.checkedInPassengersData = sortCheckedInPassenger(sortedPassengers, data.services.filter(function(checkedInPassengersData) {
                return flights[index].flightIDs.indexOf(checkedInPassengersData.flightID) > -1 && checkedInPassengersData.dcsStatus.checkedIn == true;
            }));
            //segment.checkedInPassengersData = sortCheckedInPassenger(sortedPassengers, segment.checkedInPassengersData);
            segment.passengers = deepClone(_.map(data.passengers, function(passenger) {
                passenger.isInfant = (passenger.passengerType == "IN" && passenger.taggedInfant == true) ? true : false;
                passenger.canBeSelected = (index == 0) ? true : false;
                passenger.isDisabled = (index == 0 && (!(passenger.passengerType == "IN") || (passenger.passengerType == "IN" && passenger.taggedInfant == false))) ? false : true;
                passenger.isAutoCheck = false;
                passenger.isSelected = false;
                _.each(segment.checkedInPassengersData, function(passengersData, passengerIndex) {
                    if (passengersData.passengerID == passenger.passengerID && passengersData.dcsStatus.checkedIn == true) {
                        passenger.isSelected = true;
                        passenger.isAutoCheck = false;
                        passenger.isDisabled = true;
                        passenger.canBeSelected = false;

                        passengersData.canBeSelected = passengersData.cancelCheckinEligibleFlag ? true : false;
                        passengersData.isDisabled = passengersData.cancelCheckinEligibleFlag ? false : true;
                        passengersData.isSelected = passengersData.cancelCheckinEligibleFlag ? true : false;
                        passengersData.isInfant = passenger.isInfant;

                        passengersData.baggage = {
                            baggageIncluded: "--",
                            baggageAdditional: "0",
                            baggagewaiverAdditional: "0",
                            unit: "-"
                        };
                        passengersData.baggagePresent = false;
                        passengersData.Meals = [];
                        getBagData(passengersData);
                        passengersData.segSeats = [];
                        getLegLevelSeats(passengersData, flights);

                        return;
                    }
                });

                return passenger;
            }));

            _.each(data.services, function(service) {
                if (segment.flightIDs.indexOf(service.flightID) > -1 && !service.isInfant) {
                    if (!(getbpcondition(segment))) {
                        if (!segment.bpTciRciFailure) {
                            if (segment.tci || segment.rci) {
                                segment.bpTciRciFailure = true;
                            }
                        }

                        if (!segment.spBpDisableReason) {
                            if (service.dcsStatus.spBpDisableReason == 'CKINGP4036' && service.dcsStatus.checkedIn) {
                                segment.spBpDisableReason = true;
                            }
                        }

                        if (!segment.bPRestrictedForPendingPayment) {
                            if (service.dcsStatus.spBpDisableReason == 'PENDING_PAYMENT' && service.dcsStatus.checkedIn) {
                                segment.bPRestrictedForPendingPayment = true;
                            }
                        }

                        if (!segment.bPRestrictedForNationality) {
                            if (service.dcsStatus.nationalityRestricted && service.dcsStatus.checkedIn) {
                                segment.bPRestrictedForNationality = true;
                            }
                        }
                        if (!segment.bPRestrictedForSelectee) {
                            if (service.dcsStatus.isTSASelectee && service.dcsStatus.checkedIn) {
                                segment.bPRestrictedForSelectee = true;
                            }
                        }
                        if (!segment.bPRestrictedForConfiguration) {
                            if (service.dcsStatus.bpBlockedByConfig) {
                                segment.bPRestrictedForConfiguration = true;
                            }
                        }
                        if (!segment.bPRestrictedForZAorBR) {
                            if (service.dcsStatus.bpBlockedForSAorBR) {
                                segment.bPRestrictedForZAorBR = true;
                            }
                        }
                        if (!segment.bPRestrictedForConfiguration) {
                            if (service.dcsStatus.bpBlockedByConfig && !service.dcsStatus.nationalityRestricted) {
                                segment.bPRestrictedForConfiguration = true;
                            }
                        }
                        if ((segment.origin && segment.origin.countryCode && segment.origin.countryCode === 'US') || (segment.destination && segment.destination.countryCode && segment.destination.countryCode === 'US')) {
                            segment.bPRestrictedForUS = true;
                        }
                        if (!segment.bpADCFailure) {
                            if (service.dcsStatus.spBpDisableReason == 'ADC_FAILURE' && service.dcsStatus.checkedIn) {
                                segment.bpADCFailure = true;
                            }
                        }
                        if (!segment.bpADCConditionalFailure) {
                            if (service.dcsStatus.spBpDisableReason == 'ADC_CONDITIONAL_FAILURE' && service.dcsStatus.checkedIn) {
                                segment.bpADCConditionalFailure = true;
                            }
                        }

                        if (!segment.bphpcnextFailure) {
                            if (service.dcsStatus.spBpDisableReason == 'HPC_NEXT' && service.dcsStatus.checkedIn) {
                                segment.bphpcnextFailure = true;
                            }
                        }
                    }
                }
            });

            return segment;
        });

        getMealsData($this.flightSegments);

        for (var i = 0; i < $this.flightSegments[0].passengers.length; i++) {
            canSelectPassenger($this.flightSegments, $this.flightSegments[0], 0, i);
        }

        $this.flightCabinClass = (flights[0] || {}).cabinClass;
        $this.delayedFlightNotice = (flights[0] || {}).delayedFlightNotice;
        $this.essentialInformation = data.essentialInformation;

        $this.bpIssuedCustomerDetails = onEmailSentSuccess();
        $this.services = data.services;

        $this.msgArr = initializeMessage(sortedPassengers, data.services);

        $this.isKrisflyer = evalKf(sortedPassengers);

        $this.isGrbdBooking = checkGrbd(flights);

        $this.passengerMilesList = _.map(sortedPassengers.filter(function(passenger) {
            return !isKfMember(passenger) && passenger.passengerType != 'IN';
        }), function(passenger) {
            if (typeof passenger.firstName != 'undefined') {
                return passenger.firstName + ' ' + passenger.lastName;
            } else {
                return passenger.lastName;
            }
        });
        $this.selectedKrisFlyer = $this.passengerMilesList[0];
        //});
        var appType = $.cookies.get('SQAPPTYPE');
        if (appType != null && (appType == "tablet" || appType == "mobile")) {
            $('.footer-btn-group').addClass("hidden");
        }
        SIA.forceInput();

        $this.$nextTick(function() {
            window.addEventListener('resize', function() {
                if (("" + activeIndex) != "") {
                    $(".ice-checkin-complete .header-main").css('z-index', '99');
                }
            });
        });

    };
    var startSession = function($this) {
        var extendedTime = (popTime != 0) ? Date.parse(popTime) + ($this.initialDelay * 1000) : 0;
        var expiryTime = (popTime != 0) ? Date.parse(popTime) + ($this.seconds * 1000) : 0;
        var extendedSeconds = extendedTime != 0 ? extendedTime - Date.parse(new Date()) : 0;
        var expirySeconds = expiryTime != 0 ? expiryTime - Date.parse(new Date()) : 0;
        $this.delaySeconds = $this.sessionTries <= 2 ? (extendedSeconds != 0 ? extendedSeconds : $this.initialDelay * 1000) : (expirySeconds != 0 ? expirySeconds : $this.seconds * 1000);
        timer = setTimeout(function() {
            promptHandler($this)
        }, $this.delaySeconds);
    }

    var promptHandler = function($this) {
        if ($this.sessionTries > $this.sessionTriesLimit) {
            return expireSession($this);
        }
        $this.sessionTries++;
        if ($this.sessionTries >= 1) {
            popTime = new Date();
            var popupValue = ".popout--session-timeout";
            $(popupValue).Popup({
                modalShowClass: '',
                triggerCloseModal: ".popup__close, .btn-1-ok, .btn-2-cancel",
                closeViaOverlay: true
            });
            parseMessage($this);
            $('.popup-dgrestriction-alert').Popup('hide');
            $(popupValue).Popup("show");
            $('body').find('.bg-modal').addClass('overlay');
        } else {
            return sessionRequest($this);
        }
    }

    var onClickExtendSession = function() {
        var newDate = new Date(time);
        if (Date.parse(newDate) < Date.parse(new Date())) {
            return expireSession(this);
        } else if (Date.parse(newDate) >= Date.parse(new Date())) {
            return sessionRequest(this);
        }
    }

    var onClickExtendSessionCancel = function() {
        var newTime = new Date();
        var newDate = new Date(time);
        var diffTime = Date.parse(newDate) - Date.parse(newTime);
        if (Date.parse(newDate) < Date.parse(new Date())) {
            return expireSession(this);
        } else {
            setTimeout(function() {
                return expireSession(this)
            }, diffTime);
        }
    }

    var redirectToHomePage = function() {
        window.location.href = "/";
    }

    var parseMessage = function($this) {
        var today = new Date();
        var newSec = $this.seconds * 1000;
        time = today.getTime() + newSec;
        var sessionExpireTime = extendSessionTimeParser(time);
        $this.expTime = sessionExpireTime;
    }

    var sessionRequest = function($this) {
        $.ajax({
            url: "/icheckIN/extendSession.form",
            type: "GET",
            dataType: 'json',
            success: function(response) {
                if (response.status == saar5.l9.iceOtp.success && response.sessionExtended == 'true') {
                    return startSession($this);
                } else {
                    expireSession($this);
                }
            },
            error: function(jqXHR, textStatus) {
                expireSession($this);
            }
        });
    }

    var expireSession = function($this) {
        var popupValue = ".popout--session-expire";
        $(popupValue).Popup({
            modalShowClass: '',
            triggerCloseModal: ".popup__close, .btn-1_expire_ok",
            closeViaOverlay: true
        });
        $('.popup-dgrestriction-alert').Popup('hide');
        $(popupValue).Popup("show");
        $('body').find('.bg-modal').addClass('overlay');
    }

    var extendSessionTimeParser = function(date) {
        var newDate = new Date(date);
        var hourLabel = (newDate.getHours().toString().length == 1) ? "0" + newDate.getHours() : newDate.getHours();
        var minuteLabel = (newDate.getMinutes().toString().length == 1) ? "0" + newDate.getMinutes() : newDate.getMinutes();
        var secondsLabel = (newDate.getSeconds().toString().length == 1) ? "0" + newDate.getSeconds() : newDate.getSeconds();
        var ampm = hourLabel >= 12 ? " PM" : " AM";

        return " " + hourLabel + ":" + minuteLabel + ":" + secondsLabel + ampm + ".";
    };

    var evalKf = function(passengers) {
        var kfStatus = false;
        var entered = false;
        _.each(passengers, function(passenger) {
            if (!entered && isKfMember(passenger)) {
                kfStatus = true;
            } else {
                kfStatus = false;
                entered = true;
            }
        });
        return kfStatus;
    }

    var checkGrbd = function(flights) {
        var grbg = false;
        _.each(flights, function(flight) {
            if (flight != undefined && flight.sellingClass == "G") {
                grbg = true;
            }
        });
        return grbg;
    }

    var isKfMember = function(pax) {
        if (pax.ffpProgram != undefined && pax.ffpProgram != null && pax.ffpProgram != "" && pax.ffpNumber != undefined && pax.ffpNumber != null && pax.ffpNumber != "" && pax.ffpProgram == 'SQ') {
            return true;
        } else {
            return false;
        }
    }

    var sortPassenger = function(passengers) {
        var sortedArr = [];
        for (var i = 0; i < passengers.length; i++) {
            if (passengers[i].taggedInfant != true) {
                sortedArr.push(passengers[i]);
                if (passengers[i].infant != undefined) {
                    for (var j = 0; j < passengers.length; j++) {
                        if (passengers[j].taggedInfant == true && passengers[j].firstName == passengers[i].infant.firstName && passengers[j].lastName == passengers[i].infant.lastName) {
                            sortedArr.push(passengers[j]);
                        }
                    }
                }
            }
        }
        return sortedArr;
    }
    var initTriggerDgPopupRestriction = function(dgflightlist, dgservices, legIndex) {

        activeBpIndex = legIndex;
        this.dgeasaacceptedTerms = false;
        this.dgacceptedTerms = false;
        var $this = this;
        $this.dgflightlist1 = dgflightlist;
        var dgservices1 = dgservices;
        var popupValue = ".popup-dgrestriction-alert";
        $(popupValue).Popup({
            modalShowClass: '',
            triggerCloseModal: '.popup__close',
            closeViaOverlay: true
        });
        document.getElementById('dglightbox-checkbox').checked = false;
        document.getElementById('dglightbox-boardingpass').disabled = true;
        $(".popup-dgrestriction-alert").find('button[name="dglightbox-boardingpass"]').addClass("disabled");
        $(popupValue).Popup("show");
        $('body').find('.bg-modal').addClass('overlay');
    }

    var sortCheckedInPassenger = function(sortedData, checkedPassengerData) {
        var sortedArr = [];
        for (var i = 0; i < sortedData.length; i++) {
            for (var j = 0; j < checkedPassengerData.length; j++) {
                if (sortedData[i].flightIDs.indexOf(checkedPassengerData[j].flightID) > -1) {
                    sortedArr.push(checkedPassengerData[j]);
                }
            }
        }
        return sortedArr;
    }

    var showTicketNumber = function() {
        if ($("#ticketNumber").val() != undefined && $("#ticketNumber").val() != null && $("#ticketNumber").val() != '') {
            return true;
        }
        return false;
    };

    var onUpdate = function() {
        if (!this.doneLoadingMealsBaggage) {
            $("div.overlay-loading").addClass('hidden');
            this.doneLoadingMealsBaggage = !this.doneLoadingMealsBaggage;
        }
        //To show popup when emails are sent successfully
        if ($("#bpIssuedCustomerDetails").val() != null && $("#bpIssuedCustomerDetails").val() != "" && typeof $("#bpIssuedCustomerDetails").val() != "undefined") {
            setTimeout(function() {
                successPopup(".boading-pass-successfull", "/icheckIN/closeBpSuccess.form");
            }, 120);
        } else if ($("#shareItenaryEmails").val() != null && $("#shareItenaryEmails").val() != "" && typeof $("#shareItenaryEmails").val() != "undefined") {
            successPopup(".email-sent-successfull", "/icheckIN/closeShareItenary.form");
        }
    }

    //popupValue represent the target aside class in the form '.class' and targetUrl represent the POST url to be invoked on closing the popup
    var successPopup = function(popupValue, targetUrl, pageRedirect) {
        var bpSuccessPopup = $(popupValue);
        $(popupValue).Popup({
            modalShowClass: '',
            triggerCloseModal: '.popup__close,.btn-close',
            afterHide: function() {
                if (pageRedirect) {
                    window.location = targetUrl;
                } else {
                    $.ajax({
                        type: "POST",
                        url: targetUrl,
                        success: function() {
                            location.reload();
                        }
                    });
                }

            },
            closeViaOverlay: false
        });

        $(popupValue).Popup("show");
        $(popupValue).Popup("show");
        $('body').find('.bg-modal').addClass('overlay');
    }

    setCancelCheckInState = function(index) {
        return _.reduce(this.flightSegments[index].checkedInPassengersData, function(accumulatedCancelCheckinEligibleFlag, checkedInPassenger) {
            return accumulatedCancelCheckinEligibleFlag || checkedInPassenger.cancelCheckinEligibleFlag;
        }, false);
    }

    getCancelCheckInReason = function(index) {
        return _.find(this.flightSegments[index].checkedInPassengersData, function(checkedInPassenger) {
            return checkedInPassenger.cancelCheckinEligibleFlag == false;
        });
    }

    setCancelAllCheckInsState = function() {
        if (this.flightSegments.length == 1) {
            return _.reduce(this.flightSegments[0].checkedInPassengersData, function(accumulatedCancelAllCheckInsEligibleFlag, checkedInPassenger) {
                return accumulatedCancelAllCheckInsEligibleFlag || checkedInPassenger.cancelCheckinEligibleFlag;
            }, false);
        } else {
            var segmentFilter = _.clone(this.flightSegments);
            segmentFilter.shift();
            return _.reduce(segmentFilter, function(accumulated, segment) {
                return accumulated && _.reduce(segment.checkedInPassengersData, function(accumulatedData, currentData) {
                    return accumulatedData && currentData.cancelCheckinEligibleFlag;
                }, true);
            }, true);
        }
    }

    getCancelAllCheckInsReason = function() {
        if (this.flightSegments.length == 1) {
            return _.find(this.flightSegments[0].checkedInPassengersData, function(checkedInPassenger) {
                return checkedInPassenger.cancelCheckinEligibleFlag == false;
            });
        } else {
            var segmentFilter = _.clone(this.flightSegments);
            segmentFilter.shift();
            return _.chain(segmentFilter).map(function(checkedInPassengerData) {
                return checkedInPassengerData.checkedInPassengersData;
            }).flatten().find(function(checkedInPassenger) {
                return checkedInPassenger.cancelCheckinEligibleFlag == false;
            }).value();
        }
    }

    getCancelCheckInBoardingPassIssued = function() {
        if (this.currentSelectedCancelFlights) {
            if (this.currentSelectedCancelFlights.length > 1) {
                return _.reduce(this.flightSegments, function(accumulated, segment) {
                    return accumulated || _.reduce(segment.checkedInPassengersData, function(accumulatedData, currentData) {
                        return accumulatedData || currentData.dcsStatus.boardingPassIssued;
                    }, false);
                }, false);
            } else {
                return _.reduce(this.currentSelectedCancelFlights[0].checkedInPassengersData, function(accumulatedBoardingPassIssued, checkedInPassenger) {
                    return accumulatedBoardingPassIssued || checkedInPassenger.dcsStatus.boardingPassIssued;
                }, false);
            }
        }
    }

    var onEmailSentSuccess = function() {

        var bpIssuedCustomerDetails = $("#bpIssuedCustomerDetails").val();
        if (bpIssuedCustomerDetails != "" && bpIssuedCustomerDetails != null && bpIssuedCustomerDetails != undefined) {
            var res = bpIssuedCustomerDetails.substring(1, bpIssuedCustomerDetails.length);
            var passengers = $.parseJSON(res);
            var customerDetails = {};
            var PAXNames = [];
            var PAXEmails = [];
            _.each(passengers, function(passenger) {
                PAXNames.push({
                    name: passenger.firstName ? passenger.firstName + " " + passenger.lastName : passenger.lastName,
                    infant: passenger.infant,
                    infName: passenger.infant ? passenger.infant.firstName ? passenger.infant.firstName + " " + passenger.infant.lastName : passenger.infant.lastName : ""
                });

            });
            var emails = passengers[0].email.split(",");
            _.each(emails, function(emailId) {
                PAXEmails.push({
                    email: emailId
                });
            });
            customerDetails["Names"] = PAXNames;
            customerDetails["Emails"] = PAXEmails;
            customerDetails["legIndex"] = parseInt(bpIssuedCustomerDetails.charAt(0));
            return customerDetails;
        }

        var shareItinerayDetails = $("#shareItenaryEmails").val();
        if (shareItinerayDetails != "" && shareItinerayDetails != null && shareItinerayDetails != undefined) {
            var res = shareItinerayDetails.substring(1, shareItinerayDetails.length - 1);
            var emails = res.split(",");
            var customerDetails = [];
            _.each(emails, function(emailId) {
                customerDetails.push({
                    name: "",
                    email: emailId
                });
            });
            return customerDetails;
        }

    }

    var initializeMessage = function(sortedPassengers, services) {
        var msgArr = [];
        var ccvMessage = ': <br>';
        var nationalityMessage = ': <br>';
        var isTSASelecteeMessage = ': <br>';
        _.each(sortedPassengers, function(pax) {
            var showBoardingPassError = false;
            var ccvCheckRequired = false;
            var nationalityRestricted = false;
            var isTSASelectee = false;
            _.each(services, function(service) {
                if (service.passengerID == pax.passengerID) {
                    if (!service.dcsStatus.boardingPassIssued && service.dcsStatus.checkedIn && !showBoardingPassError) {
                        showBoardingPassError = true;
                    }
                    if (service.dcsStatus.ccvDocCheckRequired && service.dcsStatus.checkedIn) {
                        ccvCheckRequired = true;
                    }
                    if (service.dcsStatus.nationalityRestricted && service.dcsStatus.checkedIn) {
                        nationalityRestricted = true;
                    }
                    if (service.dcsStatus.isTSASelectee && service.dcsStatus.checkedIn) {
                        isTSASelectee = true;
                    }
                }
            });
            if (ccvCheckRequired) {
                if (typeof pax.firstName != 'undefined') {
                    ccvMessage = ccvMessage + '- ' + pax.title + ' ' + pax.firstName + ' ' + pax.lastName + "<br>";
                } else {
                    ccvMessage = ccvMessage + '- ' + pax.title + ' ' + pax.lastName + "<br>";
                }
            }
            if (showBoardingPassError && nationalityRestricted) {
                nationalityMessage = nationalityMessage + '- ' + pax.title + ' ' + pax.firstName + ' ' + pax.lastName + "<br>";
            }
            if (showBoardingPassError && isTSASelectee) {
                isTSASelecteeMessage = isTSASelecteeMessage + '- ' + pax.title + ' ' + pax.firstName + ' ' + pax.lastName + "<br>";
            }
        });
        if (ccvMessage != ': <br>') {
            msgArr.push($("#ccvPaxDetailsMessage").val() + ccvMessage + "<br>" + $("#ccverificationMsg").val());
        }
        if (nationalityMessage != ': <br>') {
            msgArr.push($("#nationalityRestrictPaxDetailsMessage").val() + nationalityMessage + "<br/>" + $("#nationalityRestrictedProceedMsg").val());
        }
        if (isTSASelecteeMessage != ': <br>') {
            msgArr.push($("#nationalityRestrictPaxDetailsMessage").val() + isTSASelecteeMessage + "<br/>" + $("#nationalityRestrictedProceedMsg").val());
        }

        if ($("#oDSMessage").val() != null && $("#oDSMessage").val() != undefined && $("#oDSMessage").val() != "") {
            msgArr = msgArr.concat($("#oDSMessage").val().split('##'));
            msgArr.pop();
            // To remove the extra field added to array
        }

        return msgArr;
    }

    onDisabledBoardingPass = function(flight) {
        if (flight.bphpcnextFailure) {
            return $("#hpcnextMsgBp").val();
        } else if (flight.bPRestrictedForNationality) {
            return $("#natResMsgBp").val();
        } else if (flight.bPRestrictedForConfiguration) {
            return $("#dbConfMsgBp").val();
        } else if (flight.bPRestrictedForUS) {
            return $("#usMsgBp").val();
        } else if (flight.bPRestrictedForZAorBR) {
            return $("#zaMsgBp").val();
        } else if (flight.bpADCFailure) {
            return $("#ADCMsgBp").val();
        } else if (flight.bpADCConditionalFailure) {
            return $("#ADCConditionalMsgBp").val();
        } else if (flight.bpTciRciFailure) {
            return $("#tcirciMsgBp").val();
        } else if (flight.bPRestrictedForPendingPayment) {
            return $("#pendingPayMsgBp").val();
        } else {
            return $("#appMsgBp").val();
        }
    }

    setSelectedCancelFlights = function(flights, nextFlight, prevFlight) {

        var popupValue = ".cancel-checkin-flight";

        if (nextFlight && nextFlight.checkedInPassengersData && nextFlight.checkedInPassengersData.length > 0) {
            popupValue = ".checkin-flight-itinerary";
        } else if (flights && flights.length > 0 && flights[0].tci && !flights[0].stopOver && prevFlight && prevFlight.tci) {

            popupValue = ".checkin-flight-tci";
        } else {
            this.currentSelectedCancelFlights = deepClone(flights);
            this.currentSelectedCancelFlights.filter(function(flight) {
                flight.isSelectedAll = true;
                flight.checkedInPassengersData = flight.checkedInPassengersData.filter(function(passenger) {
                    if (!passenger.isDisabled) {
                        passenger.isSelected = true;
                        passenger.canBeSelected = true;
                    } else {
                        passenger.isSelected = false;
                        passenger.canBeSelected = false;
                    }
                    return !passenger.isInfant;
                });
                return flight.checkedInPassengersData.length > 0;
            });
            this.noElementSelected = !isElementsSelected(this.currentSelectedCancelFlights);
        }
        if (popupValue == ".cancel-checkin-flight") {
            var cancelButton = $(".cancel-checkin-flight").find('button[name="btn-submit"]');
            if (cancelButton.hasClass("cancelallcheckin_confirm"))
                cancelButton.removeClass("cancelallcheckin_confirm");
            if (cancelButton.hasClass("cancelcheckin_confirm"))
                cancelButton.removeClass("cancelcheckin_confirm");
            if (cancelFlag) {
                cancelButton.addClass("cancelallcheckin_confirm");
            } else {
                cancelButton.addClass("cancelcheckin_confirm");
            }
        }
        triggerPopup(popupValue);
    }

    getPassengerFullNameFromPassengerID = function(flights, passengerID) {
        return _.find(flights.passengers, function(passenger) {
            return passenger.passengerID == passengerID;
        })
    }

    isKFPPSpopupEnabled = function(value) {
        if (value == null || null == value.loyaltyTierCode) {
            return false;
        }
        var loyaltyTierCodeArr = ['KFEG', 'QPPS', 'LPPS', 'TPPS'];
        if (loyaltyTierCodeArr.indexOf(value.loyaltyTierCode.toUpperCase()) > -1) {
            return true;
        } else {
            return false;
        }
    }

    getCancelDisabledReason = function(reason) {
        if (null == reason || typeof reason == 'undefined') {
            return reason;
        }
        switch (reason.toLowerCase()) {
        case 'jfekioskbp':
            return saar5.l4.ice.jfekioskbp;
        case 'bagtagactive':
            return saar5.l4.ice.bagtagactive;
        case 'prspassed':
            return saar5.l4.ice.prspassed;
        default:
            return saar5.l4.ice.generalcancelerror;
        }
        return reason;
    }

    getCancelCheckinSegmentSelectAllState = function(flights) {

        var isAllPassengerSelected = _.chain(flights.checkedInPassengersData).filter(function(passenger) {
            return !passenger.isDisabled;
        }).reduce(function(accumulatedIsSelected, passenger) {
            return accumulatedIsSelected && passenger.isSelected;
        }, true).value()

        return isAllPassengerSelected;
    }

    getMealsData = function(flightSegments) {
        try {
            $.ajax({
                url: "/icheckIN/getMealCatalog.form",
                type: "GET",
                dataType: 'json',
                success: function(response) {
                    _.each(flightSegments, function(segment, index) {
                        _.each(segment.checkedInPassengersData, function(passengerData, index) {
                            _.each(response, function(mealBagData, index) {
                                if (mealBagData.flightID == passengerData.flightID) {
                                    getMealCatalog(mealBagData.mealDetails, passengerData);
                                }
                            });
                        });
                    });
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    getMealCatalog = function(response, passengerData) {
        _.each(response, function(mealDetail) {
            _.each(mealDetail.mealFreeText, function(value) {
                if (value != null && value != undefined) {
                    var meals = {};
                    meals.mealType = value;
                    meals.mealDescription = "";
                    passengerData.Meals.push(meals);
                }
            });
        });
    }

    getBagData = function(passengerData) {
        if (null != passengerData.baggageAllowances) {
            _.each(passengerData.baggageAllowances, function(mealBagData, mealBagIdx) {
                passengerData.baggagePresent = true;
                var piece = "Piece";
                if (null != mealBagData.sourceType && mealBagData.sourceType == "PAID_ALLOWANCE") {
                    passengerData.baggage.baggageAdditional = mealBagData.allowanceValue;
                    if (mealBagData.allowanceType == "PIECE" && mealBagData.allowanceValue > 1) {
                        piece = "Pieces";
                    }
                    passengerData.baggage.additionalUnit = mealBagData.allowanceType == "PIECE" ? piece : "kg";
                } else if (null != mealBagData.sourceType && mealBagData.sourceType == "TICKET_ALLOWANCE") {
                    passengerData.baggage.baggageIncluded = mealBagData.allowanceValue;
                    if (mealBagData.allowanceType == "PIECE" && passengerData.baggage.baggageIncluded > 1) {
                        piece = "Pieces";
                    } else if (passengerData.baggage.baggageIncluded == 0) {
                        passengerData.baggage.baggageIncluded = "--";
                    }
                    if ("--" != passengerData.baggage.baggageIncluded) {
                        passengerData.baggage.includedUnit = mealBagData.allowanceType == "PIECE" ? piece : "kg";
                    }
                } else if (null != mealBagData.sourceType && mealBagData.sourceType == "WAIVER_ALLOWANCE") {
                    passengerData.baggage.baggagewaiverAdditional = mealBagData.allowanceValue;
                    if (mealBagData.allowanceType == "PIECE" && mealBagData.allowanceValue > 1) {
                        piece = "Pieces";
                    }
                    passengerData.baggage.waiverAdditionalUnit = mealBagData.allowanceType == "PIECE" ? piece : "kg";
                }
            });
        }
    }

    var getLegLevelSeats = function(passengersData, flights) {
        _.each(flights, function(flight) {
            if (flight.flightIDs.indexOf(passengersData.flightID) > -1) {
                _.each(flight.legs, function(leg) {
                    if (null != leg.seats[passengersData.flightID] && undefined != leg.seats[passengersData.flightID]) {
                        var seat = {};
                        seat.seatNumber = leg.seats[passengersData.flightID].seatNumber;
                        seat.seatType = getSeatType(leg.seats[passengersData.flightID].seatType);
                        if (seatExists(passengersData.segSeats, seat.seatNumber) == false) {
                            passengersData.segSeats.push(seat);
                        }

                    }
                })
            }
        })
    };

    var seatExists = function(segSeats, seatNum) {
        var found = false;
        var sameSeats = segSeats.filter(function(seat) {
            return seat.seatNumber === seatNum;
        })

        if (sameSeats.length > 0) {
            found = true;
        }

        return found;
    }

    var getSeatType = function(type) {
        var seatType;

        if (type == "EXTRA_LEG_ROOM") {
            seatType = "Extra Legroom Seat";
        } else if (type == "BASSINET") {
            seatType = "Bassinet Seat";
        } else if (type == "FORWARD_ZONE") {
            seatType = "Forward zone seat";
        } else if (type == "STANDARD") {
            seatType = "Standard Seat";
        } else if (type == "DOUBLE_BED") {
            seatType = "Double Bed seat";
        } else if (type == "PEY_ELS") {
            seatType = "Premium Economy Extra Legroom Seat";
        } else if (type == "PEY_SS") {
            seatType = "Premium Economy Standard Seat";
        } else if (type == "SOLO_SEAT") {
            seatType = "Solo Seat";
        }

        return seatType;
    }

    var formatSeatSelected = function(val) {
        if (val != 'undefined' && val != undefined && val != null) {
            return val.replace(/^0+/, '');
        }
    }

    var changeSeat = function(a) {
        $("#seatSelection").val("true");
        $("#selectedFlightId").val(a);
        $("#form-booking-1").submit();
        $(".overlay-loading").removeClass("hidden");
    };

    var updateKFDetailsBeforeLoad = function($event) {
        try {
            var res = $("#responseString").val();
            var sample = JSON.parse(res);
        } catch (e) {}
        if (res != undefined && res.length > 0) {
            resLength = res.length;
            mountUpdatekfProfileModel(sample, $event);
            getkfProfileData();
            returnFlag = true;
        } else {
            returnFlag = false;
        }
    };
    var updateKFDetails = function($event) {
        if ($("#noEmailNoMobile").val() != saar5.l9.iceOtp.sms && $("#noEmailNoMobile").val() != saar5.l9.iceOtp.email) {
            var popupValue = ".popup--emailandmobilerequired-error";
            $(popupValue).Popup({
                modalShowClass: '',
                triggerCloseModal: '.popup__close',
                closeViaOverlay: true
            });
            $(popupValue).Popup("show");
            $('body').find('.bg-modal').addClass('overlay');
        } else {
            initTriggerUpdateProfile();
            validateNomailNoMobile();
        }
    };
    var mountUpdatekfProfileModel = function(changedValues, componentThis) {
        updateProfileModel.index = updateProfileModel.index + 1;
        var i = 0;
        //changedValues[]
        /*for(var i=0;i<changedValues.length;i++)
			{
			if(changedValues[i].label.substr(0,4)=="true")
			}*/
        _.each(changedValues, function(changedValue, i) {
            i++;
            if (changedValue.label.substr(0, 4) == "Pass") {
                updateProfileModel.isPassportUpdated = true;
                if (changedValue.label == "Passport Number") {
                    updateProfileModel.passPortNumOld = changedValue.oldValue;
                    updateProfileModel.passPortNumNew = changedValue.newValue;
                } else if (changedValue.label == "Passport Place Of Issue") {
                    updateProfileModel.passPortPlaceOld = changedValue.oldValue;
                    updateProfileModel.passPortPlaceNew = changedValue.newValue;
                } else if (changedValue.label == "Passport Expiry Date") {
                    updateProfileModel.passPortExpDtOld = changedValue.oldValue;
                    updateProfileModel.passPortExpDtNew = changedValue.newValue;
                }
            } else if (changedValue.label == "Mobile Number") {
                updateProfileModel.isMobileUpdated = true;
                updateProfileModel.mobOld = changedValue.oldValue;
                updateProfileModel.mobNew = changedValue.newValue;
            } else if (changedValue.label == "Nationality") {
                updateProfileModel.isNationalityUpdated = true;
                updateProfileModel.nationalityOld = changedValue.oldValue;
                updateProfileModel.nationalityNew = changedValue.newValue;
            } else if (changedValue.label == "Country Of Residence") {
                updateProfileModel.isCORUpdated = true;
                updateProfileModel.COROld = changedValue.oldValue;
                updateProfileModel.CORNew = changedValue.newValue;
            } else if (changedValue.label == "Email") {
                updateProfileModel.isEmailUpdated = true;
                updateProfileModel.emailOld = changedValue.oldValue;
                updateProfileModel.emailNew = changedValue.newValue;
            } else if (changedValue.label == "Country Code") {
                updateProfileModel.countryCodeOld = changedValue.oldValue;
                updateProfileModel.countryCodeNew = changedValue.newValue;
            }
        });
        componentThis.$parent.updateProfileModel = updateProfileModel;
    }
    var initTriggerUpdateProfile = function() {
        var preload = $('.overlay-loading');
        preload.addClass('hidden');
        var popupValue = ".update-krisflyer-account";
        $(popupValue).Popup({
            modalShowClass: '',
            triggerCloseModal: '.popup__close',
            closeViaOverlay: true
        });
        $(popupValue).Popup("show");
        $('input:checkbox').prop('checked', false)
        $("#adult-passenger-input-1").addClass('disabled');
        $("#adult-passenger-input-1").attr('disabled', 'true');
        $('body').find('.bg-modal').addClass('overlay');
    }

    var setcancelFlag = function(flag) {
        cancelFlag = flag;
    };

    var checkmbDeeplinkEnable = function() {
        var mbDeeplinkSwitch = document.getElementById("mbDeepLinkSwitch").value;
        mbDeeplinkSwitch = mbDeeplinkSwitch ? mbDeeplinkSwitch.toLowerCase() : false;
        if (mbDeeplinkSwitch != undefined && mbDeeplinkSwitch == "true")
            return true;
        else
            return false;
    };
    var setdglightboxcheckbox = function(dgacceptedTerms, dgeasaacceptedTerms) {
        var dgproceedbutton = $(".popup-dgrestriction-alert").find('button[name="dglightbox-boardingpass"]');
        var euflag = false;
        var sinFlag = false;
        var flightlist = this.dgflightlist1;
        if (flightlist && flightlist.destination && flightlist.destination.countryCode && flightlist.destination.countryCode != undefined && flightlist.destination.countryCode != "") {
            if (flightlist.destination.countryCode == "NL" || flightlist.destination.countryCode == "DK" || flightlist.destination.countryCode == "FR" || flightlist.destination.countryCode == "CH" || flightlist.destination.countryCode == "DE" || flightlist.destination.countryCode == "IT" || flightlist.destination.countryCode == "ES" || flightlist.destination.countryCode == "SE") {
                euflag = true;
            }
            if (flightlist.origin != undefined && flightlist.destination != undefined && (flightlist.origin.airportCode == "SIN" || flightlist.destination.airportCode == "SIN")) {
                sinFlag = true;
            }
        }
        if ((sinFlag || euflag) && dgproceedbutton) {
            if (dgacceptedTerms && dgeasaacceptedTerms) {
                document.getElementById('dglightbox-boardingpass').disabled = false;
                dgproceedbutton.removeClass('disabled');
            } else if (dgproceedbutton && dgproceedbutton.length > 0) {
                document.getElementById('dglightbox-boardingpass').disabled = true;
                dgproceedbutton.addClass('disabled');
            }
        } else {
            if (dgacceptedTerms) {
                document.getElementById('dglightbox-boardingpass').disabled = false;
                dgproceedbutton.removeClass('disabled');
            } else if (dgproceedbutton && dgproceedbutton.length > 0) {
                document.getElementById('dglightbox-boardingpass').disabled = true;
                dgproceedbutton.addClass('disabled');
            }
        }
    };
    var dateParser = function(inputdate) {
        var date = new Date(inputdate.substring(0, inputdate.indexOf("T")).replace(new RegExp('-','g'), '/'));
        var dayLabel = days[date.getDay()];
        var dateLabel = (date.getDate().toString().length == 1) ? "0" + date.getDate() : date.getDate();
        var monthLabel = months[date.getMonth()];

        return dayLabel + " " + dateLabel + " " + monthLabel;
    };

    var timeParser = function(date) {
        var date = new Date(date);
        var hourLabel = (date.getHours().toString().length == 1) ? "0" + date.getHours() : date.getHours();
        var minuteLabel = (date.getMinutes().toString().length == 1) ? "0" + date.getMinutes() : date.getMinutes();

        return hourLabel + ":" + minuteLabel;
    };

    var toggleAccordion = function(flights) {
        flights.active = !flights.active;
    };

    var checkAllPassenger = _.debounce(function(flightInOut, flights, segmentIndex) {
        checkboxState(flights.passengers, flights.isSelectedAll);
        for (var passengerIndex = 0; passengerIndex < flights.passengers.length; passengerIndex++) {
            canSelectPassenger(flightInOut, flights, segmentIndex, passengerIndex);
        }
    }, 50);

    var checkSelectAllPassengers = _.debounce(function(flightInOut, flights, segmentIndex, passengerIndex) {
        flights.isSelectedAll = getCheckBoxAllStatus(flights, "&&");
        canSelectPassenger(flightInOut, flights, segmentIndex, passengerIndex);
    }, 50);

    var getFormattedTerminalNumber = function(initial, terminalNumber) {
        var originTerminalNumber = terminalNumber;
        if (terminalNumber != "T0" && terminalNumber != "0" && terminalNumber != "" && terminalNumber != null) {
            if (terminalNumber == 'I') {
                originTerminalNumber = "(Intl)";
            } else {
                originTerminalNumber = " T" + terminalNumber;
            }
        } else if (terminalNumber == "0" || terminalNumber == "T0") {
            return "";
        }
        return initial + originTerminalNumber;
    }

    //FOR CHECKING IF THERE'S ANY OF THE CHECKBOX SELECTED
    var checkboxIsSelected = function(flightSegments) {
        var caasAcceptedTerms = this.caasAcceptedTerms;
        var commaSeperatedFlightID = "";
        $("#selectedFlightId").val("");
        var count = 0;
        var enable = _.reduce(flightSegments, function(flightMem, flight) {
            var isSelected = _.reduce(flight.passengers, function(passengerMem, i) {
                if (i.isSelected && !i.isDisabled && !i.isInfant) {
                    commaSeperatedFlightID = commaSeperatedFlightID + i.flightIDs[count];
                    $("#selectedFlightId").val(commaSeperatedFlightID);
                    commaSeperatedFlightID = commaSeperatedFlightID + ",";
                }
                return passengerMem || (i.isSelected && !i.isDisabled && !i.isInfant);
            }, false);

            count++;
            return flightMem || isSelected;
        }, false);

        enable = enable && caasAcceptedTerms;
        return enable;
    };

    var canSelectPassenger = function(flightSegments, flights, segmentIndex, passengerIndex) {
        var currentLegflights = flightSegments[segmentIndex];

        var prevLegflights = flightSegments[segmentIndex - 1];

        if (isAdultCheckedInLegs(flights)) {
            updateInfantState(currentLegflights.passengers, false);
        } else {
            updateInfantState(currentLegflights.passengers, true);
        }

        var rci = !flightSegments[segmentIndex + 1] ? null : currentLegflights.rci;
        var tci = !flightSegments[segmentIndex + 1] ? null : currentLegflights.tci;
        var nextSegmentStopOver = flightSegments[segmentIndex + 1] ? flightSegments[segmentIndex + 1].stopOver : currentLegflights.stopOver;

        if ((!rci || (prevLegflights && prevLegflights.rci)) && tci && !nextSegmentStopOver) {
            isAutoCheck = true;
        } else {
            isAutoCheck = false;
        }

        if (flightSegments[segmentIndex + 1]) {
            var nextLegflights = flightSegments[segmentIndex + 1] ? flightSegments[segmentIndex + 1] : null;

            var nextPassenger = nextLegflights.passengers[passengerIndex];

            var haveSelectedPassenger = currentLegflights.passengers[passengerIndex].isSelected;
            if (!(!nextPassenger.canBeSelected && nextPassenger.isSelected && nextPassenger.isDisabled)) {
                nextPassenger.canBeSelected = haveSelectedPassenger;
                flightSegments[segmentIndex + 1].active = true;
                if (!haveSelectedPassenger) {
                    nextPassenger.isSelected = false;
                } else if (isAutoCheck) {
                    nextPassenger.isSelected = true;
                    nextPassenger.isAutoCheck = true;
                }
                nextPassenger.isDisabled = !haveSelectedPassenger;
            }

            canSelectPassenger(flightSegments, flightSegments[segmentIndex + 1], segmentIndex + 1, passengerIndex);
            nextLegflights.isSelectedAll = getCheckBoxAllStatus(nextLegflights, "&&");

            if (isAdultCheckedInLegs(flights)) {
                updateInfantState(nextLegflights.passengers, false);
            } else {
                updateInfantState(nextLegflights.passengers, true);
            }
        }
    };

    var updateInfantState = function(passengers, state) {
        _.each(passengers, function(passenger) {
            if (passenger.passengerType == "IN" && passenger.taggedInfant == true) {
                passenger.canBeSelected = !state;
                passenger.isDisabled = state;
                if (state && passenger.isSelected) {
                    passenger.isSelected = !state;
                }
            }
        });
    };

    var isAdultCheckedInLegs = function(flightLeg) {
        return _.reduce(flightLeg.passengers, function(passengerMem, passenger) {
            return passengerMem || (passenger.passengerType == "A" && passenger.isSelected) ? true : false;
        }, false);

    };

    var numberWithCommas = function(value) {
        if (null == value) {
            return value;
        }
        return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };

    var validateEmail = function(event, emails) {
        $(event.target).parent('span.input-1').removeClass("focus");
        if (isEmailValid(event.target.value) || !event.target.value) {
            emails.isError = false;
            $('.email-error').addClass('hidden');
        } else {
            emails.isError = true;
            $('.email-error').removeClass('hidden');
        }
    };

    var validateEmailBpass = function(event, emails) {
        $(event.target).parent('span.input-1').children('label.email-label').removeClass("focus");
        if (isEmailValid(event.target.value) || !event.target.value) {
            emails.isError = false;
        } else {
            emails.isError = true;
        }
    };

    var disablesendbuttoncheck = function(flightSegments) {
        var status = !flightSegments.every(function(data) {
            return !data['isGetBpChecked']
        });
        return status;
    }

    var isEmailValid = function(email) {
        var regex = /^(("[\w-\s]+")|([\w-!_+'"]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
        return regex.test(email || "");
    };

    var onSubmitValidation = function(emails) {
        _.each(emails, function(email) {
            if (isEmailValid(email.email) && email.email != "") {
                email.isError = false;
            } else {
                email.isError = true;
            }
        })
    };
    var cancelFlight = function(flights) {
        if (flights.length > 0) {
            var cancelFlightIds = [];
            _.each(flights, function(flight) {
                _.each(flight.checkedInPassengersData, function(passenger) {
                    if (passenger.isSelected) {
                        cancelFlightIds.push(passenger.flightID);
                    }
                });
            });
            var data = "{" + "\"flightIDs\":" + JSON.stringify(cancelFlightIds) + "}";
            var checkinData = $("#paxDetailsJsonString").val();
            $.ajax({
                url: "/icheckIN/cancelCheckIn.form",
                type: "POST",
                data: {
                    "cancelFlightIds": data
                },
                beforeSend: function() {
                    $(".overlay-loading").removeClass("hidden");
                },
                statusCode: {
                    504: function(response) {
                        window.location = "/icheckIN/getPaxRecord.form";
                    }
                },
                success: function(response) {
                    if (response != 'FAILURE') {
                        $('.cancel-checkin-flight').Popup('hide');
                        successPopup(".cancel-checkin-flight-successfull", "/icheckIN/getPaxRecord.form", true);
                        $(".overlay-loading").addClass("hidden");
                    } else {
                        window.location = "/icheckIN/getPaxRecord.form";
                    }

                }
            });
        }
    }

    var onPrintBoardingPass = function(flightSegments) {
        $(".overlay-loading").removeClass("hidden");
        var paxIdFlightIdJson = {};
        var paxId;
        _.each(flightSegments, function(flightSegment) {
            if (flightSegment.isGetBpChecked) {
                paxId = flightSegment.paxID;
                paxIdFlightIdJson[paxId] = flightSegment.flightID;
            }
        });

        var htmContent = $("html");
        var redirectWindow = window.open('about:blank', '_blank');
        redirectWindow.document.write(htmContent.html());
        $.ajax({
            url: '/icheckIN/getBoardingPass.form',
            type: 'POST',
            data: {
                "paxIdFlightIdJson": JSON.stringify(paxIdFlightIdJson)
            },
            success: function(data) {
                if (data === 'SUCCESS') {
                    window.location = "/icheckIN/reloadGetPax.form";
                    redirectWindow.location.href = '/icheckIN/boardingPass.pdf';
                } else {
                    window.location = "/icheckIN/reloadGetPax.form";
                    redirectWindow.close();
                }
                $(".overlay-loading").addClass("hidden");
            }
        });
    }

    var onSendEmail = function(flightSegments, getBpPaxEmails) {
        var paxIdEmailJson = {};
        var paxIdFlightIdJson = {};
        var paxId;
        var isValid = true;
        _.each(flightSegments, function(flightSegment) {
            if (flightSegment.isGetBpChecked) {
                paxId = flightSegment.paxID;
                paxIdEmailJson[paxId] = (_.uniq(_.map(getBpPaxEmails.map(function(email) {
                    return email.email.toUpperCase()
                })))).toString();
                paxIdFlightIdJson[paxId] = flightSegment.flightID;
            }
        });
        isValid = getBpPaxEmails.every(function(email) {
            return email.isError == false;
        });
        if (isValid) {
            var url = "/icheckIN/sendBoardingPassEmail.form";
            $.ajax({
                url: url,
                data: {
                    "paxIdEmailJson": JSON.stringify(paxIdEmailJson),
                    "paxIdFlightIdJson": JSON.stringify(paxIdFlightIdJson),
                    "leg": "" + activeBpIndex
                },
                cache: false,
                type: "POST",
                beforeSend: function() {
                    $(".overlay-loading").removeClass("hidden");
                },
                success: function(response) {
                    window.location = "/icheckIN/reloadGetPax.form";
                },
                error: function(response) {
                    window.location = "/icheckIN/reloadGetPax.form";
                }
            });
        }
    }

    var onSubmitValidationCheckIn = function(emails) {
        _.each($(".send-check-in :input"), function(input, index) {
            if (isEmailValid(input.value) && input.value != "") {
                emails[index].isError = false;
            } else {
                emails[index].isError = true;
            }
        });
        var validEmails = !_.reduce(emails, function(emailMem, email) {
            return emailMem || (email.isError || email.address == "" || email.address == undefined)
        }, false);
        if (validEmails) {
            $('#retrievePNRForm').submit();
            $(".overlay-loading").removeClass("hidden");
        }
    }

    var onAddEmail = function() {
        this.emailSendCheckIn.push({
            isError: false
        });
        recenterLightBox();
    };

    var onAddEmailBoardingPasses = function() {
        this.emailGetBoarding.push({});
    };

    var removeEmailFields = function(index) {
        this.emailSendCheckIn.splice(index, 1);
        recenterLightBox();
    };

    var getBpCheckAll = function() {
        var modified = [{}];
        this.flightSegments.getbpCheckedAll = !this.flightSegments.getbpCheckedAll;
        if (this.flightSegments.getbpCheckedAll) {
            modified = this.flightSegments.map(function(pax) {
                pax['isGetBpChecked'] = true;
                return pax;
            });
        } else {
            modified = this.flightSegments.map(function(pax) {
                pax['isGetBpChecked'] = false;
                return pax;
            });
        }
        this.flightSegments = modified;
    }

    var updateCheckAll = function() {
        this.flightSegments.getbpCheckedAll = this.flightSegments.every(function(pax) {
            return pax.isGetBpChecked;
        });
    }

    var AddBpEmailFields = function() {
        this.getBpPaxEmails.push({
            email: '',
            isError: false
        });
    };

    var RemoveBpEmailFields = function(index) {
        this.getBpPaxEmails.splice(index, 1);
    };

    var focusInput = function(event) {
        $(event.target).parent('span.input-1').addClass("focus")
    }
    var focusInputBpass = function(event) {
        $(event.target).parent('span.input-1').children('label.email-label').addClass("focus");
        $(event.target).parent('span.input-1').parent('div.passengers-group').children('div.colorbox').addClass('focus');
    }

    var recenterLightBox = function() {
        var emailSendCheckInElement = $("aside.popup--check-in-email > div.popup__inner > div");
        var emailSendCheckInElementTop = ($(window).height()) / 2 - ((emailSendCheckInElement.height() + 65) / 2);
        emailSendCheckInElement.css({
            top: emailSendCheckInElementTop
        });
    };

    getbpcondition = function(flights) {
        let SPBPStatus = flights.checkedInPassengersData.every(function(el) {
            return el['dcsStatus'] && el['dcsStatus']['spBpEnabled']
        });
        if (flights.eligibleForBP && SPBPStatus && !flights.tci && !flights.rci)
            return true;
        else
            return false;
    }

    var getBpstatus = function(paxid, flId, services) {
        var en = false;
        var spBp;
        _.each(services, function(service) {
            if (service.passengerID == paxid && service.flightID == flId && !service.dcsStatus.spBpEnabled) {
                spBp = false;
                en = true;
            }
        });
        if (en == false) {
            spBp = true;
        }
        return spBp;
    };

    var getFlightSegment = function(services, popupValue) {
        var passengers = this.dgflightlist1.passengers;
        var checkedInPassengers = this.dgflightlist1.checkedInPassengersData;
        var checkedInData = [];
        checkedInData['getbpCheckedAll'] = true;
        _.each(checkedInPassengers, function(checkedInPassenger) {
            _.each(passengers, function(passenger) {
                if (passenger.passengerID == checkedInPassenger.passengerID && !passenger.isInfant) {
                    checkedInData.push({
                        firstName: passenger.firstName,
                        lastName: passenger.lastName,
                        email: passenger.email,
                        flightID: checkedInPassenger.flightID,
                        paxID: passenger.passengerID,
                        infant: passenger.infant,
                        isGetBpChecked: true,
                        bpEnabled: getBpstatus(checkedInPassenger.passengerID, checkedInPassenger.flightID, services),
                        isError: false
                    })
                }
            });
        });
        var filterdMailIDs = _.uniq(_.map(checkedInData, 'email')).map(function(x) {
            return {
                email: x,
                isError: false
            }
        });

        this.$emit("load-flight", {
            checkedInData: checkedInData,
            filterdMailIDs: filterdMailIDs
        });
        triggerPopup(popupValue);
        $('.popup-dgrestriction-alert').Popup('hide');
        window.scrollTo(0, 0);
    };

    var euFlagCheck = function() {
        var flightlist = this.dgflightlist1;
        if (flightlist && flightlist.destination && flightlist.destination.countryCode && flightlist.destination.countryCode != undefined && flightlist.destination.countryCode != "") {
            if (flightlist.destination.countryCode == "NL" || flightlist.destination.countryCode == "DK" || flightlist.destination.countryCode == "FR" || flightlist.destination.countryCode == "CH" || flightlist.destination.countryCode == "DE" || flightlist.destination.countryCode == "IT" || flightlist.destination.countryCode == "ES" || flightlist.destination.countryCode == "SE") {
                return true;
            }
        }
        return false;

    };

    var sinFlagCheck = function() {
        var flightlist = this.dgflightlist1;
        if (flightlist && flightlist.destination && flightlist.destination.airportCode && flightlist.destination.airportCode != undefined && flightlist.destination.airportCode != "" && flightlist.origin && flightlist.origin.airportCode && flightlist.origin.airportCode != undefined && flightlist.origin.airportCode != "") {
            if (flightlist.origin.airportCode == "SIN" || flightlist.destination.airportCode == "SIN") {
                return true;
            }
        }
        return false;

    };

    var getKFTier = function(code) {
        var tierName = "";
        var loyaltyPPS = ["QPPS", "TPPS", "LPPS"];
        var loyaltyPPS_Sup = ["QPTP", "QPLP", "TPTP", "TPLP"];
        var loyaltyNonPPS_Sup = ["KFTP", "KFLP", "ESTP", "ESLP", "EGTP", "EGLP"];
        if ((loyaltyPPS.indexOf(code) != -1) || (loyaltyPPS_Sup.indexOf(code) != -1)) {
            tierName = "PPS Club";
        } else if (loyaltyNonPPS_Sup.indexOf(code) != -1) {
            tierName = "PPS Club (Supp)";
        } else if ("KFEG" == code) {
            tierName = "Elite Gold";
        } else if ("KFES" == code) {
            tierName = "Elite Silver";
        } else {
            tierName = "KrisFlyer";
        }
        return tierName;
    };

    var getClassName = function(completeTierCode) {
        var tierCode = "";
        if ("LPPS" == completeTierCode || "KFLP" == completeTierCode || "ESLP" == completeTierCode || "EGLP" == completeTierCode || "QPLP" == completeTierCode || "TPLP" == completeTierCode) {
            tierCode = "L";
        } else if ("TPPS" == completeTierCode || "KFTP" == completeTierCode || "ESTP" == completeTierCode || "EGTP" == completeTierCode || "QPTP" == completeTierCode || "TPTP" == completeTierCode) {
            tierCode = "T";
        } else if ("QPPS" == completeTierCode) {
            tierCode = "Q";
        } else if ("KFEG" == completeTierCode) {
            tierCode = "G";
        } else if ("KFES" == completeTierCode) {
            tierCode = "S";
        } else {
            tierCode = "K";
        }
        return tierCode;
    };

    var triggerPopup = function(popupValue) {
        if (typeof popupValue == 'undefined') {
            return;
        }
        $(popupValue).Popup({
            modalShowClass: '',
            triggerCloseModal: '.popup__close',
            closeViaOverlay: true
        });
        $(popupValue).Popup("show");
        $(popupValue).Popup("show");
        $('body').find('.bg-modal').addClass('overlay');
    }

    var baggageAllowance = function(targetURL) {
        $.ajax({
            url: targetURL,
            type: "GET",
            success: function(data, textStatus, jqXHR) {
                var preload = $('.overlay-loading');
                preload.addClass('hidden');
                $('#baggageInfoDiv').val('');
                $("#baggageInfoDiv").html(data.trim());
                triggerPopup('.popup--add-ons-baggage');
                $(".popup--add-ons-baggage a.popup__close").append("<span class='ui-helper-hidden-accessible'>Close</span>");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var preload = $('.overlay-loading');
                preload.addClass('hidden');
            }
        });
    }

    var onMileageSubmit = function() {
        var selectedPax = this.selectedKrisFlyer;
        var jsonData = _.find(this.flightSegments[0].passengers, function(passenger) {
            var paxName = passenger.firstName != undefined ? passenger.firstName + " " + passenger.lastName : passenger.lastName;
            return paxName.trim() == selectedPax
        });

        var mileageForm = $("#form-mileage")[0];
        mileageForm.action = "/icheckIN/registerKFUser.form";
        mileageForm.join_KF.value = jsonData.passengerID;
        mileageForm.psgrCounter.value = this.passengerMilesList.length;
        mileageForm.MILE_ACCRUABLE.value = $("#milesAccurable").val();
        mileageForm.submit();
    }

    var toDate = function(epoch, format, locale) {
        epoch = epoch.replace('T', ' ');
        var dateYear = epoch.slice(0, 4);
        var dateMonth = epoch.slice(5, 7);
        if (dateMonth != undefined) {
            dateMonth = dateMonth - 1;
        }
        var dateDay = epoch.slice(8, 10);
        var timeHour = epoch.slice(11, 13);
        var timeMinute = epoch.slice(14, 16);
        var date = new Date(dateYear,dateMonth,dateDay,timeHour,timeMinute);

        format = format || 'dd/mmm/YY',
        locale = locale || 'en'
        dow = {};

        dow.en = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var formatted = format.replace('D', dow[locale][date.getDay()]).replace('d', ("0" + date.getDate()).slice(-2)).replace('mmm', ((monthNames[date.getMonth()]))).replace('yyyy', date.getFullYear()).replace('yy', ('' + date.getFullYear()).slice(-2)).replace('hh', ("0" + date.getHours()).slice(-2)).replace('mn', (date.getMinutes() < 10 ? '0' : '') + date.getMinutes())

        return formatted
    }

    Node.prototype.append = function() {
        for (var i = 0; i < arguments.length; i++) {
            this.appendChild(toNode(arguments[i], this.ownerDocument));
        }
    }
    ;

    function isNode(value) {
        return value instanceof Node;
    }

    function isAttrObject(value) {
        return value != null && typeof value === 'object' && !isNode(value);
    }

    function setAttributes(element, object) {
        Object.keys(object).forEach(function(key) {
            element.setAttribute(key, object[key]);
        });
    }

    function toNode(value, doc) {
        switch (typeof value) {
        case 'boolean':
        case 'number':
        case 'string':
            return doc.createTextNode(value.toString());
        case 'undefined':
            return doc.createTextNode('undefined');
        default:
            if (value === null) {
                return doc.createTextNode('null');
            }

            if (isNode(value)) {
                return value;
            }

            if (Array.isArray(value) && value.length >= 1) {
                var element = doc.createElement(value[0]);

                var i = 1;

                if (value.length > i) {
                    if (isAttrObject(value[i])) {
                        setAttributes(element, value[i]);
                        i++;
                    }

                    if (value.length > i) {
                        element.append.apply(element, value.slice(i));
                    }
                }

                return element;
            }

            throw new Error();
        }
    }

    var canSelectAll = function(flights) {
        return !_.chain(flights.passengers).map(function(passenger) {
            return (passenger.isSelected || !passenger.isDisabled);
        }).reduce(function(memory, current) {
            return memory && current;
        }, true).value();
    };

    var canSelectAllState = function(flights) {
        return _.chain(flights.passengers).map(function(passenger) {
            return passenger.isAutoCheck;
        }).reduce(function(memory, current) {
            return memory || current;
        }, false).value();
    };

    // UTILITIES
    var deepClone = function(list) {
        return JSON.parse(JSON.stringify(list));
    };

    var checkAll = _.debounce(function(flights, flightSegments, flightsIndex) {
        if (flights.isSelectedAll) {
            for (var i = flightsIndex; i < flightSegments.length; i++) {
                checkboxState(flightSegments[i].checkedInPassengersData, flights.isSelectedAll);
                flightSegments[i].isSelectedAll = flights.isSelectedAll;
            }
            this.noElementSelected = false;
        } else {
            checkboxState(flights.checkedInPassengersData, flights.isSelectedAll);
            for (var i = flightsIndex - 1; i >= 0; i--) {
                _.each(flightSegments[i].checkedInPassengersData, function(passenger) {
                    _.each(flights.checkedInPassengersData, function(mainPax) {
                        if (mainPax.passengerID == passenger.passengerID) {
                            if (passenger.canBeSelected || (passenger.passengerType == "IN" && !passenger.canBeSelected && passenger.taggedInfant == true)) {
                                passenger.isSelected = flights.isSelectedAll;
                            }
                        }
                    });
                });
                flightSegments[i].isSelectedAll = getCancelCheckinSegmentSelectAllState(flightSegments[i]);
            }
            /*for(var i = flightsIndex ; i >=  0 ; i--) {
				checkboxState(flightSegments[i].checkedInPassengersData, flights.isSelectedAll);
				flightSegments[i].isSelectedAll = flights.isSelectedAll;
			}*/
            this.noElementSelected = !isElementsSelected(flightSegments);
        }

        //checkboxState(flights.checkedInPassengersData, flights.isSelectedAll);
        selectAllTci(flights, flightSegments, flightsIndex);
        this.noElementSelected = !isElementsSelected(flightSegments);
    }, 50);

    var selectAllTci = function(flights, flightSegments, flightsIndex) {

        //gooing back
        if (flightsIndex > 0 && flightSegments[flightsIndex].tci && !flightSegments[flightsIndex].stopOver) {
            for (var i = flightsIndex - 1; i >= 0; i--) {
                if (!flightSegments[i].tci) {
                    break;
                }
                _.each(flightSegments[i].checkedInPassengersData, function(passenger) {
                    _.each(flights.checkedInPassengersData, function(mainPax) {
                        if (mainPax.passengerID == passenger.passengerID) {
                            if (passenger.canBeSelected || (passenger.passengerType == "IN" && !passenger.canBeSelected)) {
                                passenger.isSelected = flights.isSelectedAll;
                            }
                        }
                    });
                });
                flightSegments[i].isSelectedAll = getCancelCheckinSegmentSelectAllState(flightSegments[i]);
            }
        }
        //going forward
        if (flightsIndex < flightSegments.length - 1 && flightSegments[flightsIndex].tci && !flightSegments[flightsIndex + 1].stopOver) {
            for (var i = flightsIndex + 1; i < flightSegments.length; i++) {
                if (!flightSegments[i].tci) {
                    break;
                }
                _.each(flightSegments[i].checkedInPassengersData, function(passenger) {
                    _.each(flights.checkedInPassengersData, function(mainPax) {
                        if (mainPax.passengerID == passenger.passengerID) {
                            if (passenger.canBeSelected || (passenger.passengerType == "IN" && !passenger.canBeSelected && passenger.taggedInfant == true)) {
                                passenger.isSelected = flights.isSelectedAll;
                            }
                        }
                    });
                });
                flightSegments[i].isSelectedAll = getCancelCheckinSegmentSelectAllState(flightSegments[i]);
            }
        }
    }

    var isElementsSelected = function(flightSegments) {
        var isSelected = false;
        _.each(flightSegments, function(flights) {

            if (isSelected) {
                return;
            }
            isSelected = _.chain(flights.checkedInPassengersData).filter(function(passenger) {
                return !passenger.isDisabled;
            }).reduce(function(accumulatedIsSelected, passenger) {
                return accumulatedIsSelected || passenger.isSelected;
            }, false).value();
        });
        return isSelected;
    }

    var checkboxState = function(passengers, state) {
        _.each(passengers, function(passenger) {
            if (passenger.canBeSelected || (passenger.passengerType == "IN" && !passenger.canBeSelected && passenger.taggedInfant == true)) {
                passenger.isSelected = state;
            }
        });
    };

    var checkSelectAll = _.debounce(function(flights, flightSegments, flightsIndex, passengerIndex) {

        if (flights.checkedInPassengersData[passengerIndex].isSelected) {
            for (var i = flightsIndex; i < flightSegments.length; i++) {
                for (var j = 0; j < flightSegments[i].checkedInPassengersData.length; j++) {
                    if (flightSegments[i].checkedInPassengersData[j].passengerID == flights.checkedInPassengersData[passengerIndex].passengerID) {
                        flightSegments[i].checkedInPassengersData[j].isSelected = true;
                    }
                }
                flightSegments[i].isSelectedAll = getCancelCheckinSegmentSelectAllState(flightSegments[i]);
            }
            this.noElementSelected = false;
        } else {
            for (var i = flightsIndex; i >= 0; i--) {
                for (var j = 0; j < flightSegments[i].checkedInPassengersData.length; j++) {
                    if (flightSegments[i].checkedInPassengersData[j].passengerID == flights.checkedInPassengersData[passengerIndex].passengerID) {
                        flightSegments[i].checkedInPassengersData[j].isSelected = false;
                    }
                }
                flightSegments[i].isSelectedAll = getCancelCheckinSegmentSelectAllState(flightSegments[i]);
            }
            this.noElementSelected = !isElementsSelected(flightSegments);
        }

        tciPaxSelect(flights, flightSegments, flightsIndex, passengerIndex);
        this.noElementSelected = !isElementsSelected(flightSegments);

    }, 50);

    var tciPaxSelect = function(flights, flightSegments, flightsIndex, passengerIndex) {

        if (flightsIndex > 0 && flightSegments[flightsIndex].tci && !flightSegments[flightsIndex].stopOver) {
            for (var i = flightsIndex; i >= 0; i--) {
                for (var j = 0; j < flightSegments[i].checkedInPassengersData.length; j++) {
                    if (flightSegments[i].checkedInPassengersData[j].passengerID == flights.checkedInPassengersData[passengerIndex].passengerID) {
                        flightSegments[i].checkedInPassengersData[j].isSelected = flights.checkedInPassengersData[passengerIndex].isSelected;
                    }
                }
                flightSegments[i].isSelectedAll = getCancelCheckinSegmentSelectAllState(flightSegments[i]);
            }
        }

        if (flightsIndex < flightSegments.length - 1 && flightSegments[flightsIndex].tci && !flightSegments[flightsIndex + 1].stopOver) {
            for (var i = flightsIndex + 1; i < flightSegments.length; i++) {
                for (var j = 0; j < flightSegments[i].checkedInPassengersData.length; j++) {
                    if (flightSegments[i].checkedInPassengersData[j].passengerID == flights.checkedInPassengersData[passengerIndex].passengerID) {
                        flightSegments[i].checkedInPassengersData[j].isSelected = flights.checkedInPassengersData[passengerIndex].isSelected;
                    }
                }
                flightSegments[i].isSelectedAll = getCancelCheckinSegmentSelectAllState(flightSegments[i]);
            }
        }
    }

    var getCheckBoxAllStatus = function(flights, operator) {
        if (!flights.passengers.length) {
            return false;
        }

        return _.chain(flights.passengers).filter(function(passenger) {
            return !passenger.isInfant;
        }).map(function(passenger) {
            return passenger.isSelected;
        }).reduce(function(memory, bool) {
            switch (operator) {
            case "&&":
                return memory && bool;
            case "||":
                return memory || bool;
            }

        }, (operator == "&&") ? true : false).value();
    };

    var getIndexOfValue = function(object, key, value) {
        var indexFound = -1;
        object.some(function(currentValue, index) {
            if (currentValue[key] == value) {
                indexFound = index;
                return true;
            }
        });
        return indexFound;
    }

    /*addbag*/

    /* 
	** function- Mounted method for outer Baggage component
	*/
    var onBaggageMount = function() {

        $baggagescope.push(this);
        this.key = this._props.keys;
        var selectedpaxcount = 0;
        var flightIdObj = {};
        this.singlePaxFlow = true;

        for (var i = 0; i < this._props.flightsdata.passengers.length; i++) {
            if (this._props.flightsdata.passengers[i].isSelected) {
                selectedpaxcount = selectedpaxcount + 1;
                if (selectedpaxcount > 1 && !this.multiPaxFlow) {
                    this.multiPaxFlow = true;
                    this.singlePaxFlow = false;
                }
                for (var j = 0; j < this._props.flightsdata.passengers[i].flightIDs.length; j++) {
                    if (this._props.flightsdata.flightIDs.indexOf(this._props.flightsdata.passengers[i].flightIDs[j]) != -1 && !flightIdObj.hasOwnProperty(this._props.flightsdata.passengers[i].flightIDs[j])) {
                        flightIdObj[this._props.flightsdata.passengers[i].flightIDs[j]] = this._props.flightsdata.passengers[i].flightIDs[j];
                    }
                }
            }
        }

        this.flightIDArray = Object.keys(flightIdObj).map(function(id) {
            return flightIdObj[id];
        });

        this.pax_Array = [];
        this.pax_Array_Sorted = [];
        this.cpax_Array = [];
        $$this.$forceUpdate();
    };

    /* 
	** function- Mounted method for combined pax bag component
	*/
    var onCombinedBagCounterMount = function() {
        var concept_type = this._props.combinePaxArray[0].concept;
        for (var i = 0; i < this._props.combinePaxArray.length; i++) {
            if (concept_type.toLowerCase() == "w") {
                this.totalallowed = this.totalallowed + this._props.combinePaxArray[i].maxallowedweight;
            } else {
                this.totalallowed = this.totalallowed + this._props.combinePaxArray[i].maxallowedpiece;
            }
        }
        this.cpaxArray = this._props.combinePaxArray;
    };

    /* 
	** function- data for outer bag component
	*/
    var getBaggageData = function() {
        return {
            key: 0,
            singlePaxFlow: false,
            multiPaxFlow: false,
            showBaggageInfoBox: false,
            showMultiPaxList: false,
            showDeclareBagBox: false,
            showConfirmedBagBox: false,
            pax_Array: [],
            pax_Array_Sorted: [],
            cpax_Array: [],
            confirmed_PaxArray: [],
            flightIDArray: [],
            total_bags_added: 0,
            baggageError: false,
            loadOnClose: false,
            bpData: "",
            fromBpFlag: false
        }
    };

    /* 
	** function- data for single pax bag component
	*/
    var getBagCounterData = function() {
        return {
            bagcount: 0,
            maxlimitreached: false,
            minlimitreached: true
        }
    };

    /* 
	** function- data for combined pax bag component
	*/
    var getCombinedBagCounterData = function() {
        return {
            cpaxArray: [],
            totalallowed: 0,
            totalbagcount: 0,
            singlebagcount: [],
            cmaxlimitreached: [],
            cminlimitreached: []
        }
    };

    /* 
	** function- called when opening the light box
	** arg1- index of flight segment
	*/
    var openBaggageInfoBox = function(index, fromBp) {

        if (index == "none") {
            return
        }
        scrollPosition = window.pageYOffset;
        if (isIosDevice) {
            $("html").addClass("isIOS");
        }
        activeIndex = index;
        $baggagescope[activeIndex].showBaggageInfoBox = true;

        if (fromBp) {
            $baggagescope[activeIndex].fromBpFlag = true;
            $baggagescope[activeIndex].bpData = $("#bpIssuedCustomerDetails").val();
            $("#bpIssuedCustomerDetails").val("");
            $(".boading-pass-successfull").hide();
            $("#overlay").hide();
            $(".boading-pass-successfull").css('visibility', 'hidden');
            $(".boading-pass-successfull").css('opacity', '0');
            $("#overlay").css('visibility', 'hidden');
            $("#overlay").css('opacity', '0');
        }

        $(".ice-checkin-complete .header-main").css('z-index', '99');
        if ($('.smartbanner-close').length > 0) {
            $("html").addClass("override-smartbanner");
        }

        setTimeout(function() {
            $("#baggage-modal-" + activeIndex).removeClass('hidden');
            $("html").addClass("no-scroller-without-padding");
            $$this.$forceUpdate();
        }, 150);

        setTimeout(function() {
            $(".dynamic-modal.modal-" + activeIndex + " .modal-body").css('visibility', 'visible');
            $(".dynamic-modal.modal-" + activeIndex + " .modal-body").css('opacity', '1');
            window.scrollTo(0, 0);

            const $body = document.querySelector('body');
            $body.style.position = 'fixed';
            if (isIosDevice) {
                $body.style.height = '100vh';
                $body.style.overflow = 'hidden !important';
                $(".dynamic-modal.modal-" + activeIndex + " .modal-container").on('touchmove', function(event) {
                    event.stopPropagation();
                });
            }
        }, 250);

    };

    /* 
	** function- called when closing the light box
	*/
    var closeBaggageInfoBox = function() {

        if ($baggagescope[activeIndex].loadOnClose) {

            $(".overlay-loading").removeClass("hidden");
            if ($baggagescope[activeIndex].fromBpFlag) {
                $baggagescope[activeIndex].bpData = "";
                $baggagescope[activeIndex].fromBpFlag = false;
            }
            document.forms["getPaxSubmit"].submit();
            //location.reload();
        } else {

            $("#baggage-modal-" + activeIndex).addClass('hidden');
            $("html").removeClass("no-scroller-without-padding");
            $(".dynamic-modal.modal-" + activeIndex + " .modal-body").css('visibility', 'hidden');
            $(".dynamic-modal.modal-" + activeIndex + " .modal-body").css('opacity', '0');
            $(".ice-checkin-complete .header-main").css('z-index', '1');
            if ($('.smartbanner-close').length > 0) {
                $("html").removeClass("override-smartbanner");
            }
            window.scrollTo(0, scrollPosition);
            $baggagescope[activeIndex].showBaggageInfoBox = false;
            $baggagescope[activeIndex].showDeclareBagBox = false;
            $baggagescope[activeIndex].showMultiPaxList = false;
            $baggagescope[activeIndex].showConfirmedBagBox = false;
            $baggagescope[activeIndex].pax_Array = [];
            $baggagescope[activeIndex].pax_Array_Sorted = [];
            $baggagescope[activeIndex].cpax_Array = [];
            $baggagescope[activeIndex].confirmed_PaxArray = [];
            $baggagescope[activeIndex].total_bags_added = 0;
            if ($baggagescope[activeIndex].baggageError) {
                $baggagescope[activeIndex].baggageError = false;
            }
            if ($baggagescope[activeIndex].fromBpFlag) {
                $("#bpIssuedCustomerDetails").val($baggagescope[activeIndex].bpData);
                $(".boading-pass-successfull").show();
                $("#overlay").show();
                $(".boading-pass-successfull").css('visibility', 'visible');
                $(".boading-pass-successfull").css('opacity', '1');
                $("#overlay").css('visibility', 'visible');
                $("#overlay").css('opacity', '1');
                $baggagescope[activeIndex].bpData = "";
                $baggagescope[activeIndex].fromBpFlag = false;
            }
            activeIndex = "";
            const $body = document.querySelector('body');
            $body.style.removeProperty('position');
            if (isIosDevice) {
                $body.style.removeProperty('overflow');
                $body.style.removeProperty('height');
                $("html").removeClass("isIOS");
                $('.dynamic-modal .modal-container').off('touchmove');
            }
            $$this.$forceUpdate();
        }
    };

    /* 
	** function- check whether given item is array
	*/
    var ifArray = function(item) {
        return Object.prototype.toString.call(item).toLowerCase() === '[object Array]'.toLowerCase();
    }

    /* 
	** function- calls backend to get bag details of pax
	*/
    var onClickStart = function() {

        $.ajax({
            url: "/icheckIN/getBagAllowance.form",
            type: "POST",
            data: {
                "flightID": $baggagescope[activeIndex].flightIDArray.join()
            },
            beforeSend: function() {
                $(".overlay-loading").removeClass("hidden");
            },
            success: function(response) {

                if (response.toLowerCase() != "failure" && response != null && ifArray(JSON.parse(response))) {

                    if ($baggagescope[activeIndex].baggageError) {
                        $baggagescope[activeIndex].baggageError = false;
                    }

                    $baggagescope[activeIndex].showBaggageInfoBox = false;

                    var responseData = JSON.parse(response);
                    var index = 0;
                    for (var i = 0; i < responseData.length; i++) {
                        if (responseData[i].paxType.toLowerCase() == "in" && responseData[i].taggedInfant) {
                            continue;
                        } else {
                            responseData[i].id = index;
                            $baggagescope[activeIndex].pax_Array.push(responseData[i]);
                            index += 1;
                        }
                    }

                    $baggagescope[activeIndex].pax_Array_Sorted = JSON.parse(JSON.stringify($baggagescope[activeIndex].pax_Array));

                    if ($baggagescope[activeIndex].singlePaxFlow) {
                        $baggagescope[activeIndex].showMultiPaxList = false;
                        $baggagescope[activeIndex].showDeclareBagBox = true;
                    } else if ($baggagescope[activeIndex].multiPaxFlow) {
                        $baggagescope[activeIndex].showDeclareBagBox = false;
                        $baggagescope[activeIndex].showMultiPaxList = true;
                    }

                } else {
                    $baggagescope[activeIndex].baggageError = true;
                }

                $("#modal-wrapper-id-" + activeIndex).animate({
                    scrollTop: 0
                }, "fast");
                setTimeout(function() {
                    $(".overlay-loading").addClass("hidden");
                }, 100);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $baggagescope[activeIndex].baggageError = true;
                $("#modal-wrapper-id-" + activeIndex).animate({
                    scrollTop: 0
                }, "fast");
                setTimeout(function() {
                    $(".overlay-loading").addClass("hidden");
                }, 100);
            }
        });
    };

    /* 
	**function- submit in multi pax list
	*/
    var multiPaxSubmit = function() {
        $baggagescope[activeIndex].showMultiPaxList = false;
        $baggagescope[activeIndex].showDeclareBagBox = true;
        $("#modal-wrapper-id-" + activeIndex).animate({
            scrollTop: 0
        }, "fast");
    };

    /* 
	**function- called on click of back button in declar bag lightbox
	*/
    var declareBackButton = function() {
        $baggagescope[activeIndex].showMultiPaxList = true;
        $baggagescope[activeIndex].showDeclareBagBox = false;
        $baggagescope[activeIndex].cpax_Array = [];
        $baggagescope[activeIndex].pax_Array_Sorted = JSON.parse(JSON.stringify($baggagescope[activeIndex].pax_Array));
        $baggagescope[activeIndex].total_bags_added = 0;
        $("#modal-wrapper-id-" + activeIndex).animate({
            scrollTop: 0
        }, "fast");
    };

    /* 
	**function- generates the title name of passenger
	*/
    var getNameText = function(title, fname, lname) {
        if (typeof title == "undefined" || title == "") {
            return fname + " " + lname;
        } else {
            return title + ". " + fname + " " + lname;
        }
    };

    /* 
	**function- generates the text to show under pax counters section
	**arg1- weight / piece concept
	**arg2- max allowed weight 
	**arg3- max allowed piece
	**arg4- weight per piece
	*/
    var getBaggageAllowanceText = function(concept, maxallowedweight, maxallowedpiece, weigthperpiece) {
        if (concept.toLowerCase() == "w") {
            return " " + maxallowedweight + getPMsg('kg');
        } else {
            return " " + maxallowedpiece + getPMsg('pieces');
        }
    };

    /* 
	**function- hide border for last pax
	*/
    var showBorder = function(key, paxlength) {
        if ((key + 1) == paxlength) {
            return true;
        } else {
            return false;
        }
    };

    /* 
	**function- add or subtract counters in single pax case
	**arg1- specifies the opertion to be performed add or subtract
	**arg2- weight or piece concept
	**arg3- maxallowedpiece in piece concept 
	*/
    var onChangeCount = function(operation, concept, maxallowedpiece) {

        var scope = this;

        setTimeout(function() {

            if (operation.toLowerCase() == "m" && !scope.minlimitreached) {
                scope.bagcount -= 1;
                $baggagescope[activeIndex].total_bags_added -= 1;
            }
            if (operation.toLowerCase() == "a" && !scope.maxlimitreached) {
                scope.bagcount += 1;
                $baggagescope[activeIndex].total_bags_added += 1;
            }

            if (concept.toLowerCase() == "w") {

                if (scope.bagcount == 10) {
                    scope.maxlimitreached = true;
                } else {
                    scope.maxlimitreached = false;
                }

                if (scope.bagcount == 0) {
                    scope.minlimitreached = true;
                } else {
                    scope.minlimitreached = false;
                }

            } else {

                if (scope.bagcount == maxallowedpiece) {
                    scope.maxlimitreached = true;
                } else {
                    scope.maxlimitreached = false;
                }

                if (scope.bagcount == 0) {
                    scope.minlimitreached = true;
                } else {
                    scope.minlimitreached = false;
                }
            }

        }, 100);

    };

    /* 
	**function- data of max or min limit and count
	**arg1- index passenger in array 
	**arg2- action
	*/
    var getCombinedData = function(index, action) {
        if (action.toLowerCase() == 'max') {
            if (typeof this.cmaxlimitreached == "undefined" || typeof this.cmaxlimitreached[index] == "undefined" || this.cmaxlimitreached.length == 0) {
                this.cmaxlimitreached[index] = false;
            }
            return this.cmaxlimitreached[index];
        }
        if (action.toLowerCase() == 'min') {
            if (typeof this.cminlimitreached == "undefined" || typeof this.cminlimitreached[index] == "undefined" || this.cminlimitreached.length == 0) {
                this.cminlimitreached[index] = true;
            }
            return this.cminlimitreached[index];
        }
        if (action.toLowerCase() == 'count') {
            if (typeof this.singlebagcount == "undefined" || typeof this.singlebagcount[index] == "undefined" || this.singlebagcount.length == 0) {
                this.singlebagcount[index] = 0;
            }
            return this.singlebagcount[index];
        }
    };

    /* 
	**function- add or subtract counters in combined case
	**arg1- specifies the opertion to be performed add or subtract
	**arg2- index of passenger in array
	**arg3- weight or piece concept  
	*/
    var onChangeCountCombined = function(operation, index, concept) {
        var scope = this;

        setTimeout(function() {

            if (operation.toLowerCase() == "m" && !scope.cminlimitreached[index]) {
                scope.totalbagcount -= 1;
                $baggagescope[activeIndex].total_bags_added -= 1;
                scope.singlebagcount[index] -= 1;
            }

            if (operation.toLowerCase() == "a" && !scope.cmaxlimitreached[index]) {
                scope.totalbagcount += 1;
                $baggagescope[activeIndex].total_bags_added += 1;
                scope.singlebagcount[index] += 1;
            }

            if (concept.toLowerCase() == "w") {

                if (scope.singlebagcount[index] == 10) {
                    scope.cmaxlimitreached[index] = true;
                } else {
                    scope.cmaxlimitreached[index] = false;
                }

                if (scope.singlebagcount[index] == 0) {
                    scope.cminlimitreached[index] = true;
                } else {
                    scope.cminlimitreached[index] = false;
                }

            } else {

                for (var i = 0; i < scope.cpaxArray.length; i++) {

                    if (scope.totalbagcount == scope.totalallowed) {
                        scope.cmaxlimitreached[i] = true;
                    } else {
                        scope.cmaxlimitreached[i] = false;
                    }

                    if (scope.totalbagcount == 0) {
                        scope.cminlimitreached[i] = true;
                    } else {
                        scope.cminlimitreached[i] = false;
                    }

                    if (scope.singlebagcount[i] == 0) {
                        scope.cminlimitreached[i] = true;
                    } else {
                        scope.cminlimitreached[i] = false;
                    }

                }
            }

            scope.$forceUpdate();

        }, 100);

    };

    /* 
	**function- generates the text to show under combined pax counters section
	*/
    var getCombinedBaggageAllowanceText = function() {
        if (this.cpaxArray.length > 0) {
            var concepttype = this.cpaxArray[0].concept;
            if (concepttype.toLowerCase() == "w") {
                return " " + this.totalallowed + getPMsg('kg');
            } else {
                return " " + this.totalallowed + getPMsg('pieces');
            }
        } else {
            return "";
        }
    };

    /* 
	** function- submits data from declare bag lightbox page to backend
	*/
    var declareBagSubmit = function() {

        $baggagescope[activeIndex].confirmed_PaxArray = [];
        var allpaxarray = [];
        var declareSubmitArray = [];
        var combinesubmitobj = {
            flightIds: [],
            quantity: []
        };
        var partialcase = false;

        /* Preparing combine pax data  */
        if (typeof $baggagescope[activeIndex].cpax_Array != "undefined" && $baggagescope[activeIndex].cpax_Array.length > 0) {
            for (var baglen = 0; baglen < $baggagescope[activeIndex].cpax_Array.length; baglen++) {
                var tempobj = JSON.parse(JSON.stringify($baggagescope[activeIndex].cpax_Array[baglen]));
                tempobj.addedbagcount = this.$refs["combinedpaxref"].singlebagcount[baglen];
                allpaxarray.push(tempobj);
                combinesubmitobj["flightIds"] = combinesubmitobj["flightIds"].concat(tempobj.flightIDs);
                combinesubmitobj["quantity"] = combinesubmitobj["quantity"].concat([tempobj.addedbagcount.toString()]);
            }
            declareSubmitArray.push(combinesubmitobj);
        }

        /* Preparing individual pax data  */
        if (typeof $baggagescope[activeIndex].pax_Array_Sorted != "undefined" && $baggagescope[activeIndex].pax_Array_Sorted.length > 0) {
            for (var baglen = 0; baglen < $baggagescope[activeIndex].pax_Array_Sorted.length; baglen++) {
                var tempsubmitobj = {
                    flightIds: [],
                    quantity: []
                };
                var tempobj = JSON.parse(JSON.stringify($baggagescope[activeIndex].pax_Array_Sorted[baglen]));
                tempobj.addedbagcount = this.$refs['paxref' + baglen][0].bagcount;
                allpaxarray.push(tempobj);
                tempsubmitobj["flightIds"] = tempsubmitobj["flightIds"].concat(tempobj.flightIDs);
                tempsubmitobj["quantity"] = tempsubmitobj["quantity"].concat([tempobj.addedbagcount.toString()]);
                declareSubmitArray.push(tempsubmitobj);
            }
        }

        /* Ajax call  for submission of data
		** data : Array containing flight id  and quantity data  
		*/

        $.ajax({
            url: "/icheckIN/updateBagAllowance.form",
            type: "POST",
            data: {
                "addBagRequest": JSON.stringify(declareSubmitArray)
            },
            beforeSend: function() {
                $(".overlay-loading").removeClass("hidden");
            },
            success: function(response) {

                $baggagescope[activeIndex].loadOnClose = true;

                if (response.toLowerCase() != "failure" && response != null && ifArray(JSON.parse(response))) {

                    var responseData = JSON.parse(response);
                    /* Checking for partial case */
                    for (var reslen = 0; reslen < responseData.length; reslen++) {
                        if (responseData[reslen].status.toLowerCase() == "failure" && !partialcase) {
                            partialcase = true;
                            break;
                        }
                    }

                    if (partialcase) {
                        closeBaggageInfoBox();
                    } else {
                        /* Setting the confirmed pax array for the confirmation page -- set success and failure flag for each pax */
                        for (var paxlen = 0; paxlen < allpaxarray.length; paxlen++) {
                            $baggagescope[activeIndex].confirmed_PaxArray.push(allpaxarray[paxlen]);
                        }
                        $baggagescope[activeIndex].showDeclareBagBox = false;
                        $baggagescope[activeIndex].showConfirmedBagBox = true;
                        $("#modal-wrapper-id-" + activeIndex).animate({
                            scrollTop: 0
                        }, "fast");
                        setTimeout(function() {
                            $(".overlay-loading").addClass("hidden");
                        }, 100);
                    }
                } else {
                    closeBaggageInfoBox();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $baggagescope[activeIndex].loadOnClose = true;
                closeBaggageInfoBox();
            }
        });

    };

    /* 
	** function- helps adding combined pax
	** arg1- id of the passenger object
	** arg2- event object
	*/
    var onClickAddCombinePax = function(id, event) {

        if (event.target.checked) {
            $baggagescope[activeIndex].cpax_Array.push(JSON.parse(JSON.stringify($baggagescope[activeIndex].pax_Array[id])));
            $baggagescope[activeIndex].pax_Array_Sorted = $baggagescope[activeIndex].pax_Array_Sorted.filter(function(pax) {
                if (pax.id == id) {
                    return false;
                } else {
                    return true;
                }
            });
        } else {
            $baggagescope[activeIndex].pax_Array_Sorted.push(JSON.parse(JSON.stringify($baggagescope[activeIndex].pax_Array[id])));
            $baggagescope[activeIndex].cpax_Array = $baggagescope[activeIndex].cpax_Array.filter(function(pax) {
                if (pax.id == id) {
                    return false;
                } else {
                    return true;
                }
            });
        }
        $baggagescope[activeIndex].$forceUpdate();
    };

    /* 
	** function- helps to check if link for adding bag exists
	** arg1- legno
	*/
    var isBagDeclareEligible = function(legIndex) {
        if ($('#openbagsegno-' + legIndex).length > 0) {
            return true;
        } else {
            return false;
        }
    };

    /* 
	** function- to get parsed message
	** arg1- key
	*/
    var getPMsg = function(key) {
        return typeof pageData.baggagedetails[key] == "undefined" ? 'pageData.baggagedetails.' + key : pageData.baggagedetails[key];
    };

    /*addbag*/

    /*hc*/

    /* 
    ** function- data for health certificate
    */
    var getHealthCertData = function() {
        return {
            itinData: [],
            docCount: 0,
            disablesubmit: true,
            allverified: false
        }
    };

    /* 
	** function- Mounted method for health cert component
	*/
    var onHealthCertMount = function() {

        $(".overlay-loading").removeClass("hidden");
        var flightIdObj = {};
        var flightIDArray = [];
        var healthcertscope = this;

        for (var i = 0; i < $$this.flightdatahc.passengers.length; i++) {
            if ($$this.flightdatahc.passengers[i].isSelected) {
                for (var j = 0; j < $$this.flightdatahc.passengers[i].flightIDs.length; j++) {
                    if ($$this.flightdatahc.flightIDs.indexOf($$this.flightdatahc.passengers[i].flightIDs[j]) != -1 && !flightIdObj.hasOwnProperty($$this.flightdatahc.passengers[i].flightIDs[j])) {
                        flightIdObj[$$this.flightdatahc.passengers[i].flightIDs[j]] = $$this.flightdatahc.passengers[i].flightIDs[j];
                    }
                }
            }
        }

        flightIDArray = Object.keys(flightIdObj).map(function(id) {
            return flightIdObj[id];
        });

        $.ajax({

            url: "/icheckIN/getHslPax.form",
            type: "POST",
            data: {
                "flightID": flightIDArray.join()
            },
            success: function(response) {
                if (response.toLowerCase() != "failure" && response != null) {
                    var responseData = JSON.parse(response);
                    //healthcertscope.itinData = [responseData];
                    healthcertscope.itinData = [{
                        from: "Sydney",
                        to: "Singapore",
                        paxData: [{
                            flightId: flightIDArray[0],
                            firstName: "John",
                            lastName: "Tan",
                            paxType: "A",
                            status: "F",
                            fileName: "",
                            decoded: null,
                            certRequired: true,
                            certPassed: false
                        }, {
                            flightId: flightIDArray[0],
                            firstName: "Rebecca",
                            lastName: "Chin",
                            paxType: "A",
                            status: "F",
                            fileName: "",
                            decoded: null,
                            certRequired: true,
                            certPassed: false
                        }]
                    }];
                    var verifiedcount = 0;
                    var paxcount = 0;
                    for (var k = 0; k < healthcertscope.itinData.length; k++) {
                        for (var j = 0; j < healthcertscope.itinData[k].paxData.length; j++) {
                            paxcount += 1;
                            if (healthcertscope.itinData[k].paxData[j].status.toLowerCase() == "s") {
                                verifiedcount += 1;
                            }
                        }
                    }
                    if (paxcount == verifiedcount) {
                        healthcertscope.allverified = true;
                    }
                    setTimeout(function() {
                        $(".overlay-loading").addClass("hidden");
                    }, 100);
                } else {
                    closeHCInfoBox();
                    $(".overlay-loading").addClass("hidden");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                closeHCInfoBox();
                $(".overlay-loading").addClass("hidden");
            }

        });
    };

    /* 
    ** function- on cert pax mount
    */
    var onCertPaxMount = function() {

        var certpaxscope = this;
        certpaxscope.fileid = this._props.segindex + " " + this._props.index;
        certpaxscope.status = this._props.paxstatus;

        $("#fileinput" + this._props.segindex + "" + this._props.index).on("change", function() {

            certpaxscope.showUploadLoader = true;

            if ($(this)[0].files.length) {

                certpaxscope.fileError = "";

                if ($(this)[0].files[0].size > certpaxscope.filesizelimit) {
                    certpaxscope.fileError = "1";
                    certpaxscope.status = "F";
                    certpaxscope.showUploadLoader = false;
                } else if (!checkIfFileSupported($(this)[0].files[0])) {
                    certpaxscope.fileError = "2";
                    certpaxscope.status = "F";
                    certpaxscope.showUploadLoader = false;
                }

                if (certpaxscope.fileError == "") {

                    var formData = new FormData();
                    formData.append("file", $(this)[0].files[0]);
                    formData.append("flightID", certpaxscope._props.flightid);
                    var fileobj = $(this)[0].files[0];

                    $.ajax({
                        url: "/icheckIN/qrcodeFileUploadHandler.form",
                        type: "POST",
                        data: formData,
                        method: "POST",
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(response) {

                            setTimeout(function() {
                                if (response.toLowerCase() == "success" || response.toLowerCase() == "s") {
                                    certpaxscope.filename = fileobj.name + " (" + readableBytesText(fileobj.size) + ")";
                                    certpaxscope.status = "T";
                                    certpaxscope._props.changeBtn(1);
                                } else {
                                    certpaxscope.fileError = "3";
                                    certpaxscope.status = "F";
                                }
                                certpaxscope.showUploadLoader = false;
                            }, 50);

                            //tobe written
                        },
                        error: function(jqxhr, textStatus, errThrown) {
                            //temp error
                            setTimeout(function() {
                                certpaxscope.fileError = "3";
                                certpaxscope.status = "F";
                                certpaxscope.showUploadLoader = false;
                            }, 50);
                        }
                    });
                }
            } else {
                certpaxscope.showUploadLoader = false;
            }

        });
    };

    /* 
    ** function- data for pax
    */
    var certPaxData = function() {
        return {
            fileid: "",
            filename: "",
            filesizelimit: 2000000,
            fileError: "",
            showUploadLoader: false,
            status: "f",
            camenable: false,
            scanerror: false,
            scandata: "",
            scanfailerror: false
        }
    };

    /* 
    ** function- open HC lightbox
    */
    var openHCInfoBox = function(flightsdata) {

        hscrollPosition = window.pageYOffset;
        if (isIosDevice) {
            $("html").addClass("isIOS");
        }
        $(".ice-checkin-complete .header-main").css('z-index', '99');
        if ($('.smartbanner-close').length > 0) {
            $("html").addClass("override-smartbanner");
        }

        $$this.flightdatahc = flightsdata;
        $$this.showhc = true;

        setTimeout(function() {
            $("#health-modal").removeClass('hidden');
            $("html").addClass("no-scroller-without-padding");
            $$this.$forceUpdate();
        }, 150);
        setTimeout(function() {
            $(".popup-hc.dynamic-modal .modal-body").css('visibility', 'visible');
            $(".popup-hc.dynamic-modal .modal-body").css('opacity', '1');
            window.scrollTo(0, 0);
            const $body = document.querySelector('body');
            $body.style.position = 'fixed';
            if (isIosDevice) {
                $body.style.height = '100vh';
                $body.style.overflow = 'hidden !important';
                $(".popup-hc.dynamic-modal .modal-container").on('touchmove', function(event) {
                    event.stopPropagation();
                });
            }
        }, 250);

    };

    /* 
    ** function- close HC lightbox
    */
    var closeHCInfoBox = function() {

        $("#health-modal").addClass('hidden');
        $("html").removeClass("no-scroller-without-padding");
        $(".popup-hc.dynamic-modal .modal-body").css('visibility', 'hidden');
        $(".popup-hc.dynamic-modal .modal-body").css('opacity', '0');
        $(".ice-checkin-complete .header-main").css('z-index', '1');
        if ($('.smartbanner-close').length > 0) {
            $("html").removeClass("override-smartbanner");
        }

        $$this.showhc = false;
        $$this.flightdatahc = "";

        window.scrollTo(0, hscrollPosition);
        const $body = document.querySelector('body');
        $body.style.removeProperty('position');
        if (isIosDevice) {
            $body.style.removeProperty('overflow');
            $body.style.removeProperty('height');
            $("html").removeClass("isIOS");
            $('.dynamic-modal .modal-container').off('touchmove');
        }
        $$this.$forceUpdate();

    };

    /* 
    ** function- open Scanning lightbox
    */
    var openForScan = function() {

        $(".popup-hc.dynamic-modal .modal-wrapper").addClass("block");
        $$this.activeCamPax = this;

        setTimeout(function() {
            $("#cam-modal").removeClass('hidden');
            $$this.$forceUpdate();
        }, 150);

        setTimeout(function() {
            $(".popup-cam.dynamic-modal .modal-body").css('visibility', 'visible');
            $(".popup-cam.dynamic-modal .modal-body").css('opacity', '1');
            window.scrollTo(0, 0);
            if (isIosDevice) {
                $(".popup-cam.dynamic-modal .modal-container").on('touchmove', function(event) {
                    event.stopPropagation();
                });
            }
        }, 250);
    }

    /* 
    ** function- close Scanning lightbox
    */
    var closeScan = function() {

        $(".popup-hc.dynamic-modal .modal-wrapper").removeClass("block");
        $("#cam-modal").addClass('hidden');
        $(".popup-cam.dynamic-modal .modal-body").css('visibility', 'hidden');
        $(".popup-cam.dynamic-modal .modal-body").css('opacity', '0');
        if (isIosDevice) {
            $(".popup-cam.dynamic-modal .modal-container").off('touchmove');
        }
        stopScan();
        $$this.activeCamPax.camenable = false;
        $$this.activeCamPax.scanerror = false;
        $$this.activeCamPax.scanfailerror = false;
        $$this.activeCamPax = "";
        $$this.$forceUpdate();
    }

    /* 
    ** function- return text with in and outbound locations
    */
    var getFromToText = function(id, from, to) {
        return id + ". " + from + " to " + to;
    }

    /* 
    ** function- handler for on click
    */
    var openChooseFile = function(id) {
        $("#" + id).click();
    }

    /* 
    ** function- to check if cam enable flag is false
    */
    var isCamDisable = function() {
        if (this.activeCamPax == "") {
            return false;
        } else {
            return !this.activeCamPax.camenable;
        }
    }

    /* 
    ** function- to check if cam enable flag is true
    */
    var isCamEnable = function() {
        if (this.activeCamPax == "") {
            return false;
        } else {
            return this.activeCamPax.camenable && !this.activeCamPax.scanerror && !this.activeCamPax.scanfailerror;
        }
    }

    /* 
    ** function- to check if cam enable flag is true with error
    */
    var isCamEnableError = function() {
        if (this.activeCamPax == "") {
            return false;
        } else {
            return this.activeCamPax.camenable && this.activeCamPax.scanerror && !this.activeCamPax.scanfailerror;
        }
    }

    /* 
    ** function- to check if cam enable flag is true with error
    */
    var isCamEnableErrorTimeout = function() {
        if (this.activeCamPax == "") {
            return false;
        } else {
            return this.activeCamPax.camenable && !this.activeCamPax.scanerror && this.activeCamPax.scanfailerror;
        }
    }

    /* 
    ** function- to enable camera for scanning
    */
    var accessCamera = function() {
        
        var cscope = this;
        if($$this.activeCamPax.scanfailerror){
            $$this.activeCamPax.scanfailerror = false;
        }
        var screenwidth = screen.width;
        if (screenwidth > 768) {
            screenwidth = 708;
        } else {
            screenwidth = screenwidth - 20;
        }
        var halfwidth = Math.round(screenwidth / 2);
        this.activeCamPax.camenable = true;

        setTimeout(function() {

            $("#reader").css("width", screenwidth + "px");
            html5QrCode = new Html5Qrcode("reader",false);

            Html5Qrcode.getCameras().then(function(devices) {
                
                setTimeout(function() {
                    
                    if(!$$this.activeCamPax.scanerror){
                        stopScan();
                        $$this.activeCamPax.scanfailerror = true;    
                    }

                }, 15000);

                if (devices && devices.length > 0) {
                    const config = {
                        fps: 10,
                        qrbox: halfwidth
                    };
                    if (devices.length > 1) {
                        html5QrCode.start({
                            facingMode: {
                                exact: "environment"
                            }
                        }, config, onScanSuccess, onErrorScan).catch(err=>{
                            html5QrCode.start({
                                deviceId: {
                                    exact: devices[0].id
                                }
                            }, config, onScanSuccess, onErrorScan).catch(function(err) {
                                //no device error
                                //alert("Error in identify camera1");
                                $$this.activeCamPax.scanerror = true;
                            });
                        }
                        );
                    } else {
                        html5QrCode.start({
                            deviceId: {
                                exact: devices[0].id
                            }
                        }, config, onScanSuccess, onErrorScan).catch(function(err) {
                            //no device error
                            //alert("Error in identify camera2");
                            $$this.activeCamPax.scanerror = true;
                        });
                    }
                } else {
                    //no device error
                    //alert("Error in identify camera3");
                    $$this.activeCamPax.scanerror = true;
                }

            }).catch(function(err) {
                //no device error
                //alert("Error in identify camera4");
                $$this.activeCamPax.scanerror = true;
            });

        }, 100);

    }

    /* 
    ** function- called after successfull scanning
    */
    function onScanSuccess(qrCodeMessage) {

        setTimeout(function() {

            if ($$this.activeCamPax.scandata == "") {

                $$this.activeCamPax.scandata = qrCodeMessage;
                $$this.activeCamPax.showUploadLoader = true;
                $$this.activeCamPax.fileError = "";

                var formData = new FormData();
                formData.append("qrCode", qrCodeMessage);
                formData.append("flightID", $$this.activeCamPax._props.flightid);

                $.ajax({
                    url: "/icheckIN/qrcodeScan.form",
                    type: "POST",
                    data: formData,
                    method: "POST",
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(response) {

                        if (response.toLowerCase() == "success" || response.toLowerCase() == "s") {
                            $$this.activeCamPax.status = "T";
                            $$this.activeCamPax._props.changeBtn(1);
                        } else {
                            $$this.activeCamPax.fileError = "3";
                            $$this.activeCamPax.status = "F";
                        }
                        $$this.activeCamPax.showUploadLoader = false;
                        closeScan();

                    },
                    error: function(jqxhr, textStatus, errThrown) {

                        $$this.activeCamPax.fileError = "3";
                        $$this.activeCamPax.status = "F";
                        $$this.activeCamPax.showUploadLoader = false;
                        closeScan();

                    }
                });

            }

        }, 100);

    }

    /* 
    ** function- called on each failed scanning
    */
    function onErrorScan(err) {}

    /* 
    ** function- help stop scanning
    */
    function stopScan() {
        if (html5QrCode != "") {
            html5QrCode.stop();
            html5QrCode = "";
        }
    }

    /* 
    ** function- get readable byte text from bytes
    */
    var readableBytesText = function(bytes) {
        var i = Math.floor(Math.log(bytes) / Math.log(1024));
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
    }

    /* 
    ** function- check if file type is supported
    */
    var checkIfFileSupported = function(file) {
        var fname = file.name;
        var re = /(\.jpg|\.jpeg|\.png)$/i;
        if (!re.exec(fname)) {
            return false
        } else {
            return true;
        }
    }

    /* 
    ** function- delete added file
    */
    var deleteAddedFile = function() {
        var current_input = $("#fileinput" + this._props.segindex + "" + this._props.index);
        this.status = "F";
        if (this.fileError != "") {
            this.fileError = "";
        }
        if (this.filename != "") {
            this.filename = "";
        }
        if (this.scandata != "") {
            this.scandata = "";
        }

        var fData = new FormData();
        fData.append("flightID", this._props.flightid);

        $.ajax({
            url: "/icheckIN/qrcodeDelete.form",
            type: "POST",
            data: fData,
            method: "POST",
            cache: false,
            contentType: false,
            processData: false,
            success: function(response) {
                if (current_input.val() != "") {
                    current_input.replaceWith(current_input.val('').clone(true));
                }
            },
            error: function(jqxhr, textStatus, errThrown) {
                if (current_input.val() != "") {
                    current_input.replaceWith(current_input.val('').clone(true));
                }
            }
        });
        this._props.changeBtn(-1);
    }

    /* 
	** function- to enable and  disable submit verification button
	*/
    var changeVerifyBtn = function(count) {
        this.docCount += count;
        if (this.docCount > 0) {
            this.disablesubmit = false;
        } else {
            this.disablesubmit = true;
        }
    }

    /* 
    ** function- to submit for verificaton
    */
    var submitForVerification = function() {
        $$this.showhc = false;
        setTimeout(function() {
            $$this.showhc = true;
        }, 50);
    }

    /*hc*/

    return {
        init: init
    };
}();

var waitForLibraries = function(fn) {
    setTimeout(function() {
        if (typeof _ == 'undefined' || typeof Vue == 'undefined') {
            waitForLibraries(fn);
        } else {
            fn.init();
        }
    }, 100);
};

$(function() {
    waitForLibraries(SIA.MpIceCheckInComplete);
});

$(document).on("click", "#popup_Close_2FA", function() {
    $('body').find('.update-krisflyer-account').removeClass('update-krisflyer-2FAoverlay');
    $('body').find('.update-krisflyer-account').addClass('update-KF-overlay');
});
var verifyOTP = function($event) {
    if (undefined != $("#otpMode").val()) {
        if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
            var otpNumber = $(".popout--authenticationcodeEmail #membership-motp").val();
            var otpMode = $("#otpMode").val();
        } else if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
            var otpNumber = $(".popout--authenticationcodemobile #membership-motp").val();
            var otpMode = $("#otpMode").val();
        }
    }
    if (undefined != otpNumber && undefined != otpMode) {
        triggerVerifyOtp(otpNumber, otpMode);
    }
}
var triggerVerifyOtp = function(otpNumber, otpMode) {
    $(".overlay-loading").removeClass("hidden");
    $.ajax({
        url: "/icheckIN/verifyOtp.form",
        type: "POST",
        data: {
            otp: otpNumber,
            otpMode: otpMode
        },
        beforeSend: function() {//$("div.overlay-loading").removeClass('hidden'); 
        },
        success: function(response) {
            var res = null;
            $(".popout--authenticationcodemobile .left").addClass("hidden");
            //left
            $(".popout--authenticationcodeEmail .left").addClass("hidden");
            //left
            $(".popout--authenticationcodemobile .security-input-form").removeClass("form-error");
            $(".popout--authenticationcodeEmail .security-input-form").removeClass("form-error");
            $(".popout--authenticationcodeEmail .update-profile-error").addClass("hidden");
            $(".popout--authenticationcodemobile .update-profile-error").addClass("hidden");
            $(".popout--authenticationcodemobile .success-alert").addClass("hidden");
            $(".popout--authenticationcodeEmail .success-alert").addClass("hidden");
            try {
                res = $.parseJSON(response);
                if (undefined != res.status && res.status == saar5.l9.iceOtp.success) {
                    $("#otpInSession").val("true");
                    triggerVerificationSuccess();
                } else {
                    showErrorMessage(res);
                    $(".overlay-loading").addClass("hidden");
                }
            } catch (e) {}

        }

    });
}
var showErrorMessage = function(res) {
    if (undefined != res.status && res.status == saar5.l9.iceOtp.failure) {
        if (res.code == saar5.l9.iceOtp.errorCodeExceededResend) {
            if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
                $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.exceededResend);
                $(".popout--authenticationcodemobile .update-profile-error").removeClass("hidden");
            } else if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
                $(".popout--authenticationcodeEmail .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.exceededResend);
                $(".popout--authenticationcodeEmail .update-profile-error").removeClass("hidden");
            }
        } else if (res.code == saar5.l9.iceOtp.errorCodesnapdown) {
            if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
                if (undefined != res.isEmailPresentFlag && res.isEmailPresentFlag == "true") {
                    $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpSnapdown);
                    $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").find(".sendToEmailInstead").on("click", function() {
                        sendByEmail();
                    });
                } else {
                    $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpSnapdownnoemail);
                }
                $(".popout--authenticationcodemobile .update-profile-error").removeClass("hidden");
            }
            if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
                if (undefined != res.isEmailPresentFlag) {
                    $(".popout--authenticationcodeEmail .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpSnapdown);
                } else {
                    $(".popout--authenticationcodeEmail .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpSnapdownnoemail);
                }
                $(".popout--authenticationcodeEmail .update-profile-error").removeClass("hidden");
            }
        } else if (res.code == saar5.l9.iceOtp.errorCodeIncorrectMultipleTImesOTP) {
            if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
                $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpIncorrectmultipletimes);
                $(".popout--authenticationcodemobile .update-profile-error").removeClass("hidden");
            }
            if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
                $(".popout--authenticationcodeEmail .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpIncorrectmultipletimes);
                $(".popout--authenticationcodeEmail .update-profile-error").removeClass("hidden");
            }
        } else if (res.code == saar5.l9.iceOtp.errorCodeExpiredOTP) {
            if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
                resendOTP();
                $(".popout--authenticationcodemobile .success-alert").addClass("hidden");
                $(".popout--authenticationcodemobile .security-input-form").addClass("form-error");
                $(".popout--authenticationcodemobile .left").html(saar5.l9.iceOtp.otpExpired);
                $(".popout--authenticationcodemobile .left").find(".code-resend").on("click", function() {
                    resendOTP();
                });
                $(".popout--authenticationcodemobile .left").removeClass("hidden");
                //left
                $(".popout--authenticationcodemobile .update-profile-error").addClass("hidden");
            }
            if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
                resendOTP();
                $(".popout--authenticationcodeEmail .success-alert").addClass("hidden");
                $(".popout--authenticationcodeEmail .security-input-form").addClass("form-error");
                $(".popout--authenticationcodeEmail .left").html(saar5.l9.iceOtp.otpExpired);
                $(".popout--authenticationcodeEmail .left").find(".code-resend").on("click", function() {
                    resendOTP();
                });
                $(".popout--authenticationcodeEmail .left").removeClass("hidden");
                //left
                $(".popout--authenticationcodeEmail .update-profile-error").addClass("hidden");
            }
        } else if (res.code == saar5.l9.iceOtp.errorCodeIncorrectOTP) {
            if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
                $(".popout--authenticationcodemobile .security-input-form").addClass("form-error");
                $(".popout--authenticationcodemobile .left").html(saar5.l9.iceOtp.otpIncorrect);
                //left
                $(".popout--authenticationcodemobile .left").removeClass("hidden");
            }
            if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
                $(".popout--authenticationcodeEmail  .security-input-form").addClass("form-error");
                $(".popout--authenticationcodeEmail .left").html(saar5.l9.iceOtp.otpIncorrect);
                //left
                $(".popout--authenticationcodeEmail .left").removeClass("hidden");
            }
        } else {
            if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
                $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpTechnicalerrormessage);
                $(".popout--authenticationcodemobile .update-profile-error").removeClass("hidden");
            }
            if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
                $(".popout--authenticationcodeEmail .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpTechnicalerrormessage);
                $(".popout--authenticationcodeEmail .update-profile-error").removeClass("hidden");
            }
        }
    } else {
        if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
            $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpTechnicalerrormessage);
            $(".popout--authenticationcodemobile .update-profile-error").removeClass("hidden");
        } else if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
            $(".popout--authenticationcodeEmail .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpTechnicalerrormessage);
            $(".popout--authenticationcodeEmail .update-profile-error").removeClass("hidden");
        }
    }
}
var triggerVerificationSuccess = function() {
    $(".overlay-loading").removeClass("hidden");
    var request = {};
    request = setUpdateProfileRequest();
    request['kfNumber'] = $("#ffpNumber").val();
    $.ajax({
        url: "/icheckIN/updateProfile.form",
        type: "POST",
        data: request,

        success: function(response) {
            //var popupValue = ".update-krisflyer-account"
            //$(popupValue).Popup("hide");
            $("input[name=kfprofileUpdateShown]").val("true");

            if (response != 'FAILURE') {
                $(".updateProfileBanner").addClass("hidden");
                triggerUpdateKFtoDG();

            } else {
                var updateFailurePopup = ".profile-update-failure";
                $(updateFailurePopup).Popup({
                    modalShowClass: '',
                    triggerCloseModal: '.popup__close',
                    closeViaOverlay: false
                });
                $(".popout--authenticationcodemobile").Popup("hide");
                $(".popout--authenticationcodeEmail").Popup("hide");
                $('body').find('.update-krisflyer-account').addClass('update-krisflyer-2FAoverlay');
                $(".overlay-loading").addClass("hidden");
                $(updateFailurePopup).Popup("show");
                //$('body').find('.bg-modal').addClass('overlay');
            }

        }
    });
}
var closeAllPopups = function() {
    $(".popout--authenticationcodemobile").Popup("hide");
    $(".popout--authenticationcodeEmail").Popup("hide");
    $(".update-krisflyer-account").Popup("hide");
}
var sendByEmail = function() {
    $(".popout--authenticationcodeEmail .success-alert").addClass("hidden");
    $(".popout--authenticationcodeEmail .update-profile-error").addClass("hidden");
    $(".popout--authenticationcodeEmail .input-text").val("");
    var request = {};
    request = setUpdateProfileRequest();
    request['otpMode'] = saar5.l9.iceOtp.email;
    $("#otpMode").val(saar5.l9.iceOtp.email);
    $.ajax({
        url: "/icheckIN/getOtp.form",
        type: "POST",
        data: request,
        async: false,
        beforeSend: function() {
            $("div.overlay-loading").removeClass('hidden');
        },
        success: function(response) {
            var res = null;
            $(".popout--authenticationcodemobile .left").addClass("hidden");
            //left
            $(".popout--authenticationcodeEmail .left").addClass("hidden");
            //left
            $(".popout--authenticationcodemobile .security-input-form").removeClass("form-error");
            $(".popout--authenticationcodeEmail .security-input-form").removeClass("form-error");
            $(".popout--authenticationcodeEmail .update-profile-error").addClass("hidden");
            $(".popout--authenticationcodemobile .update-profile-error").addClass("hidden");
            $(".popout--authenticationcodemobile .success-alert").addClass("hidden");
            $(".popout--authenticationcodeEmail .success-alert").addClass("hidden");
            try {
                res = $.parseJSON(response);
                var maskedMobile = res.maskedContact;
                var mask = convertXToDot(maskedMobile);
                $(".popout--authenticationcodeEmail .character-container").html(mask).append("@").append(res.mailDomain).prepend(res.firstThreeChar);
                if (undefined != res.status && res.status == saar5.l9.iceOtp.success) {
                    /**/
                    $(".popout--authenticationcodemobile").Popup("hide");
                    otpPopupValue = '.popout--authenticationcodeEmail';
                    $(otpPopupValue).Popup({
                        modalShowClass: '',
                        triggerCloseModal: '.popup__close',
                        closeViaOverlay: false
                    });
                    $(otpPopupValue).Popup("show");
                    /**/
                    $(".popout--authenticationcodeEmail .Krisflyer-membership-text").text(res.otp);
                } else if (undefined != res.status && res.status == saar5.l9.iceOtp.failure) {
                    if (res.code == saar5.l9.iceOtp.errorCodeExceededResend) {
                        $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.exceededResend);
                        $(".popout--authenticationcodemobile .update-profile-error").removeClass("hidden");
                    } else if (res.code == saar5.l9.iceOtp.errorCodesnapdown) {
                        if (undefined != res.isEmailPresentFlag) {
                            $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpSnapdown);
                        } else {
                            $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpSnapdownnoemail);
                        }
                        $(".popout--authenticationcodemobile .update-profile-error").removeClass("hidden");
                    } else if (res.code == saar5.l9.iceOtp.errorCodeIncorrectMultipleTImesOTP) {
                        $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpIncorrectmultipletimes);
                        $(".popout--authenticationcodemobile .update-profile-error").removeClass("hidden");
                    } else if (res.code == saar5.l9.iceOtp.errorCodeExpiredOTP) {
                        resendOTP();
                        $(".popout--authenticationcodemobile .success-alert").addClass("hidden");
                        $(".popout--authenticationcodemobile .security-input-form").addClass("form-error");
                        $(".popout--authenticationcodemobile .left").html(saar5.l9.iceOtp.otpExpired);
                        $(".popout--authenticationcodemobile .left").find(".code-resend").on("click", function() {
                            resendOTP();
                        });
                        $(".popout--authenticationcodemobile .left").removeClass("hidden");
                        //left
                        $(".popout--authenticationcodemobile .update-profile-error").addClass("hidden");
                    } else if (res.code == saar5.l9.iceOtp.errorCodeIncorrectOTP) {
                        $(".popout--authenticationcodemobile  .security-input-form").addClass("form-error");
                        $(".popout--authenticationcodemobile .left").html(saar5.l9.iceOtp.otpIncorrect);
                        //left
                        $(".popout--authenticationcodemobile .left").removeClass("hidden");
                    } else {
                        $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpTechnicalerrormessage);
                        $(".popout--authenticationcodemobile .update-profile-error").removeClass("hidden");
                    }
                } else {
                    $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpTechnicalerrormessage);
                    $(".popout--authenticationcodemobile .update-profile-error").removeClass("hidden");
                }
            } catch (e) {}
            $(".overlay-loading").addClass("hidden");
        }
    });
}
var convertXToDot = function(maskedMobile) {
    var maskSuccess = '';
    var otp = '';
    for (i = 0; i < maskedMobile.length; i++) {
        if (maskedMobile[i] == 'X') {
            otp = maskedMobile[i].replace('X', '&#8226');
            maskSuccess = maskSuccess + otp;
        } else {
            maskSuccess = maskSuccess + maskedMobile[i];
        }
    }
    return maskSuccess;
}
var kfProfileRedirect = function($event) {
    var request = {};
    request['isOTPinSession'] = "true";
    $.ajax({
        url: "/icheckIN/updateKFProfile.form",
        type: "POST",
        data: request,
        async: false,
        beforeSend: function() {},
        success: function(response) {
            var redirectView = window.origin + "/" + response;
            window.location.href = redirectView;
        }
    });
    $(".popout--authenticationcodemobile").Popup("hide");
    $(".popout--authenticationcodeEmail").Popup("hide");
    $(".update-krisflyer-account").Popup("hide");
}
var setUpdateProfileRequest = function() {
    var request = {};
    if ($("#checkbox-name-0").is(':checked') == true) {
        request['updateAll'] = "true";
    }
    if ($('input[name="checkbox-name-odd-1"]').length > 0) {
        if ($('input[name="checkbox-name-odd-1"]').is(':checked')) {
            request['Passport'] = "true";
        }
    }
    if ($('input[name="checkbox-name-even-1"]').length > 0) {
        if ($('input[name="checkbox-name-even-1"]').is(':checked')) {
            request['Nationality'] = "true";
        }
    }
    if ($('input[name="checkbox-name-even-2"]').length > 0) {
        if ($('input[name="checkbox-name-even-2"]').is(':checked')) {
            request['Mobile'] = "true";
        }
    }
    if ($('input[name="checkbox-name-odd-3"]').length > 0) {
        if ($('input[name="checkbox-name-odd-3"]').is(':checked')) {
            request['Email'] = "true";
        }
    }
    return request;
}
var resendOTP = function() {
    var request = {};
    request = setUpdateProfileRequest();
    if (undefined != $("#otpMode").val()) {
        request['otpMode'] = $("#otpMode").val();
    }
    if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
        $(".popout--authenticationcodemobile .input-text").val("");
    } else {
        $(".popout--authenticationcodeEmail .input-text").val("");
    }
    $.ajax({
        url: "/icheckIN/getOtp.form",
        type: "POST",
        data: request,
        async: false,
        beforeSend: function() {
            $("div.overlay-loading").removeClass('hidden');
        },
        success: function(response) {
            var res = null;
            $(".popout--authenticationcodemobile .left").addClass("hidden");
            //left
            $(".popout--authenticationcodeEmail .left").addClass("hidden");
            //left
            $(".popout--authenticationcodemobile .security-input-form").removeClass("form-error");
            $(".popout--authenticationcodeEmail .security-input-form").removeClass("form-error");
            $(".popout--authenticationcodeEmail .update-profile-error").addClass("hidden");
            $(".popout--authenticationcodemobile .update-profile-error").addClass("hidden");
            $(".popout--authenticationcodemobile .success-alert").addClass("hidden");
            $(".popout--authenticationcodeEmail .success-alert").addClass("hidden");
            try {
                res = $.parseJSON(response);
                var maskedMobile = res.maskedContact;
                var mask = convertXToDot(maskedMobile);
                if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
                    $(".popout--authenticationcodemobile .character-container").html(mask).append(res.lastTwoDigit);
                } else if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
                    $(".popout--authenticationcodeEmail .character-container").html(mask).append("@").append(res.mailDomain).prepend(res.firstThreeChar);
                }
                if (undefined != res.status && res.status == saar5.l9.iceOtp.success) {
                    if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
                        $(".popout--authenticationcodemobile .update-profile-error").addClass("hidden");
                        $(".popout--authenticationcodemobile .success-alert").removeClass("hidden");
                        $(".popout--authenticationcodemobile .Krisflyer-membership-text").text(res.otp);
                    } else if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
                        $(".popout--authenticationcodeEmail .update-profile-error").addClass("hidden");
                        $(".popout--authenticationcodeEmail .success-alert").removeClass("hidden");
                        $(".popout--authenticationcodeEmail .Krisflyer-membership-text").text(res.otp);
                    }
                } else {
                    showErrorMessage(res);
                }
            } catch (e) {
                if ($("#otpMode").val() == saar5.l9.iceOtp.sms) {
                    $(".popout--authenticationcodemobile .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpTechnicalerrormessage);
                    $(".popout--authenticationcodemobile .update-profile-error").removeClass("hidden");
                }
                if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
                    $(".popout--authenticationcodeEmail .update-profile-error .inner .alert__message").html(saar5.l9.iceOtp.otpTechnicalerrormessage);
                    $(".popout--authenticationcodeEmail .update-profile-error").removeClass("hidden");
                }
            }
        }
    });
    //CSL ajax
    var otpPopupValue = ".popout--authenticationcodemobile";
    if ($("#otpMode").val() == saar5.l9.iceOtp.email) {
        otpPopupValue = '.popout--authenticationcodeEmail';
    }
    $(otpPopupValue).Popup({
        modalShowClass: '',
        triggerCloseModal: '.popup__close',
        closeViaOverlay: false
    });
    $(".overlay-loading").addClass("hidden");
    $('body').find('.update-krisflyer-account').removeClass('update-KF-overlay');
    $('body').find('.update-krisflyer-account').addClass('update-krisflyer-2FAoverlay');
    $(otpPopupValue).Popup("show");
}
$(document).on("click", "#popup_Close_Fail", function() {
    $('body').find('.update-krisflyer-account').removeClass('update-krisflyer-2FAoverlay');
    $('body').find('.update-krisflyer-account').addClass('update-KF-overlay');
});
var onChangeUpdate = function() {
    var lowerChecked = false;
    if ($("#checkbox-name-0").is(':checked') == true) {
        lowerChecked = true;
    } else if ($('input[name="checkbox-name-odd-1"]').length > 0 && $('input[name="checkbox-name-odd-1"]').is(':checked')) {
        lowerChecked = true;
    } else if ($('input[name="checkbox-name-even-1"]').length > 0 && $('input[name="checkbox-name-even-1"]').is(':checked')) {
        lowerChecked = true;
    } else if ($('input[name="checkbox-name-even-2"]').length > 0 && $('input[name="checkbox-name-even-2"]').is(':checked')) {
        lowerChecked = true;
    } else if ($('input[name="checkbox-name-odd-3"]').length > 0 && $('input[name="checkbox-name-odd-3"]').is(':checked')) {
        lowerChecked = true;
    }
    if (lowerChecked == true) {
        $("#adult-passenger-input-1").removeClass('disabled');
        $("#adult-passenger-input-1").removeAttr('disabled');
    } else {
        $("#adult-passenger-input-1").addClass('disabled');
        $("#adult-passenger-input-1").attr('disabled', 'true');
    }
    validateNomailNoMobile();
    return lowerChecked;
};
var validateNomailNoMobile = function() {
    if ($("#nomail").val() == "true") {
        $('input[name="checkbox-name-odd-3"]').prop('checked', true);
        $('input[name="checkbox-name-odd-3"]').attr('disabled', true);
        $('input[name="checkbox-name-odd-3"]').addClass('disabled');
        $('input[name="checkbox-name-odd-3"]').parent().addClass('nomail');
        $("#adult-passenger-input-1").removeClass('disabled');
        $("#adult-passenger-input-1").removeAttr('disabled');
        if ($('input[name="checkbox-name-odd-1"]').length == 0 && $('input[name="checkbox-name-even-1"]').length == 0 && $('input[name="checkbox-name-even-2"]').length == 0) {
            $('input:checkbox').prop('checked', true);
            $("#checkbox-name-0").attr('disabled', true);
            $("#checkbox-name-0").parent().addClass('nomail');
        }
    }
    if (undefined != $("#noEmailNoMobile") && $("#noEmailNoMobile").val() == saar5.l9.iceOtp.email) {
        $('input[name="checkbox-name-even-2"]').prop('checked', true);
        $('input[name="checkbox-name-even-2"]').attr('disabled', true);
        $('input[name="checkbox-name-even-2"]').addClass('disabled');
        $('input[name="checkbox-name-even-2"]').parent().addClass('nomail');
        $("#adult-passenger-input-1").removeClass('disabled');
        $("#adult-passenger-input-1").removeAttr('disabled');
        if ($('input[name="checkbox-name-odd-1"]').length == 0 && $('input[name="checkbox-name-even-1"]').length == 0 && $('input[name="checkbox-name-odd-3"]').length == 0) {
            $('input:checkbox').prop('checked', true);
            $("#checkbox-name-0").attr('disabled', true);
            $("#checkbox-name-0").parent().addClass('nomail');
        }
    }
};

var triggerUpdateKFtoDG = function() {
    var request = {};

    request['kfNumber'] = $("#ffpNumber").val();
    $.ajax({
        url: ajax_urls.UPDATE_KF_TO_DG_HOMEPAGE_URL,
        type: "POST",
        data: request,

        success: function(response) {
            if (response == 'SUCCESS') {
                var updateSuccessPopup = ".profile-update-success";
                $(updateSuccessPopup).Popup({
                    modalShowClass: '',
                    triggerCloseModal: '.popup__close',
                    closeViaOverlay: true
                });
                closeAllPopups();
                $('body').find('.update-krisflyer-account').removeClass('update-krisflyer-2FAoverlay');
                $('body').find('.update-krisflyer-account').addClass('update-KF-overlay');
                $(updateSuccessPopup).Popup("show");
                $('body').find('.bg-modal').addClass('overlay');
                $(".overlay-loading").addClass("hidden");
            } else {
                showUpdateKFtoDGFailurePopup();
                $('body').find('.update-krisflyer-account').removeClass('update-krisflyer-2FAoverlay');
            }
        },
        error: function(response) {

            showUpdateKFtoDGFailurePopup();
            $('body').find('.update-krisflyer-account').removeClass('update-krisflyer-2FAoverlay');
        }
    });
};

var showUpdateKFtoDGFailurePopup = function() {
    var updateFailurePopup = ".profile-updateKFtoDG-failure";
    $(updateFailurePopup).Popup({
        modalShowClass: '',
        triggerCloseModal: '.popup__close',
        closeViaOverlay: true
    });
    closeAllPopups();
    $(updateFailurePopup).Popup("show");
    $('body').find('.bg-modal').addClass('overlay');
    $(".overlay-loading").addClass("hidden");
};
