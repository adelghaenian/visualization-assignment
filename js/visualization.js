var section_1_data, legends_data, colors, market_disruption_data, paper_data, paper_title,
    paper_colors, linear_data, linear_data_second, recovery_data, recovery_legends_data, recovery_legends_data;
var collaboration_data;

//Reading data from the file and copy the proper data to our variables
d3.json("data/data.json").then((json) => {
    colors = json['colors']
    section_1_data = json['section_1_data']
    legends_data = json['section_1_legends_data']
    market_disruption_data = json['section_2_data']
    paper_data = json['section_3_data']
    paper_titles = json['section_3_titles']
    paper_colors = json['section_3_colors']
    linear_data = json['section_4_data']
    linear_data_second = json['section_5_data']
    recovery_data = json['section_6_data']
    recovery_legends_data = json['section_6_legends_data']
    collaboration_data = json['section_7_data']
    render();
});

//graph sections are devided into 7, we render each indivisually
var render = function () {
    render_section_1()
    render_section_2()
    render_section_3()
    render_section_4()
    render_section_5()
    render_section_6()
    render_section_7()
}

var render_section_1 = function () {
    var total = 0;
    for (var i = 0; i < section_1_data.length; i++) {
        total += section_1_data[i];
    }
    var svg = d3.select("#donut-chart-container").select("svg");
    let g = svg.append("g")
        .attr("transform", "translate(95,120)");
    var pie = d3.pie().sort(null);
    // Creating arc 
    var arc = d3.arc()
        .innerRadius(25)
        .outerRadius(85);

    // Grouping different arcs 
    var arcs = g.selectAll("arc")
        .data(pie(section_1_data))
        .enter()
        .append("g");

    // Appending path  
    arcs.append("path")
        .attr("fill", (section_1_data, i) => {
            let value = section_1_data.data;
            return colors[i];
        })
        .attr("transform", function (path) {
            middleAngle = -Math.PI / 2 + (path.startAngle + path.endAngle) / 2;
            dx = Math.cos(middleAngle);
            dy = Math.sin(middleAngle);
            return "translate(" + dx + ", " + dy + ")";
        })
        .transition().delay(function (d, i) {
            return i * 300;
        }).duration(300)
        .attrTween('d', function (d) {
            var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
            return function (t) {
                d.endAngle = i(t);
                return arc(d);
            }
        });

    //adding aniamtion on mouse hover
    arcs.selectAll("path")
        .on("mouseover", function (i, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("transform", "scale(1.15)")
        })
        .on("mouseout", function (i, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("transform", "scale(1)")
        })



    arcs.append("text")
        .attr("transform", (d, i) => {
            if (section_1_data[i] / total < 0.1) {
                return "translate(" + [(arc.centroid(d)[0] * 1.7 - 18), arc.centroid(d)[1] * 1.7] + ")";
            } else {
                return "translate(" + [arc.centroid(d)[0] - 18, arc.centroid(d)[1]] + ")";
            }
        })
        .attr("fill", function (d, i) {
            if (section_1_data[i] / total < 0.1) {
                return "#5C5B5C";
            } else {
                return colors[i + 1 % colors.length];
            }
        })
        .attr("font-size", function (d, i) {
            let val = (section_1_data[i] / total) * 20 + 15;
            return val + "px";
        })
        .attr("class", "donut-chart-label")
        .text(function (d) {
            return d.data + "%";
        });



    // adding data legends
    var legends = svg.append("g").attr("transform", "translate(210, 0)").selectAll(".legends").data(legends_data);
    var legend = legends.enter().append("g").classed("legends", true).attr("transform", function (d, i) {
        return "translate(-10, " + (i) * 50 + ")";
    });
    legend.append("rect").attr("width", 12).attr("height", 12).attr("fill", function (d, i) {
        return colors[i];
    });
    legend.append("text").attr("class", "legend-title").text(function (d, i) {
        return legends_data[i][0];
    }).attr("transform", "translate(15,+12)");

    legend.append("foreignObject")
        .attr("width", 150)
        .attr("height", 50)
        .append("xhtml:p")
        .style("font-size", "9.5px")
        .style("margin-top", "14px")
        .html((i, d) => {
            return legends_data[d];
        });
}

