/*--------------------------------------------------------------------------
With this plugin water or other reflective surfaces can have mirror images of units!

___________________________________________________________________________
So how does it work?
___________________________________________________________________________

Simply give the mapchip tile the custom parameter "mirror".

mirror:1 			will render the mirror image below the unit (e.g. a water surface)
mirror:2 			will render the mirror image above the unit (e.g. a glass facade)

"mirror:1" will render a 180° turned image of the unit (upside down)
"mirror:2" will render the opposite side of the unit (back if unit is facing front and vice versa)


The custom parameter "mirrorAlpha" sets the opacity of the mirror image (0-255).

mirrorAlpha:0		full transparency, no (visible) mirror image will be rendered
mirrorAlpha:127		half transparency, the mirror image will be half-transparent
mirrorAlpha:255		full opacity, the mirror image will be fully opaque (like the unit)

"mirrorAlpha" is optional. If it's not specified, 255 alpha (full opacity) will be used.

___________________________________________________________________________
Examples
___________________________________________________________________________

A water surface that reflects units positioned 1-2 tiles above it with half transparency:

The water tile will have the following custom parameters:

{
mirror:1
mirrorAlpha:127
}



A big mirror mounted on the wall that reflects units positioned 1-2 tiles below it
with 3/4 transparency:

The mirror tile will have the following custom parameters:

{
mirror:2
mirrorAlpha:191
}

___________________________________________________________________________
Tips and tricks :)
___________________________________________________________________________

It normaly looks unnatural and confusing if mirror images are fully opaque like
the unit they represent. Try making them partially transparent. For example water
reflections work well with 1/4 opacity (mirrorAlpha:63) while actual mirrors
look better with a bit more opacity (mirrorAlpha:127).

This plugin is designed to work well with my unlimited layers plugin (FotF_UnlimitedLayers v2.js).
If you want only a part of a mapchip to be reflective, simply overlay the non-reflective part
as an additional tile over the first one using the unlimited layers plugin. This works
with normal tiles as well as third layer tiles.

Some charchips overlap on other tiles on the x-Axis. This can lead to mirror images
being out of bounds of the mirror tile. To counter this you can also use the
unlimited layers plugin to render a normal (or third, depends) layer tile over
tiles left and right of the mirror like this.

A W W W W A				A = additional layer tile, same as the one it would be anyways (in this case grass)
A W W W W A				W = water (reflective)
G G G G G G				G = grass

___________________________________________________________________________
Version History
___________________________________________________________________________

If you have any questions about this unnecessarily complex plugin, feel free to
reach out to me over the SRPG Studio University Discord server @francisofthefilth


Original Plugin Author:
Francis of the Filth
  
Plugin History:
2023/08/01
Released

2024/05/19
Fixed a modified unitRenderParam being passed to drawScrollUnit, leading to
weird rendering bugs, for example in easy battle.

Made the mirror lag image array splicing actually use the right arrays for
enemies and allies.

2024/08/11
Fixed (hopefully all) crashes involving weird unit positioning. I double triple
quadruple check for shit now.

Cleaned up the plugin a bit, added a draw function to be referenced.

2025/01/26
Made the draw function use cached images, huge performance increase especially
with many units on the map.

Cleaned up the plugin a bit more

2025/02/25
Cleaned up the plugin even more under object FotF_MirrorControl.

Re-wrote the drawing function and added additional logic to draw only
the parts of the charchip that overlap with the mirror tile.
  
--------------------------------------------------------------------------*/

var CharchipMapchipDivision = {
    width: (GraphicsFormat.CHARCHIP_WIDTH - GraphicsFormat.MAPCHIP_WIDTH) / 2,
    height: (GraphicsFormat.CHARCHIP_HEIGHT - GraphicsFormat.MAPCHIP_HEIGHT) / 2
};

var CharchipSectorType = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
    i: 8,
    j: 9,
    k: 10,
    l: 11
};

