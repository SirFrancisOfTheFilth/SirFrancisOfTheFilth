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
  
  Also, you need to place the FotF_UnlimitedLayers folder into the Material folder of
  your project. It contains essential files and the game will not start if they're missing!
  
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

  2024/04/10
	Release of the sample project. Check it out for an interactive tutorial.
	
	Added a sound when toggling third layer transparency.
	
	Minor wording changes and corrections.
	
  2024/05/05
	Units with aboveThird will now be rendered above all tiles, including Unlimited Layers
	
	Adjusted FotF_MapColorUnjumbler, as the bug with map colors has been fixed
	
  2024/10/20
    Fixed units with aboveThird not rendering above Layers when other units
	were moving
	
	Fixed units being rendered above unlimited third layer tiles if below (y-1)
	third layer tiles
	
	Fixed passive battlers in easy battle being drawn under unlimited layer tiles
	
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
	EnableBoobieTraps:null,								//No touchy!
	DisableRangePanels: null,							//No touchy!
	blockThirdLayerCache: null,							//No touchy!
	blockThirdLayerCacheUL: null,						//No touchy!
	unlimitedLayersIndexArray: null,					//No touchy!
	ULCutOutIndexArray: null,							//No touchy!
	cutOutSwitch: null,									//No touchy!
	invisibleUnitArray: null,							//No touchy!
	easyBattler1: null,									//No touchy!
	easyBattler2: null,									//No touchy!
	LayerCounter1: null,								//No touchy!	Synchronized with Unit Counter (every 14 frames)
	LayerCounter2: null,								//No touchy!	Synchronized with Unit Counter 2 (every 34 frames)
	LimitedTLViewDistance: true,						//Whether third layer tiles in movement/attack range of player units are rendered semi-transparent while player unit range is shown.
	AlwaysRenderWithTransparency: false,				//Whether to render all third layer tiles transparent when player unit range is shown.
	HideUnitsOutOfRange: true,							//Whether to hide enemies/allies (not display their unit menu etc.) while covered by third layer tiles and not in player range.
	SynchronizeThirdLayers: true,						//Whether to synchronize the third layer transparency for third layer and unlimited layers. Setting this to false will always render third layer from unlimited layers opaque.
	RenderCutOutOnKeyPress:true,						//Toggle rendering of the transparent cutout of the third layer when pressing the OPTION2 key. true = enabled
	SeeThroughSwitchID: 0,								//ID of the global switch to enable/disable transparency for unlimited layer tiles (third layer) with units under them (-1 disables this feature altogether).
	SeeThroughSwitchID2: 3,								//ID of the global switch to enable/disable transparency for third layer tiles. Can be same ID as the one from unlimited layers or different.
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
		FotF_LayerRendererConstants.invisibleUnitArray = [];
		//blockAfterImage3 = false;
		FotF_PrepareMapLayer.call(this);
	}
