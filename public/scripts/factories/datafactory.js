angular.module('calenderApp')
.factory('data', function() {
    var DAYWIDTH =  100; 
    var HOURWIDTH =  DAYWIDTH/13;      
    var B15 = HOURWIDTH/4; 
    getHours = function() {
        var currentHour = moment().hour(0);
        var hour =[];
        for (var i=0; i<12; i++) {
            hour.push({t: currentHour.hour()});
            currentHour.add(1, "h");
        }
        return hour;
    }
    getSlots = function() {
        var day = moment();
        function getDay() {
            var newDay = day.clone();
            return newDay;
        }
        return [{date:day, availTime:{startTime:'09:00', endTime:'17:00'}},
                {date: getDay().add(1, "d"), availTime:{startTime:'11:00', endTime:'20:00'}},
                {date: getDay().add(2, "d"), availTime:{startTime:'08:00', endTime:'16:00'}},
                {date: getDay().add(3, "d"), availTime:{startTime:'10:00', endTime:'14:00'}},
                {date: getDay().add(4, "d"), availTime:{startTime:'09:00', endTime:'18:00'}},
                {date: getDay().add(5, "d"), availTime:{startTime:'17:00', endTime:'23:00'}},
                {date: getDay().add(6, "d"), availTime:{startTime:'09:00', endTime:'15:00'}},
                {date: getDay().add(7, "d"), availTime:{startTime:'17:00', endTime:'24:00'}},
                {date: getDay().add(8, "d"), availTime:{startTime:'09:00', endTime:'15:00'}},
                {date: getDay().add(9, "d"), availTime:{startTime:'17:00', endTime:'24:00'}},
        ];
// 
//                 {date: getDay().add(2, "d"), availTime:{startTime:'17:00', endTime:'23:00'}},
    }

     function processDays() {
         var slots = getSlots();
         var days= [];
         var B48 = [];
         for(var i=0; i<48; i++) B48.push(0);
          var session = {margin:0,showBar:false,bottomMargin: 20,barWidth: 0,
                        sh:0,eh:0, sm:0, em:0,showSt:true, showEt:true,
                    show:false,availTime:[],areas:[],booked:[],bookedArea:[],b48:clone(B48)};
        for(var i =0; i<slots.length; i++) {
           
            var day = {
                name: slots[i].date.format("ddd"),
                number: slots[i].date.format("DD MMM"),
                isCurrentMonth: moment().month() === slots[i].date.month(),
                isCurrentWeek: moment().week() === slots[i].date.week(),
                isToday: slots[i].date.isSame(new Date(), "day"),
                date: slots[i].date,
                bottomMargin: 20,
                session: [clone(session),clone(session)],
            }
            day.session[0].sn = 'am'; day.session[0].en = 'am';
            day.session[1].sn = 'pm'; day.session[1].en = 'pm';
            day.session[0].nextSession = day.session[1];
             var currentslot = slots[i];
            do {
                var amTime = {}; var pmTime = {}; 
                var stime = slots[i].availTime.startTime;
                var etime = slots[i].availTime.endTime;
                var shour = stime.substring(0,stime.indexOf(":"));
                var ehour = etime.substring(0,etime.indexOf(":"));
                var smin = stime.substring(stime.indexOf(":")+1);
                var emin = etime.substring(etime.indexOf(":")+1);
                if(shour<12) {
                    amTime.startTime=stime;
                    if(ehour<12) {
                        amTime.endTime = etime;
                    } else {
                        amTime.endTime = '12:00';
                        pmTime.startTime = '00:00';
                        pmTime.endTime = (ehour-12)+':'+emin;
                    }
                } else {
                    pmTime.startTime = (shour-12)+':'+smin;
                    pmTime.endTime = (ehour-12)+':'+emin;
                }
               
                if(!isEmpty(amTime)) {
                    amTime.leftMargin = getLeftMargin(amTime.startTime);
                   day.session[0].availTime.push(amTime);
                }
                if(!isEmpty(pmTime)) {
                   pmTime.leftMargin = getLeftMargin(pmTime.startTime);
                   day.session[1].availTime.push(pmTime);
                }
                i++;
                if(i===slots.length) break;
            }while(currentslot.date===slots[i].date) 
            i--;
            markSlots(day.session[0]); markSlots(day.session[1]);
            days.push(day);
        }
        for(var i=0; i<days.length-1; i++) {
            days[i].session[1].nextSession = days[i+1].session[0];
        }

        return days;
    }
        function getLeftMargin(startTime) {
            var hour = startTime.substring(0, startTime.indexOf(":"));
            var smin  = startTime.substring(startTime.indexOf(":")+1);
           return  hour*HOURWIDTH+((smin/15)*B15);
        }
        function markSlots(session) {
            var availTime = session.availTime;
            for(var i in availTime) {
                var shour = availTime[i].startTime.substring(0, availTime[i].startTime.indexOf(":"));
                var ehour = availTime[i].endTime.substring(0, availTime[i].endTime.indexOf(":"));
                var smin  = availTime[i].startTime.substring(availTime[i].startTime.indexOf(":")+1);
                var emin  = availTime[i].endTime.substring(availTime[i].endTime.indexOf(":")+1);
                var x = shour*4+(smin/15);
                var y = ehour*4+(emin/15);
                // console.log(x+" "+y);
                for(var j= x; j<y; j++) {
                    session.b48[j] = -1;
                }
           }
        }
        getTotalDays = function() {
           return  processDays().length;
        }
        getDays = function(start, end) {
            var days = [];
            for(var i=start; i<end && i<processDays().length; i++) {
                days.push(processDays()[i]);
            }
            return days;
        }

    return {
        getHours : getHours,
        getSlots : getSlots,
        getDays : getDays,
        getTotalDays : getTotalDays
    }
})









function clone(obj) {
    var copy;
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}