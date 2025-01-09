/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			Add boss health bars to your game with this plugin!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This plugin allows you to add boss health bars to up to 3 units at once
during the map using execute script functions. The health bars auto-update
every frame, so all changes to units are reflected in real time. The window
can be toggled semi-transparent by pressing the Option 2 key. The window
position on the screen can be adjusted. Boss bars are automatically removed
if units die.

You can use your own bar window and bar graphics or use the funky frog one
I made for fun :)

Unit names and HP numbers are drawn to the window automatically with the
option to also draw their portraits and state icons. All drawing coordinates, 
text font, color and transparency, as well as portrait size can be adjusted
to your liking.
_____________________________________________________________________________
						SETTING UP THE MATERIAL
_____________________________________________________________________________

First things first: You need a folder inside your Material folder, the
name of which you can change in the settings. Inside that folder you will
need 2 images, one with up to 3 boss bar windows and one with the health bar.
Make sure you match their names and the names in this file's settings.
It's easier to just look at how it's done with the frog bar, where the tongue
is the health bar. Spacing between windows is done via blank pixels in the
image file. It's important to set the image sizes in the settings, so the
windows and bars can be drawn correctly. The window heights are the height
in pixels (cumulative) of every window. That means if you have 3 windows
with height 87 pixels each and 3 pixels of spacing in between, they would be
87, (87*2)+(3*1), (87*3)+(3*2). This would result in y coordinates 87, 177, 267.

_____________________________________________________________________________
						TWEAKING THE SETTINGS
_____________________________________________________________________________

The window offsets control how far from the middle of the screen the window
will be drawn. All other coordinates are relative to the window's upper left
corner.

To set up fonts, go to Database > Config > Fonts. There you can see which
fonts you already have and their IDs, as well as create new ones.
Setting text to a font ID that doesn't exist will not render the text,
effectively disabling it. THIS CAN BE A REASON YOU THINK YOUR TEXT/NUMBERS
ARE MISSING WHEN THEY AREN'T.

Color values are provided in hexadecimal format like this:
						0xRRGGBB
Where RR is the red, GG the green and BB the blue value.
If you're unsure how hexadecimal colors work, just google "hex color picker"

Alpha values are used to determine the transparency of your text/numbers.
They can have values between 0-255, where 0 is fully transparent (invisible)
and 255 is fully opaque. Setting a text's alpha value to 0 will effectively
erase that text, so if you don't want something to be shown, just set it's
alpha value to 0. ALSO CHECK THIS IF YOUR TEXT IS MISSING.

Here you can also set the direction the bar decreases from, whether to draw
portraits and state icons and more.

_____________________________________________________________________________
						USING THE BARS IN YOUR EVENTS
_____________________________________________________________________________

To start showing a boss health bar, use an Execute Script event command set
to "Execute Code" and write the following function into the prompt box:

	FotF_InitializeBossBar(unitId, unitGroup);
	
Where unitId is the database ID and unitGroup the unit group of the unit
you want to add a boss bar to. unitGroup has to be one of the following:

	UnitGroup.PLAYER
	UnitGroup.ENEMY
	UnitGroup.ENEMYEVENT
	UnitGroup.ALLY
	UnitGroup.ALLYEVENT
	UnitGroup.REINFORCE
	UnitGroup.GUEST
	UnitGroup.GUESTEVENT
	UnitGroup.BOOKMARK
	

To add more boss health bars (up to 3 max), use this function:

	FotF_AddUnitToBossBar(unitId, unitGroup);
	
This can also be used if the bar isn't initialized yet and will initialize
it automatically, so you could also use this instead of the previous one.

Removing a unit works the same way with the function

	FotF_RemoveUnitFromBossBar(unitId, unitGroup);
	
And removing the whole boss bar is possible with

	FotF_RemoveBossBar();
	
Lastly it's possible to set the boss bar visible/invisible without removing
it with these two functions:

	FotF_ShowBossBar();
	
		and
		
	FotF_HideBossBar();

_____________________________________________________________________________
								NICE TO KNOW
_____________________________________________________________________________

Initializing the boss bar will reset it, meaning it'll only show the one unit
specified in the initialization function.

