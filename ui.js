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
        $("#gchart").html("");
        radioOne();
    });

    //Executor Timeline Button
    $("#radio2").click(function(){
        $("#gchart").html("");
        radioTwo();
    });

    //Statistical Analysis Button
    $("#radio3").click(function(){
        $("#gchart").html("");
        radioThree();
    });

    //Development Suggestions
    $("#radio4").click(function(){
        $("#gchart").html("");
        radioFour();
    });
});

/**
 * Function Name: radioOne()
 * Arguments: None
 * Purpose: Describe actions when click radio button one
 */
function radioOne(){
    var durationTime = webData.Statistic.overallDuration;

    //Draw Annotation Bar
    $("#gchart").append(
        '<table border="1" style="width:1100px"><tr>'+
        '<td>x-axis: Time in second</td>'+
        '<td>y-axis: Task ID</td>'+
        '<td><div style="background-color: #3366cc; color:white">De: Deserialization</div></td>'+
        '<td><div style="background-color: #dc3912; color:white">Exe: Execution</div></td>'+
        '<td><div style="background-color: #ff9900; color:white">Ser: Serialization</div></td>'+
        '<td><div id="duration">Total Duration: <span id="durationTime"></span> min</div></td></tr>'+
        '</table>'
    );

    //Get duration time from data file
    $('#durationTime').html(durationTime);

    //Draw Task Timeline View
    $('#gchart').append('<div id="taskTimeline"></div>');
    loadAndDrawTaskTimeline('taskTimeline');
}

/**
 * Function Name: radioTwo()
 * Arguments: None
 * Purpose: Describe actions when click radio button two
 */
function radioTwo(){
    $("#gchart").append(
        '<table border="1" style="width:600px"><tr>'+
            '<td>x-axis: Time in second</td>'+
            '<td>y-axis: Executor ID</td>'+
            '<td>Number on each bar: Task ID</td>'+
            '</tr>'+
        '</table>'
    );
    $('#gchart').append('<div id="execTimeline"></div>');
    loadAndDrawExecTimeline('execTimeline');
}

/**
 * Function Name: radioThree()
 * Arguments: None
 * Purpose: Describe actions when click radio button three
 */
function radioThree(){
    $("#gchart").append('<div id="subRadio2"></div>');
    $("#subRadio2").append('<div id="statistic"></div>');
    $("#subRadio2").append('<div style="margin-top: 10px"; id="emptyTask"></div>');
    $("#subRadio2").append('<input style="margin-top: 50px" type="radio" id="subRadio2-1" name="histogram"><label for="subRadio2-1">Diserialization Time Histogram&emsp;</label>');
    $("#subRadio2").append('<input type="radio" id="subRadio2-2" name="histogram" checked="checked"><label for="subRadio2-2">Execution Time Histogram&emsp;</label>');
    $("#subRadio2").append('<input type="radio" id="subRadio2-3" name="histogram"><label for="subRadio2-3">Serialization Time Histogram&emsp;</label>');
    $("#subRadio2").append('<input type="radio" id="subRadio2-4" name="histogram"><label for="subRadio2-4">Scheduler Delay Histogram&emsp;</label>');
    $('#gchart').append('<div style="margin-top: 0px" id="histogram"></div>');

    // draw chart at div with id='histogram'
    drawChartHistogramExe('histogram');

    $('#statistic').html('');
    drawTableStatistic('statistic');

    drawTalbeEmptyTaskPercentage('emptyTask');

    // Sub-radio buttons for different histogram
    // 1. Deserilization Histogram
    $('#subRadio2-1').click(function(){
        drawChartHistogramDeser('histogram');
    });

    // 2. Execution Histogram
    $('#subRadio2-2').click(function(){
        drawChartHistogramExe('histogram');
    });

    // 3. Serialization Histogram
    $('#subRadio2-3').click(function(){
        drawChartHistogramSer('histogram');
    });

    // 4. Scheduler Delay Histogram
    $('#subRadio2-4').click(function(){
        drawChartHistogramSchedulerDelay('histogram');
    });
}

/**
 * Function Name: radioFour()
 * Arguments: None
 * Purpose: Describe actions when click radio button Four
 */
function radioFour(){
    $("gchart").append(
      '<div>Currently Under Construction...</div>'
    );
}

