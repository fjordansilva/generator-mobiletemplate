'use strict';

angular
    .module('core')
    .directive('debug', [
      '$compile', 
      function($compile) {
        return {
          terminal: true,
          priority: 1000000,
          link: function(scope, element) {
            var clone, clonedElement;
            clone = element.clone();
            element.attr('style', 'color:red');
            clone.removeAttr('debug');
            clonedElement = $compile(clone)(scope);
            element.after(clonedElement);
          }
        };
      }
    ]);