/*	
	var FotF_UnlimitedLayerRenderer = MapLayer.drawMapLayer;
	MapLayer.drawMapLayer = function() {
		FotF_UnlimitedLayerRenderer.call(this);
		
		var session = root.getCurrentSession();
		if (session !== null && FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
			//FotF_DrawAdditionalMapLayer();
			//FotF_DrawAdditionalAnimeLayer();
		}
	};
*/
	var FotF_UnitLayerRenderer = MapLayer.drawUnitLayer;
	MapLayer.drawUnitLayer = function () {
		if (FotF_LayerRendererConstants.EnableUnlimitedLayers !== null) {
			if (FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
				FotF_DrawAdditionalMapLayer();
				FotF_DrawAdditionalAnimeLayer();
			}
		}
		
		if (FotF_LayerRendererConstants.EnableBoobieTraps !== null) {
			if (FotF_LayerRendererConstants.EnableBoobieTraps === true) {
				this._trapCacheIndex = FotF_DrawBoobieTrapImage(this._trapCacheIndex);
			}
		}

		FotF_UnitLayerRenderer.call(this);
		
		if (FotF_LayerRendererConstants.EnableThirdLayer !== null) {
			if (FotF_LayerRendererConstants.EnableThirdLayer === true) {
				FotF_RenderThirdLayerUnitLayer();
			}
		}
		
		if (FotF_LayerRendererConstants.EnableThirdLayer === true && FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
			FotF_UnitOverlayRenderer();
		}
		
		if (FotF_LayerRendererConstants.EnableUnlimitedLayers !== null) {
			if (FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
				FotF_DrawAdditionalThirdLayer();
				FotF_DrawAdditionalAnimeLayerThird();
			}
		}
/*		
		//Moved this before the if statement containing DrawAdditionalThirdLayer
		if (FotF_LayerRendererConstants.EnableThirdLayer === true && FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
			FotF_UnitOverlayRenderer();
		}
*/	
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
		
		if (FotF_LayerRendererConstants.EnableThirdLayer === true && FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
			var i, j;
			var listArray = [];
			var session = root.getCurrentSession();
			var dx = 0;
			var dy = 0;

			listArray.push(PlayerList.getSortieDefaultList());
			listArray.push(EnemyList.getAliveDefaultList());
			listArray.push(AllyList.getAliveDefaultList());

			var finalList = StructureBuilder.buildDataList();
			finalList.setDataArray(listArray);
			
			for (var i = 0; i < finalList.getCount(); i++) {
				var factionList = finalList.getData(i);

				for (j = 0; j < factionList.getCount(); j++) {
					var aboveUnit = factionList.getData(j);
					
					if (typeof aboveUnit.custom !== 'undefined' && aboveUnit.custom.aboveThird) {
						var aboveUnitX = aboveUnit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH;
						var aboveUnitY = aboveUnit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT;
						
						var aboveRenderParam = StructureBuilder.buildUnitRenderParam();
						var animIndex = MapLayer.getAnimationIndexFromUnit(aboveUnit);
						aboveRenderParam.animationIndex = animIndex;
						
						this._setDefaultParam(aboveUnit, aboveRenderParam);
						
						dxAbove = session.getScrollPixelX();
						dyAbove = session.getScrollPixelY();

						UnitRenderer._drawCustomCharChip(aboveUnit, aboveUnitX - dxAbove, aboveUnitY - dyAbove, aboveRenderParam);
						//FotF_ScrollUnitOverlayRenderer(aboveUnit, x - dx, y - dy, unitRenderParam);
					}
				}
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
	
	//Override to not draw unlimited layers over passive battler
	EasyBattle._drawArea = function() {
		var battler;
		
		this._drawColor(EffectRangeType.MAP);
		
		battler = this.getActiveBattler();
		if (battler === this._battlerRight) {
			this._drawUnit(this._battlerLeft);
			this._drawColor(EffectRangeType.MAPANDCHAR);
			this._drawUnit2(this._battlerRight);
		}
		else {
			this._drawUnit(this._battlerRight);
			this._drawColor(EffectRangeType.MAPANDCHAR);
			this._drawUnit2(this._battlerLeft);
		}
		
		this._drawColor(EffectRangeType.ALL);
		
		this._drawEffect();
	};
	
	EasyBattle._drawUnit2 = function(battler) {
		if (this._isUnitDraw) {
			battler.drawMapUnit2();
		}
	};
	
	EasyMapUnit.drawMapUnit2 = function() {
		var unit = this._unit;
		var unitRenderParam = StructureBuilder.buildUnitRenderParam();
		
		unitRenderParam.animationIndex = this._unitCounter.getAnimationIndexFromUnit(unit);
		unitRenderParam.direction = this._direction;
		unitRenderParam.alpha = this._alpha;
		unitRenderParam.isScroll = this._isScroll();
		
		UnitRenderer.drawScrollUnit2(unit, this._xPixel, this._yPixel, unitRenderParam);
	};
	
	UnitRenderer.drawScrollUnit2 = function(unit, x, y, unitRenderParam) {
		var session = root.getCurrentSession();
		var dx = 0;
		var dy = 0;
		
		if (unitRenderParam === null) {
			unitRenderParam = StructureBuilder.buildUnitRenderParam();
		}
		
		this._setDefaultParam(unit, unitRenderParam);
		
		if (unitRenderParam.isScroll) {
			dx = session.getScrollPixelX();
			dy = session.getScrollPixelY();
		}
		
		this._drawCustomCharChip(unit, x - dx, y - dy, unitRenderParam);
	};

	//Sets units to invisible during easy battle (as intended)
	var FotF_BlockAfterImage3_3 = EasyBattle._enableDefaultCharChip;
	EasyBattle._enableDefaultCharChip = function(isDraw) {
		if (isDraw) {
			root.log('isDraw');
			FotF_LayerRendererConstants.easyBattler1 = this._battlerLeft;
			FotF_LayerRendererConstants.easyBattler2 = this._battlerRight;
		} else {
			root.log('noDraw');
			FotF_LayerRendererConstants.easyBattler1 = null;
			FotF_LayerRendererConstants.easyBattler2 = null;
		}
		FotF_BlockAfterImage3_3.call(this, isDraw);
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
	
	//Switches the third layer transparency on and off using the OPTION2 button (default V)
	var FotF_ToggleThirdLayerTransparency = MapEdit._moveCursorMove;
	MapEdit._moveCursorMove = function() {
		
		var result = FotF_ToggleThirdLayerTransparency.call(this);
		
		if (FotF_LayerRendererConstants.RenderCutOutOnKeyPress === true) {
			if (InputControl.isOptionAction2()) {
				if (FotF_LayerRendererConstants.cutOutSwitch === null || FotF_LayerRendererConstants.cutOutSwitch === false) {
					FotF_LayerRendererConstants.cutOutSwitch = true;
					root.log('cutout switch on');
				} else {
					FotF_LayerRendererConstants.cutOutSwitch = false;
					root.log('cutout switch off');
				}
				MediaControl.soundDirect('commandselect');
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


//Apparently when units appear on the map, their coordinates will be 0/0 UNTIL THEY FUCKING MOVE!
//This means the unit range index array will also take these coordinates instead of the actual ones...
//My disappointment is immeasureable and my day is ruined!
/*	
	var FotF_ResetCutOutCache1 = ScriptCall_AppearEventUnit;
	ScriptCall_AppearEventUnit = function (unit) {
		
		//var session = root.getCurrentSession();
		var width = CurrentMap.getWidth();
		var height = CurrentMap.getHeight();
		
		root.log('unitX: ' + unit.getMapX());
		root.log('unitY: ' + unit.getMapY());
		
		if (width > 0 && height > 0) {
			if (FotF_LayerRendererConstants.EnableThirdLayer === true) {	
				if (cutOutCache !== null) {
					cutOutCache = null;
					root.log('cutOutCache reset');
				}
			
				if (thirdLayerCutArray !== null) {
					thirdLayerCutArray = null;
				}
				
				if (thirdLayerCutArray === null) {
					root.log('RERERERE');
					FotF_FilterThirdLayerIndexArray();
					root.log('filtered third layer array');
				}
			}
			
			if (FotF_LayerRendererConstants.EnableUnlimitedLayers === true) {
				additionalCutOutCache = null;
				FotF_CreateAdditionalCutOutCache();
			}
		}
		root.log('>>>>>>>>>>> reset case 1 <<<<<<<<<<<');
		
		FotF_ResetCutOutCache1.call(this, unit);
	};
*/
	
	//Updates the cutout caches when units are moved by an event
	var FotF_ResetCutOutCache2 = ScriptCall_GetUnitMoveCource;
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
		
		return FotF_ResetCutOutCache2(unit, xGoal, yGoal, isTerrainDisabled);
	};

})();

var FotF_MapColorUnjumbler = function () {
	
	var mapColorIndex = root.getCurrentSession().getCurrentMapInfo().getMapColorIndex();
	var mapColorData = root.getBaseData().getMapColorList().getData(mapColorIndex);
	var mapColorName = mapColorData.getName();
	var mapColorID = mapColorData.getId();
	var mapColorAlpha = mapColorData.getAlpha();
	var mapColorDec = mapColorData.getColor();
	
	return mapColorDec;
	
	/*
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
	*/
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

var FotF_UnitOverlayRenderer = function() {
	var cutArr = thirdLayerCutArray;
	var listArray = [];
	var easyBattler1 = FotF_LayerRendererConstants.easyBattler1;
	var easyBattler2 = FotF_LayerRendererConstants.easyBattler2;
	var battler1 = null;
	var battler2 = null;
	if (easyBattler1 !== null) {
		battler1 = easyBattler1.getUnit();
		//root.log(battler1.getName());
	}
	if (easyBattler2 !== null) {
		battler2 = easyBattler2.getUnit();
		//root.log(battler2.getName());
	}

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
			var terrainEx = PosChecker.getTerrainFromPosEx(x, y);
			
			if (y > 0) {
				var terrain2 = PosChecker.getTerrainFromPos(x, y - 1);
			} else {
				var terrain2 = null;
			}
			
			if (unit.getUnitType() !== UnitType.PLAYER && !unit.custom.aboveThird) {
				var index = CurrentMap.getIndex(x, y);
				var unitID = unit.getId();
				var invisIndex = FotF_LayerRendererConstants.invisibleUnitArray.indexOf(unitID);
				
				if ((terrain.custom.StealthCL || terrainEx.custom.StealthCL) && !terrain.custom.noHide && !terrainEx.custom.noHide && cutArr.indexOf(index) < 0 && unit.isInvisible() === false && FotF_LayerRendererConstants.HideUnitsOutOfRange === true && invisIndex < 0 && unit !== battler1 && unit !== battler2) {
					hiddenUnitArray.push(unit);
					unit.setInvisible(true);
					root.log(unit.getName() + ' set invisible')
				}
				if ((cutArr.indexOf(index) > - 1 || FotF_LayerRendererConstants.HideUnitsOutOfRange === false || (!terrain.custom.StealthCL && !terrainEx.custom.StealthCL)) && unit.isInvisible() === true && blockAfterImage2 !== unit.getId() && invisIndex < 0 && unit !== battler1 && unit !== battler2) {
					unit.setInvisible(false);
					root.log(unit.getName() + ' set visible')
					hiddenUnitArray.splice(t, 1);
				}
				
			} else if (terrain2 !== null && terrain2.custom.StealthCL && !terrain.custom.StealthCL && blockAfterImage === false && !unit.custom.aboveThird && unit !== battler1 && unit !== battler2) {
				
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
				
			} else if (unit.custom.aboveThird && blockAfterImage2 !== unit.getId() && unit !== battler1 && unit !== battler2) {
				
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
};

var FotF_ScrollUnitOverlayRenderer = function (unit, x, y, unitRenderParam) {
	
	if (unit.custom.aboveThird) {
		root.log(unit.getName());
		UnitRenderer.drawScrollUnit(unit, x, y, unitRenderParam);
	}
};

var FotF_ToggleUnitInvisibility = function(unitID, unitType, toggle) {
	var unitList, unit;
	
	if (unitType === UnitGroup.PLAYER) {
		unitList = root.getCurrentSession().getPlayerList();
		unit = unitList.getDataFromId(unitID);
	} else if(unitType === UnitGroup.GUEST) {
		unitList = root.getCurrentSession().getPlayerList();
		unitID = unitID + 393216
		unit = unitList.getDataFromId(unitID);
	} else if(unitType === UnitGroup.GUESTEVENT) {
		unitList = root.getCurrentSession().getPlayerList();
		unitID = unitID + 458752
		unit = unitList.getDataFromId(unitID);
	} else if (unitType === UnitGroup.ENEMY) {
		unitList = root.getCurrentSession().getEnemyList();
		unitID = unitID + 65536
		unit = unitList.getDataFromId(unitID);
	} else if(unitType === UnitGroup.ENEMYEVENT) {
		unitList = root.getCurrentSession().getEnemyList();
		unitID = unitID + 131072
		unit = unitList.getDataFromId(unitID);
	} else if(unitType === UnitGroup.REINFORCE) {
		unitList = root.getCurrentSession().getEnemyList();
		unitID = unitID + 327680
		unit = unitList.getDataFromId(unitID);
	} else if(unitType === UnitGroup.ALLY) {
		unitList = root.getCurrentSession().getAllyList();
		unitID = unitID + 196608
		unit = unitList.getDataFromId(unitID);
	} else if(unitType === UnitGroup.ALLY) {
		unitList = root.getCurrentSession().getAllyList();
		unitID = unitID + 262144
		unit = unitList.getDataFromId(unitID);
	} else {
		unit = null
	}
	
	if (unit !== null) {
		var index = FotF_LayerRendererConstants.invisibleUnitArray.indexOf(unitID);
		
		if (toggle === true && index < 0) {
			FotF_LayerRendererConstants.invisibleUnitArray.push(unitID);
		} else if (toggle === false && index > -1) {
			FotF_LayerRendererConstants.invisibleUnitArray.splice(index, 1);
		}
			
		root.log(unit.getName());
		unit.setInvisible(toggle);
	}
};