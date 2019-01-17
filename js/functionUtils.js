function init(){
	d3.csv("./data/north_mean_extent.csv")
	.row(function(d) 
		{ return { year: parseInt(d.Year), month: parseInt(d.Month), mean_extent: Number(d.mean_extent.trim())}; })
	.get(function(error, rows) {
		max = d3.max(rows, function(d) { return d.mean_extent; });
		minDate = d3.min(rows, function(d) { return d.month; });
		maxDate = d3.max(rows, function(d) { return d.month; });
	});

	d3.csv("./data/AntarcticTemp_2.csv")
	.row(function(d) 
		{ return { year: parseInt(d.Year), month: parseInt(d.Month), temp: Number(d.Temperature.trim())}; })
	.get(function(error, rows) {
		minTemp = d3.min(rows, function(d) {return d.temp})
		maxTemp = d3.max(rows, function(d) { return d.temp; });
		minDateTemp = d3.min(rows, function(d) { return d.month; });
		maxDateTemp = d3.max(rows, function(d) { return d.month; });
	});
};


var cs = function(x){ console.log(x)};

function displayLineChart(annee, position){

	if(position == "north"){
		var dataTemp = "./data/ArcticTemp.csv";
		var dataExtent = "./data/north_mean_extent.csv";
		var pos = "#my_dataviz_line_temp";
		var svgg = svg_north_Line;
	}
	else{
		var dataTemp = "./data/AntarcticTemp_2.csv";
		var dataExtent = "./data/south_mean_extent.csv";
		var pos = "#my_dataviz_line_extent";
		var svgg = svg_south_Line;
	}
	

	// var width = document.getElementById("my_dataviz_line_extent").clientWidth;
	// var height = width / 3;
	// set the ranges
	var x = d3.scaleLinear().domain([1,12]).range([40, width]);
	var y0 = d3.scaleLinear().domain([-50,0]).range([height, 10]);
	var y1 = d3.scaleLinear().domain([1,17]).range([height, 10]);

	// define the 1st line
	var valueline = d3.line()
	    .x(function(d) { return x(d.month); })
	    .y(function(d) { return y0(d.temp); });

	// define the 2nd line
	var valueline2 = d3.line()
	    .x(function(d) { return x(d.month); })
	    .y(function(d) { return y1(d.mean_extent); });
	  

	// append the svg obgect to the body of the page
	// appends a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	// var svg = d3.select(pos).append("svg")
	// 		.attr("id","svg")
	// 		.attr("height",height+40).attr("width",width+200)
	// 		.attr("transform","translate("+(-30)+","+(+10)+")");

	d3.csv(dataExtent)
	    .row(function(d) 
	      { return { year: parseInt(d.Year), month: parseInt(d.Month), mean_extent: Number(d.mean_extent.trim())}; })
	    .get(function(error, extent) {



	  d3.csv(dataTemp)
	  .row(function(d) 
	      { return { year: parseInt(d.Year), month: parseInt(d.Month), temp: Number(d.Temperature.trim())}; })
	    .get(function(error, temp) {

	      tableau_temp = []
	      tableau_extent = []
	      temp.forEach(function(element) {
	        if(element.year == annee){
	          tableau_temp.push(element)
	        }
	      });

	      extent.forEach(function(element) {
	        if(element.year == annee){
	          tableau_extent.push(element)
	        }
	      });
	    //if (error1) throw error;
	    
	    cs(tableau_temp)
	    cs(tableau_extent)

	    // format the data
	    tableau_temp.forEach(function(d) {
	        d.month = d.month;
	        d.temp = +d.temp;
	    });

	    tableau_extent.forEach(function(d) {
	        d.month = d.month;
	        d.mean_extent = +d.mean_extent;
	    });

	    // Scale the range of the data
	    x.domain(d3.extent(tableau_temp, function(d) { return d.month; }));
	    y0.domain([minTemp, 10]);
	    y1.domain([0, d3.max(tableau_extent, function(d) {return Math.max(d.mean_extent); })]);
	    
	    // Add the valueline path.
	    // 
	    //position == "north"
	    if(position == "north"){
		    svg_north_Line.append("path")
		        .data([tableau_temp])
		        .attr("class", "line")
		        .attr("d", valueline);

		    // Add the valueline2 path.
		    svg_north_Line.append("path")
		        .data([tableau_extent])
		        .attr("class", "line")
		        .style("stroke", "red")
		        .attr("d", valueline2);

		    // Add the X Axis
			xdata = ["","jan","fév","mar","avr","mai","juin","juil","aout","sep","oct","nov","dec"]
		    svg_north_Line.append("g")
		        .attr("transform", "translate(0," + height + ")")
		        .attr("class", "axisx")
		        .style("font", "14px times")
		        .call(d3.axisBottom(x).tickFormat(function (d) {return xdata[d];}))
		        .append("text")
		        	.attr("class", "textY1")
					.attr("stroke", "white")
					.attr("y", 25)
					.attr("x", (width+200)/2)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Mois de l'année "+annee);

		    // Add the Y0 Axis
		    svg_north_Line.append("g")
		        .attr("class", "axisy0")
		        .attr("transform", "translate( " + 40 + ", 0 )")
		        .call(d3.axisLeft(y0))
		        .append("text")
		        	.attr("class", "textY1")
					.attr("y",10)
					.attr("x", 60)
					.style("text-anchor", "end")
					.text("Température");

		    // Add the Y1 Axis
		    svg_north_Line.append("g")
		        .attr("class", "axisy1")
		        .attr("transform", "translate( " + width + ", 0 )")
		        .call(d3.axisRight(y1))
		        .append("text")
		        	.attr("class", "textY1")
		        	.attr("stroke", "red")
					.attr("y", 0)
					.attr("x", 0)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Extension");
	    }else{
	    	svg_south_Line.append("path")
		        .data([tableau_temp])
		        .attr("class", "line")
		        .attr("d", valueline);

		    // Add the valueline2 path.
		    svg_south_Line.append("path")
		        .data([tableau_extent])
		        .attr("class", "line")
		        .style("stroke", "red")
		        .attr("d", valueline2);

		    // Add the X Axis
		    svg_south_Line.append("g")
		        .attr("transform", "translate(0," + height + ")")
		        .attr("class", "axisx")
		        .style("font", "14px times")
		        .call(d3.axisBottom(x))
		        .append("text")
		        	.attr("class", "textY1")
					.attr("y", 25)
					.attr("x", (width+200)/2)
					.attr("dy", ".71em")
					.attr("stroke", "white")
					.style("text-anchor", "end")
					.text("Mois de l'année "+annee);

		    // Add the Y0 Axis
		    svg_south_Line.append("g")
		        .attr("class", "axisy0")
		        .attr("transform", "translate( " + 40 + ", 0 )")
		        .call(d3.axisLeft(y0))
		        .append("text")
		        	.attr("class", "textY1")
					.attr("y",10)
					.attr("x", 60)
					.style("text-anchor", "end")
					.text("Température");

		    // Add the Y1 Axis
		    svg_south_Line.append("g")
		        .attr("class", "axisy1")
		        .attr("transform", "translate( " + width + ", 0 )")
		        .call(d3.axisRight(y1))
		        .append("text")
		        	.attr("class", "textY1")
		        	.attr("stroke", "red")
					.attr("y", 0)
					.attr("x", 0)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text("Extension");
	    }

	  });
	});
}







