/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                A choice show event command - but timed
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Introducing a custom event command that works just like the choice show event
command, but has a configurable timer built-in that ends the choice selection
and flips a self switch for further eventing.

_____________________________________________________________________________
							How to set up
_____________________________________________________________________________

Set an execute script event command to "Call Event Command" and write
"QuickTimeEvent" (can be changed in settings) in the command name field.
The arguments for the argument field are as follows:

Required:

    - isTwoLines:   Whether the choices should be shown in two lines or one.
                    True for two lines, false for one.

    - choiceArray:  An array containing the choice texts, determines choice
                    count.

    - switchArray:  An array containing the indices of the self switches to
                    be flipped by the choices in choiceArray. Same count and
                    order as the options in choice array.

With these 3 you have the base functionality of a choice show event command with
double the effort. Congratulations! This is where the optional parameters come
in, to make the event timed and/or add descriptions.

Optional:

    - forceOption:      Index of the self switch to flip if the timer runs out
                        (0 is A, 1 is B and so on).

    - duration:         Duration in ticks (60 ticks = 1s) of the timer.

    - timerX:           X offset of the timer window from default position.

    - timerY:           Y offset of the timer window from default position.

    - timerColorIndex : Color Index determining the color of the timer.
                        Goes from 0-4 and is equal to the rows of
                        UI/bignumber

    - timerAlpha:       Opacity of the timer (0-255).

    - iconHandleArray:  An array of arrays describing the handle parameters
                        for the drawing of icons for the choices. Same count
                        and order as the options in choice array.
                        See example for further instructions.

    - descriptionArray: An array containing descriptions of the choices. 
                        Also same amount and order as choices.

    - forceWindowWidth: Array containing values to force the width of the
                        description window in pixels. Each choice has it's
                        own value and the order and amount also match here.
                        Specify null for a value if you want to skip it.

    - forceWindowHeight: Same as with forceWindowWidth, but for the height
                         of the window.

    - forceTextOffsetX: Array containing horizontal offset values (in pixels)
                        for the description items. Same amount and order as
                        choices. Specify 0 or null to skip a value.

    - forceTextOffsetY: Same as forceTextOffsetX but vertical.

_____________________________________________________________________________
								Example
_____________________________________________________________________________

Let's say you want the player to pick one of 3 choices in 5 seconds and if
they don't decide in time, execute a 4th, hidden option. For simplicity's
sake we'll assume you use the self switches A-D for options 1-4, but you can
use other switches as well. First we set up the required arguments:

{
    forceOption: 3,                                         //So option 4/self switch D is executed if player is too slow (index starts at 0)
    duration: 300,                                          //5s = 300 ticks
    isTwoLines: false,                                      //Display in one line
    choiceArray: ["Choice 1", "Choice 2", "Choice 3"],      //Text needs to be strings (in "")
    switchArray: [0, 1, 2]                                  //Translates to self switches A, B and C
}

Now if you wanna get fancy and customize this a bit more, you can add some
optional arguments in here:

{
    forceOption: 3,
    duration: 300,
    isTwoLines: false,
    choiceArray: ["Choice 1", "Choice 2", "Choice 3"],
    descriptionArray: ["This is a choice", "This as well", "This is not"] //Descriptions for the choices, put "" to not have a description for a choice
    switchArray: [0, 1, 2],
    timerX: 60,                                             //Timer window will be drawn 60 pixels to the right of default
    timery: -40,                                            //Timer window will be drawn 40 pixels upwards of default
    timerColorIndex: 3,                                     //Timer number will be rendered red (if default bignumber image is used)
    timerAlpha: 127,                                        //Timer number will be half transparent
    iconHandleArray: [[true, 0, 0, 1, 12], [true, 0, 0, 2, 12], [true, 0, 0, 3, 12]],   //[isRuntime, ID of icon image, always 0, xSrc of icon, ySrc of icon]
    forceWindowWidth: [150, null, null],                    //Forced window widths for descriptions, specify null to not force for a choice
    forceWindowHeight: [80, 69, null],                      //Forced window heights for descriptions, specify null to not force for a choice
    forceTextOffsetX: 0,                                    //Forced horizontal description text offset
    forceTextOffsetY: -30                                   //Forced horizontal description text offset
}

isRuntime is true if it's an RTP image, false if original. ID is the ID of
the icon image sheet to be used and xSrc/ySrc are the grid coordinates
(starting with 0/0) of the icon on the sheet.

