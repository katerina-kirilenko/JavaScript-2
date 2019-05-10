class GoodsItem {
  constructor(title = "Без названия", price = 0) {
    this.title = title;
    this.price = price;
  }
  render() {
    return `<div class="goods-item">
    <img src="photo.png" alt="product" class="img-product">
    <h3>${this.title}</h3>
    <p>${this.price} руб.</p>
    <button class="button-item">Добавить</button>
  </div>` ;
  }
}

class GoodsList {
  constructor() {
    this.goods = [];  
  }
  fetchGoods() {
    this.goods = [
      { title: "Shirt", price: 150 },
      { title: "Socks", price: 50 },
      { title: "Jacket", price: 350 },
      { price: 250 },
      { title: "Shirt", price: 150 },
      { title: "Socks", price: 50 },
      { title: "Jacket", price: 350 },
      { title: "Shoes" }
    ];
  }
  render() {
    const listHtml = this.goods.reduce((renderString, good) => {
      const goodItem = new GoodsItem(good.title, good.price);
      return renderString += goodItem.render();
    }, '');
    document.querySelector('.goods-list').innerHTML = listHtml;
  }
}

const list = new GoodsList();
list.fetchGoods();
list.render();

class Basket {
  constructor() {
    this.goods = [];
  }
  addProduct(goodsItem) {
    this.goods.push(goodsItem);
  }
  removeProduct(goodsIndex) {
    this.goods.splice(goodsIndex);
  }
}

class BasketItem extends GoodsItem {
  
}