/*--------------------------------------------------------------------------
  This plugin is a dependency for some of my other plugins like FotF_ThirdLayer.js (v3 and up)
  or FotF_UnlimitedLayers.js (v2 and up). It also removes the need for my map color unjumbler
  (FotF_MapColorUnjumbler.js).
  
  The logic behind this plugin is to coordinate other plugins which render things using
  the functions MapLayer.drawUnitLayer and UnitRenderer.drawScrollUnit
  This file on its own does absolutely nothing.
  
  If you have any questions about this plugin, feel free to reach out to me
  over the SRPG Studio University Discord server @francisofthefilth
  
  Original Plugin Author:
  Francis of the Filth
  
  2023/01/07 Released
  
  
--------------------------------------------------------------------------*/

var FotF_EnableThirdLayer = null;
var FotF_EnableUnlimitedLayers = null;

(function () {
	
	var FotF_UnitLayerRenderer = MapLayer.drawUnitLayer;
	MapLayer.drawUnitLayer = function () {
		if (FotF_EnableUnlimitedLayers !== null) {
			if (FotF_EnableUnlimitedLayers === true) {
				FotF_DrawAdditionalMapLayer();
			}
		}

		FotF_UnitLayerRenderer.call(this);
		
		if (FotF_EnableThirdLayer !== null) {
			if (FotF_EnableThirdLayer === true) {
				FotF_RenderThirdLayerUnitLayer();
			}
		}
		
		if (FotF_EnableUnlimitedLayers !== null) {
			if (FotF_EnableUnlimitedLayers === true) {
				FotF_DrawAdditionalThirdLayer();
			}
		}
	};
	
	var FotF_ScrollUnitRenderer = UnitRenderer.drawScrollUnit;
	UnitRenderer.drawScrollUnit = function (unit, x, y, unitRenderParam) {
	
		if (FotF_EnableUnlimitedLayers !== null) {
			if (FotF_EnableUnlimitedLayers === true) {
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
		
		if (FotF_EnableThirdLayer !== null) {
			if (FotF_EnableThirdLayer === true) {
				FotF_RenderThirdLayerScrollUnit(unit, x, y, unitRenderParam);
			}
		}
		
		if (FotF_EnableUnlimitedLayers !== null) {
			if (FotF_EnableUnlimitedLayers === true) {
				FotF_DrawAdditionalThirdScrollLayer();
			}
		}
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