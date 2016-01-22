'use strict';

module.exports = {
    tabOpened: function(options) {
        return {
            tableNumber: options.tableNumber,
            waiter: options.waiter
        }
    }
}
