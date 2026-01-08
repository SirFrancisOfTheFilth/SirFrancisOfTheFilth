/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                  Give your maps non-interactable borders
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This plugin allows you to set the custom parameter

{
    mapEdges: x
}

to your map's custom parameters. This will create a border zone of x tiles
around the map's edges that units are prohibited from walking on. The map
simulation (movement and range tiles) also respects this border and the map
cursor can't enter it as well (no terrain info window on border tiles).

x has to be a whole, positive number.

_____________________________________________________________________________
						    Compatibility
_____________________________________________________________________________

No functions were overwritten :)

This uses root.getCurrentSession().setMapBoundaryValue(), which is used when
the option to prohibit entry to map edges is enabled. Therefore, this value
(which is 1 by default) is overwritten for those maps that have the custom
parameter of this plugin.

_____________________________________________________________________________
								 EPILOGUE
_____________________________________________________________________________

If you have any questions about this plugin, feel free to reach out to me
over the SRPG Studio University Discord server @SirFrancisoftheFilth
  
Original Plugin Author:
Francis of the Filth

2026/01/02
Released

--------------------------------------------------------------------------*/

(function () {
    var FotF_AdjustMapEdges = CurrentMap._checkMapBoundaryValue;
    CurrentMap._checkMapBoundaryValue = function (isEnabled) {
        var mapInfo = root.getCurrentSession().getCurrentMapInfo();
        var isSet = false;

        if (mapInfo !== null && isEnabled) {
            var edgeValue = mapInfo.custom.mapEdges;
            if (typeof edgeValue === 'number') {
                root.getCurrentSession().setMapBoundaryValue(edgeValue);
                isSet = true;
            }
        }

        if (!isSet) {
            FotF_AdjustMapEdges.call(this, isEnabled);
        }
    };

    var FotF_LimitMouseCursorOnEdges = MouseControl._adjustMapCursor;
    MouseControl._adjustMapCursor = function () {
        var session = root.getCurrentSession();
        var mapInfo = session.getCurrentMapInfo();
        var edges = root.getCurrentSession().getMapBoundaryValue();
        var isAlias = true;

        if (mapInfo !== null) {
            var xMin = edges;
            var yMin = edges;
            var xMax = mapInfo.getMapWidth() - edges - 1;
            var yMax = mapInfo.getMapHeight() - edges - 1;
            var xCursor = Math.floor((root.getMouseX() + session.getScrollPixelX() - root.getViewportX()) / GraphicsFormat.MAPCHIP_WIDTH);
            var yCursor = Math.floor((root.getMouseY() + session.getScrollPixelY() - root.getViewportY()) / GraphicsFormat.MAPCHIP_HEIGHT);
            if (xCursor < xMin || xCursor > xMax || yCursor < yMin || yCursor > yMax) {
                isAlias = false;
            }
        }

        if (isAlias) {
            FotF_LimitMouseCursorOnEdges.call(this);
        }
    };
})();
