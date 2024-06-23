/*--------------------------------------------------------------------------

Tired of players skipping through your well-orchestrated cinematic cutscenes
with matching music, ruining the tone of your story entirely? Or are you
simply a sadist and hate it when your players are able to skip your boring
dialogues? Either way, this is the plugin for you!

___________________________________________________________________________
So how does it work?
___________________________________________________________________________

This plugin introduces 2 functions you can run via "Execute Script":

	- FotF_DisableSkipping
	
		This stops the player from skipping through events. More exactly,
		it sets the Skip Control config setting to "ALL", meaning skipping
		is disallowed entirely. Also, while this is in effect, the system
		key (the one for fast-forwarding) is disabled.
		
		
	- FotF_EnableSkipping
	
		Reverts everything done in the previous function.
		
___________________________________________________________________________
How to use
___________________________________________________________________________

The intended use case is during events. To disable skipping, create an
Execute Script event command with "Execute Code" checked and write the
following into the prompt:

	FotF_DisableSkipping();
	
This will disable skipping and fast forward until it is re-enabled or
until the next start.

To re-enable skipping, do the same with this function:

	FotF_EnableSkipping();
	
This will instantly re-enable skipping and fast-forward

___________________________________________________________________________
Worth Knowing
___________________________________________________________________________
While skipping is disabled, you can't skip anything. Also the SYSTEM KEY
is disabled altogether, so remember to re-enable it.

This plugin works well with the skip_chk_window plugin by nina_sakureil.
While skipping is disabled by this plugin, the check window won't appear.

___________________________________________________________________________
Version History
___________________________________________________________________________

If you have any questions about this unnecessarily complex plugin, feel free to
reach out to me over the SRPG Studio University Discord server @francisofthefilth


Original Plugin Author:
Francis of the Filth
  
Plugin History:
2024/06/23
Released

--------------------------------------------------------------------------*/


var FotF_SavedSkipSetting = null;

var FotF_DisableSkipping = function () {
	
	FotF_SavedSkipSetting = root.getMetaSession().getDefaultEnvironmentValue(20);
	root.getExternalData().env.FotF_SkipSetting = FotF_SavedSkipSetting;
	root.getMetaSession().setDefaultEnvironmentValue(20, 0);
};

var FotF_EnableSkipping = function () {
	
	if (FotF_SavedSkipSetting !== null){
		root.getMetaSession().setDefaultEnvironmentValue(20, FotF_SavedSkipSetting);
	}
	FotF_SavedSkipSetting = null;
	root.getExternalData().env.FotF_SkipSetting = FotF_SavedSkipSetting;
};

(function () {
	
	var FotF_SetupSkipSetting = ScriptCall_Setup;
	ScriptCall_Setup = function () {
		
		if (typeof root.getExternalData().env.FotF_SkipSetting === 'number') {
			FotF_SavedSkipSetting = root.getExternalData().env.FotF_SkipSetting;
			root.getMetaSession().setDefaultEnvironmentValue(20, FotF_SavedSkipSetting);
			root.log('Skip setting loaded: ' + FotF_SavedSkipSetting);
			FotF_SavedSkipSetting = null;
		} else {
			FotF_SavedSkipSetting = null;
			root.log('Skip setting created: ' + FotF_SavedSkipSetting);
		}
		
		FotF_SetupSkipSetting.call(this);
	};
	
	var FotF_DisableSystemKey = InputControl.isSystemState;
	InputControl.isSystemState = function () {
		
		if (FotF_SavedSkipSetting !== null) {
			return false;
		} else {
			return root.isInputState(InputType.BTN7);
		}
	};
	
	
	var FotF_DisableEventSkip = EventCommandController.moveEventCommandControllerCycle;
	EventCommandController.moveEventCommandControllerCycle = function(eventContainer) {
		
		if (FotF_SavedSkipSetting !== null) {
			var result, exitCode;
			
			// If the skip key is pressed, it ends to execute the main processing (mainEventCommand) at that event.
			// However, check if it allows to skip by calling isEventCommandSkipAllowed.
			if (eventContainer.isEventCommandSkipAllowed() && !MessageViewControl.isBacklog() && (InputControl.isStartAction() || root.isEventSkipMode())) {
				exitCode = eventContainer.mainEventCommand();
				this._doEventSkipAction();
				root.endEventCommand(exitCode);
				return MoveResult.END;
			}
			
			result = eventContainer.moveEventCommandCycle();
			if (result === MoveResult.END) {
				// Show that the event ended.
				this.endEventCommand(EventResult.OK);
			}
			
			return result;
		} else {
			FotF_DisableEventSkip.call(this, eventContainer);
		}
	};
	
})();