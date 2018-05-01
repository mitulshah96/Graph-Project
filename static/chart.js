var Chart = function(opts) {
    this.data = opts.data;
    this.element = opts.element;

    this.draw();
}

Chart.prototype.draw = function() {
    // set the dimensions of the canvas
    this.margin = {top: 20, right: 20, bottom: 70, left: 40};
    this.width = 600 - this.margin.left - this.margin.right;
    this.height = 300 - this.margin.top - this.margin.bottom;
    
    // set up parent element and SVG
    this.element.innerHTML = '';

    this.tooltip = d3.select(this.element).append("div").attr("class", "toolTip");

    var svg = d3.select(this.element).append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)

    this.plot = svg.append('g')
        .attr('transform','translate('+this.margin.left+','+this.margin.top+')');
    
    // create the other stuff
    this.createScales();
    this.addAxes();
    this.addLine();

}

Chart.prototype.createScales = function(){
    // set the ranges
    this.x = d3.scale.ordinal()
        .rangeRoundBands([0, this.width], .05)
        .domain(this.data.map(function(d) { return d.key; }));
    this.y = d3.scale.linear()
        .range([this.height, 0])
        .domain([0, d3.max(this.data, function(d) { return d.value; })]);
}

Chart.prototype.addAxes = function(){
    // define the axis
    var xAxis = d3.svg.axis()
        .scale(this.x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(this.y)
        .orient("left")
        .ticks(10);

    // add axis
    this.plot.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
        .call(xAxis)
    .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "translate(20,10)" );

    this.plot.append("g")
        .attr("class", "y axis")
        .call(yAxis)
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
}

Chart.prototype.addLine = function(){
    // need to load `this` into `_this`...
    var _this = this;

    // Add bar chart
    this.plot.selectAll("bar")
        .data(this.data)
    .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return _this.x(d.key); })
        .attr("width", _this.x.rangeBand())
        .attr("y", function(d) { return _this.y(d.value); })
        .attr("height", function(d) { return _this.height - _this.y(d.value); })
        .style("fill", this.color || "steelblue")
        .on("mousemove", function(d){
            _this.tooltip.style("left", d3.event.pageX - 50 + "px")
                .style("top", d3.event.pageY - 70 + "px")
                .style("display", "inline-block")
                .html((d.key) + "<br>"+ (d.value));
        })
        .on("mouseout", function(d){ 
            _this.tooltip.style("display", "none");
        });
}

Chart.prototype.setColor = function(newColor) {
    this.plot.selectAll('.bar')
        .style('fill',newColor);
        
    // store for use when redrawing
    this.color = newColor;
}

Chart.prototype.setData = function(newData) {
    this.data = newData;
    
    this.draw();
}

var chart = new Chart({
	element: document.querySelector('.chart-container'),
    data: [
        {
            "key" : "Comments",
            "value" : 0
        },
        {
            "key" : "Likes",
            "value" : 0
        },
        {
            "key" : "Tags",
            "value" : 0
        },
        {
            "key" : "Share",
            "value" : 0
        }
    ]
});

d3.selectAll('button.color').on('click', function(){
    var color = d3.select(this).text();
    chart.setColor( color );
});

d3.selectAll('button.data').on('click', function(){
    chart.setData([
        {
            "key" : "Comments",
            "value" : 15
        },
        {
            "key" : "Likes",
            "value" : 200
        },
        {
            "key" : "Tags",
            "value" : 4
        },
        {
            "key" : "Share",
            "value" : 2
        }
    ]);
});

d3.select(window).on('resize', function(){
    chart.draw(); 
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// static code ( Please Ignore )
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// var imageData = [
//     {
//         "key" : "Comments",
//         "value" : 25
//     },
//     {
//         "key" : "Likes",
//         "value" : 300
//     },
//     {
//         "key" : "Tags",
//         "value" : 2
//     },
//     {
//         "key" : "Share",
//         "value" : 5
//     }
// ];
// drawGraph(imageData);
// function drawGraph(imageData){
//     // set the dimensions of the canvas
//     var margin = {top: 20, right: 20, bottom: 70, left: 40},
//         width = 600 - margin.left - margin.right,
//         height = 300 - margin.top - margin.bottom;
//     // tooltip
//     var tooltip = d3.select("body").append("div").attr("class", "toolTip");
//     // set the ranges
//     var x = d3.scale.ordinal()
//         .rangeRoundBands([0, width], .05)
//         .domain(imageData.map(function(d) { return d.key; }));
//     var y = d3.scale.linear()
//         .range([height, 0])
//         .domain([0, d3.max(imageData, function(d) { return d.value; })]);
//     // define the axis
//     var xAxis = d3.svg.axis()
//         .scale(x)
//         .orient("bottom");
//     var yAxis = d3.svg.axis()
//         .scale(y)
//         .orient("left")
//         .ticks(10);
//     // add the SVG element
//     var svg = d3.select("body").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//         .attr("transform", 
//             "translate(" + margin.left + "," + margin.top + ")");
//     // add axis
//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis)
//     .selectAll("text")
//         .style("text-anchor", "end")
//         .attr("dx", "-.8em")
//         .attr("dy", "-.55em")
//         .attr("transform", "translate(20,10)" );
//     svg.append("g")
//         .attr("class", "y axis")
//         .call(yAxis)
//     .append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 5)
//         .attr("dy", ".71em")
//         .style("text-anchor", "end")
//     // Add bar chart
//     svg.selectAll("bar")
//         .data(imageData)
//     .enter().append("rect")
//         .attr("class", "bar")
//         .attr("x", function(d) { return x(d.key); })
//         .attr("width", x.rangeBand())
//         .attr("y", function(d) { return y(d.value); })
//         .attr("height", function(d) { return height - y(d.value); })
//         .on("mousemove", function(d){
//             tooltip.style("left", d3.event.pageX - 50 + "px")
//                 .style("top", d3.event.pageY - 70 + "px")
//                 .style("display", "inline-block")
//                 .html((d.key) + "<br>"+ (d.value));
//         })
//         .on("mouseout", function(d){ 
//             tooltip.style("display", "none");
//         });
// }

{/* <style>
    .axis {
        font: 10px sans-serif;
    }

    .axis path,
    .axis line {
        fill: none;
        stroke: #000;
    }

    .toolTip {
        position: absolute;
        display: none;
        min-width: 80px;
        height: auto;
        background: none repeat scroll 0 0 #ffffff;
        border: 1px solid #6F257F;
        padding: 14px;
        text-align: center;
    }
</style> */}