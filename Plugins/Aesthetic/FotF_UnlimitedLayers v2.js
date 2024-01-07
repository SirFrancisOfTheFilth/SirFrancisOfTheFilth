/*--------------------------------------------------------------------------
This plugin gives you unlimited power over SRPG Studio's 2-Layer Mapchip system!

Ever wanted to overlay a transparent mapchip with another transparent mapchip?
SRPG Studio won't let you do that, as it overwrites the first with the second one.
But with this plugin, exactly that is possible now!
And it even works with the Third Layer plugin! (My version at least)

___________________________________________________________________________
So how does it work?
___________________________________________________________________________

First things first. Download my Layer Renderer plugin (FotF_LayerRenderer.js)
and put it in your Plugin folder alongside this plugin.
Without it this plugin will not work.

In the map's custom parameters, specify an array of arrays like this:

{
addLayer:[
[isRuntime, id, xSrc, ySrc, xDest, yDest],
[isRuntime, id, xSrc, ySrc, xDest, yDest],
[isRuntime, id, xSrc, ySrc, xDest, yDest],
...
]
}

isRuntime: 		Whether you want to draw an RTP (Runtime) Mapchip or an original one					Visual guide to xSrc & ySrc:
				RTP --> true	Original --> false
				
id:				The ID of the mapchip image file containing the mapchip you want to draw
																										0/0		1/0		2/0		3/0		...
xSrc & ySrc:	The X- and Y-Coordinates of the mapchip within the mapchip file. So the					0/1		1/1		2/1		3/1		...
				third mapchip in the second row would have 2 for xSrc and 1 for ySrc.					0/2		1/2		2/2		3/2		...
																										...		...		...		...		...
xDest & yDest:	Same principle as xSrc and ySrc, but these describe the target coordinates
				to which the mapchip will be drawn on the map.
				
To render the tiles above units (as in the Third Layer plugin), use addThirdLayer
instead of addLayer. This can be used instead of or in conjunction with my version of
the third layer plugin (FotF_ThirdLayer v3.js). Third layer tiles rendered by this plugin
will be rendered above ones rendered with the third layer plugin.

___________________________________________________________________________
Example:
___________________________________________________________________________

You want to render 3 mapchips above the already existing terrain. Mapchip 1 is an RTP
mapchip, 2 & 3 are original. Also mapchip 3 is to be rendered above units.
In the map's custom parameters you would add:

{
addLayer:[
[true, 60, 3, 2, 4, 4],			<-- Comma after array because it is not the last			<-- This will render mapchip 1 (which is the open blue chest of the RTP Ornaments) to the position 4/4 on the map
[false, 7, 4, 10, 4, 4]			<-- No comma after array because it is the last				<-- This will render mapchip 2 (which is the 5th mapchip in the 11th row of the original mapchip file with id 7) to the position 4/4 on the map
]

addThirdLayer:[
[false, 3, 0, 0, 4, 4]																		<-- This will render mapchip 3 (which is the 1st mapchip in the 1st row of the original mapchip file with id 3) to the position 4/4 on the map, above units
]
}

Notice anything? All 3 mapchips will be rendered to the same position.
And they will all be rendered above another! No replacing!
You could for example render a potion above the open chest and a symbol
above everything (including the unit standing on the tile).

___________________________________________________________________________
That's cool, but what if I want to erase the additional mapchips?
___________________________________________________________________________

Don't worry, I got you. To erase a specific additional mapchip, first determine
2 things:

1. Is it a normal mapchip (rendered under units) or a third layer mapchip (rendered above units)?
2. Which position is it at inside the respective custom parameter array?

Number 1 determines if we use the function FotF_DisableAdditionalLayer for normal mapchips
or FotF_DisableAdditionalThirdLayer for third layer mapchips.

Number 2 determines which mapchip is to be erased. For this you take the array in your map's
custom parameters (addLayer for normal mapchips, addThirdLayer for third layer mapchips) and
find the mapchip you want to erase. Then count at which position your mapchip's array is in
the list of arrays and subtract 1 from that number (because arrays start at 0).

So if for example we want mapchip 2 & 3 from our previous example erased, we
would run the functions

FotF_DisableAdditionalLayer(1);

and

FotF_DisableAdditionalThirdLayer(0);

through the Execute Script > Execute Code event command.

___________________________________________________________________________
So now they are gone, but I want them back!
___________________________________________________________________________

Also possible!
See, they are not erased from the array, only not allowed to be rendered.
To re-enable a specific mapchip that has been disabled, run the function
FotF_EnableAdditionalLayer for normal mapchips or 
FotF_EnableAdditionalThirdLayer for third layer mapchips.
They work the same as the functions to disable mapchips.

Let's say you want mapchips 2 & 3 from our example back after you disabled
them previously. You would simply run the functions

FotF_EnableAdditionalLayer(1);

and

FotF_EnableAdditionalThirdLayer(0);

through the Execute Script > Execute Code event command.

___________________________________________________________________________
Sidenote about additional third layer tiles above already existing third layer tiles
___________________________________________________________________________

Third layer tiles will always be rendered above all other tiles. That means to render
a tile above a third layer tile, it has to be third layer too. This means you have
to use addThirdLayer in the custom parameters.

If you have any questions about this unnecessarily complex plugin, feel free to
reach out to me over the SRPG Studio University Discord server @francisofthefilth


Original Plugin Author:
Francis of the Filth
  
Plugin History:
2023/12/03
Released

2023/12/13
Fixed stationary units being covered by non-third layer tiles during movement of
other units.

2023/07/01
Fixed a whole lot of other bugs (I can't remember all of them °-°).
Also 
  
--------------------------------------------------------------------------*/

