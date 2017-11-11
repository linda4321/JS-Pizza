var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Google_Maps = require('./../GoogleMaps');
var Liq_Pay = require('./../LiqPay');

var API = require('../API');
var $cart_ordered = $("#cart_ordered");
var ordered_cart;

var $name_input = $("#name");
var $tel_input = $("#tel");
var $address_input = $("#address");

var $name_input_div = $(".name-input");
var $tel_input_div = $(".tel-input");
var $address_input_div = $(".address-input");

var name = "";
var tel = "";
var address = "";

function checkNameInput(){
    name = $name_input.val();
    if(name.length<=0){
        return false;
    }

    for(var i = 0; i<name.length; i++){
        if(!isNaN(parseInt(name[i])))
            return false;
    }
    return true;
}

function checkTelInput(){
    tel = $tel_input.val();

    if(tel.length<=0)
        return false;

    if((tel.substring(0, 4) !== '+380') && tel[0] !== "0")
            return false;

    for(var i = 1; i<tel.length; i++){
        if(isNaN(parseInt(tel[i])))
            return false;
    }
    return true;
}

function checkAddressInput(){
    address = $address_input.val();

    if(address.length <= 0)
        return false;

    return true;
}


function errStyle(input_div, span){
    span.show();
    input_div.removeClass("correct");
    input_div.addClass("incorrect");
}
function corrStyle(input_div, span){
    span.hide();
    input_div.removeClass("incorrect");
    input_div.addClass("correct");
}


function initializeButtons(){
    $name_input.bind('input propertychange', function(){
        if(!checkNameInput()) {
            errStyle($name_input_div, $(".in-name"));
        }else{
            corrStyle($name_input_div, $(".in-name"));
        }
    });

    $tel_input.bind('input propertychange', function(){
        if(!checkTelInput()) {
            errStyle($tel_input_div, $(".in-tel"));
        }else{
            corrStyle($tel_input_div, $(".in-tel"));
        }
    });

    $address_input.bind('input propertychange', function(){
        if(!checkAddressInput()) {
            errStyle($address_input_div, $(".in-address"));
        }else{
            corrStyle($address_input_div, $(".in-address"));
            Google_Maps.findOnMap(address);
        }
    });

    $(".button").click(function(){
        var is_valid_name = checkNameInput();
        var is_valid_tel = checkTelInput();
        var is_valid_address = checkAddressInput();
        if(is_valid_name&&is_valid_tel&&is_valid_address){
            var order_data={
                ordered_pizza:ordered_cart,
                name:name,
                tel:tel,
                address:address
            };
            API.createOrder(order_data, function(err, resp_data){
                if(err){
                    alert(err.toString());
                    return;
                }
                Liq_Pay.liqpay(resp_data.data, resp_data.signature);
                console.log(resp_data);
        });
        }else{
            if(!is_valid_name)
                errStyle($name_input_div, $(".in-name"));
            if(!is_valid_tel)
                errStyle($tel_input_div, $(".in-tel"));
            if(!is_valid_address)
                errStyle($address_input_div, $(".in-address"));
        }
    });
}

function showPizzas(){
    ordered_cart = PizzaCart.getPizzaInCart();

    function showOnePizza(cart_item){
        var ordered_html_code = Templates.Ordered_PizzaCart_OneItem(cart_item);
        var $ordered_node = $(ordered_html_code);

        $ordered_node.find(".sum").text(cart_item.pizza[cart_item.size].price*cart_item.quantity);
        $cart_ordered.append($ordered_node);
    }

    ordered_cart.forEach(showOnePizza);
}

function initialiseOrderMenu() {
    showPizzas();
    initializeButtons();
}

exports.initialiseOrderMenu = initialiseOrderMenu;