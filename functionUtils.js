function init(){
	d3.csv("./data/north_mean_extent.csv")
	.row(function(d) 
		{ return { year: parseInt(d.Year), month: parseInt(d.Month), mean_extent: Number(d.mean_extent.trim())}; })
	.get(function(error, rows) {
		max = d3.max(rows, function(d) { return d.mean_extent; });
		minDate = d3.min(rows, function(d) { return d.month; });
		maxDate = d3.max(rows, function(d) { return d.month; });
	});

	d3.csv("./data/ArcticTemp.csv")
	.row(function(d) 
		{ return { year: parseInt(d.Year), month: parseInt(d.Month), temp: Number(d.Temperature.trim())}; })
	.get(function(error, rows) {
		minTemp = d3.min(rows, function(d) {return d.temp})
		maxTemp = d3.max(rows, function(d) { return d.temp; });
		minDateTemp = d3.min(rows, function(d) { return d.month; });
		maxDateTemp = d3.max(rows, function(d) { return d.month; });
	});
}


var cs = function(x){ console.log(x)};

function divAnnee(dateActuelle, pageX, pageY){

	d3.csv("./data/north_mean_extent.csv")
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

			
			var svg = d3.select("#my_dataviz_line").append("svg").attr("id","svg").attr("height",heightDivLineChart).attr("width",widthDivLineChart);
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

function getTemp(dateActuelle){
	var fichier = "./data/ArcticTemp.csv";

	d3.csv(fichier)
	.row(function(d) 
			{ return { year: parseInt(d.Year), month: parseInt(d.Month), temp: Number(d.Temperature.trim())}; })
		.get(function(error, rows) {
			tableau = []
			rows.forEach(function(element) {
				if(element.year == dateActuelle){
					tableau.push(element)
				}
			});

			var y = d3.scaleLinear()
			.domain([minTemp,5])
			.range([heightLineChart,0]);

			var x = d3.scaleLinear()
			.domain([minDateTemp,maxDateTemp])
			.range([0,widthLineChart]);


			var yAxis = d3.axisLeft(y);

			var xAxis = d3.axisBottom(x);

			var line = d3.line()
			.x(function(d){ return x(d.month); })
			.y(function(d){ return y(d.temp); })
			.curve(d3.curveCardinal);

			
			var svgTemp = d3.select("#my_dataviz_line").append("svg").attr("id","svgTemp").attr("height",heightDivLineChart).attr("width",widthDivLineChart);
			var chartGroup = svgTemp.append("g").attr("class","chartGroup").attr("transform","translate("+(xNudge)+","+yNudge+")");

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

			var offsets = document.getElementById('svgTemp').getBoundingClientRect();
			var top = offsets.top;
			var left = offsets.left;

			/*var text_line = svgTemp.selectAll("text_line")
				.data(rows)
				.enter()
				.append("text");

			var textLabels = text_line
				.attr("x", 150)
				.attr("y", 170)
				.attr("id", "textTemp")
				.text("Evolution de la température")*/


		});
}

function displayFrance(here){
	var dat = 0;
	dat = here.mean_extent;
	var franceSQ = 643801 ;
	//Les extents sont en 10^6 km²
	var percentSQ = Math.round(dat*1000000/franceSQ);
	
	console.log(percentSQ)
	
	q = percentSQ/4
	r = percentSQ%4
	
	for(i=0; i<q-1;++i){
		for(j=0;j<4;j++){
		console.log(j)
		var imgs = svg.append("svg:image")
		    .attr("xlink:href", "data/fr.svg")
		    .attr("id", "france")
	        .attr("x",-60+i*25 )
	        .attr("y",-55+j*25 )
		    .attr("width", "25")
		    .attr("height", "25");
		}
	}
	for(j=0; j<r;++j){
	var imgs = svg.append("svg:image")
		.attr("xlink:href", "data/fr.svg")
		.attr("id", "france")
	    .attr("x",-60+i*25 )
	    .attr("y",-55+j*25 )
		.attr("width", "25")
		.attr("height", "25");	
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
	
	tooltip.html("Année : "+here.__data__.Year)
		.style("left", (d3.event.pageX) + "px")
		.style("top", (d3.event.pageY - 28) + "px");
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
}

function radius_from_area(area){      
	console.log(Math.sqrt(area/Math.PI)*30)
	return Math.sqrt(area/Math.PI)*30
}
