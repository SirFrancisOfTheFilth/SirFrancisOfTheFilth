/*--------------------------------------------------------------------------
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                      Customize your range panels
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

With this plugin you can customize your range panels to any image series of
your choosing. Things like animation speed and frame count can be adjusted
in the settings section

_____________________________________________________________________________
						        SETUP
_____________________________________________________________________________

First, prepare you range panel images. The individual frames need to be the
same size as your map tiles and arranged in a single image, below each other.
So, assuming default tile size of 32x32 pixels and a 12 frame animation, you
should prepare 32x384 pixel images. All images need to have the same frame
count.

The images belong into a material folder named "FotF_CustomRangePanels" (can
be changed in the settings)

The plugin can differentiate between players, enemies and allies, so each
faction can have their own panels (or the same). Also attack range panels
have their own image. To set the panel images, change the file names in the
settings section of this file to the ones of your images (with file
extension!).

_____________________________________________________________________________
						    COMPATIBILITY
_____________________________________________________________________________

No functions were overwritten :)

Range panel, map chip light and fade panel objects weren't overwritten, but
aren't passed to MapLayer.prepareMapLayer anymore, making any plugins that
modify these incompatible with this one.

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

/*-------------------------------------------------------------
                           SETTINGS
-------------------------------------------------------------*/

var FotF_CustomPanelSettings = {
    materialFolder: 'FotF_CustomRangePanels',
    playerPanels: 'player.png',
    allyPanels: 'ally.png',
    enemyPanels: 'enemy.png',
    attackPanels: 'attack.png',
    panelCount: 12,
    frameSpeed: 6
};

/*-------------------------------------------------------------
                              CODE
-------------------------------------------------------------*/

(function () {
    var FotF_OverrideRangePanels = MapLayer.prepareMapLayer;
    MapLayer.prepareMapLayer = function () {
        FotF_OverrideRangePanels.call(this);
        this._unitRangePanel = createObject(FotF_CustomRangePanel);
        this._mapChipLight = createObject(FotF_CustomMapChipLight);
    };
})();

