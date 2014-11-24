/**
 * Created by pli on 7/24/14.
 */

drawHistogram = function (val) {
    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear().domain([0, 1]).range([0, width]);
    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram().bins(x.ticks(20))(val);
    var y = d3.scale.linear().domain([0, d3.max(data, function(d) { return d.y; })]).range([height, 0])
            .clamp(true)
        ;

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");

    var zoom = d3.behavior.zoom().y(y)
        .scaleExtent([1, 100])
        .on("zoom", draw);


    var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .call(zoom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        ;

    var bar = svg.append("svg")
            .attr("class", "barSvg")
            .attr("width", width)
            .attr("height", height)
            .selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
        ;

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(data[0].dx) - 1)
        .attr("height", function(d) { return height - y(d.y); });

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", x(data[0].dx) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0, 0)")
        .call(yAxis);


    function draw() {
        svg.select("g.x.axis").call(xAxis);
        svg.select("g.y.axis").call(yAxis);

        var barGroup = svg.selectAll(".bar");
        var rect = barGroup.selectAll("rect");
        var text = barGroup.selectAll("text")

        barGroup.attr("transform", function(d){
            return "translate(" + x(d.x) + "," + y(d.y) +
                ")scale(1, " + d3.event.scale + ")";

        });

        rect.attr("height", function(d) {
            var h = ((height - y(d.y)/d3.event.scale) > 0) ? (height - y(d.y)/d3.event.scale) :  0;
            return h;
        });

        text.attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", x(data[0].dx) / 2)
            .attr("text-anchor", "middle")
            .text(function(d) { return formatCount(d.y); });
    }
}