var render_section_2 = function () {
    var p = d3.select("body")
        .selectAll(".market-percent")
        .data(market_disruption_data)
        .text(0)
        .transition()
        .duration(1000)
        .tween("text", function (d) {
            var i = d3.interpolate(this.textContent, d),
                prec = (d + "%").split("."),
                round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

            return function (t) {
                this.textContent = Math.round(i(t) * round) / round + "%";
            };
        });;
}

var render_section_3 = function () {

    total = paper_data[0] + paper_data[1] + paper_data[2] + paper_data[3];

    var paper_count = 40;
    var empty_array = []

    for (var i = 0; i < paper_count; i++) {
        empty_array.push(0);
    }

    var svg = d3.select("#paper-box-container").select("svg");

    let papers = svg.append("g")
        .attr("transform", "translate(250,0) scale(0.8)");

    papers.append("path")
        .attr("d", "M35.707,75.6h0L0,54.376,48.018,27.2,83.655,48.319,35.708,75.6ZM13.128,51.265a1.079,1.079,0,0,0-.916.5,1.03,1.03,0,0,0-.136.794,1.051,1.051,0,0,0,.48.661L37.25,68.31a1.093,1.093,0,0,0,.57.161,1.081,1.081,0,0,0,.916-.5,1.031,1.031,0,0,0,.137-.795,1.05,1.05,0,0,0-.48-.66L13.7,51.426A1.091,1.091,0,0,0,13.128,51.265Zm5.931-3.693a1.077,1.077,0,0,0-.914.5,1.028,1.028,0,0,0-.137.794,1.047,1.047,0,0,0,.48.659l24.7,15.1a1.092,1.092,0,0,0,.57.16,1.078,1.078,0,0,0,.915-.5,1.027,1.027,0,0,0,.138-.793,1.048,1.048,0,0,0-.48-.66L19.63,47.733A1.093,1.093,0,0,0,19.059,47.572Zm6.285-3.693a1.079,1.079,0,0,0-.916.5,1.031,1.031,0,0,0-.136.8,1.046,1.046,0,0,0,.48.658l24.694,15.1a1.092,1.092,0,0,0,.57.16,1.079,1.079,0,0,0,.916-.5,1.028,1.028,0,0,0,.136-.793,1.048,1.048,0,0,0-.48-.66L25.914,44.04A1.094,1.094,0,0,0,25.344,43.879Zm7.01-3.692a1.079,1.079,0,0,0-.916.5,1.028,1.028,0,0,0-.136.793,1.048,1.048,0,0,0,.48.66l24.694,15.1a1.092,1.092,0,0,0,.57.16,1.079,1.079,0,0,0,.916-.5,1.031,1.031,0,0,0,.136-.8,1.046,1.046,0,0,0-.48-.658l-24.694-15.1A1.094,1.094,0,0,0,32.354,40.187Zm5.931-3.693a1.078,1.078,0,0,0-.915.5,1.029,1.029,0,0,0-.138.793,1.051,1.051,0,0,0,.48.661l24.7,15.095a1.093,1.093,0,0,0,.57.161,1.08,1.08,0,0,0,.915-.5,1.029,1.029,0,0,0,.138-.793,1.051,1.051,0,0,0-.48-.661l-24.7-15.095A1.091,1.091,0,0,0,38.285,36.494Zm7.549-4.22a1.078,1.078,0,0,0-.915.5,1.029,1.029,0,0,0-.138.793,1.05,1.05,0,0,0,.48.661l24.7,15.095a1.093,1.093,0,0,0,.57.161,1.08,1.08,0,0,0,.915-.5,1.029,1.029,0,0,0,.138-.793,1.051,1.051,0,0,0-.48-.661L46.4,32.435A1.091,1.091,0,0,0,45.835,32.274Z")
        .attr("transform", "translate(2 -23.195)")
        .attr("fill", paper_colors[0]);

    papers.selectAll(".paper")
        .data(empty_array)
        .enter()
        .append("path")
        .attr("d", "M38.073,31.131l0,0v0L2.288,9.4V6.59L38.112,28.313,86.667,0V3.1L38.086,31.123v.015Z")
        .attr("opacity", "0")
        .attr("fill", (d, i) => {
            let color_index = 0;
            if (i * 2.5 < paper_data[0]) {
                color_index = 0;
            } else if (i * 2.5 < paper_data[0] + paper_data[1]) {
                color_index = 1;
            } else if (i * 2.5 < paper_data[0] + paper_data[2] + paper_data[3]) {
                color_index = 2;
            } else {
                color_index = 3;
            }
            return paper_colors[color_index];
        })
        .attr("transform", (d, i) => {
            return "translate(0," + (i + 4.5) * 6 + ")";
        });

    papers.selectAll('path')
        .transition()
        .delay(function (d, i) {
            return (i * 15);
        })
        .duration(function (d, i) {
            return (1000 + (i * 10));
        })
        .attr("opacity", (d, i) => {
            return 1
        });

    //adding animation
    papers.selectAll('path')
        .on("mouseover", function (i, d, c) {
            d3.select(this)
                .transition()
                .duration(300)
                .style("opacity", "0.2")
        })
        .on("mouseout", function (i, d, c) {
            d3.select(this)
                .transition()
                .delay(300)
                .duration(300)
                .style("opacity", "1")
        });


    var a = document.getElementById("paper_percentages").childNodes;
    for (var i = 0; i < 4; i++) {
        a[(4 * i) + 1].innerHTML = paper_data[i] + "%";
        a[4 * i + 3].innerHTML = paper_titles[i];
    }
}

