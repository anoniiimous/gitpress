window.stripe = {
    config: {
        client_id: {
            live: null,
            test: null
        },
        livemode: true,
        redirect_uri: window.location.protocol + "//" + window.location.host,
        scope: "read_write",
        state: 'stripe_' + Crypto.uid.create(1)
    },
    oauth: {
        client_id: {
            live: "ca_NRq81ctgks9lD5YYk51ST84ybrKlriVy",
            test: "ca_NRq8a1hzM0GsHoetep99NkT0mCmBzLKH"
        },
        authorize: async(params)=>{
            var state = params.state;

            var href = localStorage.getItem('redirect_uri');
            //var href = "https://connect.stripe.com/oauth/authorize?response_type=code&client_id="'' + stripe.config.client_id.test + "&scope=read_write";
            //window.location = "https://connect.stripe.com/connect/default/oauth/test?scope=read_write&code=" + params.code;
            if (href && 0 < 1) {
                href.router().then(async function() {
                    localStorage.removeItem('redirect_uri');
                    var token = 0 < 1 ? await stripe.oauth.token({
                        dataType: "POST",
                        data: JSON.stringify({
                            //client_id: stripe.config.client_id.test,
                            grant_type: 'authorization_code',
                            livemode: stripe.config.livemode,
                            code: params.code
                        }),
                        mode: "cors"
                    }) : null;
                });
            } else {
                localStorage.removeItem('redirect_uri')
            }
        }
        ,
        token: async(settings)=>{
            console.log(32, settings);
            try {
                var host = 0 < 1 ? 'https://stripe.dompad.workers.dev/oauth/token' : 'https://connect.stripe.com/oauth/token';
                var res = await ajax(host, settings);
                var data = JSON.parse(res);
                var access_token = btoa(data["access_token"]);
                delete data.access_token;
                var get = rout.ed.dir(location.pathname);
                console.log(42, 'success', {
                    data,
                    get
                }, location.pathname);

                if(data.error) {
                    throw Error(JSON.stringify(data));
                } else {

                    var html = await github.repos.contents({
                        owner: window.owner.login,
                        repo: GET[1],
                        path: '/index.html'
                    }, {
                        accept: 'application/vnd.github.raw'
                    })
                    var doc = new DOMParser().parseFromString(html, 'text/html');
                    if (data.stripe_publishable_key) {
                        var meta = doc.head.find('meta[name="stripe_publishable_key"]');
                        if (meta) {
                            meta.content = data.stripe_publishable_key
                        } else {
                            var metas = doc.head.all('meta');
                            var el = document.createElement('meta')
                            el.name = 'stripe_publishable_key';
                            el.content = data.stripe_publishable_key;
                            metas[metas.length - 1].insertAdjacentHTML('afterend', '\n        ' + el.outerHTML);
                        }
                    }
                    if (data.stripe_user_id) {
                        var meta = doc.head.find('meta[name="stripe_user_id"]');
                        if (meta) {
                            meta.content = data.stripe_user_id
                        } else {
                            var metas = doc.head.all('meta');
                            var el = document.createElement('meta')
                            el.name = 'stripe_user_id';
                            el.content = data.stripe_user_id;
                            metas[metas.length - 1].insertAdjacentHTML('afterend', '\n        ' + el.outerHTML);
                        }
                    }
                    
                    console.log(42, 'success', {
                        html,
                        doc,
                        document: doc.documentElement.outerHTML,
                        head: doc.head.outerHTML
                    });
    
                    if(access_token) {
                        var params = {
                            message: 'Update Client-side Stripe Publishable Key',
                            repo: GET[1],
                            owner: window.owner.login
                        };
                        var array = [{
                            content: doc.documentElement.outerHTML,
                            path: "index.html"
                        }];
                        await github.crud.update(params, array);
                    }
                    
                }
            } catch (e) {
                console.log(30, 'error', e);
            }
        }
    },
    v1: {
        products: ()=>{
            fetch("https://api.stripe.com/v1/products", {
                body: "name=T-shirt",
                headers: {
                    Authorization: "Basic c2tfdGVzdF81MU1nd1JTR2tuTWc0T3A3d3ZRVTB0NzlxZmpMU0hNN1dmUVpYejEwQkJSYXZFUGdqVzk4bE54Q09CcUVpVGF5VGVwSkxKeXNTcDhnM21XckxsRHZtTlBaZTAwQlhNWGkyamU6",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                method: "POST"
            })
        }
    }
}
