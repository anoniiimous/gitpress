window.github = {
    endpoint: "https://api.github.com",
    user: {
        repos: (settings)=>{
            const url = github.endpoint + "/user/repos";
            const data = settings.data;
            const dataType = settings.dataType;
            const a = (d)=>{
                const data = JSON.parse(d);
                console.log({data},data.name);
                const name = data.name;
                ('/dashboard/' + name + '/').router();
            }
            const b = (error)=>{
                console.log(error);
            }
            const accessToken = localStorage.githubAccessToken;
            accessToken ? settings.headers = {
                Accept: "application/vnd.github+json",
                Authorization: "token " + accessToken
            } : null;
            console.log({settings});
            ajax(url, settings).then(a).catch(b);
        }
    }
}
