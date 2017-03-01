
define( ["qlik"
		,"./libraries/RGraph.common.core"
		,"./libraries/RGraph.common.dynamic"
		,"./libraries/RGraph.common.tooltips"
		,"./libraries/RGraph.pie"
		],
function (qlik, RCommonCore, RCommonDynamic, RCommonTooltips, RCommonPie) {
var palette = [
		 '#2196f3'
		,'#e3f2fd'
		,'#bbdefb'
		,'#90caf9'
		,'#64b5f6'
		,'#42a5f5'
		,'#1e88e5'
		,'#1976d2'
		,'#1565c0'
		,'#0d47a1'
		,'#82b1ff'
		,'#448aff'
		,'#2979ff'
		,'#2962ff'
		,'#4caf50'
		,'#e8f5e9'
		,'#c8e6c9'
		,'#a5d6a7'
		,'#81c784'
		,'#66bb6a'
		,'#43a047'
		,'#388e3c'
		,'#2e7d32'
		,'#1b5e20'
		,'#b9f6ca'
		,'#69f0ae'
		,'#00e676'
		,'#00c853'
		,'#3f51b5'
		,'#e8eaf6'
		,'#c5cae9'
		,'#9fa8da'
		,'#7986cb'
		,'#5c6bc0'
		,'#3949ab'
		,'#303f9f'
		,'#283593'
		,'#1a237e'
		,'#8c9eff'
		,'#536dfe'
		,'#3d5afe'
		,'#304ffe'
		,'#9c27b0'
		,'#f3e5f5'
		,'#e1bee7'
		,'#ce93d8'
		,'#ba68c8'
		,'#ab47bc'
		,'#8e24aa'
		,'#7b1fa2'
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
				settings : {
					uses : "settings"									
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
			console.log('Data returned: ', layout.qHyperCube);
			
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
			html+='<div id="canvas-wrapper"><canvas id="cvs" width="'+width+'" height="'+height+'">[No canvas support]</canvas></div>';
			
			$element.html(html);
			

			var pie = new RGraph.Pie({
				id: 'cvs',
				data: measArray,
				options: {
					gutterLeft: 50,
					gutterRight: 50,
					linewidth: 0,
					strokestyle: 'rgba(0,0,0,0)',
					//tooltips: ['Alvin','Pete','Hoolio','Jack','Kev','Luis','Lou','Jesse'],
					//labels: ['Alvin','Pete','Hoolio','Jack','Kev','Luis','Lou','Jesse'],
					tooltips: dimArray,
					tooltipsEvent: 'onmousemove',
					//labels: dimArray,						
					//colors: ['red','yellow','blue','cyan','green','pink','white','#aaa'],
					colors: palette,
					variant: 'pie3d',
					radius: 100,
					labelsSticksList: true,
					labelsSticksColors: [,'#cc0',,,'#0f0',,'black'],
					radius: 80,
					shadowOffsety: 5,
					shadowColor: '#aaa',
					exploded: [,,8],
					textAccessible: true,
					eventsClick: onClickDimension
					//eventsMousemove: onMouseMove,
				}
			}).draw();		
			
			function onClickDimension (e, shape)
			{
				var index = shape.index;
				app.field(dimensionName).toggleSelect(dimArray[index], true);
			}	

			function onMouseMove (e, shape)
			{
				var index = shape.index;
				//self.backendApi.selectValues(0, dimArray[index], true);
				app.field(dimensionName).toggleSelect(dimArray[index], true);
			}					
			
			//needed for export
			return qlik.Promise.resolve();
		}
	};

} );

