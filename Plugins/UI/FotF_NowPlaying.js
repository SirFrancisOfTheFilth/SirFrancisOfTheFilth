/*--------------------------------------------------------------------------
This plugin displays the name of the currently playing BGM in a scrolling
format when the unit menu is open. It's almost plug-and-play. The only things
you need to do are:

1.	Choose or create a font under Database > Config > Fonts and set
	FotF_MusicWindowFontId in the settings section of this file to it's ID.
	
2.	Play with the other settings until you are satisfied with the position
	of the window and text.
_____________________________________________________________________________
If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth
  
2024/08/14
Released
--------------------------------------------------------------------------*/

//////////////////////// SETTINGS ////////////////////////
var FotF_MusicWindowTextString = 'Now Playing - ';								//Text to be displayed before the BGM's name
var FotF_MusicWindowFontId = 10;												//ID of the font used to draw the text
var FotF_MusicWindowTextColor = 0x20E679;										//Text color, hexadecimal value
var FotF_MusicWindowTextAlpha = 230;											//Text transparency, 0-255 where 255 is fully opaque
var FotF_MusicWindowPosX = 900;													//x starting position (top left corner) of music window
var FotF_MusicWindowPosY = 6;													//y starting position (top left corner) of music window
var FotF_MusicWindowWidth = 360;												//Width of music window
var FotF_MusicWindowHeight = 50;												//Height of music window
var FotF_MusicWindowPaddingX = 8;												//x Spacing between window borders and text
var FotF_MusicWindowPaddingY = 10;												//y Spacing between window borders and text
var FotF_MusicWindowTextSpacing = 110;											//Minimum Spacing between two text blocks
var FotF_MusicTextScrollSpeed = 2;												//Speed at which text moves
//////////////////////////////////////////////////////////


var FotF_MusicWindowTextCache = null;
var FotF_SavedMusicHandle = null;

(function () {
	
	var FotF_AppendMusicWindow = UnitMenuScreen._prepareScreenMemberData;
	UnitMenuScreen._prepareScreenMemberData = function(screenParam) {
		this._musicWindow = createObject(MusicWindow);
		FotF_AppendMusicWindow.call(this, screenParam);
	};
	
	var FotF_ConfigureMusicWindow = UnitMenuScreen._setMenuData;
	UnitMenuScreen._setMenuData = function() {
		this._musicWindow.setData();
		FotF_ConfigureMusicWindow.call(this);
	};
	
	var FotF_MoveMusicWindow = UnitMenuScreen._moveAnimation;
	UnitMenuScreen._moveAnimation = function() {
		this._musicWindow.moveWindowContent();
		FotF_MoveMusicWindow.call(this);
	};
	
	var FotF_DrawUnitMenuScreenCycle2 = UnitMenuScreen.drawScreenCycle;
	UnitMenuScreen.drawScreenCycle = function() {
		FotF_DrawUnitMenuScreenCycle2.call(this);
		
		var x = FotF_MusicWindowPosX;
		var y = FotF_MusicWindowPosY;
		this._musicWindow.drawWindow(x, y);
	};
	
})();

