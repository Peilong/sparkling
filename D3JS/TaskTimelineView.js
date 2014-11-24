/**
 * Created by pli on 7/21/14.
 */
var tasks = new Array();
var taskNames = new Array();
/*
for(var i=0; i<4000; i++){
    tasks.push(new Object({
        "startDate":new Date("Sun Dec 09 02:16:45 EST 2012"),"endDate":new Date("Sun Dec 09 02:26:45 EST 2012"),"taskName":String(i),"status":"De"
    }));
    tasks.push(new Object({
        "startDate":new Date("Sun Dec 09 02:26:45 EST 2012"),"endDate":new Date("Sun Dec 09 02:36:59 EST 2012"),"taskName":String(i),"status":"Exe"
    }));
    tasks.push(new Object({
        "startDate":new Date("Sun Dec 09 02:36:59 EST 2012"),"endDate":new Date("Sun Dec 09 02:40:45 EST 2012"),"taskName":String(i),"status":"Ser"
    }));

    taskNames.push( String(i) );
}


 var lastTaskName = parseInt( taskNames[taskNames.length -1 ] ) + 1;
 taskNames.push( String(lastTaskName) );
*/
var taskStatus = {
    "De" : "deserializaiton",
    "Exe" : "execution",
    "Ser" : "serialization"
};

/*
tasks.sort(function(a, b) {
    return a.endDate - b.endDate;
});
var maxDate = tasks[tasks.length - 1].endDate;

tasks.sort(function(a, b) {
    return a.startDate - b.startDate;
});
var minDate = tasks[0].startDate;
*/

var taskNamesFiltered = new Array();

var format = "%H:%M:%S";
var timeDomainString = "5min";

var gantt;

function ganttChart(){
    gantt = d3.gantt(taskNamesFiltered.length).taskTypes(taskNames).taskStatus(taskStatus).tickFormat(format).height(450).width(1000);


    gantt.timeDomainMode("fixed");
    changeTimeDomain(timeDomainString);

    gantt(tasks);
}

function changeTimeDomain(timeDomainString) {
    this.timeDomainString = timeDomainString;
    switch (timeDomainString) {
        case "1min":
            format = "%H:%M:%S %L";
            gantt.timeDomain([ d3.time.minute.offset(getEndDate(), -1), getEndDate() ]);
            break;
        case "3min":
            format = "%H:%M:%S %L";
            gantt.timeDomain([ d3.time.minute.offset(getEndDate(), -3), getEndDate() ]);
            break;
        case "5min":
            format = "%H:%M:%S";
            gantt.timeDomain([ d3.time.minute.offset(getEndDate(), -5), getEndDate() ]);
            break;
        case "10min":
            format = "%H:%M:%S";
            gantt.timeDomain([ d3.time.minute.offset(getEndDate(), -10), getEndDate() ]);
            break;
        case "1hr":
            format = "%H:%M:%S";
            gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -1), getEndDate() ]);
            break;
        case "3hr":
            format = "%H:%M";
            gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -3), getEndDate() ]);
            break;

        case "6hr":
            format = "%H:%M";
            gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -6), getEndDate() ]);
            break;

        case "1day":
            format = "%H:%M";
            gantt.timeDomain([ d3.time.day.offset(getEndDate(), -1), getEndDate() ]);
            break;

        case "1week":
            format = "%a %H:%M";
            gantt.timeDomain([ d3.time.day.offset(getEndDate(), -7), getEndDate() ]);
            break;
        default:
            format = "%H:%M"

    }
    gantt.tickFormat(format);
    gantt.redraw(tasks);
}

function getEndDate() {
    var lastEndDate = Date.now();
    if (tasks.length > 0) {
        lastEndDate = tasks[tasks.length - 1].endDate;
    }

    return lastEndDate;
}

function addTask() {

    var lastEndDate = getEndDate();
    var taskStatusKeys = Object.keys(taskStatus);
    var taskStatusName = taskStatusKeys[Math.floor(Math.random() * taskStatusKeys.length)];
    var taskName = taskNames[Math.floor(Math.random() * taskNames.length)];

    tasks.push({
        "startDate" : d3.time.hour.offset(lastEndDate, Math.ceil(1 * Math.random())),
        "endDate" : d3.time.hour.offset(lastEndDate, (Math.ceil(Math.random() * 3)) + 1),
        "taskName" : taskName,
        "status" : taskStatusName
    });

    changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};

function removeTask() {
    tasks.pop();
    changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};


/**
 * Function Name: tsToTime()
 * Arguments: ts
 * Purpose: Convert TimeStamp To Date Time.
 */
function tsToTime(ts) {
    var time = new Date(ts);
    var tsToTimeObj = {
        'year':time.getYear(),
        'mon':time.getMonth() + 1,
        'day':time.getDate(),
        'hour':time.getHours(),
        'minu':time.getMinutes(),
        'sec':time.getSeconds(),
        'mili':time.getMilliseconds()
    };
    return tsToTimeObj;
}

/**
 * Function Name: loadAndDrawTaskTimeline()
 * Arguments: div_id
 * Purpose: Load data and call the draw chart function.
 */
function drawTaskTimeline(div_id){
    var data = webData.TimelineData;
    for(var i in data){
        var startTime = tsToTime(parseInt(data[i][2]));
        var endTime = tsToTime(parseInt(data[i][3]));
        if (typeof (data[i][2]) == "string"){
            data[i][2] = new Date (
                startTime.year, startTime.mon, startTime.day, startTime.hour,
                startTime.minu, startTime.sec, startTime.mili);
            data[i][3] = new Date (
                endTime.year, endTime.mon, endTime.day, endTime.hour,
                endTime.minu, endTime.sec, endTime.mili);
        }
    }
    drawGantt(data, div_id);
}

/**
 * Function Name: drawChartTaskTimeline()
 * Arguments: data, div_id
 * Purpose: Draw the task timeline view @div_id with "data".
 */
function drawGantt(data,div_id) {
    for(var i in data){
        tasks.push( new Object({
            startDate: new Date(data[i][2]),
            endDate: new Date(data[i][3]),
            taskName: data[i][0],
            status: data[i][1]
        }) );

        taskNames.push( data[i][0] );
    }

    taskNamesFiltered = taskNames.filter(function(item, i, taskNames){
        return (i == taskNames.indexOf(item));
    });


    var lastTaskName = parseInt( taskNamesFiltered[taskNamesFiltered.length -1 ] ) + 1;
    taskNamesFiltered.push( String(lastTaskName) );

    ganttChart();
}