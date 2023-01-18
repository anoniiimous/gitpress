self.addEventListener('fetch', function(event) {
    const request = event.request;
    const settings = {
        headers: {"Authorization": "Bearer XXX-my-token"},
        mode: "cors"
    };
    const newRequest = new Request(event.request);
    console.log('sw.js', 8, {});
    return fetch(newRequest);
})