Removing a unit through event command will not remove it's boss bar, because
I have no access to that function :(
You need to do it by hand unfortunately.

This plugin is fully complatible with my Layer System as it uses the same
key to toggle transparency and the Layer Renderer has functions to support
this plugin.

_____________________________________________________________________________
								EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth

  
Original Plugin Author:
Francis of the Filth
  
2024/11/11
Released as an open commission

2024/11/15
Fixed a crash when units move without an active boss bar. Oopsie.

2025/01/10
Fixed a crash where the boss bar object wasn't defined in real battle

--------------------------------------------------------------------------*/

/////////////////////////////////////////////////////////////////////////////
/////							SETTINGS								/////
/////////////////////////////////////////////////////////////////////////////

var FotF_BossBarControl = {
    MaterialFolder: 'FotF_BossHealthBar', //Name of the material folder
    WindowName: 'FrogeBarWindow.png', //Name of the window image for 1 bar, including file extension
    BarName: 'TongueBar.png', //Name of the health bar image, including file extension
    WindowWidth: 604, //Width of the window image file used
    Window1Height: 87, //Height of the window image file for 1 bar
    Window2Height: 177, //Height of the window image file for 2 bars
    Window3Height: 267, //Height of the window image file for 3 bars
    WindowOffsetX: 0, //X-Axis offset (from middle of screen), positive -> right
    WindowOffsetY: -300, //Y-Axis offset (from middle of screen), positive -> down
    BarStartX: 154, //X start coordinate of the bar relative to upper left corner of the window
    BarStartY: 17, //Y start coordinate of the bar relative to upper left corner of the window
    Bar2Y: 107, //Y start of the second bar relative to the upper left corner of the window
    Bar3Y: 197, //Y start of the third bar relative to the upper left corner of the window
    BarWidth: 429, //Width (length) of the health bar image file used
    BarHeight: 10, //Height of the health bar image file used
    IsBarRightToLeft: true, //Whether the health bar decreases from right to left or the other way around
    DrawStates: true, //Whether to draw state icons to the boss bar
    DrawPortraits: true, //Whether to draw unit portraits to the boss bar
    PortraitWidth: 64, //Resizing of the portraits, width
    PortraitHeight: 64, //Resizing of the portraits, height
    WindowAlpha: 255, //Transparency of the window in standard rendering mode (0-255)
    WindowOption2Alpha: 63, //Transparency of the window when Option 2 is pressed (0-255), all other features will be adjusted too, with factor WindowOption2Alpha/WindowAlpha
    UnitNameX1: 154, //X coordinate of the first unit's name
    UnitNameY1: 30, //Y coordinate of the first unit's name
    UnitNameX2: 154, //X coordinate of the second unit's name
    UnitNameY2: 120, //Y coordinate of the second unit's name
    UnitNameX3: 154, //X coordinate of the third unit's name
    UnitNameY3: 210, //Y coordinate of the third unit's name
    HpNumberX1: 154, //X coordinate of the first unit's HP number
    HpNumberY1: 57, //Y coordinate of the first unit's HP number
    HpNumberX2: 154, //X coordinate of the second unit's HP number
    HpNumberY2: 147, //Y coordinate of the second unit's HP number
    HpNumberX3: 154, //X coordinate of the third unit's HP number
    HpNumberY3: 237, //Y coordinate of the third unit's HP number
    UnitNameFontId: 0, //ID of the font used for unit names
    HpNumberFontId: 0, //ID of the font used for HP numbers
    UnitNameColor: 0xffffff, //Color of the unit names, hexadecimal
    HpNumberColor: 0xffffff, //Color of the HP numbers, hexadecimal
    UnitNameAlpha: 255, //Transparency of unit names (0-255)
    HpNumberAlpha: 255, //Transparency of HP numbers (0-255)
    StateIconStartX1: 244, //Start x of the state icon drawing range
    StateIconStartY1: 57, //Start y of the state icon drawing range
    StateIconStartX2: 244, //Start x of the state icon drawing range
    StateIconStartY2: 147, //Start y of the state icon drawing range
    StateIconStartX3: 244, //Start x of the state icon drawing range
    StateIconStartY3: 237, //Start y of the state icon drawing range
    StateIconXSpacing: 4, //X spacing between state icons
    StateIconYSpacing: 4, //Y spacing between state icons
    MaxStateIconsPerRow: 6, //Maximum number of state icon per row
    MaxStateIconRows: 2, //Maximum number of rows for state icons
    PortraitX1: 6, //x coordinate of unit 1 portrait
    PortraitY1: 6, //y coordinate of unit 1 portrait
    PortraitX2: 6, //x coordinate of unit 2 portrait
    PortraitY2: 96, //y coordinate of unit 2 portrait
    PortraitX3: 6, //x coordinate of unit 3 portrait
    PortraitY3: 186 //y coordinate of unit 3 portrait
};

var FotF_BossBarWindow = defineObject(BaseWindow, {
    _isWindowEnabled: true,
    _drawParentData: null,
    _unit1: null,
    _unit2: null,
    _unit3: null,
    _x: null,
    _y: null,
    _alpha: null,
    _gaugeBar1: null,
    _gaugeBar2: null,
    _gaugeBar3: null,
    _isVisible: null,
    _isScroll: null,

    initializeUnit: function (unitId, unitGroup) {
        var realID = unitId + 65536 * unitGroup;

        if (unitGroup === UnitGroup.PLAYER || unitGroup === UnitGroup.GUEST || unitGroup === UnitGroup.GUESTEVENT) {
            this._unit1 = PlayerList.getMainList().getDataFromId(realID);
        } else if (unitGroup === UnitGroup.ENEMY || unitGroup === UnitGroup.ENEMYEVENT || unitGroup === UnitGroup.REINFORCE) {
            this._unit1 = EnemyList.getMainList().getDataFromId(realID);
        } else {
            this._unit1 = AllyList.getMainList().getDataFromId(realID);
        }

        this._x = LayoutControl.getCenterX(-1, this.getWindowWidth()) + FotF_BossBarControl.WindowOffsetX;
        this._y = LayoutControl.getCenterY(-1, this.getWindowHeight()) + FotF_BossBarControl.WindowOffsetY;
        this._isVisible = true;
        this._isScroll = false;
        this._alpha = FotF_BossBarControl.WindowAlpha;

        this._gaugeBar1 = createObject(FotF_BossGauge);
        this._gaugeBar1.setGaugeInfo(this._unit1.getHp(), ParamBonus.getMhp(this._unit1), 1, this._alpha);
    },

    setAdditionalUnit: function (unitId, unitGroup) {
        var index = this.getFreeUnitIndex();
        var realID = unitId + 65536 * unitGroup;

        if (index === 1) {
            if (unitGroup === UnitGroup.PLAYER || unitGroup === UnitGroup.GUEST || unitGroup === UnitGroup.GUESTEVENT) {
                this._unit1 = PlayerList.getMainList().getDataFromId(realID);
            } else if (unitGroup === UnitGroup.ENEMY || unitGroup === UnitGroup.ENEMYEVENT || unitGroup === UnitGroup.REINFORCE) {
                this._unit1 = EnemyList.getMainList().getDataFromId(realID);
            } else {
                this._unit1 = AllyList.getMainList().getDataFromId(realID);
            }
            this._gaugeBar1 = createObject(FotF_BossGauge);
            this._gaugeBar1.setGaugeInfo(this._unit1.getHp(), ParamBonus.getMhp(this._unit1), 1, this._alpha);
        } else if (index === 2) {
            if (unitGroup === UnitGroup.PLAYER || unitGroup === UnitGroup.GUEST || unitGroup === UnitGroup.GUESTEVENT) {
                this._unit2 = PlayerList.getMainList().getDataFromId(realID);
            } else if (unitGroup === UnitGroup.ENEMY || unitGroup === UnitGroup.ENEMYEVENT || unitGroup === UnitGroup.REINFORCE) {
                this._unit2 = EnemyList.getMainList().getDataFromId(realID);
            } else {
                this._unit2 = AllyList.getMainList().getDataFromId(realID);
            }
            this._gaugeBar2 = createObject(FotF_BossGauge);
            this._gaugeBar2.setGaugeInfo(this._unit2.getHp(), ParamBonus.getMhp(this._unit2), 1, this._alpha);
        } else if (index === 3) {
            if (unitGroup === UnitGroup.PLAYER || unitGroup === UnitGroup.GUEST || unitGroup === UnitGroup.GUESTEVENT) {
                this._unit3 = PlayerList.getMainList().getDataFromId(realID);
            } else if (unitGroup === UnitGroup.ENEMY || unitGroup === UnitGroup.ENEMYEVENT || unitGroup === UnitGroup.REINFORCE) {
                this._unit3 = EnemyList.getMainList().getDataFromId(realID);
            } else {
                this._unit3 = AllyList.getMainList().getDataFromId(realID);
            }
            this._gaugeBar3 = createObject(FotF_BossGauge);
            this._gaugeBar3.setGaugeInfo(this._unit3.getHp(), ParamBonus.getMhp(this._unit3), 1, this._alpha);
        }
    },

    removeUnit: function (unit) {
        if (unit === this._unit3) {
            this._unit3 = null;
            this._gaugeBar3 = null;
        } else if (unit === this._unit2) {
            if (this._unit3 !== null) {
                this._unit2 = this._unit3;
                this._gaugeBar2 = this._gaugeBar3;
                this._unit3 = null;
                this._gaugeBar3 = null;
            } else {
                this._unit2 = null;
                this._gaugeBar2 = null;
            }
        } else if (unit === this._unit1) {
            if (this._unit2 !== null) {
                this._unit1 = this._unit2;
                this._gaugeBar1 = this._gaugeBar2;
                if (this._unit3 !== null) {
                    this._unit2 = this._unit3;
                    this._gaugeBar2 = this._gaugeBar3;
                    this._unit3 = null;
                    this._gaugeBar3 = null;
                } else {
                    this._unit2 = null;
                    this._gaugeBar2 = null;
                }
            } else {
                FotF_RemoveBossBar();
            }
        }
    },

    getFreeUnitIndex: function () {
        if (this._unit1 === null) {
            return 1;
        } else if (this._unit2 === null) {
            return 2;
        } else if (this._unit3 === null) {
            return 3;
        } else {
            return null;
        }
    },

    moveWindow: function () {
        return this.moveWindowContent();
    },

    moveWindowContent: function () {
        if (InputControl.isOptionAction2()) {
            var cfg = FotF_BossBarControl;

            if (this._alpha !== cfg.WindowAlpha) {
                this._alpha = cfg.WindowAlpha;
            } else {
                this._alpha = cfg.WindowOption2Alpha;
            }
        }

        if (this._gaugeBar1 !== null) {
            this._gaugeBar1.moveGaugeBar();
        }
        if (this._gaugeBar2 !== null) {
            this._gaugeBar2.moveGaugeBar();
        }
        if (this._gaugeBar3 !== null) {
            this._gaugeBar3.moveGaugeBar();
        }

        return MoveResult.CONTINUE;
    },

    drawWindow: function (x, y) {
        var width = this.getWindowWidth();
        var height = this.getWindowHeight();

        if (!this._isWindowEnabled) {
            return;
        }

        this._drawWindowInternal(x, y, width, height);

        if (this._drawParentData !== null) {
            this._drawParentData(x, y);
        }

        this.xRendering = x + this.getWindowXPadding();
        this.yRendering = y + this.getWindowYPadding();

        this.drawWindowContent(x, y);
    },

    drawWindowContent: function (x, y) {
        var cfg = FotF_BossBarControl;
        this.drawDetails(x, y);

        if (cfg.DrawStates) {
            this.drawStates(x, y);
        }

        if (cfg.DrawPortraits) {
            this.drawPortraits(x, y);
        }
    },

    drawWindowTitle: function (x, y, width, height) {
        var color, font, pic, titleWidth, dx;
        var titleCount = 3;
        var textui = this.getWindowTitleTextUI();
        var text = this.getWindowTitleText();

        if (textui === null || text === '') {
            return;
        }

        color = textui.getColor();
        font = textui.getFont();
        pic = textui.getUIImage();
        titleWidth = TitleRenderer.getTitlePartsWidth() * (titleCount + 2);
        dx = Math.floor((width - titleWidth) / 2);
        TextRenderer.drawFixedTitleText(x + dx, y - 40, text, color, font, TextFormat.CENTER, pic, titleCount);
    },

    drawDetails: function (x, y) {
        var text, balancer, length;
        var cfg = FotF_BossBarControl;
        var nameFont = root.getBaseData().getFontList().getDataFromId(cfg.UnitNameFontId);
        var hpFont = root.getBaseData().getFontList().getDataFromId(cfg.HpNumberFontId);
        var nameColor = cfg.UnitNameColor;
        var hpColor = cfg.HPNumberColor;
        var nameAlpha = cfg.UnitNameAlpha;
        var hpAlpha = cfg.HpNumberAlpha;

        var pic = root.getMaterialManager().createImage(cfg.MaterialFolder, cfg.BarName);

        if (pic === null) {
            return;
        }

        pic.setAlpha(this._alpha);
        var alphaFactor = this._alpha / cfg.WindowAlpha;
        nameAlpha = Math.round(nameAlpha * alphaFactor);
        hpAlpha = Math.round(hpAlpha * alphaFactor);

        if (this._unit1 !== null) {
            balancer = this._gaugeBar1.getBalancer();
            this._gaugeBar1._alpha = this._alpha;

            if (balancer.getCurrentValue() !== this._unit1.getHp() || balancer.getMaxValue() !== this._unit1.getParamValue(ParamType.MHP)) {
                balancer.setBalancerInfo(this._unit1.getHp(), this._unit1.getParamValue(ParamType.MHP));
            }

            barX = x + cfg.BarStartX;
            barY = y + cfg.BarStartY;
            this._gaugeBar1.drawGaugeBar(barX, barY, pic);

            xDraw = x + cfg.HpNumberX1;
            yDraw = y + cfg.HpNumberY1;
            text = balancer.getCurrentValue().toString();
            length = TextRenderer.getTextWidth(text, hpFont);
            root.getGraphicsManager().drawText(xDraw, yDraw, text, -1, hpColor, hpAlpha, hpFont);

            xDraw += length;
            text = ' /' + ' ';
            length = TextRenderer.getTextWidth(text, hpFont);
            root.getGraphicsManager().drawText(xDraw, yDraw, text, -1, hpColor, hpAlpha, hpFont);

            xDraw += length;
            text = balancer.getMaxValue().toString();
            root.getGraphicsManager().drawText(xDraw, yDraw, text, -1, hpColor, hpAlpha, hpFont);

            xDraw = x + cfg.UnitNameX1;
            yDraw = y + cfg.UnitNameY1;
            text = this._unit1.getName();
            root.getGraphicsManager().drawText(xDraw, yDraw, text, -1, nameColor, nameAlpha, nameFont);
        }

        if (this._unit2 !== null) {
            balancer = this._gaugeBar2.getBalancer();
            this._gaugeBar2._alpha = this._alpha;

            if (balancer.getCurrentValue() !== this._unit2.getHp() || balancer.getMaxValue() !== this._unit2.getParamValue(ParamType.MHP)) {
                balancer.setBalancerInfo(this._unit2.getHp(), this._unit2.getParamValue(ParamType.MHP));
            }

            barX = x + cfg.BarStartX;
            barY = y + cfg.Bar2Y;
            this._gaugeBar2.drawGaugeBar(barX, barY, pic);

            xDraw = x + cfg.HpNumberX2;
            yDraw = y + cfg.HpNumberY2;
            text = balancer.getCurrentValue().toString();
            length = TextRenderer.getTextWidth(text, hpFont);
            root.getGraphicsManager().drawText(xDraw, yDraw, text, -1, hpColor, hpAlpha, hpFont);

            xDraw += length;
            text = ' /' + ' ';
            length = TextRenderer.getTextWidth(text, hpFont);
            root.getGraphicsManager().drawText(xDraw, yDraw, text, -1, hpColor, hpAlpha, hpFont);

            xDraw += length;
            text = balancer.getMaxValue().toString();
            root.getGraphicsManager().drawText(xDraw, yDraw, text, -1, hpColor, hpAlpha, hpFont);

            xDraw = x + cfg.UnitNameX2;
            yDraw = y + cfg.UnitNameY2;
            text = this._unit2.getName();
            root.getGraphicsManager().drawText(xDraw, yDraw, text, -1, nameColor, nameAlpha, nameFont);
        }

        if (this._unit3 !== null) {
            balancer = this._gaugeBar3.getBalancer();
            this._gaugeBar3._alpha = this._alpha;

            if (balancer.getCurrentValue() !== this._unit3.getHp() || balancer.getMaxValue() !== this._unit3.getParamValue(ParamType.MHP)) {
                balancer.setBalancerInfo(this._unit3.getHp(), this._unit3.getParamValue(ParamType.MHP));
            }

            barX = x + cfg.BarStartX;
            barY = y + cfg.Bar3Y;
            this._gaugeBar3.drawGaugeBar(barX, barY, pic);

            xDraw = x + cfg.HpNumberX3;
            yDraw = y + cfg.HpNumberY3;
            text = balancer.getCurrentValue().toString();
            length = TextRenderer.getTextWidth(text, hpFont);
            root.getGraphicsManager().drawText(xDraw, yDraw, text, -1, hpColor, hpAlpha, hpFont);

            xDraw += length;
            text = ' /' + ' ';
            length = TextRenderer.getTextWidth(text, hpFont);
            root.getGraphicsManager().drawText(xDraw, yDraw, text, -1, hpColor, hpAlpha, hpFont);

            xDraw += length;
            text = balancer.getMaxValue().toString();
            root.getGraphicsManager().drawText(xDraw, yDraw, text, -1, hpColor, hpAlpha, hpFont);

            xDraw = x + cfg.UnitNameX3;
            yDraw = y + cfg.UnitNameY3;
            text = this._unit3.getName();
            root.getGraphicsManager().drawText(xDraw, yDraw, text, -1, nameColor, nameAlpha, nameFont);
        }
    },

    drawStates: function (xBase, yBase) {
        var cfg = FotF_BossBarControl;
        var i;
        var rowCounter = 0;
        var colCounter = 0;
        var x = xBase + cfg.StateIconStartX1;
        var y = yBase + cfg.StateIconStartY1;

        if (this._unit1 !== null) {
            var list = this._unit1.getTurnStateList();

            for (i = 0; i < list.getCount(); i++) {
                var state = list.getData(i).getState();
                if (!state.isHidden()) {
                    var handle = state.getIconResourceHandle();
                    if (handle === null || handle.isNullHandle()) {
                        continue;
                    }

                    var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.ICON);
                    var xSrc = handle.getSrcX();
                    var ySrc = handle.getSrcY();
                    var size = GraphicsRenderer.getGraphicsSize(GraphicsType.ICON, pic);
                    var width = size.width;
                    var height = size.height;

                    if (pic !== null) {
                        pic.setAlpha(this._alpha);
                        pic.drawStretchParts(x, y, width, height, xSrc * width, ySrc * height, width, height);
                    }

                    if (rowCounter < cfg.MaxStateIconsPerRow - 1) {
                        rowCounter++;
                        x += cfg.StateIconXSpacing + GraphicsFormat.ICON_WIDTH;
                    } else {
                        rowCounter = 0;
                        colCounter++;
                        x = xBase + cfg.StateIconStartX1;
                        y += cfg.StateIconYSpacing + GraphicsFormat.ICON_HEIGHT;
                    }

                    if (colCounter >= cfg.MaxStateIconRows) {
                        break; //max number of skills reached, don't draw any more
                    }
                }
            }
        }

        var x = xBase + cfg.StateIconStartX2;
        var y = yBase + cfg.StateIconStartY2;
        var rowCounter = 0;
        var colCounter = 0;

        if (this._unit2 !== null) {
            var list = this._unit2.getTurnStateList();

            for (i = 0; i < list.getCount(); i++) {
                var state = list.getData(i).getState();
                if (!state.isHidden()) {
                    var handle = state.getIconResourceHandle();
                    if (handle === null || handle.isNullHandle()) {
                        continue;
                    }

                    var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.ICON);
                    var xSrc = handle.getSrcX();
                    var ySrc = handle.getSrcY();
                    var size = GraphicsRenderer.getGraphicsSize(GraphicsType.ICON, pic);
                    var width = size.width;
                    var height = size.height;

                    if (pic !== null) {
                        pic.setAlpha(this._alpha);
                        pic.drawStretchParts(x, y, width, height, xSrc * width, ySrc * height, width, height);
                    }

                    if (rowCounter < cfg.MaxStateIconsPerRow - 1) {
                        rowCounter++;
                        x += cfg.StateIconXSpacing + GraphicsFormat.ICON_WIDTH;
                    } else {
                        rowCounter = 0;
                        colCounter++;
                        x = xBase + cfg.StateIconStartX2;
                        y += cfg.StateIconYSpacing + GraphicsFormat.ICON_HEIGHT;
                    }

                    if (colCounter >= cfg.MaxStateIconRows) {
                        break; //max number of skills reached, don't draw any more
                    }
                }
            }
        }

        var x = xBase + cfg.StateIconStartX3;
        var y = yBase + cfg.StateIconStartY3;
        var rowCounter = 0;
        var colCounter = 0;

        if (this._unit3 !== null) {
            var list = this._unit3.getTurnStateList();

            for (i = 0; i < list.getCount(); i++) {
                var state = list.getData(i).getState();
                if (!state.isHidden()) {
                    var handle = state.getIconResourceHandle();
                    if (handle === null || handle.isNullHandle()) {
                        continue;
                    }

                    var pic = GraphicsRenderer.getGraphics(handle, GraphicsType.ICON);
                    var xSrc = handle.getSrcX();
                    var ySrc = handle.getSrcY();
                    var size = GraphicsRenderer.getGraphicsSize(GraphicsType.ICON, pic);
                    var width = size.width;
                    var height = size.height;

                    if (pic !== null) {
                        pic.setAlpha(this._alpha);
                        pic.drawStretchParts(x, y, width, height, xSrc * width, ySrc * height, width, height);
                    }

                    if (rowCounter < cfg.MaxStateIconsPerRow - 1) {
                        rowCounter++;
                        x += cfg.StateIconXSpacing + GraphicsFormat.ICON_WIDTH;
                    } else {
                        rowCounter = 0;
                        colCounter++;
                        x = xBase + cfg.StateIconStartX3;
                        y += cfg.StateIconYSpacing + GraphicsFormat.ICON_HEIGHT;
                    }

                    if (colCounter >= cfg.MaxStateIconRows) {
                        break; //max number of skills reached, don't draw any more
                    }
                }
            }
        }
    },

    drawPortraits: function (x, y) {
        var cfg = FotF_BossBarControl;

        if (root.isLargeFaceUse()) {
            var width = root.getLargeFaceWidth();
            var height = root.getLargeFaceHeight();
        } else {
            var width = GraphicsFormat.FACE_WIDTH;
            var height = GraphicsFormat.FACE_HEIGHT;
        }

        if (this._unit1 !== null) {
            var handle = this._unit1.getFaceResourceHandle();
            if (handle !== null && !handle.isNullHandle()) {
                if (handle.getHandleType() === ResourceHandleType.ORIGINAL) {
                    isRuntime = false;
                } else {
                    isRuntime = true;
                }

                var list = root.getBaseData().getGraphicsResourceList(GraphicsType.FACE, isRuntime);
                var pic = list.getCollectionDataFromId(handle.getResourceId(), handle.getColorIndex());

                if (pic !== null) {
                    var xSrc = handle.getSrcX() * GraphicsFormat.FACE_WIDTH;
                    var ySrc = handle.getSrcY() * GraphicsFormat.FACE_HEIGHT;
                    pic.setAlpha(this._alpha);
                    pic.drawStretchParts(x + cfg.PortraitX1, y + cfg.PortraitY1, cfg.PortraitWidth, cfg.PortraitHeight, xSrc, ySrc, width, height);
                }
            }
        }

        if (this._unit2 !== null) {
            var handle = this._unit2.getFaceResourceHandle();
            if (handle !== null && !handle.isNullHandle()) {
                if (handle.getHandleType() === ResourceHandleType.ORIGINAL) {
                    isRuntime = false;
                } else {
                    isRuntime = true;
                }

                var list = root.getBaseData().getGraphicsResourceList(GraphicsType.FACE, isRuntime);
                var pic = list.getCollectionDataFromId(handle.getResourceId(), handle.getColorIndex());

                if (pic !== null) {
                    var xSrc = handle.getSrcX() * GraphicsFormat.FACE_WIDTH;
                    var ySrc = handle.getSrcY() * GraphicsFormat.FACE_HEIGHT;
                    pic.setAlpha(this._alpha);
                    pic.drawStretchParts(x + cfg.PortraitX2, y + cfg.PortraitY2, cfg.PortraitWidth, cfg.PortraitHeight, xSrc, ySrc, width, height);
                }
            }
        }

        if (this._unit3 !== null) {
            var handle = this._unit3.getFaceResourceHandle();
            if (handle !== null && !handle.isNullHandle()) {
                if (handle.getHandleType() === ResourceHandleType.ORIGINAL) {
                    isRuntime = false;
                } else {
                    isRuntime = true;
                }

                var list = root.getBaseData().getGraphicsResourceList(GraphicsType.FACE, isRuntime);
                var pic = list.getCollectionDataFromId(handle.getResourceId(), handle.getColorIndex());

                if (pic !== null) {
                    var xSrc = handle.getSrcX() * GraphicsFormat.FACE_WIDTH;
                    var ySrc = handle.getSrcY() * GraphicsFormat.FACE_HEIGHT;
                    pic.setAlpha(this._alpha);
                    pic.drawStretchParts(x + cfg.PortraitX3, y + cfg.PortraitY3, cfg.PortraitWidth, cfg.PortraitHeight, xSrc, ySrc, width, height);
                }
            }
        }
    },

    getWindowTextUI: function () {
        return root.queryTextUI('default_window');
    },

    getWindowTitleTextUI: function () {
        return null;
    },

    getWindowTitleText: function () {
        return '';
    },

    getWindowWidth: function () {
        return FotF_BossBarControl.WindowWidth;
    },

    getWindowHeight: function () {
        if (this._unit3 !== null) {
            return FotF_BossBarControl.Window3Height;
        } else if (this._unit2 !== null) {
            return FotF_BossBarControl.Window2Height;
        } else if (this._unit1 !== null) {
            return FotF_BossBarControl.Window1Height;
        } else {
            return 0;
        }
    },

    getWindowXPadding: function () {
        return DefineControl.getWindowXPadding();
    },

    getWindowYPadding: function () {
        return DefineControl.getWindowYPadding();
    },

    enableWindow: function (isWindowEnabled) {
        this._isWindowEnabled = isWindowEnabled;
    },

    setDrawingMethod: function (method) {
        this._drawParentData = method;
    },

    _drawWindowInternal: function (x, y, width, height) {
        var cfg = FotF_BossBarControl;

        var pic = root.getMaterialManager().createImage(cfg.MaterialFolder, cfg.WindowName);

        if (pic !== null) {
            pic.setAlpha(this._alpha);
            pic.drawParts(x, y, 0, 0, width, height);
        }
    }
});

