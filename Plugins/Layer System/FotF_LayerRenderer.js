/*--------------------------------------------------------------------------
  This plugin is a dependency for some of my other plugins like FotF_ThirdLayer.js (v3 and up)
  or FotF_UnlimitedLayers.js (v2 and up). It also removes the need for my map color unjumbler
  (FotF_MapColorUnjumbler.js).
  
  The logic behind this plugin is to coordinate other plugins which render things using
  the functions MapLayer.drawUnitLayer and UnitRenderer.drawScrollUnit, as well as
  providing a means to actually extract the right map colors from the map information.
  This file on its own does nothing.
  
  Please adjust the settings below to your liking, some functions won't work without
  enabling them first.
  
  If you have any questions about this plugin, feel free to reach out to me
  over the SRPG Studio University Discord server @francisofthefilth
  
  Original Plugin Author:
  Francis of the Filth
  
  2024/01/07 Released
  
  2024/01/29
	Fixed an issue if using only one of FotF_ThirdLayer or FotF_UnlimitedLayers
	
  2024/03/17
	Combined all 3 plugins (LayerRenderer, ThirdLayer and UnlimitedLayers) into
	a bigger system. Please use all 3 files, even if you don't intend on using
	the functions of one of them, as they are highly interconnected and might
	crash the game if one is missing.
	
	Added lots of new functions to the settings below, check them out.
  
  
--------------------------------------------------------------------------*/

/*---------------------------------------------------------------------------
								Settings
-----------------------------------------------------------------------------
	These settings change how third layer transparency and hiding of enemies
	and allies is handled. AlwaysRenderWithTransparency overrides LimitedTLViewDistance.
----------------------------------------------------------------------------*/
var FotF_LayerRendererConstants = {
	EnableThirdLayer: null,								//No touchy!
	EnableUnlimitedLayers: null,						//No touchy!
	DisableRangePanels: null,							//No touchy!
	blockThirdLayerCache: null,							//No touchy!
	blockThirdLayerCacheUL: null,						//No touchy!
	unlimitedLayersIndexArray: null,					//No touchy!
	ULCutOutIndexArray: null,							//No touchy!
	cutOutSwitch: null,									//No touchy!
	LayerCounter1: null,								//No touchy!	Synchronized with Unit Counter (every 14 frames)
	LayerCounter2: null,								//No touchy!	Synchronized with Unit Counter 2 (every 34 frames)
	LimitedTLViewDistance: true,						//Whether third layer tiles in movement/attack range of player units are rendered semi-transparent while player unit range is shown.
	AlwaysRenderWithTransparency: false,				//Whether to render all third layer tiles transparent when player unit range is shown.
	HideUnitsOutOfRange: true,							//Whether to hide enemies/allies (not display their unit menu etc.) while covered by third layer tiles and not in player range.
	SynchronizeThirdLayers: true,						//Whether to synchronize the third layer transparency for third layer and unlimited layers. Setting this to false will always render third layer from unlimited layers opaque.
	RenderCutOutOnKeyPress:true,						//Toggle rendering of the transparent cutout of the third layer when pressing the A key. true = enabled
	SeeThroughSwitchID: 38,								//ID of the global switch to enable/disable see-through window for unlimited layer tiles (third layer) with units under them (-1 disables this feature altogether).
	SeeThroughSwitchID2: 40,							//ID of the global switch to enable/disable see-through window for third layer tiles. Can be same ID as the one from unlimited layers or different.
														//Setting both see-through IDs to the same value will synchronize the see-through feature for normal and additional third layer tiles (One switch for both).
	ThirdLayerAlpha: 95									//Opacity of the third layer. 0 = invisible, 255 = opaque. Changing this only makes sense in conjunction with the unlimited layers plugin. -1 disables this.
														//The tile beneath the third layer tile is overwritten by it. So if you want something else beneath it, you have to draw it there with unlimited layers.
														//Alternatively you can draw the third layer tiles in unlimited layers instead, but you lose some features like the prevention of unit's heads being cut off by the layer.
														//Also used for LimitedTLViewDistance setting if enabled.
};

var FotF_FPSCounter = {
	displayFPS: true,									//Whether to display the fps counter
	FPSColor: 0xFFFFFF,									//Color of the FPS counter
	FPSAlpha: 255,										//Opacity of the FPS counter
	FPS_X: 5,											//x value to draw counter to
	FPS_Y: 5											//y value to draw counter to
	
};

