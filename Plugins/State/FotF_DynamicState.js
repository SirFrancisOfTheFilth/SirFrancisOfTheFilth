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
in turn has one mandatory parameter "baseStateId", which determines the ID
of the base state that has to be applied for the stacking to kick in. Then
there are two optional parameters "upgradeStateId" and "downgradeStateId",
which handle which ID state the state with these parameters will upgrade or
downgrade to:

    {
        dynamicState:{
            baseStateId:0,
            behaveAsBaseState:0,
            upgradeStateId:2,
            downgradeStateId:1,
            level:1,
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
when it expires the first state, Bleed(1), will be our base state with the
following parameters:

    {
        dynamicState:{
            baseStateId:0,          //Bleed(1) is it's own base state. The plugin needs this info.
            upgradeStateId:1,       //Upgrades to Bleed(2), no downgrade option, so it disappears on expire
            level:1                 //Optional, shows a little number indicating the state's stage
        }
    }

Bleed(2) should both upgrade to Bleed(3) and downgrade to Bleed(1), so it's
parameters should look like this:

    {
        dynamicState:{
            baseStateId:0,          //Base state still is Bleed(1)
            behaveAsBaseState:0,    //This lets the plugin know this behaves the same way as it's base state Bleed(1)
            skipStages:2,           //Makes the state increase/decrease 2 stages instead of 1 when applied/forcefully removed
            upgradeStateId:2,       //Upgrades to Bleed(3)
            downgradeStateId:0,     //Downgrades to Bleed(1) again if it expires
            level:2
        }
    }

Finally Bleed(3) will be the last upgrade of the bunch:

    {
        dynamicState:{
            baseStateId:0,          //Base state still is Bleed(1)
            behaveAsBaseState:0,    //This lets the plugin know this behaves the same way as it's base state Bleed(1)
            skipStages:3,           //Makes the state increase/decrease 3 stages instead of 1 when applied/forcefully removed
            downgradeStateId:1      //Downgrades to Bleed(2), no upgrade since it's the last one
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

If a state expires or is cured without a state with behaveAsBaseState/skipStages,
it will only be downgraded one level. Exceptions for this are effects that
clear all states of a unit such as switching maps, unit death and the
"Inflict State"event command set to "Remove All". These will remove ALL
states regardless of downgrading behavior.

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
        if (typeof state === 'object' && state !== null && typeof state.custom.dynamicState !== 'undefined') {
            var cuspara = state.custom.dynamicState;

            //Check if base state ID is valid and matches with ID of applied state
            if (typeof cuspara.baseStateId !== 'number' && typeof cuspara.behaveAsBaseState !== 'number') {
                return turnState;
            }

            var i, j;
            var list = unit.getTurnStateList();
            var count = list.getCount();
            var editor = root.getDataEditor();
            var stateList = root.getBaseData().getStateList();

            //Check for all of unit's states if they are dynamic and have applied state as base state
            for (i = 0; i < count; i++) {
                var check = list.getData(i);
                var checkCuspara = check.getState().custom.dynamicState;
                if (typeof checkCuspara !== 'undefined' && checkCuspara.hasOwnProperty('baseStateId')) {
                    if (increaseType === IncreaseType.INCREASE && typeof checkCuspara.upgradeStateId === 'number' && (checkCuspara.baseStateId === state.getId() || checkCuspara.baseStateId === cuspara.behaveAsBaseState)) {
                        var skip = 1;
                        if (typeof cuspara.skipStages === 'number') {
                            skip = cuspara.skipStages;
                        }
                        if (count <= DataConfig.getMaxStateCount()) {
                            for (j = 0; j < skip; j++) {
                                if (typeof checkCuspara.upgradeStateId !== 'number' || (checkCuspara.baseStateId !== state.getId() && checkCuspara.baseStateId !== cuspara.behaveAsBaseState)) {
                                    continue;
                                }
                                var newState = stateList.getDataFromId(checkCuspara.upgradeStateId);
                                checkCuspara = newState.custom.dynamicState;
                            }
                            editor.deleteTurnStateData(list, check.getState());
                            turnState = editor.addTurnStateData(list, newState);
                            MapHpControl.updateHp(unit);
                            return turnState;
                        }
                        return FotF_ArrangeDynamicState.call(this, unit, state, increaseType);
                    } else if (increaseType === IncreaseType.DECREASE && typeof checkCuspara.downgradeStateId === 'number' && (checkCuspara.baseStateId === state.getId() || checkCuspara.baseStateId === cuspara.behaveAsBaseState)) {
                        var skip = 1;
                        if (typeof cuspara.skipStages === 'number') {
                            skip = cuspara.skipStages;
                        }
                        if (count <= DataConfig.getMaxStateCount()) {
                            var newState = stateList.getDataFromId(checkCuspara.downgradeStateId);
                            for (j = 0; j < skip; j++) {
                                //If base state is reduced, delete it and return null
                                if (typeof checkCuspara.downgradeStateId !== 'number' || (checkCuspara.baseStateId !== state.getId() && checkCuspara.baseStateId !== cuspara.behaveAsBaseState)) {
                                    editor.deleteTurnStateData(list, check.getState());
                                    MapHpControl.updateHp(unit);
                                    return null;
                                }
                                var newState = stateList.getDataFromId(checkCuspara.downgradeStateId);
                                checkCuspara = newState.custom.dynamicState;
                            }
                            editor.deleteTurnStateData(list, check.getState());
                            turnState = editor.addTurnStateData(list, newState);
                            MapHpControl.updateHp(unit);
                            return turnState;
                        } else {
                            return FotF_ArrangeDynamicState.call(this, unit, state, increaseType);
                        }
                    } else if (increaseType === IncreaseType.DECREASE && (checkCuspara.baseStateId === state.getId() || checkCuspara.baseStateId === cuspara.behaveAsBaseState)) {
                        editor.deleteTurnStateData(list, check.getState());
                        MapHpControl.updateHp(unit);
                        return null;
                    } else {
                        return FotF_ArrangeDynamicState.call(this, unit, state, increaseType);
                    }
                } else {
                    return FotF_ArrangeDynamicState.call(this, unit, state, increaseType);
                }
            }
            if (typeof cuspara.behaveAsBaseState === 'number') {
                var baseState = stateList.getDataFromId(cuspara.behaveAsBaseState);
                var checkCuspara = baseState.custom.dynamicState;
                var skip = 1;
                if (typeof cuspara.skipStages === 'number') {
                    skip = cuspara.skipStages - 1;
                }
                if (count <= DataConfig.getMaxStateCount()) {
                    for (j = 0; j < skip; j++) {
                        if (typeof checkCuspara.upgradeStateId !== 'number' || (checkCuspara.baseStateId !== state.getId() && checkCuspara.baseStateId !== cuspara.behaveAsBaseState)) {
                            continue;
                        }
                        var newState = stateList.getDataFromId(checkCuspara.upgradeStateId);
                        checkCuspara = newState.custom.dynamicState;
                    }
                    turnState = editor.addTurnStateData(list, newState);
                    MapHpControl.updateHp(unit);
                    return turnState;
                }
            }
            return FotF_ArrangeDynamicState.call(this, unit, state, increaseType);
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

            if (typeof state === 'object' && state !== null && typeof state.custom.dynamicState !== 'undefined' && typeof state.custom.dynamicState.level === 'number') {
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

UnitSentence.State.drawDynamicNumber = function (x, y, value) {
    var colorIndex = FotF_DynamicStateSettings.dynamicNumberColorIndex;
    var alpha = FotF_DynamicStateSettings.dynamicNumberAlpha;
    NumberRenderer.drawNumberColor(x, y, value, colorIndex, alpha);
};
