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

// класс элемента списка товаров
class GoodsItem {
  constructor(id = 0, title = "Без имени", price = "") {
    this.id = id;
    this.title = title;
    this.price = price;
  }
  render() {
    return `<div class="goods-item">
    <img src="photo.png" alt="product" class="img-product">
    <h3>${this.title}</h3>
    <p>${this.price} руб.</p>
    <button class="button-item">Добавить</button>
  </div>`;  
  }
  getId() {
    return this.id;
  }
}

// класс списка товаров
class GoodsList {
  constructor() {
    this.goods = []
  }
  fetchGoods() {
    return makeGETRequest(`${API_URL}/catalogData.json`);
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
  setGoods(newGoods) {
    this.goods = newGoods;
  }
}

// класс корзины (наследуется от списка товаров)
class Cart extends GoodsList {
  add(cartItem) {                             //добавляем новый товар в корзину
    if (findIndex(cartItem.getId()) < 0) {    //если его там нет
      this.goods.push(cartItem);
    }
  }
  update() {                                   //получаем данные с json
    makeGETRequest(`${API_URL}/getBasket.json`)
    .then(
      response => {
        let obj = JSON.parse(response);
        for (let variable of obj.contents) {
          let cartItem = new CartItem(variable.id_product, variable.product_name, variable.price, variable.quantity);
          this.goods.push(cartItem);
        }
        console.log(this.goods);
      },
      error => alert(`Ошибка: ${error}`)
    );
  }
  remove(id) {                            //удаляем товар по id
    let index = findIndex(id);
    if (index > -1) {
      this.goods.splice(index, 1);
    }
  }
  findIndex(id) {                       // ищем индекс товара по id
    let index = this.goods.findIndex( item => item.id == id );
  }
  updateCount(id, count) {              //обновляем кол-во товара по id
    let index = findIndex(id);
    if (index > -1) {
      this.goods[index].setCount(count);
    }
  }
}

const cart = new Cart();   //создали объект
cart.update();            // для обновления корзины

// класс элемента корзины (наследуется от элемента списка товаров)
class CartItem extends GoodsItem {
  constructor( id = 0, title = "Без имени", price = "", count = 1) {
    super(id, title, price);
    this.count = count;
  }
  getCount() {
    return this.count;
  }
  setCount(newCount) {
    this.count = newCount;
  }
}

const list = new GoodsList();
list.fetchGoods().then(
  response => {
    list.setGoods(JSON.parse(response));
    list.render();
  },
  error => alert(`Ошибка: ${error}`)
);