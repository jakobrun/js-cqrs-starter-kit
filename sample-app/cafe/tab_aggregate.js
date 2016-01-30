'use strict';
const assert = require('assert');
const {tabOpened, drinksOrdered} = require('./events');

module.exports = function createTabAggregate() {
    var open = false;
    var tab = {
        apply: function(event) {
            tab[event.type](event);
        },
        tabOpened: function(event) {
            open = true;
        },
        openTab: function(command) {
            return [tabOpened(command)];
        },
        placeOrder: function(command) {
            assert(open, 'TabNotOpen');
            return [drinksOrdered({
                items: command.items
            })];
        }
    }
    return tab;
};
