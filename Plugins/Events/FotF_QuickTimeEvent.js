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

    - forceOption:  Index of the self switch to flip if the timer runs out
                    (0 is A, 1 is B and so on).

    - duration:     Duration in ticks (60 ticks = 1s) of the timer.

    - isTwoLines:   Whether the choices should be shown in two lines or one.
                    True for two lines, false for one.

    - choiceArray:  An array containing the choice texts, determines choice
                    count.

    - switchArray:  An array containing the indices of the self switches to
                    be flipped by the choices in choiceArray. Same count and
                    order as the options in choice array.

Optional:

    - timerX:       X offset of the timer window from default position.

    - timerY:       Y offset of the timer window from default position.

    - timerColorIndex : Color Index determining the color of the timer.
                        Goes from 0-4 and is equal to the rows of
                        UI/bignumber

    - timerAlpha:   Opacity of the timer (0-255).

    - iconHandleArray:  An array of arrays describing the handle parameters
                        for the drawing of icons for the choices. Same count
                        and order as the options in choice array.
                        See example for further instructions.

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
    sTwoLines: false,                                       //Display in one line
    choiceArray: ["Choice 1", "Choice 2", "Choice 3"],      //Text needs to be strings (in "")
    switchArray: [0, 1, 2]                                  //Translates to self switches A, B and C
}

Now if you wanna get fancy and customize this a bit more, you can add some
optional arguments in here:

{
    forceOption: 3,
    duration: 300,
    sTwoLines: false,
    choiceArray: ["Choice 1", "Choice 2", "Choice 3"],
    switchArray: [0, 1, 2],
    timerX: 60,                                             //Timer window will be drawn 60 pixels to the right of default
    timery: -40,                                            //Timer window will be drawn 40 pixels upwards of default
    timerColorIndex: 3,                                     //Timer number will be rendered red (if default bignumber image is used)
    timerAlpha: 127,                                        //Timer number will be half transparent
    iconHandleArray: [[true, 0, 0, 1, 12], [true, 0, 0, 2, 12], [true, 0, 0, 3, 12]]    //[isRuntime, ID of icon image, always 0, xSrc of icon, ySrc of icon]
}

isRuntime is true if it's an RTP image, false if original. ID is the ID of
the icon image sheet to be used and xSrc/ySrc are the grid coordinates
(starting with 0/0) of the icon on the sheet.

_____________________________________________________________________________
								EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/01/19
Released

--------------------------------------------------------------------------*/

/////////////////////////////////////////////////////////////////////////////
/////							SETTINGS								/////
/////////////////////////////////////////////////////////////////////////////

var FotF_QuickTimeSettings = {
    eventName: 'QuickTimeEvent',
    defaultTimerX: 0,
    defaultTimerY: -64,
    defaultTimerColorIndex: 0,
    defaultTimerAlpha: 155,
    timerWindowWidth: 48,
    timerWindowHeight: 48,
    timerWindowXPadding: 16,
    timerWindowYPadding: 12
};

/////////////////////////////////////////////////////////////////////////////
/////								CODE								/////
/////////////////////////////////////////////////////////////////////////////

var FotF_MouseControl = {
    setMousePos: function (x, y) {
        root.setMousePos(x, y);
    },

    changeMousePos: function (x, y) {
        var mx = root.getMouseX();
        var my = root.getMouseY();
        this.setMousePos(mx - x, my - y);
    }
};

(function () {
    var FotF_AppendQuickTimeEvent = ScriptExecuteEventCommand._configureOriginalEventCommand;
    ScriptExecuteEventCommand._configureOriginalEventCommand = function (groupArray) {
        FotF_AppendQuickTimeEvent.call(this, groupArray);
        groupArray.appendObject(FotF_QuickTimeEvent);
    };
})();

var FotF_QuickTimeEvent = defineObject(BaseEventCommand, {
    _scrollbar: null,
    _messageArray: null,
    _switchArray: null,
    _counter: null,
    _args: null,
    _timerWindow: null,

    enterEventCommandCycle: function () {
        this._prepareEventCommandMemberData();

        if (!this._checkEventCommand()) {
            return EnterResult.NOTENTER;
        }

        return this._completeEventCommandMemberData();
    },

    moveEventCommandCycle: function () {
        var input = this._scrollbar.moveInput();
        var result = this._counter.moveCycleCounter();

        if (input === ScrollbarInput.SELECT) {
            this._selectItem(this._scrollbar.getIndex());
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
        var cfg = FotF_QuickTimeSettings;
        var x = LayoutControl.getCenterX(-1, this._scrollbar.getScrollbarWidth());
        var y = LayoutControl.getCenterY(-1, this._scrollbar.getScrollbarHeight());
        var timerX = LayoutControl.getCenterX(-1, cfg.timerWindowWidth);
        var timerY = y;

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

        this._scrollbar.drawScrollbar(x, y);
        this._drawTimer(timerX, timerY);
    },

    _drawTimer: function (x, y) {
        var tick = this._counter.getCounter();
        var maxTicks = this._args.duration;
        var ticksLeft = maxTicks - tick;
        var time = Math.floor(ticksLeft / 60);
        var cfg = FotF_QuickTimeSettings;
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
        this._timerWindow = createObject(FotF_TimerWindow);
        this._counter = createObject(CycleCounter);
        this._counter.setCounterInfo(this._args.duration);
        this._messageArray = [];
        this._switchArray = [];
        this._isTwoLines = this._args.isTwoLines;

        this._resetPreviousSelfSwitches();

        this._setScrollbarData(this._args);

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
        return FotF_QuickTimeSettings.eventName;
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
        return FotF_QuickTimeSettings.timerWindowWidth;
    },

    getWindowHeight: function () {
        return FotF_QuickTimeSettings.timerWindowHeight;
    },

    getWindowXPadding: function () {
        return FotF_QuickTimeSettings.timerWindowXPadding;
    },

    getWindowYPadding: function () {
        return FotF_QuickTimeSettings.timerWindowYPadding;
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
