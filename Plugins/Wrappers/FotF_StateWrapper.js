var FotF_StateWrapper = {
    getCusparaStateList: function (unit, string) {
        var i;
        var list = StructureBuilder.buildDataList();
        var refList = unit.getTurnStateList();
        var arr = [];

        for (i = 0; i < refList.getCount(); i++) {
            var state = refList.getData(i).getState();
            if (state !== null && typeof state.custom[string] !== 'undefined') {
                arr.push(state);
            }
        }

        list.setDataArray(arr);
        return list;
    },

    getCusparaStateValue: function (list, string) {
        var i;
        var value = 0;

        for (i = 0; i < list.getCount(); i++) {
            var state = list.getData(i);
            if (state !== null && typeof state.custom[string] === 'number') {
                value += state.custom[string];
            }
        }

        return value;
    },

    clearStatesByCuspara: function (unit, string) {
        var i;
        var list = unit.getTurnStateList();

        for (i = 0; i < list.getCount(); i++) {
            var state = list.getData(i);
            if (state !== null && typeof state.custom[string] !== 'undefined') {
                StateControl.arrangeState(unit, state, IncreaseType.DECREASE);
            }
        }
    },

    getEnemyBadStatesInRange: function (unit, startRange, endRange) {
        var i, j;
        var arr = [];

        if (unit === null) {
            return arr;
        }

        var indexArray = IndexArray.getBestIndexArray(unit.getMapX(), unit.getMapY(), startRange, endRange);

        for (i = 0; i < indexArray.length; i++) {
            var index = indexArray[i];
            var x = CurrentMap.getX(index);
            var y = CurrentMap.getY(index);
            var targetUnit = PosChecker.getUnitFromPos(x, y);
            if (targetUnit !== null && FilterControl.isReverseUnitTypeAllowed(unit, targetUnit)) {
                var list = targetUnit.getTurnStateList();
                for (j = 0; j < list.getCount(); j++) {
                    var state = list.getData(j).getState();
                    if (state !== null && state.isBadState()) {
                        arr.push(state);
                    }
                }
            }
        }

        return arr;
    },

    getEnemyBadStateCountInRange: function (unit, startRange, endRange) {
        return this.getEnemyBadStatesInRange(unit, startRange, endRange).length;
    }
};
