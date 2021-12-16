'use strict';
const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class List {//класс список товаров
    constructor(url, container, list = list2) {//list2-связи между классами
        this.container = container;
        this.list = list;
        this.url = url;
        this.goods = [];//массив товаров, пока пустой
        this.allProducts = [];//массив объектов, соответствующего класса
        this._init();
    }
    getJson(url) {
        return fetch(url ? url : `${API + this.url}`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }
    handleData(data) {
        this.goods = data;
        this.render();
    }
    calcSum() {
        return this.allProducts.reduce((accum, item) => accum += item.price, 0);
    }
    render() {
        console.log(this.constructor.name);
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            //console.log(this.constructor.name);
            const productObj = new this.list[this.constructor.name](product);
            console.log(productObj);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
    }
}



class Item {//класс товар
    constructor(el, img = 'https://via.placeholder.com/200x150') {
        this.product_name = el.product_name;
        this.price = el.price;
        this.id_product = el.id_product;
        this.img = img;
    }
    render() {//генерация товара для каталогов товаров
        return `<div class='product-item' data-id='${this.id_product}'>
                                <img src='${this.img}' alt='Some img'>
                                <div class='desc'>
                                  <h3>${this.product_name}</h3>
                                  <p>${this.price}</p>
                                  <button class='buy-btn'
                                  data-id='${this.id_product}'
                                  data-name='${this.product_name}'
                                  data-price='${this.price}'>Купить</button>
                              </div>
                              </div>`
    }
}

class ProductsList extends List {//класс каталог
    constructor(cart, container = '.products', url = '/catalogData.json') {
        super(url, container);//вызываем конструктор базового класса
        this.cart = cart;
        this.getJson()
            .then(data => this.handleData(data));//handleData-запускает отрисовку либо каталога товаров, либо списка
    }
    _init() {
        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('buy-btn')) {
                console.log(e.target);
                this.cart.addProduct(e.target);
            }
        });
    }
}



class ProductItem extends Item { }//товар каталога
/**
 * Цели конструктора каталога и корзины одни и те же:
 * 1.Регистрация событий по клику на кнопку Купить
 * 2.Заполнить массив товаров из файла JSON
 * 3.Вывод данных на странице, используя метод handleData, который заполняет глобальный
 *массив товаров и выводит их на странице, вызывая render 
 */

class Cart extends List {//класс корзина-список товаров корзины, наследуется от списка товаров
    constructor(container = '.cart-block', url = '/getBasket.json') {
        super(url, container);
        this.getJson()
            .then(data => {
                this.handleData(data.contents);//вывели все товары в корзине
            });
    }
    addProduct(element) {
        this.getJson(`${API}/addToBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if (find) {
                        find.quantity++;
                        this._updateCart(find);
                    } else {
                        let product = {
                            id_product: productId,
                            price: +element.dataset['price'],
                            product_name: element.dataset['name'],
                            quantity: 1
                        };
                        this.goods = [product];
                        this.render();
                    }
                } else {
                    alert('Доступ запрещен!');
                }
            })
    }
    removeProduct(element) {
        this.getJson(`${API}/deleteFromBasket.json`)
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if (find.quantity > 1) {
                        find.quantity--;
                        this._updateCart(find);
                    } else {
                        this.allProducts.splice(this.allProducts.indexOf(find), 1);
                        document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
                    }
                } else {
                    alert('Error');
                }
            });
    }
    _updateCart(product) {
        let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
        block.querySelector('.product-quantity').textContent = `Quantity:${product.quantity}`;
        block.querySelector('.product-price').textContent = `${product.quantity * product.price}`;
    }
    _init() {
        document.querySelector('.btn-cart').addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('invisible');
        });
        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('del-btn')) {
                this.removeProduct(e.target);
            }
        })
    }

}

class CartItem extends Item {//класс товар корзины(товар корзины и каталога-похожи, отличие-количество)
    constructor(el, img = 'https://via.placeholder.com/200x150') {
        super(el, img);
        this.quantity = el.quantity;
    }
    render() {
        return `<div class='cart-item' data-id='${this.id_product}'>
                    <div class='product-bio'>
                    <img src='${this.img}' alt='Some img'>
                    <div class='product-desc'>
                    <p class='product-title'>${this.product_name}</p>
                    <p class='product-quantity'>Quantity: ${this.quantity}</p>
                    <p class='product-single-price'>${this.price} each</p>
                    </div>
                    </div>
                    <div class='right-block'>
                    <p class='product-price'>${this.quantity * this.price}</p>
                    <button class='del-btn' data-id='${this.id_product}'>x</button>
                    </div>
                </div>`
    }
}
let list2 = {
    ProductsList: ProductItem,
    Cart: CartItem
};

let cart = new Cart();
let products = new ProductsList(cart);
/**
 * Если мы хотим использовать в классе методы другого класса, то удобнее всего в конструктор
 * передать объект класса, методы которого нам нужны в данном классе
 * products.getJson('getProducts.json').then(data=>products.handleData(data));
 */




















// class ProductsList {
//     constructor(container = '.products') {// в какой элемент из верстки мы вставляем наши товары
//         this.container = container;
//         this.goods = [];//каталог товаров
//         this.allProducts = [];
//         this._fetchProducts();
//     }
//     /**
//     *нижнее подчеркивание-рекомендательный характер, не использовать метод вне текущего класса
//     наполнение goods-товарами
//     */
//     _fetchProducts() {
//         this.goods = [
//             { id: 1, title: 'Notebook', price: 2000 },
//             { id: 2, title: 'Mouse', price: 20 },
//             { id: 3, title: 'Keyboard', price: 200 },
//             { id: 4, title: 'Gamepad', price: 20 },
//         ];
//     }

//     /**
//      * вывод товаров нв страницу
//      */
//     render() {
//         const block = document.querySelector(this.container);
//         for (let product of this.goods) {
//             const productObj = new ProductItem(product);
//             this.allProducts.push(productObj);
//             block.insertAdjacentHTML('beforeend', productObj.render())
//         }
//     }

//     getSum() {
//         // сумма всех товаров-первый вариант
//         let s = 0;
//         // this.goods.forEach(item => {
//         //     s += item.price;
//         // })
//         // alert(s);

//         // сумма всех товаров-второй вариант
//         for (let product of this.goods) {
//             s += product.price;
//         }
//         alert(s);

//         // сумма всех товаров-третий вариант
//         //reduse используется для последовательной обработки каждого элемента массива с сохранением промежуточного результата
//         // let res = this.allProducts.reduce((s, item) => s + item.price, 0);
//         // alert(res);
//     }
// }
// /**
//  * товар каталога
//  */
// class ProductItem {
//     constructor(product, img = 'https://via.placeholder.com/200x150') {
//         this.title = product.title;
//         this.price = product.price;
//         this.id = product.id;
//         this.img = img;
//     }
//     //
//     /**
//      * верстка для каждого товара тег <div class="products">
//      * @returns
//      */
//     render() {
//         return `<div class='product-item' data-id='${this.id}'>
//                        <img src='${this.img}' alt='Some img'>
//                          <h3>${this.title}</h3>
//                          <p>${this.price}</p>
//                          <button class='buy-btn'>Купить</button>
//                      </div>`
//     }
// }
// /**
//  *объект класса каталог
//  */
// let list = new ProductsList();
// list.render();
// list.getSum();

// class Basket {
//     addGood() {

//     }
//     removeGood() {

//     }
//     changeGood() {

//     }
//     render() {

//     }
// }

// class ElemBasket {
//     render() {

//     }
// }