function displayLineChartLines(annee, position){

	if(position == "north"){
		var dataTemp = "./data/ArcticTemp.csv";
		var dataExtent = "./data/north_mean_extent.csv";
		var pos = "#my_dataviz_line_temp";
		var svgg = svg_north_Line;
	}
	else{
		var dataTemp = "./data/AntarcticTemp_2.csv";
		var dataExtent = "./data/south_mean_extent.csv";
		var pos = "#my_dataviz_line_extent";
		var svgg = svg_south_Line;
	}
	

	// var width = document.getElementById("my_dataviz_line_extent").clientWidth;
	// var height = width / 3;
	// set the ranges
	var x = d3.scaleTime().domain([1,12]).range([40, width]);
	var y0 = d3.scaleLinear().domain([-50,0]).range([height, 10]);
	var y1 = d3.scaleLinear().domain([1,17]).range([height, 10]);

	// define the 1st line
	var valueline = d3.line()
	    .x(function(d) { return x(d.month); })
	    .y(function(d) { return y0(d.temp); });

	// define the 2nd line
	var valueline2 = d3.line()
	    .x(function(d) { return x(d.month); })
	    .y(function(d) { return y1(d.mean_extent); });
	  

	// append the svg obgect to the body of the page
	// appends a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	// var svg = d3.select(pos).append("svg")
	// 		.attr("id","svg")
	// 		.attr("height",height+40).attr("width",width+200)
	// 		.attr("transform","translate("+(-30)+","+(+10)+")");

	d3.csv(dataExtent)
	    .row(function(d) 
	      { return { year: parseInt(d.Year), month: parseInt(d.Month), mean_extent: Number(d.mean_extent.trim())}; })
	    .get(function(error, extent) {



	  d3.csv(dataTemp)
	  .row(function(d) 
	      { return { year: parseInt(d.Year), month: parseInt(d.Month), temp: Number(d.Temperature.trim())}; })
	    .get(function(error, temp) {

	      tableau_temp = []
	      tableau_extent = []
	      temp.forEach(function(element) {
	        if(element.year == annee){
	          tableau_temp.push(element)
	        }
	      });

	      extent.forEach(function(element) {
	        if(element.year == annee){
	          tableau_extent.push(element)
	        }
	      });
	    //if (error1) throw error;
	    
	    cs(tableau_temp)
	    cs(tableau_extent)

	    // format the data
	    tableau_temp.forEach(function(d) {
	        d.month = d.month;
	        d.temp = +d.temp;
	    });

	    tableau_extent.forEach(function(d) {
	        d.month = d.month;
	        d.mean_extent = +d.mean_extent;
	    });

	    // Scale the range of the data
	    x.domain(d3.extent(tableau_temp, function(d) { return d.month; }));
	    y0.domain([minTemp, 10]);
	    y1.domain([0, d3.max(tableau_extent, function(d) {return Math.max(d.mean_extent); })]);
	    
	    // Add the valueline path.
	    // 
	    //position == "north"
	    if(position == "north"){
		    svg_north_Line.append("path")
		        .data([tableau_temp])
		        .attr("class", "line")
		        .attr("d", valueline);

		    // Add the valueline2 path.
		    svg_north_Line.append("path")
		        .data([tableau_extent])
		        .attr("class", "line")
		        .style("stroke", "red")
		        .attr("d", valueline2);

	    }else{
	    	svg_south_Line.append("path")
		        .data([tableau_temp])
		        .attr("class", "line")
		        .attr("d", valueline);

		    // Add the valueline2 path.
		    svg_south_Line.append("path")
		        .data([tableau_extent])
		        .attr("class", "line")
		        .style("stroke", "red")
		        .attr("d", valueline2);

	    }

	  });
	});
}








