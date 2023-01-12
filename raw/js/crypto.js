window.Crypto = crypt = cx = {
  uid: {
    create: x => {
      if (window.crypto || window.msCrypto) {
        var array = new Uint32Array(x);
        window.crypto.getRandomValues(array);
        array.length === 1 ? array = array[0] : null;
        return array;
      } else {
        throw new Error("Your browser can't generate secure random numbers");
      }
    }
  }
};