/*--------------------------------------------------------------------------
____________________________________________________________________________
Original Author's (Claris) instructions
____________________________________________________________________________
  Usage instruction:
  
  Go into the terrain tab of database, and set the following custom parameters:
  
  {StealthCL:true}
  
  I was able to make this by modifying a plugin created by SapphireSoft,
  "highlevel-outside.js". It causes terrain with the right custom parameters
  to be drawn on top of units, so units can hide go "under" tree tops and such.
  It should be useful for aesthetic purposes, even if it makes units hard to see
  with certain terrain.
____________________________________________________________________________  
  Notes from Francis:
____________________________________________________________________________ 
 
  Firstly, also download my Layer Renderer plugin (FotF_LayerRenderer.js)
  as it is required for this plugin to work. Put both this file and the Layer
  Renderer plugin in your Plugin folder.
  
  I modified this plugin to only render the mapchips over units if there is no
  unit on the mapchip under the mapchip in question (as in y + 1).
  Exceptions from this rule occur, when:
  
	- There is a unit directly on the mapchip in question	--> head of lower unit cut off, but upper unit will be hidden
	- The mapchip below the one in question also has it's third layer enabled	--> no random heads sticking out from trees etc.
  
  I redesigned this plugin to work in modules with other terrain rendering plugins of mine.
  This was a somewhat necessary step to guarantee full compatibility and customizability.
  
  If you have any questions about this plugin, feel free to reach out to me
  over the SRPG Studio University Discord server @francisofthefilth
  
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
		
	2023/12/15 Update (FotF)
		Updated this plugin to be modular with FotF_LayerRenderer.js as core plugin for compatibility reasons.
		Please use in conjunction with FotF_LayerRenderer.js
		
		No need for FotF_MapColorUnjumbler.js anymore as it's intgrated into the Layer Renderer now.
		
		Removed the need for the map common event, please delete/disable it as the reset of the third
		layer cache is now done internally.
		
		Also resets the third layer before the wait command now, so unit heads aren't cut off anymore
		during movement simulation.
		
	2023/01/10 Update (FotF)
		Fixed a bug that allowed the third layer tiles to be rendered in the next map if the map is changed.
		
	2024/29/01 Update (FotF)
		Fixed tiles not being passed into the array at the start of a map if a unit started below them
		resulting in missing third layer properties.
		
		Unit heads are now never cut off, even if another unit is above them.
		
		Added custom parameter "aboveThird". Units with this custom parameter will be rendered above
		the third layer (e.g. for flying units). Use like aboveThird:true
	
	
--------------------------------------------------------------------------*/
var FotF_EnableThirdLayer = true						//So FotF_LayerRenderer.js knows it has to render the third layer, set to false to disable third layer rendering
var thirdLayerCache = null;
var ThirdLayerArray = null;

