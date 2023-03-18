window.framework = {};

framework.on = function(event) {
    //console.log(is.iframe, event);
    var touch = event.touch;
    if (touch === "tap") {
        if (is.iframe) {
            var buildable = dom.body.getAttribute('buildable') === "true";
            if (buildable) {
                var target = event.target;
                var elem = target.closest('box > * > *');
                var focus = target.closest('focus');

                $('[focus]').forEach(function(el) {
                    el === elem ? null : el.removeAttribute('focus');
                });

                if (elem) {

                    var focused = elem.getAttribute('focus');
                    console.log({
                        elem,
                        focused
                    });
                    $([dom.body, elem, elem.closest('block, footer, header')]).attr('focus', true);

                    $('focus').remove();
                    var selection = window.parent.byId('focus-element').content.firstElementChild.cloneNode(true);
                    var rect = elem.getBoundingClientRect();
                    selection.style.height = elem.clientHeight + "px";
                    selection.style.width = elem.clientWidth + "px";
                    //selection.style.backgroundColor = "rgba(0,0,0,0.5)";
                    selection.style.left = (rect.left + document.documentElement.scrollLeft) + "px";
                    selection.style.top = (rect.top + document.documentElement.scrollTop) + "px";
                    selection.style.zIndex = "1234568799";
                    dom.body.insertAdjacentHTML('beforeend', selection.outerHTML);

                } else {

                    if(focus) {

                        //$('focus').remove();

                    } else {

                        $('focus').remove();

                    }

                }
            }
        }
    }
}
