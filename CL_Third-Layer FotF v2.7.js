/*--------------------------------------------------------------------------
  Usage instruction:
  
  Go into the terrain tab of database, and set the following custom parameters:
  
  {StealthCL:true}
  
  I was able to make this by modifying a plugin created by SapphireSoft,
  "highlevel-outside.js". It causes terrain with the right custom parameters
  to be drawn on top of units, so units can hide go "under" tree tops and such.
  It should be useful for aesthetic purposes, even if it makes units hard to see
  with certain terrain.
  
  Notes from Francis:
  
  Firstly, also download my Map Color Unjumbler plugin (FotF_MapColorUnjumbler.js)
  as it is required for this plugin to work. Put both this file and the Map Color
  Unjumbler in your Plugin folder.
  
  I modified this plugin to only render the mapchips over units if there is no
  unit on the mapchip under the mapchip in question (as in y + 1).
  Exceptions from this rule occur, when:
  
	- There is a unit directly on the mapchip in question	--> head of lower unit cut off, but upper unit will be hidden
	- The mapchip below the one in question also has it's third layer enabled	--> no random heads sticking out from trees etc.
	
  To use this feature, you have to set up a map common event without activation conditions that executes the following code:
  
	ScriptCall_Load();
	if (thirdLayerCache !== null) {
		thirdLayerCache = -1
	}

  Make sure to free the event at the end of itself, or it will only work once on map start :/
  
  If you have any questions about this plugin, feel free to reach out to me
  over the SRPG Studio Univerity Discord server @francisofthefilth
  
  Original Plugin Author:
  SapphireSoft
  http://srpgstudio.com/
  
  Original Plugin History:
  2018/08/19 Released
  
  Adapted Plugin Author:
  Rogue Claris
  Francis of the Filth
  
  Adapted Plugin History:
  2020/10/05 Released
  	2022/11/02 Update
		No longer leaves old map layer artifacts on the next map.
	  	Overrides the following commands for Quality of Life visual concerns:
	  	AfterTransitionFlowEntry._completeMemberData;
	  	BeforeTransitionFlowEntry._completeMemberData;
   
	2022/11/05 Update
		No longer lags horrifically. Again. Fixed that AGAIN.
		No longer leaves artifacts...again...I fixed that in a different way. Hopefully for good.
		
	2023/10/29 Update (FotF)
		Added functionality to automatically disable the overlay on mapchips if units are below them
		(So their heads aren't cut off)
	
	2023/11/02 Update (FotF)
		Now also renders the third layer in the correct map color. For whatever reason, it doesn't
		work with the default evening color.
		
	2023/11/03 Update (FotF)
		Now supports all map colors.
		
	2023/11/24 Update (FotF)
		Fixed serious performance issues on maps with lots of third layer tiles.
		Modified the map common event needed for this to work, so check that if you're upgrading to this version.
		
	2023/12/03 Update (FotF)
		Moved the Map Color Unjumbler to a separate plugin. Standalone operation of this plugin is still possible
		by uncommenting the FotF_MapColorUnjumbler function at the bottom of this file.
  
--------------------------------------------------------------------------*/
var thirdLayerCache = null;

