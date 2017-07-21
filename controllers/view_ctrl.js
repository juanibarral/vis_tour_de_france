/**
 * app_home.js
 * Controller for home
 * @author: Juan Camilo Ibarra
 * @Creation_Date: March 2016
 * @version: 0.1.0
 * @Update_Author : Juan Camilo Ibarra
 * @Date: March 2016
 */

var my_app = require("./_app_core").my_app;
var raw_data = require("../data/data_tour_2016.json");
var view = require("./tour_de_france_vis.js");

my_app.controller('view_ctrl', ['$scope', '$location', function($scope, $location){
	$scope.labels = {
		title : "Tour de France 2016",
		button_1 : "Ordenar por tipo de etapa",
		button_2 : "Ordenar por número de etapa"
	};

	$scope.button = $scope.labels.button_1;
	$scope.riders = [];
	$scope.selected_rider
	
	var riders = [];
	for(i in raw_data.stage_1['Individuel Temps Général'])
	{
		var rider_i = raw_data.stage_1['Individuel Temps Général'][i];
		riders.push(rider_i);
	}

	$scope.riders = riders.sort(function(a,b)
	{
		var x = a.number;
		var y = b.number;

		if( x > y )
			return 1;
		else if( x < y )
			return -1;
		return 0;
	});
	$scope.selected_rider = $scope.riders[0]
	$scope.$applyAsync();



	var vis = new view.tour_de_france_vis(
	{
		bindto : "#tour_chart",
		stages : [
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
			"chrono",	//Stage 13
			"flat",		//Stage 14
			"high",		//Stage 15
			"flat",		//Stage 16
			"high",		//Stage 17
			"chrono",	//Stage 18
			"high",		//Stage 19
			"high",		//Stage 20
			"flat",		//Stage 21
		]
	});


	var topTen = [];
	for(var i = 0; i < 1; i++)
	{
		topTen.push($scope.riders[i].number);
	}

	// var data = [];
	// for(indexTopTen in topTen)
	// {
	// 	var number = topTen[indexTopTen];
	// 	data.push({number : number, positions : []})
	// 	for(var i = 1; i < 21; i++)
	// 	{
	// 		var stage_i = raw_data["stage_" + i]['Individuel Temps Général'];
	// 		for(j in stage_i)
	// 		{
	// 			if(stage_i[j].number == number)
	// 			{
	// 				data[indexTopTen].positions.push(parseInt(stage_i[j].position))
	// 				break;
	// 			}
	// 		}

	// 	}
	// }

	// vis.setData(data);\\

	var full_data = [];

	$scope.setRider = function()
	{
		var data = [];
		var rider = JSON.parse($scope.selected_rider)
		var number = rider.number;
		data.push({number : number, positions : [], diffs : [], diffs_string:[]})
		for(var i = 1; i < 22; i++)
		{
			var stage_i = raw_data["stage_" + i]['Individuel Temps Général'];
			for(j in stage_i)
			{
				if(stage_i[j].number == number)
				{
					data[data.length - 1].positions.push(parseInt(stage_i[j].position))
					var time = stage_i[j].time;
					data[data.length - 1].diffs_string.push(time)
					var seconds = 0;
					if(time.indexOf("+") != -1)
					{
						time = time.replace("+","");
						time = time.replace("h","");
						time = time.replace("'","");
						time = time.replace("\"","");
						var timeSplit = time.trim().split(" ");
						var hour = timeSplit.length == 3 ? parseInt(timeSplit[0]) : 0;
						var min = timeSplit.length ==  3 ? parseInt(timeSplit[1]) : parseInt(timeSplit[0]);
						var sec = timeSplit.length ==  3 ? parseInt(timeSplit[2]) : parseInt(timeSplit[1]);

						seconds += hour * 60 * 60;
						seconds += min * 60;
						seconds += sec;
					}
					
					data[data.length - 1].diffs.push(seconds)
					
					break;
				}
			}

		}


		if(full_data.length == 0)
			full_data.push(data);
		else if(full_data.length == 1)
			full_data.push(data);
		else
			full_data

		vis.setData(full_data);
	}

	$scope.sort = function()
	{
		if($scope.button == $scope.labels.button_1)
		{
			$scope.button = $scope.labels.button_2;
			$scope.$applyAsync();
			vis.sort(["flat", "medium", "high", "chrono"]);
		}
		else
		{
			$scope.button = $scope.labels.button_1;
			$scope.$applyAsync();
			vis.sort();

		}
	}


}]);
