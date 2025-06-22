/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			Create states that dynamically upgrade and downgrade
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

What this plugin does is make a "base state" upgrade one state into another
one. For example you could have a base Bleed state that gets inflicted
normally the first time and turns into Bleed(2) when inflicted again. This
process is infinitely repeatable, so you can stack it as much as you want!

The other feature this has is downgrading states when they expire. So to use
the previous example, Bleed(2) would go back down to Bleed(1) when it wears
off. Downgrading Bleed(4) with Bleed(2) would result in a reduction of 2
stages, so Bleed(2), if set up correctly. Same goes for upgrades.
_____________________________________________________________________________
					How to use the custom parameters
_____________________________________________________________________________

The main custom parameter you'll always use for this is "dynamicState". This
in turn has two mandatory parameters "baseStateId", which determines the ID
of the base state that has to be applied for the stacking to kick in and
"level", which determines the level of the state.
There's two optional parameters: "noDowngrade" that if set to true will not
make the state downgrade, but instead expire like before. Level 1 states
automatically expire because they can not downgrade further.
"downgradeId" if set the ID of another state will replace the original state
with that state upon expiration.

    {
        dynamicState:{
            baseStateId:0,
            level:1,
            noDowngrade:true,
            downgradeId: 17
        }
    }


_____________________________________________________________________________
						         Example
_____________________________________________________________________________

Let's use the Bleed state from the introduction as our example. The IDs of
our 3 Bleed states shall be

    Bleed(1): 0
    Bleed(2): 1
    Bleed(3): 2

So if we want the upgrade to occur when applying Bleed(1) and the downgrade
when it expires, the first state, Bleed(1), will be our base state with the
following parameters:

    {
        dynamicState:{
            baseStateId:0,          //Bleed(1) is it's own base state. The plugin needs this info.
            level:1                 //Bleed(1) is the first state in the chain of states
        }
    }

Bleed(2) should both upgrade to Bleed(3) and downgrade to Bleed(1), meaning
it's level 2:

    {
        dynamicState:{
            baseStateId:0,          //Base state still is Bleed(1) with ID 0
            level:2                 //Bleed(2) is the second state in the chain
        }
    }

Finally Bleed(3) will be the last upgrade of the bunch:

    {
        dynamicState:{
            baseStateId:0,          //Base state still is Bleed(1)
            level:3                 //Bleed(3) is the third and last state in the chain
        }
    }

_____________________________________________________________________________
						     Compatibility
_____________________________________________________________________________

No functions were overwritten :)

Compatibility with plugins that overwrite StateControl.arrangeState might
not be given.
_____________________________________________________________________________
								NICE TO KNOW
_____________________________________________________________________________

States with the same baseStateId will add/subtract their own level from
already exisiting states when applied/removed by conventional means.
Exceptions for this are effects that clear all states of a unit such as
switching maps, unit death and the "Inflict State" event command set to
"Remove All". These will remove ALL states regardless of downgrading behavior.

_____________________________________________________________________________
								EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth

  
Original Plugin Author:
Francis of the Filth
  
2025/02/04
Released

2025/02/26
Fixed mistake in downgrade logic that could potentially lead to crashes

Added new functionality to increase/decrease multiple stages of a state

2025/05/09
Reworked the entire logic to be far more intuitive and less prone to bugs

Adjusted instructions to reflect new cuspara usage

Added noDowngrade option

2025/06/14
Added downgradeId option

2025/06/22
Fixed bug that upgraded the first dynamic state instead of applying a second
one with different baseStateId

--------------------------------------------------------------------------*/

var FotF_DynamicStateSettings = {
    dynamicNumberColorIndex: 3, //Color index of the number indicating the upgrade level of the state (0-4)
    dynamicNumberAlpha: 255, //Opacity of the state level number (0-255)
    dynamicNumberOffsetX: -6, //state level number x offset (from top left corner of state icon)
    dynamicNumberOffsetY: -6 //state level number y offset (from top left corner of state icon)
};

/////////////////////////////////////////////////////////////////////////////
/////					    		Code								/////
/////////////////////////////////////////////////////////////////////////////