_____________________________________________________________________________
							Tips and Tricks
_____________________________________________________________________________

The line break detection normally does an ok job, but sometimes (especially
for longer texts and small line break values) the window gets a bit too big
and needs some resizing. This is where you can use forceWindowWidth/Height
to force a size on a window and forceTextOffsetX/Y to reposition the text.
You'll likely need a bit of trial and error to get the values right, but it's
better than not being able to adjust them.

If you're unsatisfied with the line breaks done by the internal function of
the SRPG Studio API, you can add your own with \n in the text. For example
"Break the line after this\nto look better visually" will become

Break the line after this
to look better visually

Notice the \n is automatically removed and a line break inserted. Keep in
mind that spaces after \n will show up at the start of the new line.

_____________________________________________________________________________
								EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/01/19
Released

2025/02/25
Removed FotF_MouseControl as it was not needed.

Added functionality to show a little description window when a choice
is marked. Thank you @Cuss for the idea!

Fixed a little typo in the instructions and added description
functionality to it.

--------------------------------------------------------------------------*/

/////////////////////////////////////////////////////////////////////////////
/////							SETTINGS								/////
/////////////////////////////////////////////////////////////////////////////

var FotF_ChoiceShowExSettings = {
    eventName: 'QuickTimeEvent',
    //Timer settings
    defaultTimerX: 0, //Timer window x offset from middle of choice boxes
    defaultTimerY: -64, //Timer window y offset from top of first choice box
    defaultTimerColorIndex: 0, //0-4, controls timer number color
    defaultTimerAlpha: 155, //0-255, control timer number opacity
    timerWindowWidth: 48, //Width of timer window
    timerWindowHeight: 48, //Height of timer window
    timerWindowXPadding: 16, //Horizontal number spacing from window edges
    timerWindowYPadding: 12, //Vertical number spacing from window edges
    //Description settings
    fontId: 0, //Font IDs are found in Database > Config > Fonts
    textColor: 0xffffff, //Hexadecimal format. Google hex color picker if unsure
    textAlpha: 255, //0-255
    descriptionWindowPaddingX: 10, //Horizontal text spacing from window edges
    descriptionWindowPaddingY: 10, //Vertical text spacing from window edges
    descriptionWindowSpacingX: 8, //Horizontal window spacing from choice box (right side)
    descriptionWindowSpacingY: -50, //Vertical window spacing from choice box (top)
    lineBreakLength: 200, //Length of text in pixels where line break occurs
    lineBreakSpacingY: 2, //Vertical spacing between lines. Not including text height.
    descriptionTextFormat: TextFormat.LEFT //TextFormat.LEFT, TextFormat.CENTER or TextFormat.RIGHT
};

/////////////////////////////////////////////////////////////////////////////
/////								CODE								/////
/////////////////////////////////////////////////////////////////////////////

(function () {
    var FotF_AppendChoiceShowEventEx = ScriptExecuteEventCommand._configureOriginalEventCommand;
    ScriptExecuteEventCommand._configureOriginalEventCommand = function (groupArray) {
        FotF_AppendChoiceShowEventEx.call(this, groupArray);
        groupArray.appendObject(FotF_ChoiceShowEventEx);
    };
})();

