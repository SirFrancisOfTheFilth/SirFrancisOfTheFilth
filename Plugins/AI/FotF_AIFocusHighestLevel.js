/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            	   Have AI target high level players
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This practically plug-and-play plugin makes enemy AI with a certain custom
AI pattern focus high level targets. The scoring can be adjusted in the
settings section.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

Simply give the enemy a custom AI pattern with one of these two keywords:

	highLevel

		Focuses the highest level enemy and will approach when no enemies
		are in range. Short paths are still considered more beneficial than
		focusing a target.


	highLevelRng

		Only attacks when targets are in range and tries to focus the highest
		level one from those.

_____________________________________________________________________________
						    Compatibility
_____________________________________________________________________________

No functions were overwritten :)

Incompatible if BaseCombinationCollector._checkTargetScore is overwritten
somewhere else.
_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2026/06/13
Released

--------------------------------------------------------------------------*/

/*-------------------------------------------------------------
                           SETTINGS
-------------------------------------------------------------*/

var FotF_AILevelFocusSettings = {
	scorerStrength: 100, //This value controls how strongly player level plays into target selection. Higher values --> stronger focus (the value is multiplied by the level)
	keywordApproach: "highLevel", //Keyword to focus high level targets and approach at any range. Will attack the highest level target IN RANGE. If no target is in range, runs to highest level target.
	keywordRange: "highLevelRng" //Keyword to only attack if in range. Still focuses high level players, but only the ones reachable.
};

/*-------------------------------------------------------------
                             CODE
-------------------------------------------------------------*/

(function () {
	var FotF_CheckTargetScoreLevel = BaseCombinationCollector._checkTargetScore;
	BaseCombinationCollector._checkTargetScore = function (unit, targetUnit) {
		var pattern = unit.getAIPattern();
		var type = pattern.getPatternType();
		var score = FotF_CheckTargetScoreLevel.call(this, unit, targetUnit);
		var cfg = FotF_AILevelFocusSettings;

		if (type === PatternType.CUSTOM) {
			var keyword = pattern.getCustomKeyword();
			if (keyword === cfg.keywordApproach || keyword === cfg.keywordRange) {
				score += cfg.scorerStrength * targetUnit.getLv();
			}
		}

		root.log(targetUnit.getName() + ": " + score);

		return score;
	};

	var FotF_BuildLevelFocusAction = AutoActionBuilder.buildCustomAction;
	AutoActionBuilder.buildCustomAction = function (unit, autoActionArray, keyword) {
		var cfg = FotF_AILevelFocusSettings;

		if (keyword === cfg.keywordApproach || keyword === cfg.keywordRange) {
			root.log("keyword detected");
			this.buildHighLevelApproachAction(unit, autoActionArray, keyword);
		}

		return FotF_BuildLevelFocusAction.call(this, unit, autoActionArray, keyword);
	};
})();

AutoActionBuilder.buildHighLevelApproachAction = function (unit, autoActionArray, keyword) {
	var combination;
	var cfg = FotF_AILevelFocusSettings;

	// Get the best combination in the unit who can attack from the current position.
	var combination = CombinationManager.getApproachCombination(unit, true);

	if (combination === null) {
		// Search the opponent to widen the range because no unit who can be attacked from the current position exists.
		// However, before that, check if the attack within a range was set.
		if (keyword === cfg.keywordRange) {
			// Do nothing because attack is set only within a range.
			// There is no problem because it has already checked that it's impossible to attack within a range.
			return this._buildEmptyAction();
		} else {
			// Get which enemy to be targeted because there is no opponent who can be attacked at the current position.
			combination = CombinationManager.getEstimateCombination(unit);
			if (combination === null) {
				return this._buildEmptyAction();
			} else {
				// Set the target position to move.
				this._pushMove(unit, autoActionArray, combination);

				// Set it so as to wait after move.
				this._pushWait(unit, autoActionArray, combination);
			}
		}
	} else {
		this._pushGeneral(unit, autoActionArray, combination);
	}

	return true;
};
