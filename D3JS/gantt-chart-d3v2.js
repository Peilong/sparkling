/**
 * @author Dimitry Kudrayvtsev
 * @changed: Peilong Li
 * @version 2.0
 */

d3.gantt = function (taskNum){
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";

    var margin = {
        top : 20,
        right : 40,
        bottom : 20,
        left : 50,
        threshold: (taskNum > 10)? taskNum/10: 1
    };
    var timeDomainStart = d3.time.day.offset(new Date(),-3);
    var timeDomainEnd = d3.time.hour.offset(new Date(),+3);
    var timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
    var taskTypes = [];
    var taskStatus = [];
    var height = document.body.clientHeight - margin.top - margin.bottom-5;
    var width = document.body.clientWidth - margin.right - margin.left-5;
    /* var height = (window.innerHeight - margin.top - margin.bottom - 5)
        || (document.documentElement.clientHeight - margin.top - margin.bottom - 5)
        || (document.body.clientHeight - margin.top - margin.bottom - 5);
    var width = (window.innerWidth - margin.right - margin.left - 5)
        || (document.documentElement.clientWidth - margin.right - margin.left - 5)
        || (document.body.clientWidth - margin.right - margin.left - 5);
    */
    var tickFormat = "%H:%M:%S %L";

    var keyFunction = function(d) {
        return d.startDate + d.taskName + d.endDate;
    };

    var rectTransform = function(d) {
        return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
    };

    var x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);

    var y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, margin.threshold * height - margin.top - margin.bottom ], .1);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
        .tickSize(8).tickPadding(8);

    var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

    var initTimeDomain = function() {
        if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
            if (tasks === undefined || tasks.length < 1) {
                timeDomainStart = d3.time.day.offset(new Date(), -3);
                timeDomainEnd = d3.time.hour.offset(new Date(), +3);
                return;
            }
            tasks.sort(function(a, b) {
                return a.endDate - b.endDate;
            });
            timeDomainEnd = tasks[tasks.length - 1].endDate;
            tasks.sort(function(a, b) {
                return a.startDate - b.startDate;
            });
            timeDomainStart = tasks[0].startDate;
        }
    };

    var initAxis = function() {
        x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
        y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, margin.threshold * height - margin.top - margin.bottom ], .1);
        xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
            .tickSize(8).tickPadding(8);

        yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
    };

    function gantt(tasks) {

        initTimeDomain();
        initAxis();

        var svg = d3.select('#svgWrapper')
            //.select("body")
            .append("div")
            .attr("id", "outter")
            .append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
            /*.append("g")
            .attr("class", "gantt-chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", 2*(height + margin.top + margin.bottom))
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")") */



        document.getElementById("outter").style.width = width + margin.left + margin.right + 'px';
        document.getElementById("outter").style.height = height + margin.top + margin.bottom + 'px';
/*
        svg.selectAll(".chart")
            .data(tasks, keyFunction).enter()
            .append("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", function(d){
                if(taskStatus[d.status] == null){ return "bar";}
                return taskStatus[d.status];
            })
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            });
            */

        var innerSvg = d3.select("#outter")
            .append("div")
            .attr("id", "inner")
            .append("svg")
            .attr("class", "innerSvg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", margin.threshold * height - margin.top - margin.bottom)
            .append("g")
            .attr("class", "gantt-chart")
            .attr("id", "gchart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", margin.threshold * height - margin.top - margin.bottom)
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


        document.getElementById("inner").style.width = width + margin.left + margin.right + 'px';
        document.getElementById("inner").style.height = height - margin.top - margin.bottom + 'px';


        innerSvg.selectAll(".innerSvg")
            .data(tasks, keyFunction).enter()
            .append("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", function(d){
                if(taskStatus[d.status] == null){ return "bar";}
                return taskStatus[d.status];
            })
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            });

        /*
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
            .transition()
            .call(xAxis);

        svg.append("g").attr("class", "y axis").transition().call(yAxis);
        */


        d3.select("svg")
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + margin.left + ", " + (height - margin.top - margin.bottom) + ")")
            .transition()
            .call(xAxis);

        //d3.select("svg")
        innerSvg.append("g")
            .attr("class", "y axis")
            //.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
            .transition()
            .call(yAxis);


        //Draw grid at xAxis
        innerSvg.append("g")
        //d3.select("svg").append("g")
            .attr("class", "grid")
            .attr("id", "x-grid")
            .attr("transform", "translate(0," + (margin.threshold * height) + ")")
            .call(gantt.make_x_axis()
                .tickSize(-(margin.threshold * height), 0, 0)
                .tickFormat("")
            );

        //Draw grid at yAxis
        innerSvg.append("g")
            .attr("class", "grid")
            .attr("id", "y-grid")
            .call(gantt.make_y_axis()
                .tickSize(-width, 0, 0)
                .tickFormat("")
            );

        return gantt;

    };

    gantt.redraw = function(tasks) {

        initTimeDomain();
        initAxis();

        //var svg = d3.select("svg");
        var svg = d3.select("#outter");

        var ganttChartGroup = svg.select(".gantt-chart");
        var rect = ganttChartGroup.selectAll("rect").data(tasks, keyFunction);

        rect.enter()
            .insert("rect",":first-child")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", function(d){
                if(taskStatus[d.status] == null){ return "bar";}
                return taskStatus[d.status];
            })
            .transition()
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            });

        rect.transition()
            .attr("transform", rectTransform)
            .attr("height", function(d) { return y.rangeBand(); })
            .attr("width", function(d) {
                return (x(d.endDate) - x(d.startDate));
            });

        rect.exit().remove();

        svg.select(".x").transition().call(xAxis);
        svg.select(".y").transition().call(yAxis);

        //Draw grid at xAxis
       d3.select("#x-grid")
            .attr("transform", "translate(0," + (margin.threshold * height) + ")")
            .call(gantt.make_x_axis()
                .tickSize(-(margin.threshold * height), 0, 0)
                .tickFormat("")
            );

        return gantt;
    };

    gantt.margin = function(value) {
        if (!arguments.length)
            return margin;
        margin = value;
        return gantt;
    };

    gantt.timeDomain = function(value) {
        if (!arguments.length)
            return [ timeDomainStart, timeDomainEnd ];
        timeDomainStart = +value[0], timeDomainEnd = +value[1];
        return gantt;
    };

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    gantt.timeDomainMode = function(value) {
        if (!arguments.length)
            return timeDomainMode;
        timeDomainMode = value;
        return gantt;

    };

    gantt.taskTypes = function(value) {
        if (!arguments.length)
            return taskTypes;
        taskTypes = value;
        return gantt;
    };

    gantt.taskStatus = function(value) {
        if (!arguments.length)
            return taskStatus;
        taskStatus = value;
        return gantt;
    };

    gantt.width = function(value) {
        if (!arguments.length)
            return width;
        width = +value;
        return gantt;
    };

    gantt.height = function(value) {
        if (!arguments.length)
            return height;
        height = +value;
        return gantt;
    };

    gantt.tickFormat = function(value) {
        if (!arguments.length)
            return tickFormat;
        tickFormat = value;
        return gantt;
    };

    //Draw grid funciton
    gantt.make_x_axis = function(){
        return d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(10);
    }

    gantt.make_y_axis = function(){
        return d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);
    }


    return gantt;
};