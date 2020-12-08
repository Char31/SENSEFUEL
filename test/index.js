const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config()

const Database = require("./database");
const database = new Database().getInstance()

app.use(bodyParser.json());
app.use(cors());

app.use(express.static('public'));

//TODO express error handling

const asyncMiddleware = (fn) =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch((e) => {
                console.error("Error in async :", e);
                if (!res.headersSent) {
                    res.sendStatus(500);
                }
                else {
                    next();
                }
            });
    };


app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(fs.readFileSync('./public/views/page.html'));
    res.end();
});

app.get('/products', (req, res) => {
    // TODO products should come from db
    res.send(fs.readFileSync('products.json'));
});

app.get('/cart', asyncMiddleware(async (req, res) => {
    try {
        const cart = await database.getOne()
        res.send(cart)
    } catch (e) {
        res.send({
            cart: { products: {}}
        })
    }
}));

//TODO sanitize input
app.post('/cart', asyncMiddleware(async (req, res) => {
    console.log('received cart data', req.body);

//    cart format: {"products":{"ba2":{"quantity":1}}}
    let cart;
    try {
        cart = await database.getOne();
    } catch (e) {
        cart = {
            products: {
                [req.body.productId]: {
                    quantity: 0
                }
            }
        };
    }

    if (cart.products.hasOwnProperty(req.body.productId)) {
        cart.products[req.body.productId].quantity++;
    } else {
        cart.products[req.body.productId] = {quantity: 1}
    }
    await database.upsert(cart);

    res.send(cart);
}));

app.listen(3000, function () {
    console.log('App listening on port 3000')
});
