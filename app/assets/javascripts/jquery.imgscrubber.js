jQuery.fn.imgScrubber = function(options) {
    options = jQuery.extend({
        scrubWait: 2000,
        resultSelector: "img",
        imgSelector: "img",
        detailsSelector: ".details",
        loadingClass: "loading-bar"
    }, options);

    jQuery(this).on({
        mouseenter: function(e) {
            alert();
            var data = jQuery(this).data();

            if (data.waiting || data.loading || data.img) {
                return;
            }

            var url = jQuery(this).attr("data-url") ||
                jQuery(this).parents("a").first().attr("href");

            var $loading = jQuery("<div>")
                .addClass(options.loadingClass)
                .prependTo( jQuery(this).find(options.detailsSelector) )
                .animate({ width: "75%" }, options.scrubWait);

            data.waiting = setTimeout(function() {
                data.waiting = false;
                data.loading = true;

                $loading.animate({ width: "100%" }, options.scrubWait / 2);

                jQuery.get(url, function(html) {
                    var img = [];

                    jQuery(html).find(options.resultSelector).each(function() {
                        img.push(this.src);
                    });
                    // console.log(img);
                    data.img = img; // array of all the images
                    data.loading = false;
                    
                    $loading
                        .stop()
                        .animate({ width: "100%" }, 300)
                        .animate({ opacity: 0 }, 300, function() {
                            $(this).remove();
                        });
                });
            }, options.scrubWait);
        },

        mouseleave: function(e) {
            var waiting = jQuery(this).data("waiting");

            if (waiting) {
                clearTimeout(waiting);
                jQuery(this).data("waiting", false);
                jQuery(this).find("." + options.loadingClass).stop().remove();
            }
        },

        mousemove: function(e) {
            var img = jQuery(this).data("img");

            if (img) {
                var pos = Math.round((e.offsetX / this.offsetWidth) * 
                    img.length);
                jQuery(this).find(options.imgSelector).attr("src", img[pos]);
            }
        }
    }, options.delegate);

    return this;
};

// The MIT License (MIT)

// Copyright (c) 2013 John Resig

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
