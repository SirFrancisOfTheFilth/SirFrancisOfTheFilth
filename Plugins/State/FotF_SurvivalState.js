/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            Make units survive a single instance of damage
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This plugin lets you create a state that prevents a unit from being killed
just once and is then removed. The damage can either be reduced so the unit
survives on 1 HP or the attack/damage misses altogether, depending on the
value of the custom parameter given to the state.

This needs FotF_StateWrapper.js as a dependency.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

Create a state and give it the custom parameter

    {
        survival: SurvivalValue.SURVIVAL
    }

to make the unit survive on 1 HP.

Changing the value to

    {
        survival: SurvivalValue.AVOID
    }

instead will make the next lethal attack or damage command miss.

_____________________________________________________________________________
						    Compatibility
_____________________________________________________________________________

No functions were overwritten :)
_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2026/05/16
Released

--------------------------------------------------------------------------*/

(function () {
    var FotF_CheckSurvivalStateAttack = AttackEvaluator.PassiveAction._getSurvivalValue;
    AttackEvaluator.PassiveAction._getSurvivalValue = function (virtualActive, virtualPassive, attackEntry) {
        var survivalValue = FotF_CheckSurvivalStateAttack.call(this, virtualActive, virtualPassive, attackEntry);

        //Already surviving because unit is immortal or has survival skill, so don't use up state
        if (survivalValue !== -1) {
            return survivalValue;
        }

        var i;
        var passive = virtualPassive.unitSelf;
        var list = FotF_StateWrapper.getCusparaStateList(passive, 'survival');

        for (i = 0; i < list.getCount(); i++) {
            var state = list.getData(i);
            if (state !== null) {
                //Save state to remove it only when attack actually happens
                attackEntry.surviveStatePassive = state;
                return state.custom.survival;
            }
        }

        return -1;
    };

    var FotF_RemoveSurvivalStateAttack = AttackFlow._doAttackAction;
    AttackFlow._doAttackAction = function () {
        FotF_RemoveSurvivalStateAttack.call(this);
        var order = this._order;
        var attackEntry = order.getCurrentEntry();
        var passive = order.getPassiveUnit();

        if (typeof attackEntry.surviveStatePassive === 'object') {
            StateControl.arrangeState(passive, attackEntry.surviveStatePassive, IncreaseType.DECREASE);
        }
    };

    var FotF_CheckSurvivalStateCommand1 = DamageHitEventCommand._isHit;
    DamageHitEventCommand._isHit = function (damageData) {
        var isHit = FotF_CheckSurvivalStateCommand1.call(this, damageData);

        //Already surviving because unit is immortal or has survival skill, so don't use up state
        if (!isHit) {
            return isHit;
        }

        var targetUnit = damageData.targetUnit;
        var hp = targetUnit.getHp() - damageData.damage;

        if (hp <= 0) {
            var list = FotF_StateWrapper.getCusparaStateList(targetUnit, 'survival');

            for (i = 0; i < list.getCount(); i++) {
                var state = list.getData(i);
                if (state !== null && state.custom.survival === SurvivalValue.AVOID) {
                    StateControl.arrangeState(targetUnit, state, IncreaseType.DECREASE);
                    return false;
                }
            }
        }

        return true;
    };

    var FotF_CheckSurvivalStateCommand2 = DamageHitEventCommand._isSurvival;
    DamageHitEventCommand._isSurvival = function (damageData) {
        var isSurvival = FotF_CheckSurvivalStateCommand2.call(this, damageData);

        //Already surviving because unit is immortal or has survival skill, so don't use up state
        if (isSurvival) {
            return isSurvival;
        }

        var targetUnit = damageData.targetUnit;
        var hp = targetUnit.getHp() - damageData.damage;

        if (hp <= 0) {
            var list = FotF_StateWrapper.getCusparaStateList(targetUnit, 'survival');

            for (i = 0; i < list.getCount(); i++) {
                var state = list.getData(i);
                if (state !== null && state.custom.survival === SurvivalValue.SURVIVAL) {
                    StateControl.arrangeState(targetUnit, state, IncreaseType.DECREASE);
                    return true;
                }
            }
        }

        return false;
    };
})();
