onmessage = function(e) {
    console.log('Worker: Message received from main script', e);

    var host = 'https://raw.githubusercontent.com';
    var resource = '/anoniiimous/www/main/icon.svg';
    var token = e.data[1];

    var url = host + resource;
    var settings = {
        headers: {
            'Accept': 'application/vnd.github.v3.raw',
            'Access-Control-Allow-Origin': '*',
            'Authorization': 'token ' + token
        },
        mode: 'cors'
    };
    const a = (data)=>{
        console.log({data});
        //resolve(data);
    }
    fetch(url, settings).then(a)
}