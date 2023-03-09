window.mvc ? null : (window.mvc = {});

window.mvc.m ? null : (window.mvc.m = model = {
    error: {
        image: e=>{
            console.log('model.error.image', e);
            e.remove();
        }
    }
});

window.mvc.v ? null : (window.mvc.v = view = function(route) {
    return new Promise(async function(resolve, reject) {
        var page = route.page;
        var path = route.path;
        var gut = route.hash ? rout.ed.dir(route.hash.split('#')[1]) : [];
        var get = (route ? route.GOT : rout.ed.dir(dom.body.dataset.path)).concat(gut);
        var root = get[0] || gut[0];

        window.GET = window.GET ? GET : rout.ed.dir(dom.body.dataset.path);

        window.webmanifest = JSON.parse(await ajax('/site.webmanifest'));
        //console.log(webmanifest);
        dom.body.find('[data-value="webmanifest.name"]').textContent = webmanifest.name;

        $(dom.body.all('aside')).remove();

        var page = route.page;
        var vp = dom.body.find('[data-page="' + page + '"]');

        0 > 1 ? console.log(108, {
            route,
            vp
        }) : null;

        //PLACEHOLDERS
        if (vp) {
            var el = $(dom.body.all('[data-value="cart.quantity"]'));
            if (el.length > 0) {
                var cart = localStorage.getItem('cart');
                if (cart) {
                    var json = JSON.parse(cart);
                    var quantity = json.length > 1 ? json.reduce(function(a, b) {
                        return a.quantity + b.quantity
                    }) : (json.length === 1 ? json[0].quantity.toString() : null);
                    quantity ? el.html(quantity > 99 ? '99+' : quantity.toString()) : null;
                }
            }

            $(vp.all('[data-value="page.name"]')).html(vp.dataset.title);
            ;
        }

        //MEDIA FEED
        var feeds = vp.all('[data-media]');
        if (feeds.length > 0) {
            var f = 0;
            do {
                var feed = feeds[f];
                var limit = feed.children.length;
                var media = feed.dataset.media;

                if (media === "merch") {
                    //var json = await ajax('raw/posts/posts.json')
                    var posts = [];
                    if (is.iframe) {
                        var user = await github.user.get();
                        posts = await github.repos.contents({
                            owner: user.login,
                            path: '/raw/posts/posts.json',
                            repo: window.parent.GET[1]
                        }, {
                            accept: "application/vnd.github.raw"
                        });
                    } else {
                        try {
                            var res = await ajax('raw/merch/merch.json')
                            posts = JSON.parse(res);
                        } catch (e) {
                            console.log(e);
                        }
                    }

                    var ancestors = posts.filter(row=>rout.ed.dir(row.slug).length === 1);

                    if (ancestors.length > 0) {

                        var p = 0;
                        var html = "";

                        do {

                            var post = ancestors[p];

                            var elem = 0 < 1 ? feed.children[p] : feed.nextElementSibling.content.firstElementChild.cloneNode(true);

                            if (post) {

                                var descendants = posts.filter(function(row) {
                                    var dir = rout.ed.dir(row.slug);
                                    return dir.length > 1 && dir[0] === post.slug
                                });

                                0 > 1 ? console.log(57, {
                                    post,
                                    descendants,
                                    posts
                                }) : null;

                                elem.dataset.display = "flex";
                                elem.dataset.href = "/shop/merch/" + post.slug;

                                var image = elem.find('picture img');
                                image && post.images ? image.src = post.images[0] : null;

                                var date = elem.find('[placeholder="Date"]');
                                date && post.date ? date.textContent = post.date : null;

                                var title = elem.find('[placeholder="Title"]');
                                title && post.title ? title.textContent = post.title : null

                                var description = elem.find('[placeholder="Description"]');
                                description && post.description ? description.textContent = post.description : null;

                                var pricing = elem.find('[placeholder="$0.00"]');
                                if (pricing && post.pricing) {}

                                //html += elem.outerHTML;
                            } else {

                                elem.dataset.display = "none";

                            }

                            p++;

                        } while (p < limit);

                        //feed.innerHTML = html;

                    }

                    0 > 1 ? console.log(115, {
                        feed,
                        media,
                        posts
                    }) : null;
                }

                if (media === "pages") {
                    //var json = await ajax('raw/posts/posts.json')
                    var posts = [];
                    if (is.iframe) {
                        var user = await github.user.get();
                        posts = await github.repos.contents({
                            owner: user.login,
                            path: '/raw/posts/posts.json',
                            repo: window.parent.GET[1]
                        }, {
                            accept: "application/vnd.github.raw"
                        });
                    } else {
                        posts = JSON.parse(await ajax('raw/posts/posts.json'));
                    }

                    if (posts.length > 0) {

                        var p = 0;
                        var html = "";

                        do {

                            var post = posts[p];
                            var elem = 0 < 1 ? feed.children[p] : feed.nextElementSibling.content.firstElementChild.cloneNode(true);

                            var date = elem.find('[placeholder="Date"]');
                            var title = elem.find('[placeholder="Title"]');
                            var description = elem.find('[placeholder="Description"]');
                            var picture = elem.find('picture');

                            console.log(57, {
                                title,
                                post
                            });

                            date ? date.textContent = post.date ? date.textContent = post.date : date.remove() : null;
                            title.textContent = post.title;
                            description.textContent = post.description;
                            post.image ? picture.find('img').dataset.src = post.image : null;

                            //html += elem.outerHTML;

                            p++;

                        } while (p < limit);

                        //feed.innerHTML = html;

                    }

                    console.log(37, {
                        feed,
                        media,
                        posts
                    });
                }
                f++;
            } while (f < feeds.length)
        }

        //MERCH PRODUCT
        var merch = vp.find('[data-merch]');
        if (merch) {
            var got = route.GOT;
            var slug = got.splice(merch.dataset.merch, merch.dataset.merch + 1).join('/');
            var parent = rout.ed.dir(slug)[0];
            //console.log(190, parent, slug);

            var d = await ajax("/raw/merch/" + parent + "/merch.json");
            var data = JSON.parse(d);
            //console.log(201, slug, data, "/raw/merch/" + parent + "/merch.json");

            //ANCESTOR
            try {
                //var slug = get[5] ? get[4] + "/" + get[5] : get[4];
                var res = window.ancestor = data;
                if (res.length > 0) {
                    var r = 0;
                    do {
                        if (res[r].slug === parent) {
                            //console.log(211, res[r], slug);
                            var json = res[r];
                        }
                        r++;
                    } while (r < res.length);
                    if (!json) {
                        throw "Not Found";
                    }
                }
                0 > 1 ? console.log(295, {
                    json,
                    res
                }) : null;
            } catch (e) {
                console.log(287, {
                    e
                });
            }

            //DIMENSIONS
            var box = merch.find('[data-value="post.traits"]').closest('box');
            var n = 0;
            var attr = [];
            var variant = false;
            var dimensions = json && json.dimensions;
            if (dimensions && dimensions.length > 0) {
                var template = box.lastElementChild;

                template.previousElementSibling.innerHTML = "";
                box.removeAttribute('data-display');

                var d = 0;
                do {
                    var el = template.content.firstElementChild.cloneNode(true);
                    var dimension = dimensions[d];

                    var name = dimensions[d].name;
                    var field = el.find('field');
                    field.find('text').dataset.name = field.find('text').textContent = dimension.name;

                    var dropdown = el.find('dropdown');
                    var values = dimensions[d].values;
                    if (values.length > 0) {
                        var aa = 0;
                        var v = 0;
                        0 > 1 ? console.log(399, {
                            values
                        }) : null;
                        do {
                            var item = dropdown.find('template').content.firstElementChild.cloneNode(true);
                            item.find('span').dataset.after = values[v];
                            dropdown.children[1].insertAdjacentHTML('beforeend', item.outerHTML);
                            v++;
                        } while (v < values.length);

                        if (rout.ed.dir(slug).length > 1) {
                            var u = rout.ed.dir(route.path);
                            var gat = u.splice(5, u.length - 1);
                            var matrix = get[get.length - 1];
                            var arr = 0 < 1 ? matrix.split('_') : gat;
                            var ax = 0;
                            do {
                                var ar = arr[ax];
                                if (0 < 1 && ar) {
                                    var dd = 0;
                                    do {
                                        var vv = 0;
                                        do {
                                            if (ar) {
                                                var value = dimensions[dd].values[vv];
                                                var name = dimensions[dd].name;
                                                if (value) {
                                                    var vars = {
                                                        arr1: ar.split('-')[0].toLowerCase(),
                                                        arr2: ar.split(ar.split('-')[0] + "-")[1].replace('-', ' ').toLowerCase(),
                                                        name: name.toLowerCase(),
                                                        value: value.toLowerCase().replace('-', ''),
                                                        element: el.find('[placeholder][data-name="' + name + '"]')
                                                    }
                                                    //console.log(367, vars);
                                                    if (vars.element && vars.arr1 === vars.name && vars.arr2 === vars.value) {
                                                        vars.element.closest('field').nextElementSibling.find('[placeholder]').textContent = value;
                                                    }
                                                }
                                                aa++;
                                            }
                                            vv++;
                                        } while (vv < values.length);
                                        dd++;
                                    } while (dd < dimensions.length);
                                }
                                ax++;
                            } while (ax < arr.length);
                        }

                        //Find Variation
                        if (n === dimensions.length) {
                            var variant = true;
                        }
                    }

                    template.previousElementSibling.insertAdjacentHTML('beforeend', el.outerHTML);

                    var name = el.find('field [placeholder]').dataset.name;
                    var value = el.find('dropdown [placeholder]').textContent;
                    //console.log(template, name, value);
                    if (name && value) {
                        attr.push(name.toLowerCase().replaceAll('-', '') + "-" + value.toLowerCase().replaceAll('-', ''));
                    }
                    d++;
                } while (d < dimensions.length);
            } else {
                box.dataset.display = "none";
            }

            //DESCENDANT
            0 > 1 ? console.log(395, {
                attr,
                dir: rout.ed.dir(slug),
                slug,
                ancestor
            }) : null;
            window.descendant = null;
            if (rout.ed.dir(slug).length > 1) {
                if (0 < 1) {
                    ancestor.sort((a,b)=>b.slug.localeCompare(a.slug));
                    0 > 1 ? console.log(413, {
                        ancestor,
                        variant,
                        slug
                    }) : null;
                    if (ancestor.length > 0) {
                        var arrs = slug.split('_');
                        var r = 0;
                        do {
                            var row = ancestor[r];
                            //var slug = row.slug;
                            var dir = rout.ed.dir(row.slug);
                            if (dir.length > 1) {
                                //console.log(row.slug, dir);
                                var attributes = row.attributes;
                                var keys = Object.keys(attributes);
                                var vals = Object.values(attributes);
                                var a = 0;
                                if (keys.length > 0) {
                                    do {
                                        var name = keys[a];
                                        var value = Object.values(attributes)[a];
                                        var str = name.toLowerCase() + "-" + value.toLowerCase();
                                        if (arrs.length > 0) {
                                            var s = 0;
                                            do {
                                                var as = arrs[s];
                                                var atrs = [];
                                                var k = 0
                                                do {
                                                    atrs.push(keys[k].toLowerCase().replaceAll("-", "") + "-" + vals[k].toLowerCase().replaceAll("-", ""));
                                                    k++;
                                                } while (k < keys.length);
                                                var there = str === as && arrs.has(atrs);
                                                0 > 1 ? console.log(there, row.slug, {
                                                    keys,
                                                    row,
                                                    attributes,
                                                    arrs,
                                                    atrs
                                                }) : null;
                                                if (there) {
                                                    0 > 1 ? console.log(415, a, r, row.slug, {
                                                        str,
                                                        as,
                                                        row
                                                    }) : null;
                                                    if (row.images) {
                                                        json.images = row.images;
                                                    }
                                                }
                                                s++;
                                            } while (s < arrs.length);
                                        }
                                        a++;
                                    } while (a < attributes.length)
                                }
                            }
                            r++;
                        } while (r < ancestor.length);
                    }
                }
                try {
                    var res = window.descendant = 0 > 1 ? await github.repos.contents({
                        owner: user.login,
                        repo: get[1],
                        path: "/raw/merch/" + parent + "/" + attr.join('_') + "/merch.json"
                    }, {
                        accept: "application/vnd.github.raw",
                        cache: "reload"
                    }) : window.ancestor.find(row=>row.slug === slug);
                    //res ? null : res = json;

                    0 > 1 ? console.log(474, {
                        descendant,
                        slug,
                        res,
                        json
                    }) : null;

                    if (res) {

                        var variant = true;

                        json.category = res.category ? res.category : json.category ? json.category : null;
                        json.description = res.description ? res.description : null;
                        json.images = res.images ? res.images : (json.images ? json.images : []);
                        json.details = res.details ? res.details : (json.details ? json.details : null);
                        json.about = res.about ? res.about : (json.about ? json.about : null);
                        json.pricing = res.pricing;
                        json.quantity = res.quantity ? res.quantity : null;
                        json.tags = res.tags ? res.tags : null;
                        0 > 1 ? console.log(464, {
                            json
                        }) : null;

                    }
                } catch (e) {
                    console.log(316, 'error mvc.v DESCENDANT', {
                        e,
                        json
                    });
                }
            }
            var descendants = ancestor.filter(function(row) {
                var dir = rout.ed.dir(row.slug);
                return dir.length > 1 && dir[0] === rout.ed.dir(json.slug)[0];
            });

            var prices = [];
            descendants.forEach(function(row) {
                var price = row.pricing ? price = row.pricing : null;
                price ? prices.push(price) : null;
            });

            0 > 1 ? console.log({
                data,
                json,
                slug,
                ancestor,
                descendants,
                prices
            }) : null;

            //IMAGES
            var image = merch.find('[data-value="post.image"]');
            json.images && json.images.length > 0 ? image.src = json.images[0] : null;

            //TITLE
            var title = $(merch.all('[placeholder="Title"]'));
            json.title ? title.html(json.title) : null;

            //HREF
            var href = $(merch.all('[data-value="post.href"]'));
            ancestor.slug ? href.attr('data-href', route.page.replace('*', ancestor.slug)) : null;

            //PRICING
            var pricing = $(merch.all('[data-value="post.pricing"]'));
            if (json.pricing) {
                pricing ? pricing.html("$" + json.pricing.ListPrice) : null;
                //console.log(pricing); 
            } else {
                prices.sort((a,b)=>a.ListPrice - b.ListPrice);
                pricing ? pricing.html("$" + prices[0].ListPrice + " &#8211; " + "$" + prices[prices.length - 1].ListPrice) : null;
                //console.log(pricing);                
            }

            //DESCRIPTION
            var description = merch.find('[data-value="post.description"]');
            if (json.description) {
                description.textContent = json.description;
            } else {
                description.closest('box').dataset.display = "none";
            }

            //DETAILS
            var details = merch.find('[data-value="post.details"]').closest('box');
            if (json.details) {
                //console.log(json.details);
                var keys = Object.keys(json.details);
                var column = details.find('[data-value="post.details"]').closest('box').find('column');
                column.innerHTML = "";
                //console.log(493, keys);
                if (keys.length > 0) {
                    var template = details.find('template');
                    //console.log(495, template);
                    var d = 0;
                    do {
                        var detail = template.content.firstElementChild.cloneNode(true);
                        //console.log(499, value);

                        var name = detail.firstElementChild.find('[placeholder="Name"]');
                        name.textContent = keys[d];

                        var value = detail.lastElementChild.find('[placeholder="Value"]');
                        value.textContent = Object.values(json.details)[d];

                        column.insertAdjacentHTML('beforeend', detail.outerHTML);
                        d++;
                    } while (d < keys.length)
                }
                details.closest('box').classList.remove('display-none');
            } else {
                details.find('[data-value="post.details"]').innerHTML = "";
                details.closest('box').classList.add('display-none');
            }

            //CHECKOUT
            var checkout = merch.find('[type="submit"]').closest('box');
            var quantity = merch.find('[data-value="post.quantity"]').closest('box');
            if (descendants.length === 0 || (descendant && attr && dimensions && attr.length === Object.keys(dimensions).length)) {
                checkout.classList.remove('display-none');
                quantity.classList.remove('display-none');
            } else {
                checkout.classList.add('display-none');
                quantity.classList.add('display-none');
            }
        }

        //CART        
        var vp = dom.body.find('[data-view="cart"]');
        if (vp) {
            var column = vp.find('block column');
            column.innerHTML = "";

            var cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : null;
            if (cart && cart.length > 0) {
                var template = vp.find('block template');
                var order = [];
                var c = 0;
                do {
                    var row = cart[c];
                    try {
                        var parent = rout.ed.dir(row.slug)[0];
                        var json = await ajax('/raw/merch/' + parent + '/merch.json');
                        if (is.json(json)) {
                            json = JSON.parse(json).find(o=>o.slug === row.slug);
                            console.log(573, json);
                            var el = template.content.firstElementChild.cloneNode(true);
                            el.dataset.slug = row.slug
                            el.find('box').dataset.href = row.href;
                            el.find('picture img').src = json.images[0];
                            el.find('[placeholder="Title"]').textContent = json.title;
                            el.find('[type="number"]').setAttribute('value', row.quantity);
                            el.find('[placeholder="$0.00"]').textContent = '$' + json.pricing.ListPrice;
                            column.insertAdjacentHTML('beforeend', el.outerHTML);
                            0 < 1 ? console.log(581, {
                                el,
                                json,
                                row
                            }) : null;
                            order.push({
                                pricing: json.pricing,
                                quantity: row.quantity
                            });
                        }
                    } catch (e) {
                        console.log(381, {
                            e
                        });
                    }
                    c++;
                } while (c < cart.length);

                console.log(order);
                var subtotal = order.length > 1 ? order.reduce(function(a, b) {
                    var aa = a.pricing.ListPrice * 100 * a.quantity;
                    var bb = b.pricing.ListPrice * 100 * b.quantity;
                    return aa + bb;
                }) : order[0].pricing.ListPrice * 100 * order[0].quantity;
                console.log({
                    subtotal,
                    order
                });
                vp.find('[data-value="cart.subtotal"]').textContent = "$" + (subtotal / 100).toFixed(2);
            }
        }

        //CHECKOUT     
        var vp = dom.body.find('[data-view="checkout"]');
        if (vp) {
            var form = vp.find('form');
            var column = vp.find('block column');
            column.innerHTML = "";

            var cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : null;
            if (cart && cart.length > 0) {
                var template = vp.find('block template');
                var order = [];
                var c = 0;
                do {
                    var row = cart[c];
                    var parent = rout.ed.dir(row.slug)[0];
                    try {
                        var json = await ajax('/raw/merch/' + parent + '/merch.json');
                        if (is.json(json)) {
                            json = JSON.parse(json).find(o=>o.slug === row.slug);
                            var el = template.content.firstElementChild.cloneNode(true);
                            el.dataset.slug = row.slug
                            el.dataset.href = row.href;
                            el.find('picture img').src = json.images[0];
                            el.find('[placeholder="Title"]').textContent = json.title;
                            el.find('[type="number"]').setAttribute('value', row.quantity);
                            el.find('[placeholder="$0.00"]').textContent = '$' + json.pricing.ListPrice;
                            column.insertAdjacentHTML('beforeend', el.outerHTML);
                            0 > 1 ? console.log(635, {
                                el,
                                json,
                                row
                            }) : null;
                            order.push({
                                pricing: json.pricing,
                                quantity: row.quantity
                            });
                        }
                    } catch (e) {
                        console.log(381, {
                            e
                        });
                    }
                    c++;
                } while (c < cart.length);

                var subtotal = order.length > 1 ? order.reduce(function(a, b) {
                    var aa = parseInt(a.pricing.ListPrice) * a.quantity;
                    var bb = parseInt(b.pricing.ListPrice) * b.quantity;
                    return aa + bb;
                }) : order[0].pricing.ListPrice * 100 * order[0].quantity;
                //console.log(subtotal, order);
                vp.find('[data-value="checkout.subtotal"]').textContent = "$" + (subtotal / 100).toFixed(2);

                //PAYMENT INTENT
                try {

                    var stripe_pk = document.head.find('meta[name="stripe_publishable_key"]');
                    if (stripe_pk) {
                        var config = {
                            live: "pk_live_51MgwRSGknMg4Op7wZctEC7wRMIayH6gdWrOKqCxaX8TIwxvEyadOJMHTPuXs3WKfF2B0205sxKuIUleG8QCWYH2r00ir81SA2X",
                            test: "pk_test_51MgwRSGknMg4Op7wXGxVQMnETp4FPKTS3VRJ6msnCl9j0QChLfp8tf9jGeyWbNlK3y9qsDunBERqgk20Llq8JeXZ00LWxzFhXh"
                        }
                        var livemode = stripe_pk.content.split('_')[1] === 'live';
                        var options = null;
                        var stripe_uid = document.head.find('meta[name="stripe_user_id"]');
                        if (stripe_uid) {
                            options = {
                                stripeAccount: stripe_uid.content
                            };
                            var json = await ajax('https://stripe.dompad.workers.dev/v1/payment_intents', {
                                data: JSON.stringify({
                                    amount: subtotal,
                                    currency: 'usd',
                                    livemode,
                                    stripe_user_id: stripe_uid.content
                                }),
                                dataType: 'POST',
                                mode: "cors"
                            });
                            var res = JSON.parse(json);
                            0 > 1 ? console.log({
                                livemode,
                                stripe_pk: stripe_pk.content,
                                options
                            }) : null;
                            window.stripe ? null : window.stripe = Stripe(stripe_pk.content, options);
                        }
                    }
                    if (window.stripe) {
                        //console.log('stripe.payment_intent', res.client_secret);
                        vp.find('input[name="payment_intent_client_secret"]').value = res.client_secret;
                        window.elements = stripe.elements({
                            clientSecret: res.client_secret
                        });

                        var styles = {
                            base: {
                                fontFamily: 'Arial',
                                lineHeight: '50px',
                                fontSize: '16px',
                                '::placeholder': {
                                    color: '#8e8e8e',
                                },
                                ':-webkit-autofill': {
                                    color: '#e39f48',
                                },
                            },
                            invalid: {
                                color: '#ff3b30'
                            },
                        };

                        var address = elements.create('address', {
                            display: {
                                name: 'split'
                            },
                            mode: 'shipping',
                            style: styles
                        });
                        //address.mount(vp.find('[data-value="checkout.address"]'));

                        window.cardNumber = elements.create('cardNumber', {
                            style: styles
                        });
                        cardNumber.mount(vp.find('[data-value="checkout.cardNumber"]'));

                        var cardExpiry = elements.create('cardExpiry', {
                            style: styles
                        });
                        cardExpiry.mount(vp.find('[data-value="checkout.cardExpiry"]'));

                        var cardCvc = elements.create('cardCvc', {
                            style: styles
                        });
                        cardCvc.mount(vp.find('[data-value="checkout.cardCvc"]'));
                    }
                } catch (e) {
                    console.log(686, 'error', e);
                }
            }
        }

        resolve(route);
    }
    );
}
);

