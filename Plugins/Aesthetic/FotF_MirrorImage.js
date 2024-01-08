/*--------------------------------------------------------------------------
With this plugin water or other reflectant surfaces can have mirror images of units!

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
2023/01/08
Released
  
--------------------------------------------------------------------------*/

FotF_isMirrorLagImageVisiblePlayer = []
FotF_isMirrorLagImageVisibleEnemy = []
FotF_isMirrorLagImageVisibleAlly = []

var FotF_MirrorImage = UnitRenderer.drawScrollUnit;
UnitRenderer.drawScrollUnit = function (unit, x, y, unitRenderParam) {

	if (unit.getUnitType() === UnitType.PLAYER) {
		unitId = unit.getId();
		if (FotF_isMirrorLagImageVisiblePlayer.indexOf(unitId) > -1) {
			FotF_isMirrorLagImageVisiblePlayer.splice(FotF_isMirrorLagImageVisiblePlayer.indexOf(unitId), 1)
		}
	} else if (unit.getUnitType() === UnitType.ENEMY) {
		unitId = unit.getId();
		if (FotF_isMirrorLagImageVisibleEnemy.indexOf(unitId) > -1) {
			FotF_isMirrorLagImageVisibleEnemy.splice(FotF_isMirrorLagImageVisiblePlayer.indexOf(unitId), 1)
		}
	} else if (unit.getUnitType() === UnitType.ALLY) {
		unitId = unit.getId();
		if (FotF_isMirrorLagImageVisibleAlly.indexOf(unitId) > -1) {
			FotF_isMirrorLagImageVisibleAlly.splice(FotF_isMirrorLagImageVisiblePlayer.indexOf(unitId), 1)
		}
	}

	var session = root.getCurrentSession();
	if (session !== null) {
		var dx, dy, dxSrc, dySrc;
		var directionArray = [4, 1, 2, 3, 0];
		
		unitRenderParam = StructureBuilder.buildUnitRenderParam();
		unitRenderParam.isScroll = true;
		unitRenderParam.animationIndex = 0
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
		var pic = this._getGraphics(handle, unitRenderParam.colorIndex);
		var tileSize = this._getTileSize(unitRenderParam);
		var terrX, terrY;
		var handle = unitRenderParam.handle;
		var pic = this._getGraphics(handle, unitRenderParam.colorIndex);
		
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
		
		terrX = (x + (GraphicsFormat.MAPCHIP_WIDTH / 4)) / GraphicsFormat.MAPCHIP_WIDTH
		terrY = y / GraphicsFormat.MAPCHIP_HEIGHT

		if (y < (session.getCurrentMapInfo().getMapHeight() - GraphicsFormat.MAPCHIP_HEIGHT)) {
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
				
				pic.drawStretchParts(x - dx - session.getScrollPixelX(), y + GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY(), width, (height / 2), xSrc + (dxSrc * width), ySrc + (dySrc * height) + dy, width, (height / 2));
			}
		}
		
		if (y < (session.getCurrentMapInfo().getMapHeight() - (2 * GraphicsFormat.MAPCHIP_HEIGHT))) {
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
				
				pic.drawStretchParts(x - dx - session.getScrollPixelX(), y + (2 * GraphicsFormat.MAPCHIP_HEIGHT) - session.getScrollPixelY(), width, (height / 2) - dy, xSrc + (dxSrc * width), ySrc + (dySrc * height), width, (height / 2) - dy);
				
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
				
				pic.drawStretchParts(x - dx - session.getScrollPixelX(), y - GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY(), width, (height / 2), xSrc + (dxSrc * width), ySrc + (dySrc * height) + dy, width, (height / 2));
			}
		}
		
		if (y >= (2 * GraphicsFormat.MAPCHIP_HEIGHT)) {
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
				//pic.drawStretchParts(x - dx - session.getScrollPixelX(), y + (2 * GraphicsFormat.MAPCHIP_HEIGHT) - session.getScrollPixelY(), width, (height / 2) - dy, xSrc + (dxSrc * width), ySrc + (dySrc * height), width, (height / 2) - dy);
				pic.drawStretchParts(x - dx - session.getScrollPixelX(), y + dy - (2 * GraphicsFormat.MAPCHIP_HEIGHT) - session.getScrollPixelY(), width, (height / 2) - dy, xSrc + (dxSrc * width), ySrc + (dySrc * height), width, (height / 2) - dy);
			}
		}
	}
	FotF_MirrorImage.call(this, unit, x, y, unitRenderParam);
};

