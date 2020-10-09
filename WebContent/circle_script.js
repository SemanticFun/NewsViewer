/**
 * third test
 */

function createCirclePacking(record, JSON){
	console.log(JSON);
	d3.select("body").selectAll("svg").remove();
	d3.select("body").selectAll("table").remove();
	d3.select("body").selectAll("p").remove();
	d3.select("body").selectAll("br").remove();

	d3.select("body").style("background-color", "#ffffff");

	var t = document.createTextNode("Periodo: " + record["start"] + " --> " + record["end"]);
	var title = document.createElement("p");
	title.setAttribute("id", "title_circle");
	title.appendChild(t);

	var par = document.createElement("p");
	par.setAttribute("id", "paragraph_circle");
	par.appendChild(document.createTextNode("top_publisher: " + record["top_publisher"]));
	par.appendChild(document.createElement("br"));
	par.appendChild(document.createTextNode("worst_publisher: " + record["worst_publisher"]));
	par.appendChild(document.createElement("br"));
	par.appendChild(document.createTextNode("news from facebook: " + record["facebookCount"]));
	par.appendChild(document.createElement("br"));
	par.appendChild(document.createTextNode("news from twitter: " + record["twitterCount"]));
	par.appendChild(document.createElement("br"));
	par.appendChild(document.createTextNode("news from site: " + record["siteCount"]));

	var image = document.createElement("img");
	image.setAttribute("id", "back_img");
	image.setAttribute("width", "30");
	image.setAttribute("height", "30");
	image.src="back.jpg";
	image.onclick = function(){
		console.log(index_form);
		index_form.submit();
	};

	document.body.appendChild(image);
	document.body.appendChild(title);
	document.body.appendChild(par);

	var margin = 15, width = window.innerWidth - margin - 10, height = window.innerHeight - margin;

	if(width < 850)
		width = 850;
	if(height < 600)
		height = 600;

	/*
	if (width < height){
		var temp = width;
		width = height;
		height = temp;
	}
	*/

	if(width < height)
		height = width * 3 / 4;

	var svg = d3.select("body").append("svg").attr("width", width).attr("height", height),    
		diameter = +svg.attr("height"),
		g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + diameter / 2 + ")");

	var color = d3.scaleLinear()
		.domain([-1, 5])
		.range(["#ffffff", "hsl(228,30%,40%)"])
		.interpolate(d3.interpolateHcl);

	var pack = d3.pack()
		.size([diameter - margin, diameter - margin])
		.padding(2);

	root = d3.hierarchy(JSON)
		.sum(function(d) { return d.size; })
		.sort(function(a, b) { return b.value - a.value; });

	var focus = root,
	nodes = pack(root).descendants(), view;

	var circle = g.selectAll("circle")
		.data(nodes)
		.enter()
		.append("circle")
		.attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
		.style("fill", function(d) { return d.children ? color(d.depth) : null; })
		.on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); })
		.on("mouseover", function(d) {
			console.log(d);
			var par = document.createElement("p");
			par.setAttribute("id", "paragraph");
			par.appendChild(document.createTextNode("name: " + d.data["name"]));
			par.appendChild(document.createElement("br"));
			par.appendChild(document.createTextNode("top_publisher: " + d.data["top_publisher"]));
			par.appendChild(document.createElement("br"));
			par.appendChild(document.createTextNode("worst_publisher: " + d.data["worst_publisher"]));
			par.appendChild(document.createElement("br"));
			par.appendChild(document.createTextNode("news from facebook: " + d.data["facebookCount"]));
			par.appendChild(document.createElement("br"));
			par.appendChild(document.createTextNode("news from twitter: " + d.data["twitterCount"]));
			par.appendChild(document.createElement("br"));
			par.appendChild(document.createTextNode("news from site: " + d.data["siteCount"]));
			document.body.appendChild(par);
		})
		.on("mouseleave", function(d){
			document.getElementById("paragraph").remove();
		});

	var text = g.selectAll("text")
		.data(nodes)
		.enter()
		.append("text")
		.attr("class", function(d) {return d.children? "label" : "label label--leaf";})
		.style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
		.style("display", function(d) { return d.parent === root ? "inline" : "none"; })
		.text(function(d){ return d.data.string ? d.data.string : d.data.name});
		//.text(function(d) {return d.data.name; });

	var node = g.selectAll("circle,text");

	svg
		.style("background", color(-1))
		.on("click", function() { zoom(root); });

	zoomTo([root.x, root.y, root.r * 2 + margin]);

	function zoom(d) {
		if(!d.children){
			document.getElementsByName("cluster_form")[0].id_cl.value = d.data.name;
			cluster_form.submit();

		} else {
		var focus0 = focus; focus = d;

		var transition = d3.transition()
			.duration(d3.event.altKey ? 7500 : 750)
			.tween("zoom", function(d) {
				var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
					return function(t) { zoomTo(i(t)); };
			});	

		transition.selectAll("text")
			.filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
			.style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
			.on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
			.on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
		}
	}

	function zoomTo(v) {
		var k = diameter / v[2]; view = v;
		node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
		circle.attr("r", function(d) { return d.r * k; });
	}
}