StructureBuilder.buildMirrorImageRenderParam = function () {
    return {
        type: null,
        xDest: 0,
        yDest: 0,
        xSrc: 0,
        ySrc: 0,
        width: 0,
        height: 0,
        isReverse: false,
        isFlipped: false,
        isRotated: false
    };
};

var FotF_MirrorCacheArray1 = null;
var FotF_MirrorCacheArray2 = null;
var FotF_isMirrorLagImageVisiblePlayer = [];
var FotF_isMirrorLagImageVisibleEnemy = [];
var FotF_isMirrorLagImageVisibleAlly = [];
(function () {
    //Define mirror cache array as array
    var FotF_SetupMirrorCacheArray = CurrentMap.prepareMap;
    CurrentMap.prepareMap = function () {
        FotF_SetupMirrorCacheArray.call(this);
    };

    var FotF_PrepareMirrorCacheArray = MapLayer.prepareMapLayer;
    MapLayer.prepareMapLayer = function () {
        FotF_PrepareMirrorCacheArray.call(this);
        //FotF_UpdateMirrorCacheArray();
    };

    //drawScrollUnit alias to draw mirror images while units are moving
    var FotF_MirrorImage = UnitRenderer.drawScrollUnit;
    UnitRenderer.drawScrollUnit = function (unit, x, y, unitRenderParam) {
        FotF_MirrorControl.drawMirrorImageMoving(unit, x, y, unitRenderParam);
        FotF_MirrorImage.call(this, unit, x, y, unitRenderParam);
    };

    //drawUnitLayer alias to draw mirror images while units are static
    var FotF_MirrorMapLayer = MapLayer.drawUnitLayer;
    MapLayer.drawUnitLayer = function () {
        var session = root.getCurrentSession();
        if (session !== null) {
            if (FotF_MirrorCacheArray1 === null || FotF_MirrorCacheArray2 === null) {
                FotF_MirrorControl.updateMirrorCacheArray();
            }

            if (FotF_MirrorCacheArray1 !== null && FotF_MirrorCacheArray2 !== null) {
                var scrollX = session.getScrollPixelX();
                var scrollY = session.getScrollPixelY();
                var index = MapLayer._counter.getAnimationIndex();
                var index2 = MapLayer._counter.getAnimationIndex2();
                if (FotF_MirrorCacheArray1.length === 3) {
                    var img = FotF_MirrorCacheArray1[index];
                    img.draw(-scrollX, -scrollY);
                }
                if (FotF_MirrorCacheArray2.length === 2) {
                    var img2 = FotF_MirrorCacheArray2[index2];
                    img2.draw(-scrollX, -scrollY);
                }
            }
        }
        FotF_MirrorMapLayer.call(this);
    };

    //Refresh static mirror image during movement
    var FotF_ResetMirrorCache = SimulateMove._endMove;
    SimulateMove._endMove = function (unit) {
        FotF_ResetMirrorCache.call(this, unit);
        FotF_MirrorControl.updateMirrorCacheArray();
    };

    //Refresh static mirror image if move is canceled
    var FotF_ResetMirrorCache2 = PlayerTurn.setPosValue;
    PlayerTurn.setPosValue = function (unit) {
        FotF_ResetMirrorCache2.call(this, unit);
        FotF_MirrorControl.updateMirrorCacheArray();
    };

    //Refresh static mnirror image if mapchips are changed via "Control Map Pos"
    var FotF_ResetMirrorCache3 = MapPosOperationEventCommand._enterMapChip;
    MapPosOperationEventCommand._enterMapChip = function () {
        FotF_ResetMirrorCache3.call(this);
        FotF_MirrorControl.updateMirrorCacheArray();
    };

    //Refresh static mirror image during movement
    var FotF_ResetMirrorCache4 = SimulateMove.startMove;
    SimulateMove.startMove = function (unit, moveCource) {
        FotF_ResetMirrorCache4.call(this, unit, moveCource);
        FotF_MirrorControl.updateMirrorCacheArray();
    };

    //Refresh static mirror image when selecting a unit
    var FotF_ResetMirrorCache5 = MapSequenceArea.openSequence;
    MapSequenceArea.openSequence = function (parentTurnObject) {
        FotF_ResetMirrorCache5.call(this, parentTurnObject);
        FotF_MirrorControl.updateMirrorCacheArray();
    };

    //Refresh static mirror image when deselecting a unit
    var FotF_ResetMirrorCache6 = MapSequenceArea._doCancelAction;
    MapSequenceArea._doCancelAction = function () {
        FotF_ResetMirrorCache6.call(this);
        FotF_MirrorControl.updateMirrorCacheArray();
    };
})();

