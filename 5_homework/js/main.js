// 'use strict';
const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({// объект класса Vue
    el: '#app',// синхронизируемся с элементом div c id=app
    data: {//глобальные свойства
        userSearch: '',//свойство отвечает за фильтр
        showCart: false,//свойство отвечает за показ товаров корзины
        catalogUrl: '/catalogData.json',//ссылка на файл, для работы с товароми каталога
        cartUrl: '/getBasket.json',//ссылка на файл, для работы с товароми корзины
        cartItems: [],//массив товаров корзины
        filtered: [],//массив фильтра
        imgCart: 'https://via.placeholder.com/100x50',
        products: [],//массив-все товары каталога
        imgProduct: 'https://via.placeholder.com/200x150',
    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then(result => result.json())//успешно
                .catch(error => console.log(error))//ошибка
        },
        addProduct(item) {
            this.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        let find = this.cartItems.find(el => el.id_product === item.id_product);
                        if (find) {
                            find.quantity++;
                        } else {
                            const prod = Object.assign({ quantity: 1 }, item);//создание нового объекта на основе двух, указанных в параметрах
                            this.cartItems.push(prod)
                        }
                    }
                })
        },
        remove(item) {
            this.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        if (item.quantity > 1) {
                            item.quantity--;
                        } else {
                            this.cartItems.splice(this.cartItems.indexOf(item), 1);
                        }
                    }
                })
        },
        filter() {
            let regexp = new RegExp(this.userSearch, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
    mounted() {// метод mounted заполняет массивы товарами
        this.getJson(`${API + this.cartUrl}`)//парсим файл для получения товаров корзины
            .then(data => {
                for (let item of data.contents) {
                    this.cartItems.push(item);//массив корзины
                }
            });
        this.getJson(`${API + this.catalogUrl}`)//парсим файл отвечающий за каталог товаров
            .then(data => {
                for (let item of data) {
                    this.$data.products.push(item);//добовляем товары в массив products($data-не обязательный параметр, в данном случае)
                    this.$data.filtered.push(item);//добовляем товары в массив filtered
                }
            });
        this.getJson(`getProducts.json`)//парсим локальный файл с двумя товарами
            .then(data => {
                for (let item of data) {
                    this.products.push(item);
                    this.filtered.push(item);
                }
            })
    }
}); 