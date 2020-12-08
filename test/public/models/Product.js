function Product(product) {

    this.id = product.id;
    this.label = product.label;
    this.brand = product.brand;
    this.img = product.img;
    this.price = product.price;
    this.discount = product.discount;
    this.discount_type = product.discount_type;

}


Product.prototype.render = function () {

    const html = `
         <div class="products">
                <img src="${this.img}" alt="" class="product_img">
                <div class="product_title">${this.id} - ${this.brand}</div>
                <div class="product_price_container">
                    ${this.discount ? `<div class="product_discount">${this.discount} %</div>` : ''}
                    <div class="product_price ${this.discount ? 'line': ''}">${this.price} €</div>
                    ${this.discount ? `<div class="product_discounted_price">${this.price * this.discount / 100} €</div>` : ''}
                </div>
                <button class="product_button_add" id="${this.id}">Add to cart</button>
            </div>`;

    return html;
};
