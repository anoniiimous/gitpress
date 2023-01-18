self.addEventListener('fetch', function(event) {
    const request = event.request;
    const newRequest = new Request(event.request, {
        headers: {"Authorization": "Bearer XXX-my-token"},
        mode: "cors"
    });
    return fetch(newRequest);
})