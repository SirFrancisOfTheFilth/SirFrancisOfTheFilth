/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      Triple Pursuit? Quadruple Pursuit ??? QUINTUPLE PURSUIT ?!?!?!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Yes you heard right! As many rounds of pursuit as you want. You can even
adjust how many times the pursuit modifier is needed per stage of extended
pursuit.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

It's really quite simple this time. If you want this to apply only to units
possessing a custom skill, fill out the skill keyword in the settings below
(default is ExtendedPursuit). If you want it to apply to all units, specify
a blank string ('').

The maximum number of extra pursuits (beyond 2, so starting at tripling) is
determined by the pursuitMultipliers array in the settings. Each number in
there is multiplied with the pursuit value and checked against the difference
in agility.


Example:

Unit A has 16 speed, Unit B has 3 speed. The pursuit value is 5 and the
pursuitMultipliers are [2, 4]. To double, as usual, Unit A would need at
least 5 speed more than Unit B, which it has. Now to triple, Unit a would
need 2 * 5 = 10 speed more, which it also has. For quadrupling, 4 times the
pursuit value (4 * 5 = 20) is needed, which Unit A does not possess over
Unit B. So in this case, even though quadrupling is technically allowed,
Unit A is only fast enough for tripling.

_____________________________________________________________________________
						    Overwritten functions
_____________________________________________________________________________

None :)

_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/08/05
Released

--------------------------------------------------------------------------*/

var FotF_ExtendedPursuitSettings = {
    customKeyword: 'ExtendedPursuit', //Custom keyword for skill required to extend pursuit, '' to always allow, even without skill
    pursuitMultipliers: [2, 4] //Multipliers for pursuit value. Extend this array if you want to enable quadrupling, ...
    //First value is for tripling, second for quadrupling, and so on.
};

(function () {
    //Modify round count
    var FotF_CheckExtendedPursuit = VirtualAttackControl._calculateAttackAndRoundCount;
    VirtualAttackControl._calculateAttackAndRoundCount = function (virtualAttackUnit, isAttack, targetUnit) {
        FotF_CheckExtendedPursuit.call(this, virtualAttackUnit, isAttack, targetUnit);
        var weapon;

        if (isAttack && typeof virtualAttackUnit.roundCount === 'number') {
            weapon = virtualAttackUnit.weapon;
            virtualAttackUnit.roundCount += this.extendPursuit(virtualAttackUnit.unitSelf, targetUnit, weapon);
        }
    };

    //Check for skill activation
    var FotF_AppendExtendedPursuitSkill = SkillRandomizer.isCustomSkillInvokedInternal;
    SkillRandomizer.isCustomSkillInvokedInternal = function (active, passive, skill, keyword) {
        if (keyword !== '' && keyword === FotF_ExtendedPursuitSettings.customKeyword) {
            return SkillRandomizer._isSkillInvokedInternal(active, passive, skill);
        }

        return FotF_AppendExtendedPursuitSkill.call(this, active, passive, skill, keyword);
    };
})();

//Just so this doesn't clutter the aliased function
VirtualAttackControl.extendPursuit = function (active, passive, weapon) {
    if (!Calculator.isRoundAttackAllowed(active, passive)) {
        return 0;
    }

    var i;
    var keyword = FotF_ExtendedPursuitSettings.customKeyword;
    var tresholds = FotF_ExtendedPursuitSettings.pursuitMultipliers;
    var skill = SkillControl.getPossessionCustomSkill(active, keyword);
    var isPursuit = false;
    var bonusRounds = 0;

    if (keyword === '') {
        isPursuit = true;
    }

    if (skill !== null) {
        var isInvocation = SkillRandomizer.isCustomSkillInvoked(active, passive, skill, keyword);
        if (isInvocation) {
            isPursuit = true;
        }
    }

    if (isPursuit) {
        var activeAgi = AbilityCalculator.getAgility(active, weapon) + Calculator.getAgilityPlus(active, passive, weapon);
        var passiveAgi = AbilityCalculator.getAgility(passive, ItemControl.getEquippedWeapon(passive));
        var value = Calculator.getDifference();

        for (i = 0; i < tresholds.length; i++) {
            var value = Calculator.getDifference() * tresholds[i];
            if (activeAgi - passiveAgi >= value) {
                bonusRounds++;
            } else {
                break;
            }
        }
    }

    return bonusRounds;
};
