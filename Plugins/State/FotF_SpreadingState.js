/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    Make states spread at turn start!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

With this plugin you can create states that spread to surrounding units at
the start of an "infected" unit's turn.
It's possible to adjust the spread range and chance, as well as apply a unit
type filter (e.g. only opposing army) and a skill requirement for the
spreader unit.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

The custom parameter for the state looks like this:

{
    spreadState: {
        range: 1,                               //range the state can spread
        armyFilter: UnitFilterFlag.ENEMY,       //can be PLAYER, ALLY, ENEMY or OPTIONAL (these are reversed for enemies, so ENEMY always means opposing army, OPTIONAL is all)
        chance: 20,                             //chance to spread in percent
        requiresSkill: false                    //whether the spreading requires a skill
    }
}

If you want the state to spread only from units that have a certain skill,
create a custom skill and set the keyword to "SpreadState x", where x is the
ID of the state the skill allows to spread. So "SpreadState 69" will allow
a unit to spread the state with ID 69. The custom keyword can be changed in
the settings of this file.

_____________________________________________________________________________
					   When does it spread exactly?
_____________________________________________________________________________

The spread occurs directly after state turn counters tick down, so a state
that is about to expire, will expire before it can spread. This is to help
prevent infinite spreading.

_____________________________________________________________________________
						       Compatibility
_____________________________________________________________________________

No function were overwritten :)

Compatibility with plugins that modify StateControl.decreaseTurn can not be
guaranteed.

_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/08/23
Released

--------------------------------------------------------------------------*/

var FotF_SpreadStateSettings = {
    keyword: 'SpreadState' //custom keyword for spreading skill, use as "SpreadState x" where x is the ID of the state to spread
};

(function () {
    var FotF_SpreadState = StateControl.decreaseTurn;
    StateControl.decreaseTurn = function (list) {
        FotF_SpreadState.call(this, list);

        var i, j, k;
        var ctrl = FotF_SpreadStateControl;
        var count = list.getCount();

        for (i = 0; i < count; i++) {
            var unit = list.getData(i);
            var list2 = unit.getTurnStateList();
            var count2 = list2.getCount();
            for (j = 0; j < count2; j++) {
                var state = list2.getData(j).getState();
                if (ctrl.verifyCuspara(state) && ctrl.isSkill(unit, state)) {
                    var custom = state.custom.spreadState;
                    var indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), 1, custom.range);

                    for (k = 0; k < indexArray.length; k++) {
                        var index = indexArray[k];
                        var x = CurrentMap.getX(index);
                        var y = CurrentMap.getY(index);
                        var targetUnit = PosChecker.getUnitFromPos(x, y);

                        if (targetUnit !== null) {
                            var type = targetUnit.getUnitType();
                            var invocation = root.createStateInvocation(state.getId(), custom.chance, InvocationType.ABSOLUTE);
                            if (FilterControl.isBestUnitTypeAllowed(unit.getUnitType(), type, custom.armyFilter) && !StateControl.isStateBlocked(targetUnit, unit, state) && Probability.getInvocationProbability(unit, invocation.getInvocationType(), invocation.getInvocationValue())) {
                                this.arrangeState(targetUnit, state, IncreaseType.INCREASE);
                            }
                        }
                    }
                }
            }
        }
    };
})();

var FotF_SpreadStateControl = {
    verifyCuspara: function (state) {
        return typeof state.custom.spreadState === 'object' && this.verifyParamaeters(state.custom.spreadState);
    },

    verifyParamaeters: function (custom) {
        return typeof custom.range === 'number' && typeof custom.armyFilter === 'number' && typeof custom.chance === 'number';
    },

    isSkill: function (unit, state) {
        if (!state.custom.spreadState.requiresSkill) {
            return true;
        }

        var keyword = FotF_SpreadStateSettings.keyword + ' ' + state.getId().toString();
        root.log(keyword);

        if (SkillControl.getPossessionCustomSkill(unit, keyword)) {
            return true;
        }

        return false;
    }
};
