var FotF_UnitWrapper = {
    getUnitFromId: function (id) {
        var unit = null;
        var session = root.getCurrentSession();

        if (session === null) {
            return unit;
        }

        if (id < 0x10000) {
            unit = session.getPlayerList().getDataFromId(id);
        } else if ((id >= 0x10000 && id < 0x30000) || (id >= 0x50000 && id < 0x60000)) {
            unit = session.getEnemyList().getDataFromId(id);
        } else if (id >= 0x30000 && id < 0x50000) {
            unit = session.getAllyList().getDataFromId(id);
        } else if (id >= 0x60000 && id < 0x80000) {
            unit = session.getGuestList().getDataFromId(id);
        }

        return unit;
    },

    checkDisplace: function (unit, attacker, x, y, direction, isPull) {
        var mapInfo = root.getCurrentSession().getCurrentMapInfo();

        var newX = x + XPoint[direction];
        var newY = y + YPoint[direction];
        var checkUnit = PosChecker.getUnitFromPos(newX, newY);

        if (newX < 0 || newX >= mapInfo.getMapWidth()) {
            return false;
        } else if (newY < 0 || newY >= mapInfo.getMapHeight()) {
            return false;
        } else if (PosChecker.getMovePointFromUnit(newX, newY, unit) === 0) {
            return false;
        } else if (checkUnit !== null) {
            if (isPull && checkUnit === attacker) {
                return true;
            }
            return false;
        }

        return true;
    },

    getTotalUnitList: function () {
        var list = StructureBuilder.buildDataList();
        var func = function () {
            return true;
        };
        var arr = [];

        //Roundabout way, but the main lists don't contain the array and my
        //autism commands me to concat the lists, which needs arrays
        var players = AllUnitList.getList(PlayerList.getMainList(), func)._arr;
        var enemies = AllUnitList.getList(EnemyList.getMainList(), func)._arr;
        var allies = AllUnitList.getList(AllyList.getMainList(), func)._arr;
        root.log(players.length);

        var arr = arr.concat(players, enemies, allies);
        list.setDataArray(arr);

        return list;
    },

    getUnitsInRange: function (x, y, start, end) {
        var i;
        var arr = [];
        var list = StructureBuilder.buildDataList();
        var indexArray = IndexArray.getBestIndexArray(x, y, start, end);

        for (i = 0; i < indexArray.length; i++) {
            var x = CurrentMap.getX(indexArray[i]);
            var y = CurrentMap.getY(indexArray[i]);
            var unit = PosChecker.getUnitFromPos(x, y);

            if (unit !== null) {
                arr.push(unit);
            }
        }

        list.setDataArray(arr);
        return list;
    }
};
