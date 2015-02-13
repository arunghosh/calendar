angular.module('calenderApp')
  .controller('calendarCtrl', function($scope, data, timezones, zeroto12Filter) {

    $scope.period = 1;
    $scope.availPeriod = [{p:1}, {p:2}, {p:4}];
    $scope.hours = data.getHours();
    $scope.expandActive =  false;

    $scope.setPeriod = function(period) {
        $scope.period = period;
        $scope.barWidth = ($scope.hourwidth/4)*$scope.period;
    }
    $scope.isSelected= function(period) {
        return period ===$scope.period;
    }
    //---------
     $scope.currentZone = jstz.determine().name();
     $scope.currentTime = moment().format('hh:mm a');
     
     //------timezone search suspended
     $scope.query =  "";
     $scope.searchResult = [];
     $scope.$watch(function(scope) { return scope.query },
            function(newValue, oldValue) {
                if($scope.query.length>0)
                  $scope.searchResult = timezones.getZoneId(newValue);
               else
                  $scope.searchResult = [];
            }
           );

     // ------------
        $scope.template = "views/weekCalendar.html";
         var startDate=0;
        $scope.currentWeek = { days: data.getDays(startDate, startDate+4)  };
        $scope.navigate = function(factor) {
          if((startDate+factor)>=0 && (startDate+factor)<data.getTotalDays()) {
            startDate+=factor;
            $scope.currentWeek = { days: data.getDays(startDate, startDate+4) };
          }
        }

       // ---
        $scope.setTimeZone = function(zone) {
            $scope.searchResult = [];
            moment.tz.setDefault(zone);
            $scope.currentTime = moment().format('hh:mm a');
            $scope.currentZone = zone;
            $scope.hours = data.getHours();
        }
        //------------------
      var daywidth =  100; //getWidth('#daydiv');
      var hourwidth =  daywidth/13;         //getWidth('#hour');
      var b15 = hourwidth/4;  // b15 - 15 min block
      $scope.hourwidth = hourwidth;

      // scope.barWidth = (b15*scope.period);
      
      $scope.mousemove = function(event, day, session) {
        if($scope.expandActive) return;
        // console.log(event);
        var screenWidth = getWidth('#daydiv');
        session.barWidth = (b15*$scope.period);
        var cursorX = getPercent(event.clientX, screenWidth);  // 4 is outer padding 
        var cb15 = float2int(cursorX/b15); //cb15 - current 15 min. block

        if(cb15>=4 && cb15<=52) {
            session.margin = ((cb15)*b15);  
            session.sm = (cb15%4)*15;
            session.em = ((cb15+$scope.period)%4)*15;
            session.sh = float2int(cursorX/hourwidth-1);
            if(session.em>session.sm)  session.eh = session.sh;
            else  session.eh = session.sh+1;
            if(check48(session, cb15-4, $scope.period))
               session.showBar = true; else session.showBar = false;
        }
         // ---
         var excess =  (cb15+$scope.period)-52;

         var nextSession  = session.nextSession;
         if(nextSession===undefined) return; 
       if(excess>0 && excess<4 && check48(nextSession, 0, excess)) {
            session.showBar = true;
            session.barWidth = (b15*($scope.period-excess));
            nextSession.showBar = true;
            nextSession.margin = b15*4;
            nextSession.barWidth = b15*excess;
            nextSession.sh = 0; nextSession.sm = 0;
            nextSession.eh = 0; nextSession.em = 15*excess;
            if(session.en==='am') session.en = 'pm'; else session.en = 'am';
         }else 
            nextSession.showBar = false;
     }

     function check48(session, start, count) {
       if(session.b48[start-1]===1) session.showSt = false; else session.showSt = true;
       if(session.b48[start+count]===1) session.showEt = false; else session.showEt = true;
       for(var i=start; i<start+count; i++) {
          if(session.b48[i] !== -1) return false;
       }
        return true;
     }
        
     $scope.leave = function(session) {
        if($scope.expandActive) return;
         session.showBar = false;
         if(session.nextSession!==undefined)
         session.nextSession.showBar=false;
     }
     //---------
      $scope.getBarWidth = function(availTime, areas) {
        var shour = availTime.startTime.substring(0, availTime.startTime.indexOf(":"));
        var ehour = availTime.endTime.substring(0, availTime.endTime.indexOf(":"));
        var smin  = availTime.startTime.substring(availTime.startTime.indexOf(":")+1);
        var emin  = availTime.endTime.substring(availTime.endTime.indexOf(":")+1);
        var dhour = shour*hourwidth;
        var area  = {
            startPoint: dhour +((smin/15)*b15),
            endPoint:  dhour+(ehour-shour)*hourwidth+((smin/15)*b15)+$scope.barWidth
        };
        areas.push(area);
       return  (ehour-shour)*hourwidth+(((emin-smin)/15)*b15);
     }
     //-------------
    //-------------------
    $scope.bookSpot = function(session) {
        session.show =true;
        session.bottomMargin = 100;
        $scope.expandActive=true;
        session.showBar = false;
        var booked = {
            startTime : zeroto12Filter(session.sh)+':'+session.sm,
            endTime : zeroto12Filter(session.eh)+':'+session.em,
            leftMargin : session.sh*hourwidth+((session.sm/15)*b15),
            showSt: true, showEt:true, prev:false, next:false, 
        };
        if(session.nextSession!==undefined && session.nextSession.showBar) {
          booked.showEt = false; booked.next = true;
          var xbooked = {
            startTime : zeroto12Filter(session.nextSession.sh)+':'+session.nextSession.sm,
            endTime : zeroto12Filter(session.nextSession.eh)+':'+session.nextSession.em,
            leftMargin : session.nextSession.sh*hourwidth+((session.nextSession.sm/15)*b15),
            showSt: false, showEt:true, prev:true, next: false,
          }
        
          session.nextSession.booked.push(xbooked);
          session.nextSession.showBar=false;
        }
        session.booked.push(booked);
        
    }

        $scope.close = function(session) {
            session.show =false;
            session.bottomMargin = 20;
            $scope.expandActive=false;
            var booked = session.booked[session.booked.length-1];
            if(booked.next) session.nextSession.booked.pop();
            session.booked.pop();
            session.bookedArea.pop();
        }

        $scope.confirm =  function(session) {
            var x = session.sh*4+(session.sm/15);
            var y = session.eh*4+(session.em/15);
            for(var j= x; j<y; j++) {
                session.b48[j] = 1;
            }
            session.show =false;
            session.bottomMargin = 20;
            $scope.expandActive=false;

            var booked = session.booked[session.booked.length-1];
            if(booked.next){
              var x = session.nextSession.sh*4+(session.nextSession.sm/15);
              var y = session.nextSession.eh*4+(session.nextSession.em/15);
              for(var j= x; j<y; j++) {
                  session.nextSession.b48[j] = 1;
              }
            }
        }
        $scope.select = function(day) {
            $scope.selected = day.date;  
        };
       
  })
.filter('zeroto12', [function() {
  return function(time) {
      if(time===0) return '12';
      else return time;
  };
}]);

function getWidth(id) {
    return $(id).width();
}
function float2int (value) {
    return value | 0;
}
function getPercent(value, given) {
    return (value/given)*100;
}
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
