/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                Have custom message voice sounds for every unit
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This plugin allows you to override the normal message voice sound when the
unit/NPC talking has the custom parameters

{
    messageSoundId: x,
    messageSoundIsRuntime: false
}

where messageSoundId is the ID of a sound in Resources > Media > Sound and
messageSoundIsRuntime is true for RTP sounds and false for original ones.

_____________________________________________________________________________
						         Setup
_____________________________________________________________________________

Prepare and import the sound you want to use (if it's not already) and set
the custom parameters from above to the unit or NPC, replacing x with the
sound ID and false with true if it's an RTP sound (otherwise keep false).

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

2025/11/11
Released

--------------------------------------------------------------------------*/

(function () {
    var FotF_InsertCustomMessageSound = BaseMessageView._createMessageAnalyzerParam;
    BaseMessageView._createMessageAnalyzerParam = function (messageViewParam) {
        var messageAnalyzerParam = FotF_InsertCustomMessageSound.call(this, messageViewParam);

        var soundHandle = null;

        if (messageViewParam.unit !== null && typeof messageViewParam.unit.custom.messageSoundId === 'number' && typeof messageViewParam.unit.custom.messageSoundIsRuntime === 'boolean') {
            soundHandle = root.createResourceHandle(messageViewParam.unit.custom.messageSoundIsRuntime, messageViewParam.unit.custom.messageSoundId, 0, 0, 0);
        } else if (messageViewParam.npc !== null && typeof messageViewParam.npc.custom.messageSoundId === 'number' && typeof messageViewParam.npc.custom.messageSoundIsRuntime === 'boolean') {
            soundHandle = root.createResourceHandle(messageViewParam.npc.custom.messageSoundIsRuntime, messageViewParam.npc.custom.messageSoundId, 0, 0, 0);
        }

        if (soundHandle !== null) {
            messageAnalyzerParam.voiceSoundHandle = soundHandle;
        }

        return messageAnalyzerParam;
    };
})();