function displayFrance(here){

	var ref = 19;

	var fichier = "./data/north_mean_extent_year.csv";
		d3.csv(fichier)
		.row(function(d) 
			{ return { year: parseInt(d.Year), extent: parseInt(d.mean_extent)}; })
		.get(function(error, rows) {
			var dat = d3.max(rows, function(d) { if(d.year == here.Year){ return d.extent; } })

	var franceSQ = 643801 ;
	//Les extents sont en 10^6 km²
	var percentSQ = Math.round(dat*1000000/franceSQ);
	var q = percentSQ/4
	var r = percentSQ%4
	var b = 0
	var c = 0
	var im = "data/frbleue.svg"
	if(r==0){b = 1}
	for(i=0; i<q-1+b;++i){
		for(j=0;j<4;j++){
		if(c>=ref){im = "data/frvert.svg"}
		var imgs = svg.append("svg:image")
		    .attr("xlink:href", im)
		    .attr("id", "france")
	        .attr("y",-60+i*25 )
	        .attr("x",-55+j*25 )
		    .attr("width", "25")
		    .attr("height", "25");
			c += 1
		}
	}
	for(j=0; j<r;++j){
	if(c>=ref){im = "data/frvert.svg"}
	var imgs = svg.append("svg:image")
		.attr("xlink:href", im)
		.attr("id", "france")
	    .attr("y",-60+i*25 )
	    .attr("x",-55+j*25 )
		.attr("width", "25")
		.attr("height", "25");
		c += 1
	}
	if(c<=ref){
	im = "data/frrouge.svg"	
	for(k=0; k<ref-c;++k){
	var imgs = svg.append("svg:image")
		.attr("xlink:href", im)
		.attr("id", "france")
	    .attr("y",-60+i*25 )
	    .attr("x",-55+j*25+k*25 )
		.attr("width", "25")
		.attr("height", "25");
	}	
	}
});
}