var FotF_MirrorMapLayer = MapLayer.drawUnitLayer;
MapLayer.drawUnitLayer = function () {

	var i, j, unitRenderParam;
	var session = root.getCurrentSession();
	var width = GraphicsFormat.CHARCHIP_WIDTH;
	var height = GraphicsFormat.CHARCHIP_HEIGHT;

	var playerList = PlayerList.getAliveDefaultList();
	var enemyList = EnemyList.getAliveDefaultList();
	var allyList = AllyList.getAliveDefaultList();

		for (i = 0; i < playerList.getCount(); i++) {
			unit = playerList.getData(i);
			unitId = unit.getId();
			if (unit.getMapY() < (session.getCurrentMapInfo().getMapHeight() - 2) && FotF_isMirrorLagImageVisiblePlayer.indexOf(unitId) > -1) {

				if (unit.getMapY() < (session.getCurrentMapInfo().getMapHeight() - 2) && (PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 2).custom.mirror === 1 || PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 2).custom.mirror === 1)) {

					unitRenderParam = StructureBuilder.buildUnitRenderParam();
					unitRenderParam.isScroll = true;
					unitRenderParam.animationIndex = 0
					if (unitRenderParam.colorIndex === -1) {
						unitRenderParam.colorIndex = unit.getUnitType();
					}
					if (unitRenderParam.handle === null) {
						unitRenderParam.handle = unit.getCharChipResourceHandle();
					}
					unitRenderParam.direction = unit.getDirection();
					unitRenderParam.animationIndex = this.getAnimationIndexFromUnit(unit);

					var pic = UnitRenderer._getGraphics(unitRenderParam.handle, unitRenderParam.colorIndex);
					var x = (unit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH) - session.getScrollPixelX();
					var y = (unit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT) + GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY();
					var xSrc = unitRenderParam.handle.getSrcX() * (width * 3);
					var ySrc = unitRenderParam.handle.getSrcY() * (height * 5);
					var dx, dy, dxSrc, dySrc;
					var directionArray = [4, 1, 2, 3, 0];

					dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
					dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
					dxSrc = unitRenderParam.animationIndex;
					dySrc = directionArray[unitRenderParam.direction];

					pic.setReverse(true);
					pic.setDegree(180);

					if (typeof PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha < 256) {
					pic.setAlpha(PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha);
					} else if (typeof PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha < 256) {
					pic.setAlpha(PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha);
					} else {
					pic.setAlpha(255);
					}

					pic.drawStretchParts(x - dx, y + GraphicsFormat.MAPCHIP_HEIGHT, width, (height / 2) - dy, xSrc + (dxSrc * width), ySrc + (dySrc * height), width, (height / 2) - dy);
				}
			}

			if (unit.getMapY() < (session.getCurrentMapInfo().getMapHeight() - 1) && FotF_isMirrorLagImageVisiblePlayer.indexOf(unitId) > -1) {
				if (unit.getMapY() < (session.getCurrentMapInfo().getMapHeight() - 1) && (PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 1).custom.mirror === 1 || PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 1).custom.mirror === 1)) {

					unitRenderParam = StructureBuilder.buildUnitRenderParam();
					unitRenderParam.isScroll = true;
					unitRenderParam.animationIndex = 0
					if (unitRenderParam.colorIndex === -1) {
						unitRenderParam.colorIndex = unit.getUnitType();
					}
					if (unitRenderParam.handle === null) {
						unitRenderParam.handle = unit.getCharChipResourceHandle();
					}
					unitRenderParam.direction = unit.getDirection();
					unitRenderParam.animationIndex = this.getAnimationIndexFromUnit(unit);

					var pic = UnitRenderer._getGraphics(unitRenderParam.handle, unitRenderParam.colorIndex);
					var x = (unit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH) - session.getScrollPixelX();
					var y = (unit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT) + GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY();
					var xSrc = unitRenderParam.handle.getSrcX() * (width * 3);
					var ySrc = unitRenderParam.handle.getSrcY() * (height * 5);
					var dx, dy, dxSrc, dySrc;
					var directionArray = [4, 1, 2, 3, 0];

					dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
					dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
					dxSrc = unitRenderParam.animationIndex;
					dySrc = directionArray[unitRenderParam.direction];

					pic.setReverse(true);
					pic.setDegree(180);

					if (typeof PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha < 256) {
					pic.setAlpha(PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha);
					} else if (typeof PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha < 256) {
					pic.setAlpha(PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha);
					} else {
					pic.setAlpha(255);
					}

					pic.drawStretchParts(x - dx, y, width, (height / 2), xSrc + (dxSrc * width), ySrc + (dySrc * height) + dy, width, (height / 2));
				}
			}

			if (unit.getMapY() > 0 && FotF_isMirrorLagImageVisiblePlayer.indexOf(unitId) > -1) {
				if (unit.getMapY() > 1 && (PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 2).custom.mirror === 2 || PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 2).custom.mirror === 2)) {

					unitRenderParam = StructureBuilder.buildUnitRenderParam();
					unitRenderParam.isScroll = true;
					unitRenderParam.animationIndex = 0
					if (unitRenderParam.colorIndex === -1) {
						unitRenderParam.colorIndex = unit.getUnitType();
					}

					if (unitRenderParam.handle === null) {
						unitRenderParam.handle = unit.getCharChipResourceHandle();
					}

					unitRenderParam.direction = unit.getDirection();
					unitRenderParam.animationIndex = this.getAnimationIndexFromUnit(unit);

					if (unitRenderParam.direction === DirectionType.TOP) {
						unitRenderParam.direction = DirectionType.BOTTOM
					} else if (unitRenderParam.direction === DirectionType.NULL) {
						unitRenderParam.direction = DirectionType.TOP
					} else if (unitRenderParam.direction === DirectionType.BOTTOM) {
						unitRenderParam.direction = DirectionType.TOP
					} else if (unitRenderParam.direction === DirectionType.LEFT) {
						unitRenderParam.direction = DirectionType.RIGHT
					} else if (unitRenderParam.direction === DirectionType.RIGHT) {
						unitRenderParam.direction = DirectionType.LEFT
					}

					var pic = UnitRenderer._getGraphics(unitRenderParam.handle, unitRenderParam.colorIndex);
					var x = (unit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH) - session.getScrollPixelX();
					var y = (unit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT) + GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY();
					var xSrc = unitRenderParam.handle.getSrcX() * (width * 3);
					var ySrc = unitRenderParam.handle.getSrcY() * (height * 5);
					var dx, dy, dxSrc, dySrc;
					var directionArray = [4, 1, 2, 3, 0];

					dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
					dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
					dxSrc = unitRenderParam.animationIndex;
					dySrc = directionArray[unitRenderParam.direction];

					pic.setReverse(true);

					if (typeof PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha < 256) {
						pic.setAlpha(PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha);
					} else if (typeof PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha < 256) {
						pic.setAlpha(PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha);
					} else {
						pic.setAlpha(255);
					}

					pic.drawStretchParts(x - dx, y - dy - (2 * GraphicsFormat.MAPCHIP_HEIGHT), width, (height / 2) - dy, xSrc + (dxSrc * width), ySrc + (dySrc * height), width, (height / 2) - dy);
				}

				if (unit.getMapY() > 0 && (PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 1).custom.mirror === 2 || PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 1).custom.mirror === 2)) {

					unitRenderParam = StructureBuilder.buildUnitRenderParam();
					unitRenderParam.isScroll = true;
					unitRenderParam.animationIndex = 0
					if (unitRenderParam.colorIndex === -1) {
						unitRenderParam.colorIndex = unit.getUnitType();
					}

					if (unitRenderParam.handle === null) {
						unitRenderParam.handle = unit.getCharChipResourceHandle();
					}

					unitRenderParam.direction = unit.getDirection();
					unitRenderParam.animationIndex = this.getAnimationIndexFromUnit(unit);

					if (unitRenderParam.direction === DirectionType.TOP) {
						unitRenderParam.direction = DirectionType.BOTTOM
					} else if (unitRenderParam.direction === DirectionType.NULL) {
						unitRenderParam.direction = DirectionType.TOP
					} else if (unitRenderParam.direction === DirectionType.BOTTOM) {
						unitRenderParam.direction = DirectionType.TOP
					} else if (unitRenderParam.direction === DirectionType.LEFT) {
						unitRenderParam.direction = DirectionType.RIGHT
					} else if (unitRenderParam.direction === DirectionType.RIGHT) {
						unitRenderParam.direction = DirectionType.LEFT
					}

					var pic = UnitRenderer._getGraphics(unitRenderParam.handle, unitRenderParam.colorIndex);
					var x = (unit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH) - session.getScrollPixelX();
					var y = (unit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT) + GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY();
					var xSrc = unitRenderParam.handle.getSrcX() * (width * 3);
					var ySrc = unitRenderParam.handle.getSrcY() * (height * 5);
					var dx, dy, dxSrc, dySrc;
					var directionArray = [4, 1, 2, 3, 0];

					dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
					dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
					dxSrc = unitRenderParam.animationIndex;
					dySrc = directionArray[unitRenderParam.direction];

						pic.setReverse(true);

						if (typeof PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha < 256) {
						pic.setAlpha(PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha);
						} else if (typeof PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha < 256) {
						pic.setAlpha(PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha);
						} else {
						pic.setAlpha(255);
						}

						pic.drawStretchParts(x - dx, y - (2 * GraphicsFormat.MAPCHIP_HEIGHT), width, (height / 2), xSrc + (dxSrc * width), ySrc + (dySrc * height) + dy, width, (height / 2));
				}
			}

			if (FotF_isMirrorLagImageVisiblePlayer.indexOf(unitId) < 0) {
				FotF_isMirrorLagImageVisiblePlayer.push(unitId)
			}
		}

		for (i = 0; i < enemyList.getCount(); i++) {
			unit = enemyList.getData(i);
			unitId = unit.getId();
			if (unit.getMapY() < (session.getCurrentMapInfo().getMapHeight() - 2) && FotF_isMirrorLagImageVisibleEnemy.indexOf(unitId) > -1) {

				if (unit.getMapY() < (session.getCurrentMapInfo().getMapHeight() - 2) && (PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 2).custom.mirror === 1 || PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 2).custom.mirror === 1)) {

					unitRenderParam = StructureBuilder.buildUnitRenderParam();
					unitRenderParam.isScroll = true;
					unitRenderParam.animationIndex = 0
					if (unitRenderParam.colorIndex === -1) {
						unitRenderParam.colorIndex = unit.getUnitType();
					}
					if (unitRenderParam.handle === null) {
						unitRenderParam.handle = unit.getCharChipResourceHandle();
					}
					unitRenderParam.direction = unit.getDirection();
					unitRenderParam.animationIndex = this.getAnimationIndexFromUnit(unit);

					var pic = UnitRenderer._getGraphics(unitRenderParam.handle, unitRenderParam.colorIndex);
					var x = (unit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH) - session.getScrollPixelX();
					var y = (unit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT) + GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY();
					var xSrc = unitRenderParam.handle.getSrcX() * (width * 3);
					var ySrc = unitRenderParam.handle.getSrcY() * (height * 5);
					var dx, dy, dxSrc, dySrc;
					var directionArray = [4, 1, 2, 3, 0];

					dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
					dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
					dxSrc = unitRenderParam.animationIndex;
					dySrc = directionArray[unitRenderParam.direction];

					pic.setReverse(true);
					pic.setDegree(180);

					if (typeof PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha < 256) {
					pic.setAlpha(PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha);
					} else if (typeof PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha < 256) {
					pic.setAlpha(PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha);
					} else {
					pic.setAlpha(255);
					}

					pic.drawStretchParts(x - dx, y + GraphicsFormat.MAPCHIP_HEIGHT, width, (height / 2) - dy, xSrc + (dxSrc * width), ySrc + (dySrc * height), width, (height / 2) - dy);
				}
			}

			if (unit.getMapY() < (session.getCurrentMapInfo().getMapHeight() - 1) && FotF_isMirrorLagImageVisibleEnemy.indexOf(unitId) > -1) {
				if (unit.getMapY() < (session.getCurrentMapInfo().getMapHeight() - 1) && (PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 1).custom.mirror === 1 || PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 1).custom.mirror === 1)) {

					unitRenderParam = StructureBuilder.buildUnitRenderParam();
					unitRenderParam.isScroll = true;
					unitRenderParam.animationIndex = 0
					if (unitRenderParam.colorIndex === -1) {
						unitRenderParam.colorIndex = unit.getUnitType();
					}
					if (unitRenderParam.handle === null) {
						unitRenderParam.handle = unit.getCharChipResourceHandle();
					}
					unitRenderParam.direction = unit.getDirection();
					unitRenderParam.animationIndex = this.getAnimationIndexFromUnit(unit);

					var pic = UnitRenderer._getGraphics(unitRenderParam.handle, unitRenderParam.colorIndex);
					var x = (unit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH) - session.getScrollPixelX();
					var y = (unit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT) + GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY();
					var xSrc = unitRenderParam.handle.getSrcX() * (width * 3);
					var ySrc = unitRenderParam.handle.getSrcY() * (height * 5);
					var dx, dy, dxSrc, dySrc;
					var directionArray = [4, 1, 2, 3, 0];

					dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
					dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
					dxSrc = unitRenderParam.animationIndex;
					dySrc = directionArray[unitRenderParam.direction];

					pic.setReverse(true);
					pic.setDegree(180);

					if (typeof PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha < 256) {
					pic.setAlpha(PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha);
					} else if (typeof PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha < 256) {
					pic.setAlpha(PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha);
					} else {
					pic.setAlpha(255);
					}

					pic.drawStretchParts(x - dx, y, width, (height / 2), xSrc + (dxSrc * width), ySrc + (dySrc * height) + dy, width, (height / 2));
				}
			}

			if (unit.getMapY() > 0 && FotF_isMirrorLagImageVisibleEnemy.indexOf(unitId) > -1) {
				if (unit.getMapY() > 1 && (PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 2).custom.mirror === 2 || PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 2).custom.mirror === 2)) {

					unitRenderParam = StructureBuilder.buildUnitRenderParam();
					unitRenderParam.isScroll = true;
					unitRenderParam.animationIndex = 0
					if (unitRenderParam.colorIndex === -1) {
						unitRenderParam.colorIndex = unit.getUnitType();
					}

					if (unitRenderParam.handle === null) {
						unitRenderParam.handle = unit.getCharChipResourceHandle();
					}

					unitRenderParam.direction = unit.getDirection();
					unitRenderParam.animationIndex = this.getAnimationIndexFromUnit(unit);

					if (unitRenderParam.direction === DirectionType.TOP) {
						unitRenderParam.direction = DirectionType.BOTTOM
					} else if (unitRenderParam.direction === DirectionType.NULL) {
						unitRenderParam.direction = DirectionType.TOP
					} else if (unitRenderParam.direction === DirectionType.BOTTOM) {
						unitRenderParam.direction = DirectionType.TOP
					} else if (unitRenderParam.direction === DirectionType.LEFT) {
						unitRenderParam.direction = DirectionType.RIGHT
					} else if (unitRenderParam.direction === DirectionType.RIGHT) {
						unitRenderParam.direction = DirectionType.LEFT
					}

					var pic = UnitRenderer._getGraphics(unitRenderParam.handle, unitRenderParam.colorIndex);
					var x = (unit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH) - session.getScrollPixelX();
					var y = (unit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT) + GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY();
					var xSrc = unitRenderParam.handle.getSrcX() * (width * 3);
					var ySrc = unitRenderParam.handle.getSrcY() * (height * 5);
					var dx, dy, dxSrc, dySrc;
					var directionArray = [4, 1, 2, 3, 0];

					dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
					dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
					dxSrc = unitRenderParam.animationIndex;
					dySrc = directionArray[unitRenderParam.direction];

					pic.setReverse(true);

					if (typeof PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha < 256) {
						pic.setAlpha(PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha);
					} else if (typeof PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha < 256) {
						pic.setAlpha(PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha);
					} else {
						pic.setAlpha(255);
					}

					pic.drawStretchParts(x - dx, y - dy - (2 * GraphicsFormat.MAPCHIP_HEIGHT), width, (height / 2) - dy, xSrc + (dxSrc * width), ySrc + (dySrc * height), width, (height / 2) - dy);
				}

				if (unit.getMapY() > 0 && (PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 1).custom.mirror === 2 || PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 1).custom.mirror === 2)) {

					unitRenderParam = StructureBuilder.buildUnitRenderParam();
					unitRenderParam.isScroll = true;
					unitRenderParam.animationIndex = 0
					if (unitRenderParam.colorIndex === -1) {
						unitRenderParam.colorIndex = unit.getUnitType();
					}

					if (unitRenderParam.handle === null) {
						unitRenderParam.handle = unit.getCharChipResourceHandle();
					}

					unitRenderParam.direction = unit.getDirection();
					unitRenderParam.animationIndex = this.getAnimationIndexFromUnit(unit);

					if (unitRenderParam.direction === DirectionType.TOP) {
						unitRenderParam.direction = DirectionType.BOTTOM
					} else if (unitRenderParam.direction === DirectionType.NULL) {
						unitRenderParam.direction = DirectionType.TOP
					} else if (unitRenderParam.direction === DirectionType.BOTTOM) {
						unitRenderParam.direction = DirectionType.TOP
					} else if (unitRenderParam.direction === DirectionType.LEFT) {
						unitRenderParam.direction = DirectionType.RIGHT
					} else if (unitRenderParam.direction === DirectionType.RIGHT) {
						unitRenderParam.direction = DirectionType.LEFT
					}

					var pic = UnitRenderer._getGraphics(unitRenderParam.handle, unitRenderParam.colorIndex);
					var x = (unit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH) - session.getScrollPixelX();
					var y = (unit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT) + GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY();
					var xSrc = unitRenderParam.handle.getSrcX() * (width * 3);
					var ySrc = unitRenderParam.handle.getSrcY() * (height * 5);
					var dx, dy, dxSrc, dySrc;
					var directionArray = [4, 1, 2, 3, 0];

					dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
					dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
					dxSrc = unitRenderParam.animationIndex;
					dySrc = directionArray[unitRenderParam.direction];

						pic.setReverse(true);

						if (typeof PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha < 256) {
						pic.setAlpha(PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha);
						} else if (typeof PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha < 256) {
						pic.setAlpha(PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha);
						} else {
						pic.setAlpha(255);
						}

						pic.drawStretchParts(x - dx, y - (2 * GraphicsFormat.MAPCHIP_HEIGHT), width, (height / 2), xSrc + (dxSrc * width), ySrc + (dySrc * height) + dy, width, (height / 2));
				}
			}
			
			if (FotF_isMirrorLagImageVisibleEnemy.indexOf(unitId) < 0) {
				FotF_isMirrorLagImageVisibleEnemy.push(unitId)
			}
		}
		
		for (i = 0; i < allyList.getCount(); i++) {
			unit = allyList.getData(i);
			unitId = unit.getId();
			if (unit.getMapY() < (session.getCurrentMapInfo().getMapHeight() - 2) && FotF_isMirrorLagImageVisibleAlly.indexOf(unitId) > -1) {

				if (unit.getMapY() < (session.getCurrentMapInfo().getMapHeight() - 2) && (PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 2).custom.mirror === 1 || PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 2).custom.mirror === 1)) {

					unitRenderParam = StructureBuilder.buildUnitRenderParam();
					unitRenderParam.isScroll = true;
					unitRenderParam.animationIndex = 0
					if (unitRenderParam.colorIndex === -1) {
						unitRenderParam.colorIndex = unit.getUnitType();
					}
					if (unitRenderParam.handle === null) {
						unitRenderParam.handle = unit.getCharChipResourceHandle();
					}
					unitRenderParam.direction = unit.getDirection();
					unitRenderParam.animationIndex = this.getAnimationIndexFromUnit(unit);

					var pic = UnitRenderer._getGraphics(unitRenderParam.handle, unitRenderParam.colorIndex);
					var x = (unit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH) - session.getScrollPixelX();
					var y = (unit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT) + GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY();
					var xSrc = unitRenderParam.handle.getSrcX() * (width * 3);
					var ySrc = unitRenderParam.handle.getSrcY() * (height * 5);
					var dx, dy, dxSrc, dySrc;
					var directionArray = [4, 1, 2, 3, 0];

					dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
					dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
					dxSrc = unitRenderParam.animationIndex;
					dySrc = directionArray[unitRenderParam.direction];

					pic.setReverse(true);
					pic.setDegree(180);

					if (typeof PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha < 256) {
					pic.setAlpha(PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha);
					} else if (typeof PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha < 256) {
					pic.setAlpha(PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 2).custom.mirrorAlpha);
					} else {
					pic.setAlpha(255);
					}

					pic.drawStretchParts(x - dx, y + GraphicsFormat.MAPCHIP_HEIGHT, width, (height / 2) - dy, xSrc + (dxSrc * width), ySrc + (dySrc * height), width, (height / 2) - dy);
				}
			}

			if (unit.getMapY() < (session.getCurrentMapInfo().getMapHeight() - 1) && FotF_isMirrorLagImageVisibleAlly.indexOf(unitId) > -1) {
				if (unit.getMapY() < (session.getCurrentMapInfo().getMapHeight() - 1) && (PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 1).custom.mirror === 1 || PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 1).custom.mirror === 1)) {

					unitRenderParam = StructureBuilder.buildUnitRenderParam();
					unitRenderParam.isScroll = true;
					unitRenderParam.animationIndex = 0
					if (unitRenderParam.colorIndex === -1) {
						unitRenderParam.colorIndex = unit.getUnitType();
					}
					if (unitRenderParam.handle === null) {
						unitRenderParam.handle = unit.getCharChipResourceHandle();
					}
					unitRenderParam.direction = unit.getDirection();
					unitRenderParam.animationIndex = this.getAnimationIndexFromUnit(unit);

					var pic = UnitRenderer._getGraphics(unitRenderParam.handle, unitRenderParam.colorIndex);
					var x = (unit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH) - session.getScrollPixelX();
					var y = (unit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT) + GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY();
					var xSrc = unitRenderParam.handle.getSrcX() * (width * 3);
					var ySrc = unitRenderParam.handle.getSrcY() * (height * 5);
					var dx, dy, dxSrc, dySrc;
					var directionArray = [4, 1, 2, 3, 0];

					dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
					dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
					dxSrc = unitRenderParam.animationIndex;
					dySrc = directionArray[unitRenderParam.direction];

					pic.setReverse(true);
					pic.setDegree(180);

					if (typeof PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha < 256) {
					pic.setAlpha(PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha);
					} else if (typeof PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha < 256) {
					pic.setAlpha(PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() + 1).custom.mirrorAlpha);
					} else {
					pic.setAlpha(255);
					}

					pic.drawStretchParts(x - dx, y, width, (height / 2), xSrc + (dxSrc * width), ySrc + (dySrc * height) + dy, width, (height / 2));
				}
			}

			if (unit.getMapY() > 0 && FotF_isMirrorLagImageVisibleAlly.indexOf(unitId) > -1) {
				if (unit.getMapY() > 1 && (PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 2).custom.mirror === 2 || PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 2).custom.mirror === 2)) {

					unitRenderParam = StructureBuilder.buildUnitRenderParam();
					unitRenderParam.isScroll = true;
					unitRenderParam.animationIndex = 0
					if (unitRenderParam.colorIndex === -1) {
						unitRenderParam.colorIndex = unit.getUnitType();
					}

					if (unitRenderParam.handle === null) {
						unitRenderParam.handle = unit.getCharChipResourceHandle();
					}

					unitRenderParam.direction = unit.getDirection();
					unitRenderParam.animationIndex = this.getAnimationIndexFromUnit(unit);

					if (unitRenderParam.direction === DirectionType.TOP) {
						unitRenderParam.direction = DirectionType.BOTTOM
					} else if (unitRenderParam.direction === DirectionType.NULL) {
						unitRenderParam.direction = DirectionType.TOP
					} else if (unitRenderParam.direction === DirectionType.BOTTOM) {
						unitRenderParam.direction = DirectionType.TOP
					} else if (unitRenderParam.direction === DirectionType.LEFT) {
						unitRenderParam.direction = DirectionType.RIGHT
					} else if (unitRenderParam.direction === DirectionType.RIGHT) {
						unitRenderParam.direction = DirectionType.LEFT
					}

					var pic = UnitRenderer._getGraphics(unitRenderParam.handle, unitRenderParam.colorIndex);
					var x = (unit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH) - session.getScrollPixelX();
					var y = (unit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT) + GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY();
					var xSrc = unitRenderParam.handle.getSrcX() * (width * 3);
					var ySrc = unitRenderParam.handle.getSrcY() * (height * 5);
					var dx, dy, dxSrc, dySrc;
					var directionArray = [4, 1, 2, 3, 0];

					dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
					dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
					dxSrc = unitRenderParam.animationIndex;
					dySrc = directionArray[unitRenderParam.direction];

					pic.setReverse(true);

					if (typeof PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha < 256) {
						pic.setAlpha(PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha);
					} else if (typeof PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha < 256) {
						pic.setAlpha(PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 2).custom.mirrorAlpha);
					} else {
						pic.setAlpha(255);
					}

					pic.drawStretchParts(x - dx, y - dy - (2 * GraphicsFormat.MAPCHIP_HEIGHT), width, (height / 2) - dy, xSrc + (dxSrc * width), ySrc + (dySrc * height), width, (height / 2) - dy);
				}

				if (unit.getMapY() > 0 && (PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 1).custom.mirror === 2 || PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 1).custom.mirror === 2)) {

					unitRenderParam = StructureBuilder.buildUnitRenderParam();
					unitRenderParam.isScroll = true;
					unitRenderParam.animationIndex = 0
					if (unitRenderParam.colorIndex === -1) {
						unitRenderParam.colorIndex = unit.getUnitType();
					}

					if (unitRenderParam.handle === null) {
						unitRenderParam.handle = unit.getCharChipResourceHandle();
					}

					unitRenderParam.direction = unit.getDirection();
					unitRenderParam.animationIndex = this.getAnimationIndexFromUnit(unit);

					if (unitRenderParam.direction === DirectionType.TOP) {
						unitRenderParam.direction = DirectionType.BOTTOM
					} else if (unitRenderParam.direction === DirectionType.NULL) {
						unitRenderParam.direction = DirectionType.TOP
					} else if (unitRenderParam.direction === DirectionType.BOTTOM) {
						unitRenderParam.direction = DirectionType.TOP
					} else if (unitRenderParam.direction === DirectionType.LEFT) {
						unitRenderParam.direction = DirectionType.RIGHT
					} else if (unitRenderParam.direction === DirectionType.RIGHT) {
						unitRenderParam.direction = DirectionType.LEFT
					}

					var pic = UnitRenderer._getGraphics(unitRenderParam.handle, unitRenderParam.colorIndex);
					var x = (unit.getMapX() * GraphicsFormat.MAPCHIP_WIDTH) - session.getScrollPixelX();
					var y = (unit.getMapY() * GraphicsFormat.MAPCHIP_HEIGHT) + GraphicsFormat.MAPCHIP_HEIGHT - session.getScrollPixelY();
					var xSrc = unitRenderParam.handle.getSrcX() * (width * 3);
					var ySrc = unitRenderParam.handle.getSrcY() * (height * 5);
					var dx, dy, dxSrc, dySrc;
					var directionArray = [4, 1, 2, 3, 0];

					dx = Math.floor((width - GraphicsFormat.MAPCHIP_WIDTH) / 2);
					dy = Math.floor((height - GraphicsFormat.MAPCHIP_HEIGHT) / 2);
					dxSrc = unitRenderParam.animationIndex;
					dySrc = directionArray[unitRenderParam.direction];

						pic.setReverse(true);

						if (typeof PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha < 256) {
						pic.setAlpha(PosChecker.getTerrainFromPosEx(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha);
						} else if (typeof PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha === 'number' && 0 >= PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha < 256) {
						pic.setAlpha(PosChecker.getTerrainFromPos(unit.getMapX(), unit.getMapY() - 1).custom.mirrorAlpha);
						} else {
						pic.setAlpha(255);
						}

						pic.drawStretchParts(x - dx, y - (2 * GraphicsFormat.MAPCHIP_HEIGHT), width, (height / 2), xSrc + (dxSrc * width), ySrc + (dySrc * height) + dy, width, (height / 2));
				}
			}
			
			if (FotF_isMirrorLagImageVisibleAlly.indexOf(unitId) < 0) {
				FotF_isMirrorLagImageVisibleAlly.push(unitId)
			}
		}
	FotF_MirrorMapLayer.call(this);
};