/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Apply states to the fusion child when they are released!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

With this plugin you can apply any number of states to the fusion child when
the fusion ends. It works with both event canceling and manual canceling.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

You need to set two objects in your fusion's custom parameters:

{
    fusionEndStates: [12, 420],
    fusionEndPercentage: [100, 69]
}

The first, fusionEndStates, is the IDs of all the states you want to apply.
The second, fusionEndPercentage are the percentage probabilities in percent
corresponding to the states from the first array.

So in this example, the state with ID 12 will always be applied, while the
state with ID 420 will only be applied with a probability of 69%.

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
    var FotF_ApplyFusionEndState = ReleaseFusionAction._doReleaseAction;
    ReleaseFusionAction._doReleaseAction = function () {
        var data = FusionControl.getFusionData(this._parentUnit);
        var child = FusionControl.getFusionChild(this._parentUnit);

        FotF_ApplyFusionEndState.call(this);

        if (data !== null && typeof data.custom.fusionEndStates === 'object' && typeof data.custom.fusionEndStates.length === 'number' && typeof data.custom.fusionEndPercentage === 'object' && typeof data.custom.fusionEndPercentage.length === 'number') {
            var i;
            var arr = data.custom.fusionEndStates;
            var arr2 = data.custom.fusionEndPercentage;
            var generator = root.getEventGenerator();

            for (i = 0; i < arr.length; i++) {
                var invocation = root.createStateInvocation(arr[i], arr2[i], InvocationType.ABSOLUTE);
                generator.unitStateAddition(child, invocation, IncreaseType.INCREASE, this._parentUnit, false);
            }

            generator.execute();
        }
    };
})();
