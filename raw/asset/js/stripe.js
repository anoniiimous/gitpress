window.stripe = {
    config: {
        client_id: {
            test: "ca_NRq8a1hzM0GsHoetep99NkT0mCmBzLKH"
        },
        redirect_uri: window.location.protocol + "//" + window.location.host,
        scope: "read_write",
        state: 'stripe_' + Crypto.uid.create(1)
    },
    oauth: {
        authorize: async(params)=>{
            var state = params.state;

            var token = 0 < 1 ? await stripe.oauth.token({
                dataType: "POST",
                data: JSON.stringify({
                    //client_id: stripe.config.client_id.test,
                    grant_type: 'authorization_code',
                    code: params.code
                }),
                mode: "cors"
            }) : null;

            var href = localStorage.getItem('redirect_uri');
            //var href = "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=" + stripe.config.client_id.test + "&scope=read_write";
            //window.location = "https://connect.stripe.com/connect/default/oauth/test?scope=read_write&code=" + params.code;
            href.router().then(localStorage.removeItem('redirect_uri'));
        }
        ,
        token: async(settings)=>{
            console.log(32, settings);
            try {
                var host = 0 < 1 ? 'https://stripe.dompad.workers.dev' : 'https://connect.stripe.com/oauth/token';
                var res = await ajax(host, settings);
                console.log(26, 'success', res);
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
