window.github = {
    endpoint: "https://api.github.com",
    oauth: {
        authorize: async(params,sl)=>{
            var code = params.code;
            var state = params.state;
            var client_id = github.oauth.client_id[location.host];
            var redirect_uri = github.oauth.config.redirect_uri;
            var settings = {
                data: JSON.stringify({
                    client_id,
                    code,
                    redirect_uri,
                    state
                }),
                dataType: "POST"
            };
            var endpoint = "https://oauth.dompad.workers.dev";
            if (sl) {
                endpoint = "https://github.com/login/oauth/authorize";
                settings.mode = "cors";
            }
            var obj = {
                state
            }
            //var query = new URLSearchParams(obj).toString();
            //endpoint + "?" + query;
            console.log(509, "mvc.js", {
                endpoint,
                settings
            });
            try {
                var result = JSON.parse(await ajax(endpoint, settings));
                console.log(526, "mvc.js", {
                    result
                });
                var token = result.token;
                if (token) {
                    localStorage.setItem('githubAccessToken', token);
                }
            } catch (e) {
                console.log(e);
            }
        }
        ,
        client_id: {
            "dompad.io": "1a41e41b2b371e7a1a5b",
            "dompad.pages.dev": "fdeadaa98b35c6df688c",
            "dompad.github.tld": 0 < 1 ? "d100ccbc44112f0d5a92" : "Iv1.cbe275c17b8db02d"
        },
        config: {
            client_id: 0 > 1 ? "Iv1.cbe275c17b8db02d" : "d100ccbc44112f0d5a92",
            redirect_uri: window.location.protocol + "//" + window.location.host + "/dashboard/",
            scope: "user,public_repo,repo"
        },
        login: (target)=>{
            var client_id = github.oauth.client_id[location.host];
            var redirect_uri = github.oauth.config.redirect_uri;
            var search = route.search;

            var scope = github.oauth.config.scope;
            var state = Crypto.uid.create(1);
            var obj = {
                client_id,
                scope,
                state,
                redirect_uri
            }
            var query = new URLSearchParams(obj).toString();

            var a = document.createElement('a');
            var href = "https://github.com/login/oauth/authorize?" + query;
            a.href = href;
            a.click();
            console.log(534, "mvc.js", {
                href,
                obj,
                query
            });
        }
        ,
        logout: ()=>{
            localStorage.removeItem('githubAccessToken');
            dom.body.removeAttribute('data-uid');
        }
        ,
        verify: ()=>{
            return localStorage.githubAccessToken;
        }
    },
    raw: {
        file: (resource)=>{
            return new Promise((resolve,reject)=>{
                var host = 'https://raw.dompad.workers.dev';
                var url = host + resource + '?token=' + localStorage.githubAccessToken;
                var settings = {
                    headers: {
                        'Accept': 'application/vnd.github.v3.raw',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': 'token ' + localStorage.githubAccessToken
                    },
                    mode: 'cors'
                };
                const a = (data)=>{
                    resolve(data);
                }
                ajax(url).then(a);
            }
            );
        }
        ,
        git: (resource)=>{
            return new Promise((resolve,reject)=>{
                var host = 'https://raw.githubusercontent.com';
                var url = host + resource;
                var settings = {
                    headers: {
                        'Accept': 'application/vnd.github.v3.raw',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': 'token ' + localStorage.githubAccessToken
                    },
                    mode: 'cors'
                };
                const a = (data)=>{
                    resolve(data);
                }
                ajax(url, settings).then(a);
            }
            );
        }
        ,
        path: async(resource)=>{
            var r = rout.ed.dir(resource);
            var repo = r[1];
            r.splice(0, 3);
            var path = rout.ed.url(r);
            var user = await github.user.get();
            var owner = user.login;
            return await github.repos.contents({
                owner,
                path,
                repo
            }, {
                //accept: "application/vnd.github.raw",
                cache: "reload"
            });
        }
    },
    database: {
        blobs: (params,settings)=>{
            if (settings) {
                if (settings.dataType) {
                    if (settings.dataType === "POST") {
                        return new Promise((resolve,reject)=>{
                            const data = settings.data;
                            const owner = params.owner;
                            const repo = params.repo;
                            const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/blobs";
                            const dataType = settings.dataType;
                            const a = (d)=>{
                                const data = JSON.parse(d);
                                resolve(data);
                            }
                            const b = (error)=>{
                                console.log(error);
                                reject(error);
                            }
                            const accessToken = localStorage.githubAccessToken;
                            accessToken ? settings.headers = {
                                Accept: "application/vnd.github+json",
                                Authorization: "token " + accessToken
                            } : null;
                            //console.log({ url, settings });
                            ajax(url, settings).then(a).catch(b);
                        }
                        );
                    }
                }
            } else {
                return new Promise((resolve,reject)=>{
                    const owner = params.owner;
                    const repo = params.repo;
                    const sha = params.sha;
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/blobs/" + sha;
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    var settings = {};
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    //console.log({ url, settings });
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }
        }
        ,
        commits: (params,settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        var message = params.message;
                        var owner = params.owner;
                        var repo = params.repo;
                        var sha = params.sha;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/commits";
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        references: (params,settings)=>{
            if (settings) {
                if (settings.dataType) {
                    if (settings.dataType === "GET") {
                        return new Promise((resolve,reject)=>{
                            var owner = params.owner;
                            var repo = params.repo;
                            var branch = params.branch;
                            var ref = branch ? "/heads/" + branch : params.ref;
                            const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/refs" + ref;
                            const dataType = settings.dataType;
                            const a = (d)=>{
                                const data = JSON.parse(d);
                                resolve(data);
                            }
                            const b = (error)=>{
                                console.log(error);
                                reject(error);
                            }
                            const accessToken = localStorage.githubAccessToken;
                            accessToken ? settings.headers = {
                                Accept: "application/vnd.github+json",
                                Authorization: "token " + accessToken
                            } : null;
                            ajax(url, settings).then(a).catch(b);
                        }
                        );
                    }
                    if (settings.dataType === "PATCH") {
                        return new Promise((resolve,reject)=>{
                            var owner = params.owner;
                            var repo = params.repo;
                            var branch = params.branch;
                            var ref = branch ? "/heads/" + branch : "";
                            const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/refs" + ref;
                            const dataType = settings.dataType;
                            const a = (d)=>{
                                const data = JSON.parse(d);
                                resolve(data);
                            }
                            const b = (error)=>{
                                console.log(error);
                                reject(error);
                            }
                            const accessToken = localStorage.githubAccessToken;
                            accessToken ? settings.headers = {
                                Accept: "application/vnd.github+json",
                                Authorization: "token " + accessToken
                            } : null;
                            ajax(url, settings).then(a).catch(b);
                        }
                        );
                    }
                }
            } else {
                return new Promise((resolve,reject)=>{
                    var owner = params.owner;
                    var repo = params.repo;
                    var branch = params.branch;
                    var ref = branch ? "/heads/" + branch : params.ref;
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/refs" + ref;
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings = {
                        headers: {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        }
                    } : null;
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }

        }
        ,
        trees: (params,settings)=>{
            if (settings) {
                if (settings.dataType) {
                    if (settings.dataType === "GET") {
                        return new Promise((resolve,reject)=>{
                            var owner = params.owner;
                            var repo = params.repo;
                            var branch = params.branch;
                            var sha = params.sha;
                            const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/trees/" + sha;
                            const data = settings.data;
                            const dataType = settings.dataType;
                            const a = (d)=>{
                                const data = JSON.parse(d);
                                resolve(data);
                            }
                            const b = (error)=>{
                                console.log(error);
                                reject(error);
                            }
                            const accessToken = localStorage.githubAccessToken;
                            accessToken ? settings.headers = {
                                Accept: "application/vnd.github+json",
                                Authorization: "token " + accessToken
                            } : null;
                            ajax(url, settings).then(a).catch(b);
                        }
                        );
                    }
                    if (settings.dataType === "POST") {
                        return new Promise((resolve,reject)=>{
                            var owner = params.owner;
                            var repo = params.repo;
                            const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/trees";
                            const data = settings.data;
                            const dataType = settings.dataType;
                            const a = (d)=>{
                                const data = JSON.parse(d);
                                resolve(data);
                            }
                            const b = (error)=>{
                                console.log(error);
                                reject(error);
                            }
                            const accessToken = localStorage.githubAccessToken;
                            accessToken ? settings.headers = {
                                Accept: "application/vnd.github+json",
                                Authorization: "token " + accessToken
                            } : null;
                            ajax(url, settings).then(a).catch(b);
                        }
                        );
                    }
                }
            } else {
                return new Promise((resolve,reject)=>{
                    var owner = params.owner;
                    var repo = params.repo;
                    var branch = params.branch;
                    var sha = params.sha;
                    var recursive = params.recursive ? "?recursive=" + params.recursive : "";
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/git/trees/" + sha + recursive;
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings = {
                        headers: {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        }
                    } : null;
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }
        }
    },
    gists: {
        create: (settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        const url = github.endpoint + "/gists";
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        update: (params,settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "PATCH") {
                    return new Promise((resolve,reject)=>{
                        const url = github.endpoint + "/gists/" + params.gist;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        delete: (params,settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "DELETE") {
                    return new Promise((resolve,reject)=>{
                        const url = github.endpoint + "/gists/" + params.gist;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        get: (params,settings)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/gists";
                const data = settings.data;
                const dataType = settings.dataType;
                const a = (d)=>{
                    const data = JSON.parse(d);
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
    },
    repos: {
        contents: (params,settings)=>{
            if (settings && settings.dataType) {
                if (settings.dataType === "DELETE") {
                    console.log(7, {
                        params,
                        settings
                    });
                    return new Promise((resolve,reject)=>{
                        const owner = params.owner;
                        const repo = params.repo;
                        const path = params.path;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents/" + path;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: settings.accept ? settings.accept : "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                } else if (settings.dataType === "PUT") {
                    console.log(params);
                    return new Promise((resolve,reject)=>{
                        const owner = params.owner;
                        const repo = params.repo;
                        const path = params.path;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents" + path;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken,
                            'If-None-Match': ''
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                } else {
                    return new Promise((resolve,reject)=>{
                        const owner = params.owner;
                        const repo = params.repo;
                        const path = params.path;
                        const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents" + path;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken,
                            'If-None-Match': ''
                        } : null;
                        console.log({
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            } else {
                settings ? null : settings = {};
                return new Promise((resolve,reject)=>{
                    const owner = params.owner;
                    const repo = params.repo;
                    const path = params.path;
                    const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents" + path;
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    const accessToken = localStorage.githubAccessToken;
                    settings.cache = "reload";
                    accessToken ? settings.headers = {
                        Accept: settings.accept ? settings.accept : "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }
        }
        ,
        create: (params,settings)=>{
            if (settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        const owner = "anoniiimous";
                        const repo = "blog.template.default";
                        const url = github.endpoint + "/repos/" + owner + "/" + repo;
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
        ,
        delete: (target)=>{
            console.log(target);
            const box = target.closest('box');
            const owner = box.find('text').dataset.owner;
            const repo = box.find('text').dataset.repo;
            const name = box.find('text').textContent;
            if (confirm("Are you sure you wnat to delete the project entitled " + name + "?")) {
                return new Promise((resolve,reject)=>{
                    const url = github.endpoint + "/repos/" + owner + "/" + repo;
                    const dataType = "DELETE";
                    const a = (d)=>{
                        box.remove();
                        console.log(d);
                        resolve(d);
                    }
                    const b = (error)=>{
                        console.log(error);
                        alert(error.message.message);
                        reject(error);
                    }
                    const settings = {
                        dataType
                    };
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    console.log({
                        settings
                    });
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }
        }
        ,
        generate: (params,settings)=>{
            if (settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        const template_owner = params["template_owner"];
                        const template_repo = params["template_repo"];
                        const url = github.endpoint + "/repos/" + template_owner + "/" + template_repo + "/generate";
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            const data = JSON.parse(d);
                            resolve(data);
                        }
                        const b = (error)=>{
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log({
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            }
        }
    },
    search: {
        code: (query)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/search/code?" + query;
                const a = (d)=>{
                    const data = JSON.parse(d);
                    console.log({
                        data
                    });
                    resolve(data.items);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const settings = {};
                settings.cache = "reload";
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                console.log({
                    settings
                });
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
        ,
        repositories: (query)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/search/repositories?" + query;
                const a = (d)=>{
                    const data = JSON.parse(d);
                    console.log({
                        data
                    });
                    resolve(data.items);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const settings = {};
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                console.log({
                    settings
                });
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
    },
    user: {
        get: ()=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/user";
                const a = (d)=>{
                    const data = JSON.parse(d);
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    //alert(error.message.message);
                    reject(error);
                }
                const settings = {};
                const accessToken = localStorage.githubAccessToken;
                accessToken ? settings.headers = {
                    Accept: "application/vnd.github+json",
                    Authorization: "token " + accessToken
                } : null;
                ajax(url, settings).then(a).catch(b);
            }
            );
        }
        ,
        repos: (params,settings)=>{
            var params = params ? params : {};
            var settings = settings ? settings : {};
            console.log(params, settings);
            if (settings.dataType) {
                if (settings.dataType === "POST") {
                    return new Promise((resolve,reject)=>{
                        const url = github.endpoint + "/user/repos";
                        const data = settings.data;
                        const dataType = settings.dataType;
                        const a = (d)=>{
                            console.log(766, {
                                d
                            });
                            resolve(d);
                        }
                        const b = (error)=>{
                            console.log(770, {
                                error
                            });
                            console.log(error);
                            reject(error);
                        }
                        const accessToken = localStorage.githubAccessToken;
                        accessToken ? settings.headers = {
                            Accept: "application/vnd.github+json",
                            Authorization: "token " + accessToken
                        } : null;
                        console.log(777, {
                            url,
                            settings
                        });
                        ajax(url, settings).then(a).catch(b);
                    }
                    );
                }
            } else {
                return new Promise((resolve,reject)=>{
                    console.log(params.query);
                    const query = params.query ? "?" + new URLSearchParams(params.query).toString() : "";
                    const url = github.endpoint + "/user/repos" + query;
                    const a = (d)=>{
                        const data = JSON.parse(d);
                        resolve(data);
                    }
                    const b = (error)=>{
                        console.log(error);
                        reject(error);
                    }
                    settings.cache = "reload";
                    const accessToken = localStorage.githubAccessToken;
                    accessToken ? settings.headers = {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    } : null;
                    console.log(url, settings);
                    ajax(url, settings).then(a).catch(b);
                }
                );
            }
        }
    }
}
window.github.crud = {};
window.github.crud.create = async(event)=>{
    var row = [];
    event.preventDefault();
    var form = event.target;
    var value = form.find('[type="text"]').value;
    //alert(value);

    if (0 < 1 && value.length > 0) {
        const user = await github.user.get();
        const fix = value.toLowerCase();
        const filename = "page." + fix.split(' ').join('-') + ".html";

        const message = "Add " + value + " to Posts";
        const content = "";

        var rte = rout.ed.dir(route.path);
        rte.splice(0, 4);

        event.target.closest('form').find('[type="submit"]').removeAttribute('disabled');
        event.target.closest('form').find('[data-submit]').classList.remove('opacity-50pct');

        var page = (rte.length > 0 ? "/" : "") + rte.join('/') + "/" + fix.split(' ').join('-') + "/";
        var path = (rte.length > 0 ? "/" : "") + rte.join('/') + "/" + fix.split(' ').join('-') + "/";
        var row = {
            slug: value.replaceAll(' ', '-').replaceAll(/[\u0250-\ue007]/g, '').replaceAll(/\W/g, "").toLowerCase(),
            title: value
        };
        var sha = null;

        try {
            var data = await github.repos.contents({
                owner: user.login,
                repo: GET[1],
                path: "/raw/posts/posts.json"
            });
            var sha = data.sha;
            var j = JSON.parse(atob(data.content));
            var json = JSON.parse(atob(data.content));
            json.push(row);
        } catch (e) {
            var j = [];
            var json = [row];
        }
        rows = Array.from(new Set(json.map(e=>JSON.stringify(e)))).map(e=>JSON.parse(e));
        var inc = j.some(item=>(JSON.stringify(item) === JSON.stringify(row)));
        var str = JSON.stringify(rows, null, 4);

        inc ? alert("This item already exists.") : github.repos.contents({
            owner: user.login,
            repo: GET[1],
            path: "/raw/posts/posts.json"
        }, {
            data: JSON.stringify({
                content: btoa(unescape(encodeURIComponent(str))),
                message,
                sha
            }),
            dataType: "PUT"
        }).then(()=>{
            "/dashboard/:get/posts/".router()
            event.target.closest('form').find('[type="submit"]').setAttribute('disabled', true);
            event.target.closest('form').find('[data-submit]').classList.add('opacity-50pct');
        }
        ).catch(e=>{
            console.log(e);
            0 > 1 ? "/dashboard/:get/merch/".router().then(modal.alert({
                body: "There was an error creating this page.",
                submit: "OK",
                title: "Error"
            })) : null;
        }
        );

    }
}
window.github.crud.read = ()=>{}
window.github.crud.update = async(target)=>{
    var user = await github.user.get();
    var card = target.closest('card');
    var owner = user.login;
    var repo = GET[1];
    var theme = card.find('box text').textContent;
    if (theme) {
        const callBack = async()=>{

            //alert("Installing theme");

            //DATA
            window.source = {};
            window.tree = [];

            var params = {
                branch: "main",
                owner,
                repo
            }
            var s = (data)=>{
                return data;
            }
            var settings = {
                dataType: "GET"
            };
            var refs = await github.database.references(params, settings).then(s);
            var sha = refs.object.sha;
            console.log("references", {
                refs
            });

            //FILES
            var params = {
                owner: "dompad",
                repo: "preview",
                path: "/" + theme + "/raw/files"
            }
            var a = async(data)=>{
                var content = [];
                if (data.length > 0) {
                    var d = 0;
                    do {
                        var row = data[d];
                        if (row.type === "file") {
                            var name = row.name;
                            var path = row.path;
                            var html = await github.repos.contents({
                                owner: "dompad",
                                repo: "preview",
                                path
                            }, {});
                            content[d] = {
                                content: atob(html.content),
                                name,
                                path
                            };
                            //console.log("pages", { html, d, row });
                        }
                        d++;
                    } while (d < data.length);
                }
                return content;
            }
            var asset = await github.repos.contents(params, {}).then(a);
            window.source = asset;

            //BLOBS
            var copy = source.copy;
            var keys = Object.keys(copy);
            var resources = {};
            if (keys.length > 0) {
                var c = 0;
                var t = 0;
                var values = Object.values(copy);
                do {
                    var key = keys[c];
                    var value = values[c];
                    if (value.length > 0) {
                        var v = 0;
                        do {
                            var val = value[v];
                            var content = btoa(val.content);
                            var data = {
                                content
                            };
                            var params = {
                                owner,
                                repo
                            };
                            var settings = {
                                data: JSON.stringify({
                                    content: val.content
                                }),
                                dataType: "POST"
                            };

                            var b = (data)=>{
                                return data;
                            }
                            var bb = (error)=>{
                                alert("Blob failed!");
                            }
                            var blob = await github.database.blobs(params, settings).then(b).catch(bb);

                            var path = "raw/" + key + "/" + val.name;

                            resources[path] = blob;
                            var mode = "100644";
                            var type = "blob";
                            tree[t] = {
                                path,
                                mode: "100644",
                                type: "blob",
                                sha: blob.sha
                            };

                            var rs = [{
                                path,
                                blob
                            }, {
                                key,
                                val
                            }, {
                                params,
                                settings
                            }];

                            console.log(t + " resource: " + path, rs);
                            t++;
                            v++;
                        } while (v < value.length)
                    }

                    c++;
                } while (c < keys.length);
                console.log("resources", {
                    resources,
                    tree
                });
            }

            //TREE
            var params = {
                owner,
                path: "/raw",
                repo,
                sha
            };
            var settings = {
                dataType: "GET"
            };
            var t = (data)=>{
                return data;
            }
            var tt = (error)=>{}
            var trees = await github.database.trees(params, settings).then(t).catch(tt);
            var raw = trees.tree.filter(row=>row.path === "style")[0];
            tree = raw ? tree : trees.tree.concat(tree);
            var base_tree = raw ? raw.sha : null;
            console.log("trees: " + settings.dataType, {
                raw,
                trees,
                tree
            });

            var params = {
                owner,
                repo
            };
            var settings = {
                data: JSON.stringify({
                    "base_tree": base_tree,
                    "tree": tree
                }),
                dataType: "POST"
            };
            var t = (data)=>{
                return data;
            }
            var tt = (error)=>{}
            var trees = await github.database.trees(params, settings).then(t).catch(tt);
            console.log("trees: " + settings.dataType, {
                sha: trees.sha,
                tree,
                trees
            });

            //COMMIT
            var params = {
                owner,
                repo
            };
            var data = JSON.stringify({
                "message": "Install Template",
                "parents": [refs.object.sha],
                "tree": trees.sha
            });
            var settings = {
                data,
                dataType: "POST"
            };
            var c = (data)=>{
                return data;
            }
            var cc = (error)=>{}
            //var commits = await github.database.commits(params, settings).then(t).catch(tt);
            console.log("commits: " + settings.dataType, {
                commits,
                sha: commits.sha
            });

            //REFERENCES
            var params = {
                branch: "main",
                owner,
                repo
            }
            var s = (data)=>{
                return data;
            }
            var settings = {
                data: JSON.stringify({
                    force: true,
                    sha: commits.sha
                }),
                dataType: "PATCH"
            };
            //var refs = await github.database.references(params, settings).then(s);
            //var sha = refs.object.sha;
            console.log("references", {
                refs
            });

            //"/dashboard/:get/build/".router();
        }
        var confirm = await modal.confirm({
            title: theme.capitalize(),
            body: "Are you sure you want to install this template?"
        }, ["Cancel", "Install"], callBack);
        if (confirm) {
            callBack()
        }
    }

}
window.github.crud.delete = ()=>{}