(function () {
	
	var FotF_PrepareMapLayerThird = MapLayer.prepareMapLayer;
	MapLayer.prepareMapLayer = function () {
		FotF_PrepareMapLayerThird.call(this);
		
		if (ThirdLayerArray != null) {
			 ThirdLayerArray = null;
		}
		
		thirdLayerCache = null;
		root.log('thirdLayerCache reset');

	};
	
	var FotF_EraseThirdLayerArray = ScriptCall_Load;
	ScriptCall_Load = function () {
		FotF_EraseThirdLayerArray.call(this);
		if (ThirdLayerArray != null) {
			ThirdLayerArray = null;
		}
	}

	var FotF_EraseMapLayer = SystemTransition.initialize;
	SystemTransition.initialize = function () {
		FotF_EraseMapLayer.call(this);
		if (ThirdLayerArray != null && root.getCurrentScene() === SceneType.BATTLESETUP) {
			ThirdLayerArray = null;
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

	var FotF_ResetThirdLayerCache = SimulateMove._endMove;
	SimulateMove._endMove = function(unit) {
		FotF_ResetThirdLayerCache.call(this, unit);
		
		if (thirdLayerCache !== null) {
			thirdLayerCache = null;
			root.log('thirdLayerCache reset');
		}
	}
	
})();

var FotF_RenderThirdLayerUnitLayer = function () {

	if (root.getCurrentSession() !== null) {
		if (thirdLayerCache === null && ThirdLayerArray === null) {
			FotF_CreateThirdLayerArray();
			//root.log('created Third Layer Array');
		}

		var t;
		var arr = ThirdLayerArray
		var graphicsManager = root.getGraphicsManager();
		var mapData = root.getCurrentSession().getCurrentMapInfo();
		var mapwidth = mapData.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
		var mapheight = mapData.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
		var mapColorIndex = root.getCurrentSession().getCurrentMapInfo().getMapColorIndex();
		var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
		var mapColorAlpha = mapColorData.getAlpha();
		var mapColorUsed = FotF_MapColorUnjumbler();

		if (thirdLayerCache === null) {

			thirdLayerCache = graphicsManager.createCacheGraphics(mapwidth, mapheight);
			graphicsManager.setRenderCache(thirdLayerCache);
			for (t = 0; t < arr.length; ++t) {
				
				if (PosChecker.getUnitFromPos(arr[t][1], arr[t][2] + 1) !== null && PosChecker.getUnitFromPos(arr[t][1], arr[t][2]) === null && !PosChecker.getTerrainFromPosEx(arr[t][1], arr[t][2] + 1).custom.StealthCL && !PosChecker.getTerrainFromPos(arr[t][1], arr[t][2] + 1).custom.StealthCL) {
					arr[t].splice(8, 1, false);
				}
				
				if (PosChecker.getUnitFromPos(arr[t][1], arr[t][2] + 1) === null || PosChecker.getUnitFromPos(arr[t][1], arr[t][2]) !== null) {
					arr[t].splice(8, 1, true);
				}

				if (arr[t][8] === true) {
					if (arr[t][7] === true) {
						arr[t][0].setColor(mapColorUsed, mapColorAlpha);
					}			
						arr[t][0].drawParts((arr[t][1] * GraphicsFormat.MAPCHIP_WIDTH), (arr[t][2] * GraphicsFormat.MAPCHIP_HEIGHT), arr[t][3], arr[t][4], arr[t][5], arr[t][6])
				}
			}
			graphicsManager.resetRenderCache();
			//root.log('UnitLayer Cache created');
		}

		if (thirdLayerCache !== null) {
			var scrollPixelX = root.getCurrentSession().getScrollPixelX();
			var scrollPixelY = root.getCurrentSession().getScrollPixelY();

			thirdLayerCache.draw(-scrollPixelX, -scrollPixelY);
			//root.log('UnitLayer Cache drawn');
		}
		
		for (t = 0; t < arr.length; ++t) {
			if (PosChecker.getUnitFromPos(arr[t][1], arr[t][2] + 1) !== null && PosChecker.getUnitFromPos(arr[t][1], arr[t][2]) !== null && !PosChecker.getTerrainFromPosEx(arr[t][1], arr[t][2] + 1).custom.StealthCL && !PosChecker.getTerrainFromPos(arr[t][1], arr[t][2] + 1).custom.StealthCL) {
				var unit = PosChecker.getUnitFromPos(arr[t][1], arr[t][2] + 1)
				var scrollPixelX = root.getCurrentSession().getScrollPixelX();
				var scrollPixelY = root.getCurrentSession().getScrollPixelY();
				var directionArray = [4, 1, 2, 3, 0];

				unitRenderParam = StructureBuilder.buildUnitRenderParam();
				unitRenderParam.isScroll = true;
				unitRenderParam.animationIndex = 0
				if (unitRenderParam.colorIndex === -1) {
					unitRenderParam.colorIndex = unit.getUnitType();
				}
				if (unitRenderParam.handle === null) {
					unitRenderParam.handle = unit.getCharChipResourceHandle();
				}
				unitRenderParam.direction = unit.getDirection();
				unitRenderParam.animationIndex = MapLayer.getAnimationIndexFromUnit(unit);

				var handle = unitRenderParam.handle;
				var width = GraphicsFormat.CHARCHIP_WIDTH;
				var height = GraphicsFormat.CHARCHIP_HEIGHT;
				var xSrc = handle.getSrcX() * (width * 3);
				var ySrc = handle.getSrcY() * (height * 5);
				var tileSize = UnitRenderer._getTileSize(unitRenderParam);
				var pic = UnitRenderer._getGraphics(handle, unitRenderParam.colorIndex);

				if (pic === null) {
					return;
				}

				UnitRenderer._drawCustomCharChip(unit, arr[t][1] * GraphicsFormat.MAPCHIP_WIDTH - scrollPixelX, (arr[t][2] + 1) * GraphicsFormat.MAPCHIP_HEIGHT - scrollPixelY, unitRenderParam);
				
			}
				
			if (PosChecker.getUnitFromPos(arr[t][1], arr[t][2]) !== null && PosChecker.getUnitFromPos(arr[t][1], arr[t][2]).custom.aboveThird) {
				
				var unit = PosChecker.getUnitFromPos(arr[t][1], arr[t][2])
				var scrollPixelX = root.getCurrentSession().getScrollPixelX();
				var scrollPixelY = root.getCurrentSession().getScrollPixelY();
				var directionArray = [4, 1, 2, 3, 0];

				unitRenderParam = StructureBuilder.buildUnitRenderParam();
				unitRenderParam.isScroll = true;
				unitRenderParam.animationIndex = 0
				if (unitRenderParam.colorIndex === -1) {
					unitRenderParam.colorIndex = unit.getUnitType();
				}
				if (unitRenderParam.handle === null) {
					unitRenderParam.handle = unit.getCharChipResourceHandle();
				}
				unitRenderParam.direction = unit.getDirection();
				unitRenderParam.animationIndex = MapLayer.getAnimationIndexFromUnit(unit);

				var handle = unitRenderParam.handle;
				var width = GraphicsFormat.CHARCHIP_WIDTH;
				var height = GraphicsFormat.CHARCHIP_HEIGHT;
				var xSrc = handle.getSrcX() * (width * 3);
				var ySrc = handle.getSrcY() * (height * 5);
				var tileSize = UnitRenderer._getTileSize(unitRenderParam);
				var pic = UnitRenderer._getGraphics(handle, unitRenderParam.colorIndex);

				if (pic === null) {
					return;
				}

				UnitRenderer._drawCustomCharChip(unit, arr[t][1] * GraphicsFormat.MAPCHIP_WIDTH - scrollPixelX, (arr[t][2]) * GraphicsFormat.MAPCHIP_HEIGHT - scrollPixelY, unitRenderParam);
			}
		}
	}
};

var FotF_RenderThirdLayerScrollUnit = function (unit, x, y, unitRenderParam) {
	var session = root.getCurrentSession();
	var mx = session.getScrollPixelX();
	var my = session.getScrollPixelY();
	var t;
	var arr = ThirdLayerArray
	var mapColorIndex = root.getCurrentSession().getCurrentMapInfo().getMapColorIndex();
	var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
	var mapColorAlpha = mapColorData.getAlpha();
	var mapColorUsed = FotF_MapColorUnjumbler();
	var graphicsManager = root.getGraphicsManager();
	var mapData = root.getCurrentSession().getCurrentMapInfo();
	var mapwidth = mapData.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
	var mapheight = mapData.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;

	if (thirdLayerCache !== null) {

		var scrollPixelX = root.getCurrentSession().getScrollPixelX();
		var scrollPixelY = root.getCurrentSession().getScrollPixelY();
		thirdLayerCache.draw(-scrollPixelX, -scrollPixelY);
		//root.log('UnitLayer Cache drawn moving');
	}
	
	for (t = 0; t < arr.length; ++t) {
		if (PosChecker.getUnitFromPos(arr[t][1], arr[t][2] + 1) !== null && !PosChecker.getTerrainFromPosEx(arr[t][1], arr[t][2] + 1).custom.StealthCL && !PosChecker.getTerrainFromPos(arr[t][1], arr[t][2] + 1).custom.StealthCL) {
			var unit = PosChecker.getUnitFromPos(arr[t][1], arr[t][2] + 1)
			var scrollPixelX = root.getCurrentSession().getScrollPixelX();
			var scrollPixelY = root.getCurrentSession().getScrollPixelY();
			var directionArray = [4, 1, 2, 3, 0];

			unitRenderParam = StructureBuilder.buildUnitRenderParam();
			unitRenderParam.isScroll = true;
			unitRenderParam.animationIndex = 0
			if (unitRenderParam.colorIndex === -1) {
				unitRenderParam.colorIndex = unit.getUnitType();
			}
			if (unitRenderParam.handle === null) {
				unitRenderParam.handle = unit.getCharChipResourceHandle();
			}
			unitRenderParam.direction = unit.getDirection();
			unitRenderParam.animationIndex = MapLayer.getAnimationIndexFromUnit(unit);

			var handle = unitRenderParam.handle;
			var width = GraphicsFormat.CHARCHIP_WIDTH;
			var height = GraphicsFormat.CHARCHIP_HEIGHT;
			var xSrc = handle.getSrcX() * (width * 3);
			var ySrc = handle.getSrcY() * (height * 5);
			var tileSize = UnitRenderer._getTileSize(unitRenderParam);
			var pic = UnitRenderer._getGraphics(handle, unitRenderParam.colorIndex);

			if (pic === null) {
				return;
			}

			UnitRenderer._drawCustomCharChip(unit, arr[t][1] * GraphicsFormat.MAPCHIP_WIDTH - scrollPixelX, (arr[t][2] + 1) * GraphicsFormat.MAPCHIP_HEIGHT - scrollPixelY, unitRenderParam);
		}
	}
	
	if (unit !== null && unit.custom.aboveThird) {
				
				//var unit = PosChecker.getUnitFromPos(arr[t][1], arr[t][2])
				var scrollPixelX = root.getCurrentSession().getScrollPixelX();
				var scrollPixelY = root.getCurrentSession().getScrollPixelY();
				var directionArray = [4, 1, 2, 3, 0];

				unitRenderParam = StructureBuilder.buildUnitRenderParam();
				unitRenderParam.isScroll = true;
				unitRenderParam.animationIndex = 0
				if (unitRenderParam.colorIndex === -1) {
					unitRenderParam.colorIndex = unit.getUnitType();
				}
				if (unitRenderParam.handle === null) {
					unitRenderParam.handle = unit.getCharChipResourceHandle();
				}
				unitRenderParam.direction = unit.getDirection();
				unitRenderParam.animationIndex = MapLayer.getAnimationIndexFromUnit(unit);

				var handle = unitRenderParam.handle;
				var width = GraphicsFormat.CHARCHIP_WIDTH;
				var height = GraphicsFormat.CHARCHIP_HEIGHT;
				var xSrc = handle.getSrcX() * (width * 3);
				var ySrc = handle.getSrcY() * (height * 5);
				var tileSize = UnitRenderer._getTileSize(unitRenderParam);
				var pic = UnitRenderer._getGraphics(handle, unitRenderParam.colorIndex);

				if (pic === null) {
					return;
				}

				UnitRenderer._drawCustomCharChip(unit, x - scrollPixelX, y - scrollPixelY, unitRenderParam);
	}
};

var FotF_CreateThirdLayerArray = function () {
	var i, j;
	var session = root.getCurrentSession();
	var mx = session.getScrollPixelX();
	var my = session.getScrollPixelY();			
	ThirdLayerArray = []
	for (i = 0; i < CurrentMap.getWidth(); i++) {
		for (j = 0; j < CurrentMap.getHeight(); j++) {
			var lowerTerrain = PosChecker.getTerrainFromPos(i, j + 1)
			var lowerTerrainUnder = PosChecker.getTerrainFromPosEx(i, j + 1)
			var Terrain = PosChecker.getTerrainFromPos(i, j)
			var TerrainUnder = PosChecker.getTerrainFromPosEx(i, j)
			var lowerUnitCheck = PosChecker.getUnitFromPos(i, j + 1)
			var upperUnitCheck = PosChecker.getUnitFromPos(i, j)
			
			if (TerrainUnder.custom.StealthCL) {
				var imgU = TerrainUnder.getMapchipImage();
				var handle = session.getMapChipGraphicsHandle(i, j, false);
				var trans = false;
				ThirdLayerArray.push([imgU, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, trans, true])
			}
			
			if (Terrain.custom.StealthCL) {
				var img = Terrain.getMapchipImage();					
				var handle = session.getMapChipGraphicsHandle(i, j, true);
				var trans = true;
				ThirdLayerArray.push([img, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, trans, true])
			}
		}
	}
};
/*
var FotF_CreateThirdLayerArray = function () {
	var i, j;
	var session = root.getCurrentSession();
	var mx = session.getScrollPixelX();
	var my = session.getScrollPixelY();			
	ThirdLayerArray = []
	for (i = 0; i < CurrentMap.getWidth(); i++) {
		for (j = 0; j < CurrentMap.getHeight(); j++) {
			var lowerTerrain = PosChecker.getTerrainFromPos(i, j + 1)
			var lowerTerrainUnder = PosChecker.getTerrainFromPosEx(i, j + 1)
			var Terrain = PosChecker.getTerrainFromPos(i, j)
			var TerrainUnder = PosChecker.getTerrainFromPosEx(i, j)
			var lowerUnitCheck = PosChecker.getUnitFromPos(i, j + 1)
			var upperUnitCheck = PosChecker.getUnitFromPos(i, j)
					
			if (TerrainUnder.custom.StealthCL && lowerUnitCheck === null) {
				var imgU = TerrainUnder.getMapchipImage();
				var handle = session.getMapChipGraphicsHandle(i, j, false);
				var trans = false;
				ThirdLayerArray.push([imgU, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, trans, true])
			} else if (TerrainUnder.custom.StealthCL && upperUnitCheck !== null) {
				var imgU = TerrainUnder.getMapchipImage();
				var handle = session.getMapChipGraphicsHandle(i, j, false);
				var trans = false;
				ThirdLayerArray.push([imgU, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, trans, true])
			} else if (TerrainUnder.custom.StealthCL && lowerTerrainUnder.custom.StealthCL) {
				var imgU = TerrainUnder.getMapchipImage();
				var handle = session.getMapChipGraphicsHandle(i, j, false);
				var trans = false;
				ThirdLayerArray.push([imgU, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, trans, true])
			}
	
			if (Terrain.custom.StealthCL && lowerUnitCheck === null) {
				var img = Terrain.getMapchipImage();					
				var handle = session.getMapChipGraphicsHandle(i, j, true);
				var trans = true;
				ThirdLayerArray.push([img, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, trans, true])
			} else if (Terrain.custom.StealthCL && upperUnitCheck !== null) {
				var img = Terrain.getMapchipImage();
				var handle = session.getMapChipGraphicsHandle(i, j, true);
				var trans = true;
				ThirdLayerArray.push([img, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, trans, true])
			} else if (Terrain.custom.StealthCL && lowerTerrain.custom.StealthCL) {
				var img = Terrain.getMapchipImage();
				var handle = session.getMapChipGraphicsHandle(i, j, true);
				var trans = true;
				ThirdLayerArray.push([img, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, trans, true])
			}
		}
	}
};
*/
