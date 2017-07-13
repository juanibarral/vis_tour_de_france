
var d3 = require('d3');
var colorbrewer = require("colorbrewer");




//**********************************
// Tour de France Visualization
//**********************************
var tour_de_france_vis = function(params){
	var _this = this;
	this.div_id = params.bindto;
	this.div = d3.select(this.div_id);
	this.bbox = this.div.node().getBoundingClientRect();
	if(this.bbox.width == undefined && this.bbox.height == undefined)
		console.log("Div must have width and height")
	else
	{
		this.width = this.bbox.width;
		this.height = this.bbox.height;
	}

	this.padding = {
		top : 50,
		bottom : 50,
		left : 100,
		right : 50,
	}

	this.chart = {
		width : _this.width - _this.padding.left - _this.padding.right,
		height : _this.height - _this.padding.top - _this.padding.bottom,
		mid : (_this.height - _this.padding.top - _this.padding.bottom) * 0.5,
	}

	this.mouseover = params.mouseover;
	this.mouseout  = params.mouseout;
	this.on_click  = params.on_click;

	this.svg = d3.select(_this.div_id).append("svg")
		.attr("width" , _this.width)
		.attr("height", _this.height)
		.style("display", "block")
		.style("margin", "auto")
	this.g = this.svg.append("g");

	this.current_data = undefined;
	this.scaleX = d3.scaleLinear().domain([0, 20]).range([_this.padding.left, _this.padding.left + _this.chart.width]);
	this.posScaleY = undefined;
	this.diffScaleY = undefined;

	drawLegend(this);

}

var drawLegend = function(_this)
{
	var types = [
		"flat",		//Stage 1
		"flat",		//Stage 2
		"flat",		//Stage 3
		"flat",		//Stage 4
		"medium",	//Stage 5
		"flat",		//Stage 6
		"medium",	//Stage 7
		"high",		//Stage 8
		"high",		//Stage 9
		"medium",	//Stage 10
		"flat",		//Stage 11
		"high",		//Stage 12
		"time",		//Stage 13
		"flat",		//Stage 14
		"high",		//Stage 15
		"flat",		//Stage 16
		"high",		//Stage 17
		"time",		//Stage 18
		"high",		//Stage 19
		"high",		//Stage 20
		"flat",		//Stage 21
	]

	var colors = {
		flat   : "#b2df8a",
		medium : "#ffff99",
		high   : "#b15928",
		time   : "#ddd"
	}

	var icons = {
		flat   : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Plainstage.svg/20px-Plainstage.svg",
		medium : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Mediummountainstage.svg/20px-Mediummountainstage.svg",
		high   : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Mountainstage.svg/20px-Mountainstage.svg",
		time   : "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Time_Trial.svg/20px-Time_Trial.svg"
	}



	var rect_width = _this.chart.width / 21;
	var left_legend = _this.padding.left - (rect_width * 0.5);
	_this.g.append("line")
		.attr("x1", left_legend)
		.attr("y1",_this.padding.top)
		.attr("x2", left_legend)
		.attr("y2",_this.padding.top + _this.chart.height)
		.style("stroke", "black")
		.style("stroke-width", 1)

	_this.g.append("line")
		.attr("x1", left_legend - 10)
		.attr("y1",_this.padding.top)
		.attr("x2", left_legend)
		.attr("y2",_this.padding.top)	
		.style("stroke", "black")
		.style("stroke-width", 1)

	_this.g.append("line")
		.attr("x1", left_legend - 10)
		.attr("y1",_this.padding.top + _this.chart.mid)
		.attr("x2", left_legend)
		.attr("y2",_this.padding.top + _this.chart.mid)
		.style("stroke", "black")
		.style("stroke-width", 1)

	_this.g.append("line")
		.attr("x1", left_legend - 10)
		.attr("y1",_this.padding.top + _this.chart.height)
		.attr("x2", left_legend)
		.attr("y2",_this.padding.top + _this.chart.height)
		.style("stroke", "black")
		.style("stroke-width", 1)

	//var scaleX = d3.scaleLinear().domain([0, 20]).range([_this.padding.left, _this.padding.left + _this.chart.width]);
	
	var rect_data = []
	for(var index = 0; index <21; index++)
	{
		rect_data.push({
			color : colors[types[index]],
			icon : icons[types[index]]
		});
		
	}


	var rect_legend = _this.g.selectAll(".rect_legend").data(rect_data)
	rect_legend.enter()
		.append("rect")
		.attr("class", "rect_legend")
		.attr("x", function(d,i){
			return _this.scaleX(i) - (rect_width * 0.5)
		})
		.attr("y",_this.padding.top)
		.attr("width",rect_width)
		.attr("height",_this.chart.height)
		.style("fill", function(d,i){
			return d.color;
		})
		.style("fill-opacity", 0.3)
		//.style("stroke", "black")
		.on("mouseover", function(d, i)
		{
			d3.select(this).style("fill-opacity", 0.9);
			drawRiderInfo(_this, i);
		})
		.on("mouseout", function(d, i)
		{
			d3.select(this).style("fill-opacity", 0.3);	
			removeRiderInfo(_this, i);
		})

	var stage_icons = _this.g.selectAll(".stage_icon").data(rect_data)
	stage_icons.enter()
		.append("svg:image")
		.attr("class", "stage_icon")
		.attr("xlink:href", function(d, i){
			return d.icon
		})
		.attr("width", 20)
		.attr("height", 20)
		.attr("x", function(d,i){
			return _this.scaleX(i) - 10;
		})
		.attr("y",_this.padding.top + _this.chart.height + 25);

}