var FotF_EnableUnlimitedLayers = true											//So FotF_LayerRenderer.js knows it has to render the additional layers, set to false to disable additional layer rendering
var additionalLayerCache = null;
var additionalThirdLayerCache = null;

(function () {
	
	FotF_DisableAdditionalLayerArray = []
	FotF_DisableAdditionalThirdLayerArray = []
	
	var FotF_ResetAdditionalLayerCache = SimulateMove._endMove;
	SimulateMove._endMove = function(unit) {
		FotF_ResetAdditionalLayerCache.call(this, unit);
		
		if (additionalLayerCache !== null) {
			additionalLayerCache = null;
			root.log('additionalLayerCache reset');
		}
		if (additionalThirdLayerCache !== null) {
			additionalThirdLayerCache = null;
			root.log('additionalThirdLayerCache reset');
		}
	};
	
})();

var FotF_DisableAdditionalLayer = function(index) {
	if (typeof index === 'number' && FotF_DisableAdditionalLayerArray.indexOf(index) < 0) {
		FotF_DisableAdditionalLayerArray.push(index);
		additionalLayerCache = null;
	}
	root.log('disableArray: ' + FotF_DisableAdditionalLayerArray);
};

var FotF_EnableAdditionalLayer = function(index) {
	if (typeof index === 'number' && FotF_DisableAdditionalLayerArray.indexOf(index) > -1) {
		var indexIndex = FotF_DisableAdditionalLayerArray.indexOf(index);
		FotF_DisableAdditionalLayerArray.splice(indexIndex, 1);
		additionalLayerCache = null;
	}
	root.log('disableArray: ' + FotF_DisableAdditionalLayerArray);
};

var FotF_DisableAdditionalThirdLayer = function(index) {
	if (typeof index === 'number' && FotF_DisableAdditionalThirdLayerArray.indexOf(index) < 0) {
		FotF_DisableAdditionalThirdLayerArray.push(index);
		additionalThirdLayerCache = null;
	}
	root.log('disableArray: ' + FotF_DisableAdditionalThirdLayerArray);
};

var FotF_EnableAdditionalThirdLayer = function(index) {
	if (typeof index === 'number' && FotF_DisableAdditionalThirdLayerArray.indexOf(index) > -1) {
		var indexIndex = FotF_DisableAdditionalThirdLayerArray.indexOf(index);
		FotF_DisableAdditionalThirdLayerArray.splice(indexIndex, 1);
		additionalThirdLayerCache = null;
	}
	root.log('disableArray: ' + FotF_DisableAdditionalThirdLayerArray);
};

var FotF_DrawAdditionalMapLayer = function() {

	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var scrollPixelX = session.getScrollPixelX();
	var scrollPixelY = session.getScrollPixelY();
	
	if (session !== null) {
		if (mapInfo.custom.addLayer) {
			if (additionalLayerCache === null) {
				FotF_CreateAdditionalLayerCache();
			}
			
			if (additionalLayerCache !== null) {
				additionalLayerCache.draw(-scrollPixelX, -scrollPixelY);
			}
		}
	}
};

var FotF_DrawAdditionalThirdLayer = function() {
		
	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var scrollPixelX = session.getScrollPixelX();
	var scrollPixelY = session.getScrollPixelY();
	
	if (session !== null) {
		if (mapInfo.custom.addThirdLayer) {
			if (additionalThirdLayerCache === null) {
				FotF_CreateAdditionalThirdLayerCache();
			}
			
			if (additionalThirdLayerCache !== null) {
				additionalThirdLayerCache.draw(-scrollPixelX, -scrollPixelY);
			}
		}
	}
};