var MusicWindow = defineObject(BaseWindow,
{
	_widthDiff: null,
	_spacing: null,
	
	setData: function() {
		this._spacing = FotF_MusicWindowTextSpacing;
		if ((this.getTextLength() + FotF_MusicWindowTextSpacing) < (FotF_MusicWindowWidth)) {
			var diff = (FotF_MusicWindowWidth) - (this.getTextLength() + FotF_MusicWindowTextSpacing);
			this._spacing = FotF_MusicWindowTextSpacing + diff;
			root.log('widened spacing');
		}
		this._widthDiff = this.getTextLength() + this._spacing - FotF_MusicTextScrollSpeed;
	},
	
	createTextCache: function() {
		var length = this.getTextLength() + this._spacing;
		var manager = root.getGraphicsManager();
		FotF_MusicWindowTextCache = manager.createCacheGraphics(length, FotF_MusicWindowHeight);
		manager.setRenderCache(FotF_MusicWindowTextCache);
		var font = this.getFont();
		root.getGraphicsManager().drawText(0, 0, this.getTextString(), -1, FotF_MusicWindowTextColor, FotF_MusicWindowTextAlpha, font);
		manager.resetRenderCache();
		FotF_SavedMusicHandle = this.getMusicHandle();
	},
	
	resetTextCache: function() {
		FotF_MusicWindowTextCache = null;
		this.setData();
	},
	
	checkAltKeyMode: function() {
		if (InputControl.isOptionAction2()) {
			return true;
		}
		
		return false;
	},

	moveWindowContent: function() {
		if (this._widthDiff <= 0) {
			this._widthDiff = this.getTextLength() + this._spacing - FotF_MusicTextScrollSpeed;
		} else {
			this._widthDiff -= FotF_MusicTextScrollSpeed;
		}
		return MoveResult.CONTINUE;
	},
	
	drawWindowContent: function(x, y) {
		this._drawTextCache(x, y);
	},
	
	getWindowWidth: function() {
		return FotF_MusicWindowWidth;
	},
	
	getWindowHeight: function() {
		return FotF_MusicWindowHeight;
	},
	
	getWindowXPadding: function() {
		return FotF_MusicWindowPaddingX;
	},
	
	getWindowYPadding: function() {
		return FotF_MusicWindowPaddingY;
	},
	
	getFont: function() {
		return root.getBaseData().getFontList().getDataFromId(FotF_MusicWindowFontId);
	},
	
	getWindowUI: function() {
		return root.queryTextUI('face_window').getUIImage();
	},
	
	isTracingHelp: function() {
		return false;
	},
	
	getHelpText: function() {
		return this.isTracingHelp();
	},
	
	getMusicHandle: function() {
		return root.getMediaManager().getActiveMusicHandle();
	},
	
	getTextString: function() {
		var musicId = this.getMusicHandle().getResourceId();
		var isRuntime = this.getMusicHandle().getHandleType();
		var name = root.getBaseData().getMediaResourceList(MediaType.MUSIC, isRuntime).getDataFromId(musicId).getName();
		var string = FotF_MusicWindowTextString + name;
		return string;
	},
	
	getTextLength: function() {
		var font = this.getFont();
		var length = TextRenderer.getTextWidth(this.getTextString(), font);
		return length;
	},

	_drawTextCache: function(xBase, yBase) {
		if (FotF_SavedMusicHandle === null || !this.getMusicHandle().isEqualHandle(FotF_SavedMusicHandle)) {
			this.resetTextCache();
		}
		if (FotF_MusicWindowTextCache === null) {
			this.createTextCache();
		}		
		var xDest1 = this._widthDiff + FotF_MusicWindowPosX + FotF_MusicWindowPaddingX;
		var xDest2 = FotF_MusicWindowPosX + FotF_MusicWindowPaddingX;
		var yDest = FotF_MusicWindowPosY + FotF_MusicWindowPaddingY;
		
		var xSrc1 = 0
		var xSrc2 = this.getTextLength() + this._spacing - this._widthDiff;
		var ySrc = 0;
		
		var width1 = FotF_MusicWindowWidth - this._widthDiff - (2 * FotF_MusicWindowPaddingX);
		var width2 = this._widthDiff;
		if (width1 > (this.getTextLength() + this._spacing)) {
			width1 = this.getTextLength() + this._spacing;
		}
		if (width2 > (FotF_MusicWindowWidth - (2 * FotF_MusicWindowPaddingX))) {
			width2 = FotF_MusicWindowWidth - (2 * FotF_MusicWindowPaddingX);
		}
		var height = FotF_MusicWindowHeight;
		
		FotF_MusicWindowTextCache.drawParts(xDest1, yDest, xSrc1, ySrc, width1, height);
		FotF_MusicWindowTextCache.drawParts(xDest2, yDest, xSrc2, ySrc, width2, height);
	}
});