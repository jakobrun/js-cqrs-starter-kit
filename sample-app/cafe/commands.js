'use strict';

module.exports = {
    openTab: function(options) {
        return {
            type: 'openTab',
            tableNumber: options.tableNumber,
            waiter: options.waiter
        };
    }
};
