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
  Additional instructions by Francis:
____________________________________________________________________________ 
 
  Firstly, also download my Layer Renderer plugin (FotF_LayerRenderer.js)
  as it is required for this plugin to work. Put both this file and the Layer
  Renderer plugin in your Plugin folder.
  
  I redesigned this plugin to work in modules with other terrain rendering plugins of mine.
  This was a somewhat necessary step to guarantee full compatibility and customizability.
  
  There are a ton of extra functions added over the original plugin, customizable in the
  Layer Renderer plugin file. New functions include:
  
  - Unit's heads aren't cut off by the third layer anymore if standing on the tile
	below a third layer tile.
  
  - The third layer is now rendered in correct map color (day/night/etc.).
  
  - The plugin is heavily optimized for performance, it shouldn't lag anymore even with
	hundreds of third layer tiles.
	
  - Units with custom parameter "aboveThird:true" will be rendered above the third layer.
  
  - If a global switch specified in the Layer Renderer file is on, third layer tiles in
	player unit range (or all third layer tiles, customizable) are rendered semi-transparent.
	To make use of this, you need to set extra "ground" tiles beneath all third layer tiles
	using the unlimited layers plugin.
  
  
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
		
	2024/01/10 Update (FotF)
		Fixed a bug that allowed the third layer tiles to be rendered in the next map if the map is changed.
		
	2024/01/29 Update (FotF)
		Fixed tiles not being passed into the array at the start of a map if a unit started below them
		resulting in missing third layer properties.
		
		Unit heads are now never cut off, even if another unit is above them.
		
		Added custom parameter "aboveThird". Units with this custom parameter will be rendered above
		the third layer (e.g. for flying units).
		
	2024/03/02 Update (FotF)
		Added see-through functionality: If a specified global switch is on, third layer tiles in player unit range
		are rendered semi-transparent to allow players to see units beneath them. THAT TOOK WAY TOO LONG...
		Also added option to render the whole third layer semi-transparent.
		
		Fixed a bug that allowed fully opaque tiles to be passed into the third layer array twice, enabling
		some other weird behaviours.
		
		Added an option to hide enemies and allies (make them invisible) if they're behind a third layer tile
		and out of player unit range.
		
	2024/03/03 Update (FotF)
		Fixed an exception occuring when a unit has no weapons.
		
	2024/03/11 Update (FotF)
		Greatly reduced lag for maps with many third layer tiles
		(tested 60 fps with 777 third layer tiles on a 40x76 map).
		
	2024/03/17	Update (FotF)
		Further improved performance.
		
		Layer cutout / enemy hiding will now update periodically to reflect all changes made to it. (Every 34 frames).
		
		Unit heads are no longer cut off during unit movement, even during "move unit" event command.
		
		
	
	
--------------------------------------------------------------------------*/
FotF_LayerRendererConstants.EnableThirdLayer = true							//So FotF_LayerRenderer.js knows it has to render the third layer, set to false to disable third layer rendering
var thirdLayerCache = null;
var cutOutCache = null;
var ThirdLayerArray = null;
//var thirdLayerIndexArray = null;
var thirdLayerCutArray = null;
//var blockThirdLayerCache = null;
var hiddenUnitArray = null;
var blockAfterImage = null;

