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
    if (target) {
        var tagName = typeof target === "string" ? target : (target.closest('block, main') || target.closest('empty').previousElementSibling).tagName.toLowerCase();
        var html = await ajax('raw/asset/html/template/template.blocks.' + tagName + '.html')
        var ppp = await window.parent.modal.popup(html);
        console.log(27, {
            tagName,
            target
        }, typeof target);
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
framework.builder.select = ()=>{
    $('focus').remove();
    var elem = dom.body.find('[focus]')
    var selection = window.parent.byId('focus-element').content.firstElementChild.cloneNode(true);
    var rect = elem.getBoundingClientRect();
    selection.style.height = elem.clientHeight + "px";
    selection.style.width = elem.clientWidth + "px";
    //selection.style.backgroundColor = "rgba(0,0,0,0.5)";
    selection.style.left = (rect.left + document.documentElement.scrollLeft) + "px";
    selection.style.top = (rect.top + document.documentElement.scrollTop) + "px";
    selection.style.zIndex = "1234568799";
    doc.body.insertAdjacentHTML('beforeend', selection.outerHTML);
}
framework.builder.insert = function(target) {
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;
    var blocks = $(doc.body.all('blocks block'));
    //blocks.attr('data-transform', 'scale(calc(1/3))');
    var element = target.closest('[data-element]').dataset.element;
    console.log({
        blocks,
        element,
        target
    });
    if (element === 'main') {
        if (target.closest('[data-tap]').tagName.toLowerCase() === 'text') {
            var el = document.createElement('block');
            el.innerHTML = '<flex></flex>';

            var page = doc.body.find('[data-active="true"][data-page]');
            page.find('blocks').insertAdjacentHTML('beforeend', el.outerHTML);

            var block = page.find('blocks').lastElementChild;
            $(doc.body.all('[focus]')).removeAttr('focus');
            block.setAttribute('focus', 'block');
            doc.body.setAttribute('focus', 'block');

            var rect = block.getBoundingClientRect();
            console.log(doc, doc.body.all('[focus]'), block, block.scrollTop, win.scrollTop, rect);
            win.scrollTo({
                behavior: 'smooth',
                left: 0,
                top: rect.top + doc.documentElement.scrollTop
            });

            modal.exit(target);
        }
    }
}

framework.on = function(event) {
    //console.log(is.iframe, event);
    var touch = event.touch;
    if (touch === "tap") {
        if (is.iframe) {
            var target = event.target;
            var buildable = dom.body.getAttribute('buildable') === "true";
            var insertable = dom.body.getAttribute('insertable') === "true";
            var elem = target.closest('box, card, block, body > header, body > footer');
            var element = dom.body.getAttribute('focus');
            var sel = element ? ':not(body)[focus="' + element + '"] ' + element + '' : null;
            var selected = sel ? event.target.closest(sel) : null;
            var focusing = sel && event.target.closest(sel) ? event.target.closest(sel).getAttribute('focus') : null;
            console.log({
                sel,
                selected,
                focusing
            });
            if (buildable && !insertable) {
                var focus = target.closest('focus');
                if (elem !== event.target.closest(':not(block):not(body > header):not(body > footer)[focus]')) {

                    var focused = $('[focus]');

                    console.log(89, {
                        elem,
                        target: event.target.closest('[focus]'),
                        focuser: focused.length > 0 ? focused[focused.length - 1] : null,
                        contains: focused.length > 0 ? focused[focused.length - 1].contains(elem) : null,
                        focus,
                        focused
                    });

                    if ((elem && $('[focus]').length === 0) || (elem && ((focused && focused[focused.length - 1].contains(elem)) || (sel && !focusing && element === elem.tagName.toLowerCase())))) {

                        $('[focus]').forEach(function(el) {
                            el === elem ? null : el.removeAttribute('focus');
                        });
                        $('box text[contenteditable]').forEach(function(el) {
                            el === elem ? null : el.removeAttribute('contenteditable');
                        });

                        var tool = window.top.dom.body.find('tool');

                        var focused = elem.getAttribute('focus');
                        var tagName = elem.tagName.toLowerCase();
                        var el = ["block", "card", "footer", "header"].includes(tagName) ? tagName : 'box';

                        $([dom.body]).attr('focus', el);
                        $([elem, elem.closest('block, footer, header')]).attr('focus', el);

                        if (focused === "true") {
                            if (tagName === "picture") {}
                            if (tagName === "text") {//elem.contentEditable = "true";
                            }
                        } else {
                            if (tagName === "picture") {}
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

                        $(window.top.dom.body.find('tool').all('ico')).forEach(o=>o.classList.remove('display-none'));

                    } else {

                        console.log($('[focus]'));

                        $('[focus]').forEach(function(el) {
                            el.removeAttribute('focus');
                        });
                        $('box text[contenteditable]').forEach(function(el) {
                            el.removeAttribute('contenteditable');
                        });

                        $(window.top.dom.body.find('tool').all('ico')).forEach(o=>o.find('.gg-add') ? null : o.classList.add('display-none'));

                    }

                }
            }
        }
    }
}
