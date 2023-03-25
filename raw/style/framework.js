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

framework.on = async function(event) {
    //console.log(is.iframe, event);
    var touch = event.touch;
    if (touch === "tap") {
        if (is.iframe) {
            var target = event.target;
            var buildable = dom.body.getAttribute('buildable') === "true";
            var insertable = dom.body.getAttribute('insertable') === "true";
            var elem = target.closest('box, card, block, body > header, body > footer');
            var focused = elem.getAttribute('focus');
            var tagName = elem.tagName.toLowerCase();
            var el = ["block", "card", "footer", "header"].includes(tagName) ? tagName : 'box';
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

                    if ((elem && $('[focus]').length === 0) || (elem && ((focused && focused[focused.length - 1].contains(elem)) || (sel && focused && focused[focused.length - 1].parentNode.contains(elem) && !focusing && element === elem.tagName.toLowerCase())))) {

                        $('[focus]').forEach(function(el) {
                            el === elem ? null : el.removeAttribute('focus');
                        });
                        $('box text[contenteditable]').forEach(function(el) {
                            el === elem ? null : el.removeAttribute('contenteditable');
                        });

                        var tool = window.top.dom.body.find('tool');

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

                } else {

                    if (el === "box") {
                        var media = selected.closest('[data-media]') ? selected.closest('[data-media]').dataset.media : null;
                        var id = selected.dataset.id;
                        if (media && !id) {
                            var json = is.json(media) ? JSON.parse(media) : false;
                            if (json) {
                                console.log('mixed', media);
                            } else {
                                var confirm = await window.top.modal.confirm({
                                    body: "Do you want to save your changes before creating a new item?",
                                    title: "Unsaved Changes"
                                }, ["No", "Yes"]);
                                if (confirm) {
                                    '/dashboard/:get/merch/catalog'.router();
                                }
                            }
                            console.log(media, json);
                        }
                    }
                }
            }
        }
    }
}

window.tool = {}

window.tool.set = {};
window.tool.set.tab = function(target) {
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;

    var ppp = target.closest('aside');

    var header = target.closest('card > header');
    $(header.children).addClass('border-bottom-1px-solid');

    var box = target.closest('box');
    box.classList.remove('border-bottom-1px-solid');

    var tabs = header.parentNode.all('card > column');
    var tab = $(tabs)[box.index()];
    console.log(tabs);

    $(tabs).attr('data-display', 'none')
    tab.removeAttribute('data-display');

    var element = box.find('text').dataset.before;
    var parent = ppp.focus.closest(element);
    var elem = ppp.focus.closest('box, card, block, body > header, body > footer');

    $(doc.body.all('[focus]')).forEach(function(el) {
        el.removeAttribute('focus');
    });
    $(doc.body.all('box text[contenteditable]')).forEach(function(el) {
        el.removeAttribute('contenteditable');
    });
    $([doc.body]).attr('focus', element);
    $([parent, elem.closest('block, footer, header')]).attr('focus', element);

    console.log(dom.body, $('[focus]'), $(dom.body.all('[focus]')), {
        tabs,
        tab
    }, {
        elem,
        focus: ppp.focus,
        parent
    });
}

/*TOOL API*/
window.tool.tip = {};

window.tool.bar = {};

