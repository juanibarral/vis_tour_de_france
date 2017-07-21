
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
		top : 20,
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
	this.current_raw_data = undefined;
	this.scaleX = d3.scaleLinear().domain([0, 20]).range([_this.padding.left, _this.padding.left + _this.chart.width]);
	this.posScaleY = undefined;
	this.diffScaleY = undefined;

	this.icons = {
		podium : "images/podium.png",
		time : "images/chrono.png"
	}

	this.stage_types = 
	{
		flat : {
			label : "flat",
			color : "#b2df8a",
			icon  : "../../images/20px-Plainstage.png"
		},
		medium : {
			label : "medium",
			color : "#ffff99",
			icon  : "images/20px-Mediummountainstage.png"
		},
		high : {
			label : "high",
			color : "#b15928",
			icon  : "images/20px-Mountainstage.png"
		},
		chrono : {
			label : "chrono",
			color : "#ddd",
			icon  : "images/20px-Time_Trial.png"
		}
	}

	this.stages = [];

	for(i in params.stages)
	{
		(function(index){
			var stg = _this.stage_types[params.stages[parseInt(index)]];
			_this.stages.push({
				label : stg.label,
				color : stg.color,
				icon : stg.icon,
				stage : parseInt(index) + 1
			});
		})(i);
	}

	drawLegend(this);
}

var drawLegend = function(_this)
{
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

	_this.g.append("svg:image")
		.attr("xlink:href", _this.icons.time)
		.attr("width", 30)
		.attr("height", 30)
		.attr("x", 25)
		.attr("y", _this.padding.top + (_this.chart.height * 0.25) - 25)

	_this.g.append("svg:image")
		.attr("xlink:href", _this.icons.podium)
		.attr("width", 30)
		.attr("height", 30)
		.attr("x", 25)
		.attr("y", _this.padding.top + (_this.chart.height * 0.75) - 25)

}

var updateLegend = function(_this)
{
	d3.selectAll(".rect_legend").remove();
	d3.selectAll(".stage_icon").remove();
	d3.selectAll(".stage_label").remove();

	var rect_width = _this.chart.width / 21;
	var rect_legend = _this.g.selectAll(".rect_legend").data(_this.stages)
	rect_legend.enter()
		.append("rect")
		.attr("class", "rect_legend")
		.attr("id", function(d,i){
			var id = "rect_legend_" + d.stage;
			return id;
		})
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
		// .on("mouseover", function(d, i)
		// {
		// 	d3.select(this).style("fill-opacity", 0.9);
		// 	drawRiderInfo(_this, i);
		// })
		// .on("mouseout", function(d, i)
		// {
		// 	d3.select(this).style("fill-opacity", 0.3);	
		// 	removeRiderInfo(_this, i);
		// })

	var stage_icons = _this.g.selectAll(".stage_icon").data(_this.stages)
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

	var stage_labels = _this.g.selectAll(".stage_label").data(_this.stages)
	stage_labels.enter()
		.append("text")
		.attr("class", "stage_label")
		.attr("x", function(d,i){
			return _this.scaleX(i);
		})
		.attr("y",_this.padding.top + _this.chart.height + 5)
		.style("text-anchor", "middle")
		.style("alignment-baseline", "hanging")
		.text(function(d,i){
			return d.stage;
		});
}

var updateClickeable = function(_this)
{
	d3.selectAll(".rect_clickeable").remove();
	
	var rect_width = _this.chart.width / 21;
	var rect_legend = _this.g.selectAll(".rect_clickeable").data(_this.stages)
	rect_legend.enter()
		.append("rect")
		.attr("class", "rect_clickeable")
		.attr("x", function(d,i){
			return _this.scaleX(i) - (rect_width * 0.5)
		})
		.attr("y",_this.padding.top)
		.attr("width",rect_width)
		.attr("height",_this.chart.height)
		.style("fill", "#AAA")
		.style("fill-opacity", 0)
		.on("mouseover", function(d, i)
		{
			d3.select("#rect_legend_" + d.stage).style("fill-opacity", 0.9);
			drawRiderInfo(_this, i);
		})
		.on("mouseout", function(d, i)
		{
			d3.select("#rect_legend_" + d.stage).style("fill-opacity", 0.3);	
			removeRiderInfo(_this, i);
		})
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

tour_de_france_vis.prototype.sort = function(sorted)
{
	var new_stages = [];
	if(sorted)
	{
		for(i in sorted)
		{
			for(j in this.stages)
			{
				if(this.stages[j].label == sorted[i])
					new_stages.push(this.stages[j]);
			}
		}
	}
	else
	{
		new_stages = this.stages.sort(function(a,b){
			var x = parseInt(a.stage);
			var y = parseInt(b.stage);

			if(x > y)
			{
				return 1;
			}
			else if( x < y)
			{
				return -1;
			}
			else
				return 0;
		})
	}

	this.stages = new_stages;
	
	this.setData(this.current_raw_data);
}

tour_de_france_vis.prototype.setData = function(rawdata)
{
	var _this = this;
	_this.current_raw_data = rawdata;
	
	updateLegend(_this);

	var data = [];
	for(i in rawdata)
	{
		var r = rawdata[i];
		var sorted_diffs = [];
		var sorted_diffs_string = [];
		var sorted_positions = [];
		for(j in _this.stages)
		{
			var stage = _this.stages[j].stage;
			var index = parseInt(stage) - 1;
			sorted_diffs.push(r.diffs[parseInt(index)]);
			sorted_diffs_string.push(r.diffs_string[parseInt(index)]);
			sorted_positions.push(r.positions[parseInt(index)]);
		}

		data.push({
			diffs : sorted_diffs,
			diffs_string : sorted_diffs_string,
			number : r.number,
			positions : sorted_positions
		})
	}
	
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
	
	updateClickeable(_this);
}

module.exports = {
	tour_de_france_vis : tour_de_france_vis,
};
