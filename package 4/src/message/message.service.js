import angular from 'angular';

let self;

class messageService {
  constructor ($rootScope, $compile, $window, $timeout) {
    self = this;
    self.$rootScope = $rootScope;
    self.$compile = $compile;
    self.$window = $window;
    self.$timeout = $timeout;

    self.isShown = false;
    self.isShownCheck = function () {
      return self.isShown;
    };

    self.properties = {};

    self.setup();
    return self;
  }

  show (properties) {
    self.properties = {
      className: '',
      buttons: true,
      buttonCancel: false,
      buttonConfirm: false,
      buttonConfirmFunction: self.hide,
      icon: false,
      align: 'center',
      close: true,
      customHtml: null
    };
    for (var key in properties) {
      self.properties[key] = properties[key];
    }
    self.isShown = true;

    self.$timeout(() => {
      self.$rootScope.$apply();
    });
  }

  hide () {
    self.isShown = false;
  }

  toggle () {
    self.isShown === true ? self.hide() : self.show();
  }

  setup () {
    var msgElement = document.createElement('message');
    self.$window.document.body.append(msgElement);

    let scope = self.$rootScope.$new();
    self.$timeout(() => {
      self.$compile(msgElement)(scope);
    });
  }
}

messageService.$inject = ['$rootScope', '$compile', '$window', '$timeout'];

let messageModule = angular.module('messageService', [])
  .service('messageService', messageService)
  .name;

export default messageModule;
