/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var Storage = require('../locStorage');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");
var $pizzas_quantity = $(".order-amount");

var $sum = $(".total-sum");

var sum = 0;

var $empty_cart_div = $(".empty-cart");
var $sum_labels = $(".order-labels");
var $order_button = $(".order-button");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок

    var pizza_index = pizzaIndex(pizza, size);
    if(pizza_index >= 0){
        Cart[pizza_index].quantity += 1;
    }else{
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}
function pizzaIndex(pizza, size){
    var i = 0;
    for(i = 0; i<Cart.length; i++){
        if(JSON.stringify(Cart[i].pizza) === JSON.stringify(pizza) && Cart[i].size === size) {
            return i;
        }
    }
    return -1;
}
function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    var index = pizzaIndex(cart_item.pizza, cart_item.size);
    if(index !== -1){
        Cart.splice(index, 1);
    }
    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки

    var saved_orders = Storage.get('cart');
    if(saved_orders){
        Cart = saved_orders;
    }
    updateCart();
    initializeButtons();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику

    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Очищаємо старі піци в кошику
    $cart.html("");
    clearSum();

    if(Cart.length === 0){
        $cart.append($empty_cart_div);
        $sum_labels.addClass("invisible");
        $order_button.addClass("disabled");
    }else{
        $sum_labels.removeClass("invisible");
        $order_button.removeClass("disabled");
    }

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;

            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".minus").click(function(){
            //Зменшуємо кількість замовлених піц
            if(cart_item.quantity>1) {
                cart_item.quantity -= 1;
                updateCart();
            }
            else
                removeFromCart(cart_item);
        });
        $node.find(".cross").click(function(){
            removeFromCart(cart_item);
        });

        $cart.append($node);
        addToSum(get_cart_pizza_price(cart_item)*cart_item.quantity);
    }

    Cart.forEach(showOnePizzaInCart);
    $pizzas_quantity.text(Cart.length);
    Storage.set('cart', Cart);
}
function clearCart(){
    Cart = [];
    updateCart();
}

function initializeButtons(){
    var clearButton = $(".right-panel .top-section .label-section .clear");
    clearButton.click(function(){
        clearCart();
    });
}

function get_cart_pizza_price(cart_item){
    if(cart_item.size === PizzaSize.Big){
        return cart_item.pizza.big_size.price;
    }else {
        return cart_item.pizza.small_size.price;
    }
}

function clearSum(){
    sum = 0;
    $sum.text(sum);
}

function addToSum(add_price){
    sum += add_price;
    $sum.text(sum);
}



exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;