function init(){
	d3.csv("./data/north_mean_extent.csv")
	.row(function(d) 
		{ return { year: parseInt(d.Year), month: parseInt(d.Month), mean_extent: Number(d.mean_extent.trim())}; })
	.get(function(error, rows) {
		max = d3.max(rows, function(d) { return d.mean_extent; });
		minDate = d3.min(rows, function(d) { return d.month; });
		maxDate = d3.max(rows, function(d) { return d.month; });
	});
}


var cs = function(x){ console.log(x)};

function divAnnee(dateActuelle, pageX, pageY){
	d3.csv("./data/north_mean_extent.csv")
		//.slice(1)
		.row(function(d) 
			{ return { year: parseInt(d.Year), month: parseInt(d.Month), mean_extent: Number(d.mean_extent.trim())}; })
		.get(function(error, rows) {

			tableau = []
			rows.forEach(function(element) {
				if(element.year == dateActuelle){
					tableau.push(element)
				}
			});

			var y = d3.scaleLinear()
			.domain([0,max])
			.range([heightLineChart,0]);

			var x = d3.scaleLinear()
			.domain([minDate,maxDate])
			.range([0,widthLineChart]);


			var yAxis = d3.axisLeft(y);

			var xAxis = d3.axisBottom(x);

			var line = d3.line()
			.x(function(d){ return x(d.month); })
			.y(function(d){ return y(d.mean_extent); })
			.curve(d3.curveCardinal);

			
			//d3.select("body").append("<div id='my_dataviz_line'></div>");
			var svg = d3.select("#my_dataviz_line").append("svg").attr("id","svg").attr("height",heightDivLineChart).attr("width",widthDivLineChart);
			//var chartGroup = svg.append("g").attr("class","chartGroup").attr("transform","translate("+xNudge+","+yNudge+")");
			var chartGroup = svg.append("g").attr("class","chartGroup").attr("transform","translate("+(xNudge)+","+yNudge+")");

			chartGroup.append("path")
			.attr("class","line")
			.attr("d",function(d){ return line(tableau); })


			chartGroup.append("g")
			.attr("class","axis x")
			.attr("transform","translate(0,"+(heightLineChart)+")")
			.call(xAxis);

			chartGroup.append("g")
			.attr("class","axis y")
			.call(yAxis);

	});
}

function displayFrance(here){
	var dat = 0;
	dat = here.mean_extent;
	var franceSQ = 8000;
	var percentSQ = Math.round(dat*1000/franceSQ);

	cs(percentSQ)
	cs(dat)
	for(i=0; i<percentSQ;++i){
		for(j=0;j<percentSQ;j++){


		var imgs = svg.append("svg:image")
		    .attr("xlink:href", "data/fr.svg")
		    .attr("id", "france")
	        .attr("x",-50+i*50 )
	        .attr("y",-50+j*50 )
		    .attr("width", "50")
		    .attr("height", "50");
		}
	}
}



function displayTooltip(here){
	d3.select(here)
	.transition()
	.duration(0)
	.style("opacity", 0.1)
	.style("fill", snailTransi);
	
	tooltip.transition()
	.duration(200)
	.style("opacity", .9);

		// div.html("d.Year + "<br/>" + d.close")
	tooltip.html("Année : "+here.__data__.Year)
		.style("left", (d3.event.pageX) + "px")
		.style("top", (d3.event.pageY - 28) + "px");

	cs()
		/*dateActuelle = d.Year;*/
	/*var divLine = d3.select("body").append("div")
		.style("left", (d3.event.pageX) + "px")
		.style("top", (d3.event.pageY - 28) + "px")
		.attr("class", "#my_dataviz_line")
		.style("opacity", 1);*/
		//.html("FIRST LINE <br> SECOND LINE")
	   // .style("left", (d.x + 50 + "px"))
		//.style("top", (d.y +"px"));


}

function hideTooltip(here){
	d3.select(here)
	.transition()
	.duration(0)
	.style("opacity", 1.0)
	.style("fill", snailBase);

	tooltip.transition()
         .duration(500)
         .style("opacity", 0);
	

	svg.selectAll("#france").remove()
	//d3.select("#my_dataviz_line").classed("hidden", true);
	//d3.select("#my_dataviz_line").remove();
	//d3.select("my_dataviz_line").classed("hidden", true);
}





function radius_from_area(area){      
	console.log(Math.sqrt(area/Math.PI)*30)
	return Math.sqrt(area/Math.PI)*30
}
