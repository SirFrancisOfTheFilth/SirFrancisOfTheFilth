/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    A skill to add or reduce exp on hit
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This plugin lets you create a skill that increases or reduces the target's
exp when they are hit in battle by the skill user. Of course this only makes
sense as a skill for enemies, since only players have exp.

If a player's exp are reduced below 0, they will level down, using their 
growths to determine the stats lost (Basically just a reverse level up).

The plugin also solves the issue of "overleveling" with more than 100 or less
than -100 exp. For example a level 4 unit with 40 exp that is hit 3 times with
an attack that steals 60 exp, will level down to level 2 with 60 exp. Of
course this also works in the positive direction as well.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

Simply create a skill and give it the custom parameter

    {
        expDownAttack: x
    }

where x is the amount of exp to add/drain with each attack. THE NUMBER HAS TO BE
NEGATIVE TO DRAIN EXP, OTHERWISE IT WILL GRANT EXP INSTEAD!

So a skill with the custom parameter

    {
        expDownAttack: -10
    }

will deduct 10 exp from the target on hit.

You can of course also make the attack grant exp by simply specifying a 
positive number.
_____________________________________________________________________________
						    Compatibility
_____________________________________________________________________________

Overwritten functions:

    - Miscellaneous.isExperienceEnabled
	- RealExperienceFlowEntry._changeLevelAnime
	- ExperienceControl._addExperience
	- ExperienceControl.obtainExperience
	- RestrictedExperienceControl.obtainExperience

Compatibility with other exp behavior modifying plugins might not be given.
This is a delicate plugin, because the exp/level system wasn't designed to be
reversible at all. This is why there are quite a few overrides to functions.
_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2026/06/22
Released

--------------------------------------------------------------------------*/

/*-------------------------------------------------------------
                           SETTINGS
-------------------------------------------------------------*/

var FotF_NegativeExpSettings = {
	expLostString: "Exp lost!", //Text to display instead of "Exp gained!" when losing exp
	levelDownAnimeId: 0, //ID of the level down animation
	levelDownAnimeRuntime: false //true if level down animation is RTP, false otherwise
};

/*-------------------------------------------------------------
                            CODE
-------------------------------------------------------------*/