var FotF_DrawAdditionalScrollLayer = function (unit, x, y, unitRenderParam) {

	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var scrollPixelX = session.getScrollPixelX();
	var scrollPixelY = session.getScrollPixelY();
	
	if (session !== null) {
		if (mapInfo.custom.addLayer) {
			if (additionalLayerCache === null) {
				FotF_CreateAdditionalLayerCache();
			}
			
			if (additionalLayerCache !== null) {
				additionalLayerCache.draw(-scrollPixelX, -scrollPixelY);
			}
		}
	}
};
	
var FotF_DrawAdditionalThirdScrollLayer = function (unit, x, y, unitRenderParam) {

	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var scrollPixelX = session.getScrollPixelX();
	var scrollPixelY = session.getScrollPixelY();
	
	if (session !== null) {
		if (mapInfo.custom.addThirdLayer) {
			if (additionalThirdLayerCache === null) {
				FotF_CreateAdditionalThirdLayerCache();
			}
			
			if (additionalThirdLayerCache !== null) {
				additionalThirdLayerCache.draw(-scrollPixelX, -scrollPixelY);
			}
		}
	}
};

var FotF_CreateAdditionalLayerCache = function() {
	
	var i;
	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var graphicsManager = root.getGraphicsManager();
	var mapwidth = mapInfo.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
	var mapheight = mapInfo.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
	var mapColorIndex = mapInfo.getMapColorIndex();
	var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
	var mapColorAlpha = mapColorData.getAlpha();
	var mapColorUsed = FotF_MapColorUnjumbler();
	var arr1 = mapInfo.custom.addLayer;
	
	additionalLayerCache = graphicsManager.createCacheGraphics(mapwidth, mapheight);
	graphicsManager.setRenderCache(additionalLayerCache);
			
	for (i = 0; i < arr1.length; i++) {
		if (FotF_DisableAdditionalLayerArray.indexOf(i) < 0) {
			var isRuntime = arr1[i][0]
			var id = arr1[i][1]
			var colorIndex = 0
			var xSrc = arr1[i][2] * GraphicsFormat.MAPCHIP_WIDTH
			var ySrc = arr1[i][3] * GraphicsFormat.MAPCHIP_HEIGHT
			var xDest = arr1[i][4] * GraphicsFormat.MAPCHIP_WIDTH;
			var yDest = arr1[i][5] * GraphicsFormat.MAPCHIP_HEIGHT;
			var handle = root.createResourceHandle(isRuntime, id, colorIndex, xSrc, ySrc);

			var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.MAPCHIP);
			if (pic === null) {
				root.log('pic is null :(');
				return;
			}

			pic.setColor(mapColorUsed, mapColorAlpha);
			pic.drawParts(xDest, yDest, xSrc, ySrc, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT)
		}
	}
			
	graphicsManager.resetRenderCache();
	root.log('additional Layer Cache created');
};

var FotF_CreateAdditionalThirdLayerCache = function() {
	
	var i;
	var session = root.getCurrentSession();
	var mapInfo = session.getCurrentMapInfo();
	var graphicsManager = root.getGraphicsManager();
	var mapwidth = mapInfo.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
	var mapheight = mapInfo.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
	var mapColorIndex = mapInfo.getMapColorIndex();
	var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
	var mapColorAlpha = mapColorData.getAlpha();
	var mapColorUsed = FotF_MapColorUnjumbler();
	var arr2 = mapInfo.custom.addThirdLayer;
	
	additionalThirdLayerCache = graphicsManager.createCacheGraphics(mapwidth, mapheight);
	graphicsManager.setRenderCache(additionalThirdLayerCache);
			
	for (i = 0; i < arr2.length; i++) {
		if (FotF_DisableAdditionalLayerArray.indexOf(i) < 0) {
			var isRuntime = arr2[i][0]
			var id = arr2[i][1]
			var colorIndex = 0
			var xSrc = arr2[i][2] * GraphicsFormat.MAPCHIP_WIDTH
			var ySrc = arr2[i][3] * GraphicsFormat.MAPCHIP_HEIGHT
			var xDest = arr2[i][4] * GraphicsFormat.MAPCHIP_WIDTH;
			var yDest = arr2[i][5] * GraphicsFormat.MAPCHIP_HEIGHT;
			var width = GraphicsFormat.MAPCHIP_WIDTH;
			var height = GraphicsFormat.MAPCHIP_HEIGHT;
			var handle = root.createResourceHandle(isRuntime, id, colorIndex, xSrc, ySrc);

			var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.MAPCHIP);
			if (pic === null) {
				root.log('pic is null :(');
				return;
			}

			pic.setColor(mapColorUsed, mapColorAlpha);
			pic.drawParts(xDest, yDest, xSrc, ySrc, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT);
		}
	}
			
	graphicsManager.resetRenderCache();
	root.log('additional Third Layer Cache created');
};