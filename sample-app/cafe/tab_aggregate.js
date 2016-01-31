'use strict';
const assert = require('assert');
const {tabOpened, drinksOrdered, foodOrdered, drinksServed} = require('./events');

module.exports = function createTabAggregate() {
    var open = false;
    const tab = {
        apply: function(event) {
            tab[event.type](event);
        },
        tabOpened: function(event) {
            open = true;
        },
        drinksOrdered: function(event) {

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
            return [drinksServed({
                menuNumbers: command.menuNumbers
            })];
        }
    }
    return tab;
};