var FotF_ChoiceShowEventEx = defineObject(BaseEventCommand, {
    _scrollbar: null,
    _messageArray: null,
    _descriptionArray: null,
    _switchArray: null,
    _counter: null,
    _args: null,
    _timerWindow: null,
    _textWindow: null,

    enterEventCommandCycle: function () {
        this._prepareEventCommandMemberData();

        if (!this._checkEventCommand()) {
            return EnterResult.NOTENTER;
        }

        return this._completeEventCommandMemberData();
    },

    moveEventCommandCycle: function () {
        var input = this._scrollbar.moveInput();
        var result = MoveResult.CONTINUE;
        var index = this._scrollbar.getIndex();

        if (this._textWindow !== null) {
            this._textWindow.updateIndex(index);
        }

        if (this._counter !== null) {
            result = this._counter.moveCycleCounter();
        }

        if (input === ScrollbarInput.SELECT) {
            this._selectItem(index);
            return MoveResult.END;
        }

        if (result !== MoveResult.CONTINUE) {
            var index = this._args.forceOption;
            root.setSelfSwitch(index, true); //Not this._selectItem, so options not present in the choices can be executed
            return MoveResult.END;
        }

        return MoveResult.CONTINUE;
    },

    drawEventCommandCycle: function () {
        var cfg = FotF_ChoiceShowExSettings;
        var x = LayoutControl.getCenterX(-1, this._scrollbar.getScrollbarWidth());
        var y = LayoutControl.getCenterY(-1, this._scrollbar.getScrollbarHeight());
        var timerX = LayoutControl.getCenterX(-1, cfg.timerWindowWidth);
        var timerY = y;
        var index = this._scrollbar.getIndex();

        if (typeof this._args.timerX !== 'number') {
            timerX += cfg.defaultTimerX;
        } else {
            timerX += this._args.timerX;
        }

        if (typeof this._args.timerY !== 'number') {
            timerY += cfg.defaultTimerY;
        } else {
            timerY += this._args.timerY;
        }

        var textWindowX = x + this._scrollbar.getScrollbarWidth() + cfg.descriptionWindowSpacingX;
        var textWindowY = y + this._scrollbar.getObjectHeight() * (1 + index) + this._scrollbar.getSpaceY() * index + cfg.descriptionWindowSpacingY;

        this._scrollbar.drawScrollbar(x, y);

        if (this._counter !== null) {
            this._drawTimer(timerX, timerY);
        }

        if (this._descriptionArray.length !== null) {
            var index = this._scrollbar.getIndex();
            var text = this._descriptionArray[index];
            var color = cfg.textColor;
            var alpha = cfg.textAlpha;
            if (typeof text === 'string' && text.length > 0) {
                this._drawDescriptionWindow(textWindowX, textWindowY, text, color, alpha);
            }
        }
    },

    _drawTimer: function (x, y) {
        var tick = this._counter.getCounter();
        var maxTicks = this._args.duration;
        var ticksLeft = maxTicks - tick;
        var time = Math.floor(ticksLeft / 60);
        var cfg = FotF_ChoiceShowExSettings;
        if (typeof this._args.timerColorIndex !== 'number' || this._args.timerColorIndex > 4) {
            var colorIndex = cfg.defaultTimerColorIndex;
        } else {
            var colorIndex = this._args.timerColorIndex;
        }
        if (typeof this._args.timerAlpha !== 'number') {
            var alpha = cfg.defaultTimerAlpha;
        } else {
            var alpha = this._args.timerAlpha;
        }
        this._timerWindow.drawWindow(x, y, time, colorIndex, alpha);
    },

    _drawDescriptionWindow: function (x, y, text, color, alpha) {
        this._textWindow.drawWindow(x, y, text, color, alpha);
    },

    isEventCommandSkipAllowed: function () {
        // Don't allow the skip by pressing the Start.
        return false;
    },

    isTwoLines: function () {
        return this._isTwoLines;
    },

    _prepareEventCommandMemberData: function () {
        var eventCommandData = root.getEventCommandObject();
        this._args = eventCommandData.getEventCommandArgument();

        this._scrollbar = createScrollbarObject(SelectScrollbar, this);

        if (typeof this._args.duration === 'number') {
            this._timerWindow = createObject(FotF_TimerWindow);
            this._counter = createObject(CycleCounter);
            this._counter.setCounterInfo(this._args.duration);
        }

        this._messageArray = [];
        this._switchArray = [];
        this._descriptionArray = [];

        this._isTwoLines = this._args.isTwoLines;

        this._resetPreviousSelfSwitches();

        this._setScrollbarData(this._args);

        var forceWidthArray = null;
        var forceHeightArray = null;
        var forceArrayX = null;
        var forceArrayY = null;

        if (typeof this._args.forceWindowWidth === 'object' && this._args.forceWindowWidth.length > 0) {
            forceWidthArray = this._args.forceWindowWidth;
        }
        if (typeof this._args.forceWindowHeight === 'object' && this._args.forceWindowHeight.length > 0) {
            forceHeightArray = this._args.forceWindowHeight;
        }
        if (typeof this._args.forceTextOffsetX === 'object' && this._args.forceTextOffsetX.length > 0) {
            forceArrayX = this._args.forceTextOffsetX;
        }
        if (typeof this._args.forceTextOffsetY === 'object' && this._args.forceTextOffsetY.length > 0) {
            forceArrayY = this._args.forceTextOffsetY;
        }

        if (typeof this._args.descriptionArray === 'object' && this._args.descriptionArray.length > 0) {
            this._descriptionArray = this._args.descriptionArray;
            this._textWindow = createObject(FotF_DescriptionWindow);
            this._textWindow.setForceValues(forceWidthArray, forceHeightArray, forceArrayX, forceArrayY);
            this._textWindow.updateIndex(0);
        }

        // Choices are needed to display even if it's a skip mode, so force skip to be suspended.
        this.stopEventSkip();
    },

    _resetPreviousSelfSwitches: function () {
        var i;
        var max = 26;

        for (i = 0; i < max; i++) {
            root.setSelfSwitch(i, false);
        }
    },

    _setScrollbarData: function (eventCommandData) {
        var i, text, obj;
        var replacer = createObject(VariableReplacer);
        var maxMessageCount = this._getMaxMessageCount();
        var arr = this._args.iconHandleArray;

        for (i = 0; i < maxMessageCount; i++) {
            text = replacer.startReplace(this._args.choiceArray[i]);
            if (text.length !== 0) {
                obj = {};
                obj.text = text;
                if (typeof arr !== 'undefined' && arr[i].length === 5) {
                    obj.handle = root.createResourceHandle(arr[i][0], arr[i][1], arr[i][2], arr[i][3], arr[i][4]);
                } else {
                    obj.handle = root.createEmptyHandle();
                }

                this._messageArray.push(obj);
                this._switchArray.push(this._args.switchArray[i]);
            }
        }
    },

    _checkEventCommand: function () {
        if (this._messageArray.length === 0) {
            return false;
        }

        return true;
    },

    _completeEventCommandMemberData: function () {
        var max;
        var count = 5;

        if (this._isTwoLines) {
            max = Math.ceil(this._messageArray.length / 2);
        } else {
            max = this._messageArray.length;
        }

        if (count > max) {
            count = max;
        }

        if (this._isTwoLines) {
            this._scrollbar.setScrollFormation(2, count);
        } else {
            this._scrollbar.setScrollFormation(1, count);
        }

        this._scrollbar.setObjectArray(this._messageArray);
        this._scrollbar.setActive(true);

        return EnterResult.OK;
    },

    _selectItem: function (index) {
        var id = this._switchArray[index];

        root.setSelfSwitch(id, true);
    },

    _getMaxMessageCount: function () {
        return this._args.choiceArray.length;
    },

    getEventCommandName: function () {
        return FotF_ChoiceShowExSettings.eventName;
    }
});

