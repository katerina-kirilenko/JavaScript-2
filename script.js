const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses"

function getXhr() {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    return new ActiveXObject("Microsoft.XMLHTTP");
  }
}

function makeGETRequest(url) {
  return new Promise((resolve, reject) => {
    const xhr = getXhr();
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      if (xhr.status === 200) {
        resolve(xhr.responseText)
      } else {
        reject("Request error")
      }
    };

    xhr.open("GET", url);
    xhr.send();
  })
}

// класс элемента списка товаров
class GoodsItem {
  constructor(id, title = "Без имени", price = "") {
    this.id = id;
    this.title = title;
    this.price = price;
  }
  render() {
    return `<div class="goods-item">
    <img src="photo.png" alt="product" class="img-product">
    <h3>${this.title}</h3>
    <p>${this.price} руб.</p>
    <button data-id="${this.id}" class="button-item">Добавить</button>
  </div>`;  
  }
}

// класс списка товаров
class GoodsList {
  constructor() {
    this.goods = [];
    this.filteredGoods = [];
  }
  fetchGoods() {
    return makeGETRequest(`${API_URL}/catalogData.json`).then((goods) => {
      this.goods = JSON.parse(goods)
      this.filteredGoods = JSON.parse(goods)
    }).catch((err) => console.error(err));
  }
  filterGoods(value) {
    const regexp = new RegExp(value, "i")
    this.filteredGoods = this.goods.filter(good =>  regexp.test(good.product_name));
    this.render();
  }
  addEvents(cart) {
    const buttons = [...document.querySelectorAll('.button-item')]
    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const id = e.target.getAttribute("data-id");
        const product = this.goods.find(item => item.id_product == id);
        cart.add(product);
      })
    })
  }
  findIndex(id) {                       
    let index = this.goods.findIndex( item => item.id_product == id );
  }
  calcPrice() {
    return this.goods.reduce((sum, curr) => {
      if (!curr.price) return sum;
      return sum + curr.price;
    }, 0)
  }
  render(cart) {
    const listHtml = this.filteredGoods.reduce((renderString, good) => {
      const goodItem = new GoodsItem(good.id_product, good.product_name, good.price);
      return renderString += goodItem.render();
    }, '');
    document.querySelector('.goods-list').innerHTML = listHtml;
    this.addEvents(cart);
  }
}

// класс корзины (наследуется от списка товаров)
class Cart extends GoodsList {
  add(product) {
    makeGETRequest(`${API_URL}/addToBasket.json`).then(() => {
      if (this.findIndex(product.id_product) < 0) {    
        cart.goods.push(product);
      }
      console.log(product);
    }).catch(err => console.error(err))
  }
  update(index, newCount) {
    this.goods[index].setCount(newCount)
  }
  remove(id) {
    makeGETRequest(`${API_URL}/deleteFromBasket.json`).then(() => {
      const index = this.findIndex(id);
      this.goods.splice(index, 1);
    }).catch(err => console.error(err));
  } 
}

// класс элемента корзины (наследуется от элемента списка товаров)
class CartItem extends GoodsItem {
  constructor( id, title = "Без имени", price = "", count = 1 ) {
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
const cart = new Cart();
list.fetchGoods().then(() => {
  list.render(cart);
}).catch((err) => console.error(err));

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.goods-search');
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = searchInput.value;
  list.filterGoods(value);
})

