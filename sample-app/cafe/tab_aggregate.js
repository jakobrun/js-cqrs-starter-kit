'use strict';
const assert = require('assert');
const {tabOpened, drinksOrdered, foodOrdered, drinksServed, foodPrepared, foodServed} = require('./events');

module.exports = function createTabAggregate() {
    var open = false;
    var outstandingDrinks = [], outstandingFood = [], preparedFood = [];
    const tab = {
        apply: function(event) {
            assert(tab[event.type], 'missing event function of type: ' + event.type);
            tab[event.type](event);
        },
        tabOpened: function(event) {
            open = true;
        },
        drinksOrdered: function(event) {
            outstandingDrinks = outstandingDrinks.concat(event.items.map(i => i.menuNumber));
        },
        foodOrdered: function(event) {
            outstandingFood = outstandingFood.concat(event.items.map(i => i.menuNumber));
        },
        drinksServed: function(event) {
            outstandingDrinks = outstandingDrinks
                .filter(drinkMenuNumber => event.menuNumbers.indexOf(drinkMenuNumber) === -1);
        },
        foodPrepared: function(event) {
            preparedFood = preparedFood.concat(event.menuNumbers);
            outstandingFood = outstandingFood
                .filter(foodMenuNumber => event.menuNumbers.indexOf(foodMenuNumber) === -1);
        },
        foodServed: function(event) {
            preparedFood = preparedFood
                .filter(foodMenuNumber => event.menuNumbers.indexOf(foodMenuNumber) === -1);
        },
        openTab: function(command) {
            return [tabOpened(command)];
        },
        placeOrder: function(command) {
            assert(open, 'TabNotOpen');
            const drinks = command.items.filter(item => item.type === 'drink');
            const foods = command.items.filter(item => item.type === 'food');
            const events = [];
            if(drinks.length) {
                events.push(drinksOrdered({items: drinks}));
            }
            if(foods.length) {
                events.push(foodOrdered({items: foods}));
            }
            return events;
        },
        markDrinksServed: function(command) {
            const areDrinksOutstanding = function () {
                return command.menuNumbers.every(menuNumber => outstandingDrinks.indexOf(menuNumber) !== -1);
            };
            assert(areDrinksOutstanding(), 'DrinksNotOutstanding');
            return [drinksServed({
                menuNumbers: command.menuNumbers
            })];
        },
        markFoodPrepared: function(command) {
            const isFoodOutstanding = function() {
                return command.menuNumbers.every(menuNumber => outstandingFood.indexOf(menuNumber) !== -1);
            };
            assert(isFoodOutstanding(), 'FoodNotOutstanding');
            return [foodPrepared({
                menuNumbers: command.menuNumbers
            })];
        },
        markFoodServed: function(command) {
            const isFoodPrepared = function() {
                return command.menuNumbers.every(menuNumber => preparedFood.indexOf(menuNumber) !== -1);
            };
            assert(isFoodPrepared(), 'FoodNotPrepared');
            return [foodServed({
                menuNumbers: command.menuNumbers
            })];
        }
    }
    return tab;
};