var FotF_MirrorControl = {
    createMirrorImageCacheArray1: function () {
        var i;
        var mirrorCacheArray = [];
        for (i = 0; i < 3; i++) {
            var index = i;
            var cache = this.createMirrorImageCache(index, false);
            mirrorCacheArray.push(cache);
        }
        return mirrorCacheArray;
    },

    createMirrorImageCacheArray2: function () {
        var i;
        var mirrorCacheArray = [];
        for (i = 0; i < 2; i++) {
            var index = i;
            var cache = this.createMirrorImageCache(index, true);
            mirrorCacheArray.push(cache);
        }
        return mirrorCacheArray;
    },

    createMirrorImageCache: function (index, isIndex2) {
        var i;
        var mapData = root.getCurrentSession().getCurrentMapInfo();
        var mapwidth = mapData.getMapWidth() * GraphicsFormat.MAPCHIP_WIDTH;
        var mapheight = mapData.getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT;
        var manager = root.getGraphicsManager();
        var cache = manager.createCacheGraphics(mapwidth, mapheight);
        var playerList = PlayerList.getAliveList();
        var enemyList = EnemyList.getAliveList();
        var allyList = AllyList.getAliveList();

        if (isIndex2) {
            if (typeof index !== 'number' || index < 0 || index >= 2) {
                return;
            }
        } else {
            if (typeof index !== 'number' || index < 0 || index >= 3) {
                return;
            }
        }

        manager.setRenderCache(cache);
        for (i = 0; i < playerList.getCount(); i++) {
            var unit = playerList.getData(i);
            var type = unit.getClass().getCharChipLoopType();

            if (typeof unit === 'undefined' || unit === null) {
                continue;
            }
            if (isIndex2 && type !== CharChipLoopType.DOUBLE) {
                continue;
            } else if (!isIndex2 && type !== CharChipLoopType.NORMAL) {
                continue;
            }

            this.drawMirrorImageStatic(unit, index);
        }

        for (i = 0; i < enemyList.getCount(); i++) {
            var unit = enemyList.getData(i);
            var type = unit.getClass().getCharChipLoopType();

            if (typeof unit === 'undefined' || unit === null) {
                continue;
            }
            if (isIndex2 && type !== CharChipLoopType.DOUBLE) {
                continue;
            } else if (!isIndex2 && type !== CharChipLoopType.NORMAL) {
                continue;
            }

            this.drawMirrorImageStatic(unit, index);
        }

        for (i = 0; i < allyList.getCount(); i++) {
            var unit = allyList.getData(i);
            var type = unit.getClass().getCharChipLoopType();

            if (typeof unit === 'undefined' || unit === null) {
                continue;
            }
            if (isIndex2 && type !== CharChipLoopType.DOUBLE) {
                continue;
            } else if (!isIndex2 && type !== CharChipLoopType.NORMAL) {
                continue;
            }

            this.drawMirrorImageStatic(unit, index);
        }
        manager.resetRenderCache();
        return cache;
    },

    resetMirrorImageCache: function () {
        FotF_MirrorCacheArray1 = null;
        FotF_MirrorCacheArray2 = null;
    },

    //Re-calculate the image cache arrays
    updateMirrorCacheArray: function () {
        this.resetMirrorImageCache();
        FotF_MirrorCacheArray1 = this.createMirrorImageCacheArray1();
        FotF_MirrorCacheArray2 = this.createMirrorImageCacheArray2();
    },

    getMirrorSectorArray: function (unit) {
        var i, j;
        var arr = [];
        var unitX = unit.getMapX();
        var unitY = unit.getMapY();
        var t = CharchipSectorType;
        for (i = -2; i < 3; i++) {
            if (i !== 0) {
                for (j = -1; j < 2; j++) {
                    var x = unitX + j;
                    var y = unitY + i;
                    var terr1 = PosChecker.getTerrainFromPos(x, y);
                    var terr2 = PosChecker.getTerrainFromPosEx(x, y);
                    var type = this.getSectorType(j, i);
                    var param = this.buildMirrorRenderParam(type);
                    if (type === null || param === null) {
                        continue;
                    }
                    if (type === t.a || type === t.b || type === t.c || type === t.d || type === t.e || type === t.f) {
                        if (typeof terr1 !== 'undefined' && terr1 !== null && terr1.custom.mirror === 2) {
                            arr.push([x, y, param]);
                        } else if (typeof terr2 !== 'undefined' && terr2 !== null && terr2.custom.mirror === 2) {
                            arr.push([x, y, param]);
                        }
                    } else if (type === t.g || type === t.h || type === t.i || type === t.j || type === t.k || type === t.l) {
                        if (typeof terr1 !== 'undefined' && terr1 !== null && terr1.custom.mirror === 1) {
                            arr.push([x, y, param]);
                        } else if (typeof terr2 !== 'undefined' && terr2 !== null && terr2.custom.mirror === 1) {
                            arr.push([x, y, param]);
                        }
                    }
                }
            }
        }

        return arr;
    },

    getSectorType: function (x, y) {
        var type = CharchipSectorType;
        if (y === -2) {
            if (x === -1) {
                return type.a;
            } else if (x === 0) {
                return type.b;
            } else if (x === 1) {
                return type.c;
            }
        } else if (y === -1) {
            if (x === -1) {
                return type.d;
            } else if (x === 0) {
                return type.e;
            } else if (x === 1) {
                return type.f;
            }
        } else if (y === 1) {
            if (x === -1) {
                return type.i;
            } else if (x === 0) {
                return type.h;
            } else if (x === 1) {
                return type.g;
            }
        } else if (y === 2) {
            if (x === -1) {
                return type.l;
            } else if (x === 0) {
                return type.k;
            } else if (x === 1) {
                return type.j;
            }
        }
        return null;
    },

    flipDirection: function (direction) {
        if (direction === DirectionType.TOP) {
            direction = DirectionType.BOTTOM;
        } else if (direction === DirectionType.NULL) {
            direction = DirectionType.TOP;
        } else if (direction === DirectionType.BOTTOM) {
            direction = DirectionType.TOP;
        } else if (direction === DirectionType.LEFT) {
            direction = DirectionType.RIGHT;
        } else if (direction === DirectionType.RIGHT) {
            direction = DirectionType.LEFT;
        }

        return direction;
    },

    buildMirrorRenderParam: function (type) {
        var param = StructureBuilder.buildMirrorImageRenderParam();
        var t = CharchipSectorType;
        var MCW = GraphicsFormat.MAPCHIP_WIDTH;
        var MCH = GraphicsFormat.MAPCHIP_HEIGHT;
        var cMD = CharchipMapchipDivision;

        if (type === t.g || type === t.h || type === t.i || type === t.j || type === t.k || type === t.l) {
            param.isFlipped = false;
            param.isReverse = true;
            param.isRotated = true;
        } else if (type === t.a || type === t.b || type === t.c || type === t.d || type === t.e || type === t.f) {
            param.isFlipped = true;
            param.isReverse = true;
            param.isRotated = false;
        }

        param.type = type;

        //This only happens if no types match
        if (!param.isReverse && !param.isFlipped) {
            return null;
        }

        if (type === t.a || type === t.d || type === t.i || type === t.l) {
            param.xDest = cMD.width;
        } else {
            param.xDest = 0;
        }

        if (type === t.a || type === t.b || type === t.c) {
            param.yDest = cMD.height;
        } else {
            param.yDest = 0;
        }

        if (type === t.b || type === t.e || type === t.h || type === t.k) {
            param.xSrc = cMD.width;
        } else if (type === t.c || type === t.f || type === t.g || type === t.j) {
            param.xSrc = MCW + cMD.width;
        } else {
            param.xSrc = 0;
        }

        if (type === t.d || type === t.e || type === t.f || type === t.g || type === t.h || type === t.i) {
            param.ySrc = cMD.height;
        } else {
            param.ySrc = 0;
        }

        if (type === t.a || type === t.c || type === t.d || type === t.f || type === t.g || type === t.i || type === t.j || type === t.l) {
            param.width = cMD.width;
        } else if (type === t.b || type === t.e || type === t.h || type === t.k) {
            param.width = MCW;
        }

        if (type === t.a || type === t.b || type === t.c || type === t.j || type === t.k || type === t.l) {
            param.height = cMD.height;
        } else if (type === t.d || type === t.e || type === t.f || type === t.g || type === t.h || type === t.i) {
            param.height = MCH;
        }

        return param;
    },

    drawSectorImage: function (x, y, pic, param) {
        if (param.isReverse) {
            pic.setReverse(true);
        } else {
            pic.setReverse(false);
        }
        if (param.isRotated) {
            pic.setDegree(180);
        } else {
            pic.setDegree(0);
        }
        pic.drawParts(x + param.xDest, y + param.yDest, param.xSrc, param.ySrc, param.width, param.height);
    },

    drawMirrorImageStatic: function (unit, index) {
        var unitId = unit.getId();
        if (FotF_isMirrorLagImageVisiblePlayer.indexOf(unitId) > -1 || unit.isInvisible()) {
            return;
        }

        var i;
        var session = root.getCurrentSession();
        var width = GraphicsFormat.CHARCHIP_WIDTH;
        var height = GraphicsFormat.CHARCHIP_HEIGHT;
        var secArr = this.getMirrorSectorArray(unit);
        var count = secArr.length;

        if (count < 1) {
            return;
        }

        var unitRenderParam = StructureBuilder.buildUnitRenderParam();

        unitRenderParam.isScroll = true;
        unitRenderParam.animationIndex = 0;
        if (unitRenderParam.colorIndex === -1) {
            unitRenderParam.colorIndex = unit.getUnitType();
        }
        if (unitRenderParam.handle === null) {
            unitRenderParam.handle = unit.getCharChipResourceHandle();
        }
        unitRenderParam.direction = unit.getDirection();
        unitRenderParam.animationIndex = index;

        var pic = UnitRenderer._getGraphics(unitRenderParam.handle, unitRenderParam.colorIndex);
        var xSrc = unitRenderParam.handle.getSrcX() * (width * 3);
        var ySrc = unitRenderParam.handle.getSrcY() * (height * 5);
        var dxSrc, dySrc;
        var directionArray = [4, 1, 2, 3, 0];
        dxSrc = unitRenderParam.animationIndex;

        for (i = 0; i < count; i++) {
            var x = secArr[i][0] * GraphicsFormat.MAPCHIP_WIDTH;
            var y = secArr[i][1] * GraphicsFormat.MAPCHIP_HEIGHT;
            var param = secArr[i][2];
            if (param.isFlipped) {
                newDirection = this.flipDirection(unitRenderParam.direction);
                dySrc = directionArray[newDirection];
            } else {
                dySrc = directionArray[unitRenderParam.direction];
            }
            param.xSrc += xSrc;
            param.xSrc += dxSrc * width;
            param.ySrc += ySrc;
            param.ySrc += dySrc * height;
            this.drawSectorImage(x, y, pic, param);
        }
    },

    drawMirrorImageMoving: function (unit, x, y, unitRenderParam) {
        var tempRenderParam = unitRenderParam;

        if (unit.getUnitType() === UnitType.PLAYER) {
            var unitId = unit.getId();
            if (FotF_isMirrorLagImageVisiblePlayer.indexOf(unitId) > -1) {
                FotF_isMirrorLagImageVisiblePlayer.splice(FotF_isMirrorLagImageVisiblePlayer.indexOf(unitId), 1);
            }
        } else if (unit.getUnitType() === UnitType.ENEMY) {
            unitId = unit.getId();
            if (FotF_isMirrorLagImageVisibleEnemy.indexOf(unitId) > -1) {
                FotF_isMirrorLagImageVisibleEnemy.splice(FotF_isMirrorLagImageVisibleEnemy.indexOf(unitId), 1);
            }
        } else if (unit.getUnitType() === UnitType.ALLY) {
            unitId = unit.getId();
            if (FotF_isMirrorLagImageVisibleAlly.indexOf(unitId) > -1) {
                FotF_isMirrorLagImageVisibleAlly.splice(FotF_isMirrorLagImageVisibleAlly.indexOf(unitId), 1);
            }
        }

        var session = root.getCurrentSession();
        if (session !== null) {
            var dx, dy, dxSrc, dySrc;
            var directionArray = [4, 1, 2, 3, 0];

            unitRenderParam = StructureBuilder.buildUnitRenderParam();
            unitRenderParam.isScroll = true;
            unitRenderParam.animationIndex = 0;
            if (unitRenderParam.colorIndex === -1) {
                unitRenderParam.colorIndex = unit.getUnitType();
            }
            if (unitRenderParam.handle === null) {
                unitRenderParam.handle = unit.getCharChipResourceHandle();
            }
            unitRenderParam.direction = unit.getDirection();
            unitRenderParam.animationIndex = MapLayer.getAnimationIndexFromUnit(unit);

            var handle = unitRenderParam.handle;
            var width = GraphicsFormat.CHARCHIP_WIDTH;
            var height = GraphicsFormat.CHARCHIP_HEIGHT;
            var xSrc = handle.getSrcX() * (width * 3);
            var ySrc = handle.getSrcY() * (height * 5);
            var pic = UnitRenderer._getGraphics(handle, unitRenderParam.colorIndex);
            var tileSize = UnitRenderer._getTileSize(unitRenderParam);
            var terrX, terrY;
            var handle = unitRenderParam.handle;
            var pic = UnitRenderer._getGraphics(handle, unitRenderParam.colorIndex);

            if (pic === null) {
                return;
            }

            dx = Math.floor((width - tileSize.width) / 2);
            dy = Math.floor((height - tileSize.height) / 2);
            dxSrc = unitRenderParam.animationIndex;
            dySrc = directionArray[unitRenderParam.direction];

            pic.setAlpha(unitRenderParam.alpha);
            pic.setDegree(unitRenderParam.degree);
            pic.setReverse(unitRenderParam.isReverse);

            terrX = (x + GraphicsFormat.MAPCHIP_WIDTH / 4) / GraphicsFormat.MAPCHIP_WIDTH;
            terrY = y / GraphicsFormat.MAPCHIP_HEIGHT;

            if (y < session.getCurrentMapInfo().getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT - GraphicsFormat.MAPCHIP_HEIGHT) {
                var terrainL = PosChecker.getTerrainFromPosEx(Math.floor(terrX), Math.ceil(terrY) + 1);
                var terrainLT = PosChecker.getTerrainFromPos(Math.floor(terrX), Math.ceil(terrY) + 1);

                if (terrainL.custom.mirror === 1 || terrainLT.custom.mirror === 1) {
                    pic.setReverse(true);
                    pic.setDegree(180);

                    if (typeof terrainL.custom.mirrorAlpha === 'number' && 0 >= terrainL.custom.mirrorAlpha < 256) {
                        pic.setAlpha(terrainL.custom.mirrorAlpha);
                    } else if (typeof terrainLT.custom.mirrorAlpha === 'number' && 0 >= terrainLT.custom.mirrorAlpha < 256) {
                        pic.setAlpha(terrainLT.custom.mirrorAlpha);
                    } else {
                        pic.setAlpha(255);
                    }

                    pic.drawStretchParts(x - dx - session.getScrollPixelX(), y + GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY(), width, height / 2, xSrc + dxSrc * width, ySrc + dySrc * height + dy, width, height / 2);
                }
            }

            if (y < session.getCurrentMapInfo().getMapHeight() * GraphicsFormat.MAPCHIP_HEIGHT - 2 * GraphicsFormat.MAPCHIP_HEIGHT) {
                var terrainLL = PosChecker.getTerrainFromPosEx(Math.floor(terrX), Math.ceil(terrY) + 2);
                var terrainLLT = PosChecker.getTerrainFromPos(Math.floor(terrX), Math.ceil(terrY) + 2);

                if (terrainLL.custom.mirror === 1 || terrainLLT.custom.mirror === 1) {
                    pic.setReverse(true);
                    pic.setDegree(180);

                    if (typeof terrainLL.custom.mirrorAlpha === 'number' && 0 >= terrainLL.custom.mirrorAlpha < 256) {
                        pic.setAlpha(terrainLL.custom.mirrorAlpha);
                    } else if (typeof terrainLLT.custom.mirrorAlpha === 'number' && 0 >= terrainLLT.custom.mirrorAlpha < 256) {
                        pic.setAlpha(terrainLLT.custom.mirrorAlpha);
                    } else {
                        pic.setAlpha(255);
                    }

                    pic.drawStretchParts(x - dx - session.getScrollPixelX(), y + 2 * GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY(), width, height / 2 - dy, xSrc + dxSrc * width, ySrc + dySrc * height, width, height / 2 - dy);
                }
            }

            if (y >= GraphicsFormat.MAPCHIP_HEIGHT) {
                var terrainU = PosChecker.getTerrainFromPosEx(Math.floor(terrX), Math.ceil(terrY) - 1);
                var terrainUT = PosChecker.getTerrainFromPos(Math.floor(terrX), Math.ceil(terrY) - 1);

                if (terrainU.custom.mirror === 2 || terrainUT.custom.mirror === 2) {
                    if (typeof terrainU.custom.mirrorAlpha === 'number' && 0 >= terrainU.custom.mirrorAlpha < 256) {
                        pic.setAlpha(terrainU.custom.mirrorAlpha);
                    } else if (typeof terrainUT.custom.mirrorAlpha === 'number' && 0 >= terrainUT.custom.mirrorAlpha < 256) {
                        pic.setAlpha(terrainUT.custom.mirrorAlpha);
                    } else {
                        pic.setAlpha(255);
                    }

                    pic.drawStretchParts(x - dx - session.getScrollPixelX(), y - GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY(), width, height / 2, xSrc + dxSrc * width, ySrc + dySrc * height + dy, width, height / 2);
                }
            }

            if (y >= 2 * GraphicsFormat.MAPCHIP_HEIGHT) {
                var terrainUU = PosChecker.getTerrainFromPosEx(Math.floor(terrX), Math.ceil(terrY) - 2);
                var terrainUUT = PosChecker.getTerrainFromPos(Math.floor(terrX), Math.ceil(terrY) - 2);

                if (terrainUU.custom.mirror === 2 || terrainUUT.custom.mirror === 2) {
                    if (typeof terrainUU.custom.mirrorAlpha === 'number' && 0 >= terrainUU.custom.mirrorAlpha < 256) {
                        pic.setAlpha(terrainUU.custom.mirrorAlpha);
                    } else if (typeof terrainUUT.custom.mirrorAlpha === 'number' && 0 >= terrainUUT.custom.mirrorAlpha < 256) {
                        pic.setAlpha(terrainUUT.custom.mirrorAlpha);
                    } else {
                        pic.setAlpha(255);
                    }

                    pic.drawStretchParts(x - dx - session.getScrollPixelX(), y + dy - 2 * GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY(), width, height / 2 - dy, xSrc + dxSrc * width, ySrc + dySrc * height, width, height / 2 - dy);
                }
            }
        }
        unitRenderParam = tempRenderParam;
    }
};
