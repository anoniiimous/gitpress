window.framework = {};

framework.builder = {};
framework.builder.block = async function(target) {
    var box = target.closest('box');
    if (box) {
        var index = box.index() + 1;
        var tagName = target.closest('card').dataset.element;
        var html = await ajax('raw/asset/html/block/' + tagName + '/' + tagName + '.' + index + '.html')
        //window.parent.modal.popup(html);
        var element = dom.body.find(tagName);
        var block = framework.builder.focus();
        if (element) {
            element.insertAdjacentHTML('beforeend', html);
            modal.exit(target)
        }
        console.log({
            element,
            target,
            block,
            html
        }, 'raw/asset/html/block/' + tagName + '/' + tagName + '.' + index + '.html');
    }
}
framework.builder.blocks = async function(target) {
    var block = target.closest('empty').closest('block, main') || target.closest('empty').previousElementSibling;
    if (block) {
        console.log(block);
        var tagName = block.tagName.toLowerCase();
        var html = await ajax('raw/asset/html/template/template.blocks.' + tagName + '.html')
        var ppp = await window.parent.modal.popup(html);
        ppp.find('card').lastElementChild.onclick = async(event)=>{
            //framework.builder.block(event.target);
            var box = event.target.closest('box');
            if (box) {
                var index = box.index() + 1;
                var element = target.closest('empty').previousElementSibling;
                var tagName = event.target.closest('[data-element]').dataset.element;
                tagName = tagName === 'main' ? 'block' : tagName;
                var asset = 'raw/asset/html/block/' + tagName + '/' + tagName + '.' + index + '.html';
                var html = await ajax(asset)
                //window.parent.modal.popup(html);
                //var element = dom.body.find(tagName);
                var block = framework.builder.focus();
                if (element) {
                    element.insertAdjacentHTML('beforeend', html);
                    modal.exit(event.target)
                }
                console.log({
                    asset,
                    element,
                    target,
                    block,
                    html
                }, 'raw/asset/html/block/' + tagName + '/' + tagName + '.' + index + '.html');
            }
        }
        console.log({
            block,
            target,
            html,
            ppp
        });
    }
}
framework.builder.focus = ()=>{
    var focused = dom.body.all('[focus="true"]');
    return focused[focused.length - 1];
}

framework.on = function(event) {
    //console.log(is.iframe, event);
    var touch = event.touch;
    if (touch === "tap") {
        if (is.iframe) {
            var buildable = dom.body.getAttribute('buildable') === "true";
            if (buildable) {
                var target = event.target;
                var elem = target.closest('box > * > *, card, block');
                var focus = target.closest('focus');

                $('[focus]').forEach(function(el) {
                    el === elem ? null : el.removeAttribute('focus');
                });
                $('box text[contenteditable]').forEach(function(el) {
                    el === elem ? null : el.removeAttribute('contenteditable');
                });

                console.log(89, {elem});

                if (elem) {

                    var tool = window.top.dom.body.find('tool');

                    var focused = elem.getAttribute('focus');
                    var tagName = elem.tagName.toLowerCase();
                    var el = ["block", "card"].includes(tagName) ? tagName : 'box';

                    $([dom.body]).attr('focus', el);
                    $([elem, elem.closest('block, footer, header')]).attr('focus', el);

                    if (focused === "true") {
                        if (tagName === "picture") {
                        }
                        if (tagName === "text") {//elem.contentEditable = "true";
                        }
                    } else {
                        if (tagName === "picture") {
                        }
                        if (tagName === "text") {
                            elem.contentEditable = "true";
                        }
                    }

                    console.log({
                        focused,
                        tagName,
                        tool,
                        icons: $(tool.all('ico')),
                        array: Array.prototype
                    });

                    $(window.top.dom.body.find('tool').all('ico')).forEach(o => o.classList.remove('display-none'));

                    $('focus').remove();
                    var selection = window.parent.byId('focus-element').content.firstElementChild.cloneNode(true);
                    var rect = elem.getBoundingClientRect();
                    selection.style.height = elem.clientHeight + "px";
                    selection.style.width = elem.clientWidth + "px";
                    //selection.style.backgroundColor = "rgba(0,0,0,0.5)";
                    selection.style.left = (rect.left + document.documentElement.scrollLeft) + "px";
                    selection.style.top = (rect.top + document.documentElement.scrollTop) + "px";
                    selection.style.zIndex = "1234568799";
                    //dom.body.insertAdjacentHTML('beforeend', selection.outerHTML);

                } else {                    

                    $(window.top.dom.body.find('tool').all('ico')).forEach(o => o.find('.gg-add-r') ? null : o.classList.add('display-none'));

                }
            }
        }
    }
}
