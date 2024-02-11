/*--------------------------------------------------------------------------
Tired of players skipping your very important conversations and missing out
on important story information? Or do you want to have cinematic cutscenes
with music matching to what is happening and fast-forwarding would ruin them?

Then this is the plugin for you!

This plugin disables fast-forwarding and turning to the next page in messages
if they have the auto-advance control character \at in them until the timer
of said control character hits 0.

This behaviour can be turned on and off using a global switch. Simply change
the value of FotF_DisableSkipSwitch in line  to the ID of your global switch.

That means, apart from the "skip" operation that skips the whole event, there
is no way for the player to accelerate or skip the message.


Example:

Let's say you wanted the first message to be skippable and not auto-advancing.
It would look something like this:

"This is the first message. You can skip and fast-forward it."

But then you want your second message to last 5 seconds and be unskippable.
First you'd have to turn on the global switch specified earlier.
Secondly, your message has to contain the auto-advance control character \at.
So after enabling the switch, your message would look like this:

"\at[300]This message is important, so it will persist for 5 seconds and be unskippable."		<-- \at[300] means 300 ticks at 60 fps, resulting in 5 seconds (this is the same for 30 fps, no need to halve it).

Then if you want a third message to have auto-advance after 3 seconds, but this
time you want it to be skippable, just turn off the switch before the message and
still use \at:

"\at[180]This message is timed, but less important, you may skip it."							<-- This message will then be fast-forwardable with the "system" and "cancel" keys, but will only end after 3 seconds.


Tip: If you want to hinder players from skipping the whole event, there is
a plugin on SRPG World that pops up a decision box, prompting the player to
confirm the skip. It's called skip_chk_window.


If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @francisofthefilth


Original Plugin Author:
Francis of the Filth
  
Plugin History:
2024/02/11
Released
--------------------------------------------------------------------------*/

(function () {
	
	var FotF_DisableSkipSwitch = 39			//ID of the global switch to disable skipping, can be changed. Setting it to -1 will disable this feature altogether. Switch on --> Skipping disabled (auto forward still works)

	var FotF_DisableSkipping = MessageAnalyzer._isPageChange;
	MessageAnalyzer._isPageChange= function() {
		
		var switchTable = root.getMetaSession().getGlobalSwitchTable();
		var switchIndex = switchTable.getSwitchIndexFromId(FotF_DisableSkipSwitch);
		
		if (switchTable.isSwitchOn(switchIndex) === true) {
		}
		
		if (this._waitChain.isAutoMode()) {
			
			if (this._waitChain.isPageAutoChange()) {
				// Auto wait has been ended, so switch a page.
				return true;
			}
		}
		
		if (switchTable.isSwitchOn(switchIndex) === false && !this._waitChain.isAutoMode()) {
			
			if (InputControl.isSelectAction()) {
				return true;
			}
			
			if (InputControl.isCancelState()) {
				return true;
			}
			
			if (InputControl.isSystemState()) {
				return true;
			}
		} else {
			return false;
		}
		
		FotF_DisableSkipping.call(this);
	};
	
	var FotF_UnifyScrollSpeed = ScrollTextView.getBlockInterval;
	ScrollTextView.getBlockInterval = function() {
		
		var switchTable = root.getMetaSession().getGlobalSwitchTable();
		var switchIndex = switchTable.getSwitchIndexFromId(FotF_DisableSkipSwitch);
		
		if (switchTable.isSwitchOn(switchIndex) === true && MessageAnalyzer._waitChain.isAutoMode() && !MessageAnalyzer._waitChain.isPageAutoChange()) {
			n = 2.5
			return n;
		}
		FotF_UnifyScrollSpeed.call(this);
	};

	var FotF_DisableSystemKey = InputControl.isSystemState;
	InputControl.isSystemState = function() {
		var switchTable = root.getMetaSession().getGlobalSwitchTable();
		var switchIndex = switchTable.getSwitchIndexFromId(FotF_DisableSkipSwitch);
		if (MessageAnalyzer._waitChain !== null) {
			if (switchTable.isSwitchOn(switchIndex) === true && MessageAnalyzer._waitChain.isAutoMode() && !MessageAnalyzer._waitChain.isPageAutoChange()) {
				return false;
			}
		}
		FotF_DisableSystemKey.call(this);
	};
})();