/*-----------------------------------------------------------------------------

Plug-and-play. Disables hiding message boxes entirely.

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2025/12/17
Released

-----------------------------------------------------------------------------*/

(function () {
    MessageViewControl.isHidden = function () {
        return false;
    };
})();