var FotF_CustomRangePanel = defineObject(BaseObject, {
    _x: 0,
    _y: 0,
    _unit: null,
    _mapChipLight: null,
    _mapChipLightWeapon: null,
    _simulator: null,

    initialize: function () {
        this._mapChipLight = createObject(FotF_CustomMapChipLight);
        this._mapChipLightWeapon = createObject(FotF_CustomMapChipLight);

        this._simulator = root.getCurrentSession().createMapSimulator();
        // Ignore "Passable Terrains" at the panel display on the map.
        this._simulator.disableRestrictedPass();
    },

    setUnit: function (unit) {
        this._unit = unit;
        if (unit === null) {
            return;
        }

        this._x = unit.getMapX();
        this._y = unit.getMapY();

        this._setRangeData();
    },

    setRepeatUnit: function (unit) {
        this._unit = unit;
        if (unit === null) {
            return;
        }

        this._x = unit.getMapX();
        this._y = unit.getMapY();

        this._setRepeatRangeData();
    },

    moveRangePanel: function () {
        if (this._unit === null) {
            return MoveResult.CONTINUE;
        }

        this._mapChipLight.moveLight();
        this._mapChipLightWeapon.moveLight();

        return MoveResult.CONTINUE;
    },

    drawRangePanel: function () {
        if (!this._isRangeDrawable()) {
            return;
        }

        this._mapChipLight.drawLight();
        this._mapChipLightWeapon.drawLight();
    },

    isMoveArea: function (x, y) {
        var index = CurrentMap.getIndex(x, y);

        if (index === -1) {
            return false;
        }

        return this._simulator.getSimulationMovePoint(index) !== AIValue.MAX_MOVE;
    },

    getSimulator: function () {
        return this._simulator;
    },

    getUnitAttackRange: function (unit) {
        var i, item, count, rangeMetrics;
        var startRange = 99;
        var endRange = 0;
        var obj = {};

        if (unit.getUnitType() === UnitType.PLAYER) {
            // If it's the player, refer to the equipped weapon.
            item = ItemControl.getEquippedWeapon(unit);
            if (item !== null) {
                startRange = item.getStartRange();
                endRange = item.getEndRange();
            }
        } else {
            // If it's not the player, refer to the weapon which has the most range.
            count = UnitItemControl.getPossessionItemCount(unit);
            for (i = 0; i < count; i++) {
                item = UnitItemControl.getItem(unit, i);
                rangeMetrics = this._getRangeMetricsFromItem(unit, item);
                if (rangeMetrics !== null) {
                    if (rangeMetrics.startRange < startRange) {
                        startRange = rangeMetrics.startRange;
                    }
                    if (rangeMetrics.endRange > endRange) {
                        endRange = rangeMetrics.endRange;
                    }
                }
            }
        }

        obj.startRange = startRange;
        obj.endRange = endRange;
        obj.mov = this._getRangeMov(unit);

        return obj;
    },

    _isRangeDrawable: function () {
        if (this._unit === null) {
            return false;
        }

        if (PosChecker.getUnitFromPos(this._x, this._y) !== this._unit) {
            return false;
        }

        if (this._unit.isWait()) {
            return false;
        }

        return true;
    },

    _getRangeMov: function (unit) {
        var mov;

        if (unit.isMovePanelVisible()) {
            mov = ParamBonus.getMov(unit);
        } else {
            mov = 0;
        }

        return mov;
    },

    _setRangeData: function () {
        var attackRange = this.getUnitAttackRange(this._unit);
        var isWeapon = attackRange.endRange !== 0;

        if (isWeapon) {
            this._simulator.startSimulationWeapon(this._unit, attackRange.mov, attackRange.startRange, attackRange.endRange);
        } else {
            this._simulator.startSimulation(this._unit, attackRange.mov);
        }

        this._setLight(isWeapon);
    },

    _setRepeatRangeData: function () {
        var mov = ParamBonus.getMov(this._unit) - this._unit.getMostResentMov();

        this._simulator.startSimulation(this._unit, mov);
        this._setLight(false);
    },

    _setLight: function (isWeapon) {
        this._mapChipLight.setUp(this._unit, false);
        this._mapChipLight.setIndexArray(this._simulator.getSimulationIndexArray());
        if (isWeapon) {
            this._mapChipLightWeapon.setUp(this._unit, isWeapon);
            this._mapChipLightWeapon.setIndexArray(this._simulator.getSimulationWeaponIndexArray());
        } else {
            this._mapChipLightWeapon.endLight();
        }
    },

    _getRangeMetricsFromItem: function (unit, item) {
        var rangeMetrics = null;

        if (item.isWeapon()) {
            if (ItemControl.isWeaponAvailable(unit, item)) {
                rangeMetrics = StructureBuilder.buildRangeMetrics();
                rangeMetrics.startRange = item.getStartRange();
                rangeMetrics.endRange = item.getEndRange();
            }
        } else {
            if (item.getRangeType() === SelectionRangeType.MULTI && item.getFilterFlag() & UnitFilterFlag.ENEMY) {
                rangeMetrics = StructureBuilder.buildRangeMetrics();
                rangeMetrics.endRange = item.getRangeValue();
            }
        }

        return rangeMetrics;
    }
});