(function () {
	
	var FotF_PrepareMapLayer = MapLayer.prepareMapLayer;
	MapLayer.prepareMapLayer = function () {
		FotF_PrepareMapLayer.call(this);
		thirdLayerCache = -1;
		root.log('thirdLayerCache reset');
		root.log(thirdLayerCache);
	};
	
	var alias3 = MapLayer.drawUnitLayer;
	MapLayer.drawUnitLayer = function () {
		alias3.call(this);
		var i, j;
		var session = root.getCurrentSession();
		var mx = session.getScrollPixelX();
		var my = session.getScrollPixelY();
		var mapColorIndex = root.getCurrentSession().getCurrentMapInfo().getMapColorIndex();
		var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
		var mapColorAlpha = mapColorData.getAlpha();
		var mapColorUsed = FotF_MapColorUnjumbler();			
		if (root.getMetaSession().global.ThirdLayerArray == null) {
			root.getMetaSession().global.ThirdLayerArray = []
			for (i = 0; i < CurrentMap.getWidth(); i++) {
				for (j = 0; j < CurrentMap.getHeight(); j++) {
					var lowerTerrain = PosChecker.getTerrainFromPos(i, j + 1)
					var lowerTerrainUnder = PosChecker.getTerrainFromPosEx(i, j + 1)
					var Terrain = PosChecker.getTerrainFromPos(i, j)
					var TerrainUnder = PosChecker.getTerrainFromPosEx(i, j)
					var lowerUnitCheck = PosChecker.getUnitFromPos(i, j + 1)
					var upperUnitCheck = PosChecker.getUnitFromPos(i, j)
					var mirrorUnitCheck = PosChecker.getUnitFromPos(i, j -1)
					
					if (TerrainUnder.custom.StealthCL && lowerUnitCheck === null) {
						var imgU = TerrainUnder.getMapchipImage();
						var colImgU = TerrainUnder.getMapchipImage().setColor(mapColorUsed, mapColorAlpha);
						var handle = session.getMapChipGraphicsHandle(i, j, false);
						var trans = false;
						root.getMetaSession().global.ThirdLayerArray.push([imgU, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, trans])
					} else if (TerrainUnder.custom.StealthCL && upperUnitCheck !== null) {
						var imgU = TerrainUnder.getMapchipImage();
						var colImgU = TerrainUnder.getMapchipImage().setColor(mapColorUsed, mapColorAlpha);
						var handle = session.getMapChipGraphicsHandle(i, j, false);
						var trans = false;
						root.getMetaSession().global.ThirdLayerArray.push([imgU, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, trans])
					} else if (TerrainUnder.custom.StealthCL && lowerTerrainUnder.custom.StealthCL) {
						var imgU = TerrainUnder.getMapchipImage();
						var colImgU = TerrainUnder.getMapchipImage().setColor(mapColorUsed, mapColorAlpha);
						var handle = session.getMapChipGraphicsHandle(i, j, false);
						var trans = false;
						root.getMetaSession().global.ThirdLayerArray.push([imgU, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, trans])
					}
					
					if (Terrain.custom.StealthCL && lowerUnitCheck === null) {
						var img = Terrain.getMapchipImage();
						var colImg = Terrain.getMapchipImage().setColor(mapColorUsed, mapColorAlpha);
						var handle = session.getMapChipGraphicsHandle(i, j, true);
						var trans = true;
						root.getMetaSession().global.ThirdLayerArray.push([img, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, trans])
					} else if (Terrain.custom.StealthCL && upperUnitCheck !== null) {
						var img = Terrain.getMapchipImage();
						var colImg = Terrain.getMapchipImage().setColor(mapColorUsed, mapColorAlpha);
						var handle = session.getMapChipGraphicsHandle(i, j, true);
						var trans = true;
						root.getMetaSession().global.ThirdLayerArray.push([img, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, trans])
					} else if (Terrain.custom.StealthCL && lowerTerrain.custom.StealthCL) {
						var img = Terrain.getMapchipImage();
						var colImg = Terrain.getMapchipImage().setColor(mapColorUsed, mapColorAlpha);
						var handle = session.getMapChipGraphicsHandle(i, j, true);
						var trans = true;
						root.getMetaSession().global.ThirdLayerArray.push([img, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, trans])
					}
				}
			}
		}
		var t;
		var arr = root.getMetaSession().global.ThirdLayerArray
		var graphicsManager = root.getGraphicsManager();
		var mapData = root.getCurrentSession().getCurrentMapInfo();
		var mapwidth = mapData.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
		var mapheight = mapData.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
		if (thirdLayerCache === -1) {
			thirdLayerCache = graphicsManager.createCacheGraphics(mapwidth, mapheight);
			graphicsManager.setRenderCache(thirdLayerCache);
		
			for (t = 0; t < arr.length; ++t) {

				if (arr[t][7] === true) {
					arr[t][0].setColor(mapColorUsed, mapColorAlpha);
				}
				arr[t][0].drawParts((arr[t][1] * GraphicsFormat.MAPCHIP_WIDTH), (arr[t][2] * GraphicsFormat.MAPCHIP_HEIGHT), arr[t][3], arr[t][4], arr[t][5], arr[t][6])
			}
			graphicsManager.resetRenderCache();
			//root.log('UnitLayer Cache created');
		}
		
		if (thirdLayerCache !== -1) {
			var scrollPixelX = root.getCurrentSession().getScrollPixelX();
			var scrollPixelY = root.getCurrentSession().getScrollPixelY();
			thirdLayerCache.draw(-scrollPixelX, -scrollPixelY);
			//root.log('UnitLayer Cache drawn');
		}
			
		
	};

	var DrawScrollCL = UnitRenderer.drawScrollUnit;
	UnitRenderer.drawScrollUnit = function (unit, x, y, unitRenderParam) {
		DrawScrollCL.call(this, unit, x, y, unitRenderParam);
		var session = root.getCurrentSession();
		var mx = session.getScrollPixelX();
		var my = session.getScrollPixelY();
		var t;
		var arr = root.getMetaSession().global.ThirdLayerArray
		var mapColorIndex = root.getCurrentSession().getCurrentMapInfo().getMapColorIndex();
		var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
		var mapColorAlpha = mapColorData.getAlpha();
		var mapColorUsed = FotF_MapColorUnjumbler();
		var graphicsManager = root.getGraphicsManager();
		var mapData = root.getCurrentSession().getCurrentMapInfo();
		var mapwidth = mapData.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
		var mapheight = mapData.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
		if (thirdLayerCache === -1) {
			thirdLayerCache = graphicsManager.createCacheGraphics(mapwidth, mapheight);
			graphicsManager.setRenderCache(thirdLayerCache);
		
			for (t = 0; t < arr.length; ++t) {

				if (arr[t][7] === true) {
					arr[t][0].setColor(mapColorUsed, mapColorAlpha);
				}
				arr[t][0].drawParts((arr[t][1] * GraphicsFormat.MAPCHIP_WIDTH) - mx, (arr[t][2] * GraphicsFormat.MAPCHIP_HEIGHT) - my, arr[t][3], arr[t][4], arr[t][5], arr[t][6])
			}
			graphicsManager.resetRenderCache();
			//root.log('UnitLayer Cache created');
		}
		
		if (thirdLayerCache !== -1) {
			var scrollPixelX = root.getCurrentSession().getScrollPixelX();
			var scrollPixelY = root.getCurrentSession().getScrollPixelY();
			thirdLayerCache.draw(-scrollPixelX, -scrollPixelY);
			//root.log('UnitLayer Cache drawn');
		}
	};

	var EraseArrCL = ScriptCall_Load;
	ScriptCall_Load = function () {
		EraseArrCL.call(this);
		if (root.getMetaSession().global.ThirdLayerArray != null) {
			delete root.getMetaSession().global.ThirdLayerArray
		}
	}

	var EraseMapLayerCL1 = SystemTransition.initialize;
	SystemTransition.initialize = function () {
		EraseMapLayerCL1.call(this);
		if (root.getMetaSession().global.ThirdLayerArray != null && root.getCurrentScene() === SceneType.BATTLESETUP) {
			delete root.getMetaSession().global.ThirdLayerArray
		}
	}

	AfterTransitionFlowEntry._completeMemberData = function (battleResultScene) {
		if (SceneManager.isScreenFilled()) {
			return EnterResult.NOTENTER;
		}

		this._transition.setFadeSpeed(5);
		this._transition.setEffectRangeType(EffectRangeType.ALL);
		this._transition.setVolume(255, 0, 160, true);

		return EnterResult.OK;
	}

	BeforeTransitionFlowEntry._completeMemberData = function (battleResultScene) {
		var effect;

		if (SceneManager.isScreenFilled()) {
			// If it's EffectRangeType.ALL, the characters on the "logo" are all covered,
			// so change it to EffectRangeType.ALL.
			effect = root.getScreenEffect();
			effect.setRange(EffectRangeType.ALL);
			return EnterResult.NOTENTER;
		}

		this._transition.setFadeSpeed(5);
		this._transition.setEffectRangeType(EffectRangeType.ALL);
		this._transition.setVolume(160, 0, 0, true);

		return EnterResult.OK;
	}
/*
	var FotF_MapColorUnjumbler = function () {
	
		var mapColorIndex = root.getCurrentSession().getCurrentMapInfo().getMapColorIndex();
		var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
		var mapColorName = mapColorData.getName();
		var mapColorID = mapColorData.getId();
		var mapColorAlpha = mapColorData.getAlpha();
		var mapColorDec = mapColorData.getColor();
		var hexColorRev = mapColorDec.toString(16);
		var hexColorRevStr = hexColorRev.toString();
	
		if (hexColorRevStr.length === 6) {
		
			var hex1 = hexColorRevStr.slice(4);
			var hex2 = hexColorRevStr.slice(2, 4);
			var hex3 = hexColorRevStr.slice(0, 2);
		
			var hexColor = '0x' + hex1 + hex2 + hex3;
			var mapColorHex = Number(hexColor);
			return mapColorHex;
		
		} else if (hexColorRevStr.length === 4) {
		
			if (mapColorDec < 65536) {
			
				var hex1 = hexColorRevStr.slice(2, 4);
				var hex2 = hexColorRevStr.slice(0, 2);
				var hex3 = '00';
		
			} else if (65535 < mapColorDec < 16711936) {
			
				var hex1 = hexColorRevStr.slice(2, 4);
				var hex2 = '00';
				var hex3 = hexColorRevStr.slice(0, 2);
		
			} else if (16711935 < mapColorDec) {
			
				var hex1 = '00';
				var hex2 = hexColorRevStr.slice(0, 2);
				var hex3 = hexColorRevStr.slice(2, 4);
		
			}
		
			var hexColor = '0x' + hex1 + hex2 + hex3;
			var mapColorHex = Number(hexColor);
			return mapColorHex;
		
		} else if (hexColorRevStr.length === 2) {
			
			if (mapColorDec < 256) {
			
				var hex1 = hexColorRevStr.slice(0, 2);
				var hex2 = '00';
				var hex3 = '00';
		
			} else if (255 < mapColorDec < 65281) {
			
				// No changes need to be made to pure green colors
			
			} else if (mapColorDec > 65280) {
			
				var hex1 = '00';
				var hex2 = '00';
				var hex3 = hexColorRevStr.slice(0, 2);
			}
	
			var hexColor = '0x' + hex1 + hex2 + hex3;
			var mapColorHex = Number(hexColor);
			return mapColorHex;
	
		} else {
		
			var mapColorHex = 0x0;
			return mapColorHex;
		
	}
};
*/
})();