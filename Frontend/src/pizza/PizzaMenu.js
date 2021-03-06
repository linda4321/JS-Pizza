/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var API = require('../API');
// var Pizza_List = require('../Pizza_List');
var Pizza_List = [];

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
var pizza_filters ={
    all:"Усі піци",
    meat:"М'ясні піци",
    pineapple:"Піци з ананасами",
    mushroom:"Піци з грибами",
    ocean:"Піци з морепродуктами",
    vega:"Вегетеріанські піци"
};

var keys = Object.keys(pizza_filters);

var number_value = $(".pizza-amount");
var menu_title = $(".title-span");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        // console.log(pizza.title);
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }
    // console.log(list.length);
    list.forEach(showOnePizza);
    number_value.text(list.length);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){

        if(pizza.content[filter])
            pizza_shown.push(pizza);

    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
    menu_title.text(pizza_filters[filter]);
}

function initialiseMenu() {
    //Показуємо усі піци
    console.log("initialize menu");
    API.getPizzaList(function (err, user_data) {

        if(err){
            alert(err.toString());
            console.log("failed");
            return;
        }

        Pizza_List = user_data;
        showPizzaList(Pizza_List);
        initializeButtons();
    });
}
function filterVegaPizza(){
    var pizza_shown = [];
    Pizza_List.forEach(function(pizza){
        if(pizza.type === "Вега піца")
            pizza_shown.push(pizza);
    });
    showPizzaList(pizza_shown);
    menu_title.text(pizza_filters["vega"]);
    setActive($(this));
}

function filterAllPizza(){
    showPizzaList(Pizza_List);
    menu_title.text(pizza_filters["all"]);
    setActive($(this));
}

function setActive(element){
    $(".active").removeClass("active");
    element.addClass("active");
}

function initializeButtons(){
    keys.forEach(function(key){
        if(key === "vega"){
            $("." + key).click(function() {
                filterVegaPizza();
            });
        }
        else if(key === "all"){
            $("." + key).click(function() {
                filterAllPizza();
            });
        }else{
            $("." + key).click(function(){
                filterPizza(key);
                setActive($(this));
            });
        }
    });

}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;