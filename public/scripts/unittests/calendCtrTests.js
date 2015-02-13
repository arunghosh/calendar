describe('Controller: calendarCtrl', function() {
  
  beforeEach(module('calenderApp'));
  var ctrl, scope, thisdata, zones;
  beforeEach(inject(function($controller,$rootScope, data, timezones) {
    spyOn(data, 'getHours').and.callThrough();
    thisdata = data;
    zones = timezones;
    scope = $rootScope.$new();
    ctrl = $controller("calendarCtrl", {$scope: scope});
  }));
  
  it('setting initiall data', function() {
     expect(scope.isSelected(1)).toBeTruthy();
     expect(scope.expandActive).toBeFalsy();
  });
  it('period should change on setPeriod', function() {
    for(var i in scope.availPeriod){
      scope.setPeriod(scope.availPeriod[i].p);
      expect(scope.period).toEqual(scope.availPeriod[i].p);
    }
  });
   it('make sure hours is set only once', function() {
    expect(thisdata.getHours).toHaveBeenCalled();
    expect(thisdata.getHours.calls.count()).toEqual(1);
  });

   it('navigation tests', function() {
      expect(scope.currentWeek.days.length<=4 && scope.currentWeek.days.length>=0).toBeTruthy;
      scope.navigate(Math.floor((Math.random() * 10) + 1));
     expect(scope.currentWeek.days.length<=4 && scope.currentWeek.days.length>=0).toBeTruthy;
   });

   it('timezone search tests', function() {
    scope.query = 'india'; 
    scope.$apply();
    expect(scope.searchResult.length>0).toBeTruthy();
   });

   it('timezone setting test', function() {
    scope.setTimeZone('Australia/Sydney');
    expect(scope.currentZone).toEqual('Australia/Sydney');
    // expect(scope.currentTime).toEqual(moment().add(6,'h').format('hh:mm a'));
   })

});

