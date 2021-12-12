// конструкция на основе ООП
'use strict';
/**
 * класс товаров
 */
class ProductsList {
    constructor(container = '.products') {// в какой элемент из верстки мы вставляем наши товары
        this.container = container;
        this.goods = [];//каталог товаров
        this.allProducts = [];
        this._fetchProducts();
    }
    /**
    *нижнее подчеркивание-рекомендательный характер, не использовать метод вне текущего класса 
    наполнение goods-товарами
    */
    _fetchProducts() {
        this.goods = [
            { id: 1, title: 'Notebook', price: 2000 },
            { id: 2, title: 'Mouse', price: 20 },
            { id: 3, title: 'Keyboard', price: 200 },
            { id: 4, title: 'Gamepad', price: 20 },
        ];
    }

    /**
     * вывод товаров нв страницу
     */
    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObj = new ProductItem(product);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render())
        }
    }

    getSum() {
        // сумма всех товаров-первый вариант
        let s = 0;
        // this.goods.forEach(item => {
        //     s += item.price;
        // })
        // alert(s);

        // сумма всех товаров-второй вариант
        for (let product of this.goods) {
            s += product.price;
        }
        alert(s);

        // сумма всех товаров-третий вариант
        //reduse используется для последовательной обработки каждого элемента массива с сохранением промежуточного результата
        // let res = this.allProducts.reduce((s, item) => s + item.price, 0);
        // alert(res);
    }
}
/**
 * товар каталога
 */
class ProductItem {
    constructor(product, img = 'https://via.placeholder.com/200x150') {
        this.title = product.title;
        this.price = product.price;
        this.id = product.id;
        this.img = img;
    }
    //
    /**
     * верстка для каждого товара тег <div class="products">
     * @returns 
     */
    render() {
        return `<div class='product-item' data-id='${this.id}'>
                       <img src='${this.img}' alt='Some img'>
                         <h3>${this.title}</h3>
                         <p>${this.price}</p>
                         <button class='buy-btn'>Купить</button>
                     </div>`
    }
}
/**
 *объект класса каталог 
 */
let list = new ProductsList();
list.render();
list.getSum();

class Basket {
    addGood() {

    }
    removeGood() {

    }
    changeGood() {

    }
    render() {

    }
}

class ElemBasket {
    render() {

    }
}


