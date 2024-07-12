/*--------------------------------------------------------------------------
This plugin adds a little window above the unit menu top window, a
unit menu top top window so to say.
The window's purpose is to display the game controls while in the
unit menu in an intuitive way.
This plugin is almost plug and play. You need a folder in your Material folder
(name can be adjusted in this file's settings) containing ALL keys SRPG Studio
can bind to controls. This includes all standard alphabet letters, numbers, F-Keys,
Arrow Keys, Shift, Ctrl, Esc, Enter, Space, Alt and probably a few more I missed.
You also need a second image per key for the pressed variant.
Currently there's no images for the F-Keys, if you want to add some, see below.
_____________________________________________________________________________

The plugin comes with keys already, but if you want your own key images:

The names for the keys need to be in a specific format for this plugin to
recognize them (CASE SENSITIVE!):

Letters: a.png and a_pressed.png
Numbers: 1.png and 1_pressed.png
F-Keys: f1.png and f1_pressed.png
Arrow Keys: up.png and up_pressed.png
Others: shift.png, ctrl.png, esc.png, enter.png, space.png, alt.png (and pressed variants)

You also need a blank key (blank.png and blank_pressed.png) in case something with the
string conversion goes wrong.

The _pressed suffix and the file extension can be changed in the settings

_____________________________________________________________________________

CURRENTLY ONLY THE ABOVE KEYS ARE SUPPORTED TO AVOID CRASHES IF NO IMAGE IS FOUND
If you want other keys added, you can contact me on the SRPG Studio University
Discord server @SirFrancisoftheFilth or if you feel you are up to the task,
you can add the appropriate graphics to the Material folder (have to be named
according to SRPG Studio's naming conventions, see game.ini) and add their names
(without file format) to the allowed keys array in line 83.

Holding the Option2 Key (either Shift or V, I forgor, look in game.ini)
displays the alternative controls.

Currently this doesn't support gamepad controls.


Credit for the button graphics goes to Caz: https://cazwolf.itch.io/caz-pixel-letters

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @francisofthefilth
  
Original Plugin Author:
Francis of the Filth
  
2024/07/12 Released
--------------------------------------------------------------------------*/

