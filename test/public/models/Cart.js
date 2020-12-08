function Cart() {
    this.cartData = {};

    this.listeners = [];
}

Cart.prototype.addListener = function (listener) {
    this.listeners.push(listener);
}

Cart.prototype.notify = function (event, data) {
    for(const listener of this.listeners){
        listener(event, data);
    }
}

Cart.prototype.setData = function (cartData) {
    this.cartData = cartData;
    this.notify("cartData", cartData);
}

Cart.prototype.render = function () {
    let product_list = [];
    try {
        Object.keys(this.cartData.products).map(key => product_list = [...product_list, {
            name: key,
            quantity: this.cartData.products[key].quantity
        }]);
    } catch (e) {
        console.error("Coud not list products");
    }

    let html = '';
    product_list.map(product => {
        html += `<li>${product.name} - Quantity : ${product.quantity}</li>`
    });
    return html;
}

Cart.prototype.add_product = async function (productToAdd) {
    // TODO use an env variable here, but must be bundled to do so with webpack for example
    const fetchToAPI = await fetch('http://localhost:3000/cart', {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({productId: productToAdd})
    }).catch(error => console.error('ERROR API ', error.message));

    if (!fetchToAPI.ok) {
        console.error('Error Fetch API');
        return;
    }
    const newCartData = await fetchToAPI.json();
    this.setData(newCartData);
}

Cart.prototype.init = async function(){
    const fetchDataFromApi = await fetch('http://localhost:3000/cart').catch(error => console.error('Error API ', error.message));

    if (!fetchDataFromApi.ok) {
        console.error('Error fetch API');
        return;
    }

    const cartData = await fetchDataFromApi.json();
    this.setData(cartData);
}