var FotF_TimerWindow = defineObject(BaseWindow, {
    _isWindowEnabled: true,
    _drawParentData: null,

    initialize: function () {},

    moveWindow: function () {
        return this.moveWindowContent();
    },

    moveWindowContent: function () {
        return MoveResult.CONTINUE;
    },

    drawWindow: function (x, y, value, colorIndex, alpha) {
        var width = this.getWindowWidth();
        var height = this.getWindowHeight();

        if (!this._isWindowEnabled) {
            return;
        }

        this._drawWindowInternal(x, y, width, height);

        if (this._drawParentData !== null) {
            this._drawParentData(x, y);
        }

        // The move method enables to refer to the coordinate with a mouse.
        this.xRendering = x + this.getWindowXPadding();
        this.yRendering = y + this.getWindowYPadding();

        this.drawWindowContent(x + this.getWindowXPadding(), y + this.getWindowYPadding(), value, colorIndex, alpha);

        this.drawWindowTitle(x, y, width, height);
    },

    drawWindowContent: function (x, y, value, colorIndex, alpha) {
        NumberRenderer.drawAttackNumberColor(x, y, value, colorIndex, alpha);
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
        return FotF_ChoiceShowExSettings.timerWindowWidth;
    },

    getWindowHeight: function () {
        return FotF_ChoiceShowExSettings.timerWindowHeight;
    },

    getWindowXPadding: function () {
        return FotF_ChoiceShowExSettings.timerWindowXPadding;
    },

    getWindowYPadding: function () {
        return FotF_ChoiceShowExSettings.timerWindowYPadding;
    },

    enableWindow: function (isWindowEnabled) {
        this._isWindowEnabled = isWindowEnabled;
    },

    setDrawingMethod: function (method) {
        this._drawParentData = method;
    },

    _drawWindowInternal: function (x, y, width, height) {
        var pic = null;
        var textui = this.getWindowTextUI();

        if (textui !== null) {
            pic = textui.getUIImage();
        }

        if (pic !== null) {
            WindowRenderer.drawStretchWindow(x, y, width, height, pic);
        }
    }
});

