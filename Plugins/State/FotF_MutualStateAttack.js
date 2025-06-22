/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    Inflict the attacker with a state when they inflict a state in battle!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

With this plugin you can inflict the attacker with a state if it inflicts a
state on the target in battle. This can be any state, not just the original
state. This will only trigger, if the state procs normally.

Compatible with my dynamic state plugin!
_____________________________________________________________________________
						Seting the custom parameter
_____________________________________________________________________________

Give this custom parameter to either a "State Attack" skill or a weapon with
an optional state:

{
    mutualState: x
}

x will be the ID of the state the owner of this this skill will be inflicted
with, should the state proc on the target.
_____________________________________________________________________________
							  EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/06/22
Released

--------------------------------------------------------------------------*/

(function () {
    var FotF_CheckMutualStateAttack = AttackEvaluator.HitCritical._checkStateAttack;
    AttackEvaluator.HitCritical._checkStateAttack = function (virtualActive, virtualPassive, attackEntry) {
        var i;
        var ctrl = FotF_MutualStateControl;
        var arrP1 = ctrl.saveStateArray(attackEntry.stateArrayPassive);
        var skillArr = SkillControl.getDirectSkillArray(virtualActive.unitSelf, SkillType.STATEATTACK, '');

        FotF_CheckMutualStateAttack.call(this, virtualActive, virtualPassive, attackEntry);

        var arrP2 = ctrl.saveStateArray(attackEntry.stateArrayPassive);
        //Compare state arrays before and after combat and get new states
        var arrP = ctrl.getNewStateArray(arrP1, arrP2);

        //Check state attack skills
        for (i = 0; i < skillArr.length; i++) {
            var skill = skillArr[i].skill;
            if (skill !== null && typeof skill.custom.mutualState === 'number') {
                var state = this._getState(skill);
                //Check if array of new states matches skill's state
                //If yes, add to active unit and remove from new array to prevent doubling
                if (state !== null && arrP.indexOf(state) > -1) {
                    var mutualState = root.getBaseData().getStateList().getDataFromId(skill.custom.mutualState);
                    arrP.splice(arrP.indexOf(state), 1);
                    if (!StateControl.isStateBlocked(virtualActive.unitSelf, virtualPassive.unitSelf, mutualState)) {
                        attackEntry.stateArrayActive.push(mutualState);
                        virtualActive.stateArray.push(mutualState);
                    }
                }
            }
        }

        //Check weapon state
        if (virtualActive.weapon !== null && typeof virtualActive.weapon.custom.mutualState === 'number') {
            var state = virtualActive.weapon.getStateInvocation().getState();
            //Same here, now with the weapon's optional state
            if (state !== null && arrP.indexOf(state) > -1) {
                var mutualState = root.getBaseData().getStateList().getDataFromId(virtualActive.weapon.custom.mutualState);
                arrP.splice(arrP.indexOf(state), 1);
                if (!StateControl.isStateBlocked(virtualActive.unitSelf, virtualPassive.unitSelf, mutualState)) {
                    attackEntry.stateArrayActive.push(mutualState);
                    virtualActive.stateArray.push(mutualState);
                }
            }
        }
    };
})();

var FotF_MutualStateControl = {
    getNewStateArray: function (oldArr, newArr) {
        var i;
        var arr = [];

        for (i = 0; i < newArr.length; i++) {
            var state = newArr[i];
            if (oldArr.indexOf(state) < 0) {
                arr.push(state);
            }
        }

        return arr;
    },

    saveStateArray: function (arr) {
        var i;
        var copy = [];

        for (i = 0; i < arr.length; i++) {
            copy.push(arr[i]);
        }

        return copy;
    }
};
