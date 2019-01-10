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

			
			var svg = d3.select("#my_dataviz_line_extent").append("svg").attr("id","svg").attr("height",heightDivLineChart).attr("width",widthDivLineChart);
			var chartGroup = svg.append("g").attr("class","chartGroup").attr("transform","translate("+(xNudge)+","+yNudge+")");

			chartGroup.append("path")
			.attr("class","line")

			.attr("d",function(d){ return line(tableau); })


			chartGroup.append("g")
			.attr("class","axisx")
			.style("font", "14px times")
			.attr("transform","translate(0,"+(heightLineChart)+")")
			.call(xAxis)
			.append("text")
				//.attr("transform", "rotate(-90)")
				.attr("y", -120)
				.attr("x", 100)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("taille glace (sqm²)");

			chartGroup.append("g")
			.attr("class","axisy")
			.call(yAxis)
			.append("text")
				//.attr("transform", "rotate(-90)")
				.attr("y", 130)
				.attr("x", 250)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("mois de l'année");

			
	});
}

function getTemp(dateActuelle, donnee){
	if(donnee == "north"){
		var fichier = "./data/ArcticTemp.csv";
		d3.csv(fichier)
		.row(function(d) 
			{ return { year: parseInt(d.Year), month: parseInt(d.Month), temp: Number(d.Temperature.trim())}; })
		.get(function(error, rows) {
			minTemp = d3.min(rows, function(d) {return d.temp})
			maxTemp = 5;
			minDateTemp = d3.min(rows, function(d) { return d.month; });
			maxDateTemp = d3.max(rows, function(d) { return d.month; });
	});
	}else if(donnee == "south"){
		var fichier = "./data/AntarcticTemp_2.csv";
		d3.csv(fichier)
		.row(function(d) 
			{ return { year: parseInt(d.Year), month: parseInt(d.Month), temp: Number(d.Temperature.trim())}; })
		.get(function(error, rows) {
			minTemp = d3.min(rows, function(d) {return d.temp})
			maxTemp = d3.max(rows, function(d) { return d.temp; });
			minDateTemp = d3.min(rows, function(d) { return d.month; });
			maxDateTemp = d3.max(rows, function(d) { return d.month; });
	});

	}

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
			.domain([minTemp,maxTemp])
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

			
			var svgTemp = d3.select("#my_dataviz_line_temp").append("svg").attr("id","svgTemp").attr("height",heightDivLineChart).attr("width",widthDivLineChart);
			var chartGroup = svgTemp.append("g").attr("class","chartGroup").attr("transform","translate("+(xNudge)+","+yNudge+")");

			chartGroup.append("path")
			.attr("class","line")
			.attr("d",function(d){ return line(tableau); });


			chartGroup.append("g")
			.attr("class","axisx")
			.attr("transform","translate(0,"+(heightLineChart)+")")
			.call(xAxis)
			.append("text")
				//.attr("transform", "rotate(-90)")
				.attr("y", -120)
				.attr("x", 100)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Temperature (ºc)");;

			chartGroup.append("g")
			.attr("class","axisy")
			.call(yAxis)
			.append("text")
				//.attr("transform", "rotate(-90)")
				.attr("y", 130)
				.attr("x", 250)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("mois de l'année");

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
	
	var q = percentSQ/4
	var r = percentSQ%4
	var b = 0
	if(r==0){b = 1}
	
	for(i=0; i<q-1+b;++i){
		for(j=0;j<4;j++){
		var imgs = svg.append("svg:image")
		    .attr("xlink:href", "data/frbleue.svg")
		    .attr("id", "france")
	        .attr("y",-60+i*25 )
	        .attr("x",-55+j*25 )
		    .attr("width", "25")
		    .attr("height", "25");
		}
	}
	for(j=0; j<r;++j){
	var imgs = svg.append("svg:image")
		.attr("xlink:href", "data/frbleue.svg")
		.attr("id", "france")
	    .attr("y",-60+i*25 )
	    .attr("x",-55+j*25 )
		.attr("width", "25")
		.attr("height", "25");	
	}
}

function displayFrance_South(here){
	var dat = 0;
	dat = here.mean_extent;
	var franceSQ = 643801 ;
	//Les extents sont en 10^6 km²
	var percentSQ = Math.round(dat*1000000/franceSQ);
	
	var q = percentSQ/4
	var r = percentSQ%4
	var b = 0
	if(r==0){b = 1}
	
	for(i=0; i<q-1+b;++i){
		for(j=0;j<4;j++){
		var imgs_south = svg_south.append("svg_south:image")
		    .attr("xlink:href", "data/frbleue.svg")
		    .attr("id", "france_south")
	        .attr("y",-60+i*25 )
	        .attr("x",-55+j*25 )
		    .attr("width", "25")
		    .attr("height", "25");
		}
	}
	for(j=0; j<r;++j){
	var imgs_south = svg_south.append("svg_south:image")
		.attr("xlink:href", "data/frbleue.svg")
		.attr("id", "france_south")
	    .attr("y",-60+i*25 )
	    .attr("x",-55+j*25 )
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

	document.getElementById("title_temp").style.display='block';
	document.getElementById("title_extent").style.display='block';
}

function hideTooltip(here){
	var color = here.attributes.fill;

	d3.select(here)
	.transition()
	.duration(0)
	.style("opacity", 1.0)
	.style("fill", snailBase);

	tooltip.transition()
         .duration(500)
         .style("opacity", 0);
	

	svg.selectAll("#france").remove()
	svg_south.selectAll("#france_south").remove()

	document.getElementById("title_extent").style.display='none';
	document.getElementById("title_temp").style.display='none';
}

function radius_from_area(area){      
	console.log(Math.sqrt(area/Math.PI)*30)
	return Math.sqrt(area/Math.PI)*30
}
