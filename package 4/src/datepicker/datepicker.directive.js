import angular from 'angular';
import template from './datepicker.html';
import moment from 'moment';
import Hebcal from 'hebcal';
import _ from 'lodash';

import './datepicker.scss';

let datepickerModule = angular.module('datepicker', [])
  .directive('datepicker', datepicker)
  .name;

function datepicker ($window, $timeout, $location) {
  return {
    restrict: 'E',
    scope: {
      date: '=?',
      open: '=?',
      disabled: '<?',
      dateMinLimit: '<?',
      dateMaxLimit: '<?'
    },
    transclude: true,
    bindToController: true,
    controllerAs: 'vm',
    template: template,
    controller: ['$scope', '$rootScope', '$window', '$timeout',
      function ($scope, $rootScope, $window, $timeout) {
        var vm = this;
        vm.$window = $window;
        vm.moment = moment;
        vm.moment.locale('he');
        vm.Hebcal = Hebcal;
        vm.Number = $window.Number;

        vm.$onInit = function () {
          vm.changeMode();
          vm.selectDate(vm.date);
        };

        $scope.$watch('vm.date', () => {
          vm.selectDate(vm.date);
        });

        $scope.$watch('vm.open', (oldVaule, newValue) => {
          if (oldVaule === newValue) {
            return;
          }
          if (vm.open) {
            vm.show();
          } else {
            vm.hide();
          }
        });

        vm.checkDateMinLimit = function (unit, number) {
          if (!vm.dateMinLimit || vm.dateMinLimit === '') return true;

          const minLimit = vm.moment(vm.dateMinLimit.toString(), 'DD/MM/YYYY');
          const selectedDate = vm.getDateFormat(unit, number);

          return vm.moment(selectedDate).isSameOrAfter(minLimit, unit);
        };

        vm.checkDateMaxLimit = function (unit, number) {
          if (!vm.dateMaxLimit || vm.dateMaxLimit === '') return true;

          const maxLimit = vm.moment(vm.dateMaxLimit.toString(), 'DD/MM/YYYY');
          const selectedDate = vm.getDateFormat(unit, number);

          return vm.moment(selectedDate).isSameOrBefore(maxLimit, unit);
        };

        vm.getDateFormat = (unit, number) => {
          if (vm.mode === 'hebrew') {
            var hDate;
            if (unit === 'day') {
              number = Number(number);
              hDate = new vm.Hebcal.HDate(vm.selectedHebrewDateObj).setDate(number);
            } else if (unit === 'month') {
              hDate = new vm.Hebcal.HDate(vm.selectedHebrewDateObj).setMonth(number);
            } else if (unit === 'year') {
              hDate = new vm.Hebcal.HDate(vm.selectedHebrewDateObj).setFullYear(number);
            }
            const selectedDate = vm.moment(hDate.greg());
            return selectedDate;
          } else {
            if (unit === 'day') {
              unit = 'date';
            } else if (unit === 'month') {
              number = (Number(number) - 1).toString();
            } else if (unit === 'year' & number.toString().length === 2) {
              if (Number(number) < 70) {
                number = '20' + number.toString();
              } else {
                number = '19' + number.toString();
              }
            }

            const selectedDate = vm.moment(vm.selectedDate).set(unit, number);
            return selectedDate;
          }
        };

        vm.checkDateLimitToday = function () {
          if (!vm.dateMinLimit || vm.dateMinLimit === '' || !vm.dateMaxLimit || vm.dateMaxLimit === '') return true;

          const minLimit = !vm.dateMinLimit && vm.dateMinLimit !== '' ? undefined : vm.moment(vm.dateMinLimit.toString(), 'DD/MM/YYYY');
          const maxLimit = !vm.dateMaxLimit && vm.dateMaxLimit !== '' ? undefined : vm.moment(vm.dateMaxLimit.toString(), 'DD/MM/YYYY');

          if (vm.moment().isSameOrAfter(minLimit, 'day') && vm.moment().isSameOrBefore(maxLimit, 'day')) return true;
          return false;
        };

        vm.changeMode = function () {
          vm.mode = (vm.mode === 'gregorian' ? 'hebrew' : 'gregorian');
        };

        /* close save */
        vm.save = function () {
          vm.date = vm.selectedDate;
          vm.hide();
        };

        /* datepicker */

        /* date functions */
        vm.selectDate = function (date) {
          if (!vm.moment(date).isValid()) {
            date = undefined;
          }

          if (!vm.dateMinLimit && vm.dateMinLimit !== '' && !vm.dateMaxLimit && vm.dateMaxLimit !== '') vm.selectedDate = vm.moment(date).format();
          else {
            const minLimit = !vm.dateMinLimit && vm.dateMinLimit !== '' ? undefined : vm.moment(vm.dateMinLimit.toString(), 'DD/MM/YYYY');
            const maxLimit = !vm.dateMaxLimit && vm.dateMaxLimit !== '' ? undefined : vm.moment(vm.dateMaxLimit.toString(), 'DD/MM/YYYY');

            let selectedDate = vm.moment(date);

            if ((!minLimit || selectedDate.isSameOrAfter(minLimit, 'day')) && (!maxLimit || selectedDate.isSameOrBefore(maxLimit, 'day'))) vm.selectedDate = vm.moment(date).format();
            else vm.selectedDate = vm.moment(minLimit).format();
          }

          vm.selectedHebrewDateObj = new vm.Hebcal.HDate(new Date(vm.selectedDate));
          vm.selectedHebrewDate = vm.selectedHebrewDateObj.toString('h');
        };

        // vm.selectDate(vm.date);

        vm.changeDate = function (unit, number) {
          if (unit === 'day') {
            unit = 'date';
          } else if (unit === 'month') {
            number = (Number(number) - 1).toString();
          } else if (unit === 'year' & number.toString().length === 2) {
            if (Number(number) < 70) {
              number = '20' + number.toString();
            } else {
              number = '19' + number.toString();
            }
          }

          vm.helpChangeDate(unit, number);
        };

        vm.helpChangeDate = (unit, number, dateFromHeb) => {
          const selectedDate = !dateFromHeb ? vm.moment(vm.selectedDate).set({ [unit]: number }) : vm.moment(dateFromHeb.greg());

          if ((!vm.dateMinLimit || vm.dateMinLimit === '') && (!vm.dateMaxLimit || vm.dateMaxLimit === '')) {
            vm.selectDate(selectedDate);
            return;
          }

          const minLimit = !vm.dateMinLimit && vm.dateMinLimit !== '' ? undefined : vm.moment(vm.dateMinLimit.toString(), 'DD/MM/YYYY');
          const maxLimit = !vm.dateMaxLimit && vm.dateMaxLimit !== '' ? undefined : vm.moment(vm.dateMaxLimit.toString(), 'DD/MM/YYYY');

          const dateCheckFlag = vm.checkDateByUnit(selectedDate, 'day');

          if (dateCheckFlag ||
              (unit === 'month' && dateCheckFlag)) {
            vm.selectDate(selectedDate);
            return;
          }

          if (unit === 'year') {
            if (vm.mode === 'hebrew') {
              const newHebDate = new vm.Hebcal.HDate(dateFromHeb).setFullYear(number);
              const yearsDiffHeb = vm.selectedHebrewDateObj.year - newHebDate.year;
              if (yearsDiffHeb > 0) vm.hebrewPrev('year', yearsDiffHeb);
              if (yearsDiffHeb < 0) vm.hebrewNext('year', Math.abs(yearsDiffHeb));
              return;
            }

            const yearsDiff = selectedDate.diff(vm.selectedDate, 'year');
            if (yearsDiff > 0) vm.next('year', yearsDiff);
            if (yearsDiff < 0) vm.prev('year', Math.abs(yearsDiff));
            return;
          }

          if (vm.minDateFlag) {
            vm.selectDate(selectedDate.set('date', minLimit.get('date')));
            return;
          }

          vm.selectDate(selectedDate.set('date', maxLimit.get('date')));
        };

        // return true if the date is in the range
        vm.checkDateByUnit = function (selectedDate, unit) {
          vm.minDateFlag = false;
          vm.maxDateFlag = false;

          const minLimit = !vm.dateMinLimit && vm.dateMinLimit !== '' ? undefined : vm.moment(vm.dateMinLimit.toString(), 'DD/MM/YYYY');
          const maxLimit = !vm.dateMaxLimit && vm.dateMaxLimit !== '' ? undefined : vm.moment(vm.dateMaxLimit.toString(), 'DD/MM/YYYY');

          if (!minLimit) return selectedDate.isSameOrBefore(maxLimit, unit);
          if (!maxLimit) {
            vm.minDateFlag = true;
            return selectedDate.isSameOrAfter(minLimit, unit);
          }

          vm.minDateFlag = !selectedDate.isSameOrAfter(minLimit, unit);
          vm.maxDateFlag = !selectedDate.isSameOrBefore(maxLimit, unit);

          return !vm.minDateFlag && !vm.maxDateFlag;
        };

        vm.next = function (unit, number) {
          number = number || 1;

          if (!vm.dateMaxLimit && vm.dateMaxLimit !== '') {
            vm.selectDate(vm.moment(vm.selectedDate).add(number, unit));
            return;
          }

          const maxLimit = vm.moment(vm.dateMaxLimit.toString(), 'DD/MM/YYYY');
          let selectedDate = vm.moment(vm.selectedDate).add(number, unit);

          if (selectedDate.isSameOrBefore(maxLimit, 'day')) {
            vm.selectDate(selectedDate);
          } else if (selectedDate.isSame(maxLimit, 'year') && selectedDate.isAfter(maxLimit, 'month')) {
            selectedDate = vm.moment(selectedDate).set('month', maxLimit.get('month'));

            vm.selectDate(selectedDate);

            if (vm.moment(selectedDate).isAfter(maxLimit, 'day')) {
              vm.selectDate(selectedDate.set('date', maxLimit.get('date')));
            }
          } else if (selectedDate.isSameOrBefore(maxLimit, 'month') && selectedDate.isAfter(maxLimit, 'day')) {
            vm.selectDate(vm.moment(selectedDate).set('date', maxLimit.get('date')));
          }
        };

        vm.prev = function (unit, number) {
          number = number || 1;

          if (!vm.dateMinLimit && vm.dateMinLimit !== '') {
            vm.selectDate(vm.moment(vm.selectedDate).subtract(number, unit));
            return;
          }

          const minLimit = vm.moment(vm.dateMinLimit.toString(), 'DD/MM/YYYY');
          let selectedDate = vm.moment(vm.selectedDate).subtract(number, unit);

          if (selectedDate.isSameOrAfter(minLimit, 'day')) {
            vm.selectDate(selectedDate);
          } else if (selectedDate.isSame(minLimit, 'year') && selectedDate.isBefore(minLimit, 'month')) {
            selectedDate = vm.moment(selectedDate).set('month', minLimit.get('month'));

            vm.selectDate(selectedDate);

            if (vm.moment(selectedDate).isBefore(minLimit, 'day')) {
              vm.selectDate(selectedDate.set('date', minLimit.get('date')));
            }
          } else if (selectedDate.isSameOrAfter(minLimit, 'month') && selectedDate.isBefore(minLimit, 'day')) {
            vm.selectDate(vm.moment(selectedDate).set('date', minLimit.get('date')));
          }
        };

        /* day preview translation */
        vm.dayTranslationToHebrew = function (day) {
          var translationDay = vm.moment(vm.selectedDate).set({ date: day });
          var translation = new vm.Hebcal.HDate(new Date(translationDay)).toString('h');
          translation = translation.substring(0, translation.lastIndexOf(' '));
          return translation;
        };

        vm.dayWeekDayTranslation = function (day) {
          var translation = vm.moment(vm.selectedDate).set({ date: day }).format('dddd');
          return 'יום ' + translation;
        };

        vm.dayTranslationToGreg = function (day) {
          var sDay = vm.selectedHebrewDateObj;
          var translationDay = new vm.Hebcal.HDate(day, sDay.month, sDay.year);
          var translation = vm.moment(translationDay.greg()).format('DD/MM');
          return translation;
        };

        vm.dayWeekHebrewDayTranslation = function (day) {
          var sDay = vm.selectedHebrewDateObj;
          var translationDay = new vm.Hebcal.HDate(day, sDay.month, sDay.year);
          var translation = vm.moment(translationDay.greg()).format('dddd');
          return 'יום ' + translation;
        };

        /* hebrew date functions */
        vm.changeHebrewDate = function (unit, value) {
          var hDate;
          if (unit === 'day') {
            value = Number(value);
            hDate = new vm.Hebcal.HDate(vm.selectedHebrewDateObj).setDate(value);
            // hDate = vm.selectedHebrewDateObj.setDate(value);
          } else if (unit === 'month') {
            hDate = new vm.Hebcal.HDate(vm.selectedHebrewDateObj).setMonth(value);
            // hDate = vm.selectedHebrewDateObj.setMonth(value);
          } else if (unit === 'year') {
            hDate = new vm.Hebcal.HDate(vm.selectedHebrewDateObj).setFullYear(value);
            // hDate = vm.selectedHebrewDateObj.setFullYear(value);
          }

          vm.helpChangeDate(unit, value, hDate);

          // if (!vm.dateMinLimit && vm.dateMinLimit !== '') {
          //   vm.selectDate(gregDate);
          //   return;
          // }

          // let x = vm.moment(vm.dateMinLimit.toString(), 'DD/MM/YYYY');
          // let y = vm.moment(gregDate);

          // if (y.isSameOrAfter(x)) {
          //   vm.selectDate(y);
          // }
        };

        vm.hebrewNext = function (unit, number) {
          number = number || 1;
          var hDate;
          var sDate = vm.selectedHebrewDateObj;
          if (unit === 'day') {
            vm.next('day', number);
            return;
          } else if (unit === 'month') {
            var nextMonth = sDate.getMonthObject().next(); // TODO: add more then one month.
            hDate = new vm.Hebcal.HDate(sDate.day, nextMonth.month, nextMonth.year);
          } else if (unit === 'year') {
            hDate = new vm.Hebcal.HDate(sDate.day, sDate.month, sDate.year + number);
          }

          const gregDate = vm.moment(hDate.greg());

          if (!vm.dateMaxLimit && vm.dateMaxLimit !== '') {
            vm.selectDate(gregDate);
            return;
          }

          const maxLimit = vm.moment(vm.dateMaxLimit.toString(), 'DD/MM/YYYY');
          const maxLimitHeb = new vm.Hebcal.HDate(new Date(maxLimit));

          if (gregDate.isSameOrBefore(maxLimit, 'day')) {
            vm.selectDate(gregDate);
            return;
          }

          const maxLimitMonth = vm.convertHebMonth(maxLimitHeb);
          const hDateMonth = vm.convertHebMonth(hDate);

          if (hDate.year === maxLimitHeb.year && hDateMonth > maxLimitMonth) {
            hDate = new vm.Hebcal.HDate(hDate.day, maxLimitHeb.month, hDate.year);
            vm.selectDate(vm.moment(hDate.greg()));

            if (hDate.day > maxLimitHeb.day) {
              hDate = new vm.Hebcal.HDate(maxLimitHeb.day, hDate.month, hDate.year);
              vm.selectDate(vm.moment(hDate.greg()));
            }
          } if (hDate.year <= maxLimitHeb.year && hDateMonth <= maxLimitMonth && hDate.day > maxLimitHeb.day) {
            hDate = new vm.Hebcal.HDate(maxLimitHeb.day, hDate.month, hDate.year);
            vm.selectDate(vm.moment(hDate.greg()));
          }
        };

        vm.hebrewPrev = function (unit, number) {
          number = number || 1;
          var hDate;
          var sDate = vm.selectedHebrewDateObj;
          if (unit === 'day') {
            vm.prev('day', number);
            return;
          } else if (unit === 'month') {
            const prevMonth = sDate.getMonthObject().prev(); // TODO: prev more then one month.
            hDate = new vm.Hebcal.HDate(sDate.day, prevMonth.month, prevMonth.year);
          } else if (unit === 'year') {
            hDate = new vm.Hebcal.HDate(sDate.day, sDate.month, sDate.year - number);
          }

          const gregDate = vm.moment(hDate.greg());

          if (!vm.dateMinLimit && vm.dateMinLimit !== '') {
            vm.selectDate(gregDate);
            return;
          }

          const minLimit = vm.moment(vm.dateMinLimit.toString(), 'DD/MM/YYYY');
          const minLimitHeb = new vm.Hebcal.HDate(new Date(minLimit));

          if (gregDate.isSameOrAfter(minLimit, 'day')) {
            vm.selectDate(gregDate);
            return;
          }

          const minLimitMonth = vm.convertHebMonth(minLimitHeb);
          const hDateMonth = vm.convertHebMonth(hDate);

          if (hDate.year === minLimitHeb.year && hDateMonth < minLimitMonth) {
            hDate = new vm.Hebcal.HDate(hDate.day, minLimitHeb.month, hDate.year);
            vm.selectDate(vm.moment(hDate.greg()));

            if (hDate.day < minLimitHeb.day) {
              hDate = new vm.Hebcal.HDate(minLimitHeb.day, hDate.month, hDate.year);
              vm.selectDate(vm.moment(hDate.greg()));
            }
          } if (hDate.year >= minLimitHeb.year && hDateMonth >= minLimitMonth && hDate.day < minLimitHeb.day) {
            hDate = new vm.Hebcal.HDate(minLimitHeb.day, hDate.month, hDate.year);
            vm.selectDate(vm.moment(hDate.greg()));
          }
        };

        /*
        convert hebrew month to index from array of hebrew month numbers
        */
        vm.convertHebMonth = (date) => {
          const mapper = {
            'isLeap': [7, 8, 9, 10, 11, 12, 13, 1, 2, 3, 4, 5, 6],
            'isNotLeap': [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6]
          };

          const res = date.getMonthObject().isLeapYear() ? 'isLeap' : 'isNotLeap';
          return mapper[res].indexOf(date.month);
        };

        /* lists */
        vm.daysList = [
          ['01', '02', '03', '04', '05', '06', '07'],
          ['08', '09', '10', '11', '12', '13', '14'],
          ['15', '16', '17', '18', '19', '20', '21'],
          ['22', '23', '24', '25', '26', '27', '28'],
          ['29', '30', '31']
        ];
        vm.hebrewDaysList = [
          { 1: 'א', 2: 'ב', 3: 'ג', 4: 'ד', 5: 'ה', 6: 'ו', 7: 'ז' },
          { 8: 'ח', 9: 'ט', 10: 'י', 11: 'יא', 12: 'יב', 13: 'יג', 14: 'יד' },
          { 15: 'טו', 16: 'טז', 17: 'יז', 18: 'יח', 19: 'יט', 20: 'כ', 21: 'כא' },
          { 22: 'כב', 23: 'כג', 24: 'כד', 25: 'כה', 26: 'כו', 27: 'כז', 28: 'כח' },
          { 29: 'כט', 30: 'ל' }
        ];

        vm.yearList = function () {
          var list = [];
          var year = vm.moment(vm.selectedDate).format('YY');
          for (var i = 0; i < 6; i++) {
            year = (Number(year) + 1).toString();
            if (year.length === 1) {
              year = '0' + year;
            } else if (year.length > 2) {
              year = year.slice('-2');
            }
            list.push(year);
          }
          return list;
        };

        vm.hebrewYearList = function () {
          var list = [];
          var year = vm.selectedHebrewDateObj.year;
          for (var i = 0; i < 6; i++) {
            year++;
            list.push(year);
          }
          return list;
        };

        vm.monthsList = {
          1: {
            name: 'ינואר',
            number: '01'
          },
          2: {
            name: 'פברואר',
            number: '02'
          },
          3: {
            name: 'מרץ',
            number: '03'
          },
          4: {
            name: 'אפריל',
            number: '04'
          },
          5: {
            name: 'מאי',
            number: '05'
          },
          6: {
            name: 'יוני',
            number: '06'
          },
          7: {
            name: 'יולי',
            number: '07'
          },
          8: {
            name: 'אוגוסט',
            number: '08'
          },
          9: {
            name: 'ספטמבר',
            number: '09'
          },
          10: {
            name: 'אוקטובר',
            number: '10'
          },
          11: {
            name: 'נובמבר',
            number: '11'
          },
          12: {
            name: 'דצמבר',
            number: '12'
          }
        };

        vm.hebrewMonthsList = {
          1: {
            name: 'תשרי',
            number: 7
          },
          2: {
            name: 'חשוון',
            number: 8
          },
          3: {
            name: 'כסלו',
            number: 9
          },
          4: {
            name: 'טבת',
            number: 10
          },
          5: {
            name: 'שבט',
            number: 11
          },
          6: {
            name: 'אדר',
            number: 12
          },
          7: {
            name: 'ניסן',
            number: 1
          },
          8: {
            name: 'אייר',
            number: 2
          },
          9: {
            name: 'סיוון',
            number: 3
          },
          10: {
            name: 'תמוז',
            number: 4
          },
          11: {
            name: 'אב',
            number: 5
          },
          12: {
            name: 'אלול',
            number: 6
          }
        };
      }],
    link: function (scope, element, attr, vm) {
      vm.isShown = false;

      vm.close = function () {
        vm.hide();
      };

      vm.show = function () {
        if (vm.disabled) {
          return;
        }
        vm.isShown = true;
        vm.open = true;
        $timeout(() => {
          scope.$apply(() => { });
          angular.element(element[0].getElementsByClassName('modal-box')).on('click', (event) => {
            if (event.target === event.currentTarget) { // click outside of the modal.
              vm.hide();
            }
          });
        });
        angular.element($window).on('keydown keypress', (event) => {
          if (event.which === 27) { // Escape key press.
            vm.hide();
            event.stopPropagation();
          }
        });
      };

      vm.hide = function () {
        vm.isShown = false;
        vm.open = false;
        $timeout(() => {
          scope.$apply(() => { });
        });
        angular.element($window).off('keydown keypress');
        angular.element(element[0].getElementsByClassName('modal-box')).off('click');
      };

      vm.toggle = function () {
        vm.isShown === true ? vm.hide() : vm.show();
      };

      scope.$on('datePickerClose', () => {
        vm.hide();
      });
    }

  };
}

datepicker.$inject = ['$window', '$timeout', '$location'];

export default datepickerModule;