var drawRiderInfo = function(_this, rider_index)
{
	if(_this.current_data && _this.current_data.length == 1)
	{
		var rider_info = _this.g.append("g").attr("id", "current_rider_info");
		rider_info.append("line")
			.attr("x1", _this.scaleX(rider_index))
			.attr("y1", _this.posScaleY(_this.current_data[0].positions[rider_index]))
			.attr("x2", _this.scaleX(rider_index))
			.attr("y2", _this.diffScaleY(_this.current_data[0].diffs[rider_index]))
			.style("stroke", "black");

		rider_info.append("text")
			.attr("x", _this.scaleX(rider_index))
			.attr("y", _this.diffScaleY(_this.current_data[0].diffs[rider_index]))	
			//.style("font-size", "black");
			.style("text-anchor", "middle")
			.text(_this.current_data[0].diffs_string[rider_index])

		rider_info.append("text")
			.attr("x", _this.scaleX(rider_index))
			.attr("y", _this.posScaleY(_this.current_data[0].positions[rider_index]))
			//.style("font-size", "black");
			.style("text-anchor", "middle")
			.style("alignment-baseline","hanging")
			.text(_this.current_data[0].positions[rider_index])
	}
}

var removeRiderInfo = function(_this, i)
{
	if(_this.current_data && _this.current_data.length == 1)
	{
		d3.select("#current_rider_info").remove();
	}
}

tour_de_france_vis.prototype.setData = function(data)
{
	var _this = this;
	_this.current_data = data;
	d3.selectAll(".pos_paths").remove();
	d3.selectAll(".diff_paths").remove();

	var maxPosition = 0;
	var maxDiff = 0;
	for(i in data)
	{
		var max_i = d3.max(data[i].positions);
		maxPosition = d3.max([max_i, maxPosition])
		var max_i_diff = d3.max(data[i].diffs);
		maxDiff = d3.max([max_i_diff, maxDiff])
	}
	
	_this.posScaleY = d3.scaleLinear().domain([1, maxPosition]).range([_this.padding.top + _this.chart.mid, _this.padding.top + _this.chart.height]);
	_this.diffScaleY = d3.scaleLinear().domain([0, maxDiff]).range([_this.padding.top + _this.chart.mid, _this.padding.top]);

	var pos_paths = _this.g.selectAll(".pos_paths").data(data)
	var diff_paths = _this.g.selectAll(".diff_paths").data(data)

	var graph_opacity = 0.8;
					
	pos_paths.enter()
		.append("g")
		.attr("class", "pos_paths")
		.append("path")
		.attr("id", function(d,i){
			return "path_pos_" + i;
		})
		.attr("d", function(d,i)
		{
			var positions = d.positions;
			var points = "M " + _this.padding.left + "," + (_this.padding.top + _this.chart.mid) + " ";

			for(index in positions)
			{
				points += " L " +  _this.scaleX(index) + "," + _this.posScaleY(positions[index]) + " ";	
			}
			
			points += " L " + _this.scaleX(positions.length - 1) + "," + (_this.padding.top + _this.chart.mid) + " ";

			return points;
		})
		.style("fill", "#91bfdb")
		.style("fill-opacity", graph_opacity)

	diff_paths.enter()
		.append("g")
		.attr("class", "diff_paths")
		.append("path")
		.attr("id", function(d,i){
			return "path_diff_" + i;
		})
		.attr("d", function(d,i)
		{
			var diffs = d.diffs;
			var points = "M " + _this.padding.left + "," + (_this.padding.top + _this.chart.mid) + " ";

			for(index in diffs)
			{
				points += " L " +  _this.scaleX(index) + "," + _this.diffScaleY(diffs[index]) + " ";	
			}
			
			points += " L " + _this.scaleX(diffs.length - 1) + "," + (_this.padding.top + _this.chart.mid) + " ";

			return points;
		})
		.style("fill", "#cab2d6")
		.style("fill-opacity", graph_opacity)
		//.style("stroke", "#AAA")
	
}

module.exports = {
	tour_de_france_vis : tour_de_france_vis,
};
