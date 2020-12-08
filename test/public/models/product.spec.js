describe('Product tests', function () {
    it('Should instanciate a new product with data form the first in data file and should be of type product and get an ID equal to tn1', function () {
        const product = new Product(data.products.parts[0]);
        chai.expect(product instanceof Product).to.equal(true);
        chai.expect(product.id).to.equal(data.products.parts[0].id)
    });

    it('should render an HTML inside a div', () => {
        const product = new Product(data.products.parts[0]);
        console.log(product.render())
        chai.expect(product.render().indexOf('<div class="products">')).to.equal(10)
    });
});