(function(){
	
	//////////////////////// SETTINGS ////////////////////////
	var FotF_TopTopWindowWidth = DefineControl.getUnitMenuWindowWidth();		//Width of the top top window, DefineControl.getUnitMenuWindowWidth() makes it the same width as the one below
	var FotF_KeyImageWidth = 32;												//Width of key images in pixels
	var FotF_KeyImageHeight = 32;												//Height of key images in pixels
	var FotF_TopTopWindowPaddingX = 8;											//x spacing between image drawing and window borders
	var FotF_TopTopWindowPaddingY = 8;											//y spacing between image drawing and window borders
	var FotF_TextSpacing = 6;													//x spacing between image and text
	var FotF_KeySpacing = 12;													//x spacing between text and next key image
	var FotF_TextYCorrection = 8;												//Vertical correction for key names (+ = down)
	
	var FotF_SelectKeyText = 'Select';											//Text displayed next to "Select" button
	var FotF_SystemKeyText = 'Cancel';											//Text displayed next to "System" button
	var FotF_NextKeyText = 'Next Unit';											//Text displayed next to "Next" button
	var FotF_PreviousKeyText = 'Previous Unit';									//Text displayed next to "Previous" button
	
	var FotF_TopTopHelpTextNext = 'View next unit';								//Text when hovering over "Next" button
	var FotF_TopTopHelpTextPrevious = 'View previous unit';						//Text when hovering over "Previous" button
	var FotF_TopTopHelpTextSystem = 'Close unit menu';							//Text when hovering over "System" button
	var FotF_TopTopHelpTextSelect = 'Select item';								//Text when hovering over "Select" button
	
	var FotF_MaterialFolder = 'FotF_UnitMenuTopTopWindow';						//Material folder used for key images
	var FotF_KeyImageFormat = '.png';											//Key image format (for example '.png' or '.jpg')
	var FotF_PressedImageSuffix = '_pressed';									//Additional suffix for pressed button sprites, for example 'shift.png' and 'shift_pressed.png'
	//////////////////////////////////////////////////////////
	
	var FotF_AllowedKeyBinds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 
	'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'up', 'down', 'right', 'left', 'shift', 'ctrl', 'esc', 'enter', 'space', 'alt']; //All keys in here are supported right now. It's possible to add more.
	
	UnitMenuScreen._topTopWindow = null;
	
	var FotF_AppendTopTopWindow = UnitMenuScreen._prepareScreenMemberData;
	UnitMenuScreen._prepareScreenMemberData = function(screenParam) {
		this._topTopWindow = createObject(UnitMenuTopTopWindow);
		FotF_AppendTopTopWindow.call(this, screenParam);
	};
	
	var FotF_ConfigureTopTopWindow = UnitMenuScreen._setMenuData;
	UnitMenuScreen._setMenuData = function() {
		this._topTopWindow.setUnitMenuData();
		FotF_ConfigureTopTopWindow.call(this);
	};
	
	var FotF_MoveTopTopWindow = UnitMenuScreen._moveAnimation;
	UnitMenuScreen._moveAnimation = function() {
		this._topTopWindow.moveWindowContent();
		FotF_MoveTopTopWindow.call(this);
	};
	
	var FotF_DrawTopTopBottomText = UnitMenuScreen.drawScreenBottomText;
	UnitMenuScreen.drawScreenBottomText = function(textui) {
		var text;
		var index = this._activePageIndex;
		
		if (this._topTopWindow.isTracingHelp()) {
			text = this._topTopWindow.getHelpText();
			TextRenderer.drawScreenBottomText(text, textui);
		} else {
			FotF_DrawTopTopBottomText.call(this, textui);
		}
	};
	
	var FotF_DrawUnitMenuScreenCycle = UnitMenuScreen.drawScreenCycle;
	UnitMenuScreen.drawScreenCycle = function() {
		FotF_DrawUnitMenuScreenCycle.call(this);
		
		var x, y;
		var index = this._activePageIndex;
		var width = this._topWindow.getWindowWidth();
		var topHeight = this._topWindow.getWindowHeight();
		var bottomHeight = this._bottomWindowArray[index].getWindowHeight();
		var interval = DefineControl.getWindowInterval();
		var dy = this._topTopWindow.getWindowHeight();
		
		if (this._isUnitSentenceVisible()) {
			x = LayoutControl.getCenterX(-1, width + this._unitSentenceWindow.getWindowWidth());
		}
		else {
			x = LayoutControl.getCenterX(-1, width);
		}
		y = LayoutControl.getCenterY(-1, topHeight + bottomHeight + interval);
		y -= dy

		this._topTopWindow.drawWindow(x, y);
	};
	
	
	
	var UnitMenuTopTopWindow = defineObject(BaseWindow,
{
	
	setUnitMenuData: function() {
	},
	
	checkAltKeyMode: function() {
		if (InputControl.isOptionAction2()) {
			return true;
		}
		
		return false;
	},
	
	moveWindowContent: function() {
		return MoveResult.CONTINUE;
	},
	
	drawWindowContent: function(x, y) {
		this._drawButtons(x, y);
	},
	
	getWindowWidth: function() {
		return FotF_TopTopWindowWidth;
	},
	
	getWindowHeight: function() {
		return FotF_KeyImageHeight + (2 * FotF_TopTopWindowPaddingY);
	},
	
	getWindowXPadding: function() {
		return FotF_TopTopWindowPaddingX;
	},
	
	getWindowYPadding: function() {
		return FotF_TopTopWindowPaddingY;
	},
	
	getWindowTextUI: function() {
		return root.queryTextUI('face_window');
	},
	
	getWindowUI: function() {
		return root.queryTextUI('face_window').getUIImage();
	},
	
	isTracingHelp: function() {
		var x, text;
		var xStart = this.xRendering + this.getWindowXPadding();
		var yStart = this.yRendering;
		
		var selectRange = createRangeObject(xStart, yStart, FotF_KeyImageWidth, FotF_KeyImageHeight);
		
		x = xStart + FotF_KeyImageWidth + FotF_KeySpacing + this._getSelectTextLength();
		
		var systemRange = createRangeObject(x, yStart, FotF_KeyImageWidth, FotF_KeyImageHeight);
		
		x = xStart + (2 * FotF_KeyImageWidth) + (2 * FotF_KeySpacing) + this._getSelectTextLength() + this._getSystemTextLength();
		
		var nextRange = createRangeObject(x, yStart, FotF_KeyImageWidth, FotF_KeyImageHeight);
		
		x = xStart + (3 * FotF_KeyImageWidth) + (3 * FotF_KeySpacing) + this._getSelectTextLength() + this._getSystemTextLength() + this._getNextTextLength();
		
		var previousRange = createRangeObject(x, yStart, FotF_KeyImageWidth, FotF_KeyImageHeight);
		
		if (MouseControl.isHovering(selectRange)) {
			text = FotF_SelectKeyText;
		} else if (MouseControl.isHovering(systemRange)) {
			text = FotF_SystemKeyText;
		} else if (MouseControl.isHovering(nextRange)) {
			text = FotF_NextKeyText;
		} else if (MouseControl.isHovering(previousRange)) {
			text = FotF_PreviousKeyText;
		} else {
			text = '';
		}
		
		
		return text;
	},
	
	getHelpText: function() {
		return this.isTracingHelp();
	},
	
	_drawButtons: function(xBase, yBase) {
		var x, text;
		var xStart = this.xRendering + this.getWindowXPadding();
		var yStart = this.yRendering;
		var yText = yStart + FotF_TextYCorrection;
		var font = this.getWindowTextUI().getFont();
		var manager = root.getMaterialManager();
		
		var selectName = this._getSelectKeyBind() + FotF_KeyImageFormat;
		var selectName2 = this._getSelectKeyBind() + FotF_PressedImageSuffix + FotF_KeyImageFormat;
		var selectButton = manager.createImage(FotF_MaterialFolder, selectName);
		var selectButton2 = manager.createImage(FotF_MaterialFolder, selectName2);
		var systemName = this._getSystemKeyBind() + FotF_KeyImageFormat;
		var systemName2 = this._getSystemKeyBind() + FotF_PressedImageSuffix + FotF_KeyImageFormat;
		var systemButton = manager.createImage(FotF_MaterialFolder, systemName);
		var systemButton2 = manager.createImage(FotF_MaterialFolder, systemName2);
		var upName = this._getUpKeyBind() + FotF_KeyImageFormat;
		var upName2 = this._getUpKeyBind() + FotF_PressedImageSuffix + FotF_KeyImageFormat;
		var upButton = manager.createImage(FotF_MaterialFolder, upName);
		var upButton2 = manager.createImage(FotF_MaterialFolder, upName2);
		var downName = this._getDownKeyBind() + FotF_KeyImageFormat;
		var downName2 = this._getDownKeyBind() + FotF_PressedImageSuffix + FotF_KeyImageFormat;
		var downButton = manager.createImage(FotF_MaterialFolder, downName);
		var downButton2 = manager.createImage(FotF_MaterialFolder, downName2);
		
		if (InputControl.isSelectState()) {
			selectButton2.draw(xStart, yStart)
		} else {
			selectButton.draw(xStart, yStart)
		}
		TextRenderer.drawText(xStart + FotF_KeyImageWidth, yText, FotF_SelectKeyText, this._getSelectTextLength(), 0xFFFFFF, font);
		
		x = xStart + FotF_KeyImageWidth + FotF_KeySpacing + this._getSelectTextLength();
		
		if (InputControl.isInputState(InputType.BTN7)) {
			systemButton2.draw(x, yStart)
		} else {
			systemButton.draw(x, yStart)
		}
		TextRenderer.drawText(x + FotF_KeyImageWidth, yText, FotF_SystemKeyText, this._getSystemTextLength(), 0xFFFFFF, font);
		
		x += FotF_KeyImageWidth + FotF_KeySpacing + this._getSystemTextLength();
		
		if (InputControl.isInputState(InputType.UP)) {
			upButton2.draw(x, yStart)
		} else {
			upButton.draw(x, yStart)
		}
		TextRenderer.drawText(x + FotF_KeyImageWidth, yText, FotF_NextKeyText, this._getNextTextLength(), 0xFFFFFF, font);
		
		x += FotF_KeyImageWidth + FotF_KeySpacing + this._getNextTextLength();
		
		if (InputControl.isInputState(InputType.DOWN)) {
			downButton2.draw(x, yStart)
		} else {
			downButton.draw(x, yStart)
		}
		TextRenderer.drawText(x + FotF_KeyImageWidth, yText, FotF_PreviousKeyText, this._getPreviousTextLength(), 0xFFFFFF, font);
	},
	
	_getSelectKeyBind: function() {
		var arr = root.getKeyBinding('SELECT');
		
		if (InputControl.isInputState(InputType.BTN4) && FotF_AllowedKeyBinds.indexOf(arr[1]) > -1) {
			var key = arr[1];
		} else if (FotF_AllowedKeyBinds.indexOf(arr[0]) > -1 && arr[0] !== '') {
			var key = arr[0];
		} else {
			key = 'blank';
		}
		
		return key;
	},
	
	_getSystemKeyBind: function() {
		var arr = root.getKeyBinding('SYSTEM');
		
		if (InputControl.isInputState(InputType.BTN4) && FotF_AllowedKeyBinds.indexOf(arr[1]) > -1) {
			var key = arr[1];
		} else if (FotF_AllowedKeyBinds.indexOf(arr[0]) > -1 && arr[0] !== '') {
			var key = arr[0];
		} else {
			key = 'blank';
		}
		
		return key;
	},
	
	_getUpKeyBind: function() {
		var arr = root.getKeyBinding('UP');
		
		if (InputControl.isInputState(InputType.BTN4) && FotF_AllowedKeyBinds.indexOf(arr[1]) > -1) {
			var key = arr[1];
		} else if (FotF_AllowedKeyBinds.indexOf(arr[0]) > -1 && arr[0] !== '') {
			var key = arr[0];
		}

		return key;
	},
	
	_getDownKeyBind: function() {
		var arr = root.getKeyBinding('DOWN');
		
		if (InputControl.isInputState(InputType.BTN4) && FotF_AllowedKeyBinds.indexOf(arr[1]) > -1) {
			var key = arr[1];
		} else if (FotF_AllowedKeyBinds.indexOf(arr[0]) > -1 && arr[0] !== '') {
			var key = arr[0];
		} else {
			key = 'blank';
		}
		
		return key;
	},
	
	_getSelectTextLength: function() {
		var text = FotF_SelectKeyText;
		var font = this.getWindowTextUI().getFont();
		return TextRenderer.getTextWidth(text, font);
	},
	
	_getSystemTextLength: function() {
		var text = FotF_SystemKeyText;
		var font = this.getWindowTextUI().getFont();
		return TextRenderer.getTextWidth(text, font);
	},
	
	_getNextTextLength: function() {
		var text = FotF_NextKeyText;
		var font = this.getWindowTextUI().getFont();
		return TextRenderer.getTextWidth(text, font);
	},
	
	_getPreviousTextLength: function() {
		var text = FotF_PreviousKeyText;
		var font = this.getWindowTextUI().getFont();
		return TextRenderer.getTextWidth(text, font);
	}
}
);
	
	
	
	
})();