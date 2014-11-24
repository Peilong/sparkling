/**
 * Author: Peilong Li
 * Date: 01/27/14.
 * Purpose: Functions that draw Google Charts.
 */

// Create webData Object
var webData = new Object();
var loaded = false;


//$(function(){

//});

/**
 * Function Name: firstFunction()
 * Arguments: myjson
 * Purpose: Load JSON data after 500 ms of loading page.
 * TODO: find a way to load data without waiting.
 */
function firstFunction( myjson ){
    if( myjson == ""){
        loadData();
    } else{
        loadData( myjson );
    }
    setTimeout(function(){
        radioOne();
    }, 500);
}


/**
 * Function Name: loadData()
 * Arguments: jsonData
 * Purpose: 1. Load default web view data from default directory if no data is uploaded.
 *          2. Parse the data if there is a uploaded JSON data file.
 */
function loadData(jsonData){
    if (jsonData == undefined){
        $.ajax({
            url : "data/webView-default.txt",
            dataType: "json",
            success : function (localdata) {
                webData = localdata;
                loaded = true;
            }
        });
    }
    else{
        webData = JSON.parse(jsonData);
    }
}

/**
 * Function Name: loadAndDrawTaskTimeline()
 * Arguments: div_id
 * Purpose: Load data and call the draw chart function.
 */
function loadAndDrawTaskTimeline(div_id){
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
    drawChartTaskTimeline(data, div_id);
}

/**
 * Function Name: drawChartTaskTimeline()
 * Arguments: data, div_id
 * Purpose: Draw the task timeline view @div_id with "data".
 */
function drawChartTaskTimeline(data,div_id) {
    var container = document.getElementById(div_id);
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: 'string', id: 'TID' });
    dataTable.addColumn({ type: 'string', id: 'Host' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });

    dataTable.addRows(data);

    // Set chart options
    var options = {'title':'Task Timeline View',
        'width':1200,
        'height':500,
        'forceIFrame':true
    };

    chart.draw(dataTable, options);
}

/**
 * Function Name: loadAndDrawExeTimeline()
 * Arguments: div_id
 * Purpose: Load data and call the draw chart function.
 */
function loadAndDrawExecTimeline(div_id){
    var data = webData.ExecTimeline;
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
    drawChartExecTimeline(data, div_id);
}

/**
 * Function Name: drawChartExecTimeline()
 * Arguments: data, div_id
 * Purpose: Draw the executor timeline view @div_id with "data".
 */
function drawChartExecTimeline(data,div_id) {
    var container = document.getElementById(div_id);
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();

    dataTable.addColumn({ type: 'string', id: 'ExecutorID' });
    dataTable.addColumn({ type: 'string', id: 'TaskID' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });

    dataTable.addRows(data);

    // Set chart options
    var options = {'title':'Executor Timeline View',
        'width':1200,
        'height':500,
        'forceIFrame':true
    };

    chart.draw(dataTable, options);
}

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
 * Function Name: tsToTime()
 * Arguments: ts
 * Purpose: Convert TimeStamp To Date Time.
 */
var options = {
    title: '',
    height: '600',
    width: '800',
    legend: 'none',
    histogram: {bucketSize: '1000'},
    hAxis: {title: "Duration in ms", viewWindow:{}},
    vAxis: {title: "Number of Counts", logScale: 'false'}
    //chartArea: {left:100, top:50, width: "80%", height: "60%"}
};

/**
 * Function Name: drawChartHistogramDeser()
 * Arguments: div_id
 * Purpose: Draw Deserialization histogram @div_id.
 */
function drawChartHistogramDeser(div_id){
    var data = webData.DeserTimeData;
    var dataTable = new google.visualization.arrayToDataTable(data);
    var hAxisMax = webData.Statistic.deserTimeMax;

    options.title = 'Task Deserialization Time Histogram';
    options.hAxis.viewWindow.max = hAxisMax;
    options.histogram.bucketSize = hAxisMax/100;

    var chart = new google.visualization.Histogram(document.getElementById(div_id));
    chart.draw(dataTable, options);
}

