
// ------------
describe('Factory: datafactory', function() {
  var datas;
  beforeEach(module('calenderApp'));
   beforeEach(inject(function(data) {
      datas = data;
   }));
  
  it('hours', function() {
     expect(datas.getHours().length).toEqual(12);
     expect(datas.getHours()[0]).toEqual({t:0});
     expect(datas.getHours()[11]).toEqual({t:11});
  });

  it('slots should have properties', function() {
    expect(datas.getSlots().length>0).toBeTruthy();
    for(var i in datas.getSlots()) {
      expect(datas.getSlots()[i].hasOwnProperty('date')).toBeTruthy();
      expect(datas.getSlots()[i].hasOwnProperty('availTime')).toBeTruthy();
      expect(datas.getSlots()[i].availTime.hasOwnProperty('startTime')).toBeTruthy();
      expect(datas.getSlots()[i].availTime.hasOwnProperty('endTime')).toBeTruthy();
    }
  });
  it('hour shouldnt be >24 and minute >59', function() {
    for(var i in datas.getSlots()) {
      var startTime = datas.getSlots()[i].availTime.startTime;
      var endTime = datas.getSlots()[i].availTime.endTime;
      var shour = startTime.substring(0,startTime.indexOf(":"));
      var ehour = endTime.substring(0,endTime.indexOf(":"));
      var sm = startTime.substring(startTime.indexOf(":")+1);
      var em = endTime.substring(endTime.indexOf(":")+1);
      expect(shour<=24 && shour>=0 && ehour<=24 && ehour>=0).toBeTruthy();
      expect(sm<=59 && sm>=0 && em<=59 && em>=0).toBeTruthy();
    }
  });
  it('days should be >= slots', function() {
     expect(datas.getSlots().length >= datas.getDays().length).toBeTruthy();
  });
  it('every property of day should be defined', function() {
    for(var i in datas.getDays()) {
      for (var prop in datas.getDays()[i]) {
        expect(datas.getDays()[i][prop]!==undefined).toBeTruthy();
        if(datas.getDays()[i][prop]===undefined)
           console.log(i+' '+prop+' '+datas.getDays()[i][prop]);
      }
      for(var j in datas.getDays()[i].session) {
        for (var prop in datas.getDays()[i].session[j]) {
          expect(datas.getDays()[i].session[j][prop]!==undefined).toBeTruthy();
          if(datas.getDays()[i].session[j][prop]===undefined)
             console.log(i+' '+prop+' '+datas.getDays()[i].session[j].sn);
        }
      }
    }
  });

  it('should have 48 blocks a day', function() {
    expect(datas.getDays(0,1)[0].session[0].b48.length).toEqual(48);
  });

});

// --------
/*
describe('Directive: calendar', function() {
  
  beforeEach(module('calenderApp'));
  var compile, mockBackend, rootScope, datas;
  // Step 1
  beforeEach(inject(function($compile, $httpBackend, $rootScope, data) {
    compile = $compile;
    mockBackend = $httpBackend;
    rootScope = $rootScope;
    datas  = data;
  }));

  it('should render HTML based on scope correctly', function() {
    var scope = rootScope.$new();
    scope.title = 'the best';
    scope.hours = datas.getHours();
    mockBackend.expectGET('views/weekCalendar.html').respond(
    '<div ng-bind="title"></div>' );
    var element = compile('<calendar></calendar>')(scope);
     scope.$digest();
     mockBackend.flush();

     expect(element.html()).toEqual('<div ng-bind="title" class="ng-binding">the best</div>');
    });
 


});

*/
 