var render_section_4 = function () {
    var svg = d3.select("#linear-chart").select("svg");

    let rows = svg.append("g")
        .attr("transform", "translate(0,20) scale(0.90)");

    rows.selectAll(".linear-chart-row")
        .data(linear_data)
        .enter()
        .append("text")
        .attr("class", "chart-title")
        .text((d, i) => {
            return linear_data[i][0];
        })
        .attr("transform", (d, i) => {
            return "translate(0," + (i + 1) * 40 + ")";
        });

    rows.selectAll(".linear-chart-row")
        .data(linear_data)
        .enter()
        .append("rect")
        .attr("width", (d, i) => {
            return linear_data[i][1] * 2.3;
        })
        .attr("height", 22)
        .attr("fill", "#0a92ea")
        .attr("transform", (d, i) => {
            let x_shift = 450 - (2.3 * linear_data[i][1]);
            return "translate (" + x_shift + "," + (i + 0.5) * 39 + ")";
        });

    rows.selectAll(".linear-chart-row")
        .data(linear_data)
        .enter()
        .append("text")
        .attr("class", "chart-percent")
        .text((d, i) => {
            return "-" + linear_data[i][1] + "%";
        })
        .attr("fill", "#0a92ea")
        .attr("transform", (d, i) => {
            let x_shift = 450 - (2.3 * linear_data[i][1]) - 70;
            return "translate (" + x_shift + "," + (i + 1) * 39.7 + ")";
        });


    rows.selectAll(".linear-chart-row")
        .data(linear_data)
        .enter()
        .append("text")
        .attr("class", "chart-percent")
        .text((d, i) => {
            return "+" + linear_data[i][2] + "%";
        })
        .attr("fill", "#2AE8D1")
        .attr("transform", (d, i) => {
            let x_shift = 450 + linear_data[i][2] * 2.3;
            return "translate (" + x_shift + "," + (i + 1) * 39.7 + ")";
        });

    rows.selectAll(".linear-chart-row")
        .data(linear_data)
        .enter()
        .append("rect")
        .attr("width", (d, i) => {
            return linear_data[i][2] * 2.3;
        })
        .attr("height", 22)
        .attr("fill", "#2AE8D1")
        .attr("transform", (d, i) => {
            return "translate (" + 450 + "," + (i + 0.5) * 39 + ")";
        });

    //animation part (mouse hover)
    rows.selectAll("rect")
        .on("mouseover", function (i, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("height", 32)
        })
        .on("mouseout", function (i, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("height", 22)
        })

}