window.tool.box = {};
window.tool.box.columns = function(event) {
    var target = event.target;
    var value = target.value;
    console.log(268, value);
}
window.tool.box.css = function(tab) {

    var ppp = tab.closest('aside');

    var iframe = byId('iframe-editor');
    var doc = iframe.contentWindow.document;
    var element = doc.body.getAttribute('focus');

    var declarations = $(tab.all('[data-declaration]'));
    if (declarations.length > 0) {
        var rules = {};
        var classList = Array.from(ppp.focus.classList).concat(Array.from(ppp.focus.find('flex, column, row, section').classList));
        classList.forEach(function(c) {
            var split = c.split('-');
            var value = split.splice(split.length - 1)[0];
            var properties = [];
            split.forEach(function(s) {
                if (s.startsWith('dw') || s.startsWith('_')) {
                    split;
                } else {
                    properties.push(s);
                }
            });
            var property = properties.join('-');
            rules[property] = value;
            0 > 1 ? console.log(731, {
                c,
                split,
                property,
                value
            }) : null;
        });
        var d1 = Object.assign({}, ppp.focus.dataset);
        var d2 = Object.assign({}, ppp.focus.find('flex, column, row, section').dataset);
        var dataset = Object.assign(d1, d2);
        Object.assign(rules, dataset);
        console.log(718, {
            classList,
            dataset,
            rules
        });
        declarations.forEach(function(el) {
            var row = el.closest('[data-property]');
            if (row) {
                var property = row.dataset.property;
                var number = el.find('[data-value="value"], [data-value="number"]');
                if (number) {
                    var value = number.getAttribute('value');
                    var unit = el.find('[data-value="unit"]');
                    if (unit) {
                        value = value + unit.textContent;
                    }
                    var selector = "block";
                    var cssRule = selector + " {" + property + ": " + value + "}";
                    Object.entries(rules).forEach(function(rule) {
                        var k = rule[0];
                        var v = rule[1];
                        if (property === k) {
                            console.log({
                                v
                            });
                            var value = v.cssValue();
                            console.log({
                                k,
                                unit,
                                value,
                                v
                            });
                            if (value && unit) {
                                unit.textContent = value.unit;
                                if (value.unit === null) {
                                    number.classList.add('display-none');
                                }
                            }
                            number.value = value.number;
                            console.log(cssRule, {
                                unit,
                                number,
                                rule,
                                k,
                                v
                            });
                        }
                    });
                }
            }
        });
    }

}
window.tool.box.element = function(target) {
    var button = target.closest('[data-value]');
    if (button) {
        var iframe = byId('iframe-editor');
        var win = iframe.contentWindow;
        var doc = win.document;

        var focused = win.$('[focus]');
        var focusing = focused[focused.length - 1];

        var element = null;
        var value = button.dataset.value;
        console.log(268, {
            focused,
            focusing,
            value
        });

        if (value === "text") {
            element = doc.createElement('text');
            element.setAttribute('contenteditable', true);
            element.setAttribute('placeholder', 'Write here...');

            modal.exit(target);

            var wrapper = focusing.find('flex, column, row, section');
            wrapper.insertAdjacentHTML('beforeend', element.outerHTML)
            wrapper.lastElementChild.focus();
        }
    }
}
window.tool.box.unit = function(target) {
    var button = target.closest('[data-tap] > *');
    if (button) {
        var unit = button.textContent;
        var text = button.closest('[data-dropdown] + *').previousElementSibling.firstElementChild;
        text.textContent = unit;

        var input = text.closest('input + *').previousElementSibling;
        var onchange = input.getAttribute('onchange').split('(')[0].split('.');
        var method = window;
        console.log({
            button,
            input,
            onchange
        });

        if (button.dataset.dimension === "unit") {
            input.classList.remove('display-none');
        } else {
            input.classList.add('display-none');
        }
        onchange.forEach(function(o) {
            method = method[o];
        });
        method(input);
    }
}
window.tool.box.value = function(target) {
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;
    var tagName = doc.body.getAttribute('focus');
    var focused = win.$('[focus]');
    var focus = focused[focused.length - 1];
    var attribute = target.closest('[data-property]').dataset.property;
    var element = target.closest('[data-element]').dataset.element;
    if (element === "wrapper") {
        focus = focus.find(tagName + " > :not(backdrop):not(empty):not(template)");
    }
    if (element === "children") {
        focus = focus.find(tagName + " > :not(backdrop):not(empty):not(template) > *");
    }

    var value = null;
    var declaration = target.closest('[data-declaration]').dataset.declaration;
    if (declaration === "dimension") {
        var unit = target.nextElementSibling.find('[data-dropdown]').firstElementChild.textContent;
        value = target.classList.contains('display-none') ? unit : target.value + unit;
    }
    if (declaration === "number") {
        value = target.value;
    }

    if (declaration) {
        var rule = target.closest('[data-at-rule]') ? target.closest('[data-at-rule]').dataset.atRule : null;
        var formula = target.dataset.formula ? target.dataset.formula : null;
        window.tool.box.style(focus, {
            attribute,
            value
        }, {
            rule,
            formula
        });
    }
}
window.tool.box.style = function(focus, declaration, options) {

    var pseudo = options ? options.pseudo: null;
    var rule = options ? options.rule : null;
    var formula = options ? options.formula : null;
    
    var attribute = declaration.attribute;
    var value = formula ? formula.replace('{var}', declaration.value) : declaration.value;
    focus.style[attribute] = value;

    attribute = attribute.camelPhynate();
    var className = [attribute, value].join('-');
    var obj = {};
    obj[className] = {
        pseudo,
        rule,
        attribute,
        value,
    };

    console.log(472, {
        focus,
        attribute,
        value
    }, obj);
}
window.tool.box.group = function(target) {
    $(target.closest('box > row').nextElementSibling).toggleClass('display-none');
}
window.tool.box.width = function(target) {
    var iframe = byId('iframe-editor');
    var win = iframe.contentWindow;
    var doc = win.document;
    var focused = win.$('[focus]');
    var focus = focused[focused.length - 1];
    var unit = target.nextElementSibling.find('[data-dropdown]').firstElementChild.textContent;
    var value = target.value;
    console.log(347, {
        focus,
        unit,
        value
    });
    if (unit === "auto") {
        focus.style.width = "auto";
    } else {
        focus.style.width = value + unit;
    }
}