var FotF_BossGauge = defineObject(BaseObject, {
    _colorIndex: 0,
    _counter: null,
    _balancer: null,
    _partsCount: 0,
    _alpha: null,

    initialize: function () {
        this._balancer = createObject(SimpleBalancer);
    },

    setGaugeInfo: function (value, maxValue, colorIndex, alpha) {
        this._balancer.setBalancerInfo(value, maxValue);
        this._colorIndex = colorIndex;
        this._partsCount = 11;
        this._alpha = alpha;
    },

    setPartsCount: function (partsCount) {
        this._partsCount = partsCount;
    },

    moveGaugeBar: function () {
        return this._balancer.moveBalancer();
    },

    drawGaugeBar: function (xBase, yBase, pic) {
        var curValue = this._balancer.getCurrentValue();
        var maxValue = this._balancer.getMaxValue();

        this.drawGauge(xBase, yBase, curValue, maxValue, this._colorIndex, this.getGaugeWidth(), pic);
    },

    drawGauge: function (x, y, curValue, maxValue, colorIndex, totalWidth, pic) {
        var i, n, per;
        var cfg = FotF_BossBarControl;
        var width = this.getGaugeWidth();
        var height = this.getGaugeHeight();

        if (pic === null) {
            return;
        }
        pic.setAlpha(this._alpha);

        per = (curValue / maxValue) * 100;

        if (per < 0 || per > 100) {
            per = 0;
        }

        var curWidth = Math.ceil((per * width) / 100);
        var diff = width - curWidth;

        if (cfg.IsBarRightToLeft) {
            pic.drawParts(x, y, 0, 0, curWidth, height);
        } else {
            pic.drawParts(x + diff, y, diff, 0, width - diff, height);
        }
    },

    startMove: function (value) {
        this._balancer.startBalancerMove(value);
    },

    // Change immediately to the specified value.
    // It's used for cutting animation.
    forceValue: function (value) {
        this._balancer.setCurrentValue(value);
        this._balancer.setWaitMode();
    },

    getBalancer: function () {
        return this._balancer;
    },

    isMoving: function () {
        return this._balancer.isMoving();
    },

    getGaugeWidth: function () {
        return FotF_BossBarControl.BarWidth;
    },

    getGaugeHeight: function () {
        return FotF_BossBarControl.BarHeight;
    }
});