/**
 * Function Name: drawChartHistogramExe()
 * Arguments: div_id
 * Purpose: Draw Execution histogram @div_id.
 */
function drawChartHistogramExe(div_id){
    var data = webData.ExeTimeData;
    var dataTable = new google.visualization.arrayToDataTable(data);
    var hAxisMax = webData.Statistic.exeTimeMax;

    options.title = 'Task Execution Time Histogram';
    options.hAxis.viewWindow.max = hAxisMax;
    options.histogram.bucketSize = hAxisMax/100;
    options.chartArea = {left:100,top:60,width:'80%',height:'70%'};

    var chart = new google.visualization.Histogram(document.getElementById(div_id));
    chart.draw(dataTable, options);
}

/**
 * Function Name: drawChartHistogramSer()
 * Arguments: div_id
 * Purpose: Draw Serialization histogram @div_id.
 */
function drawChartHistogramSer(div_id){
    var data = webData.SerTimeData;
    var dataTable = new google.visualization.arrayToDataTable(data);
    var hAxisMax = webData.Statistic.serTimeMax;

    options.title = 'Task Serialization Time Histogram';
    options.hAxis.viewWindow.max = hAxisMax;
    options.histogram.bucketSize = hAxisMax/hAxisMax;

    var chart = new google.visualization.Histogram(document.getElementById(div_id));
    chart.draw(dataTable, options);
}

/**
 * Function Name: drawChartHistogramSchedulerDelay()
 * Arguments: div_id
 * Purpose: Draw Scheduler Delay histogram @div_id.
 */
function drawChartHistogramSchedulerDelay(div_id){
    var data = webData.SchedulerData;
    var dataTable = new google.visualization.arrayToDataTable(data);
    var hAxisMax = webData.Statistic.schedulerDelayMax;

    options.title = 'Scheduler Delay Histogram';
    options.hAxis.viewWindow.max = hAxisMax;
    options.histogram.bucketSize = hAxisMax/100;

    var chart = new google.visualization.Histogram(document.getElementById(div_id));
    chart.draw(dataTable, options);
}

/**
 * Function Name: drawTableStatistics()
 * Arguments: div_id
 * Purpose: Draw the table of statistics @div_id.
 */
function drawTableStatistic(div_id){
    var data = webData.Statistic;
    var tableData = new google.visualization.DataTable();
    tableData.addColumn('string', 'Item');
    tableData.addColumn('number', 'Max Time (ms)');
    tableData.addColumn('number', 'Min Time (ms)');
    tableData.addColumn('number', 'Average Time (ms)');
    tableData.addColumn('number', 'Standard Deviation (ms)');
    tableData.addRows([
        ['Deserialization Stage', data.deserTimeMax, data.deserTimeMin, data.deserTimeAverage, data.deserTimeStd],
        ['Execution Stage', data.exeTimeMax, data.exeTimeMin, data.exeTimeAverage, data.exeTimeStd],
        ['Serialization Stage', data.serTimeMax, data.serTimeMin, data.serTimeAverage, data.serTimeStd],
        ['Scheduler Delay', data.schedulerDelayMax, data.schedulerDelayMin, data.schedulerDelayAverage, data.schedulerDelayStd]
    ]);

    var table = new google.visualization.Table(document.getElementById(div_id));
    table.draw(tableData, {showRowNumber: true});
}

/**
 * Function Name: drawTableEmptyTaskPercentage()
 * Arguments: div_id
 * Purpose: Draw the table of empty task percentage @div_id.
 */
function drawTalbeEmptyTaskPercentage(div_id){
    var data = webData.Statistic;
    var tableData = new google.visualization.DataTable();
    tableData.addColumn('string', 'Item');
    tableData.addColumn('number', 'Empty Task Percentage (%)');
    tableData.addRows([
        ['Empty Task (Small Task)',data.emptyTaskPercentage]
    ]);

    var table = new google.visualization.Table(document.getElementById(div_id));
    table.draw(tableData, {showRowNumber: true});
}
