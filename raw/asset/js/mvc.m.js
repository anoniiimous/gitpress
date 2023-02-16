window.mvc ? null : (window.mvc = {});

window.mvc.m ? null : (window.mvc.m = model = {
    error: {
        image: e=>{
            console.log('model.error.image', e);
            e.remove();
        }
    }
});