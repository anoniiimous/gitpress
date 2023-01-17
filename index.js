window.auth ? null : window.auth = {};
auth.config = {
    apiKey: "AIzaSyBs3Q5b1yZpo1egGXfA_X9wmCNbPrFik_4",
    authDomain: "jamstack-cms.firebaseapp.com",
    projectId: "jamstack-cms",
    messagingSenderId: "145843831249",
    appId: "1:145843831249:web:f1be6e15d0b1372b5da0f0"
};

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
        console.log(event.state);
        var state = is.local(window.location.protocol) ? event.state.replace(/^#+/, '') : event.state;
        event.state.length > 0 ? event.state.router() : null;
    } else {
        if (document.location) {//console.log({place});
        }
    }
    //console.log(event, "location: " + document.location + ", state: " + JSON.stringify(state));
}

async function init() {
    console.log("Initializing...");
    eruda.init();
    
    const html = await ajax('raw/html/template/template.shell.html');
    dom.body.find('boot').insertAdjacentHTML('afterend', html);

    window.rout.ing = function(href, GOT, n, m=GOT[n], root=GOT[0]) {
        window.roots = ["create", "dashboard", "design", "directory", "new", "preview"];
        return m.includes("#") || 
            (GOT.length > 1 && roots.indexOf(root) === -1) ||
            (root === 'dashboard' && n === 1) || 
            (GOT.length === 5 && root === 'dashboard' && GOT[2] === "files" && GOT[3] === "file" && n === 4) ||
            (GOT.length === 3 && root === 'dashboard' && n === 1 && GOT[2] === "posts") || 
            (GOT.length === 4 && root === 'dashboard' && n === 1 && GOT[2] === "posts" && GOT[3] === "post") || 
            (GOT.length === 5 && root === 'dashboard' && GOT[2] === "posts" && GOT[3] === "post" && n === 4) ||
            (root === 'design' && n === 1) ||
            (root === 'preview' && n === 1)
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
    if (hub) {
        var dir = rout.ed.dir(window.location.pathname);
        dir.splice(0, 1)
        var url = rout.ed.url(dir);
    }

    var uri = ((dom.boot.dataset.path ? dom.boot.dataset.path : url) + (window.location.search + window.location.hash));

    var go = false;

    firebase.initializeApp(auth.config);
    const onAuthStateChanged = function(user) {
        auth.change(user).then(authChange);
        if (user) {
            //alert(false);
            uri = ((dom.boot.dataset.path ? dom.boot.dataset.path : url) + (window.location.search + window.location.hash));
        } else {
            //alert(true);
            //uri = "/dashboard/";
            localStorage.removeItem('githubAccessToken');
            //byId("avi").innerHTML = "";
        }
        1 < 0 && go ? console.log("no route") : uri.router().then(go = true);
    }
    firebase.auth().onAuthStateChanged(onAuthStateChanged);
    //firebase.auth().currentUser ? alert(null) : uri.router();
    console.log("Initialized",firebase.auth(),firebase.auth().currentUser);
    firebase.auth().getRedirectResult().then((result)=>{
        //firebase.auth().signInWithPopup(provider).then((result)=>{
        var credential = result.credential;
        if (credential) {
            var token = credential.accessToken;
            var user = result.user;
            localStorage.setItem('githubAccessToken', token);
        }
        1<0 ? console.log(345, {
            result
        }) : null;
    }
    ).catch((error)=>{
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log({
            error
        });
    }
    );
}