var render_section_5 = function () {
    var p = d3.select("body")
        .selectAll(".collaboration-percent")
        .data(collaboration_data)
        .text(0)
        .transition()
        .duration(1000)
        .tween("text", function (d) {
            var i = d3.interpolate(this.textContent, d),
                prec = (d + "%").split("."),
                round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

            return function (t) {
                this.textContent = Math.round(i(t) * round) / round + "%";
            };
        });

}

var render_section_6 = function () {

    var svg = d3.select("#linear-chart-second").select("svg");

    let chart_rows = svg.append("g")
        .attr("transform", "translate(10,20)");


    chart_rows.selectAll(".linear-chart-row")
        .data(linear_data_second)
        .enter()
        .append("text")
        .attr("class", "chart-title")
        .text((d, i) => {
            return linear_data_second[i][0];
        })
        .attr("transform", (d, i) => {
            return "translate(-10," + (i + 1) * 32 + ")";
        });



    chart_rows.selectAll(".linear-chart-row")
        .data(linear_data_second)
        .enter()
        .append("text")
        .attr("class", "chart-percent")
        .text((d, i) => {
            return linear_data_second[i][1] + "%";
        })
        .attr("fill", "#2AE8D1")
        .attr("transform", (d, i) => {
            return "translate(210," + (i + 1) * 31.7 + ")";
        });

    chart_rows.selectAll('.chart-percent')
        .transition()
        .delay(function (d, i) {
            return (i * 100);
        })
        .duration(function (d, i) {
            return (1000 + (i * 200));
        })
        .attr("width", (d, i) => {
            return linear_data_second[i][1] * 4;
        })
        .attr("transform", (d, i) => {
            let x_shift = 210 + linear_data_second[i][1] * 4;
            return "translate (" + x_shift + "," + (i + 1) * 31.7 + ")";
        });


    chart_rows.selectAll('rect')
        .transition()
        .delay(function (d, i) {
            return (i * 100);
        })
        .duration(function (d, i) {
            return (1000 + (i * 200));
        })
        .attr("width", (d, i) => {
            return linear_data_second[i][1] * 4;
        });

    chart_rows.selectAll(".linear-chart-row")
        .data(linear_data_second)
        .enter()
        .append("rect")
        .attr("width", 0)
        .attr("height", 22)
        .attr("fill", "#2AE8D1")
        .attr("transform", (d, i) => {
            return "translate ( 200 ," + (i + 0.5) * 32 + ")";
        });

    chart_rows.selectAll('rect')
        .transition()
        .delay(function (d, i) {
            return (i * 100);
        })
        .duration(function (d, i) {
            return (1000 + (i * 200));
        })
        .attr("width", (d, i) => {
            return linear_data_second[i][1] * 4;
        });

    d3.select('body').append('div').attr('id', 'tooltip').attr('style', 'position: absolute; opacity: 0;');

    //animation part (mouse hover)
    chart_rows.selectAll('rect')
        .on("mouseover", function (i, d, c) {
            d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d[0])
            d3.select(this)
                .transition()
                .duration(300)
                .style("fill", "#77b35b");

        })
        .on('mousemove', function () {
            d3.select('#tooltip').style('left', (d3.pointer(event, this)[0] + 600) + 'px').style('top', (d3.pointer(event, this)[1] + 800) + 'px')
        })
        .on("mouseout", function (d, i) {
            d3.select('#tooltip').transition().duration(200).style('opacity', 0).text(d[0])
            d3.select(this)
                .transition()
                .duration(300)
                .style("fill", "#2AE8D1");
        });

    var scale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, 400]);
    var x_axis = d3.axisBottom().scale(scale);
    var axis_g = svg.append("g").attr("transform", "translate(210,200)")
    axis_g.call(x_axis);
    axis_g.select('.domain')
        .attr('stroke-width', 0);
    axis_g.selectAll('.tick').select("line").remove()
}

