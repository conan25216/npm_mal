import angular from 'angular';
import checkbox from './checkbox/checkbox';
import compile from './compile/compile.directive';
import numberSpinner from './number-spinner/number-spinner';
import dialog from './dialog/dialog.directive';
import modalBox from './modal-box/modal-box.directive';
import inputCurrency from './input-currency/input-currency.directive';
import focusElement from './focus-element/focus-element.directive';
import customInput from './custom-input/custom-input.directive';
import expInput from './exp-input/exp-input.directive';
import expDatepicker from './exp-datepicker/exp-datepicker.directive';
import datepicker from './datepicker/datepicker.directive';
import inputDate from './input-date/input-date.directive';
import tooltip from './tooltip/tooltip.directive';
import message from './message/message.directive';
import messageService from './message/message.service';

let commonModule = angular.module('ng-ui-library', [
  checkbox,
  compile,
  numberSpinner,
  dialog,
  modalBox,
  inputCurrency,
  focusElement,
  customInput,
  expInput,
  expDatepicker,
  datepicker,
  inputDate,
  tooltip,
  message,
  messageService
])
  .name;

export default commonModule;
