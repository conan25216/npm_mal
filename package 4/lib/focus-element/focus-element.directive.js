'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var focusElement = function focusElement($timeout, $parse) {
  return {
    // scope: true,   // optionally create a child scope
    link: function link(scope, element, attrs) {
      var model = $parse(attrs.focusElement);
      scope.$watch(model, function (value) {
        if (value === true) {
          $timeout(function () {
            element[0].focus();
          });
        }
      });
      // to address @blesh's comment, set attribute value to 'false'
      // on blur event:
      element.bind('blur', function () {
        scope.$apply(model.assign(scope, false));
      });
    }
  };
};

focusElement.$inject = ['$timeout', '$parse'];

var directivesModule = _angular2.default.module('focusElement', []).directive('focusElement', focusElement).name;

exports.default = directivesModule;