(function () {
	
	//Initialize the map, reseting all caches and arrays
	var FotF_PrepareMapLayerThird = MapLayer.prepareMapLayer;
	MapLayer.prepareMapLayer = function () {
		FotF_PrepareMapLayerThird.call(this);
		
		if (ThirdLayerArray != null) {
			ThirdLayerArray = null;
		}
		/*
		if (thirdLayerIndexArray != null) {
			thirdLayerIndexArray = null;
		}
		*/
		if (thirdLayerCutArray !== null) {
			thirdLayerCutArray = null;
		}
		
		thirdLayerCache = null;
		cutOutCache = null;
		hiddenUnitArray = []
		FotF_LayerRendererConstants.blockThirdLayerCache = false;
		blockAfterImage = false;
		//root.log('thirdLayerCache reset');

	};
	
	//For re-calculating the third layer upon loading a save file
	var FotF_EraseThirdLayerArray = ScriptCall_Load;
	ScriptCall_Load = function () {
		FotF_EraseThirdLayerArray.call(this);
		if (ThirdLayerArray != null) {
			ThirdLayerArray = null;
		}
		/*
		if (thirdLayerIndexArray != null) {
			thirdLayerIndexArray = null;
		}
		*/
		if (thirdLayerCutArray !== null) {
			thirdLayerCutArray = null;
		}
	}

	var FotF_EraseMapLayer = SystemTransition.initialize;
	SystemTransition.initialize = function () {
		FotF_EraseMapLayer.call(this);
		if (ThirdLayerArray != null && root.getCurrentScene() === SceneType.BATTLESETUP) {
			ThirdLayerArray = null;
		}
		/*
		if (thirdLayerIndexArray != null  && root.getCurrentScene() === SceneType.BATTLESETUP) {
			thirdLayerIndexArray = null;
		}
		*/
		if (thirdLayerCutArray !== null) {
			thirdLayerCutArray = null;
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

	//For re-calculating the cutout cache when units move during movement simulation
	var FotF_ResetThirdLayerCache = SimulateMove._endMove;
	SimulateMove._endMove = function(unit) {
		FotF_ResetThirdLayerCache.call(this, unit);
		/*
		if (thirdLayerCache !== null) {
			thirdLayerCache = null;
			//root.log('thirdLayerCache reset');
		}
		*/
		if (FotF_LayerRendererConstants.AlwaysRenderWithTransparency === true || FotF_LayerRendererConstants.LimitedTLViewDistance === true) {
			if (cutOutCache !== null) {
				cutOutCache = null;
				//root.log('cutOutCache reset');
			}
		
			if (thirdLayerCutArray !== null) {
				thirdLayerCutArray = null;
			}
			
			if (thirdLayerCutArray === null) {
				FotF_FilterThirdLayerIndexArray();
				//root.log('filtered third layer array');
			}
		}

		blockAfterImage = false;
	}

	//Blocks afterimage if unit's move started below a third layer tile
	var FotF_GetMoveCource = SimulateMove.startMove;
	SimulateMove.startMove = function(unit, moveCource) {
		FotF_GetMoveCource.call(this, unit, moveCource);
		blockAfterImage = true;
	}

	//For re-calculating the third layer Cache when unit movement is canceled
	var FotF_ResetThirdLayerCache2 = PlayerTurn.setPosValue;
	PlayerTurn.setPosValue = function(unit) {
		FotF_ResetThirdLayerCache2.call(this, unit);
		/*
		if (thirdLayerCache !== null) {
			thirdLayerCache = null;
			//root.log('thirdLayerCache reset');
		}
		*/
		if (FotF_LayerRendererConstants.AlwaysRenderWithTransparency === true || FotF_LayerRendererConstants.LimitedTLViewDistance === true) {
			if (cutOutCache !== null) {
				cutOutCache = null;
				//root.log('cutOutCache reset');
			}
		
			if (thirdLayerCutArray !== null) {
				thirdLayerCutArray = null;
			}
			
			if (thirdLayerCutArray === null) {
				FotF_FilterThirdLayerIndexArray();
				//root.log('filtered third layer array');
			}
		}
		
		blockAfterImage = false;
	};
	
	//For re-calculating the third layer array if mapchips are changed with "Control Map Pos" or "Extensive Command" event command
	var FotF_ReloadThirdLayer = MapPosOperationEventCommand._enterMapChip;
	MapPosOperationEventCommand._enterMapChip = function () {
		
		if (FotF_LayerRendererConstants.EnableThirdLayer !== null) {
			if (FotF_LayerRendererConstants.EnableThirdLayer === true) {
				ThirdLayerArray = null;
				thirdLayerCache = null;
				cutOutCache = null;
				thirdLayerCutArray = null;
			}
		}
		FotF_ReloadThirdLayer.call(this);
	};
	
	//Calculates the cutout array for the unit range transparency feature
	FotF_StartArrayFiltering = MarkingPanel.updateMarkingPanel;
	MarkingPanel.updateMarkingPanel = function() {
		FotF_StartArrayFiltering.call(this);
	};

	//Blocks afterimage if units are moved with "Move Unit" event command
	FotF_BlockAfterImage2 = ScriptCall_GetUnitMoveCource;
	ScriptCall_GetUnitMoveCource = function(unit, xGoal, yGoal, isTerrainDisabled) {
		blockAfterImage = true;
		return FotF_BlockAfterImage2(unit, xGoal, yGoal, isTerrainDisabled);
	};
})();

var FotF_RenderThirdLayerUnitLayer = function () {

	if (root.getCurrentSession() !== null) {
		if (thirdLayerCache === null && ThirdLayerArray === null) {
			FotF_CreateThirdLayerArray();
			//root.log('created Third Layer Array');
		}

		if (thirdLayerCutArray === null) {
			FotF_FilterThirdLayerIndexArray();
		}
		
		if (cutOutCache === null) {
			FotF_CreateCutOutCache();
		}
		
		var t, i;
		var arr = ThirdLayerArray
		var cutArr = thirdLayerCutArray;
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

				if (arr[t][8] === true) {
						
					arr[t][0].setColor(mapColorUsed, mapColorAlpha);
					arr[t][0].drawParts((arr[t][1] * GraphicsFormat.MAPCHIP_WIDTH), (arr[t][2] * GraphicsFormat.MAPCHIP_HEIGHT), arr[t][3], arr[t][4], arr[t][5], arr[t][6])
					
					//root.log('---opaque at ' + arr[t][1] + ' / ' + arr[t][2] + ' / ' + arr[t][7]);

				}
			}
			graphicsManager.resetRenderCache();
			//root.log('UnitLayer Cache created');
		}

		if (thirdLayerCache !== null && FotF_LayerRendererConstants.blockThirdLayerCache === false && FotF_LayerRendererConstants.cutOutSwitch === false) {
			var scrollPixelX = root.getCurrentSession().getScrollPixelX();
			var scrollPixelY = root.getCurrentSession().getScrollPixelY();

			thirdLayerCache.draw(-scrollPixelX, -scrollPixelY);
			//root.log('UnitLayer Cache drawn');
		} else {
			var scrollPixelX = root.getCurrentSession().getScrollPixelX();
			var scrollPixelY = root.getCurrentSession().getScrollPixelY();
			cutOutCache.draw(-scrollPixelX, -scrollPixelY);
			//root.log('cutOutCache TL drawn');
		}
		
		var listArray = [];

		listArray.push(PlayerList.getSortieDefaultList());
		listArray.push(EnemyList.getAliveDefaultList());
		listArray.push(AllyList.getAliveDefaultList());

		var finalList = StructureBuilder.buildDataList();
		finalList.setDataArray(listArray);
		
		for (t = 0; t < finalList.getCount(); t++) {
			var list = finalList.getData(t);
			
			for (i = 0; i < list.getCount(); i++) {
				var unit = list.getData(i);
				var x = unit.getMapX();
				var y = unit.getMapY();
				var terrain = PosChecker.getTerrainFromPos(x, y);
				
				if (y > 0) {
					var terrain2 = PosChecker.getTerrainFromPos(x, y - 1);
				} else {
					var terrain2 = null;
				}
				
				if (terrain.custom.StealthCL && unit.getUnitType() !== UnitType.PLAYER && FotF_LayerRendererConstants.HideUnitsOutOfRange === true && !unit.custom.aboveThird) {
					var index = CurrentMap.getIndex(x, y);
					var unitFromPos = PosChecker.getUnitFromPos(x, y);
					
					if (cutArr.indexOf(index) > -1 && unit.isInvisible() === true) {
						unit.setInvisible(false);
						root.log(unit.getName() + ' set visible')
						hiddenUnitArray.splice(t, 1);
					} else if (cutArr.indexOf(index) < 0 && unit.isInvisible() === false) {
						hiddenUnitArray.push(unit);
						unit.setInvisible(true);
						root.log(unit.getName() + ' set invisible')
					}
					
				} else if (terrain2 !== null && terrain2.custom.StealthCL && !terrain.custom.StealthCL && blockAfterImage === false) {
					
					var hpType = EnvironmentControl.getMapUnitHpType();
					var scrollPixelX = root.getCurrentSession().getScrollPixelX();
					var scrollPixelY = root.getCurrentSession().getScrollPixelY();
					var directionArray = [4, 1, 2, 3, 0];

					unitRenderParam = StructureBuilder.buildUnitRenderParam();
					unitRenderParam.isScroll = true;
					unitRenderParam.animationIndex = 0
					if (unitRenderParam.colorIndex === -1) {
						unitRenderParam.colorIndex = unit.getUnitType();
					}
					if (unit.isWait()) {
						unitRenderParam.colorIndex = 3;
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

					UnitRenderer._drawCustomCharChip(unit, x * GraphicsFormat.MAPCHIP_WIDTH - scrollPixelX, (y) * GraphicsFormat.MAPCHIP_HEIGHT - scrollPixelY, unitRenderParam);
					
					root.drawCharChipSymbol(x * GraphicsFormat.MAPCHIP_WIDTH - scrollPixelX, (y) * GraphicsFormat.MAPCHIP_HEIGHT - scrollPixelY, unit);
					
					if (hpType === 0 || hpType === 1) {
						root.drawCharChipHPGauge(x * GraphicsFormat.MAPCHIP_WIDTH - scrollPixelX, (y) * GraphicsFormat.MAPCHIP_HEIGHT - scrollPixelY, unit);
					}
					
					root.drawCharChipStateIcon(x * GraphicsFormat.MAPCHIP_WIDTH - scrollPixelX, (y) * GraphicsFormat.MAPCHIP_HEIGHT - scrollPixelY, unit);
				}
			}
		}
	}
};

//To render the unit double during certain conditions, so the third layer doesn't cut off its head
var FotF_RenderThirdLayerScrollUnit = function (unit, x, y, unitRenderParam) {
	
	xDiff = Math.round(x / GraphicsFormat.MAPCHIP_WIDTH);
	yDiff = Math.round(y / GraphicsFormat.MAPCHIP_HEIGHT);
	
	var terrain = PosChecker.getTerrainFromPos(xDiff, yDiff);
	
	if (yDiff > 0) {
		var terrain2 = PosChecker.getTerrainFromPos(xDiff, yDiff - 1);
	} else {
		var terrain2 = null;
	}
	
	if (terrain2 !== null && terrain2.custom.StealthCL && !terrain.custom.StealthCL && blockAfterImage === true) {

		var hpType = EnvironmentControl.getMapUnitHpType();
		var scrollPixelX = root.getCurrentSession().getScrollPixelX();
		var scrollPixelY = root.getCurrentSession().getScrollPixelY();
		var directionArray = [4, 1, 2, 3, 0];

		unitRenderParam = StructureBuilder.buildUnitRenderParam();
		unitRenderParam.isScroll = true;
		unitRenderParam.animationIndex = 0
		if (unitRenderParam.colorIndex === -1) {
			unitRenderParam.colorIndex = unit.getUnitType();
		}
		if (unit.isWait()) {
			unitRenderParam.colorIndex = 3;
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
	var mapData = session.getCurrentMapInfo();
	var mapWidth = mapData.getMapWidth();
	var mapHeight = mapData.getMapHeight();
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
				var index = CurrentMap.getIndex(i, j);
				ThirdLayerArray.push([imgU, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, index, true])
				//root.log('pushed opaque terrain at ' + i + ' / ' + j);
			}
			
			else if (Terrain.custom.StealthCL) {
				var img = Terrain.getMapchipImage();					
				var handle = session.getMapChipGraphicsHandle(i, j, true);
				var index = CurrentMap.getIndex(i, j);
				ThirdLayerArray.push([img, i, j, handle.getSrcX() * GraphicsFormat.MAPCHIP_WIDTH, handle.getSrcY() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT, index, true])
				//root.log('pushed transparent terrain at ' + i + ' / ' + j);
			}
		}
	}
	root.log('ThirdLayerArray length: ' + ThirdLayerArray.length);
};

