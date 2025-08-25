//Plug and play. Hides everything in the weapon info window except Mt, Hit, Crit and Range
//Uncomment anything you want displayed again
(function () {
    ItemInfoWindow._configureWeapon = function (groupArray) {
        groupArray.appendObject(ItemSentence.AttackAndHit);
        groupArray.appendObject(ItemSentence.CriticalAndRange);
        //groupArray.appendObject(ItemSentence.WeaponLevelAndWeight);
        //groupArray.appendObject(ItemSentence.AdditionState);
        //groupArray.appendObject(ItemSentence.WeaponOption);
        //groupArray.appendObject(ItemSentence.Effective);
        //groupArray.appendObject(ItemSentence.ReverseWeapon);
        //groupArray.appendObject(ItemSentence.Skill);
        //groupArray.appendObject(ItemSentence.Only);
        //groupArray.appendObject(ItemSentence.Bonus);
    };
})();
