window.auth = {
    config: {
        apiKey: null,
        authDomain: null,
        projectId: null,
        messagingSenderId: null,
        appId: null
    },
    change: (user)=>{
        return new Promise(async(resolve,reject,url)=>{
            if (user) {
                dom.body.dataset.uid = user.uid;
            } else {
                dom.body.removeAttribute('data-uid');
            }
            resolve(user);
        }
        );
    }
    ,
    check: (uid)=>{
        return new Promise(async(resolve,reject,url)=>{
            firebase.auth().currentUser.getIdToken(true).then((jwt)=>{
                ajax(api.endpoint() + "/auth/firebase/verify", {
                    dataType: "POST",
                    data: jwt
                }).then((j,json=JSON.parse(j))=>{
                    var response = json.response;
                    resolve(response);
                }
                ).catch((err)=>{
                    resolve(err);
                }
                );
            }
            ).catch((error)=>console.log({
                error
            }));
        }
        );
    }
    ,
    profile: ()=>{
        (auth.user() ? "/users/" + auth.user().uid + "/" : "/my/account/").router();
    }
    ,
    verify: (uid)=>{
        return new Promise((resolve,reject,url)=>{
            firebase.auth().currentUser.getIdToken(true).then((jwt)=>{
                ajax(api.endpoint + "/auth/firebase/verify", {
                    dataType: "POST",
                    data: jwt
                }).then((j,json=JSON.parse(j))=>resolve(json));
            }
            ).catch((error)=>console.log({
                error
            }));
        }
        );
    }
    ,
    getIdToken: ()=>{
        return new Promise((resolve,reject,url)=>{
            firebase.auth().currentUser.getIdToken(true).then((jwt)=>{
                resolve(jwt);
            }
            );
        }
        );
    }
    ,
    isEmail: (email)=>{
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    ,
    account: {
        close: (network)=>{
            if (1 > 0) {
                return new Promise((resolve,reject)=>{
                    firebase.auth().signOut().then((d)=>{
                        dom.body.removeAttribute("data-uid");
                        '/'.router();
                        resolve(d);
                    }
                    ).catch((error)=>{
                        reject(error);
                    }
                    );
                }
                );
            } else {
                localStorage.removeItem('githubAccessToken');
            }
        }
        ,
        login: (event)=>{
            console.log('auth.account.login');
            event.preventDefault();
            var target = event.target
              , form = target.closest("form");
            var email = form.find('input[type="text"]').value
              , password = form.find('input[type="password"]').value;
            return new Promise((resolve,reject)=>{
                console.log(100, {
                    email,
                    password
                });
                firebase.auth().signInWithEmailAndPassword(email, password).then(e=>{
                    dom.body.dataset.uid = e.user.uid;
                    resolve(e.user);
                }
                ).catch(function(error) {
                    console.log(error.code + ": " + error.message);
                    reject(error);
                });
            }
            );
        }
        ,
        setup: (event)=>{
            event.preventDefault();
            var form = event.target;
            var displayName = form.find('[placeholder="First Name"]').value + ' ' + form.find('[placeholder="Last Name"]').value
              , username = form.find('[placeholder="Username"]').value;
            var email = form.find('[placeholder="Email"]').value
              , password = form.find('input[type="password"]').value;
            return new Promise((resolve,reject)=>{
                const data = new FormData();
                data.append('email', email);
                data.append('username', username);
                data.append('password', password);
                data.append('displayName', displayName);
                console.log("auth.account.setup", {
                    data
                });
                if (displayName && username && email && password) {
                    if (auth.isEmail(email)) {
                        var endpoint = is.local(window.location.href) ? "http://api.uios.tld" : api.endpoint;
                        ajax(endpoint + '/v1/users', {
                            dataType: "POST",
                            data
                        }).then(e=>{
                            var results = JSON.parse(e)
                              , user = auth.user();
                            console.log("auth.account.setup", {
                                results,
                                user
                            });
                            resolve({
                                email,
                                password
                            });
                        }
                        ).catch(function(error) {
                            console.log('auth.js auth.account.setup user.create catch', {
                                error
                            });
                            reject(error);
                        });
                    } else {
                        alert("You must register with a valid email address.", 3);
                    }
                } else {
                    alert("You must supply a name, email, password and username.", 3);
                }
            }
            )
        }
        ,
        signin: (email,password)=>{
            return new Promise((resolve,reject)=>{
                firebase.auth().signInWithEmailAndPassword(email, password).then(e=>{
                    resolve(e);
                }
                ).catch(e=>{
                    reject(e);
                }
                );
            }
            );
        }
        ,
        update: async(event)=>{
            event.preventDefault();
            var form = event.target;
            var username = form.find('[placeholder="@username"]').value;
            if (username === "") {
                alert("You must supply a username.");
            } else {
                var jwt = await auth.getIdToken();
                var data = {
                    jwt,
                    username
                };
                ajax(api.endpoint + "/v1/users/notes/update", {
                    dataType: "PUT",
                    data
                }).then((d,data=JSON.parse(d))=>{
                    console.log("update", data);
                    alert("Your profile has been updated.");
                }
                );
            }
        }
    },
    state: (event)=>{
        if (typeof event === "string" || typeof event === "object") {
            var oAuth = (net)=>{
                var provider;
                firebase.auth().useDeviceLanguage();
                if (net === "facebook") {
                    provider = new firebase.auth.FacebookAuthProvider();
                } else if (net === "github") {
                    provider = new firebase.auth.GithubAuthProvider();
                    provider.addScope("gists");
                    provider.addScope("repo");
                    provider.addScope("delete_repo");
                } else if (net === "google") {
                    provider = new firebase.auth.GoogleAuthProvider();
                    provider.addScope("https://www.googleapis.com/auth/drive");
                    provider.addScope("https://www.googleapis.com/auth/drive.readonly");
                    provider.addScope("https://www.googleapis.com/auth/drive.appdata");
                } else if (net === "github") {
                    provider = new firebase.auth.GithubAuthProvider();
                } else if (net === "microsoft") {
                    provider = new firebase.auth.OAuthProvider("microsoft.com");
                } else if (net === "twitter") {
                    provider = new firebase.auth.TwitterAuthProvider();
                }
                isOnline() ? firebase.auth().currentUser.linkWithPopup(provider).then((result)=>{
                    var credential = result.credential
                      , user = result.user;
                }
                ) : firebase.auth().signInWithPopup(provider).then((e)=>{
                    localStorage[net + "Token"] = e.credential.accessToken;
                    auth.check(uid).then((response)=>{
                        console.log({
                            response
                        });
                        alert(goto);
                        goto.router().then(resolve());
                    }
                    );
                }
                ).catch((error)=>console.log(error.message, 2));
            }
            ;
            if (typeof event === "object") {
                event.forEach((k)=>oAuth(k));
            } else if (typeof event === "string") {
                oAuth(event);
            }
        }
    }
    ,
    framework: (framework)=>{
        return framework.isauth && isOnline() ? "isauth" : "noauth";
    }
    ,
    update: (displayName)=>{
        isOnline() ? isOnline().updateProfile({
            displayName
        }).then(()=>console.log("auth.js auth.update:", displayName), ()=>notify("There was an error changing your username.", 2)) : notify("You must be logged in to change your username", 2);
    }
    ,
    user: ()=>{
        //return firebase.auth().currentUser;
        return localStorage.githubAccessToken;
    }
};