var FotF_DescriptionWindow = defineObject(BaseWindow, {
    _isWindowEnabled: true,
    _drawParentData: null,
    _range: null,
    _forceWidths: null,
    _forceHeights: null,
    _forceArrayX: null,
    _forceArrayY: null,
    _index: null,

    initialize: function () {},

    moveWindow: function () {
        return this.moveWindowContent();
    },

    moveWindowContent: function () {
        return MoveResult.CONTINUE;
    },

    updateIndex: function (index) {
        this._index = index;
    },

    setForceValues: function (widthArray, heightArray, forceArrayX, forceArrayY) {
        this._forceWidths = widthArray;
        this._forceHeights = heightArray;
        this._forceArrayX = forceArrayX;
        this._forceArrayY = forceArrayY;
    },

    drawWindow: function (x, y, text, color, alpha) {
        var width = this.getWindowWidth(this._index);
        var height = this.getWindowHeight(this._index);
        var font = root.getBaseData().getFontList().getDataFromId(FotF_ChoiceShowExSettings.fontId);

        if (!this._isWindowEnabled) {
            return;
        }

        this._drawWindowInternal(x, y, width, height);

        if (this._drawParentData !== null) {
            this._drawParentData(x, y);
        }

        // The move method enables to refer to the coordinate with a mouse.
        this.xRendering = x + this.getWindowXPadding();
        this.yRendering = y + this.getWindowYPadding();

        this.drawWindowContent(x + this.getWindowXPadding(), y + this.getWindowYPadding(), text, color, alpha, font);

        this.drawWindowTitle(x, y, width, height);
    },

    drawWindowContent: function (x, y, text, color, alpha, font) {
        var cfg = FotF_ChoiceShowExSettings;
        var maxLength = cfg.lineBreakLength;
        var format = cfg.descriptionTextFormat;
        var width = TextRenderer.getTextWidth(text, font);
        var height = TextRenderer.getTextHeight(text, font);
        var lines = 1;
        if (width > maxLength) {
            lines = Math.ceil(width / maxLength);
            width = maxLength;
            height = height * lines + cfg.lineBreakSpacingY * lines;
        }
        this._range = createRangeObject(x, y, width, height);

        var dx = 0;
        var dy = 0;

        if (this._forceArrayX !== null && typeof this._forceArrayX[this._index] === 'number') {
            dx = this._forceArrayX[this._index];
        }
        if (this._forceArrayY !== null && typeof this._forceArrayY[this._index] === 'number') {
            dy = this._forceArrayY[this._index];
        }

        //This is because drawRangeAlphaText is buggy and will often do a line
        //break when it really shouldn't.
        if (lines === 1) {
            TextRenderer.drawAlphaText(x + dx, y + dy, text, -1, color, alpha, font);
        } else {
            root.getGraphicsManager().drawTextRange(this._range.x + dx, this._range.y + dy, this._range.width, this._range.height, format, text, -1, color, alpha, font);
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

    getWindowTextUI: function () {
        return root.queryTextUI('default_window');
    },

    getWindowTitleTextUI: function () {
        return null;
    },

    getWindowTitleText: function () {
        return '';
    },

    getWindowWidth: function (index) {
        if (typeof this._forceWidths[index] === 'number') {
            return this._forceWidths[index];
        }
        return this._range !== null ? this._range.width + 2 * this.getWindowXPadding() : 0;
    },

    getWindowHeight: function (index) {
        if (typeof this._forceHeights[index] === 'number') {
            return this._forceHeights[index];
        }
        return this._range !== null ? this._range.height + 2 * this.getWindowYPadding() : 0;
    },

    getWindowXPadding: function () {
        return FotF_ChoiceShowExSettings.descriptionWindowPaddingX;
    },

    getWindowYPadding: function () {
        return FotF_ChoiceShowExSettings.descriptionWindowPaddingY;
    },

    enableWindow: function (isWindowEnabled) {
        this._isWindowEnabled = isWindowEnabled;
    },

    setDrawingMethod: function (method) {
        this._drawParentData = method;
    },

    _drawWindowInternal: function (x, y, width, height) {
        var pic = null;
        var textui = this.getWindowTextUI();

        if (textui !== null) {
            pic = textui.getUIImage();
        }

        if (pic !== null) {
            WindowRenderer.drawStretchWindow(x, y, width, height, pic);
        }
    }
});
