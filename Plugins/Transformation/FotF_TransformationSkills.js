/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                Transform skills during transformations!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Did you know transformations can temporarily transform a unit's items?
Pretty cool, huh? SO WHY THE FUCK DOESN'T IT HAVE THAT FOR SKILLS?!

Is what I though, so I made this plugin. As the name implies, when a unit
transforms using a transformation with certain custom parameters, select
skills are removed and replaced with other skills. Of course the change is
reverted when the transformation ends.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

You need to set two objects in your transformations's custom parameters:

{
    transformSkillsSrc: [6, 69],
    transformSkillsDest: [0, 1337]
}

IDs of skills that should be replaced during transformation go into
transformSkillsSrc and their replacements go into transformSkillsDest.
Both arrays should have the same amount of skills.

The plugin checks if a source skill is present and only replaces in that case.
So you won't get skills you don't have the "prerequisite" for.

_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/05/27
Released

--------------------------------------------------------------------------*/

(function () {
    var FotF_TranformTransformationSkills = MetamorphozeControl.startMetamorphoze;
    MetamorphozeControl.startMetamorphoze = function (unit, metamorphozeData) {
        if (!this.isMetamorphozeAllowed(unit, metamorphozeData)) {
            return false;
        }

        if (this.verifySkillCuspara(metamorphozeData)) {
            this.transformSkills(unit, metamorphozeData, false);
        }

        return FotF_TranformTransformationSkills.call(this, unit, metamorphozeData);
    };

    var FotF_RecoverTransformationSkills = MetamorphozeControl.clearMetamorphoze;
    MetamorphozeControl.clearMetamorphoze = function (unit) {
        var data = this.getMetamorphozeData(unit);

        if (this.verifySkillCuspara(data)) {
            this.transformSkills(unit, data, true);
        }

        FotF_RecoverTransformationSkills.call(this, unit);
    };
})();

MetamorphozeControl.verifySkillCuspara = function (metamorphozeData) {
    return metamorphozeData !== null && typeof metamorphozeData.custom.transformSkillsSrc === 'object' && typeof metamorphozeData.custom.transformSkillsSrc.length === 'number' && typeof metamorphozeData.custom.transformSkillsDest === 'object' && typeof metamorphozeData.custom.transformSkillsDest.length === 'number';
};

MetamorphozeControl.transformSkills = function (unit, data, isReverse) {
    var i;

    if (isReverse) {
        var arrOut = data.custom.transformSkillsDest;
        var arrIn = data.custom.transformSkillsSrc;
    } else {
        var arrOut = data.custom.transformSkillsSrc;
        var arrIn = data.custom.transformSkillsDest;
    }

    for (i = 0; i < arrOut.length; i++) {
        var skillOut = root.getBaseData().getSkillList().getDataFromId(arrOut[i]);
        var skillIn = root.getBaseData().getSkillList().getDataFromId(arrIn[i]);

        if (this.isSkillSwapValid(unit, skillOut)) {
            SkillChecker.arrangeSkill(unit, skillOut, IncreaseType.DECREASE);
            SkillChecker.arrangeSkill(unit, skillIn, IncreaseType.INCREASE);
        }
    }
};

MetamorphozeControl.isSkillSwapValid = function (unit, skill) {
    var i;
    var arr = SkillControl.getDirectSkillArray(unit, -1, '');

    for (i = 0; i < arr.length; i++) {
        var check = arr[i].skill;
        if (check.getId() === skill.getId()) {
            return true;
        }
    }

    return false;
};
