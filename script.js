const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses"

function makeGETRequest(url) {

  return new Promise( (resolve, reject) => {
    let xhr;

    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }  
    xhr.open("GET", url, true);

    xhr.onload = function() {
      if (this.status == 200) {
        resolve(this.response);
      } else {
        var error = new Error(this.statusText);
        error.code = this.status;
        reject(error);
      }
    };

    xhr.onerror = function() {
      reject(new Error("Network Error"));
    };

    xhr.send();
  });
}

class GoodsItem {
  constructor(title = "Без имени", price = "") {
    this.title = title;
    this.price = price;
  }
  render() {
    return `<div class="goods-item">
    <img src="photo.png" alt="product" class="img-product">
    <h3>${this.title}</h3>
    <p>${this.price} руб.</p>
    <button class="button-item">Добавить</button>
  </div>`;  }
}

class GoodsList {
  constructor() {
    this.goods = []
  }
  fetchGoods() {
    makeGETRequest(`${API_URL}/catalogData.json`)
    .then(
      response => {
        this.goods = JSON.parse(response);
        this.render();
      },
      error => alert(`Ошибка: ${error}`)
    );

  }
  calcPrice() {
    return this.goods.reduce((sum, curr) => {
      if (!curr.price) return sum;
      return sum + curr.price;
    }, 0)
  }
  render() {
    const listHtml = this.goods.reduce((renderString, good) => {
      const goodItem = new GoodsItem(good.product_name, good.price)
      return renderString += goodItem.render()
    }, '');
    document.querySelector('.goods-list').innerHTML = listHtml;
  }
}

class Cart extends GoodsList {
  add() {

  }
  update() {
    makeGETRequest(`${API_URL}/getBasket.json`)
    .then(
      response => {
        let obj = JSON.parse(response);
        for (let variable of obj.contents) {
          let cartItem = new CartItem(variable.product_name, variable.price, variable.quantity);
          this.goods.push(cartItem);
        }
        console.log(this.goods);
      },
      error => alert(`Ошибка: ${error}`)
    );
  }
  remove(index) {
    this.goods.splice(index, 1)
  }
}

const cart = new Cart();
cart.update();

class CartItem extends GoodsItem {
  constructor(title = "Без имени", price = "", count = 1) {
    super(title, price);
    this.count = count
  }
  getCount() {
    return this.count;
  }
  setCount(newCount) {
    this.count = newCount
  }
}

const list = new GoodsList();
list.fetchGoods();