(function () {
	//Check skill activation and push value to attackEntry
	FotF_CheckExpDownSkill = AttackEvaluator.HitCritical._checkStateAttack;
	AttackEvaluator.HitCritical._checkStateAttack = function (virtualActive, virtualPassive, attackEntry) {
		FotF_CheckExpDownSkill.call(this, virtualActive, virtualPassive, attackEntry);

		var i;
		var list = FotF_SkillWrapper.getCusparaSkillListFromUnit(virtualActive.unitSelf, "expDownAttack");
		var value = 0;

		if (typeof attackEntry.negativeExp !== "number") {
			attackEntry.negativeExp = 0;
		}

		if (virtualPassive.unitSelf.getUnitType() !== UnitType.PLAYER) {
			return;
		}

		for (i = 0; i < list.getCount(); i++) {
			var skill = list.getData(i);

			if (!SkillRandomizer._isSkillInvokedInternal(virtualActive.unitSelf, virtualPassive.unitSelf, skill)) {
				continue;
			}

			if (skill.isSkillDisplayable()) {
				attackEntry.skillArrayActive.push(skill);
			}

			value += skill.custom.expDownAttack;
		}

		attackEntry.negativeExp += value;
	};

	//Reduce exp if negative exp are present in attackEntry
	var FotF_ApplyNegativeBattleExp = NormalAttackOrderBuilder._calculateExperience;
	NormalAttackOrderBuilder._calculateExperience = function (virtualActive, virtualPassive) {
		var exp = FotF_ApplyNegativeBattleExp.call(this, virtualActive, virtualPassive);
		var unitSrc = this._attackInfo.unitSrc;
		var unitDest = this._attackInfo.unitDest;
		var isDisabled = this._isExperienceDisabled();
		var isPlayerActive = unitSrc.getUnitType() === UnitType.PLAYER && virtualActive.hp > 0;
		var isPlayerPassive = unitDest.getUnitType() === UnitType.PLAYER && virtualPassive.hp > 0;

		//This is because it would return -1 to signal no exp are given out, which would clash with this plugin
		if (isDisabled || (!isPlayerActive && !isPlayerPassive)) {
			return 0;
		}

		return exp;
	};

	//Overwrite to allow negative values. No sense in aliasing this
	Miscellaneous.isExperienceEnabled = function (unit, exp) {
		if (unit === null) {
			return false;
		}

		//Max level reached and exp is positive --> no exp gained
		if (unit.getLv() === Miscellaneous.getMaxLv(unit) && exp >= 0) {
			return false;
		}

		//Min level and no exp --> no exp subtracted
		if (unit.getLv() === 0 && unit.getExp() === 0) {
			return false;
		}

		return true;
	};

	ExperienceControl.obtainExperience = function (unit, getExp) {
		var i, j, growthArray;
		var levelCount = 0;
		var cumulativeGrowths = [];
		var currentExp = unit.getExp();
		var currentLevel = unit.getLv();
		var baselineExp = DefineControl.getBaselineExperience();
		var totalExp = currentExp + (currentLevel - 1) * baselineExp + getExp;
		var projectedLevel = Math.floor(totalExp / baselineExp) + 1;

		if (!ExperienceControl._addExperience(unit, getExp)) {
			return null;
		}

		if (getExp < 0) {
			var levelCount = currentLevel - projectedLevel;

			for (i = 0; i < levelCount; i++) {
				if (unit.getUnitType() === UnitType.PLAYER) {
					growthArray = this._createGrowthArray(unit);
				} else {
					growthArray = this._createCusotmGrowthArray(unit);
				}

				var reverseGrowths = this._reverseGrowthArray(growthArray);

				for (j = 0; j < reverseGrowths.length; j++) {
					var oldValue = typeof cumulativeGrowths[j] === "number" ? cumulativeGrowths[j] : 0;
					cumulativeGrowths.splice(j, 1, oldValue + reverseGrowths[j]);
				}
			}
		} else {
			var levelCount = projectedLevel - currentLevel;

			for (i = 0; i < levelCount; i++) {
				if (unit.getUnitType() === UnitType.PLAYER) {
					growthArray = this._createGrowthArray(unit);
				} else {
					growthArray = this._createCusotmGrowthArray(unit);
				}

				for (j = 0; j < growthArray.length; j++) {
					var oldValue = typeof cumulativeGrowths[j] === "number" ? cumulativeGrowths[j] : 0;
					cumulativeGrowths.splice(j, 1, oldValue + growthArray[j]);
				}
			}
		}

		return cumulativeGrowths;
	};

	RestrictedExperienceControl.obtainExperience = function (unit, getExp) {
		var i, j, count, objectArray;
		var sum = 0;
		var levelCount = 0;
		var cumulativeGrowths = [];
		var currentExp = unit.getExp();
		var currentLevel = unit.getLv();
		var baselineExp = DefineControl.getBaselineExperience();
		var totalExp = currentExp + (currentLevel - 1) * baselineExp + getExp;
		var projectedLevel = Math.floor(totalExp / baselineExp) + 1;

		if (!ExperienceControl._addExperience(unit, getExp)) {
			return null;
		}

		if (getExp < 0) {
			var levelCount = currentLevel - projectedLevel;

			for (i = 0; i < levelCount; i++) {
				objectArray = this._createObjectArray(unit);
				count = objectArray.length;
				for (j = 0; j < count; j++) {
					if (objectArray[j].value !== 0) {
						// Count the number of grown parameters.
						sum++;
					}
				}

				objectArray = this._sortObjectArray(objectArray, sum, unit);
				var reverseGrowths = this._reverseGrowthArray(this._getGrowthArray(objectArray));

				for (j = 0; j < reverseGrowths.length; j++) {
					var oldValue = typeof cumulativeGrowths[j] === "number" ? cumulativeGrowths[j] : 0;
					cumulativeGrowths.splice(j, 1, oldValue + reverseGrowths[j]);
				}
			}

			return cumulativeGrowths;
		} else {
			var levelCount = projectedLevel - currentLevel;

			for (i = 0; i < levelCount; i++) {
				objectArray = this._createObjectArray(unit);
				count = objectArray.length;
				for (j = 0; j < count; j++) {
					if (objectArray[j].value !== 0) {
						// Count the number of grown parameters.
						sum++;
					}
				}

				objectArray = this._sortObjectArray(objectArray, sum, unit);
				var growthArray = this._getGrowthArray(objectArray);

				for (j = 0; j < growthArray.length; j++) {
					var oldValue = typeof cumulativeGrowths[j] === "number" ? cumulativeGrowths[j] : 0;
					cumulativeGrowths.splice(j, 1, oldValue + growthArray[j]);
				}
			}

			return cumulativeGrowths;
		}
	};

	//I modified this so it can accept negative values as well as positive ones
	//and so it does not fuck up if you gain/lkose more than 100 exp at once
	ExperienceControl._addExperience = function (unit, getExp) {
		var baselineExp = DefineControl.getBaselineExperience();
		var totalExp = unit.getExp() + (unit.getLv() - 1) * baselineExp + getExp;
		if (totalExp < 0) {
			totalExp = 0;
		}
		var currentLevel = unit.getLv();
		var level = Math.floor(totalExp / baselineExp) + 1;
		var rest = totalExp > 0 ? totalExp % baselineExp : 0;

		if (level < 1) {
			rest = 0;
			level = 1;
		}

		if (rest < 0 || rest >= baselineExp) {
			rest = 0;
		}

		unit.setExp(rest);

		//No level up/down occured
		if (level === currentLevel) {
			return false;
		}

		unit.setLv(level);

		return true;
	};

	var FotF_ShowNegativeExp1 = ExperienceNumberView._drawExp;
	ExperienceNumberView._drawExp = function (x, y) {
		if (this._exp < 0) {
			var pos;
			var textui = this._getTitleTextUI();
			var color = textui.getColor();
			var font = textui.getFont();
			var pic = textui.getUIImage();
			var width = TitleRenderer.getTitlePartsWidth();
			var height = TitleRenderer.getTitlePartsHeight();
			var count = this._getTitlePartsCount();
			var exp = this._balancer.getCurrentValue();

			TitleRenderer.drawTitle(pic, x, y, width, height, count);

			pos = this._getExpPos();
			TextRenderer.drawSignText(x + pos.x - 6, y + pos.y - 6, "-");
			NumberRenderer.drawAttackNumber(x + pos.x, y + pos.y, exp);

			pos = this._getTextPos();
			TextRenderer.drawText(x + pos.x, y + pos.y, FotF_NegativeExpSettings.expLostString, -1, color, font);
		} else {
			FotF_ShowNegativeExp1.call(this, x, y);
		}
	};

	var FotF_ShowNegativeExp2 = ExperienceNumberView.setExperienceNumberData;
	ExperienceNumberView.setExperienceNumberData = function (unit, exp) {
		if (exp < 0) {
			var max;

			if (exp === 1) {
				// Even if the obtained exp is 1, play the sound.
				max = 0;
			} else {
				max = 2;
			}

			this._unit = unit;
			this._exp = exp;

			exp *= -1;

			this._balancer = createObject(SimpleBalancer);
			this._balancer.setBalancerInfo(0, 100);
			this._balancer.setBalancerSpeed(10);
			this._balancer.startBalancerMove(exp);

			this._counter = createObject(CycleCounter);
			this._counter.setCounterInfo(max);
			this.changeCycleMode(ExperienceNumberMode.COUNT);
		} else {
			FotF_ShowNegativeExp2.call(this, unit, exp);
		}
	};

	var FotF_AdjustAttackOrderExp = AttackOrder.getExp;
	AttackOrder.getExp = function () {
		return FotF_AdjustAttackOrderExp.call(this) + this._getNegativeExpValue();
	};

	var FotF_ChangeLevelDownAnimeEasy = EasyExperienceFlowEntry._createLevelupViewParam;
	EasyExperienceFlowEntry._createLevelupViewParam = function () {
		var levelupViewParam = FotF_ChangeLevelDownAnimeEasy.call(this);

		var x = LayoutControl.getPixelX(this._unit.getMapX());
		var y = LayoutControl.getPixelY(this._unit.getMapY());
		var cfg = FotF_NegativeExpSettings;
		var anime = root.getBaseData().getEffectAnimationList(cfg.levelDownAnimeRuntime).getDataFromId(cfg.levelDownAnimeId);

		if (anime !== null) {
			var pos = LayoutControl.getMapAnimationPos(x, y, anime);

			levelupViewParam.xAnime = pos.x;
			levelupViewParam.yAnime = pos.y;
			levelupViewParam.anime = anime;
		}

		return levelupViewParam;
	};

	//Overwrite to not double animations for real battle
	RealExperienceFlowEntry._changeLevelAnime = function () {
		var cfg = FotF_NegativeExpSettings;
		var animeData = root.getBaseData().getEffectAnimationList(cfg.levelDownAnimeRuntime).getDataFromId(cfg.levelDownAnimeId);

		if (animeData === null) {
			animeData = root.queryAnime("reallevelup");
		}

		var isRight = true;
		var battleObject = this._coreAttack.getBattleObject();
		var battler = battleObject.getBattler(isRight);

		if (battler.getUnit() !== this._unit) {
			isRight = false;
			battler = battleObject.getBattler(isRight);
		}

		var pos = battler.getEffectPos(animeData);
		this._effect = battleObject.createEffect(animeData, pos.x, pos.y, isRight, false);

		this.changeCycleMode(RealExperienceMode.ANIME);
	};
})();

ExperienceControl._reverseGrowthArray = function (arr) {
	var i;
	var arr2 = [];
	for (i = 0; i < arr.length; i++) {
		var growth = arr[i];
		arr2.push(growth * -1);
	}

	return arr2;
};

AttackOrder._getNegativeExpValue = function () {
	var i;
	var value = 0;
	var arr = this._attackEntryArray;

	for (i = 0; i < arr.length; i++) {
		var entry = arr[i];
		if (typeof entry.negativeExp === "number") {
			value += entry.negativeExp;
		}
	}

	return value;
};