var render_section_7 = function () {

    total = 0;
    for (var i = 0; i < section_1_data.length; i++) {
        total += section_1_data[i];
    }

    var recovery_svg = d3.select("#recovery-chart-container").select("svg");

    let recovery_g = recovery_svg.append("g")
        .attr("transform", "translate(100,130)");
    var recovery_pie = d3.pie().sort(null);

    // Creating arc 
    var recovery_arc = d3.arc()
        .innerRadius(0)
        .outerRadius(85);

    // Grouping different arcs 
    var recovery_arcs = recovery_g.selectAll("arc")
        .data(recovery_pie(recovery_data))
        .enter()
        .append("g");

    // Appending path  
    recovery_arcs.append("path")
        .attr("fill", (data, i) => {
            let value = data.data;
            return colors[i];
        })
        .attr("transform", function (path) {
            middleAngle = -Math.PI / 2 + (path.startAngle + path.endAngle) / 2;
            dx = Math.cos(middleAngle);
            dy = Math.sin(middleAngle);
            return "translate(" + dx + ", " + dy + ")";
        })
        .transition().delay(function (d, i) {
            return i * 300;
        }).duration(300)
        .attrTween('d', function (d) {
            var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
            return function (t) {
                d.endAngle = i(t);
                return recovery_arc(d);
            }
        });

    recovery_arcs.append("text")
        .attr("transform", (d, i) => {
            if (recovery_data[i] / total < 0.1) {
                return "translate(" + [(recovery_arc.centroid(d)[0] * 2.3 - 18), recovery_arc.centroid(d)[1] * 2.3] + ")";
            } else {
                return "translate(" + [recovery_arc.centroid(d)[0] - 18, recovery_arc.centroid(d)[1]] + ")";
            }
        })
        .attr("fill", function (d, i) {
            if (recovery_data[i] / total < 0.1) {
                return "#5C5B5C";
            } else {
                return colors[i + 1 % colors.length];
            }
        })
        .attr("font-size", function (d, i) {
            let val = (recovery_data[i] / total) * 20 + 15;
            return val + "px";
        })
        .attr("class", "donut-chart-label")
        .text(function (d) {
            return d.data + "%";
        });

    //animation part (mouse hover)
    recovery_arcs.selectAll("path")
        .on("mouseover", function (i, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("transform", "scale(1.15)")
        })
        .on("mouseout", function (i, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("transform", "scale(1)")
        })

    var recovery_legends = recovery_svg.append("g").attr("transform", "translate(210, 0)").selectAll(".legends").data(recovery_legends_data);
    var recovery_legend = recovery_legends.enter().append("g").classed("legends", true).attr("transform", function (d, i) {
        return "translate(0, " + (i + 1) * 37 + ")";
    });
    recovery_legend.append("rect").attr("width", 12).attr("height", 12).attr("fill", function (d, i) {
        return colors[i];
    });
    recovery_legend.append("text").attr("class", "legend-title").text(function (d, i) {
        return recovery_legends_data[i][0];
    }).attr("transform", "translate(15,10)");
    recovery_legend.append("text").attr("class", "legend-subtitle").text(function (d, i) {
        return recovery_legends_data[i][1];
    }).attr("transform", "translate(15,25)");

}