//Start showing a boss bar for a single unit
var FotF_InitializeBossBar = function (unitId, unitGroup) {
    MapLayer._bossBar = createObject(FotF_BossBarWindow);
    MapLayer._bossBar.initializeUnit(unitId, unitGroup);
};

//Remove whole boss bar
var FotF_RemoveBossBar = function () {
    MapLayer._bossBar = null;
};

var FotF_AddUnitToBossBar = function (unitId, unitGroup) {
    var bar = MapLayer._bossBar;

    if (bar === null) {
        FotF_InitializeBossBar(unitId, unitGroup);
    } else {
        bar.setAdditionalUnit(unitId, unitGroup);
    }
};

//Remove boss bar for a single unit
var FotF_RemoveUnitFromBossBar = function (unitId, unitGroup) {
    var i, unit;
    var bar = MapLayer._bossBar;
    var realID = unitId + 65536 * unitGroup;

    if (bar === null) {
        return;
    }

    if (unitGroup === UnitGroup.PLAYER || unitGroup === UnitGroup.GUEST || unitGroup === UnitGroup.GUESTEVENT) {
        unit = PlayerList.getMainList().getDataFromId(realID);
    } else if (unitGroup === UnitGroup.ENEMY || unitGroup === UnitGroup.ENEMYEVENT || unitGroup === UnitGroup.REINFORCE) {
        unit = EnemyList.getMainList().getDataFromId(realID);
    } else {
        unit = AllyList.getMainList().getDataFromId(realID);
    }

    bar.removeUnit(unit);
};