//Refresh everything, execute this to re-calculate the whole third layer
//e.g. when mapchip changes through "Change Mapchip" are done

var FotF_RefreshThirdLayer = function() {
	
	if (ThirdLayerArray !== null) {
		ThirdLayerArray = null;
	}
	
	if (thirdLayerCache !== null) {
		thirdLayerCache = null;
	}

	if (thirdLayerCutArray !== null) {
		thirdLayerCutArray = null;
	}
	
	root.log('Third layer refreshed');
	
};

FotF_FilterThirdLayerIndexArray = function () {
	var i, index;
	var session = root.getCurrentSession();
	var simulator = session.createMapSimulator();
	var mapData = session.getCurrentMapInfo();
	var mapwidth = mapData.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
	var mapheight = mapData.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
	var screenwidth = root.getWindowWidth();
	var screenheight = root.getWindowHeight();
	var playerList = session.getPlayerList();
	var playerCount = playerList.getCount();
	
	mergeArray = []
	
	for (j = 0; j < playerCount; j++) {
		
		unit = playerList.getData(j);
		
		if (unit === null) {
			continue;
		}
		
		var i;
		var weapon = ItemControl.getEquippedWeapon(unit);
		var move = RealBonus.getMov(unit);
		var startRange = 0
		
		if (weapon !== null) {
			var endRange = move + weapon.getEndRange();
		} else {
			var endRange = move;
		}
		
		FotF_PlayerIndexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), startRange, endRange);
		
		if (FotF_PlayerIndexArray !== null && typeof FotF_PlayerIndexArray === 'object') {
			//root.log('pushed index array: ' + FotF_PlayerIndexArray);
			mergeArray = mergeArray.concat(FotF_PlayerIndexArray);
			//root.log('merge array: ' + mergeArray);
			FotF_PlayerIndexArray = null;
			//root.log('set FotF_PlayerIndexArray to null');
		}
	}

	//Don't even try eliminating duplicates in mergeArray. It dumps performance. Without eliminating duplicates,
	//this whole function takes ~30 ms. With eliminating (using indexOf and a loop, because this version of js
	//is fucking stupid and doesn't support new Set or .includes) it takes ~60-90 ms (depending on array length).
	//Just leave it as is, except you find a better way to sort out duplicates as stupid old me.

	thirdLayerCutArray = []
	
	for (i = 0; i < mergeArray.length; i++) {
		var index = mergeArray[i];
		var x = CurrentMap.getX(index);
		var y = CurrentMap.getY(index);
		var terrain = PosChecker.getTerrainFromPos(x, y);
		
		if (terrain.custom.StealthCL) {
			thirdLayerCutArray.push(index);
		}
	}
};

