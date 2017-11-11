/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');
    var Pizza_List = require('./Pizza_List');
    var Order_Menu = require('./pizza/OrderMenu');
    var Google_Maps = require('./GoogleMaps');

    PizzaMenu.initialiseMenu();
    PizzaCart.initialiseCart();
    Order_Menu.initialiseOrderMenu();
});