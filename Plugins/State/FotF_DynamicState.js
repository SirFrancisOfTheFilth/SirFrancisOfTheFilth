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
off.
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
            upgradeStateId:2,
            downgradeStateId:1
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
            upgradeStateId:1        //Upgrades to Bleed(2), no downgrade option, so it disappears on expire
        }
    }

Bleed(2) should both upgrade to Bleed(3) and downgrade to Bleed(1), so it's
parameters should look like this:

    {
        dynamicState:{
            baseStateId:0,          //Base state still is Bleed(1)
            upgradeStateId:2,       //Upgrades to Bleed(3)
            downgradeStateId:0      //Downgrades to Bleed(1) again if it expires
        }
    }

Finally Bleed(3) will be the last upgrade of the bunch:

    {
        dynamicState:{
            baseStateId:0,          //Base state still is Bleed(1)
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

Dynamic states will only upgrade once per application. So if you want to
upgrade a state by more than one level, you simply have to apply it multiple
times. Similarily downgrading will also occur only once if the state expires
or is cured by other means. The only exceptions for this are effects that
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

--------------------------------------------------------------------------*/

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
            if (typeof cuspara.baseStateId !== 'number') {
                return turnState;
            }

            var i;
            var list = unit.getTurnStateList();
            var count = list.getCount();
            var editor = root.getDataEditor();
            var stateList = root.getBaseData().getStateList();

            //Check for all of unit's states if they are dynamic and have applied state as base state
            for (i = 0; i < count; i++) {
                var check = list.getData(i);
                var checkCuspara = check.getState().custom.dynamicState;
                if (typeof checkCuspara !== 'undefined' && checkCuspara.hasOwnProperty('baseStateId')) {
                    if (increaseType === IncreaseType.INCREASE && typeof checkCuspara.upgradeStateId === 'number' && checkCuspara.baseStateId === state.getId()) {
                        if (count <= DataConfig.getMaxStateCount()) {
                            var newState = stateList.getDataFromId(checkCuspara.upgradeStateId);
                            editor.deleteTurnStateData(list, check.getState());
                            turnState = editor.addTurnStateData(list, newState);
                            MapHpControl.updateHp(unit);
                            return turnState;
                        }
                    } else if (increaseType === IncreaseType.DECREASE && typeof checkCuspara.downgradeStateId === 'number' && check.getState().getId() === state.getId()) {
                        if (count <= DataConfig.getMaxStateCount()) {
                            var newState = stateList.getDataFromId(checkCuspara.downgradeStateId);
                            editor.deleteTurnStateData(list, check.getState());
                            turnState = editor.addTurnStateData(list, newState);
                            MapHpControl.updateHp(unit);
                            return turnState;
                        }
                    } else {
                        return FotF_ArrangeDynamicState.call(this, unit, state, increaseType);
                    }
                } else {
                    return FotF_ArrangeDynamicState.call(this, unit, state, increaseType);
                }
            }
            return FotF_ArrangeDynamicState.call(this, unit, state, increaseType);
        }
        return FotF_ArrangeDynamicState.call(this, unit, state, increaseType);
    };
})();
