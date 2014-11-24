/**
 * Author: Peilong Li
 * Date: 01/28/14.
 * Purpose: Show different views under different radio buttons.
 */
$(function() {
    $("#radio" )
        .css({ height:'40px', width: '1000px', fontSize:'8', 'padding-top': '20px', 'padding-bottom': '20px' })
        .buttonset();

    // Task Timeline Button
    $("#radio1").click(function(){
        $("#scaleButton").html("");
        $("#svgWrapper").html("");
        radioOne();
    });

    //Executor Timeline Button
    $("#radio2").click(function(){
        $("#scaleButton").html("");
        $("#svgWrapper").html("");
        radioTwo();
    });

    //Statistical Analysis Button
    $("#radio3").click(function(){
        $("#scaleButton").html("");
        $("#svgWrapper").html("");
        radioThree();
    });

    //Development Suggestions
    $("#radio4").click(function(){
        $("#scaleButton").html("");
        $("#svgWrapper").html("");
        radioFour();
    });
});

/**
 * Function Name: addScaleButton()
 * Arguments: div_id
 * Purpose: Add scale button to the page @div_id
 */
function addScaleButton(div_id){
    $(div_id).append(
            '<button type="button" onclick="changeTimeDomain(\'1min\')">1 MIN</button>'+
            '<button type="button" onclick="changeTimeDomain(\'3min\')">3 MIN</button>'+
            '<button type="button" onclick="changeTimeDomain(\'5min\')">5 MIN</button>'+
            '<button type="button" onclick="changeTimeDomain(\'10min\')">10 MIN</button>'+
            '<button type="button" onclick="changeTimeDomain(\'1hr\')">1 HR</button>'+
            '<button type="button" onclick="changeTimeDomain(\'3hr\')">3 HR</button>'+
            '<button type="button" onclick="changeTimeDomain(\'6hr\')">6 HR</button>'+
            '<button type="button" onclick="changeTimeDomain(\'1day\')">1 DAY</button>'+
            '<button type="button" onclick="changeTimeDomain(\'1week\')">1 WEEK</button>'
    );
}

/**
 * Function Name: radioOne()
 * Arguments: None
 * Purpose: Describe actions when click radio button one
 */
function radioOne(){
    var durationTime = webData.Statistic.overallDuration;
    addScaleButton("#scaleButton");

    //Draw Annotation Bar
    $("#svgWrapper").append(
        '<table border="1" style="width:1100px"><tr>'+
            '<td>x-axis: Time</td>'+
            '<td>y-axis: Task ID</td>'+
            '<td><div style="background-color: #33b5e5; color:white">De: Deserialization</div></td>'+
            '<td><div style="background-color: #CC0000; color:white">Exe: Execution</div></td>'+
            '<td><div style="background-color: #ffbb33; color:white">Ser: Serialization</div></td>'+
            '<td><div id="duration">Total Duration: <span id="durationTime"></span> min</div></td></tr>'+
            '</table>'
    );

    //Get duration time from data file
    $('#durationTime').html(durationTime);

    //Draw Task Timeline View
    $('#svgWrapper').append('<div id="taskTimeline"></div>');
    drawTaskTimeline('taskTimeline');
}

/**
 * Function Name: radioTwo()
 * Arguments: None
 * Purpose: Describe actions when click radio button two
 */
function radioTwo(){
    addScaleButton("#scaleButton");
    $("#svgWrapper").append(
        '<table border="1" style="width:600px"><tr>'+
            '<td>x-axis: Time in second</td>'+
            '<td>y-axis: Executor ID</td>'+
            '<td>Number on each bar: Task ID</td>'+
            '</tr>'+
            '</table>'
    );
    $('#svgWrapper').append('<div id="execTimeline"></div>');
    //loadAndDrawExecTimeline('execTimeline');
}

/**
 * Function Name: radioThree()
 * Arguments: None
 * Purpose: Describe actions when click radio button three
 */
function radioThree(){
    $("#svgWrapper").append('<div id="subRadio2"></div>');
    $("#subRadio2").append('<div id="statistic"></div>');
    $("#subRadio2").append('<div style="margin-top: 10px"; id="emptyTask"></div>');
    $("#subRadio2").append('<input style="margin-top: 50px" type="radio" id="subRadio2-1" name="histogram"><label for="subRadio2-1">Diserialization Time Histogram&emsp;</label>');
    $("#subRadio2").append('<input type="radio" id="subRadio2-2" name="histogram" checked="checked"><label for="subRadio2-2">Execution Time Histogram&emsp;</label>');
    $("#subRadio2").append('<input type="radio" id="subRadio2-3" name="histogram"><label for="subRadio2-3">Serialization Time Histogram&emsp;</label>');
    $("#subRadio2").append('<input type="radio" id="subRadio2-4" name="histogram"><label for="subRadio2-4">Scheduler Delay Histogram&emsp;</label>');
    $('#svgWrapper').append('<div style="margin-top: 0px" id="histogram"></div>');

    // draw chart at div with id='histogram'
    drawChartHistogramExe('histogram');

    $('#statistic').html('');
    drawTableStatistic('statistic');

    drawTalbeEmptyTaskPercentage('emptyTask');

    // Sub-radio buttons for different histogram
    // 1. Deserilization Histogram
    $('#subRadio2-1').click(function(){
     //   drawChartHistogramDeser('histogram');
    });

    // 2. Execution Histogram
    $('#subRadio2-2').click(function(){
        drawChartHistogramExe('histogram');
    });

    // 3. Serialization Histogram
    $('#subRadio2-3').click(function(){
    //    drawChartHistogramSer('histogram');
    });

    // 4. Scheduler Delay Histogram
    $('#subRadio2-4').click(function(){
     //   drawChartHistogramSchedulerDelay('histogram');
    });
}

/**
 * Function Name: radioFour()
 * Arguments: None
 * Purpose: Describe actions when click radio button Four
 */
function radioFour(){
    $("#svgWrapper").append(
        '<div>Currently Under Construction...</div>'
    );
}

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