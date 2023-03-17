window.framework = {};

framework.on = async function(event) {
    //console.log(is.iframe, event);
    var touch = event.touch;
    if (touch === "tap") {
        if (is.iframe) {
            var buildable = dom.body.getAttribute('buildable') === "true";
            if (buildable) {
                var target = event.target;
                var elem = target.closest('box > * > *');
                $('[focus]').removeAttr('focus');
                if (elem) {
                    $([dom.body, elem, elem.closest('block, footer, header')]).attr('focus', true);
                }
            }
        }
    }
}