function displayFrance_South(here){
	var ref = 18;

	cs(here.Year)

	var fichier = "./data/south_mean_extent_year.csv";
		d3.csv(fichier)
		.row(function(d) 
			{ return { year: parseInt(d.Year), extent: d.mean_extent}; })
		.get(function(error, rows) {
			var dat = d3.max(rows, function(d) { if(d.year == here.Year){ return d.extent; } })

	cs(dat)
	//dat = here.mean_extent;
	var franceSQ = 643801 ;
	//Les extents sont en 10^6 km²
	var percentSQ = Math.round(dat*1000000/franceSQ);
	var c = 0
	var q = percentSQ/4
	var r = percentSQ%4
	var b = 0
	var im = "data/frbleue.svg"
	if(r==0){b = 1}
	
	for(i=0; i<q-1+b;++i){
		for(j=0;j<4;j++){
		if(c>=ref){im = "data/frvert.svg"}
		var imgs_south = svg_south.append("svg_south:image")
		    .attr("xlink:href", im)
		    .attr("id", "france_south")
	        .attr("y",-60+i*25 )
	        .attr("x",-55+j*25 )
		    .attr("width", "25")
		    .attr("height", "25");
			c += 1
		}
	}
	for(j=0; j<r;++j){
	if(c>=ref){im = "data/frvert.svg"}
	var imgs_south = svg_south.append("svg_south:image")
		.attr("xlink:href", im)
		.attr("id", "france_south")
	    .attr("y",-60+i*25 )
	    .attr("x",-55+j*25 )
		.attr("width", "25")
		.attr("height", "25");	
		c += 1
	}
	if(c<=ref){
	im = "data/frrouge.svg"	
	for(k=0; k<ref-c;++k){
	var imgs_south = svg_south.append("svg_south:image")
		.attr("xlink:href", im)
		.attr("id", "france_south")
	    .attr("y",-60+i*25 )
	    .attr("x",-55+j*25+k*25 )
		.attr("width", "25")
		.attr("height", "25");
	}	
	}
	});
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

	// document.getElementById("title_temp").style.display='block';
	// document.getElementById("title_extent").style.display='block';
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

	// document.getElementById("title_extent").style.display='none';
	// document.getElementById("title_temp").style.display='none';
}

function radius_from_area(area){      
	console.log(Math.sqrt(area/Math.PI)*30)
	return Math.sqrt(area/Math.PI)*30
}
