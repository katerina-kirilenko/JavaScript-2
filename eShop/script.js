const API_URL = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses"

function getXhr() {
  if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    return new ActiveXObject("Microsoft.XMLHTTP");
  }
}

Vue.component ("search-form", {
    data: () => ({
        searchLine: ""
    }),
    methods: {
        onSubmit () {
            this.$emit("submit", this.searchLine)
        }
    },
    template: `<form class="search-form" @submit.prevent="onSubmit">
        <input class="goods-search" type="text" v-model.trim="searchLine">
        <button type="submit" class="search-button">Искать</button>
    </form>`
});

Vue.component("goods-item", {
    props: ["good"],
    template: `<div class="goods-item">
        <img src="photo.png" alt="product" class="img-product">
        <h3>{{ good.product_name }}</h3>
        <p>{{ good.price }} руб.</p>
    </div>`,
});

Vue.component("goods-list", {
    props: ["goods"],
    template: `<div class="goods-list">
        <goods-item v-for="good in goods" :good="good" :key="good.id_product"></goods-item>
    </div>`,
});

Vue.component("cart", {
    methods: {
        onClose() {
            this.$emit('close')
        }
    },
    template: `
      <div id="blackout" >
        <div id="cart">
          <p>Товары в вашей корзине:</p>
          <p class="close" @click="onClose">✖</p>
        </div>
      </div>`,
});

Vue.component('error-message', {
    props: ["message"],
    methods: {
        setCloseTimeout() {
            setTimeout(() => {
                this.$emit('close')
            }, 3000)
        }
    },
    mounted() {
      this.setCloseTimeout();
    },
    template: `<div class="error-message">{{ message }}</div>`
});

new Vue({
  el: '#app',
  data: {
    goods: [], // все товары
    filteredGoods: [], // найденные товары
    isVisibleCart: false,
    isVisibleError: false,
    message: ""
  },
  computed: {
      noData() {
          return this.filteredGoods.length === 0;
      }
  },
  methods: {
    makeGETRequest(url) {
      return new Promise((resolve, reject) => {
        const xhr = getXhr();
        xhr.onreadystatechange = function () {
          if (xhr.readyState !== 4) return;

          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText))
          } else {
            reject("Request error")
          }
        };

        xhr.open("GET", url);
        xhr.send();
      })
    },
    filterGoods(searchLine) {
      const regexp = new RegExp(searchLine, "i");
      this.filteredGoods = this.goods.filter(good => regexp.test(good.product_name));
    },
    showCart() {
      this.isVisibleCart = true;
    },
    hideCart() {
      this.isVisibleCart = false;
    },
    showError() {
      this.isVisibleError = true;
    },
    hideError() {
      this.isVisibleError = false;
    },
  },
  mounted() {
    this.makeGETRequest(`${API_URL}/catalogData.json`).then((goods) => {
      this.goods = goods;
      this.filteredGoods = goods;
    }).catch((err) => {
      this.message = err;
      this.showError();
    })
  }
});

/*
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
  addEvents(cart) {
    const buttons = [...document.querySelectorAll('.button-item')];
    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const id = e.target.getAttribute("data-id");
        const product = this.goods.find(item => item.id_product === id);
        cart.add(product);
      })
    })
  }
  findIndex(id) {                       
    let index = this.goods.findIndex( item => item.id_product === id );
  }
  calcPrice() {
    return this.goods.reduce((sum, curr) => {
      if (!curr.price) return sum;
      return sum + curr.price;
    }, 0)
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
});*/

