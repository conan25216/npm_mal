'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _angular = require('angular');

var _angular2 = _interopRequireDefault(_angular);

var _checkbox = require('./checkbox/checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _compile = require('./compile/compile.directive');

var _compile2 = _interopRequireDefault(_compile);

var _numberSpinner = require('./number-spinner/number-spinner');

var _numberSpinner2 = _interopRequireDefault(_numberSpinner);

var _dialog = require('./dialog/dialog.directive');

var _dialog2 = _interopRequireDefault(_dialog);

var _modalBox = require('./modal-box/modal-box.directive');

var _modalBox2 = _interopRequireDefault(_modalBox);

var _inputCurrency = require('./input-currency/input-currency.directive');

var _inputCurrency2 = _interopRequireDefault(_inputCurrency);

var _focusElement = require('./focus-element/focus-element.directive');

var _focusElement2 = _interopRequireDefault(_focusElement);

var _customInput = require('./custom-input/custom-input.directive');

var _customInput2 = _interopRequireDefault(_customInput);

var _expInput = require('./exp-input/exp-input.directive');

var _expInput2 = _interopRequireDefault(_expInput);

var _expDatepicker = require('./exp-datepicker/exp-datepicker.directive');

var _expDatepicker2 = _interopRequireDefault(_expDatepicker);

var _datepicker = require('./datepicker/datepicker.directive');

var _datepicker2 = _interopRequireDefault(_datepicker);

var _inputDate = require('./input-date/input-date.directive');

var _inputDate2 = _interopRequireDefault(_inputDate);

var _tooltip = require('./tooltip/tooltip.directive');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _message = require('./message/message.directive');

var _message2 = _interopRequireDefault(_message);

var _message3 = require('./message/message.service');

var _message4 = _interopRequireDefault(_message3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commonModule = _angular2.default.module('ng-ui-library', [_checkbox2.default, _compile2.default, _numberSpinner2.default, _dialog2.default, _modalBox2.default, _inputCurrency2.default, _focusElement2.default, _customInput2.default, _expInput2.default, _expDatepicker2.default, _datepicker2.default, _inputDate2.default, _tooltip2.default, _message2.default, _message4.default]).name;

exports.default = commonModule;