var FotF_CustomMapChipLight = defineObject(BaseObject, {
    _indexArray: null,
    _fadePanel: null,
    _wavePanel: null,
    _type: 0,

    initialize: function () {
        this.endLight();
        this._fadePanel = createObject(FotF_CustomFadePanel);
    },

    setUp: function (unit, isAttack) {
        this._fadePanel.setUp(unit, isAttack);
    },

    setIndexArray: function (indexArray) {
        this._indexArray = indexArray;
    },

    moveLight: function () {
        this._fadePanel.moveFadePanel();

        return MoveResult.CONTINUE;
    },

    drawLight: function () {
        var i, x, y, index;
        var count = this._indexArray.length;
        var chipWidth = GraphicsFormat.MAPCHIP_WIDTH;
        var chipHeight = GraphicsFormat.MAPCHIP_HEIGHT;
        var xScroll = root.getCurrentSession().getScrollPixelX();
        var yScroll = root.getCurrentSession().getScrollPixelY();
        var maxWidth = root.getGameAreaWidth();
        var maxHeight = root.getGameAreaHeight();

        for (i = 0; i < count; i++) {
            index = this._indexArray[i];
            x = CurrentMap.getX(index) * chipWidth - xScroll;
            y = CurrentMap.getY(index) * chipHeight - yScroll;

            if (x >= -chipWidth && y >= -chipHeight && x < maxWidth && y < maxHeight) {
                this._fadePanel.drawFadePanel(x, y);
            }
        }
    },

    endLight: function () {
        this._indexArray = [];
    }
});

var FotF_CustomFadePanel = defineObject(BaseObject, {
    _counter: null,
    _unit: null,
    _isAttack: false,
    _picPlayer: null,
    _picAlly: null,
    _picEnemy: null,
    _picAttack: null,

    initialize: function () {
        var cfg = FotF_CustomPanelSettings;

        this._counter = createObject(FotF_PanelPulseCounter);
        this._counter.setCounterInfo(cfg.panelCount, cfg.frameSpeed);
        this._picPlayer = root.getMaterialManager().createImage(cfg.materialFolder, cfg.playerPanels);
        this._picAlly = root.getMaterialManager().createImage(cfg.materialFolder, cfg.allyPanels);
        this._picEnemy = root.getMaterialManager().createImage(cfg.materialFolder, cfg.enemyPanels);
        this._picAttack = root.getMaterialManager().createImage(cfg.materialFolder, cfg.attackPanels);
    },

    setUp: function (unit, isAttack) {
        this._unit = unit;
        this._isAttack = isAttack;
    },

    moveFadePanel: function () {
        this._counter.movePulseCounter();
        return MoveResult.CONTINUE;
    },

    drawFadePanel: function (x, y) {
        var pic = this.getPanelImage();
        if (pic !== null) {
            pic.drawParts(x, y, 0, this._counter.getAnimationIndex() * GraphicsFormat.MAPCHIP_HEIGHT, GraphicsFormat.MAPCHIP_WIDTH, GraphicsFormat.MAPCHIP_HEIGHT);
        }
    },

    getPanelImage: function () {
        if (this._isAttack) {
            return this._picAttack;
        }

        if (this._unit !== null) {
            var type = this._unit.getUnitType();
        } else {
            var type = UnitType.PLAYER;
        }

        if (type === UnitType.PLAYER) {
            return this._picPlayer;
        } else if (type === UnitType.ALLY) {
            return this._picAlly;
        } else if (type === UnitType.ENEMY) {
            return this._picEnemy;
        }

        return null;
    }
});

var FotF_PanelPulseCounter = defineObject(BaseObject, {
    _counter: null,
    _index: 0,
    _arr: null,

    setCounterInfo: function (length, speed) {
        this._arr = this._createAnimationArray(length);
        this._index = 0;
        this._counter = createObject(CycleCounter);
        this._counter.setCounterInfo(speed - 2);
        this._counter.disableGameAcceleration();
    },

    _createAnimationArray: function (length) {
        var i;
        var arr1 = [];
        var arr2 = [];

        for (i = 0; i < length; i++) {
            arr1.push(i);
            arr2.push(length - i - 1);
        }

        var arr = arr1.concat(arr2);

        return arr;
    },

    movePulseCounter: function () {
        var result = this._counter.moveCycleCounter();

        if (result !== MoveResult.CONTINUE) {
            if (++this._index === this._getAnimationArray().length) {
                this._index = 0;
            }
        }

        return result;
    },

    getAnimationIndex: function () {
        var arr = this._getAnimationArray();

        return arr[this._index];
    },

    getIndex: function () {
        return this._index;
    },

    _getAnimationArray: function () {
        return this._arr;
    }
});
