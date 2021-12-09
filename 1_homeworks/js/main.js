'use strict';
const products = [
    { id: 1, title: 'Notebook', price: 2000 },
    { id: 2, title: 'Mouse', price: 20 },
    { id: 3, title: 'Keyboard', price: 200 },
    { id: 4, title: 'Gamepad', price: 20 },
];
//Функуция для формирования верстки каждого товара
//Добавить в выводе изображение
const renderProduct = (product, img = 'https://via.placeholder.com/200x150') => {
    return `<div class='product-item'>
                <img src='${img}' alt='${product.title}'>
                <h3>${product.title}</h3>
                <p>${product.price}</p>
                <button class='buy-btn'>Купить</button>
            </div>`
};
const renderPage = list => {
    document.querySelector('.products').innerHTML = list.map(product =>
        renderProduct(product)).join('');// join('')- переопределяем join, вместо ','(по умолчанию) ставим -''(пустые кавычки)
};

renderPage(products);
