'use strict';
const assert = require('assert');
const {tabOpened, drinksOrdered, foodOrdered, drinksServed} = require('./events');

module.exports = function createTabAggregate() {
    var open = false;
    var outstandingDrinks = [];
    const tab = {
        apply: function(event) {
            tab[event.type](event);
        },
        tabOpened: function(event) {
            open = true;
        },
        drinksOrdered: function(event) {
            outstandingDrinks = outstandingDrinks.concat(event.items.map(i => i.menuNumber));
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
            }
            assert(areDrinksOutstanding(), 'DrinksNotOutstanding');
            return [drinksServed({
                menuNumbers: command.menuNumbers
            })];
        }
    }
    return tab;
};
