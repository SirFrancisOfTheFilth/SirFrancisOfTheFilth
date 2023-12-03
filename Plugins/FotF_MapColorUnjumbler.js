/*--------------------------------------------------------------------------
This plugin unjumbles the mess SRPG Studio makes out of hexadecimal color codes
used in mapcolors. It is essential for other plugins like my revised version of
Rogue Claris' Third Layer plugin or FotF_UnlimitedLayers to work as they rely on
it to calculate the correct map color.

There are no usage instructions, as this does nothing on itself.
 
Original Plugin Author:
Francis of the Filth
  
Plugin History:
2023/12/03 Released
  
--------------------------------------------------------------------------*/

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
