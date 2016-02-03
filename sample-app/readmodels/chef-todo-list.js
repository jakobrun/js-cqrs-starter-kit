'use strict';

module.exports = function() {
    let _list = [];

    const mapGroup = function(group) {
        return {
            tabId: group.tabId,
            items: group.items.map(function(item) {
                return {
                    menuNumber: item.menuNumber,
                    description: item.description
                };
            })
        };
    };

    const todoList = {
        apply: function(event) {
            return todoList[event.type] && todoList[event.type](event);
        },
        foodOrdered: function(event) {
            _list.push(mapGroup(event));
        },
        foodPrepared: function(event) {
            _list.filter(g => g.tabId === event.tabId).forEach(function(group) {
                group.items = group.items.filter(item => event.menuNumbers.every(n => n !== item.menuNumber));
            });
            _list = _list.filter(g => g.items.length);
        },
        list: function() {
            return _list.map(mapGroup);
        }
    };
    return todoList;
};
