
define( ["qlik"
		,"./libraries/RGraph.common.core"
		,"./libraries/RGraph.common.dynamic"
		,"./libraries/RGraph.common.tooltips"
		,"./libraries/RGraph.common.resizing"		
		//,"./libraries/RGraph.common.key"
		,"./libraries/RGraph.pie"
		,"./libraries/RGraph.bar"
		],
function (qlik, RCommonCore, RCommonDynamic, RCommonTooltips, RCommonresizable, RPie, RBar) {
	'use strict';
	var chart;
	var palette = [
			 '#2196f3' 	
			,'#7e57c2'
			,'#ff1744'
			,'#9c27b0'
			,'#00796b'
			,'#039be5'
			,'#4caf50'
			,'#cddc39'	 
			,'#448aff'
			,'#1e88e5'
			,'#ab47bc'
			,'#8e24aa'
			,'#7b1fa2'		
			,'#f3e5f5'
			,'#1976d2'
			,'#90caf9'
			,'#64b5f6'		
			,'#e1bee7'
			,'#ce93d8'
			,'#ba68c8'
					

			,'#388e3c'
			,'#2e7d32'
			,'#1b5e20'		
			,'#1565c0'
			,'#0d47a1'
			,'#a5d6a7'		 
			,'#e3f2fd'
			,'#82b1ff'
			
			,'#2979ff'
			,'#2962ff'
			,'#4caf50'
			,'#e8f5e9'
			,'#c8e6c9'		
			,'#bbdefb'

			,'#b9f6ca'
			,'#69f0ae'
			,'#00e676'
			,'#00c853'		
			,'#42a5f5'

			,'#81c784'
			,'#66bb6a'
			,'#43a047'
			,'#3f51b5'
			,'#e8eaf6'
			,'#c5cae9'
			,'#9fa8da'
			,'#7986cb'
			
			,'#3949ab'
			,'#303f9f'
			,'#283593'
			,'#1a237e'
			,'#8c9eff'
			,'#536dfe'
			,'#3d5afe'
			,'#304ffe'
			,'#9c27b0'


			,'#6a1b9a'
			,'#4a148c'
			,'#ea80fc'
			,'#e040fb'
			,'#d500f9'
			,'#aa00ff'
			,'#607d8b'
			,'#eceff1'
			,'#cfd8dc'
			,'#b0bec5'
			,'#90a4ae'
			,'#78909c'
			,'#546e7a'
			,'#455a64'
			,'#37474f'
			,'#263238'
	];
	return {
		initialProperties : {
			version: 1.0,
			selectionMode : "CONFIRM",
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 50,
					qHeight : 50
				}]
			}
			
		},
		definition : {	
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
					min: 1,
					max: 1
				},			
				measures: {
					uses: "measures",
					min: 1,
					max: 1
				},
				sorting: {
					uses: "sorting"
				},
				settings : {
					uses : "settings",
					items: {
						chartTypeList: {
							type: "string",
							component: "dropdown",
							label: "Chart Type",
							ref: "chartTypeList",
							options: [{
								value: "3d-pie",
								label: "3D Pie Chart"
							}, {
								value: "3d-donut",
								label: "3D Donut Chart"
							}, {
								value: "3d-bar",
								label: "3D Bar Chart"
							}],
							defaultValue: "3d-pie"
						},					
						chartLabels: {
							type: "boolean",
							component: "switch",
							label: "Chart Labels",
							ref: "chartLabels",
							options: [{
								value: true,
								label: "On"
							}, {
								value: false,
								label: "Off"
							}],
							defaultValue: true
						},					
						textFontSize: {
							type: "number",
							component: "slider",
							label: "Font Size ",
							ref: "textFontSize",
							min: 1,
							max: 30,
							step: 1,
							defaultValue: 10
						},
						labelBold: {
							type: "boolean",
							component: "switch",
							label: "Labels Bold",
							ref: "labelBold",
							options: [{
								value: true,
								label: "On"
							}, {
								value: false,
								label: "Off"
							}],
							defaultValue: false
						}				
					}									
				},
				pieNDonutSection: {
					component: "expandable-items",
					label: "Pie and Donut settings",
					items: {
						labelSticks: {
							type: "boolean",
							component: "switch",
							label: "Labels Sticks",
							ref: "labelSticks",
							options: [{
								value: true,
								label: "On"
							}, {
								value: false,
								label: "Off"
							}],
							defaultValue: true
						},
						labelsSticksLength: {
							type: "number",
							component: "slider",
							label: "Labels Sticks Length",
							ref: "labelsSticksLength",
							min: 0,
							max: 10,
							step: 1,
							defaultValue: 5
						},
						labelsSticksLinewidth: {
							type: "number",
							component: "slider",
							label: "Labels Sticks Width",
							ref: "labelsSticksLinewidth",
							min: 1,
							max: 15,
							step: 1,
							defaultValue: 7
						},
						
						radiusValue: {
							type: "number",
							component: "slider",
							label: "3D-Pie/Donut Radius",
							ref: "radiusValue",
							min: 1,
							max: 200,
							step: 1,
							defaultValue: 100
						}
					}
				}
			}
		},
		support : {
			snapshot: true,
			export: true,
			exportData : false
		},
		paint: function ($element, layout) {
			//debug propose only, please comment
			//console.log('Data returned: ', layout.qHyperCube);
            $element.empty();

            var that = this;
			
			var app = qlik.currApp(this);
			
			// Get the Number of Dimensions and Measures on the hypercube
			var numberOfDimensions = layout.qHyperCube.qDimensionInfo.length;
			var numberOfMeasures = layout.qHyperCube.qMeasureInfo.length;
			
			// Get the Measure Name and the Dimension Name
			var measureName = layout.qHyperCube.qMeasureInfo[0].qFallbackTitle;
			var dimensionName = layout.qHyperCube.qDimensionInfo[0].qFallbackTitle;
			

			
			// Get the number of fields of a dimension
			var numberOfDimValues = layout.qHyperCube.qDataPages[0].qMatrix.length;
			
			// Get the values of the dimension
			var dimArray =[];
			var measArray =[];
			for (var i=0; i<numberOfDimValues;i++){
				dimArray[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][0].qText;
				measArray[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][1].qText;
			}
			
			
			var dimensionLength=layout.qHyperCube.qDataPages[0].qMatrix.length;
			
			
			/*
			var jsArray = [];
			jsArray[0] = "./libraries/RGraph.common.core.js";
			jsArray[1] = "./libraries/RGraph.common.dynamic.js";
			jsArray[2] = "./libraries/RGraph.common.tooltips.js";
			jsArray[3] = "./libraries/RGraph.pie.js";
			
			$("script[id='dynamic-js']").remove();
			for (var i=0;i<jsArray.length - 1;i++){
				var script = document.createElement( 'script' );
				script.id='dynamic-js'
				script.type = 'text/javascript';
				script.src = jsArray[i];
				$("head").append( script ); 
			}
			*/
			
			var html = '';
			
			var width = $element.width(), height = $element.height();
			html+='<div id="canvas-wrapper"><canvas align="center" id="cvs" width="'+(width)+'" height="'+(height)+'">[No canvas support]</canvas></div>';
			
			$element.html(html);
			
			// Activate ou Deactivate Labels Sticks
			if (layout.chartLabels) {
				var labelsArray = dimArray;
			} else {
				var labelsArray = [];
			}
			
			
			/*try {
				chart.Clear();
			}
			catch(err) {
			}		
			*/
			RGraph.Reset(document.getElementById('cvs'));
			
			switch(layout.chartTypeList) {
				// Draws 3d pie chart
				case "3d-pie":
					chart = new RGraph.Pie({
						id: 'cvs',
						data: measArray,
						options: {
							gutterLeft: 50,
							gutterRight: 50,
							linewidth: 0,
							strokestyle: 'rgba(0,0,0,0)',
							tooltips: dimArray,
							tooltipsEvent: 'onmousemove',					
							labels: labelsArray,						
							colors: palette,
							variant: 'pie3d',
							//radius: 100,
							//labelsSticksColors: [,'#cc0',,,'#0f0',,'black'],
							labelsSticksColors:palette,
							radius: layout.radiusValue,
							shadowOffsety: 5,
							shadowColor: '#aaa',
							exploded: [,,8],
							textAccessible: false,
							resizable: true,
							labelsSticksList: layout.labelSticks,							
							labelsSticksLength: layout.labelsSticksLength,
							labelsSticksLinewidth: layout.labelsSticksLinewidth,							
							textSize: layout.textFontSize,
							labelsBold: layout.labelBold,							
							eventsClick: onClickDimension
							//eventsMousemove: onMouseMove,
						}
					}).draw();
					break;
					
				// Draws 3d donut chart
				case "3d-donut":
					chart = new RGraph.Pie({
						id: 'cvs',
						data: measArray,
						options: {
							gutterLeft: 50,
							gutterRight: 50,
							linewidth: 0,
							strokestyle: 'rgba(0,0,0,0)',
							tooltips: dimArray,
							tooltipsEvent: 'onmousemove',					
							labels: labelsArray,						
							colors: palette,
							variant: 'donut3d',
							//radius: 100,
							//labelsSticksColors: [,'#cc0',,,'#0f0',,'black'],
							labelsSticksColors:palette,
							radius: layout.radiusValue,
							shadowOffsety: 5,
							shadowColor: '#aaa',
							exploded: [,,8],
							textAccessible: false,
							resizable: true,
							labelsSticksList: layout.labelSticks,
							labelsSticksLength: layout.labelsSticksLength,
							labelsSticksLinewidth: layout.labelsSticksLinewidth,
							textSize: layout.textFontSize,
							labelsBold: layout.labelBold,
							eventsClick: onClickDimension
							//eventsMousemove: onMouseMove,
						}
					}).draw();
					break;					
						
				case "3d-bar":
					chart = new RGraph.Bar({
						id: 'cvs',
						data: measArray,
						options: {
							textAccessible: true,
							variant: '3d',
							variantThreedAngle: 0.1,
							strokestyle: 'rgba(0,0,0,0)',
							colors: palette,
							gutterTop: 5,
							gutterLeft: 5,
							gutterRight: 15,
							gutterBottom: 50,
							labels: labelsArray,
							//tooltips: dimArray,
							shadowColor:'#ccc',
							shadowOffsetx: 3,
							backgroundGridColor: '#eee',
							scaleZerostart: true,
							axisColor: '#ddd',
							//unitsPost: 'km',
							//title: 'Distance run in the past week',
							//key: ['John','Kevin','Lucy'],
							keyShadow: true,
							keyShadowColor: '#ccc',
							keyShadowOffsety: 0,
							keyShadowOffsetx: 3,
							keyShadowBlur: 15,
							resizable: true,
							textSize: layout.textFontSize,
							labelsBold: layout.labelBold,							
							eventsClick: onClickDimension
						}
					}).draw();				
					break;
			}
			
			
			// On Click actions
			function onClickDimension (e, shape)
			{
				var index = shape.index;
				that.selectValues(0, [index], true);
			}	
			
			// On Mouse Over actions
			function onMouseMove (e, shape)
			{
				var index = shape.index;
				that.selectValues(0, dimArray[index], true);
			}					
			
			//needed for export
			return qlik.Promise.resolve();
		}
	};

} );

