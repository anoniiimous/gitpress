window.stripe = {
    config: {
        client_id: {
            live: null,
            test: null
        },
        livemode: false,
        redirect_uri: window.location.protocol + "//" + window.location.host,
        scope: "read_write",
        state: 'stripe_' + Crypto.uid.create(1)
    },
    secret: {
        find: async(params)=>{
            console.log(params);
        }
        ,
        list: async(params)=>{
            console.log(params);
        }
        ,
        set: async(settings)=>{
            return new Promise(async function(resolve, reject) {

                console.log(32, settings);
                try {
                    var host = 0 < 1 ? 'https://stripe.dompad.workers.dev/v1/apps/secrets' : 'https://connect.stripe.com/oauth/token';
                    var res = await ajax(host, settings);
                    var data = JSON.parse(res);
                    //var access_token = btoa(data["access_token"]);
                    //delete data.access_token;
                    var get = rout.ed.dir(location.pathname);
                    console.log(42, 'success', {
                        data,
                        get
                    }, location.pathname);

                    if (data.error) {
                        throw Error(JSON.stringify(data));
                    } else {

                        console.log(42, 'success', {
                            data
                        });

                    }
                } catch (e) {
                    console.log(30, 'error', e);
                }

            }
            )
        }
    },
    oauth: {
        client_id: {
            live: "ca_NRq81ctgks9lD5YYk51ST84ybrKlriVy",
            test: "ca_NRq8a1hzM0GsHoetep99NkT0mCmBzLKH"
        },
        authorize: async(params)=>{
            return new Promise(async(resolve,reject)=>{
                var state = params.state;
                var href = localStorage.getItem('redirect_uri');
                console.log(63, href, rout.ed.dir(href)[1]);
                //var href = "https://connect.stripe.com/oauth/authorize?response_type=code&client_id="'' + stripe.config.client_id.test + "&scope=read_write";
                //window.location = "https://connect.stripe.com/connect/default/oauth/test?scope=read_write&code=" + params.code;
                if (href && 0 < 1) {
                    localStorage.removeItem('redirect_uri');
                    var token = 0 < 1 ? await stripe.oauth.token({
                        dataType: "POST",
                        data: JSON.stringify({
                            //client_id: stripe.config.client_id.test,
                            grant_type: 'authorization_code',
                            livemode: stripe.config.livemode,
                            code: params.code,
                            repo: window.owner.login + '/' + rout.ed.dir(href)[1],
                            githubAccessToken: localStorage.githubAccessToken
                        }),
                        mode: "cors"
                    }) : null;
                    console.log(78, token);
                    var secret = 0 > 1 ? await stripe.secret.set({
                        dataType: "POST",
                        data: JSON.stringify({
                            name: 'repository',
                            payload: window.owner.login + '/' + GET[1],
                            scope: {
                                type: 'user',
                                user: token.stripe_user_id
                            }
                        }),
                        mode: "cors"
                    }) : null;
                    href.router().then(async function() {
                        resolve({
                            token,
                            secret
                        });
                    });
                } else {
                    localStorage.removeItem('redirect_uri')
                }
            }
            );
        }
        ,
        token: async(settings)=>{
            return new Promise(async function(resolve, reject) {

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

                    if (data.error) {
                        throw Error(JSON.stringify(data));
                    } else {
                        var d = JSON.parse(settings.data);
                        var repo = d.repo;
                        var owner = repo.split('/')[0];
                        var name = repo.split('/')[1];
                        console.log({d,repo,owner,name});
                        var html = await github.repos.contents({
                            owner: window.owner.login,
                            repo: name,
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

                        if (access_token) {
                            var params = {
                                message: 'Update Client-side Stripe Publishable Key',
                                repo: name,
                                owner: owner
                            };
                            var array = [{
                                content: doc.documentElement.outerHTML,
                                path: "index.html"
                            }, {
                                content: JSON.stringify({
                                    "stripe_publishable_key": data.stripe_publishable_key,
                                    "stripe_user_id": data.stripe_user_id
                                }, null, 4),
                                path: "raw/asset/json/stripe.json"
                            }];
                            await github.crud.update(params, array);
                            resolve(access_token);
                        }

                    }
                } catch (e) {
                    console.log(30, 'error', e);
                }

            }
            )
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
