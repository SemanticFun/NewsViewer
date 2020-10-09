function summaryGraph(JSONtrack){
	var table = document.getElementsByTagName("table")[0];

	var svg = d3.select("body").append("svg")
		.attr("width", window.innerWidth-20)
		.attr("height", 400)
		.attr("align", "center");

	var margin = {top: 30, right: 80, bottom: 30, left: 80};
	var width = window.innerWidth - margin.left - margin.right;
	//soglia
	if (width < 600)
		width = 600;
	var	height = 350;
	var	g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var parseTime = d3.timeParse("%Y%m%d");

	var x = d3.scaleTime().range([0, width]),
		y = d3.scaleLinear().range([height, 0]),
		z = d3.scaleOrdinal(d3.schemeCategory10);

	var line = d3.line()
		.curve(d3.curveBasis)
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.count); });

	data = JSONtrack;
	//devo fare bene il parsing della data e poi sono a posto! (almeno credo)

	for (var i = 0; i < data.length; i++){
		data[i].date = data[i].date.replace("-", "").replace("-", "");
		data[i].date = parseTime(data[i].date);
	}

	columns = ["facebook", "twitter", "site"];
	var channels = columns.slice(0).map(function(id) {
		return {
			id: id,
		    values: data.map(function(d) {
		    	return {date: d.date, count: d[id]};
		    })
		};
	});

	x.domain(d3.extent(data, function(d) { return d.date; }));
	
	y.domain([
		d3.min(channels, function(c) {return d3.min(c.values, function(d) {return d.count; }); }),
		d3.max(channels, function(c) {return d3.max(c.values, function(d) {return d.count; }); })
	]);

	z.domain(channels.map(function(c) {return c.id; }));

	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0, " + height + ")")
		.call (d3.axisBottom(x));

	g.append("g")
		.attr("class", "axis axis--y")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", "0.71em")
		.attr("fill", "#000")
		.text("News count");

	var channel = g.selectAll(".channel")
		.data(channels)
		.enter().append("g")
		.attr("class", "channel");

	channel.append("path")
    	.attr("class", "line")
    	.attr("fill", "none")
    	.attr("d", function(d) { return line(d.values); })
    	.style("stroke", function(d) { return z(d.id); })
    	.on("hover", function(d) {});

	channel.append("text")
		.datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
		.attr("transform", function(d) {return "translate(" + x(d.value.date) + "," + y(d.value.count) + ")"; })
		.attr("x", 3)
		.attr("dy", "0.35em")
		.style("font", "10px sans-serif")
		.text(function(d) {return d.id;});

	//codice copiato da 
	var mouseG = svg.append("g")
		.attr("class", "mouse-over-effects")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

	mouseG.append("path") // this is the black vertical line to follow mouse
		.attr("class", "mouse-line")
		.style("stroke", "black")
		.style("stroke-width", "1px")
		.style("opacity", "0");

	var lines = document.getElementsByClassName('line');

	var mousePerLine = mouseG.selectAll('.mouse-per-line')
		.data(channels)
		.enter()
		.append("g")
		.attr("class", "mouse-per-line");

	mousePerLine.append("circle")
		.attr("r", 7)
		.style("stroke", function(d) {
			return z(d.name);
		})
		.style("fill", "none")
		.style("stroke-width", "1px")
		.style("opacity", "0");

	mousePerLine.append("text")
		.attr("transform", "translate(10,3)");

	mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
		.attr('width', width) // can't catch mouse events on a g element
		.attr('height', height)
		.attr('fill', 'none')
		.attr('pointer-events', 'all')
		.on('mouseout', function() { // on mouse out hide line, circles and text
			d3.select(".mouse-line")
		    	.style("opacity", "0");
			d3.selectAll(".mouse-per-line circle")
				.style("opacity", "0");
			d3.selectAll(".mouse-per-line text")
		    	.style("opacity", "0");
		})
		.on('mouseover', function() { // on mouse in show line, circles and text
			d3.select(".mouse-line")
		    	.style("opacity", "1");
			d3.selectAll(".mouse-per-line circle")
		    	.style("opacity", "1");
			d3.selectAll(".mouse-per-line text")
		    	.style("opacity", "1");
		})
		.on('mousemove', function() { // mouse moving over canvas
			var mouse = d3.mouse(this);
			d3.select(".mouse-line")
		    	.attr("d", function() {
		    		var d = "M" + mouse[0] + "," + height;
		    		d += " " + mouse[0] + "," + 0;
		    		return d;
		    	});

			d3.selectAll(".mouse-per-line")
				.attr("transform", function(d, i) {
		    console.log(width/mouse[0])
		    var xDate = x.invert(mouse[0]),
		    	bisect = d3.bisector(function(d) { return d.date; }).right;
		        idx = bisect(d.values, xDate);

		    var beginning = 0,
		        end = lines[i].getTotalLength(),
		        target = null;

		    while (true){
		    	target = Math.floor((beginning + end) / 2);
		        pos = lines[i].getPointAtLength(target);
		        if ((target === end || target === beginning) && pos.x !== mouse[0]) {
		            break;
		        }
		        if (pos.x > mouse[0])      end = target;
		        else if (pos.x < mouse[0]) beginning = target;
		        else break; //position found
		    }

		    d3.select(this).select('text')
		    	.text(y.invert(pos.y).toFixed(2));

		    return "translate(" + mouse[0] + "," + pos.y +")";
		});
	});
}