FotF_CreateCutOutCache = function() {
	
	var t;
	var arr = ThirdLayerArray
	var cutArr = thirdLayerCutArray;
	var graphicsManager = root.getGraphicsManager();
	var mapData = root.getCurrentSession().getCurrentMapInfo();
	var mapwidth = mapData.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
	var mapheight = mapData.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
	var mapColorIndex = root.getCurrentSession().getCurrentMapInfo().getMapColorIndex();
	var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
	var mapColorAlpha = mapColorData.getAlpha();
	var mapColorUsed = FotF_MapColorUnjumbler();

	if (cutOutCache === null) {

		cutOutCache = graphicsManager.createCacheGraphics(mapwidth, mapheight);
		graphicsManager.setRenderCache(cutOutCache);
		
		for (t = 0; t < arr.length; ++t) {
			if (arr[t][8] === true && FotF_LayerRendererConstants.AlwaysRenderWithTransparency === true) {
				
				arr[t][0].setColor(mapColorUsed, mapColorAlpha);
				arr[t][0].setAlpha(FotF_LayerRendererConstants.ThirdLayerAlpha);
				arr[t][0].drawParts((arr[t][1] * GraphicsFormat.MAPCHIP_WIDTH), (arr[t][2] * GraphicsFormat.MAPCHIP_HEIGHT), arr[t][3], arr[t][4], arr[t][5], arr[t][6])
				
				//root.log('---fully transparent at ' + arr[t][1] + ' / ' + arr[t][2] + ' / ' + arr[t][7]);
				
			} else if (arr[t][8] === true && FotF_LayerRendererConstants.LimitedTLViewDistance === true && cutArr.indexOf(arr[t][7]) !== -1) {
				
				arr[t][0].setColor(mapColorUsed, mapColorAlpha);
					
				if (cutArr.indexOf(arr[t][7]) > -1) {
					
					arr[t][0].setAlpha(FotF_LayerRendererConstants.ThirdLayerAlpha);
				}
				
				arr[t][0].drawParts((arr[t][1] * GraphicsFormat.MAPCHIP_WIDTH), (arr[t][2] * GraphicsFormat.MAPCHIP_HEIGHT), arr[t][3], arr[t][4], arr[t][5], arr[t][6])
				
				//root.log('---partially transparent at ' + arr[t][1] + ' / ' + arr[t][2] + ' / ' + arr[t][7]);
			
			} else if (arr[t][8] === true) {
				
				arr[t][0].setColor(mapColorUsed, mapColorAlpha);
				arr[t][0].drawParts((arr[t][1] * GraphicsFormat.MAPCHIP_WIDTH), (arr[t][2] * GraphicsFormat.MAPCHIP_HEIGHT), arr[t][3], arr[t][4], arr[t][5], arr[t][6])
				
				//root.log('---opaque at ' + arr[t][1] + ' / ' + arr[t][2] + ' / ' + arr[t][7]);

			}
		}
		graphicsManager.resetRenderCache();
		root.log('cutOutCache created');
	}
};