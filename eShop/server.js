const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

const addToStats = (type, productName) => {
  fs.readFile('./stats.json', 'utf-8', (err, data) => {
    if (err) {
      res.send('{"result": 0}');
      return;
    }
    const stats = JSON.parse(data);

    stats.push({
      type,
      product_name: productName,
      date: new Date(),
    });

    fs.writeFile('./stats.json', JSON.stringify(stats), (err) => {
      if (err) {
        return false;
      } else {
        return true;
      }
    })
  });
}

app.use(express.static('.'));
app.use(bodyParser.json());

app.get('/catalogData', (req, res) => {
  fs.readFile('./catalog.json', 'utf-8', (err, data) => {
    res.send(data);
  });
});

app.post('/addToCart', (req, res) => {
  fs.readFile('./cart.json', 'utf-8', (err, data) => {
    if (err) {
      res.send('{"result": 0}');
      return;
    }
    const cart = JSON.parse(data);
    const item = req.body;

    cart.push(item);

    fs.writeFile('./cart.json', JSON.stringify(cart), (err) => {
      if (err) {
        res.send('{"result": 0}');
      } else {
        res.send('{"result": 1}');
        addToStats('add', item.product_name);
      }
    })
  });
});

app.delete('/removeFromCart', (req, res) => {
  fs.readFile('./cart.json', 'utf-8', (err, data) => {
    if (err) {
      res.send('{"result": 0}');
      return;
    }
    const cart = JSON.parse(data);
    const item = req.body;
    const newCart = cart.filter(cartItem => cartItem.product_name != item.product_name);

    fs.writeFile('./cart.json', JSON.stringify(newCart), (err) => {
      if (err) {
        res.send('{"result": 0}');
      } else {
        res.send('{"result": 1}');
        addToStats('delete', item.product_name);
      }
    })
  });
});

app.listen(3000, function() {
  console.log('Server is running on port 3000');
});