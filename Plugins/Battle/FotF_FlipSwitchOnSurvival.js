/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            FLIP A SWITCH WHEN A UNIT SURVIVES WITH A SKILL
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This plugin makes it possible to track if a unit survives by using a survival
skill. If this happens, a switch specified in the unit's custom parameters 
is flipped on.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

Give the unit the following custom parameter:

    {
        survivalSwitch: x
    }

where x is the ID of the map's local switch to turn on.

If you want it to be a global switch instead, add the parameter
"isSurvivalSwitchGlobal: true" like this:

    {
        survivalSwitch: x,
        isSurvivalSwitchGlobal: true
    }

This is entirely optional. The switch type will default to local if not set.
_____________________________________________________________________________
						    Compatibility
_____________________________________________________________________________

No functions were overwritten :)

Does not work with avoid type survival skills in conjunction with damage
inflicted by event commands/items.
_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2026/07/29
Released

--------------------------------------------------------------------------*/

(function () {
    var FotF_FlipSwitchOnSurvivalAttack = AttackEvaluator.PassiveAction._getSurvivalValue;
    AttackEvaluator.PassiveAction._getSurvivalValue = function (virtualActive, virtualPassive, attackEntry) {
        var value = FotF_FlipSwitchOnSurvivalAttack.call(this, virtualActive, virtualPassive, attackEntry);
        var passive = virtualPassive.unitSelf;

        if (value !== -1) {
            var switchId = passive.custom.survivalSwitch;
            var isGlobal = passive.custom.isSurvivalSwitchGlobal;

            if (typeof switchId !== 'number') {
                return value;
            }

            if (isGlobal) {
                var table = root.getMetaSession().getGlobalSwitchTable();
            } else {
                var table = root.getCurrentSession().getCurrentMapInfo().getLocalSwitchTable();
            }

            var index = table.getSwitchIndexFromId(switchId);
            table.setSwitch(index, true);

            return value;
        }
    };

    var FotF_FlipSwitchOnSurvivalCommand = DamageHitEventCommand._isSurvival;
    DamageHitEventCommand._isSurvival = function (damageData) {
        var isSurvival = FotF_FlipSwitchOnSurvivalCommand.call(this, damageData);
        var unit = damageData.targetUnit;

        if (isSurvival) {
            var switchId = unit.custom.survivalSwitch;
            var isGlobal = unit.custom.isSurvivalSwitchGlobal;

            if (typeof switchId !== 'number') {
                return isSurvival;
            }

            if (isGlobal) {
                var table = root.getMetaSession().getGlobalSwitchTable();
            } else {
                var table = root.getCurrentSession().getCurrentMapInfo().getLocalSwitchTable();
            }

            var index = table.getSwitchIndexFromId(switchId);
            table.setSwitch(index, true);

            return isSurvival;
        }
    };
})();