/*---------------------------------------------------------------------------
								Code
----------------------------------------------------------------------------*/

var FotF_PlayerIndexArray = null;						//No touchy!
var FotF_SavedRangeArray = null;						//No touchy!

(function () {
	
	var FotF_PrepareMapLayer = MapLayer.prepareMapLayer;
	MapLayer.prepareMapLayer = function () {
		FotF_SavedRangeArray = null;
		FotF_PrepareMapLayer.call(this);
	}

	var FotF_UnitLayerRenderer = MapLayer.drawUnitLayer;
	MapLayer.drawUnitLayer = function () {
		if (FotF_LayerRendererConstants.EnableUnlimitedLayers !== null) {
			if (FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
				FotF_DrawAdditionalMapLayer();
				FotF_DrawAdditionalAnimeLayer();
			}
		}

			FotF_UnitLayerRenderer.call(this);
		
		if (FotF_LayerRendererConstants.EnableThirdLayer !== null) {
			if (FotF_LayerRendererConstants.EnableThirdLayer === true) {
				FotF_RenderThirdLayerUnitLayer();
			}
		}
		
		if (FotF_LayerRendererConstants.EnableUnlimitedLayers !== null) {
			if (FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
				FotF_DrawAdditionalThirdLayer();
				FotF_DrawAdditionalAnimeLayerThird();
			}
		}
	
		if (FotF_FPSCounter.displayFPS === true) {
			var fps = root.getFPS();
			var text = fps.toString() + ' FPS';
			var color = FotF_FPSCounter.FPSColor;
			var xFPS = FotF_FPSCounter.FPS_X;
			var yFPS = FotF_FPSCounter.FPS_Y;
			var alpha = FotF_FPSCounter.FPSAlpha;
			var font = root.queryTextUI('default_window').getFont();
			
			root.getGraphicsManager().drawText(xFPS, yFPS, text, -1, color, alpha, font);
		}	
	};
	
	var FotF_ScrollUnitRenderer = UnitRenderer.drawScrollUnit;
	UnitRenderer.drawScrollUnit = function (unit, x, y, unitRenderParam) {
	
		if (FotF_LayerRendererConstants.EnableUnlimitedLayers !== null) {
			if (FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
				FotF_DrawAdditionalScrollLayer();
			}
		}
		
		var session = null;
		
		FotF_ScrollUnitRenderer.call(this, unit, x, y, unitRenderParam);
		
		var index = MapLayer._counter.getAnimationIndex();
		var index2 = MapLayer._counter.getAnimationIndex2();
		session = root.getCurrentSession();
		
		if (session !== null) {
			session.drawUnitSet(true, true, true, index, index2);
		}
		
		if (FotF_LayerRendererConstants.EnableThirdLayer !== null) {
			if (FotF_LayerRendererConstants.EnableThirdLayer === true) {
				FotF_RenderThirdLayerUnitLayer();
				FotF_RenderThirdLayerScrollUnit(unit, x, y, unitRenderParam);
			}
		}
	
		if (FotF_LayerRendererConstants.EnableUnlimitedLayers !== null) {
			if (FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
				FotF_DrawAdditionalThirdLayer();
				//FotF_DrawAdditionalThirdScrollLayer();
			}
		}
		
		if (FotF_FPSCounter.displayFPS === true) {
			var fps = root.getFPS();
			var text = fps.toString() + ' FPS';
			var color = FotF_FPSCounter.FPSColor;
			var xFPS = FotF_FPSCounter.FPS_X;
			var yFPS = FotF_FPSCounter.FPS_Y;
			var alpha = FotF_FPSCounter.FPSAlpha;
			var font = root.queryTextUI('default_window').getFont();
			
			root.getGraphicsManager().drawText(xFPS, yFPS, text, -1, color, alpha, font);
		}
	};
	
	//Blocks the rendering of non-cutout caches when showing player unit ranges
	var FotF_SwitchMarkingPanelMode = UnitRangePanel.drawRangePanel;
	UnitRangePanel.drawRangePanel = function () {

		if (!this._isRangeDrawable()) {
			FotF_LayerRendererConstants.blockThirdLayerCache = false;
			FotF_LayerRendererConstants.blockThirdLayerCacheUL = false;
			return;
		}
		
		if (FotF_LayerRendererConstants.EnableThirdLayer === true && FotF_LayerRendererConstants.cutOutSwitch === false) {
			if (FotF_LayerRendererConstants.SeeThroughSwitchID2 > -1) {
				
				var switchTable = root.getMetaSession().getGlobalSwitchTable();
				var switchIndex = switchTable.getSwitchIndexFromId(FotF_LayerRendererConstants.SeeThroughSwitchID2);
				
				if (cutOutCache === null && switchTable.isSwitchOn(switchIndex) === true) {
					if (FotF_LayerRendererConstants.AlwaysRenderWithTransparency === true || FotF_LayerRendererConstants.LimitedTLViewDistance === true) {
						FotF_CreateCutOutCache();
					}
				}
				
				if (cutOutCache !== null && switchTable.isSwitchOn(switchIndex) === true) {
					if (FotF_LayerRendererConstants.AlwaysRenderWithTransparency === true || FotF_LayerRendererConstants.LimitedTLViewDistance === true) {

						FotF_LayerRendererConstants.blockThirdLayerCache = true;
					}
				}
			}
		}
		
		
		if (FotF_LayerRendererConstants.EnableUnlimitedLayers === true && FotF_LayerRendererConstants.cutOutSwitch === false) {
			if (FotF_LayerRendererConstants.SeeThroughSwitchID > -1) {
				
				var switchTable = root.getMetaSession().getGlobalSwitchTable();
				var switchIndex = switchTable.getSwitchIndexFromId(FotF_LayerRendererConstants.SeeThroughSwitchID);
				
				if (additionalCutOutCache === null && switchTable.isSwitchOn(switchIndex) === true) {
					if ((FotF_LayerRendererConstants.AlwaysRenderWithTransparency === true || FotF_LayerRendererConstants.LimitedTLViewDistance === true) && FotF_LayerRendererConstants.SynchronizeThirdLayers === true) {
						FotF_CreateAdditionalCutOutCache();
					}
				}
				
				if (additionalCutOutCache !== null && switchTable.isSwitchOn(switchIndex) === true) {
					if ((FotF_LayerRendererConstants.AlwaysRenderWithTransparency === true || FotF_LayerRendererConstants.LimitedTLViewDistance === true) && FotF_LayerRendererConstants.SynchronizeThirdLayers === true) {

						FotF_LayerRendererConstants.blockThirdLayerCacheUL = true;
					}
				}
			}
		}
		
		FotF_SwitchMarkingPanelMode.call(this);
	};
	
	var FotF_InitializeLayerRenderer = MapLayer.prepareMapLayer;
	MapLayer.prepareMapLayer = function () {
		
		FotF_LayerRendererConstants.cutOutSwitch = false;
		
		FotF_InitializeLayerRenderer.call(this);
		
	};
	
	MapEdit._moveCursorMove = function() {
		
		var unit = this._mapCursor.getUnitFromCursor();
		var result = MapEditResult.NONE;
		
		if (InputControl.isSelectAction()) {
			result = this._selectAction(unit);
		}
		else if (InputControl.isCancelAction()) {
			result = this._cancelAction(unit);
		}
		else if (InputControl.isOptionAction()) {
			result = this._optionAction(unit);
		}
		else if (InputControl.isOptionAction2()) {
			if (FotF_LayerRendererConstants.cutOutSwitch === null || FotF_LayerRendererConstants.cutOutSwitch === false) {
				FotF_LayerRendererConstants.cutOutSwitch = true;
				//root.log('cutout switch on');
			} else {
				FotF_LayerRendererConstants.cutOutSwitch = false;
				//root.log('cutout switch off');
			}
		}
		else if (InputControl.isLeftPadAction()) {
			this._changeTarget(false);
		}
		else if (InputControl.isRightPadAction()) {
			this._changeTarget(true);
		}
		else {
			this._mapCursor.moveCursor();
			this._mapPartsCollection.moveMapPartsCollection();
			
			unit = this.getEditTarget();
			
			// Update if the unit is changed.
			if (unit !== this._prevUnit) {
				this._setUnit(unit);
			}
		}
		
		return result;
	};
	
	
	var FotF_CheckPlayerRanges = MapLayer.drawMapLayer;
	MapLayer.drawMapLayer = function () {
		
		var i;
		var session = root.getCurrentSession();
		var isCacheClear = false;
		if (session !== null) {
			var playerList = session.getPlayerList();
			var playerCount = playerList.getCount();
		
			if (FotF_SavedRangeArray === null || FotF_SavedRangeArray.length !== playerCount) {
				FotF_SavedRangeArray = [];
				
				for (i = 0; i < playerCount; i++) {
					
					var unit = playerList.getData(i);
					var mov = RealBonus.getMov(unit);
					var weapon = ItemControl.getEquippedWeapon(unit);
					
					if (weapon !== null) {
						var range = mov + weapon.getEndRange();
					} else {
						var range = mov;
					}
					FotF_SavedRangeArray.push([unit, range]);
					//root.log(unit.getName() + ' added to range save array');
				}
				//root.log('saved ranges');
			}
		
			if (FotF_SavedRangeArray !== null && FotF_LayerRendererConstants.LayerCounter2 === true) {
				var arr = FotF_SavedRangeArray;
				
				for (i = 0; i < FotF_SavedRangeArray.length; i++) {
					
					var unit = FotF_SavedRangeArray[i][0];
					
					if (unit.getUnitGroup() === UnitGroup.PLAYER) {
						var oldRange = FotF_SavedRangeArray[i][1];
						var mov = RealBonus.getMov(unit);
						var weapon = ItemControl.getEquippedWeapon(unit);
						
						if (weapon !== null) {
							var newRange = mov + weapon.getEndRange();
						} else {
							var newRange = mov;
						}
						
						if (oldRange === newRange) {
							continue;
							
						} else {
							FotF_SavedRangeArray[i].splice(1, 1, newRange);
							//root.log('modified array for unit: ' + unit.getName());
							isCacheClear = true;
							continue;
						}
						//root.log('Saved range array length is ' + FotF_SavedRangeArray.length);
					}
				}
				//root.log('unit ranges checked in ' + root.getElapsedTime() + 'ms');
			}
		
			if (isCacheClear === true) {
				if (FotF_LayerRendererConstants.EnableThirdLayer === true) {
					if (cutOutCache !== null) {
						cutOutCache = null;
					}
				
					if (thirdLayerCutArray !== null) {
						thirdLayerCutArray = null;
					}
					
					if (thirdLayerCutArray === null) {
						FotF_FilterThirdLayerIndexArray();
					}
				}
				
				if (FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
					additionalCutOutCache = null;
				}
				root.log('cutoutcache cleared');
			}
		}
		FotF_LayerRendererConstants.LayerCounter2 = false;
		FotF_CheckPlayerRanges.call(this);
	};
	
/*	
	var FotF_ResetCutOutCache1 = ScriptCall_AppearEventUnit;
	ScriptCall_AppearEventUnit = function (unit) {
		root.log('>>>>>>>>>>> reset case 1 <<<<<<<<<<<');
		
		FotF_ResetCutOutCache1.call(this, unit);
	};
*/
/*
	FotF_ResetCutOutCache2 = ScriptCall_GetWeapon;
	ScriptCall_GetWeapon = function (unit) {
		root.log('>>>>>>>>>>> reset case 2 <<<<<<<<<<<');
		
		if (FotF_LayerRendererConstants.EnableThirdLayer === true) {
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
		
		if (FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
			additionalCutOutCache = null;
		}
		
		FotF_ResetCutOutCache2.call(this, unit);
	};
*/
	
	//Updates the cutout caches when units are moved by an event
	var FotF_ResetCutOutCache4 = ScriptCall_GetUnitMoveCource;
	ScriptCall_GetUnitMoveCource = function (unit, xGoal, yGoal, isTerrainDisabled, simulator) {
		
		if (FotF_LayerRendererConstants.EnableThirdLayer === true || FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
			
			var oldX = unit.getMapX();
			var oldY = unit.getMapY();
			
			unit.setMapX(xGoal);
			unit.setMapY(yGoal);
		
			if (FotF_LayerRendererConstants.EnableThirdLayer === true) {
				
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
			
			if (FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
				additionalCutOutCache = null;
				FotF_CreateAdditionalCutOutCache();
			}
			
			unit.setMapX(oldX);
			unit.setMapY(oldY);
		}
		
		return FotF_ResetCutOutCache4(unit, xGoal, yGoal, isTerrainDisabled);
	};

})();

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

FotF_CreatePlayerIndexArray = function() {
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
	var graphicsManager = root.getGraphicsManager();
	
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
	
	return mergeArray;
};