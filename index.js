window.api = {
    endpoint: "https://api-anon.herokuapp.com"
};

window.auth ? null : window.auth = {};
auth.config = {
    apiKey: "AIzaSyBs3Q5b1yZpo1egGXfA_X9wmCNbPrFik_4",
    authDomain: "jamstack-cms.firebaseapp.com",
    projectId: "jamstack-cms",
    messagingSenderId: "145843831249",
    appId: "1:145843831249:web:f1be6e15d0b1372b5da0f0"
};

window.cdn = {
    endpoint: "https://cdn.uios.computer/file/write-uios"
}

window.onload = ()=>{
    window.dom = {
        body: document.body,
        boot: document.getElementById("boot"),
        nav: document.body.find('nav')
    };

    window.global = window.globals;
    dom.body.dataset.load = "ing";

    init();
}

window.onpopstate = (event)=>{
    if (event.state) {
        var state = is.local(window.location.protocol) ? event.state.replace(/^#+/, '') : event.state;
        state.router({
            pop: true
        });
    } else {
        if (document.location) {//console.log({place});
        }
    }
    //console.log(event, "location: " + document.location + ", state: " + JSON.stringify(state));
}

function init() {
    console.log("Initializing...");

    window.rout.ing = function(href, GOT, n, m=GOT[n], root=GOT[0]) {
        return m.includes("#") || (root === 'dashboard' && n === 1);
    }

    touch.events = {
        dbltap: on.touch.dbltap,
        drag: on.touch.drag,
        press: on.touch.press,
        tap: on.touch.tap
    };
    touch.ing = false;

    dom.body.dataset.theme = "meridiem";
    dom.body.addEventListener("click", function(e) {
        if (window.touch.ing === false) {
            on.touch.tap(e);
            //console.log(e.type,window.touch.ing);
        } else {
            window.touch.ing = false;
            //console.log(e.type,window.touch.ing);
        }
    });
    dom.body.addEventListener("touchstart", function(e) {
        window.touch.ing = true;
        touch.handler(event);
        //console.log(e.type);
    }, {
        passive: true
    });
    dom.body.addEventListener("touchmove", touch.handler, {
        passive: true
    });
    dom.body.addEventListener("touchcancel", touch.handler, false);
    dom.body.addEventListener("touchend", function(e) {
        //window.touch.ing = false;
        touch.handler(event);
        //console.log(e.type);
    });

    const authChange = function(e) {
        const load = function(e) {
            dom.body.dataset.load = "ed";
        };
        dom.body.dataset.load = "ed";
    };

    var url = window.location.pathname;
    if (window.globals.domains.subdomain === "uios") {
        var dir = rout.ed.dir(window.location.pathname);
        dir.splice(0, 1)
        var url = rout.ed.url(dir);
    }

    var uri = ((dom.boot.dataset.path ? dom.boot.dataset.path : url) + (window.location.search + window.location.hash));

    var go = false;
    if (window.firebase) {
        firebase.initializeApp(auth.config);
        const onAuthStateChanged = function(user) {
            auth.change(user).then(authChange);
            if (user) {
                uri = ((dom.boot.dataset.path ? dom.boot.dataset.path : url) + (window.location.search + window.location.hash));
            } else {
                uri = "/dashboard/";
                localStorage.removeItem('githubAccessToken');
                //byId("avi").innerHTML = "";
            }
            go ? null : uri.router().then(go = true);
        }
        firebase.auth().onAuthStateChanged(onAuthStateChanged);
    } else {
        uri.router().then(authChange);
    }

    console.log("Initialized");
}