(function () {
    var FotF_ArrangeDynamicState = StateControl.arrangeState;
    StateControl.arrangeState = function (unit, state, increaseType) {
        var turnState = null;
        var ctrl = FotF_DynamicStateControl;
        if (ctrl.isDynamicState(state)) {
            var i, j;
            var list = unit.getTurnStateList();
            var count = list.getCount();
            var editor = root.getDataEditor();
            var stateList = root.getBaseData().getStateList();
            var cuspara = state.custom.dynamicState;
            var baseId = cuspara.baseStateId;
            var baseState = stateList.getDataFromId(baseId);
            var level = cuspara.level;
            var newState = null;

            //Check for all of unit's states if they are dynamic and have applied state as base state
            for (i = 0; i < count; i++) {
                var check = list.getData(i).getState();
                if (ctrl.isDynamicState(check) && check.custom.dynamicState.baseStateId === baseId) {
                    if (increaseType === IncreaseType.INCREASE) {
                        var oldLevel = ctrl.getLevel(check);
                        var newLevel = oldLevel + level;
                        var diff = newLevel - oldLevel;
                        for (j = diff; j > 0; j--) {
                            newState = ctrl.getStateByLevel(baseState, oldLevel + j);
                            if (newState !== null) {
                                editor.deleteTurnStateData(list, check);
                                turnState = editor.addTurnStateData(list, newState);
                                MapHpControl.updateHp(unit);
                                return turnState;
                            }
                        }
                        return turnState;
                    } else if (increaseType === IncreaseType.DECREASE) {
                        //If alternate replacement state is defined, downgrade to that
                        if (typeof check.custom.dynamicState.downgradeId === 'number') {
                            newState = stateList.getDataFromId(check.custom.dynamicState.downgradeId);
                            if (newState !== null) {
                                editor.deleteTurnStateData(list, check);
                                turnState = editor.addTurnStateData(list, newState);
                                MapHpControl.updateHp(unit);
                                return turnState;
                            }
                        }

                        var oldLevel = ctrl.getLevel(check);

                        //This is so a naturally expiring state (turn end) will instead downgrade by 1 level
                        if (level === oldLevel) {
                            level = 1;
                        }

                        var newLevel = oldLevel - level;

                        //If noDowngrade is set, level before downgrade is 1 or new level is under 1,
                        //state will be erased when it expires
                        if (check.custom.dynamicState.noDowngrade || oldLevel === 1 || newLevel < 1) {
                            return FotF_ArrangeDynamicState.call(this, unit, check, increaseType);
                        }

                        for (j = newLevel; j > 0; j--) {
                            newState = ctrl.getStateByLevel(baseState, j);
                            if (newState !== null) {
                                editor.deleteTurnStateData(list, check);
                                turnState = editor.addTurnStateData(list, newState);
                                MapHpControl.updateHp(unit);
                                return turnState;
                            }
                        }

                        return turnState;
                    }
                }
            }
        }
        return FotF_ArrangeDynamicState.call(this, unit, state, increaseType);
    };

    var FotF_DrawDynamicStateNumber = UnitSentence.State.drawUnitSentence;
    UnitSentence.State.drawUnitSentence = function (x, y, unit, weapon, totalStatus) {
        var i, state, turnState;
        var count = this._arr.length;
        var xPrev = x;
        var cfg = FotF_DynamicStateSettings;

        FotF_DrawDynamicStateNumber.call(this, x, y, unit, weapon, totalStatus);

        x = xPrev;
        x += cfg.dynamicNumberOffsetX;
        y += cfg.dynamicNumberOffsetY;

        for (i = 0; i < count; i++) {
            turnState = this._arr[i];
            state = turnState.getState();

            if (FotF_DynamicStateControl.isDynamicState(state)) {
                var value = state.custom.dynamicState.level;
                this.drawDynamicNumber(x, y, value);
            }
            x += 16;

            if ((i + 1) % 2 === 0) {
                x = xPrev;
                x += cfg.dynamicNumberOffsetX;
                y += this._unitSentenceWindow.getUnitSentenceSpaceY();
            }
        }
    };
})();

var FotF_DynamicStateControl = {
    isDynamicState: function (state) {
        return typeof state === 'object' && state !== null && typeof state.custom.dynamicState !== 'undefined' && typeof state.custom.dynamicState.baseStateId === 'number' && typeof state.custom.dynamicState.level === 'number';
    },

    getLevel: function (state) {
        if (this.isDynamicState(state)) {
            return state.custom.dynamicState.level;
        }

        return null;
    },

    getStateByLevel: function (state, level) {
        root.watchTime();

        if (!this.isDynamicState(state)) {
            return null;
        }

        var i;
        var list = root.getBaseData().getStateList();
        var baseState = list.getDataFromId(state.custom.dynamicState.baseStateId);

        for (i = 0; i < list.getCount(); i++) {
            var checkState = list.getData(i);
            if (this.isDynamicState(checkState)) {
                if (checkState.custom.dynamicState.baseStateId === baseState.getId() && checkState.custom.dynamicState.level === level) {
                    return checkState;
                }
            }
        }

        return null;
    }
};

UnitSentence.State.drawDynamicNumber = function (x, y, value) {
    var colorIndex = FotF_DynamicStateSettings.dynamicNumberColorIndex;
    var alpha = FotF_DynamicStateSettings.dynamicNumberAlpha;
    NumberRenderer.drawNumberColor(x, y, value, colorIndex, alpha);
};