//Hide boss bar
var FotF_HideBossBar = function () {
    MapLayer._bossBar._isVisible = false;
};

//Show boss bar
var FotF_ShowBossBar = function () {
    MapLayer._bossBar._isVisible = true;
};

(function () {
    if (typeof FotF_LayerRendererConstants !== 'undefined') {
        FotF_LayerRendererConstants.EnableBossBar = true;
    }

    var FotF_PrepareBossBar = MapLayer.prepareMapLayer;
    MapLayer.prepareMapLayer = function () {
        FotF_PrepareBossBar.call(this);
        this._bossBar = null;
    };

    var FotF_DrawBossBar = MapLayer.drawUnitLayer;
    MapLayer.drawUnitLayer = function () {
        FotF_DrawBossBar.call(this);

        if (typeof FotF_LayerRendererConstants === 'undefined') {
            if (this._bossBar !== null) {
                if (this._bossBar._isVisible === true && this._bossBar._isScroll !== true) {
                    this._bossBar.moveWindow();
                    this._bossBar.drawWindow(this._bossBar._x, this._bossBar._y);
                }
            }
        }
    };

    var FotF_DrawBossBar2 = UnitRenderer.drawScrollUnit;
    UnitRenderer.drawScrollUnit = function (unit, x, y, unitRenderParam) {
        FotF_DrawBossBar2.call(this, unit, x, y, unitRenderParam);

        if (typeof FotF_LayerRendererConstants === 'undefined') {
            if (MapLayer._bossBar !== null) {
                if (MapLayer._bossBar._isVisible === true) {
                    MapLayer._bossBar.moveWindow();
                    MapLayer._bossBar.drawWindow(MapLayer._bossBar._x, MapLayer._bossBar._y);
                }
            }
        }
    };

    var FotF_EasyBattleBarSynchronizer = EasyBattle.startDamageAnimation;
    EasyBattle.startDamageAnimation = function () {
        FotF_EasyBattleBarSynchronizer.call(this);
        if (MapLayer._bossBar !== null) {
            var order = this._order;
            var damageActive = order.getActiveDamage() * -1;
            var damagePassive = order.getPassiveDamage() * -1;

            if (this._battlerRight.getUnit() === MapLayer._bossBar._unit1) {
                if (this._battlerRight.getUnit() === order.getActiveUnit()) {
                    MapLayer._bossBar._gaugeBar1.startMove(damageActive);
                } else {
                    MapLayer._bossBar._gaugeBar1.startMove(damagePassive);
                }
            } else if (this._battlerRight.getUnit() === MapLayer._bossBar._unit2) {
                if (this._battlerRight.getUnit() === order.getActiveUnit()) {
                    MapLayer._bossBar._gaugeBar2.startMove(damageActive);
                } else {
                    MapLayer._bossBar._gaugeBar2.startMove(damagePassive);
                }
            } else if (this._battlerRight.getUnit() === MapLayer._bossBar._unit3) {
                if (this._battlerRight.getUnit() === order.getActiveUnit()) {
                    MapLayer._bossBar._gaugeBar3.startMove(damageActive);
                } else {
                    MapLayer._bossBar._gaugeBar3.startMove(damagePassive);
                }
            }

            if (this._battlerLeft.getUnit() === MapLayer._bossBar._unit1) {
                if (this._battlerLeft.getUnit() === order.getActiveUnit()) {
                    MapLayer._bossBar._gaugeBar1.startMove(damageActive);
                } else {
                    MapLayer._bossBar._gaugeBar1.startMove(damagePassive);
                }
            } else if (this._battlerLeft.getUnit() === MapLayer._bossBar._unit2) {
                if (this._battlerLeft.getUnit() === order.getActiveUnit()) {
                    MapLayer._bossBar._gaugeBar2.startMove(damageActive);
                } else {
                    MapLayer._bossBar._gaugeBar2.startMove(damagePassive);
                }
            } else if (this._battlerLeft.getUnit() === MapLayer._bossBar._unit3) {
                if (this._battlerLeft.getUnit() === order.getActiveUnit()) {
                    MapLayer._bossBar._gaugeBar3.startMove(damageActive);
                } else {
                    MapLayer._bossBar._gaugeBar3.startMove(damagePassive);
                }
            }
        }
    };

    var FotF_RealBattleBarSynchronizer = UIBattleLayout.setDamage;
    UIBattleLayout.setDamage = function (battler, damage, isCritical, isFinish) {
        FotF_RealBattleBarSynchronizer.call(this, battler, damage, isCritical, isFinish);

        if (MapLayer._bossBar !== null) {
            if (battler._unit === MapLayer._bossBar._unit1) {
                MapLayer._bossBar._gaugeBar1.startMove(damage * -1);
            } else if (battler._unit === MapLayer._bossBar._unit2) {
                MapLayer._bossBar._gaugeBar2.startMove(damage * -1);
            } else if (battler._unit === MapLayer._bossBar._unit3) {
                MapLayer._bossBar._gaugeBar3.startMove(damage * -1);
            }
        }
    };

    var FotF_EraseBossBarOnDeath = DamageControl.setDeathState;
    DamageControl.setDeathState = function (unit) {
        FotF_EraseBossBarOnDeath.call(this, unit);
        var bar = MapLayer._bossBar;

        if (bar !== null) {
            if (unit === bar._unit1 || unit === bar._unit2 || unit === bar._unit3) {
                bar.removeUnit(unit);
            }
        }
    };

    var FotF_EraseBossBarOnErase = DamageControl.setReleaseState;
    DamageControl.setReleaseState = function (unit) {
        FotF_EraseBossBarOnErase.call(this, unit);
        var bar = MapLayer._bossBar;

        if (bar !== null) {
            if (unit === bar._unit1 || unit === bar._unit2 || unit === bar._unit3) {
                bar.removeUnit(unit);
            }
        }
    };

    //Blocks double rendering of boss bar during normal unit movement
    var FotF_BlockBossBarMapLayer = SimulateMove.startMove;
    SimulateMove.startMove = function (unit, moveCource) {
        FotF_BlockBossBarMapLayer.call(this, unit, moveCource);

        if (typeof MapLayer._bossBar !== 'undefined' && MapLayer._bossBar !== null) {
            MapLayer._bossBar._isScroll = true;
        }
    };

    //Blocks double rendering of boss bar during event unit movement
    var FotF_BlockBossBarMapLayer2 = ScriptCall_GetUnitMoveCource;
    ScriptCall_GetUnitMoveCource = function (unit, xGoal, yGoal, isTerrainDisabled) {
        FotF_BlockBossBarMapLayer2.call(this, unit, xGoal, yGoal, isTerrainDisabled);

        if (typeof MapLayer._bossBar !== 'undefined' && MapLayer._bossBar !== null) {
            MapLayer._bossBar._isScroll = true;
        }
    };

    //Releases the block on the boss bar rendering when unit ends it's move
    var FotF_UnblockBossBarMapLayer = SimulateMove._endMove;
    SimulateMove._endMove = function (unit) {
        FotF_UnblockBossBarMapLayer.call(this, unit);

        if (typeof MapLayer._bossBar !== 'undefined' && MapLayer._bossBar !== null) {
            MapLayer._bossBar._isScroll = false;
        }
    };

    //Releases the block on the boss bar rendering when unit cancels it's move
    var FotF_UnblockBossBarMapLayer2 = PlayerTurn.setPosValue;
    PlayerTurn.setPosValue = function (unit) {
        FotF_UnblockBossBarMapLayer2.call(this, unit);

        if (typeof MapLayer._bossBar !== 'undefined' && MapLayer._bossBar !== null) {
            MapLayer._bossBar._isScroll = false;
        }
    };
})();
