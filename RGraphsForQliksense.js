
define( ["qlik"
		,"./libraries/RGraph.common.core"
		,"./libraries/RGraph.common.dynamic"
		,"./libraries/RGraph.common.tooltips"
		,"./libraries/RGraph.common.resizing"		
		,"./libraries/RGraph.common.key"
		,"./libraries/RGraph.pie"
		,"./libraries/RGraph.bar"
		,"./libraries/RGraph.drawing.rect"
		,"./libraries/RGraph.funnel"
		//,"./libraries/RGraph.bipolar"					
		],
function (qlik, RCommonCore, RCommonDynamic, RCommonTooltips, RCommonresizable, RCommonKey, RPie, RBar, RDRRect, RBipolar) {
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
				chartTypeDividion: {
					component: "expandable-items",
					label: "Chart Type",
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
							}, {
								value: "funnel",
								label: "Funnel Chart"
							}],
							defaultValue: "3d-pie"
						}							
					}
				},
				settings : {
					uses : "settings",
					items: {
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
						labelSticksDefColor: {
							type: "boolean",
							component: "switch",
							label: "Labels Sticks Default Colors",
							ref: "labelSticksDefColor",
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
							max: 50,
							step: 1,
							defaultValue: 8
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
						},
						
						explodedSegmentDist: {
							type: "number",
							component: "slider",
							label: "Exploded Segment Distance",
							ref: "explodedSegmentDist",
							min: 1,
							max: 100,
							step: 1,
							defaultValue: 15
						}
					}
				},	
				funnelChartSection: {
					component: "expandable-items",
					label: "Funnel Chart settings",
					items: {
						funnelChartWidth: {
							type: "number",
							component: "slider",
							label: "Funnel Chart Width",
							ref: "funnelChartWidth",
							min: 1,
							max: 300,
							step: 1,
							defaultValue: 75
						},
						funnelChartHeight: {
							type: "number",
							component: "slider",
							label: "Funnel Chart Height",
							ref: "funnelChartHeight",
							min: 1,
							max: 50,
							step: 1,
							defaultValue: 15
						}						
					}
				},
				legendPositionSection: {
					component: "expandable-items",
					label: "Legend settings",
					items: {
						legendPosH: {
							type: "number",
							component: "slider",
							label: "Legend Horizontally",
							ref: "legendPosH",
							min: 1,
							max: 1000,
							step: 1,
							defaultValue: 1
						},
						legendPosV: {
							type: "number",
							component: "slider",
							label: "Legend Vertically",
							ref: "legendPosV",
							min: 1,
							max: 1000,
							step: 1,
							defaultValue: 1
						}						
					}
				},				
				colorsConfig: {
					component: "expandable-items",
					label: "Dimension Layout Configuration",
					items: {
						colorsConfigList: {                              
							type: "array",                       
							ref: "layoutList",                     
							label: "Dimension Layout",    
							itemTitleRef: "label",               
							allowAdd: true,                      
							allowRemove: true,                   
							addTranslation: "Add Dimension Configuration",    					
							items: {                                                             
								label: {                           
									type: "string",                                  
									ref: "label",                    
									label: "Dimension Name",                  
									expression: "always",          
									defaultValue: "Dimension Name"            
								},
								dimColor: {                           
									type: "string",                                  
									ref: "dimColor",                    
									label: "Dimension Color",                  
									expression: "always",          
									defaultValue: "#000000"            
								}
								/*,
								dimLabelColor: {                           
									type: "string",                                  
									ref: "dimLabelColor",                    
									label: "Dimension Label Color",                  
									expression: "always",          
									defaultValue: "#000000"            
								}
								*/
							}
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
			var objectId = that.options.id;
			
			var app = qlik.currApp(this);
			
			var arrayExplode = [];
			
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
			var elementNumber = [];
			for (var i=0; i<numberOfDimValues;i++){
				dimArray[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][0].qText;
				measArray[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][1].qText;
				elementNumber[i] = layout.qHyperCube.qDataPages[0].qMatrix[i][0].qElemNumber;
				arrayExplode[i]=0;
			}
			
			
			var dimensionLength=layout.qHyperCube.qDataPages[0].qMatrix.length;
						
			
			var html = '';
			
			var cvsId = objectId + "-cvs";
			
			var width = $element.width(), height = $element.height();
			html+='<div id="canvas-wrapper"><canvas align="center" id="'+ cvsId + '" width="'+(width)+'" height="'+(height)+'">[No canvas support]</canvas></div>';
			
			$element.html(html);
			
			// Activate ou Deactivate Labels
			if (layout.chartLabels) {
				var labelsArray = dimArray;
			} else {
				var labelsArray = [];
			}
			
			
			// create dimension array
			var dictDimColors = [];
			//var dictDimLabelColors = [];
			for (var i=0;i<layout.layoutList.length;i++) {
				dictDimColors[layout.layoutList[i].label] = layout.layoutList[i].dimColor;
				//dictDimLabelColors[layout.layoutList[i].label] = layout.layoutList[i].dimLabelColor;				
			}
			
			var tooltipsArray = [];
			var colorsArray=[];
			var labelColorsArray=[];
			
			for (var i = 0; i<=dimArray.length - 1; i++){
				tooltipsArray[i] = dimArray[i] + ": " + measArray[i];
				
				//define Dim colors
				if (typeof dictDimColors[dimArray[i]] === "undefined"){
					colorsArray[i] = '#d3d3d3';
				} else {
					colorsArray[i] = dictDimColors[dimArray[i]];
				}
				
				//define labels colors
				/*
				if (typeof dictDimColors[dimArray[i]] === "undefined"){
					labelColorsArray[i] = '#000000';
				} else {
					labelColorsArray[i] = dictDimLabelColors[dimArray[i]];
				}
				*/
			}
			
			

			

			RGraph.Reset(document.getElementById(cvsId));
			
			switch(layout.chartTypeList) {
				// Draws 3d pie chart
				case "3d-pie":
					chart = new RGraph.Pie({
						id: cvsId,
						data: measArray,
						options: {
							gutterLeft: 50,
							gutterRight: 50,
							linewidth: 0,
							strokestyle: 'rgba(0,0,0,0)',
							tooltips: tooltipsArray,
							tooltipsEvent: 'onmousemove',					
							labels: labelsArray,						
							colors: colorsArray,
							variant: 'pie3d',
							//radius: 100,
							//labelsSticksColors: [,'#cc0',,,'#0f0',,'black'],
						
							radius: layout.radiusValue,
							shadowOffsety: 5,
							shadowColor: '#aaa',
							//exploded: [,,8],
							textAccessible: false,
							resizable: true,
							
							
							labelsSticks: layout.labelSticks,
							labelsSticksUsecolors: layout.labelSticksDefColor,
							//labelsSticksColors:labelColorsArray,
							//textColor:['#ff0032'],							
							
							labelsSticksLength: layout.labelsSticksLength,
							labelsSticksLinewidth: layout.labelsSticksLinewidth,							
							textSize: layout.textFontSize,
							labelsBold: layout.labelBold,							
							eventsClick: onClickDimensionPieAndDonut
							//eventsMousemove: onMouseMove
						}
					}).draw();
					break;
					
				// Draws 3d donut chart
				case "3d-donut":
					chart = new RGraph.Pie({
						id: cvsId,
						data: measArray,
						options: {
							gutterLeft: 50,
							gutterRight: 50,
							linewidth: 0,
							strokestyle: 'rgba(0,0,0,0)',
							tooltips: tooltipsArray,
							tooltipsEvent: 'onmousemove',					
							labels: labelsArray,						
							colors: colorsArray,
							variant: 'donut3d',
							//radius: 100,
							//labelsSticksColors: [,'#cc0',,,'#0f0',,'black'],

							radius: layout.radiusValue,
							shadowOffsety: 5,
							shadowColor: '#aaa',
							//exploded: [,,8],
							textAccessible: false,
							resizable: true,
							labelsSticks: layout.labelSticks,
							labelsSticksUsecolors: layout.labelSticksDefColor,
							//labelsSticksColors:labelColorsArray,
							labelsSticksLength: layout.labelsSticksLength,
							labelsSticksLinewidth: layout.labelsSticksLinewidth,
							textSize: layout.textFontSize,
							labelsBold: layout.labelBold,
							eventsClick: onClickDimensionPieAndDonut
							//eventsMousemove: onMouseMove
						}
					}).draw();
					break;					
						
				case "3d-bar":
					chart = new RGraph.Bar({
						id: cvsId,
						data: measArray,
						options: {
							textAccessible: true,
							variant: '3d',
							variantThreedAngle: 0.1,
							strokestyle: 'rgba(0,0,0,0)',
							colors: colorsArray,
							gutterTop: 5,
							gutterLeft: 5,
							gutterRight: 15,
							gutterBottom: 50,
							labels: labelsArray,
							tooltips: tooltipsArray,
							tooltipsEvent: 'onmousemove',
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
							textColor:labelColorsArray,
							labelsColors:labelColorsArray,
							labelsIngraphColor:labelColorsArray,
							labelsBold: layout.labelBold,							
							eventsClick: onClickDimensionBar
						}
					}).draw();				
					break;
					
					
				// Draws funnel chart
				
				case "funnel":
				/*
					chart = new RGraph.Bipolar({
						id: cvsId,
						left: measArray,
						right: measArray,
						options: {
							labels: labelsArray,
							variant: '3d',
							gutterBottom: 80,
							margin: 5,
							//noaxes: true,
							//scaleZerostart: true,
							colors: colorsArray,
							colorsSequential: true,
							tooltips: tooltipsArray,
							eventsClick: onClickFunnel
						}
					}).draw();	
					break;
				*/			
					measArray.push((Math.min.apply(null,measArray)/2));
					chart = new RGraph.Funnel({
						id: cvsId,
						data: measArray,
						options: {
							tooltips: tooltipsArray,
							//tooltipsEvent: 'onmousemove',					
							key: labelsArray,	
							//labels: labelsArray,
							labelsSticks: true,
							colors: colorsArray,
							//colors: null,
							shadow: true,
							gutterLeft: layout.funnelChartWidth,
							gutterRight: layout.funnelChartWidth,
							gutterTop: layout.funnelChartHeight,
							gutterBottom: layout.funnelChartHeight,
							keyPositionX: layout.legendPosH,
							keyPositionY: layout.legendPosV,
							eventsClick: onClickDimensionBar
						}
					}).draw();
					break;	
				
			}
			
			
			// On Click actions for Pie and Donut
			function onClickDimensionPieAndDonut (e, shape)
			{
				var index = shape.index;
				var obj = shape.object;
				
				//alert(index + ": " + (dimensionLength-1));
				/*if (index == dimensionLength-1) {
					var qlikSelectionArray = 0;
				} else {
					var qlikSelectionArray = index+1;
				}*/
				that.selectValues(0, elementNumber[index], false);
				
				
				if(arrayExplode[index]!=0){
					arrayExplode[index] = 0;
				} else {
					arrayExplode[index] = layout.explodedSegmentDist;
				}
				
				obj.explodeSegment(arrayExplode, layout.explodedSegmentDist);
				//arrayExplode[index]
				obj.set('exploded', arrayExplode);
				//obj.explodeSegment(index, layout.explodedSegmentDist);
				e.stopPropagation();
				
				
			}
			
			// On Click actions Bar Charts
			function onClickDimensionBar (e, shape)
			{
				var index = shape.index;
				that.selectValues(0, elementNumber[index], false);
			}				
			
			// On Mouse Over actions
			function onMouseMove (e, shape)
			{
				/*
				var index = shape.index;
				var obj = shape.object;
				obj.set('exploded', 0);
				obj.explodeSegment(index, 8);
				e.stopPropagation();
				*/
				//that.selectValues(0, dimArray[index], true);
			}					
			
			//needed for export
			return qlik.Promise.resolve();
		}
	};

} );