window.mvc.c ? null : (window.mvc.c = controller = {});

controller.cart = {};
controller.cart.checkout = async(target)=>{
    ('/cart/checkout').router();
}
controller.cart.delete = slug=>{
    var table = localStorage.getItem('cart');
    if (table) {
        var cart = JSON.parse(table);
        console.log(slug, cart);
        cart = cart.filter(o=>o.slug !== slug);
        console.log(slug, cart);
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.pathname.router();
    }
}
controller.cart.order = event=>{
    event.preventDefault();
    var form = event.target;
    var clientSecret = form.find('input[name="payment_intent_client_secret"]').value;
    var contact = form.all('card')[1].all('box')[0];
    var address = form.all('card')[1].all('box')[1];
    var payment = form.all('card')[1].all('box')[2];
    var fields = {
        contact: {
            email: is.email(contact.find('[placeholder="Email Address"]').value),
            phone: contact.find('[placeholder="Phone Number"]').value.length > 0
        },
        address: {
            firstName: address.find('[placeholder="First Name"]').value.length > 0,
            lastName: address.find('[placeholder="Last Name"]').value.length > 0,
            address1: address.find('[placeholder="Address 1"]').value.length > 0,
            zipCode: address.find('[placeholder="ZIP Code"]').value.length > 0,
            city: address.find('[placeholder="City"]').value.length > 0
        },
        payment: {
            firstName: payment.find('[placeholder="First Name"]').value.length > 0,
            lastName: payment.find('[placeholder="Last Name"]').value.length > 0,
            cardNumber: payment.find('[data-value="checkout.cardNumber"]').classList.contains('StripeElement--complete'),
            cardExp: payment.find('[data-value="checkout.cardExpiry"]').classList.contains('StripeElement--complete'),
            cardCvc: payment.find('[data-value="checkout.cardCvc"]').classList.contains('StripeElement--complete')
        }
    };
    var valid = {
        contact: fields.contact.email || fields.contact.phone,
        address: truth(fields.address),
        payment: truth(fields.payment)
    };
    console.log({
        fields,
        valid,
        truth: truth(valid)
    });
    if (truth(valid)) {
        var billing_details = {};
        billing_details.address = {};
        address.find('[placeholder="City"]').value.length > 0 ? billing_details.address.city = address.find('[placeholder="City"]').value : null;
        //address.find('[placeholder="Country"]').value.length > 0 ? billing_details.address.country = '' : null;
        address.find('[placeholder="Address 1"]').value.length > 0 ? billing_details.address.line1 = address.find('[placeholder="Address 1"]').value : null;
        address.find('[placeholder="Address 2"]').value.length > 0 ? billing_details.address.line2 = address.find('[placeholder="Address 2"]').value : null;
        address.find('[placeholder="ZIP Code"]').value.length > 0 ? billing_details.address.postal_code = address.find('[placeholder="ZIP Code"]').value : null;
        //address.find('[placeholder="Address 1"]').value.length > 0 ? billing_details.address.state = '' : null;
        fields.contact.email ? billing_details.email = contact.find('[placeholder="Email Address"]').value : fields.contact.email;
        billing_details.name = payment.find('[placeholder="First Name"]').value + " " + payment.find('[placeholder="Last Name"]').value;
        fields.contact.phone ? billing_details.phone = contact.find('[placeholder="Phone Number"]') : null;
        console.log(803, billing_details);

        var card = window.elements.getElement('cardNumber');

        0 < 1 ? stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card,
                billing_details
            }
        }).then(function(result) {
            if (result.error) {
                // Show error to your customer (for example, insufficient funds)
                console.log(result.error.message);
            } else {
                // The payment has been processed!
                if (result.paymentIntent.status === 'succeeded') {
                    console.log(774, result);
                    localStorage.removeItem('cart');
                    ('/cart/checkout/order').router();
                    // Show a success message to your customer
                    // There's a risk of the customer closing the window before callback
                    // execution. Set up a webhook or plugin to listen for the
                    // payment_intent.succeeded event that handles any business critical
                    // post-payment actions.
                }
            }
        }) : null;
    }
}
controller.cart.update = obj=>{
    //console.log(obj);
    var cart = localStorage.getItem('cart');
    if (cart) {
        cart = JSON.parse(cart);
    } else {
        cart = [];
    }
    if (cart.some(o=>o.slug === obj.slug)) {
        cart = cart.filter(function(o) {
            if (o.slug === obj.slug) {
                o.quantity = o.quantity + obj.quantity;
            }
            return o;
        })
    } else {
        cart.push(obj);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
}

controller.product = {};
controller.product.cart = event=>{
    event.preventDefault();
    var form = event.target;
    var dir = rout.ed.dir(route.path);
    var href = route.path;
    var slug = dir.splice(form.closest('[data-merch]').dataset.merch).join('/');
    var quantity = parseInt(form.find('[data-value="post.quantity"]').value);
    0 > 1 ? console.log("controller.product.cart", {
        href,
        slug,
        quantity
    }) : null;
    if (slug && quantity > 0) {
        var obj = {
            href,
            quantity,
            slug
        };
        controller.cart.update(obj);
        '/cart/'.router();
    }
}
controller.product.quantity = target=>{
    var button = target.closest('row').find('input');
    var ico = target.closest('ico');
    if (button && ico) {
        var up = ico.find('.gg-chevron-up');
        var down = ico.find('.gg-chevron-down');
        button.value = button.value === '' ? 0 : button.value;
        if (up) {
            button.value = parseInt(button.value) + 1;
        }
        if (down && button.value > 0) {
            button.value = parseInt(button.value) - 1;
        }
    }
}
controller.product.traits = async(target)=>{
    var attributes = target.previousElementSibling;
    var variations = await modal.dropdown(target, {
        other: false,
        title: attributes.find('[placeholder]').value
    });

    var url = route.path;
    var values = [];
    var traits = target.closest('box > column').children;
    if (traits.length > 0) {
        var t = 0;
        do {
            var trait = traits[t];
            0 > 1 ? console.log(371, {
                traits,
                trait
            }) : null;
            var name = trait.find('field [placeholder]').textContent;
            var value = trait.find('dropdown [placeholder]').textContent;
            if (name.length > 0 && value.length > 0) {
                values.push(name.toLowerCase().replaceAll('-', '') + "-" + value.toLowerCase().replaceAll('-', '').replaceAll(' ', '-'));
            }
            t++;
        } while (t < traits.length);
        var matrix = values.join('_');
        if (matrix.length > 0) {
            //console.log(matrix, values);
            var dir1 = rout.ed.dir(route.path);
            var dir2 = rout.ed.dir(route.page);
            url = route.page.replace('*', dir1[dir2.length - 1] + "/" + matrix);
            //console.log(url);
        }
        var vp = target.closest('pages');

        0 > 1 ? console.log({
            route,
            url,
            matrix,
            values
        }, {
            attributes,
            variations
        }, {
            matrix,
            traits,
            values
        }) : null;

        route.path === url ? null : url.router();
    }
}

mvc.c = controller;
