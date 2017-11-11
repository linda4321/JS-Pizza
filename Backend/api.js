/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');

var LIQPAY_PUBLIC_KEY = "i86209130285";
var LIQPAY_PRIVATE_KEY = "JPAfU7kvAoYHERzJTRGyvXgmpN7oeqjwNpHlylg0";

var crypto	=	require('crypto');

function createDesctiption(data, sum){
    var sizes={
        small_size: "Мала",
        big_size: "Велика"
    };

    var res = "Замовлення піци: " + data.name + "\n";
    res += "Адреса доставки: " + data.address + "\n";
    res += "Телефон: " + data.tel + "\n";
    res += "Замовлення: \n";

    var pizza = data.ordered_pizza;
    pizza.forEach(function(pizza){
       res += "- " + pizza.quantity + "шт. ";
       res += "[" + sizes[pizza.size] + "] ";
       res += pizza.pizza.title + "\n"
    });

    res += "Разом " + sum + "грн";
    return res;
}

function countSum(pizzas){
    var sum = 0;
    pizzas.forEach(function(pizza_item){
       sum += pizza_item.quantity*pizza_item.pizza[pizza_item.size].price;
    });
    return sum;
}


function	sha1(string)	{
    var sha1	=	crypto.createHash('sha1');
    sha1.update(string);
    return	sha1.digest('base64');
}

exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};

exports.createOrder = function(req, res) {
    var order_info = req.body;

    var sum = countSum(order_info.ordered_pizza);

    var description = createDesctiption(order_info, sum);

    var order =	{
        version: 3,
        public_key:	LIQPAY_PUBLIC_KEY,
        action:	"pay",
        amount:	sum,
        currency: "UAH",
        description: description,
        order_id:	Math.random(),
        sandbox: 1
    };

    var data = new Buffer(JSON.stringify(order)).toString('base64');
    var signature =	sha1(LIQPAY_PRIVATE_KEY	+ data + LIQPAY_PRIVATE_KEY);

    console.log("Creating Order", order_info);

    res.send({
        data:data,
        signature:signature,
        success: true
    });
};