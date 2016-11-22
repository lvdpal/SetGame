'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /game when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/game");
  });


  describe('game', function() {

    beforeEach(function() {
      browser.get('index.html#!/game');
    });


    it('should render game when user navigates to /game', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for game/);
    });

  });
});
