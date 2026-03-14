/**
 * To manage the root information.
 */
const root = {
    /**
     * It gets the version of the script.
     * @returns {number} version
     */
    getScriptVersion: function () {},

    /**
     * Reset the game.
     */
    resetGame: function () {},

    /**
     * Quit the game.
     */
    endGame: function () {},

    /**
     * It gets the screen state of the current application.
     * @returns {number} AppScreenMode value
     */
    getAppScreenMode: function () {},

    /**
     * Change the screen the current state of the application.
     * @param {number} mode AppScreenMode value
     */
    setAppScreenMode: function (mode) {},

    /**
     * Sets the size for software full screen. The default is full screen.
     * @param {number} width width
     * @param {number} height height
     */
    setAppSoftScreenSize: function (width, height) {},

    /**
     * In game.ini, get the value of how to run full screen.
     * @returns {number} 0 for hardware full screen, 1 for software full screen
     */
    getFullScreenModeFromGameIni: function () {},

    /**
     * Specify InterpolationMode in software full screen.
     * @param {number} mode InterpolationMode Value
     */
    setSoftwareFullScreenInterpolationMode: function (mode) {},

    /**
     * It gets whether the game is running as any language.
     * @returns {number} LanguageCode value
     */
    getLanguageCode: function () {},

    /**
     * Get which localization folder the game is using.
     * @returns {string} Localization folder name
     */
    getLocalizationFolder: function () {},

    /**
     * true if the specified value is input, otherwise it returns false.
     * @param {number} value InputType value
     * @returns {boolean} Boolean
     */
    isInputAction: function (value) {},

    /**
     * true if the specified value is continuously input, otherwise it returns false.
     * @param {number} value InputType value
     * @returns {boolean} Boolean
     */
    isInputState: function (value) {},

    /**
     * In the case of 60FPS true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isHighPerfMode: function () {},

    /**
     * In the case of test play true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isTestPlay: function () {},

    /**
     * If you want to skip the "Opening Events" it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isOpeningEventSkip: function () {},

    /**
     * true if the attack is sure to hit, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isAbsoluteHit: function () {},

    /**
     * If the system configuration is valid, true, otherwise it returns false.
     * @param {number} type SystemSettingsType value
     * @returns {boolean} Boolean
     */
    isSystemSettings: function (type) {},

    /**
     * Enable specific system settings.
     * @param {number} type SystemSettingsType value
     * @param {boolean} flag True to enable, false otherwise.
     */
    setSystemSettings: function (type, flag) {},

    /**
     * To start the measurement of time.
     */
    watchTime: function () {},

    /**
     * Get in milliseconds, the elapsed time from calling the watchTime.
     * @returns {number} elapsed time
     */
    getElapsedTime: function () {},

    /**
     * Get the most recent FPS.
     * @returns {number} FPS
     */
    getFPS: function () {},

    /**
     * And displays a message box.
     * @param {string} text message
     */
    msg: function (text) {},

    /**
     * It prints a string to the console.
     * @param {string} text Character string
     */
    log: function (text) {},

    /**
     * It clears the contents of the console.
     */
    resetConsole: function () {},

    /**
     * Save the screen shot. HardwareAcceleration of Game.ini is valid if it is set to 1.
     * @param {boolean} isMapAll Boolean
     * @returns {boolean} If you want the entire map to the target is true, otherwise specify the false.
     */
    saveScreenShot: function (isMapAll) {},

    /**
     * Open the map for the demonstration.
     * @param {number} mapId It specifies the ID of the map.
     * @returns {boolean} If you open the map true, otherwise it returns false.
     */
    openMap: function (mapId) {},

    /**
     * Close the map for the demonstration.
     */
    closeMap: function () {},

    /**
     * Create a resource handle.
     * @param {boolean} isRuntime true in the case of runtime, false otherwise.
     * @param {number} id id to see
     * @param {number} colorIndex Index of the color
     * @param {number} xSrc Image source of x-coordinate
     * @param {number} ySrc Image source of the y coordinate
     * @returns {ResourceHandle} Resource handle
     */
    createResourceHandle: function (isRuntime, id, colorIndex, xSrc, ySrc) {},

    /**
     * Create an empty resource handle.
     * @returns {ResourceHandle} Resource handle
     */
    createEmptyHandle: function () {},

    /**
     * Create a StateInvocation object.
     * @param {number} stateId State ID
     * @param {number} lnvValue Numerical values ​​(coefficients and probabilities)
     * @param {number} invType InvocationType Value
     * @returns {StateInvocation} StateInvocation Object
     */
    createStateInvocation: function (stateId, lnvValue, invType) {},

    /**
     * It gets a random number.
     * @returns {number} random number
     */
    getRandomNumber: function () {},

    /**
     * Sets the seed for random numbers.
     * @param {number} seed Seed
     */
    setRandomNumberSeed: function (seed) {},

    /**
     * Set the self-switch.
     * @param {number} index index
     * @param {boolean} flag If you want to turn it is true, false otherwise.
     */
    setSelfSwitch: function (index, flag) {},

    /**
     * Changing the background image, to erase the objects displayed in a display of the image.
     */
    resetVisualEventObject: function () {},

    /**
     * Draw the asynchronous event data.
     */
    drawAsyncEventData: function () {},

    /**
     * Draw a thumbnail image of the map.
     * @param {Map} map Map you want to draw
     */
    drawMapAll: function (map) {},

    /**
     * Draw a panel to position the index points.
     * @param {object} arr Index array
     * @param {Image} pic Panel image
     * @param {number} scrollCount Scroll value
     */
    drawWavePanel: function (arr, pic, scrollCount) {},

    /**
     * Change the color of the position the index points.
     * @param {object} arr Index array
     * @param {number} color color
     * @param {number} alpha Alpha value
     */
    drawFadeLight: function (arr, color, alpha) {},

    /**
     * It gets an object that can be drawn character chip of all units to custom.
     * @returns {object} An object that inherits from BaseCustomCharChip
     */
    getGlobalCustomRenderer: function () {},

    /**
     * By specifying the object of argument, you can draw the character chip of all units to custom. BaseCustomCharChip.setupCustomCharChip is called when you call the method. If you want to release the custom drawing will set the {}.
     * @param {object} obj An object that inherits from BaseCustomCharChip
     */
    setGlobalCustomRenderer: function (obj) {},

    /**
     * Draw the HP gauge.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {Unit} unit unit
     */
    drawCharChipHpGauge: function (x, y, unit) {},

    /**
     * Draw a "Map Unit Symbol".
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {Unit} unit unit
     */
    drawCharChipSymbol: function (x, y, unit) {},

    /**
     * Draw a state icon.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {Unit} unit unit
     */
    drawCharChipStateIcon: function (x, y, unit) {},

    /**
     * It gets the object to decorate the HP of character chip.
     * @param {number} type HpDecorationType value
     * @returns {GraphicsDecoration} Decorative objects
     */
    getHpDecoration: function (type) {},

    /**
     * It gets the object to decorate around the character chip.
     * @param {number} type SymbolDecorationType value
     * @returns {GraphicsDecoration} Decorative objects
     */
    getSymbolDecoration: function (type) {},

    /**
     * It gets the object to decorate the state icon and fusion icon of character chip.
     * @returns {GraphicsDecoration} Decorative objects
     */
    getIconDecoration: function () {},

    /**
     * To initiate a change in the "Change Background" of the event command.
     */
    startBackgroundChange: function () {},

    /**
     * Duplicate the item.
     * @param {Item} item Replicated items
     * @returns {Item} Replicated items
     */
    duplicateItem: function (item) {},

    /**
     * Set the upper limit value that exceeds the value that can be set in "Database" / "Max Stats".
     * @param {number} index Parameter index
     * @param {number} value New upper limit
     */
    setMaxParameter: function (index, value) {},

    /**
     * It gets the width of the window.
     * @returns {number} The width of the window
     */
    getWindowWidth: function () {},

    /**
     * It gets the height of the window.
     * @returns {number} The height of the window
     */
    getWindowHeight: function () {},

    /**
     * It gets the width of the game area.
     * @returns {number} The width of the game area
     */
    getGameAreaWidth: function () {},

    /**
     * It gets the height of the game area.
     * @returns {number} The height of the game area
     */
    getGameAreaHeight: function () {},

    /**
     * Gets the x-coordinate of the view port.
     * @returns {number} x-coordinate
     */
    getViewportX: function () {},

    /**
     * Gets the y-coordinate of the view port.
     * @returns {number} y coordinate
     */
    getViewportY: function () {},

    /**
     * Set the x and y coordinates of the viewport. Viewport, but represents the drawing reference position, always has the upper left corner will be the origin for the cache.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     */
    setViewportPos: function (x, y) {},

    /**
     * It gets an object that manages the information of the meta session.
     * @returns {MetaSession} MetaSession object
     */
    getMetaSession: function () {},

    /**
     * It gets an object that manages the information of the current session. If the map is open it will be returned GameSession. The current scene is in the case of SceneType.REST is returned RestSession.
     * @returns {GameSession} GameSession object or objects RestSession
     */
    getCurrentSession: function () {},

    /**
     * It gets an object that manages the external data.
     * @returns {ExternalData} MetaSession object
     */
    getExternalData: function () {},

    /**
     * It gets an object that manages the information of "Database".
     * @returns {BaseData} BaseData object
     */
    getBaseData: function () {},

    /**
     * It gets an object that manages the configuration information.
     * @returns {ConfigInfo} ConfigInfo object
     */
    getConfigInfo: function () {},

    /**
     * It gets an object that manages the user extension.
     * @returns {UserExtension} UserExtension object
     */
    getUserExtension: function () {},

    /**
     * It gets an object that manages the animation information.
     * @returns {AnimePreference} AnimePreference object
     */
    getAnimePreference: function () {},

    /**
     * It gets an object that manages the option of "Story Settings".
     * @returns {StoryPreference} StoryPreference object
     */
    getStoryPreference: function () {},

    /**
     * It gets an object that manages the option of "Base Settings".
     * @returns {RestPreference} RestPreference object
     */
    getRestPreference: function () {},

    /**
     * It gets an object that manages the save file.
     * @returns {LoadSaveManager} LoadSaveManager object
     */
    getLoadSaveManager: function () {},

    /**
     * It gets an object that manages the drawing.
     * @returns {GraphicsManager} GraphicsManager object
     */
    getGraphicsManager: function () {},

    /**
     * It gets an object that manages the media.
     * @returns {MediaManager} MediaManager object
     */
    getMediaManager: function () {},

    /**
     * It gets an object that manages the video.
     * @returns {VideoManager} VideoManager object
     */
    getVideoManager: function () {},

    /**
     * It gets an object that manages the material.
     * @returns {MaterialManager} MaterialManager object
     */
    getMaterialManager: function () {},

    /**
     * Returns an object that can access the Steam API.
     * @returns {SteamManager} SteamManager object
     */
    getSteamManager: function () {},

    /**
     * Obtains an object that can replace in-game images.
     * @returns {ModManager} ModManager object
     */
    getModManager: function () {},

    /**
     * Obtains an object that outputs and reads versus data (suser file).
     * @returns {UserFileManager} UserFileManager object
     */
    getUserFileManager: function () {},

    /**
     * Obtains an object to which special options can be set.
     * @returns {CustomizationOptionsManager} CustomizationOptionsManager object
     */
    getCustomizationOptionsManager: function () {},

    /**
     * Tracks resources currently loaded into memory.
     * @returns {ResourceProfiler} ResourceProfiler object
     */
    getResourceProfiler: function () {},

    /**
     * Gets an object that creates units dynamically.
     * @returns {ObjectGenerator} ObjectGenerator object
     */
    getObjectGenerator: function () {},

    /**
     * Gets an object that creates events dynamically.
     * @returns {EventGenerator} EventGenerator object
     */
    getEventGenerator: function () {},

    /**
     * Gets an object that controls the scene.
     * @returns {SceneController} SceneController object
     */
    getSceneController: function () {},

    /**
     * Gets the object you want to edit the data.
     * @returns {DataEditor} DataEditor object
     */
    getDataEditor: function () {},

    /**
     * It gets the object of "Screen Effect".
     * @returns {ScreenEffect} ScreenEffect object
     */
    getScreenEffect: function () {},

    /**
     * It gets the animation of "Resource Location".
     * @param {string} key Character string
     * @returns {Anime} Anime object
     */
    queryAnime: function (key) {},

    /**
     * It gets the media of "Resource Location".
     * @param {string} key Character string
     * @returns {ResourceHandle} Resource Handle objects
     */
    querySoundHandle: function (key) {},

    /**
     * It gets the image of "Resource Location".
     * @param {string} key Character string
     * @returns {ResourceHandle} Resource Handle objects
     */
    queryGraphicsHandle: function (key) {},

    /**
     * It gets the UI of "Resource Location".
     * @param {string} key Character string
     * @returns {Image} Image object
     */
    queryUI: function (key) {},

    /**
     * It gets the text UI of "Resource Location".
     * @param {string} key Character string
     * @returns {InteropTextUI} TextUI object
     */
    queryTextUI: function (key) {},

    /**
     * It gets the screen of "Resource Location".
     * @param {string} key Character string
     * @returns {InteropScreen} Screen object
     */
    queryScreen: function (key) {},

    /**
     * It gets the command of "Resource Location".
     * @param {string} key Character string
     * @returns {string} Character string
     */
    queryCommand: function (key) {},

    /**
     * It gets the width of "Large Face".
     * @returns {number} width
     */
    getLargeFaceWidth: function () {},

    /**
     * It gets the height of the "Large Face".
     * @returns {number} height
     */
    getLargeFaceHeight: function () {},

    /**
     * If you want to use the "Large Face" it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isLargeFaceUse: function () {},

    /**
     * If you want to darken if you do not speak it is true, otherwise it returns false.
     * @returns {number} Boolean
     */
    isMessageBlackOutEnabled: function () {},

    /**
     * If you are always displayed at the bottom of the message window is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isMessageWindowFixed: function () {},

    /**
     * It gets the default width of the character-chip resources.
     * @returns {number} width
     */
    getCharChipWidth: function () {},

    /**
     * It gets the default height of a character-chip resources.
     * @returns {number} height
     */
    getCharChipHeight: function () {},

    /**
     * It gets the default width of the icon resource.
     * @returns {number} width
     */
    getIconWidth: function () {},

    /**
     * It gets the default height of the icon resource.
     * @returns {number} height
     */
    getIconHeight: function () {},

    /**
     * It gets the default width of map-chip resources.
     * @returns {number} width
     */
    getMapChipWidth: function () {},

    /**
     * It gets the default height of the map-chip resources.
     * @returns {number} height
     */
    getMapChipHeight: function () {},

    /**
     * true if the event is currently being executed, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isEventSceneActived: function () {},

    /**
     * It gets an object that represents the current event command.
     * @returns {object} object
     */
    getEventCommandObject: function () {},

    /**
     * It gets the type of the current event command.
     * @returns {number} EventCommandType value
     */
    getEventCommandType: function () {},

    /**
     * It gets the index of on the event of the current event command.
     * @returns {number} index
     */
    getEventCommandIndex: function () {},

    /**
     * Exit the current event command.
     * @param {number} exitCode Exit code
     */
    endEventCommand: function (exitCode) {},

    /**
     * Get the exit code of the current event.
     * @param {number} exitCode Exit code
     */
    setEventExitCode: function (exitCode) {},

    /**
     * Set the end code for the current events.
     * @returns {number} Exit code
     */
    getEventExitCode: function () {},

    /**
     * Set the skip state for the current events.
     * @param {boolean} isSkipMode If you want to skip it is true, false otherwise.
     */
    setEventSkipMode: function (isSkipMode) {},

    /**
     * true if the current event is a skip state, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isEventSkipMode: function () {},

    /**
     * Events Gets a number that has been layered.
     * @returns {number} The number that has been layered
     */
    getChainEventCount: function () {},

    /**
     * It gets the event of a specified hierarchy.
     * @param {number} index index
     * @returns {Event} Events
     */
    getChainEvent: function (index) {},

    /**
     * Change to a specific scene from the current scene.
     * @param {number} sceneType SceneType value
     */
    changeScene: function (sceneType) {},

    /**
     * It gets the current scene. Run the event in the "Battle Prep", and call this method during the event, it will be returned SceneType.EVENT.
     * @returns {number} SceneType value
     */
    getCurrentScene: function () {},

    /**
     * Get the base scene. Run the event in the "Battle Prep", and call this method during the event, it will be returned SceneType.BATTLESETUP.
     * @returns {number} SceneType value
     */
    getBaseScene: function () {},

    /**
     * Newly added backlog data
     * @param {object} unitOrNpc Gets the number of backlog data.
     * @param {string} text Number of backlog data
     * @param {number} pos Get back log data.
     * @param {number} facialExpressionId Index of backlog data
     * @returns {BacklogCommand} Back log data
     */
    appendBacklogCommand: function (
        unitOrNpc,
        text,
        pos,
        facialExpressionId
    ) {},

    /**
     * It gets the number of backlog data.
     * @returns {number} The number of backlog data
     */
    getBacklogCommandCount: function () {},

    /**
     * Get the backlog data.
     * @param {number} index The index of backlog data
     * @returns {BacklogCommand} Backlog data
     */
    getBacklogCommand: function (index) {},

    /**
     * If the event background is displayed true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isEventBackgroundVisible: function () {},

    /**
     * Set the coordinates of the mouse.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     */
    setMousePos: function (x, y) {},

    /**
     * Gets the x coordinate of the mouse.
     * @returns {number} x-coordinate
     */
    getMouseX: function () {},

    /**
     * Gets the y coordinate of the mouse.
     * @returns {number} y coordinate
     */
    getMouseY: function () {},

    /**
     * true if the specified value is input, otherwise it returns false.
     * @param {number} value MouseType value
     * @returns {boolean} Boolean
     */
    isMouseAction: function (value) {},

    /**
     * true if the specified value is continuously input, otherwise it returns false.
     * @param {number} value MouseType value
     * @returns {boolean} Boolean
     */
    isMouseState: function (value) {},

    /**
     * Get the settings in the keyboard section of game.ini.
     * @param {string} keycode Specify the name of the entry in the keyboard section of game.ini. For example, 'SELECT'.
     * @returns {object} The keys associated with the entry are returned as an array. You can specify up to two keys, which are received as an array. For example, by default, 'SELECT' returns 'z' for arr[0] and 'enter' for arr[1].
     */
    getKeyBinding: function (keycode) {},

    /**
     * Change the contents of the keyboard section of game.ini and update game.ini after the game is finished.
     * @param {string} keycode Specify the name of the entry in the keyboard section of game.ini. For example, 'SELECT'.
     * @param {string} key1 Sets the new value for the entry. For example, to bind SELECT to x, specify setKeyBinding('SELECT', 'x', '');.
     * @param {string} key2 Specifies a second key to bind to, or '' if the second key does not exist.
     */
    setKeyBinding: function (keycode, key1, key2) {},

    /**
     * Get the settings in the gamepad section of game.ini.
     * @param {string} keycode Specify the name of the entry in the Gamepad section of game.ini. For example, 'SELECT'.
     * @returns {number} The value associated with the entry is returned as a number.
     */
    getGamepadBinding: function (keycode) {},

    /**
     * Change the contents of the Gamepad section of game.ini and update game.ini after the game is finished.
     * @param {string} keycode Specify the name of the entry in the Gamepad section of game.ini. For example, 'SELECT'.
     * @param {number} value Specifies a new value to be set for the entry.
     */
    setGamepadBinding: function (keycode, value) {},

    /**
     * Read the text in the test file.
     * @returns {string} file text
     */
    readTestFile: function () {},

    /**
     * Create a test file in your project folder and write some text to it.
     * @param {string} text file text
     */
    writeTestFile: function (text) {},
}

/**
 * To manage the information of the meta session. Meta session is in any scene, you can get in root.getMetaSession.
 */
const MetaSession = {
    /**
     * Get the gold.
     * @returns {number} gold
     */
    getGold: function () {},

    /**
     * Set the gold.
     * @param {number} gold gold
     */
    setGold: function (gold) {},

    /**
     * Get the bonus.
     * @returns {number} Bonus
     */
    getBonus: function () {},

    /**
     * Set the bonus.
     * @param {number} bonus Bonus
     */
    setBonus: function (bonus) {},

    /**
     * It gets the play time.
     * @returns {number} Play time
     */
    getPlayTime: function () {},

    /**
     * Get the "Difficulty".
     * @returns {Difficulty} "Difficulty"
     */
    getDifficulty: function () {},

    /**
     * Set the "Difficulty". If you call this method on a map (SceneType.FREE), the enemy boost will not change. If you call it on SceneType.BATTLESETUP, the enemy boost will change if you save and then load. In principle, it is recommended that you call it on SceneType.REST.
     * @param {Difficulty} difficulty "Difficulty"
     */
    setDifficulty: function (difficulty) {},

    /**
     * It gets an array of stock items.
     * @returns {object} Array of stock items
     */
    getStockItemArray: function () {},

    /**
     * Get a list of the player.
     * @returns {DataList} object
     */
    getTotalPlayerList: function () {},

    /**
     * It gets an object that manages the global switch.
     * @returns {SwitchTable} object
     */
    getGlobalSwitchTable: function () {},

    /**
     * It gets an object that manages the variable.
     * @param {number} index index
     * @returns {VariableTable} object
     */
    getVariableTable: function (index) {},

    /**
     * It gets the environment value for the specified index.
     * @param {number} lndex index
     * @returns {number} Environment value
     */
    getDefaultEnvironmentValue: function (lndex) {},

    /**
     * Set the environment value for the specified index.
     * @param {number} index index
     * @param {number} value Environment value
     */
    setDefaultEnvironmentValue: function (index, value) {},

    /**
     * true if the current map at "Battle Prep" not going to save, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isFirstSetup: function () {},

    /**
     * It gets the global parameters.
     * @returns {object} Global Parameters
     */
    global: function () {},
}

/**
 * To manage the information of the game session. Game session if the map is open, you can get in root.getCurrentSession. Scene map is open, SceneType.BATTLESETUP, SceneType.FREE, is SceneType.BATTLERESULT.
 */
const GameSession = {
    /**
     * Get a list of the player.
     * @returns {DataList} List of players
     */
    getPlayerList: function () {},

    /**
     * Get a list of "Enemy".
     * @returns {DataList} List of "Enemy"
     */
    getEnemyList: function () {},

    /**
     * Get a list of "Ally".
     * @returns {DataList} List of "Ally"
     */
    getAllyList: function () {},

    /**
     * Get a list of "Guest".
     * @returns {DataList} List of "Guest"
     */
    getGuestList: function () {},

    /**
     * Get a list of "Place Event".
     * @returns {DataList} List of "Place Event"
     */
    getPlaceEventList: function () {},

    /**
     * Get a list of "Auto Events".
     * @returns {DataList} List of "Auto Events"
     */
    getAutoEventList: function () {},

    /**
     * Get a list of "Talk Events".
     * @returns {DataList} List of "Talk Events"
     */
    getTalkEventList: function () {},

    /**
     * Get a list of "Opening Events".
     * @returns {DataList} List of "Opening Events"
     */
    getOpeningEventList: function () {},

    /**
     * Get a list of "Ending Events".
     * @returns {DataList} List of "Ending Events"
     */
    getEndingEventList: function () {},

    /**
     * Get a list of "Communication Events".
     * @returns {DataList} List of "Communication Events"
     */
    getCommunicationEventList: function () {},

    /**
     * Get a list of "Map Common Events".
     * @returns {DataList} List of "Map Common Events"
     */
    getMapCommonEventList: function () {},

    /**
     * Get the information of the current map. If Null is returned, it means that the current scene is SceneType.REST.
     * @returns {MapData} Information of the current map
     */
    getCurrentMapInfo: function () {},

    /**
     * It gets a boundary value of the forbidden entry area of the map.
     * @returns {number} Boundary value
     */
    getMapBoundaryValue: function () {},

    /**
     * Set the boundary value of the forbidden entry area of the map.
     * @param {number} value Boundary value
     */
    setMapBoundaryValue: function (value) {},

    /**
     * It gets a X boundary value of the forbidden entry area of the map.
     * @returns {number} x boundary value
     */
    getMapBoundaryValueExX: function () {},

    /**
     * It gets a Y boundary value of the forbidden entry area of the map.
     * @returns {number} y boundary value
     */
    getMapBoundaryValueExY: function () {},

    /**
     * Set the boundary value of the forbidden entry area of the map. It is used to separate the numbers in X and y coordinates.
     * @param {number} x x boundary value
     * @param {number} y y boundary value
     */
    setMapBoundaryValueEx: function (x, y) {},

    /**
     * Get the "Terrain" from the specified position.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {boolean} isLayer true If you want to get a transparent chip, false otherwise.
     * @returns {Terrain} Terrain information
     */
    getTerrainFromPos: function (x, y, isLayer) {},

    /**
     * Get the "Passable Direction" from the specified position.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {boolean} isLayer true to the transmission chip to a subject, false otherwise.
     * @returns {number} PassableDirectionFlag value
     */
    getPassableDirectionFlag: function (x, y, isLayer) {},

    /**
     * It gets the unit from the specified position. Unit is a non-display state are not taken into account.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @returns {Unit} unit
     */
    getUnitFromPos: function (x, y) {},

    /**
     * Gets a unit from the specified position, taking into account units that are hidden.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @returns {Unit} unit
     */
    getUnitFromPosEx: function (x, y) {},

    /**
     * Gets an array containing all the coordinates where the specified terrain is located. This method is faster than calling getTerrainFromPos on all the coordinates.
     * @param {string} name Name of the terrain
     * @returns {object} An array that stores the coordinates of the terrain. The following is an example of receiving it in the variable arr and using it: for (i = 0; i < arr.length) {a = arr[i];x=a[0];y=a[1];}
     */
    getPosArrayFromTerrainName: function (name) {},

    /**
     * Draw a map of the designated position as a starting point. Mapchip files named "editoronly" will not be drawn.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     */
    drawMapSet: function (x, y) {},

    /**
     * Draw the entire map
     */
    drawMapAll: function () {},

    /**
     * Draw a grid on the map.
     * @param {number} color color
     * @param {number} alpha Opacity
     */
    drawMapGrid: function (color, alpha) {},

    /**
     * Draw the forces of the unit.
     * @param {boolean} isPlayer If you want to draw the army is true, false otherwise.
     * @param {boolean} isEnemy false If you want to draw the enemy is true, otherwise
     * @param {boolean} isAlly true If you want to draw the allies, false otherwise.
     * @param {number} indexAnime The index in the animation of the unit
     * @param {number} indexAnime2 The index in the animation of the unit
     */
    drawUnitSet: function (
        isPlayer,
        isEnemy,
        isAlly,
        indexAnime,
        indexAnime2
    ) {},

    /**
     * Gets the x-coordinate of the map cursor.
     * @returns {number} The position of the cursor
     */
    getMapCursorX: function () {},

    /**
     * Gets the y-coordinate of the map cursor.
     * @returns {number} The position of the cursor
     */
    getMapCursorY: function () {},

    /**
     * Set the x-coordinate of the map cursor.
     * @param {number} x The position of the cursor
     */
    setMapCursorX: function (x) {},

    /**
     * Sets the y coordinate of the map cursor.
     * @param {number} y The position of the cursor
     */
    setMapCursorY: function (y) {},

    /**
     * Get the scroll value of pixels in the x-direction.
     * @returns {number} Scroll value
     */
    getScrollPixelX: function () {},

    /**
     * Get the scroll value of pixels in the y-direction.
     * @returns {number} Scroll value
     */
    getScrollPixelY: function () {},

    /**
     * Set the scroll value of pixels in the x-direction.
     * @param {number} x Scroll value
     */
    setScrollPixelX: function (x) {},

    /**
     * Set the scroll value of pixels in the y-direction.
     * @param {number} y Scroll value
     */
    setScrollPixelY: function (y) {},

    /**
     * The number of turns to get.
     * @returns {number} Number of turns
     */
    getTurnCount: function () {},

    /**
     * Set the number of turns.
     * @param {number} count Number of turns
     */
    setTurnCount: function (count) {},

    /**
     * The kind of turn to get.
     * @returns {number} TurnType value
     */
    getTurnType: function () {},

    /**
     * It sets the type of turn.
     * @param {number} value TurnType value
     */
    setTurnType: function (value) {},

    /**
     * It gets the starting state of the map.
     * @returns {number} StartEndType value
     */
    getStartEndType: function () {},

    /**
     * Set the start state of the map.
     * @param {number} type StartEndType value
     */
    setStartEndType: function (type) {},

    /**
     * Gets the relative number of turn
     * @returns {number} Relative number of turn
     */
    getRelativeTurnCount: function () {},

    /**
     * Sets the new relative number of turns
     * @param {number} count Relative number of turn
     */
    setRelativeTurnCount: function (count) {},

    /**
     * Count the relative turn.
     */
    increaseRelativeTurn: function () {},

    /**
     * Check the status of the current map.
     * @param {number} state MapStateType value
     * @param {boolean} flag true if the condition is satisfied, false otherwise.
     */
    setMapState: function (state, flag) {},

    /**
     * Check the status of the current map.
     * @param {number} state MapStateType value
     * @returns {boolean} true if the condition is satisfied, false otherwise.
     */
    isMapState: function (state) {},

    /**
     * It gets the active unit.
     * @returns {Unit} Active unit
     */
    getActiveEventUnit: function () {},

    /**
     * It sets the specified unit active.
     * @param {Unit} unit Unit that you want to activate
     */
    setActiveEventUnit: function (unit) {},

    /**
     * Get a list of trophy to be referred to after the map clear.
     * @returns {DataList} List of trophy
     */
    getTrophyPoolList: function () {},

    /**
     * It gets the object you want to edit the trophy.
     * @returns {TrophyEditor} Object you want to edit the trophy
     */
    getTrophyEditor: function () {},

    /**
     * Create a MapSimulator.
     * @returns {MapSimulator} MapSimulator object
     */
    createMapSimulator: function () {},

    /**
     * It gets the resource handle that represents a map chip of the designated position.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {boolean} isLayer true to the transmission chip to a subject, false otherwise.
     * @returns {ResourceHandle} Resource handle
     */
    getMapChipGraphicsHandle: function (x, y, isLayer) {},

    /**
     * Change the specified location map chip.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {boolean} isLayer true If you want to configure transparent chips, false otherwise.
     * @param {ResourceHandle} handle Resource handle
     */
    setMapChipGraphicsHandle: function (x, y, isLayer, handle) {},

    /**
     * Subscribes "Guest" to the army.
     */
    joinGuestUnit: function () {},

    /**
     * Remove the "Guest" from the army.
     */
    removeGuestUnit: function () {},
}

/**
 * It gets the session information in SceneType.REST.
 */
const RestSession = {
    /**
     * Get a list of "Place Event".
     * @returns {DataList} List of "Place Event"
     */
    getPlaceEventList: function () {},

    /**
     * Get a list of "Auto Events".
     * @returns {DataList} List of "Auto Events"
     */
    getAutoEventList: function () {},

    /**
     * Get a list of "Talk Events".
     * @returns {DataList} List of "Talk Events"
     */
    getTalkEventList: function () {},

    /**
     * Get a list of "Opening Events".
     * @returns {DataList} List of "Opening Events"
     */
    getOpeningEventList: function () {},

    /**
     * Get a list of "Ending Events".
     * @returns {DataList} List of "Ending Events"
     */
    getEndingEventList: function () {},

    /**
     * Get a list of "Communication Events".
     * @returns {DataList} List of "Communication Events"
     */
    getCommunicationEventList: function () {},

    /**
     * It gets the local switch table.
     * @returns {SwitchTable} Local switch table
     */
    getLocalSwitchTable: function () {},

    /**
     * Get the information of the current map
     * @returns {MapData} Always returned null.
     */
    getCurrentMapInfo: function () {},

    /**
     * Get the "Terrain" from the specified position. In the current version, it always returned null.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {boolean} isLayer true If you want to get a transparent chip, false otherwise.
     * @returns {Terrain} Always returned null.
     */
    getTerrainFromPos: function (x, y, isLayer) {},

    /**
     * Get the "Passable Direction" from the specified position. In the current version, it always 0 is returned.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {boolean} isLayer true to the transmission chip to a subject, false otherwise.
     * @returns {number} 0 is always returned.
     */
    getPassableDirectionFlag: function (x, y, isLayer) {},

    /**
     * Create a MapSimulator object. In the current version, it always returned null.
     * @returns {MapSimulator} Always returned null.
     */
    createMapSimulator: function () {},
}

/**
 * To manage the information of the environmental data.
 */
const ExternalData = {
    /**
     * Get the "Completed Count" of the game.
     * @returns {number} Clear the number of times
     */
    getGameClearCount: function () {},

    /**
     * Get the "Clear Points" of the game.
     * @returns {number} "Clear Points"
     */
    getGameClearPoint: function () {},

    /**
     * Set the "Clear Points" of the game. The clearpoints are saved to environment.evs when the save file is done.
     * @param {number} point "Clear Points"
     */
    setGameClearPoint: function (point) {},

    /**
     * Set the "Clear Points" of the game. Clearpoints are immediately saved to environment.evs.
     * @param {number} point "Clear Points"
     */
    setGameClearPointImmediately: function (point) {},

    /**
     * Gets the index of the save file was last active.
     * @returns {number} The index of save files
     */
    getActiveSaveFileIndex: function () {},

    /**
     * true if the save file that is currently loaded is recorded as having been cleared on the environment file, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isCurrentSaveFileCompleted: function () {},

    /**
     * true if the appearance of the specified unit has been recorded in the environment file, otherwise it returns false. If the current scene is not SceneType.TITLE, it will be examined may unit belongs to the army.
     * @param {Unit} unit unit
     * @returns {boolean} Boolean
     */
    isUnitRegistered: function (unit) {},

    /**
     * Returns true if the global switch id is recorded in environment.evs as on, false otherwise.
     * @param {number} switchId ID of the global switch
     * @returns {boolean} Boolean
     */
    isGlobalSwitchRegistered: function (switchId) {},

    /**
     * Get the "Env Parameters".
     * @returns {object} "Env Parameters"
     */
    env: function () {},
}

/**
 * "HP Recovery" to manage the information about the item.
 */
const RecoveryItemInfo = {
    /**
     * It gets the recovery value.
     * @returns {number} Recovery value
     */
    getRecoveryValue: function () {},

    /**
     * It gets a value that represents the way of recovery.
     * @returns {number} RecoveryType value
     */
    getRecoveryType: function () {},
}

/**
 * "Full Recovery" to manage the information about the item.
 */
const EntireRecoveryItemInfo = {
    /**
     * It gets the recovery value.
     * @returns {number} Recovery value
     */
    getRecoveryValue: function () {},

    /**
     * It gets a value that represents the way of recovery.
     * @returns {number} RecoveryType value
     */
    getRecoveryType: function () {},
}

/**
 * "Damage" to manage the information about the item.
 */
const DamageItemInfo = {
    /**
     * It gets the damage value.
     * @returns {number} Damage value
     */
    getDamageValue: function () {},

    /**
     * It gets a value that represents the way of damage.
     * @returns {number} DamageType value
     */
    getDamageType: function () {},

    /**
     * Get the hit rate.
     * @returns {number} Accuracy
     */
    getHit: function () {},
}

/**
 * "Class Change" to manage the information about the item.
 */
const ClassChangeItemInfo = {
    /**
     * If you want to display the object data in the item information window is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isClassInfoDisplayable: function () {},

    /**
     * If you want the level to 1 after Advances is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isLevelReset: function () {},

    /**
     * Gets the number of class groups
     * @returns {number} The number of class groups
     */
    getClassGroupCount: function () {},

    /**
     * Get the class group.
     * @param {number} index index
     * @returns {ClassGroup} Class group
     */
    getClassGroupData: function (index) {},
}

/**
 * "Learn Skill" to manage the information about the item.
 */
const SkillChangeItemInfo = {
    /**
     * Get the skills.
     * @returns {Skill} skill
     */
    getSkill: function () {},

    /**
     * Gets a value indicating the adjustment of skills.
     * @returns {number} IncreaseType value
     */
    getSkillControlType: function () {},
}

/**
 * "Unlock" to manage the information about the item.
 */
const KeyItemInfo = {
    /**
     * It gets a value that includes the type of key to be opened.
     * @returns {number} KeyFlag value
     */
    getKeyFlag: function () {},

    /**
     * true if you want to allow only the use of a particular class, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isAdvancedKey: function () {},
}

/**
 * "Teleportation" to manage the information about the item.
 */
const TeleportationItemInfo = {
    /**
     * It gets the value of the range.
     * @returns {number} The range of values
     */
    getRangeValue: function () {},

    /**
     * Gets a value indicating a range of types.
     * @returns {number} SelectionRangeType value
     */
    getRangeType: function () {},
}

/**
 * "Resurrection" to manage the information about the item.
 */
const ResurrectionItemInfo = {
    /**
     * It gets a value that represents the way of "Resurrection".
     * @returns {number} ResurrectionType value
     */
    getResurrectionType: function () {},
}

/**
 * "Repair" to manage the information about the item.
 */
const DurabilityItemInfo = {
    /**
     * Gets a value indicating how to change the endurance.
     * @returns {number} DurabilityChangeType value
     */
    getDurabilityChangeType: function () {},
}

/**
 * "Steal" to manage the information about the item.
 */
const StealItemInfo = {
    /**
     * It gets the flag on the take.
     * @returns {number} StealFlag value
     */
    getStealFlag: function () {},
}

/**
 * "Inflict State" to manage the information about the item.
 */
const StateItemInfo = {
    /**
     * It gets the state trigger object.
     * @returns {StateInvocation} State invoked object
     */
    getStateInvocation: function () {},
}

/**
 * "Cure State" to manage the information about the item.
 */
const StateRecoveryItemInfo = {
    /**
     * It gets the animation to be displayed in the time to recover the state.
     * @returns {Anime} Recovery anime
     */
    getStateRecoveryAnime: function () {},

    /**
     * It gets the state information of the recovery target.
     * @returns {StateGroup} Information of "Guard State"
     */
    getStateGroup: function () {},
}

/**
 * "Switch" to manage the information about the item.
 */
const SwitchItemInfo = {
    /**
     * Make the switch changes.
     */
    startSwitchChange: function () {},
}

/**
 * "Fusion" to manage the information about the item.
 */
const FusionItemInfo = {
    /**
     * Get the fusion data.
     * @returns {Fusion} Fusion data
     */
    getFusionData: function () {},

    /**
     * It gets the type of "Activation Rate".
     * @returns {number} InvocationType value
     */
    getInvocationType: function () {},

    /**
     * It gets the value of "Activation Rate".
     * @returns {number} The value of "Activation Rate"
     */
    getInvocationValue: function () {},
}

/**
 * "Transform" to manage the information about the item.
 */
const MetamorphozeItemInfo = {
    /**
     * Get a list of "Transform" to allow.
     * @returns {ReferenceList} list
     */
    getMetamorphozeReferenceList: function () {},
}

/**
 * To manage the information about the event.
 */
const Event = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * Get the icon resource handle.
     * @returns {ResourceHandle} Icon resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * It gets the type of event.
     * @returns {number} EventType value
     */
    getEventType: function () {},

    /**
     * Gets a value indicating already been executed.
     * @returns {number} EventExecutedType value
     */
    getExecutedMark: function () {},

    /**
     * Set a value that indicates already been executed.
     * @param {number} mark EventExecutedType value
     */
    setExecutedMark: function (mark) {},

    /**
     * If the event meets the execution condition is true, otherwise it returns false. This method cache to identify a valid event page.
     * @returns {boolean} Boolean
     */
    isEvent: function () {},

    /**
     * Run the event. If you want to run the unit event at the time of the battle, you call the startBattleEvent.
     */
    startEvent: function () {},

    /**
     * If you "Battle" unit event meets the execution condition is true, otherwise it returns false. This method cache to identify a valid event page.
     * @param {Unit} unit unit
     * @returns {boolean} Boolean
     */
    isBattleEvent: function (unit) {},

    /**
     * This method considers active battle events.
     * @param {Unit} unit Unit
     * @returns {boolean} Boolean
     */
    isBattleEventEx: function (unit) {},

    /**
     * Run the unit event of "Battle".
     * @param {Unit} unit unit
     */
    startBattleEvent: function (unit) {},

    /**
     * When you call this method, startEvent (startBattleEvent) will be to refer to the event page that has been cached. By setting the true, specific processing of events page in startEvent (startBattleEvent) are cut, it will reduce the call cost.
     * @param {boolean} enabled false If you want to use the cache is true, otherwise
     */
    useCachedEventPage: function (enabled) {},

    /**
     * It gets the associated with the event "Recollection Event".
     * @returns {Event} "Recollection Event"
     */
    getAssociateRecollectionEvent: function () {},

    /**
     * Get the information about the "Place Event".
     * @returns {PlaceEventInfo} "Place Event" information about the
     */
    getPlaceEventInfo: function () {},

    /**
     * Get the information about the "Talk Events".
     * @returns {TalkEventInfo} "Talk Events" information about the
     */
    getTalkEventInfo: function () {},

    /**
     * Get the information about the "Communication Events".
     * @returns {CommunicationEventInfo} "Communication Events" information about the
     */
    getCommunicationEventInfo: function () {},

    /**
     * Get the information about the "Recollection Event".
     * @returns {RecollectionEventInfo} "Recollection Event" information about the
     */
    getRecollectionEventInfo: function () {},

    /**
     * Get the information about the "Unit Event".
     * @returns {UnitEventInfo} "Unit Event" information about the
     */
    getUnitEventInfo: function () {},

    /**
     * Get the information about the "Map Common Events".
     * @returns {CommonEventInfo} "Map Common Events" information about the
     */
    getCommonEventInfo: function () {},

    /**
     * Get the information about the "Base Event".
     * @returns {RestEventInfo} "Base Event" information about the
     */
    getRestEventInfo: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the information about the "Place Event".
 */
const PlaceEventInfo = {
    /**
     * Gets the events of the x coordinate.
     * @returns {number} x-coordinate
     */
    getX: function () {},

    /**
     * Gets the events of the y-coordinate.
     * @returns {number} y coordinate
     */
    getY: function () {},

    /**
     * It gets the type of "Place Event".
     * @returns {number} PlaceEventType value
     */
    getPlaceEventType: function () {},

    /**
     * Get the trophy.
     * @returns {Trophy} Trophy
     */
    getTrophy: function () {},

    /**
     * Get the "Keyword" of custom.
     * @returns {string} "Keyword"
     */
    getCustomKeyword: function () {},

    /**
     * Get the "String" of custom.
     * @returns {string} "String"
     */
    getCommandText: function () {},

    /**
     * It gets the type of custom events.
     * @returns {number} PlaceCustomType value
     */
    getPlaceCustomType: function () {},

    /**
     * Returns true if the command should be displayed even if it has already been executed, false otherwise.
     * @returns {boolean} Boolean
     */
    isAlwaysVisible: function () {},

    /**
     * The shop data to get.
     * @returns {ShopData} Shop data
     */
    getShopData: function () {},

    /**
     * Change the map chip.
     */
    startMapChipChange: function () {},
}

/**
 * To manage the information about the "Talk Events".
 */
const TalkEventInfo = {
    /**
     * It gets the unit of "Source".
     * @returns {Unit} Unit of "Source"
     */
    getSrcUnit: function () {},

    /**
     * It gets the unit of "Destination".
     * @returns {Unit} Unit of "Destination"
     */
    getDestUnit: function () {},

    /**
     * true if possible conversation from either, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isMutual: function () {},

    /**
     * true if the talk unit is active, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isSrcActive: function () {},

    /**
     * It gets the text of the command.
     * @returns {string} text
     */
    getCommandText: function () {},
}

/**
 * To manage the information about the "Communication Events".
 */
const CommunicationEventInfo = {
    /**
     * It gets the type of communication.
     * @returns {number} CommunicationType value
     */
    getCommunicationEventType: function () {},
}

/**
 * It manages information about recalls events.
 */
const RecollectionEventInfo = {
    /**
     * Get the first of the "Unit".
     * @returns {Unit} Unit 1
     */
    getFirstUnit: function () {},

    /**
     * Of the second to get the "Unit".
     * @returns {Unit} Unit 2
     */
    getSecondUnit: function () {},

    /**
     * It gets the rank.
     * @returns {number} Rank
     */
    getRank: function () {},

    /**
     * "Random Background" true in the case of, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isRandomBackground: function () {},

    /**
     * If that can be displayed on the extra screen is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isExtraDisplayable: function () {},

    /**
     * It gets the resource handle of the thumbnail.
     * @returns {ResourceHandle} Thumbnail of the resource handle
     */
    getThumbnailResourceHandle: function () {},
}

/**
 * To manage the information about the "Unit Event".
 */
const UnitEventInfo = {
    /**
     * It gets the type of "Unit Event".
     * @returns {number} UnitEventType value
     */
    getUnitEventType: function () {},

    /**
     * It gets the unit to become a combat opponent.
     * @returns {Unit} unit
     */
    getBattleUnit: function () {},

    /**
     * It gets a string to be displayed at the time of command.
     * @returns {string} Character string
     */
    getCommandText: function () {},
}

/**
 * To manage the information about the communication event.
 */
const CommonEventInfo = {
    /**
     * It gets the type of event
     * @returns {number} EventType value
     */
    getEventType: function () {},

    /**
     * true if the execution order is earlier, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isFirst: function () {},
}

/**
 * To manage the information about the "Base Event".
 */
const RestEventInfo = {
    /**
     * It gets the type of "Auto Events"
     * @returns {number} RestAutoType value
     */
    getRestAutoType: function () {},

    /**
     * It gets the type of communication.
     * @returns {number} CommunicationType value
     */
    getCommunicationEventType: function () {},

    /**
     * It gets the image at the time of the conversation selection.
     * @returns {Image} image
     */
    getTalkImage: function () {},

    /**
     * It gets the display position of the image at the time of the conversation selection
     * @returns {number} MessagePos value
     */
    getPos: function () {},
}

/**
 * To manage the information of "Database".
 */
const BaseData = {
    /**
     * Get a list of the player.
     * @returns {DataList} List of players
     */
    getPlayerList: function () {},

    /**
     * Get the list of classes.
     * @returns {DataList} List of class
     */
    getClassList: function () {},

    /**
     * Get a list of weapons.
     * @returns {DataList} List of weapons
     */
    getWeaponList: function () {},

    /**
     * Get a list of items.
     * @returns {DataList} List of items
     */
    getItemList: function () {},

    /**
     * Get a list of skills.
     * @returns {DataList} List of skills
     */
    getSkillList: function () {},

    /**
     * Get a list of the state.
     * @returns {DataList} List of state
     */
    getStateList: function () {},

    /**
     * Get a list of weapon types.
     * @param {number} index index
     * @returns {DataList} List of weapon type
     */
    getWeaponTypeList: function (index) {},

    /**
     * Get a list of the class type.
     * @returns {DataList} List of class type
     */
    getClassTypeList: function () {},

    /**
     * Get a list of "Difficulty"
     * @returns {DataList} List of "Difficulty"
     */
    getDifficultyList: function () {},

    /**
     * Get a list of NPC
     * @param {number} index index
     * @returns {DataList} List of NPC
     */
    getNpcList: function (index) {},

    /**
     * Get a list of the class group.
     * @returns {DataList} A list of the class group
     */
    getClassGroupList: function () {},

    /**
     * Get a list of fonts.
     * @returns {DataList} Font list of
     */
    getFontList: function () {},

    /**
     * Get a list of "Races".
     * @returns {DataList} List of "Races"
     */
    getRaceList: function () {},

    /**
     * Get a list of "Fusion".
     * @returns {DataList} List of "Fusion"
     */
    getFusionList: function () {},

    /**
     * Get a list of "Transform".
     * @returns {DataList} List of "Transform"
     */
    getMetamorphozeList: function () {},

    /**
     * Get a list of "Original Data".
     * @param {number} index index
     * @returns {DataList} List of "Original Data"
     */
    getOriginalDataList: function (index) {},

    /**
     * Get a list of "Terrain Group".
     * @returns {DataList} List of "Terrain Group"
     */
    getTerrainGroupList: function () {},

    /**
     * Get a list of "Message Layout".
     * @returns {DataList} List of "Message Layout"
     */
    getMessageLayoutList: function () {},

    /**
     * Get a list of "Shop Layout".
     * @returns {DataList} List of "Shop Layout"
     */
    getShopLayoutList: function () {},

    /**
     * Get a list of "Command Layout".
     * @param {number} index index
     * @returns {DataList} List of "Command Layout"
     */
    getCommandLayoutList: function (index) {},

    /**
     * Get a list of "Recollection Event".
     * @returns {DataList} List of "Recollection Event"
     */
    getRecollectionEventList: function () {},

    /**
     * Get a list of "Characters".
     * @returns {DataList} List of "Characters"
     */
    getCharacterDictionaryList: function () {},

    /**
     * Get a list of "Glossary".
     * @returns {DataList} List of "Glossary"
     */
    getWordDictionaryList: function () {},

    /**
     * Get a list of "Gallery".
     * @returns {DataList} List of "Gallery"
     */
    getGalleryDictionaryList: function () {},

    /**
     * Get a list of "Sound Room".
     * @returns {DataList} List of "Sound Room"
     */
    getMediaDictionaryList: function () {},

    /**
     * Get a list of "Shop".
     * @returns {DataList} List of "Shop"
     */
    getRestShopList: function () {},

    /**
     * Get a list of "Bonus".
     * @returns {DataList} List of "Bonus"
     */
    getRestBonusList: function () {},

    /**
     * Get a list of "Quest".
     * @returns {DataList} List of "Quest"
     */
    getRestQuestList: function () {},

    /**
     * Get a list of "Area Settings" of "Fort".
     * @returns {DataList} List of "Area Settings"
     */
    getRestAreaList: function () {},

    /**
     * Get a list of "Resource Location".
     * @param {number} index index
     * @param {boolean} isRuntime If you want to target the runtime is true, false otherwise.
     * @returns {DataList} List of resource use location data
     */
    getInteropList: function (index, isRuntime) {},

    /**
     * Get a list of motion data.
     * @param {boolean} isRuntime If you want to target the runtime is true, false otherwise.
     * @returns {DataList} List of motion data
     */
    getMotionAnimationList: function (isRuntime) {},

    /**
     * Get a list of effect data.
     * @param {boolean} isRuntime If you want to target the runtime is true, false otherwise.
     * @returns {DataList} The list of effects data
     */
    getEffectAnimationList: function (isRuntime) {},

    /**
     * Get a list of image resources.
     * @param {number} type GraphicsType value
     * @param {boolean} isRuntime If you want to target the runtime is true, false otherwise.
     * @returns {DataList} List of image resources
     */
    getGraphicsResourceList: function (type, isRuntime) {},

    /**
     * Get a list of media resources.
     * @param {number} type MediaType value
     * @param {boolean} isRuntime If you want to target the runtime is true, false otherwise.
     * @returns {DataList} List of media resources
     */
    getMediaResourceList: function (type, isRuntime) {},

    /**
     * Get a list of UI resources.
     * @param {number} type UIType value
     * @param {boolean} isRuntime If you want to target the runtime is true, false otherwise.
     * @returns {DataList} List of UI resources
     */
    getUIResourceList: function (type, isRuntime) {},

    /**
     * Get a list of font resources.
     * @param {boolean} isRuntime If you want to target the runtime is true, false otherwise.
     * @returns {DataList} List of font resources
     */
    getFontResourceList: function (isRuntime) {},

    /**
     * Get a list of video resources.
     * @param {boolean} isRuntime If you want to target the runtime is true, false otherwise.
     * @returns {DataList} List of video resources
     */
    getVideoResourceList: function (isRuntime) {},

    /**
     * Get a list of bookmarks unit.
     * @returns {DataList} List of bookmarks unit
     */
    getBookmarkUnitList: function () {},

    /**
     * Get a list of bookmark events.
     * @returns {DataList} List of bookmark events
     */
    getBookmarkEventList: function () {},

    /**
     * Get a list of the map.
     * @returns {DataList} List of map
     */
    getMapList: function () {},

    /**
     * Get a list of map colors.
     * @returns {DataList} List of map colors
     */
    getMapColorList: function () {},

    /**
     * It gets the shop data of the clear point.
     * @returns {RestShop} Shop data
     */
    getPointShop: function () {},

    /**
     * It gets the value of the handling of the remaining points.
     * @returns {number} ClearPointAction value
     */
    getClearPointAction: function () {},
}

/**
 * To manage the configuration information.
 */
const ConfigInfo = {
    /**
     * Get the game of the window title.
     * @returns {string} Window title
     */
    getWindowTitle: function () {},

    /**
     * Get the game of the title.
     * @returns {string} Game title
     */
    getGameTitle: function () {},

    /**
     * It gets a string of staff roll.
     * @returns {string} Character string
     */
    getStaffRollString: function () {},

    /**
     * Gets the maximum value corresponding to the specified index.
     * @param {number} index index
     * @returns {number} Maximum value
     */
    getMaxValue: function (index) {},

    /**
     * It gets the maximum value of the corresponding parameter to the specified index.
     * @param {number} index index
     * @returns {number} Maximum value
     */
    getMaxParameter: function (index) {},

    /**
     * true case corresponding to the specified index "Game Options" is valid, otherwise it returns false.
     * @param {number} index index
     * @returns {number} Boolean
     */
    getBattleValue: function (index) {},

    /**
     * Corresponding to the specified index to get the "Battle Values".
     * @param {number} index index
     * @returns {boolean} "Battle Values"
     */
    isGameOptionOn: function (index) {},

    /**
     * It gets the index of "Resolution".
     * @returns {number} index
     */
    getResolutionIndex: function () {},
}

/**
 * Manage the user extension.
 */
const UserExtension = {
    /**
     * It returns the name of the folder that contains the voice.
     * @returns {string} Character string
     */
    getVoiceCategoryName: function () {},

    /**
     * It returns the index of the voice of the extension.
     * @returns {number} index
     */
    getVoiceExtIndex: function () {},

    /**
     * Get the "Critical Coefficient(%)".
     * @returns {number} coefficient
     */
    getCriticalFactor: function () {},

    /**
     * Get the "Effective Coefficient (%)".
     * @returns {number} coefficient
     */
    getEffectiveFactor: function () {},

    /**
     * Get the "Support Range".
     * @returns {number} "Support Range"
     */
    getSupportRange: function () {},

    /**
     * Get the "Bonus Exp Rate".
     * @returns {number} "Bonus Exp Rate"
     */
    getExperienceRate: function () {},

    /**
     * If you want to play a sound effect in the demo map is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isDemoMapSoundEnabled: function () {},

    /**
     * It gets the ID of the map, including the opening event for the demonstration.
     * @returns {number} ID of map
     */
    getDemoMapId: function () {},

    /**
     * Get the experience value coefficient in the case of junior class has been fighting with the senior class.
     * @returns {number} Experience Factor
     */
    getLowExperienceFactor: function () {},

    /**
     * Senior class will get the experience value coefficient in the case where the battle with the junior class.
     * @returns {number} Experience Factor
     */
    getHighExperienceFactor: function () {},

    /**
     * If you want to view the motion image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isMotionGraphicsEnabled: function () {},

    /**
     * If you are the weapon of endurance to the infinite it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isWeaponInfinity: function () {},

    /**
     * If you want to allow an item increases or decreases in the guest unit is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGuestTradeEnabled: function () {},

    /**
     * If the possession of the item when the item purchase is sent to the stock even one cup is true, otherwise it returns false. In the battle preparation screen, it will always be on the specifications to be sent to the stock. Unit that can display the stock command command is always on the specifications to be sent to the stock.
     * @returns {boolean} Boolean
     */
    isFullItemTransportable: function () {},

    /**
     * If you want to experience value at the time of defeating the enemy of the class to "Optional Exp" it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isFixedExperience: function () {},

    /**
     * If the parameter upper limit of the class is valid, true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isClassLimitEnabled: function () {},

    /**
     * true if to take into account the bonus in the skill trigger, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isSkillInvocationBonusEnabled: function () {},

    /**
     * true if the re-moved to the specified unit command is allowed, otherwise it returns false.
     * @param {number} id id of command
     * @returns {boolean} Boolean
     */
    isUnitCommandMovable: function (id) {},

    /**
     * true If you want to allow a counterattack at the time of combat, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isCounterattackAllowed: function () {},

    /**
     * When dealing with the death of the leader as a game over true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isLeaderGameOver: function () {},

    /**
     * If you want to display a message at the time of weapon damage it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isWeaponLostDisplayable: function () {},

    /**
     * If you want to remove the drop trophy at the time of weapon damage is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isDropTrophyLinked: function () {},

    /**
     * If you want to display the "Effective Targets" of items and skills in the game it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isAggregationVisible: function () {},

    /**
     * If you want to view the animation at the time of skill trigger is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isSkillAnimeEnabled: function () {},

    /**
     * If you want to display the unit name in the message is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isMessageUnitNameDisplayable: function () {},

    /**
     * true if you want to always simple combat the allies of combat, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isAllyBattleFixed: function () {},

    /**
     * true If you can also doping parameters of the growth rate of 0, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isFullDopingEnabled: function () {},

    /**
     * If you want to display the skill level in the game it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isWeaponLevelDisplayable: function () {},

    /**
     * If you want to view the physique in the game it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isBuildDisplayable: function () {},

    /**
     * If the enemy AI to attack any power 0 is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isAIDamageZeroAllowed: function () {},

    /**
     * If the enemy AI to attack even hit 0 it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isAIHitZeroAllowed: function () {},

    /**
     * If you can destroy a unit in turn damage it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isTurnDamageFinishAllowed: function () {},
}

/**
 * To manage the "Animation Information" in animation.
 */
const AnimePreference = {
    /**
     * It gets the width of "Boundary Line".
     * @returns {number} width
     */
    getBoundaryWidth: function () {},

    /**
     * It gets the height of the "Boundary Line".
     * @returns {number} height
     */
    getBoundaryHeight: function () {},

    /**
     * Get a list of the original motion.
     * @param {number} templateIndex The index of the template
     * @returns {DataList} List of motion
     */
    getOriginalMotionList: function (templateIndex) {},

    /**
     * It gets the motion name from the motion ID.
     * @param {number} templateIndex The index of the template
     * @param {number} motionId Motion ID
     * @returns {string} Motion name
     */
    getMotionName: function (templateIndex, motionId) {},

    /**
     * If the point of view at the time of real combat is fixed it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isFixedFocus: function () {},

    /**
     * If you want to skip the moving motion during the real battle is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isMoveMotionDisabled: function () {},

    /**
     * The initial position of the motion returns false if true, is not the case if you want to conform to the first frame of "Move".
     * @returns {boolean} Boolean
     */
    isDirectMagicWeaponAttackAllowed: function () {},

    /**
     * true if taken into account also "Magic Weapon Attack" a direct attack, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isMoveMotionPosInherited: function () {},

    /**
     * If you want to view the cut-in in the center of the screen is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isCutinCentering: function () {},

    /**
     * Gets the X offset of the cut-in.
     * @returns {number} X offset
     */
    getCutinOffsetX: function () {},

    /**
     * Gets the Y offset of the cut-in.
     * @returns {number} Y offset
     */
    getCutinOffsetY: function () {},

    /**
     * Get the "Motion Offset in Game".
     * @param {number} versusType VersusType value
     * @returns {number} Motion offset
     */
    getMotionOffset: function (versusType) {},

    /**
     * It gets the interpolation mode at the time of sprite drawing.
     * @returns {number} InterpolationMode value
     */
    getInterpolationMode: function () {},

    /**
     * Motion that are outside of the screen in the real battle is to get the value of shifting of when you activate the skill.
     * @returns {number} Offset value
     */
    getSkillAnimeOffset: function () {},

    /**
     * If you want to see the effect in default of direction is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isEffectDefaultStyle: function () {},
}

/**
 * Get the option of view of the world setting.
 */
const StoryPreference = {
    /**
     * If you want to display the page number of the "Characters" it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isCharacterNumberVisible: function () {},

    /**
     * If you want to display the page number of the "Glossary" it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isWordNumberVisible: function () {},

    /**
     * If you want to display the page number of the "Gallery" it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGalleryNumberVisible: function () {},

    /**
     * If you want to display an enlarged view of the "Gallery" it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGalleryScaled: function () {},

    /**
     * If you want to always be viewed with "Gallery" it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGalleryPublic: function () {},

    /**
     * If you want to be viewed all the data at the time of the test play is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isTestPlayPublic: function () {},
}

/**
 * Get the information about the "Base Settings".
 */
const RestPreference = {
    /**
     * Get the "Save File Title".
     * @returns {string} "Save File Title"
     */
    getCompleteSaveTitle: function () {},

    /**
     * Get a valid current satisfying the condition "Area Settings".
     * @returns {RestArea} Base area
     */
    getActiveRestArea: function () {},

    /**
     * Get a valid current satisfying the condition "Area Settings". To determine a specific map on the base.
     * @param {number} mapId Map ID
     * @returns {RestArea} RestArea object
     */
    getActiveRestAreaFromMapId: function (mapId) {},

    /**
     * If you want to view the shop in a list when the game is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isShopListView: function () {},

    /**
     * If you want to view the bonus in a list format in the game at the time of true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isBonusListView: function () {},

    /**
     * If you want to view the image in a conversation Select the game at the time of true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isTalkGraphicsEnabled: function () {},

    /**
     * If you want to display the total number of enemy in the quest of the game it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isEnemyTotalEnabled: function () {},

    /**
     * If you want to display the average level of the enemy in the quest of the game it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isEnemyAverageLevelEnabled: function () {},
}

/**
 * To manage the information of "Characters" in "Story Settings".
 */
const CharacterDictionary = {
    /**
     * It gets the name of the data.
     * @returns {string} The name of the data
     */
    getName: function () {},

    /**
     * Get the official name of the data.
     * @returns {string} The official name of the data
     */
    getFormalName: function () {},

    /**
     * Get the icon of the resource handle.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * It gets the number of pages of text.
     * @returns {number} number of pages
     */
    getPageCount: function () {},

    /**
     * It gets the text of the specified page.
     * @param {number} index The index of the page
     * @returns {string} text
     */
    getPageText: function (index) {},

    /**
     * true if the specified page is viewable in, otherwise it returns false.
     * @param {number} index The index of the page
     * @returns {boolean} Boolean
     */
    isPageEnabled: function (index) {},

    /**
     * It gets the character illustrations.
     * @returns {Image} image
     */
    getCharIllustImage: function () {},

    /**
     * It gets the resource handle.
     * @returns {ResourceHandle} Resource handle
     */
    getResourceHandle: function () {},

    /**
     * Gets the offset x-coordinate of the image.
     * @returns {number} x-coordinate
     */
    getImageOffsetX: function () {},

    /**
     * It gets the offset y coordinates of the image.
     * @returns {number} y coordinate
     */
    getImageOffsetY: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the information of "Glossary" in "Story Settings".
 */
const WordDictionary = {
    /**
     * It gets the name of the data.
     * @returns {string} The name of the data
     */
    getName: function () {},

    /**
     * Get the official name of the data.
     * @returns {string} The official name of the data
     */
    getFormalName: function () {},

    /**
     * Get the icon of the resource handle.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * It gets the number of pages of text.
     * @returns {number} number of pages
     */
    getPageCount: function () {},

    /**
     * It gets the text of the specified page.
     * @param {number} index The index of the page
     * @returns {string} text
     */
    getPageText: function (index) {},

    /**
     * true if the specified page is viewable in, otherwise it returns false.
     * @param {number} index The index of the page
     * @returns {boolean} Boolean
     */
    isPageEnabled: function (index) {},

    /**
     * It gets the image.
     * @returns {Image} image
     */
    getPictureImage: function () {},

    /**
     * Gets the offset x-coordinate of the image.
     * @returns {number} x-coordinate
     */
    getImageOffsetX: function () {},

    /**
     * It gets the offset y coordinates of the image.
     * @returns {number} y coordinate
     */
    getImageOffsetY: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the information of "Gallery" in "Story Settings".
 */
const GraphicsDictionary = {
    /**
     * It gets the name of the data.
     * @returns {string} The name of the data
     */
    getName: function () {},

    /**
     * It gets the description of the data.
     * @returns {string} Description of the data
     */
    getDescription: function () {},

    /**
     * Get the icon of the resource handle.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * It gets the number of pages of the image.
     * @returns {number} number of pages
     */
    getPageCount: function () {},

    /**
     * It gets the resource handle that represents the image.
     * @param {number} index The index of the page
     * @returns {ResourceHandle} Resource handle
     */
    getGraphicsResourceHandle: function (index) {},

    /**
     * It gets the type that represents the image.
     * @param {number} index The index of the page
     * @returns {number} type
     */
    getGraphicsType: function (index) {},

    /**
     * true if the specified page is viewable in, otherwise it returns false.
     * @param {number} index The index of the page
     * @returns {boolean} Boolean
     */
    isPageEnabled: function (index) {},

    /**
     * It gets the resource handle of the thumbnail.
     * @returns {ResourceHandle} Thumbnail of the resource handle
     */
    getThumbnailResourceHandle: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the information of "Sound Room" in "Story Settings".
 */
const MediaDictionary = {
    /**
     * It gets the name of the data.
     * @returns {string} The name of the data
     */
    getName: function () {},

    /**
     * It gets the description of the data.
     * @returns {string} Description of the data
     */
    getDescription: function () {},

    /**
     * Get the icon of the resource handle.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * It gets the media of the resource handle.
     * @returns {ResourceHandle} Resource handle
     */
    getMediaHandle: function () {},

    /**
     * It gets the type of media.
     * @returns {number} MediaType value
     */
    getMediaType: function () {},

    /**
     * If the media is viewable true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isMediaEnabled: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the shop information of the base.
 */
const RestShop = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * Get the "Shop Layout".
     * @returns {ShopLayout} "Shop Layout"
     */
    getShopLayout: function () {},

    /**
     * It gets an array of shop items.
     * @returns {object} Array
     */
    getShopItemArray: function () {},

    /**
     * It gets an array of stock items.
     * @returns {object} Array
     */
    getInventoryNumberArray: function () {},

    /**
     * It gets an array that contains the "Required Bonus".
     * @returns {object} Array
     */
    getBonusNumberArray: function () {},

    /**
     * If you meet the conditions true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isShopDisplayable: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the quest information of "Fort".
 */
const RestQuest = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * It gets the capture map.
     * @returns {Map} Cheats map
     */
    getFreeMap: function () {},

    /**
     * Get the "Event when Available".
     * @returns {Event} Capture possible when the event
     */
    getEnabledEvent: function () {},

    /**
     * Get the "Event when Unavailable".
     * @returns {Event} Cheats impossible when the event
     */
    getDisabledEvent: function () {},

    /**
     * true if to hide the map if it is not possible capture, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isPrivateQuest: function () {},

    /**
     * Get the "Rewards".
     * @returns {DataList} Remuneration list
     */
    getRewardList: function () {},

    /**
     * true if it meets the "Victory Conditions", otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isQuestAvailable: function () {},

    /**
     * true if it meets the "Display Conditions", otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isQuestDisplayable: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the "Area Settings" bases.
 */
const RestArea = {
    /**
     * It gets the id.
     * @returns {number} id
     */
    getId: function () {},

    /**
     * It gets the area name.
     * @returns {string} Area name
     */
    getAreaName: function () {},

    /**
     * It gets the background.
     * @returns {Image} background
     */
    getBackgroundImage: function () {},

    /**
     * Get the music of the resource handle.
     * @returns {ResourceHandle} The music of the resource handle
     */
    getMusicHandle: function () {},

    /**
     * In the case when the display condition is satisfied true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isAreaDisplayable: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage text information in the heading image and menu window.
 */
const InteropTextUI = {
    /**
     * It gets the font.
     * @returns {Font} font
     */
    getFont: function () {},

    /**
     * It gets the color.
     * @returns {number} color
     */
    getColor: function () {},

    /**
     * It gets the UI image.
     * @returns {Image} UI image
     */
    getUIImage: function () {},
}

/**
 * To manage the screen information.
 */
const InteropScreen = {
    /**
     * It gets the screen of the title.
     * @returns {string} title
     */
    getScreenTitleName: function () {},

    /**
     * It gets the internal name of the screen.
     * @returns {string} The internal name
     */
    getScreenInternalName: function () {},

    /**
     * It gets the screen of the background image.
     * @returns {Image} background image
     */
    getScreenBackgroundImage: function () {},

    /**
     * It gets the screen music of the resource handle of.
     * @returns {ResourceHandle} Resource handle
     */
    getScreenMusicHandle: function () {},

    /**
     * Get the TextUI information of the upper frame.
     * @returns {InteropTextUI} TextUI
     */
    getTopFrameTextUI: function () {},

    /**
     * Get the TextUI information of the lower frame.
     * @returns {InteropTextUI} TextUI
     */
    getBottomFrameTextUI: function () {},
}

/**
 * To manage the data that make up the shop screen.
 */
const ShopLayout = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * It gets a string of the command display.
     * @returns {string} Character string
     */
    getCommandName: function () {},

    /**
     * Gets the resource handle that shows the face of a shopkeeper.
     * @returns {ResourceHandle} Resource handle
     */
    getFaceResourceHandle: function () {},

    /**
     * It gets the screen object.
     * @returns {InteropScreen} Screen object
     */
    getShopInteropData: function () {},

    /**
     * Get the conversation message in the shop.
     * @param {number} index index
     * @returns {string} message
     */
    getMessage: function (index) {},
}

/**
 * To manage the data that make up the UI of the message.
 */
const MessageLayout = {
    /**
     * Gets the x-coordinate of the window.
     * @returns {number} x-coordinate
     */
    getWindowX: function () {},

    /**
     * Gets the y-coordinate of the window.
     * @returns {number} y coordinate
     */
    getWindowY: function () {},

    /**
     * Gets the x-coordinate of the text.
     * @returns {number} x-coordinate
     */
    getTextX: function () {},

    /**
     * Gets the y-coordinate of the text.
     * @returns {number} y coordinate
     */
    getTextY: function () {},

    /**
     * Gets the x-coordinate of the name.
     * @returns {number} x-coordinate
     */
    getNameX: function () {},

    /**
     * Gets the y-coordinate of the name.
     * @returns {number} y coordinate
     */
    getNameY: function () {},

    /**
     * Gets the x-coordinate of the cursor.
     * @returns {number} x-coordinate
     */
    getCursorX: function () {},

    /**
     * It gets the y coordinates of the cursor.
     * @returns {number} y coordinate
     */
    getCursorY: function () {},

    /**
     * It gets the x-coordinate of the "Face Graphic".
     * @returns {number} x-coordinate
     */
    getFaceX: function () {},

    /**
     * Gets the y-coordinate of the "Face Graphic".
     * @returns {number} y coordinate
     */
    getFaceY: function () {},

    /**
     * Gets the x-coordinate of the "Char Illust".
     * @returns {number} x-coordinate
     */
    getCharIllustX: function () {},

    /**
     * Gets the y-coordinate of the "Char Illust".
     * @returns {number} y coordinate
     */
    getCharIllustY: function () {},

    /**
     * It gets the display format of "Face Graphic".
     * @returns {number} FaceVisualType value
     */
    getFaceVisualType: function () {},

    /**
     * If you want to reverse the "Face Graphic" it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isFaceReverse: function () {},

    /**
     * true if "Face Graphic" to consider the expression, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isFacialExpressionEnabled: function () {},

    /**
     * It gets the display format of the Standing picture.
     * @returns {number} CharIllustVisualType value
     */
    getCharIllustVisualType: function () {},

    /**
     * If you want to reverse the "Char Illust" it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isCharIllustReverse: function () {},

    /**
     * true if "Char Illust" to consider the expression, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isCharIllustFacialExpressionEnabled: function () {},

    /**
     * Get the TextUI information for the message window.
     * @returns {InteropTextUI} TextUI
     */
    getWindowTextUI: function () {},

    /**
     * Get the TextUI information for the name heading.
     * @returns {InteropTextUI} TextUI
     */
    getNameTextUI: function () {},

    /**
     * It gets the image of the page cursor.
     * @returns {Image} Image
     */
    getPageCursorUI: function () {},

    /**
     * It gets the page break sound.
     * @returns {ResourceHandle} Resource handle
     */
    getPageSoundHandle: function () {},

    /**
     * It gets the voice sound.
     * @returns {ResourceHandle} Resource handle
     */
    getVoiceSoundHandle: function () {},
}

/**
 * To manage the data that make up the command.
 */
const CommandLayout = {
    /**
     * It gets the name of the command.
     * @returns {string} Character string
     */
    getName: function () {},

    /**
     * It gets the category of command.
     * @returns {number} CommandLayoutType value
     */
    getCommandLayoutType: function () {},

    /**
     * It gets the operation contents of the command.
     * @returns {number} CommandActionType value
     */
    getCommandActionType: function () {},

    /**
     * It gets the display format of the command.
     * @returns {number} CommandVisibleType value
     */
    getCommandVisibleType: function () {},

    /**
     * true if the set global switches is turned on, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGlobalSwitchOn: function () {},
}

/**
 * To manage the information about the "Show Message" of the event command.
 */
const CommandMessageShow = {
    /**
     * It gets the drawing text.
     * @returns {string} Drawing text
     */
    getText: function () {},

    /**
     * It gets a value that indicates the position at which to draw the text.
     * @returns {number} MessagePos value
     */
    getTextPosValue: function () {},

    /**
     * Gets a value indicating a target to issue a message.
     * @returns {number} SpeakerType value
     */
    getSpeakerType: function () {},

    /**
     * It gets the target unit.
     * @returns {Unit} The target unit
     */
    getUnit: function () {},

    /**
     * It gets the target NPC.
     * @returns {Npc} Target NPC
     */
    getNpc: function () {},

    /**
     * It gets the expression ID of the face image.
     * @returns {number} Facial expression ID
     */
    getFacialExpressionId: function () {},
}

/**
 * To manage the information about the "Narration Message" of the event command.
 */
const CommandMessageTerop = {
    /**
     * It gets the drawing text.
     * @returns {string} Drawing text
     */
    getText: function () {},

    /**
     * It gets a value that indicates the position at which to draw the text.
     * @returns {number} MessagePos value
     */
    getTextPosValue: function () {},

    /**
     * If you want to display the window is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isTeropWindowDisplayable: function () {},

    /**
     * Gets a value indicating a target to issue a message.
     * @returns {number} SpeakerType value
     */
    getSpeakerType: function () {},

    /**
     * It gets the target unit.
     * @returns {Unit} The target unit
     */
    getUnit: function () {},

    /**
     * It gets the target NPC.
     * @returns {Npc} Target NPC
     */
    getNpc: function () {},

    /**
     * It gets the expression ID of the face image.
     * @returns {number} Facial expression ID
     */
    getFacialExpressionId: function () {},
}

/**
 * To manage the information about the "Simple Message" of the event command.
 */
const CommandStillMessage = {
    /**
     * It gets the drawing text.
     * @returns {string} Drawing text
     */
    getText: function () {},

    /**
     * Gets a value indicating a target to issue a message.
     * @returns {number} SpeakerType value
     */
    getSpeakerType: function () {},

    /**
     * It gets the target unit.
     * @returns {Unit} The target unit
     */
    getUnit: function () {},

    /**
     * It gets the target NPC.
     * @returns {Npc} Target NPC unit
     */
    getNpc: function () {},

    /**
     * It gets the expression ID of the face image.
     * @returns {number} Facial expression ID
     */
    getFacialExpressionId: function () {},
}

/**
 * To manage the information about the "Message Scroll" of the event command.
 */
const CommandMessageScroll = {
    /**
     * It gets the drawing text.
     * @returns {string} Drawing text
     */
    getText: function () {},

    /**
     * Gets the x-coordinate of the drawing range.
     * @returns {number} x-coordinate of the drawing range
     */
    getX: function () {},

    /**
     * If you want to draw in the middle it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isCenterShow: function () {},

    /**
     * It gets the drawing speed.
     * @returns {number} SpeedType value
     */
    getSpeedType: function () {},

    /**
     * If treated as a staff roll true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isStaffRoll: function () {},
}

/**
 * To manage the information about the "Message Title" of the event command.
 */
const CommandMessageTitle = {
    /**
     * It gets the drawing text.
     * @returns {string} Drawing text
     */
    getText: function () {},

    /**
     * Gets the x-coordinate of the drawing position.
     * @returns {number} x-coordinate
     */
    getX: function () {},

    /**
     * Gets the y-coordinate of the drawing position.
     * @returns {number} y coordinate
     */
    getY: function () {},

    /**
     * If you want to draw in the middle it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isCenterShow: function () {},

    /**
     * true If you would like to target a particular background, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isBackTarget: function () {},
}

/**
 * To manage the information about the "Info Window" of the event command.
 */
const CommandInfoWindow = {
    /**
     * It gets the drawing text.
     * @returns {string} Drawing text
     */
    getMessage: function () {},

    /**
     * It gets a value that represents the type of information.
     * @returns {number} Value that represents the type of information
     */
    getInfoType: function () {},

    /**
     * Gets the x-coordinate of the display position.
     * @returns {number} x-coordinate
     */
    getX: function () {},

    /**
     * Gets the y coordinate of the display position.
     * @returns {number} y coordinate
     */
    getY: function () {},

    /**
     * If you want to display in the center it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isCenterShow: function () {},

    /**
     * true If you would like to target a particular background, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isBackTarget: function () {},
}

/**
 * To manage the information about the "Show Choices" of the event command.
 */
const CommandChoiceShow = {
    /**
     * It gets the number of choices.
     * @returns {number} Number of choices
     */
    getChoiceCount: function () {},

    /**
     * It gets a string that represents the contents of the choices.
     * @param {number} index Index options
     * @returns {string} Target string
     */
    getMessage: function (index) {},

    /**
     * It gets the ID of the self-switch associated with the choices.
     * @param {number} index Index options
     * @returns {number} ID of the self-switch
     */
    getSelfSwitchId: function (index) {},

    /**
     * It gets the resource handle of the icon associated with the choices.
     * @param {number} index Index options
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function (index) {},

    /**
     * If the choice meets the display condition true, otherwise it returns false.
     * @param {number} index Index options
     * @returns {boolean} Boolean
     */
    isChoiceDisplayable: function (index) {},

    /**
     * true if you want to display in two rows, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isTwoLines: function () {},

    /**
     * Clears the currently enabled self-switch.
     */
    resetSelfSwitches: function () {},
}

/**
 * To manage the information about the "Change Background" of the event command.
 */
const CommandBackgroundChange = {
    /**
     * Gets a value indicating whether or not you change or not to change.
     * @returns {number} BackgroundChangeType value
     */
    getBackgroundChangeType: function () {},

    /**
     * It gets a value that represents the type of transition.
     * @returns {number} BackgroundTransitionType value
     */
    getBackgroundTransitionType: function () {},
}

/**
 * To manage the information about the "Execute Script" of the event command.
 */
const CommandScriptExecute = {
    /**
     * It gets the object name in the event command call.
     * @returns {string} Object name
     */
    getEventCommandName: function () {},

    /**
     * It gets an object that represents the argument to pass to the event command.
     * @returns {object} Object that represents the argument
     */
    getEventCommandArgument: function () {},

    /**
     * It gets the original content that is related to the event command.
     * @returns {OriginalContent} Original content
     */
    getOriginalContent: function () {},
}

/**
 * To manage the information about the "Call Save Screen" of the event command.
 */
const CommandSaveCall = {
    /**
     * It gets the type.
     * @returns {number} SaveCallType value
     */
    getSaveCallType: function () {},

    /**
     * If you want to run the save in the ending, we call this method.
     */
    setCompleteSaveFlag: function () {},
}

/**
 * To manage the information about the "Increase Gold" of the event command.
 */
const CommandGoldChange = {
    /**
     * Get the gold value to increase or decrease.
     * @returns {number} Increased or decreased to gold value
     */
    getGold: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Increase Item" of the event command.
 */
const CommandItemChange = {
    /**
     * It gets the target unit.
     * @returns {Unit} The target unit
     */
    getTargetUnit: function () {},

    /**
     * It gets the target item.
     * @returns {Item} The target item
     */
    getTargetItem: function () {},

    /**
     * It gets a value that represents the type of increase or decrease.
     * @returns {number} IncreaseType value
     */
    getIncreaseValue: function () {},

    /**
     * If the stock is the target it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isStockChange: function () {},

    /**
     * If at the time of releasing the item send to the stock is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isStockSend: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Increase Parameters" of the event command.
 */
const CommandParameterChange = {
    /**
     * It gets the target unit.
     * @returns {Unit} The target unit
     */
    getTargetUnit: function () {},

    /**
     * It gets the parameter information.
     * @returns {Parameter} Parameters
     */
    getDopingParameter: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Add Skills" of the event command.
 */
const CommandSkillChange = {
    /**
     * It gets the unit to increase or decrease the skill.
     * @returns {Unit} The target unit
     */
    getTargetUnit: function () {},

    /**
     * Get the skills of the increase or decrease the target.
     * @returns {Skill} Subject skills
     */
    getTargetSkill: function () {},

    /**
     * It gets the operation value for the skill.
     * @returns {number} IncreaseType value
     */
    getIncreaseValue: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Heal HP" of the event command.
 */
const CommandHpRecovey = {
    /**
     * It gets the target unit.
     * @returns {Unit} The target unit
     */
    getTargetUnit: function () {},

    /**
     * It gets the animation of recovery.
     * @returns {Anime} Anime
     */
    getRecoveryAnime: function () {},

    /**
     * It gets the recovery value.
     * @returns {number} Recovery value
     */
    getRecoveryValue: function () {},

    /**
     * It gets a value that represents the way of recovery.
     * @returns {number} RecoveryType value
     */
    getRecoveryType: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Reduce HP" of the event command.
 */
const CommandDamageHit = {
    /**
     * It gets the unit damage.
     * @returns {Unit} Unit damage
     */
    getLaunchUnit: function () {},

    /**
     * Gets the unit damaged.
     * @returns {Unit} Unit damaged
     */
    getTargetUnit: function () {},

    /**
     * It gets the animation of the damage.
     * @returns {Anime} Anime
     */
    getDamageAnime: function () {},

    /**
     * It gets the damage value.
     * @returns {number} Damage value
     */
    getDamageValue: function () {},

    /**
     * It gets a value that represents how to give of damage.
     * @returns {number} DamageType value
     */
    getDamageType: function () {},

    /**
     * Get the hit rate.
     * @returns {number} Accuracy
     */
    getHit: function () {},

    /**
     * Returns true if this event command occurs on the mouse, false otherwise.
     * @returns {boolean} Boolean
     */
    isMouseDamage: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Get Experience" of the event command.
 */
const CommandExperiencePlus = {
    /**
     * It gets the target unit.
     * @returns {Unit} The target unit
     */
    getTargetUnit: function () {},

    /**
     * Get the experience value.
     * @returns {number} Experience point
     */
    getExperienceValue: function () {},

    /**
     * It gets the type of experience.
     * @returns {number} ExperiencePlusType value
     */
    getExperiencePlusType: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false. Types in the case of level up, always returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Class Change" of the event command.
 */
const CommandClassChange = {
    /**
     * It gets the target unit.
     * @returns {Unit} The target unit
     */
    getTargetUnit: function () {},

    /**
     * It gets the object class.
     * @returns {Class} Target class
     */
    getTargetClass: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Use Item" of the event command.
 */
const CommandItemUse = {
    /**
     * It gets the unit to use the item.
     * @returns {Unit} Unit to use the item
     */
    getUseUnit: function () {},

    /**
     * It gets the item that you want to use.
     * @returns {Item} Items to be used
     */
    getUseItem: function () {},

    /**
     * It gets the unit to be used.
     * @returns {Unit} Unit to be used
     */
    getTargetUnit: function () {},

    /**
     * Gets the x coordinate to use the item.
     * @returns {number} x-coordinate
     */
    getTargetX: function () {},

    /**
     * Gets the y-coordinate to use the item.
     * @returns {number} y coordinate
     */
    getTargetY: function () {},

    /**
     * It gets the items that are used.
     * @returns {Item} Item to be used
     */
    getTargetItem: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Force Battle" of the event command.
 */
const CommandForceBattle = {
    /**
     * It gets the unit of "Attacker".
     * @returns {Unit} Unit of "Attacker"
     */
    getForceSrc: function () {},

    /**
     * It gets the unit of "Defender".
     * @returns {Unit} Unit of "Defender"
     */
    getForceDest: function () {},

    /**
     * Get the "Battle Type".
     * @returns {number} BattleType value
     */
    getBattleType: function () {},

    /**
     * It gets the entry value of the side to launch an attack.
     * @param {number} index The index of the entry value
     * @returns {number} Entry value
     */
    getSrcForceEntryType: function (index) {},

    /**
     * It gets the side entry value of attack.
     * @param {number} index The index of the entry value
     * @returns {number} Entry value
     */
    getDestForceEntryType: function (index) {},

    /**
     * true if to take into account the experience value, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isExperienceEnabled: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Show Chapter" of the event command.
 */
const CommandChapterShow = {
    /**
     * Get the chapter name.
     * @returns {string} Chapter name
     */
    getChapterName: function () {},

    /**
     * Get the map name.
     * @returns {string} Map name
     */
    getMapName: function () {},

    /**
     * If you want to see the data of the map information is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isMapInfoRef: function () {},
}

/**
 * To manage the information about the "Focus on Location" of the event command.
 */
const CommandLocationFocus = {
    /**
     * Gets the x-coordinate of the display position.
     * @returns {number} x-coordinate
     */
    getX: function () {},

    /**
     * Gets the y coordinate of the display position.
     * @returns {number} y coordinate
     */
    getY: function () {},

    /**
     * It gets the unit to focus.
     * @returns {Unit} Unit to focus
     */
    getTargetUnit: function () {},

    /**
     * If you want to give priority to rather than a unit (x, y) is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isPosBase: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Increase Bonus" of the event command.
 */
const CommandBonusChange = {
    /**
     * Get the bonus value to increase or decrease.
     * @returns {number} Increased or decreased to bonus value
     */
    getBonus: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Increase Item Drops" of the event command.
 */
const CommandTrophyChange = {
    /**
     * It gets the target trophy.
     * @returns {Trophy} Trophy
     */
    getTrophy: function () {},

    /**
     * It gets the target unit.
     * @returns {Unit} unit
     */
    getTargetUnit: function () {},

    /**
     * Do After clearing the acquisition of trophy, or returns a value that represents and whether made in the drop.
     * @returns {number} TrophyTargetType value
     */
    getTrophyTargetType: function () {},

    /**
     * It gets a value that represents the type of increase or decrease.
     * @returns {number} IncreaseType value
     */
    getIncreaseValue: function () {},
}

/**
 * To manage the information about the "Change Item Durability" of the event command.
 */
const CommandDurabilityChange = {
    /**
     * It gets the target unit.
     * @returns {Unit} unit
     */
    getTargetUnit: function () {},

    /**
     * It gets the target item.
     * @returns {Item} item
     */
    getTargetItem: function () {},

    /**
     * Get the durability value.
     * @returns {number} Durable value
     */
    getDurability: function () {},

    /**
     * It gets a value that represents the type of increase or decrease.
     * @returns {number} IncreaseType value
     */
    getIncreaseValue: function () {},

    /**
     * If the stock is the target it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isStockChange: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Inflict State" of the event command.
 */
const CommandUnitStateAddition = {
    /**
     * It gets the unit that gives the state.
     * @returns {Unit} unit
     */
    getLaunchUnit: function () {},

    /**
     * It gets the unit to receive the state.
     * @returns {Unit} unit
     */
    getTargetUnit: function () {},

    /**
     * It gets the state trigger object.
     * @returns {StateInvocation} State invoked object
     */
    getStateInvocation: function () {},

    /**
     * It gets a value that represents the type of increase or decrease.
     * @returns {number} IncreaseType value
     */
    getIncreaseValue: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Unit Slide" of the event command.
 */
const CommandUnitSlide = {
    /**
     * It gets the target unit.
     * @returns {Unit} unit
     */
    getTargetUnit: function () {},

    /**
     * It gets the direction.
     * @returns {number} DirectionType value
     */
    getDirectionType: function () {},

    /**
     * It gets the index indicating the number of pixels.
     * @returns {number} index
     */
    getPixelIndex: function () {},

    /**
     * It gets the type of slide.
     * @returns {number} SlideType value
     */
    getSlideType: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Unit Fusion" of the event command.
 */
const CommandUnitFusion = {
    /**
     * It gets the target unit.
     * @returns {Unit} unit
     */
    getUnit: function () {},

    /**
     * It gets the unit to catch the unit or trade,.
     * @returns {Unit} unit
     */
    getTargetUnit: function () {},

    /**
     * It gets the fusion to be used to catch.
     * @returns {Fusion} Fusion
     */
    getFusionData: function () {},

    /**
     * It gets the direction at the time of release.
     * @returns {number} DirectionType value
     */
    getDirectionType: function () {},

    /**
     * It gets the type of fusion.
     * @returns {number} FusionActionType value
     */
    getFusionActionType: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Unit Transformation" of the event command.
 */
const CommandUnitMetamorphoze = {
    /**
     * It gets the target unit.
     * @returns {Unit} unit
     */
    getTargetUnit: function () {},

    /**
     * Get the "Transform" data.
     * @returns {Metamorphoze} "Transform" data
     */
    getMetamorphozeData: function () {},

    /**
     * It gets the type of "Transform".
     * @returns {number} MetamorphozeActionType value
     */
    getMetamorphozeActionType: function () {},

    /**
     * If you want to display the image is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGraphicsSkip: function () {},
}

/**
 * To manage the information about the "Extensive Command" of the event command.
 */
const CommandUnitAllCommand = {
    /**
     * It gets the filter.
     * @returns {number} UnitFilterFlag value
     */
    getFilterFlag: function () {},

    /**
     * It gets the animation.
     * @returns {Anime} Anime
     */
    getAnime: function () {},

    /**
     * It gets the animation playback method.
     * @returns {number} AnimePlayType value
     */
    getAnimePlayType: function () {},

    /**
     * If the unit is an effective partner is true, otherwise it returns false.
     * @param {Unit} unit unit
     * @returns {boolean} Boolean
     */
    isDataCondition: function (unit) {},

    /**
     * Gets the events command to be executed.
     * @returns {object} Event command
     */
    getSubEventCommandObject: function () {},

    /**
     * It gets the type of event command to be executed.
     * @returns {number} EventCommandType value
     */
    getSubEventCommandType: function () {},
}

/**
 * To manage the information about the "Extract Map Pos" of the event command.
 */
const CommandMapPosChoose = {
    /**
     * It gets the x coordinate.
     * @returns {number} x-coordinate
     */
    getX: function () {},

    /**
     * Gets the y-coordinate.
     * @returns {number} y coordinate
     */
    getY: function () {},

    /**
     * It gets the unit.
     * @returns {Unit} unit
     */
    getTargetUnit: function () {},

    /**
     * If you want to give priority to rather than a unit (x, y) is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isPosBase: function () {},

    /**
     * The scope of the type you get.
     * @returns {number} RangeType value
     */
    getRangeType: function () {},

    /**
     * It gets the range.
     * @returns {number} Range
     */
    getRangeValue: function () {},

    /**
     * Returns true if the center target of the range is selectable, false otherwise.
     * @returns {boolean} Boolean
     */
    isSelfAllowed: function () {},

    /**
     * It gets the filter.
     * @returns {number} filter
     */
    getFilterFlag: function () {},

    /**
     * If the unit only can be selected it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isUnitOnlyMode: function () {},

    /**
     * If the unit of selection criteria is true, otherwise it returns false.
     * @param {Unit} unit unit
     * @returns {boolean} Boolean
     */
    isDataCondition: function (unit) {},

    /**
     * It gets the type of when the position selection.
     * @returns {number} PosChooseType value
     */
    getPosChooseType: function () {},

    /**
     * Get the base unit.
     * @returns {Unit} Base units
     */
    getBaseUnit: function () {},

    /**
     * Sets the x coordinate in a variable.
     * @param {number} x x-coordinate
     */
    setXToVariable: function (x) {},

    /**
     * Sets the y coordinate in a variable.
     * @param {number} y y coordinate
     */
    setYToVariable: function (y) {},

    /**
     * Set the unit ID to a variable.
     * @param {number} unitId Unit ID
     */
    setUnitIdToVariable: function (unitId) {},

    /**
     * If you do not want to allow the cancellation is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isCancelDisabled: function () {},

    /**
     * Get the self-switch.
     * @returns {number} Self switch
     */
    getSelfSwitchId: function () {},

    /**
     * If you want to view the unit window is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isWindowDisplayable: function () {},

    /**
     * true if you want to display a message at the time of selection, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isQuestionDisplayable: function () {},
}

/**
 * To manage the information about the "Control Map Pos" of the event command.
 */
const CommandMapPosOperation = {
    /**
     * It gets the x coordinate.
     * @returns {number} x-coordinate
     */
    getX: function () {},

    /**
     * Gets the y-coordinate.
     * @returns {number} y coordinate
     */
    getY: function () {},

    /**
     * It gets the unit.
     * @returns {Unit} unit
     */
    getTargetUnit: function () {},

    /**
     * If you want to give priority to rather than a unit (x, y) is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isPosBase: function () {},

    /**
     * true in the case of the transmitted chip, otherwise it returns false.
     * @param {undefined} retval VARIANT_BOOL* result Boolean
     */
    isTransparentChip: function (retval) {},

    /**
     * The type of operation to get.
     * @returns {number} MapPosOperationType value
     */
    getMapPosOperationType: function () {},

    /**
     * It gets the animation.
     * @returns {Anime} Anime
     */
    getMapAnime: function () {},

    /**
     * It gets the resource handle of the map chip.
     * @returns {ResourceHandle} Resource handle
     */
    getMapChipGraphicsHandle: function () {},
}

/**
 * It provides the only available methods in a particular scene.
 */
const SceneController = {
    /**
     * The MetaSession data to initialize. You can call in SceneType.TITLE.
     * @param {Difficulty} difficulty Difficulty data
     */
    initializeMetaSession: function (difficulty) {},

    /**
     * You start the game from the beginning. It must have previously initializeMetaSession is called. You can call in SceneType.TITLE.
     */
    newGame: function () {},

    /**
     * Gets the next time you open map of the ID. You can call in SceneType.REST.
     * @returns {number} Map ID
     */
    getNextMapId: function () {},

    /**
     * Change the ID of the next map to open. you can call in SceneType.REST.
     * @param {number} mapId Map ID
     */
    changeNextMapId: function (mapId) {},

    /**
     * If you want to display the save screen is true, otherwise it returns false. You can call in SceneType.REST.
     * @returns {boolean} Boolean
     */
    isSaveScreenDisplayable: function () {},

    /**
     * It gets the ID of reminiscence events. You can call in SceneType.EVENTTEST.
     * @returns {number} ID of the event
     */
    getRecollectionTestEventId: function () {},

    /**
     * Call if you clear the game. If the clear point has been set in the "Control Env Files", it will be saved by this call. Clear the number of times will also be saved to increase. You can call in SceneType.ENDING.
     */
    completeGame: function () {},

    /**
     * If the ending event is already running true, otherwise it returns false. You can call in SceneType.ENDING.
     * @returns {boolean} Boolean
     */
    isEndingEventExecuted: function () {},

    /**
     * If you need to display the save screen is true, otherwise it returns false. You can call in SceneType.ENDING.
     * @returns {boolean} Boolean
     */
    isCompletedSaveFlag: function () {},

    /**
     * If the scene is performed by loading the save file true, otherwise it returns false. SceneType.BATTLESETUP, SceneType.FREE, you can call in SceneType.REST.
     * @returns {boolean} Boolean
     */
    isActivatedFromSaveFile: function () {},

    /**
     * Open the map, which is identified by the given ID. SceneType.BATTLESETUP, SceneType.FREE, you can call in SceneType.REST.
     * @param {number} mapId Map ID
     */
    startNewMap: function (mapId) {},

    /**
     * Combat the unit to notify the game side. You can call in SceneType.FREE.
     * @param {Unit} active Active unit
     * @param {Unit} passive Passive unit
     */
    notifyBattleStart: function (active, passive) {},

    /**
     * To notify the result of the battle in the game side. You can call in SceneType.FREE.
     * @param {Unit} active Victorious unit
     * @param {Unit} passive Defeated unit
     */
    notifyBattleEnd: function (active, passive) {},

    /**
     * If you want to display the image at the time of map clear it is true, otherwise it returns false. You can call in SceneType.BATTLERESULT.
     * @returns {boolean} Boolean
     */
    isMapVictoryDisplayable: function () {},

    /**
     * It gets the background image of a particular scene.
     * @param {number} type SceneType value
     * @returns {Image} background image
     */
    getSceneBackgroundImage: function (type) {},
}

/**
 * To manage the start-up information. It is used as an argument of ScriptCall_Initialize.
 */
const StartupInfo = {
    /**
     * It gets the width of the game area.
     * @returns {number} The width of the game area
     */
    getGameAreaWidth: function () {},

    /**
     * It sets the width of the game area.
     * @param {number} width The width of the game area
     */
    setGameAreaWidth: function (width) {},

    /**
     * It gets the height of the game area.
     * @returns {number} The height of the game area
     */
    getGameAreaHeight: function () {},

    /**
     * It sets the height of the game area.
     * @param {number} height The height of the game area
     */
    setGameAreaHeight: function (height) {},

    /**
     * Gets an array of objects that can be specified as hardware fullscreen. The object has a width property and a height property.
     * @returns {object} Array of objects
     */
    getHardwareScreenSizeArray: function () {},
}

/**
 * To manage the information about the save file.
 */
const LoadSaveManager = {
    /**
     * Save the current data. SceneType.BATTLESETUP, SceneType.FREE, is enabled by SceneType.REST. In the case of SceneType.FREE, because the session information is written at the time of storage, some capacity will increase.
     * @param {number} index The index of the file
     * @param {number} step SceneType value
     * @param {number} mapId ID of map
     * @param {object} obj Uniquely defined objects
     */
    saveFile: function (index, step, mapId, obj) {},

    /**
     * Load the data of the save file.
     * @param {number} index The index of the file
     */
    loadFile: function (index) {},

    /**
     * It gets the number of save files.
     * @returns {number} The number of save files
     */
    getSaveFileCount: function () {},

    /**
     * Get the information of the save file
     * @param {number} index The index of save files
     * @returns {SaveFileInfo} Information of a save file
     */
    getSaveFileInfo: function (index) {},

    /**
     * Copy the save file.
     * @param {number} srcIndex The index of the copy source file
     * @param {number} destIndex Index of the target file
     */
    copyFile: function (srcIndex, destIndex) {},

    /**
     * Delete the save file.
     * @param {number} index The index of the file
     */
    deleteFile: function (index) {},

    /**
     * Make a save against interruption file.
     * @param {number} step SceneType value
     * @param {number} mapId ID of map
     * @param {object} obj Uniquely defined objects
     */
    saveInterruptionFile: function (step, mapId, obj) {},

    /**
     * Load the interrupted file.
     */
    loadInterruptionFile: function () {},

    /**
     * Delete the interrupted file.
     */
    deleteInterruptionFile: function () {},

    /**
     * true If you can load the interruption file, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isInterruptionFileLoadable: function () {},

    /**
     * Get the information of the interrupted file
     * @returns {SaveFileInfo} Information of a save file
     */
    getInterruptionFileInfo: function () {},

    /**
     * And save it in the game inside the current game data as interruption data. If you call this method even once, you will be able to resume the game when the script error.
     * @param {number} step SceneType value
     * @param {number} mapId ID of map
     * @param {object} obj Uniquely defined objects
     */
    setTemporaryInterruptionData: function (step, mapId, obj) {},

    /**
     * The save file structure game.exe is holding, and save files and synchronization on the current file system (load). If you are concerned about the possibility that the save file is replaced by the user after the game started, it calls this method before calling the geSaveFileInfo.
     */
    syncSaveFile: function () {},

    /**
     * syncSaveFile is interrupted file version.
     */
    syncInterruptionFile: function () {},
}

/**
 * Do the image.
 */
const GraphicsManager = {
    /**
     * The full range of the screen fills the specified color. ScriptCall_Draw is valid in the following call.
     * @param {number} color color
     */
    fill: function (color) {},

    /**
     * The specified range of the screen fills the specified color. ScriptCall_Draw is valid in the following call.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} width width
     * @param {number} height height
     * @param {number} color color
     * @param {number} alpha Alpha value
     */
    fillRange: function (x, y, width, height, color, alpha) {},

    /**
     * Draw a text. ScriptCall_Draw is valid in the following call.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {string} text text
     * @param {number} length Specifies whether to draw up what pixel destination. In the case of -1, it will be drawn text until the end. In the case of proportional font, it will be treated as -1.
     * @param {number} color color
     * @param {number} alpha Alpha value
     * @param {Font} font font
     */
    drawText: function (x, y, text, length, color, alpha, font) {},

    /**
     * Draw a text only specified character. ScriptCall_Draw is valid in the following call.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {string} text text
     * @param {number} length word count
     * @param {number} color color
     * @param {number} alpha Alpha value
     * @param {Font} font font
     */
    drawCharText: function (x, y, text, length, color, alpha, font) {},

    /**
     * Draw a text within the specified range. ScriptCall_Draw is valid in the following call.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} width width
     * @param {number} height height
     * @param {number} format TextFormat value
     * @param {string} text text
     * @param {number} length Specifies whether to draw up what pixel destination. In the case of -1, it will be drawn text until the end. In the case of proportional font, it will be treated as -1.
     * @param {number} color color
     * @param {number} alpha Alpha value
     * @param {Font} font font
     */
    drawTextRange: function (
        x,
        y,
        width,
        height,
        format,
        text,
        length,
        color,
        alpha,
        font
    ) {},

    /**
     * It gets the width of the text.
     * @param {string} text text
     * @param {Font} font font
     * @returns {number} width
     */
    getTextWidth: function (text, font) {},

    /**
     * It gets the height of the text.
     * @param {string} text text
     * @param {Font} font font
     * @returns {number} height
     */
    getTextHeight: function (text, font) {},

    /**
     * Create a preformatted text.
     * @param {string} text text
     * @param {Font} font font
     * @returns {FormattedText} FormattedText object
     */
    createFormattedText: function (text, font) {},

    /**
     * Create a clipping region.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} width width
     * @param {number} height height
     * @returns {ClippingArea} Clipping region
     */
    createClippingArea: function (x, y, width, height) {},

    /**
     * Push the clipping area. ScriptCall_Draw is valid in the following call.
     * @param {ClippingArea} clippingArea Clipping region to push
     * @returns {boolean} True if successful, false otherwise.
     */
    pushClippingArea: function (clippingArea) {},

    /**
     * Pop the current clipping area. ScriptCall_Draw is valid in the following call.
     * @returns {boolean} True if successful, false otherwise.
     */
    popClippingArea: function () {},

    /**
     * Create a cacheable own image.
     * @param {number} width The width of the image
     * @param {number} height The height of the image
     * @returns {Image} cache
     */
    createCacheGraphics: function (width, height) {},

    /**
     * Sets the specified cache as a drawing destination. Subsequent drawing will be made to the cache rather than to the screen.
     * @param {Image} cache cache
     */
    setRenderCache: function (cache) {},

    /**
     * Return the drawing destination to the normal state.
     */
    resetRenderCache: function () {},

    /**
     * Copy the contents of the cache to another cache. ScriptCall_Draw is valid in the following call.
     * @param {Image} cacheDest Copy destination cache
     * @param {number} xDest X coordinate of the copy destination
     * @param {number} yDest The destination of the Y coordinate
     * @param {Image} cacheSrc Copy the original cache
     * @param {number} xSrc Copy the source of the X-coordinate
     * @param {number} ySrc Copy the source of Y coordinate
     * @param {number} width width
     * @param {number} height height
     */
    copyCache: function (
        cacheDest,
        xDest,
        yDest,
        cacheSrc,
        xSrc,
        ySrc,
        width,
        height
    ) {},

    /**
     * It gets an object that manages the drawing of the figure.
     * @returns {GraphicsCanvas} GraphicsCanvas object
     */
    getCanvas: function () {},

    /**
     * Create your own configurable drawing mechanisms such as saturation and Gaussian blur. It can be called other than ScriptCall_Draw.
     * @returns {GraphicsComposition} Composition Object
     */
    createComposition: function () {},

    /**
     * Creates a matrix that can be assigned to a Composition object.
     * @returns {GraphicsMatrix} Matrix Object
     */
    createMatrix: function () {},

    /**
     * If you are clipping the map is true, otherwise it returns false. ScriptCall_Draw is valid in the following call.
     * @param {boolean} enable Boolean
     */
    enableMapClipping: function (enable) {},

    /**
     * Set a permanent alpha value in the map. ScriptCall_Move is valid in the following call.
     * @param {number} alpha Alpha value
     */
    setMapAlpha: function (alpha) {},

    /**
     * It permanently reverses the map. ScriptCall_Move is valid in the following call.
     * @param {boolean} reverse true case to be reversed, false otherwise.
     */
    setMapReverse: function (reverse) {},

    /**
     * Permanently expand / reduce the map. ScriptCall_Move is valid in the following call.
     * @param {number} scale Scale value
     */
    setMapScale: function (scale) {},

    /**
     * To permanently rotate the map. ScriptCall_Move is valid in the following call.
     * @param {number} degree rotation
     */
    setMapDegree: function (degree) {},

    /**
     * To zoom to permanently specified range of the map. ScriptCall_Move is valid in the following call.
     * @param {number} x X coordinate
     * @param {number} y Y coordinate
     * @param {number} width width
     * @param {number} height height
     */
    setMapZoom: function (x, y, width, height) {},
}

/**
 * Do the media.
 */
const MediaManager = {
    /**
     * Play the BGM.
     * @param {ResourceHandle} handle Media resource handle
     * @param {number} musicPlayType MusicPlayType value
     */
    musicPlay: function (handle, musicPlayType) {},

    /**
     * Stop the BGM.
     * @param {number} type MusicStopType value
     * @param {number} speed SpeedType value
     */
    musicStop: function (type, speed) {},

    /**
     * Play the sound effects.
     * @param {ResourceHandle} handle Resource handle
     * @param {number} id Assignment ID
     */
    soundPlay: function (handle, id) {},

    /**
     * Stop the sound effects.
     * @param {number} id Assignment ID
     * @param {boolean} isAllStop If you want to stop all of the sound effects are true, false otherwise.
     */
    soundStop: function (id, isAllStop) {},

    /**
     * Set the volume of the BGM.
     * @param {number} volume From 0 to 100 value
     */
    setMusicVolume: function (volume) {},

    /**
     * It gets the volume of the BGM.
     * @returns {number} From 0 to 100 value
     */
    getMusicVolume: function () {},

    /**
     * Set the volume of the SE.
     * @param {number} volume From 0 to 100 value
     */
    setSoundVolume: function (volume) {},

    /**
     * It gets the volume of the SE.
     * @returns {number} From 0 to 100 value
     */
    getSoundVolume: function () {},

    /**
     * Set the voice volume.
     * @param {number} volume From 0 to 100 value
     */
    setVoiceVolume: function (volume) {},

    /**
     * It gets the voice of the volume.
     * @returns {number} From 0 to 100 value
     */
    getVoiceVolume: function () {},

    /**
     * It gets the resource handle that indicates the BGM currently playing.
     * @returns {ResourceHandle} Resource handle
     */
    getActiveMusicHandle: function () {},

    /**
     * The waiting structure of the BGM to initialize.
     */
    resetMusicList: function () {},

    /**
     * Open the BGM data decoded present on the memory.
     */
    clearMusicCache: function () {},

    /**
     * Frees the SE data decoded present on the memory.
     */
    clearSoundCache: function () {},
}

/**
 * The creation of the video, and manage.
 */
const VideoManager = {
    /**
     * You create a video object.
     * @param {ResourceHandle} handle Resource handle
     * @param {number} uniqueId Assignment ID
     * @returns {Video} The video
     */
    createVideo: function (handle, uniqueId) {},

    /**
     * It lists a previously created video.
     * @param {number} index Index of videos
     * @returns {Video} The video
     */
    getCreatedVideo: function (index) {},

    /**
     * It gets the total number of already created videos.
     * @returns {number} Total
     */
    getCreatedVideoCount: function () {},

    /**
     * It gets the videos related to the allocation ID.
     * @param {number} uniqueId Assignment ID
     * @returns {Video} The video
     */
    getVideoFromUniqueId: function (uniqueId) {},

    /**
     * And all of the video being played in full-screen mode. Resolution will be used if the map such that small with a high game screen.
     * @param {boolean} enabled true if you want to full screen, false otherwise.
     */
    emulateFullScreen: function (enabled) {},

    /**
     * The encrypted video will be complexed to the time of reproduction, but the composite data is after the video stops also cached. If you want to open a cache calls this method.
     */
    clearVideoCache: function () {},
}

/**
 * To manage the material data. The material data, text files, image files present in the folder of Materia in the folder, is the generic name of music file. The category is the name of the folder.
 */
const MaterialManager = {
    /**
     * It gets the text.
     * @param {string} category Category name
     * @param {string} name Text name of the included extension
     * @returns {string} text
     */
    getText: function (category, name) {},

    /**
     * It gets the image.
     * @param {string} category Category name
     * @param {string} name Image name of the included extension
     * @returns {Image} image
     */
    createImage: function (category, name) {},

    /**
     * Play the sound effects.
     * @param {string} category Category name
     * @param {string} name Media name inclusive of extension
     * @param {number} id Assignment ID
     */
    soundPlay: function (category, name, id) {},

    /**
     * Stop the sound effects.
     * @param {number} id Assignment ID
     * @param {boolean} isAllStop If you want to stop all of the sound effects are true, false otherwise.
     */
    soundStop: function (id, isAllStop) {},

    /**
     * Play the voice.
     * @param {string} category Category name
     * @param {string} name Media name inclusive of extension
     * @param {number} id Assignment ID
     */
    voicePlay: function (category, name, id) {},

    /**
     * The voice will stop.
     * @param {number} id Assignment ID
     * @param {boolean} isAllStop If you want to stop all of the sound effects are true, false otherwise.
     */
    voiceStop: function (id, isAllStop) {},

    /**
     * true if the current voice is playing, otherwise it returns false.
     * @param {number} id Assignment ID
     * @returns {boolean} Boolean
     */
    isVoicePlaying: function (id) {},

    /**
     * You create a video object. Video is not being played at the time that you created.
     * @param {string} category Category name
     * @param {string} name Video file name of the included extension
     * @param {number} uniqueId Assignment ID
     * @returns {Video} The video
     */
    createVideo: function (category, name, uniqueId) {},

    /**
     * It gets the number of files that exist in a particular folder of Material in the folder.
     * @param {string} category Category name
     * @returns {number} number of files
     */
    getMaterialCount: function (category) {},

    /**
     * It gets the name of the file to be present in a particular folder of Material in the folder.
     * @param {number} index index
     * @param {string} category Category name
     * @returns {string} file name
     */
    getMaterialName: function (index, category) {},
}

/**
 * This object can be used only if the game has been released in the Steam platform.
 */
const SteamManager = {
    /**
     * Get the APPID of his game that was published on Steam.
     * @returns {number} APPID
     */
    getAppID: function () {},

    /**
     * Enable Achieve set in SteamWorks.
     * @param {string} apiname API name of the Achievement
     */
    setAchievement: function (apiname) {},
}

/**
 * To use this object, create a mod folder on the same level as game.exe (or Project1.srpgs) and create a face folder in it. The user then places the images to be replaced independently.
 */
const ModManager = {
    /**
     * Specify the type of image you want to replace and the name of the image.
     * @param {number} type GraphicsType value. Currently only GraphicsType.FACE and GraphicsType.CHARILLUST are supported.
     * @param {object} pArray Specifies an array containing the names of the image files to be replaced.
     */
    replaceGraphics: function (type, pArray) {},
}

/**
 * Use this object when you want to incorporate a versus feature into your game.
 */
const UserFileManager = {
    /**
     * The suser file (battle data) will be output to the current directory.
     * @param {string} name The name of the suser file to be created
     * @param {object} custom Custom parameters to include in the suser file
     */
    saveUserFile: function (name, custom) {},

    /**
     * Read the suser file that exists in the Friend folder.
     * @param {string} name The name of the suser file to load.
     * @returns {boolean} Return value. Trying to load a suser file for a different game will fail.
     */
    loadUserFile: function (name) {},

    /**
     * Gets the unit list stored in the suser file. It can be called when loadUserFile is successful.
     * @returns {DataList} Unit List
     */
    getLoadedList: function () {},

    /**
     * Gets the parameters stored in the suser file. This parameter is the same as the second argument of saveUserFile. It can be called when loadUserFile is successful.
     * @returns {object} Parameters
     */
    getLoadedCustom: function () {},

    /**
     * Get the total number of suser files present in the Friend folder.
     * @returns {number} Total
     */
    getUserFileCount: function () {},

    /**
     * Get the contents of the suser file in the Friend folder, excluding the unit list.
     * @param {number} index The index of the file to retrieve.
     * @returns {UserFileInfo} Obtained suser file information
     */
    getUserFileInfo: function (index) {},
}

/**
 * This object is primarily used to enumerate the names of suser files.
 */
const UserFileInfo = {
    /**
     * Gets the file name.
     * @returns {string} file name/p>
     */
    getName: function () {},

    /**
     * Get the parameters stored in the suser file.
     * @returns {object} Parameters
     */
    custom: function () {},
}

/**
 * Notify game.exe of special options.
 */
const CustomizationOptionsManager = {
    /**
     * Draw units in order from the top left corner of the map, not in Id order.
     * @param {boolean} isEnabled true to enable, false otherwise.
     */
    enableRenderUnitsBasedOnPosition: function (isEnabled) {},

    /**
     * Displays symbols on the moving object in the frontal state.
     * @param {boolean} isEnabled true to enable, false otherwise.
     */
    enableMovingObjectSymbol: function (isEnabled) {},

    /**
     * Specifies the array that contains the animation order of the character chip.
     * @param {object} pArray Array
     */
    setUnitAnimationArray: function (pArray) {},
}

/**
 * To manage the resources that are loaded into memory.
 */
const ResourceProfiler = {
    /**
     * Resources that have not been use for a certain period of time will be opened automatically by the system, but you set the interval.
     * @param {number} value interval
     */
    setPerformanceTuningInterval: function (value) {},

    /**
     * Gets the value set by the setPerformanceTuningInterval. The default value is 300.
     * @returns {number} interval
     */
    getPerformanceTuningInterval: function () {},

    /**
     * Look up the resources that are currently loaded into memory, and then maintained as internal data. Image that was created in GraphicsManager.createCacheGraphics and MaterialManager.createImage are not included.
     * @param {boolean} isRuntime true if the look-up object is a runtime, false otherwise.
     */
    takeSnapshot: function (isRuntime) {},

    /**
     * It analyzes the specified image, and maintained as internal data.
     * @param {Image} pic image
     */
    imageProfiling: function (pic) {},

    /**
     * It gets the number of resources that are stored in the internal data.
     * @returns {number} The number of resources
     */
    getResourceCount: function () {},

    /**
     * It gets the resource handle that contains the id and the color of the internal data.
     * @param {number} index index
     * @returns {ResourceHandle} Resource handle
     */
    getResourceHandle: function (index) {},

    /**
     * It gets the type of image of the internal data.
     * @param {number} index index
     * @returns {number} GraphicsType value
     */
    getGraphicsType: function (index) {},

    /**
     * It gets the file name of the internal data.
     * @param {number} index index
     * @returns {string} file name
     */
    getFileName: function (index) {},

    /**
     * From the resource is no longer in use, and set the interval until it is opened. It takes precedence over the global setting of setPerformanceTuningInterval.
     * @param {number} index index
     * @param {number} interval interval
     */
    setLocalPerformanceTuningInterval: function (index, interval) {},
}

/**
 * To manage the editing of the data.
 */
const DataEditor = {
    /**
     * Add a skill to the list.
     * @param {ReferenceList} list list
     * @param {Skill} data skill
     */
    addSkillData: function (list, data) {},

    /**
     * Remove the skills from the list.
     * @param {ReferenceList} list list
     * @param {Skill} data skill
     */
    deleteSkillData: function (list, data) {},

    /**
     * Remove all the skills from the list.
     * @param {ReferenceList} list list
     */
    deleteAllSkillData: function (list) {},

    /**
     * Change the skills that have been added to the list.
     * @param {ReferenceList} list list
     * @param {Skill} newData Skills that are newly added
     * @param {Skill} oldData Be replaced skills
     */
    changeSkillData: function (list, newData, oldData) {},

    /**
     * Add the state to the list.
     * @param {DataList} list list
     * @param {State} data I want to add state
     * @returns {TurnState} In fact the state added
     */
    addTurnStateData: function (list, data) {},

    /**
     * Remove the state from the list.
     * @param {DataList} list list
     * @param {State} data State
     */
    deleteTurnStateData: function (list, data) {},

    /**
     * Remove the whole state from the list.
     * @param {DataList} list list
     */
    deleteAllTurnStateData: function (list) {},
}

/**
 * Manage the trophy.
 */
const TrophyEditor = {
    /**
     * List to add the trophy.
     * @param {DataList} list list
     * @param {Trophy} trophy Trophy
     */
    addTrophy: function (list, trophy) {},

    /**
     * Add a trophy composed of only item in the list.
     * @param {DataList} list list
     * @param {Item} item item
     * @param {boolean} isImmediately true if the immediately available, false otherwise.
     */
    addItem: function (list, item, isImmediately) {},

    /**
     * List to add the trophy composed only of gold.
     * @param {DataList} list list
     * @param {number} gold gold
     * @param {boolean} isImmediately true if the immediately available, false otherwise.
     */
    addGold: function (list, gold, isImmediately) {},

    /**
     * List to add a trophy composed of only a bonus.
     * @param {DataList} list list
     * @param {number} bonus Bonus
     * @param {boolean} isImmediately true if the immediately available, false otherwise.
     */
    addBonus: function (list, bonus, isImmediately) {},

    /**
     * It deletes the specified trophy from the list.
     * @param {DataList} list list
     * @param {Trophy} trophy Trophy
     */
    deleteTrophy: function (list, trophy) {},

    /**
     * Remove all of the trophies in the list.
     * @param {DataList} list list
     */
    deleteAllTrophy: function (list) {},
}

/**
 * To manage the information of the switch.
 */
const SwitchTable = {
    /**
     * It gets the number of the switch.
     * @returns {number} The number of switches
     */
    getSwitchCount: function () {},

    /**
     * It gets the ID of the switch.
     * @param {number} index Index of the target switch
     * @returns {number} ID of the switch
     */
    getSwitchId: function (index) {},

    /**
     * It gets the index the ID of the switch to the base.
     * @param {number} id ID of the switch
     * @returns {number} The index of the switch
     */
    getSwitchIndexFromId: function (id) {},

    /**
     * It gets the name of the switch.
     * @param {number} index Index of the target switch
     * @returns {string} The name of the switch
     */
    getSwitchName: function (index) {},

    /**
     * It gets the description of the switch.
     * @param {number} index Index of the target switch
     * @returns {string} Switch description
     */
    getSwitchDescription: function (index) {},

    /**
     * It gets the switch of resources handle.
     * @param {number} index Index of the target switch
     * @returns {ResourceHandle} Switch of the resource handle
     */
    getSwitchResourceHandle: function (index) {},

    /**
     * If the switch is a valid true, otherwise it returns false.
     * @param {number} index Index of the target switch
     * @returns {boolean} Boolean
     */
    isSwitchOn: function (index) {},

    /**
     * Change the state of the switch.
     * @param {number} index Index of the target switch
     * @param {boolean} flag If you want to enable the switch is true, false otherwise.
     */
    setSwitch: function (index, flag) {},
}

/**
 * To manage the information of the variable.
 */
const VariableTable = {
    /**
     * It gets the number of variables.
     * @returns {number} The number of variables
     */
    getVariableCount: function () {},

    /**
     * It gets the ID of the variable.
     * @param {number} index Index of the target variable
     * @returns {number} ID of the variable
     */
    getVariableId: function (index) {},

    /**
     * It gets the index based on the ID of the variable.
     * @param {number} id ID of the variable
     * @returns {number} Index of variable
     */
    getVariableIndexFromId: function (id) {},

    /**
     * It gets the name of the variable.
     * @param {number} index Index of the target variable
     * @returns {string} The name of the variable
     */
    getVariableName: function (index) {},

    /**
     * It gets the description of the variable.
     * @param {number} index Index of the target variable
     * @returns {string} Description of variable
     */
    getVariableDescription: function (index) {},

    /**
     * It gets the resource handle of the variable.
     * @param {number} index Index of the target variable
     * @returns {ResourceHandle} Resource handle of variable
     */
    getVariableResourceHandle: function (index) {},

    /**
     * It gets the value of the variable.
     * @param {number} index Index of the target variable
     * @returns {number} The value of the variable
     */
    getVariable: function (index) {},

    /**
     * It gets the minimum value of the variable.
     * @param {number} index Index of the target variable
     * @returns {number} minimum value
     */
    getVariableMin: function (index) {},

    /**
     * It gets the maximum value of the variable.
     * @param {number} index Index of the target variable
     * @returns {number} Maximum value
     */
    getVariableMax: function (index) {},

    /**
     * Set a value to a variable.
     * @param {number} index Index of the target variable
     * @param {number} value The new variable values
     */
    setVariable: function (index, value) {},
}

/**
 * To manage the information of the image resource.
 */
const Image = {
    /**
     * It gets the ID of the data.
     * @returns {number} ID of data
     */
    getId: function () {},

    /**
     * It gets the name of the data.
     * @returns {string} The name of the data
     */
    getName: function () {},

    /**
     * Kind of image if the image is an image, If you are a UI returns the type of UI.
     * @returns {number} Value that represents the type
     */
    getImageType: function () {},

    /**
     * If the runtime is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isRuntime: function () {},

    /**
     * true in the case of large face image, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isLargeImage: function () {},

    /**
     * It gets the width of the image.
     * @returns {number} width
     */
    getWidth: function () {},

    /**
     * It gets the height of the image.
     * @returns {number} height
     */
    getHeight: function () {},

    /**
     * Draw the image.
     * @param {number} x Drawing destination of the x-coordinate
     * @param {number} y Drawing destination of the y coordinate
     */
    draw: function (x, y) {},

    /**
     * Draw the image in reference to the drawing source of information.
     * @param {number} xDest Drawing destination of the x-coordinate
     * @param {number} yDest Drawing destination of the y coordinate
     * @param {number} xSrc Drawing the source of x-coordinate
     * @param {number} ySrc Drawing the source of the y coordinate
     * @param {number} width Drawing the original width
     * @param {number} height Drawing the original height
     */
    drawParts: function (xDest, yDest, xSrc, ySrc, width, height) {},

    /**
     * It draws to enlarge or reduce the image.
     * @param {number} xDest Drawing destination of the x-coordinate
     * @param {number} yDest Drawing destination of the y coordinate
     * @param {number} destWidth Drawing destination of width
     * @param {number} destHeight The height of the drawing destination
     * @param {number} xSrc Drawing the source of x-coordinate
     * @param {number} ySrc Drawing the source of the y coordinate
     * @param {number} srcWidth Drawing the original width
     * @param {number} srcHeight Drawing the original height
     */
    drawStretchParts: function (
        xDest,
        yDest,
        destWidth,
        destHeight,
        xSrc,
        ySrc,
        srcWidth,
        srcHeight
    ) {},

    /**
     * Set the alpha value.
     * @param {number} alpha Alpha value
     */
    setAlpha: function (alpha) {},

    /**
     * If you want to invert the image is true, otherwise set the false.
     * @param {boolean} reverse Boolean
     */
    setReverse: function (reverse) {},

    /**
     * Set the magnification.
     * @param {number} scale Expansion rate
     */
    setScale: function (scale) {},

    /**
     * Set the rotation rate.
     * @param {number} degree Turnover rate
     */
    setDegree: function (degree) {},

    /**
     * It sets the hue.
     * @param {number} color color
     * @param {number} alpha Color alpha value of
     */
    setColor: function (color, alpha) {},

    /**
     * Set the interpolation mode at the time of the drawing.
     * @param {number} mode InterpolationMode value
     */
    setInterpolationMode: function (mode) {},

    /**
     * It gets the current animation index of map chip.
     * @returns {number} Animation index
     */
    getAnimationLoopIndex: function () {},

    /**
     * If the cache is valid, true, otherwise set the false.
     * @returns {boolean} Boolean
     */
    isCacheAvailable: function () {},

    /**
     * Specifies a custom constructed drawing mechanism. Cannot be used together with setAlpha, setScale, etc.
     * @param {GraphicsComposition} composition Composition Object
     */
    setComposition: function (composition) {},
}

/**
 * To manage the information of the media resources.
 */
const Media = {
    /**
     * It gets the ID of the data.
     * @returns {number} ID of data
     */
    getId: function () {},

    /**
     * It gets the name of the data.
     * @returns {string} The name of the data
     */
    getName: function () {},

    /**
     * It gets a value that represents the type of media.
     * @returns {number} MediaType value
     */
    getMediaType: function () {},

    /**
     * If the runtime is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isRuntime: function () {},
}

/**
 * To manage the information of the font resource.
 */
const Font = {
    /**
     * It gets the ID of the data.
     * @returns {number} ID of data
     */
    getId: function () {},

    /**
     * It gets the name of the data.
     * @returns {string} The name of the data
     */
    getName: function () {},

    /**
     * It gets the size of the font.
     * @returns {number} Font size of
     */
    getSize: function () {},

    /**
     * In the case of private font is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isPrivate: function () {},
}

/**
 * To manage the information of the video resources. You can not draw something on top of the reproduced moving image.
 */
const Video = {
    /**
     * It gets the ID of the data. Or when acquired in getVideoResourceList, it is useful if you create an object in the VideoManager.createVideo.
     * @returns {number} ID of data
     */
    getId: function () {},

    /**
     * It gets the name of the data. Or when acquired in getVideoResourceList, it is useful if you create an object in the VideoManager.createVideo.
     * @returns {string} The name of the data
     */
    getName: function () {},

    /**
     * Do VideoManager.createVideo, to get the ID assigned by MaterialManager.createVideo.
     * @returns {number} Assigned ID
     */
    getUniqueId: function () {},

    /**
     * Play the video to the entire screen. Since the original of the game screen hide, processing the script is not passed, it will be synchronous execution. When the loop mode is enabled, the video will stop by pressing the enter key (left click).
     */
    playScreen: function () {},

    /**
     * Play the video to the specified position. Size is used the original size video, but if you fail to get the internal will be considered on the size of the game area.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     */
    playPos: function (x, y) {},

    /**
     * Play the video at the specified size.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} width width
     * @param {number} height height
     */
    playRange: function (x, y, width, height) {},

    /**
     * The video so that you will be able to loop playback.
     * @param {boolean} mode If you want to loop playback is true, otherwise set the false.
     */
    setLoopMode: function (mode) {},

    /**
     * true if the current loop mode, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isLoopMode: function () {},

    /**
     * Pauses the video.
     */
    pause: function () {},

    /**
     * To resume a paused video.
     */
    resume: function () {},

    /**
     * It stops a movie.
     */
    stop: function () {},

    /**
     * It gets the current state of the video.
     * @returns {number} VideoState value
     */
    getVideoState: function () {},

    /**
     * Seeks to the specified time the video.
     * @param {number} val Specified time
     */
    seek: function (val) {},

    /**
     * It gets the total playback time of the video. If the value of the return value divided by 2 of getDuration specified in the seek method, the video will be played from the position of the half.
     * @returns {number} Total playing time
     */
    getDuration: function () {},

    /**
     * It gets the current playback time of the video.
     * @returns {number} Current playback time
     */
    getClock: function () {},

    /**
     * Set the speed of the moving image. 200 is a 2-fold, 50 is half. Depending on the video may fail to change speed.
     * @param {number} rate Set the speed of the rate.
     * @returns {boolean} Boolean
     */
    changeRate: function (rate) {},

    /**
     * Change the current position of the moving image.
     * @param {number} dx x-coordinate
     * @param {number} dy y coordinate
     */
    offset: function (dx, dy) {},
}

/**
 * To manage the data.
 */
const DataList = {
    /**
     * It gets the data represented by the specified index.
     * @param {number} index index
     * @returns {object} data
     */
    getData: function (index) {},

    /**
     * It gets the data represented by the specified ID.
     * @param {number} id ID
     * @returns {object} data
     */
    getDataFromId: function (id) {},

    /**
     * It gets the data represented by the specified index and color.
     * @param {number} index index
     * @param {number} collectionIndex Index of the color
     * @returns {object} data
     */
    getCollectionData: function (index, collectionIndex) {},

    /**
     * It gets the data represented by the specified ID and color.
     * @param {number} id ID
     * @param {number} collectionIndex Index of the color
     * @returns {object} data
     */
    getCollectionDataFromId: function (id, collectionIndex) {},

    /**
     * It gets the total number of data.
     * @returns {number} The total number of data
     */
    getCount: function () {},

    /**
     * Swaps the position of the specified unit to each other.
     * @param {Unit} dataSrc Exchange source of unit
     * @param {Unit} dataDest Exchange destination of the unit
     */
    exchangeUnit: function (dataSrc, dataDest) {},
}

/**
 * To manage the data to refer to the data.
 */
const ReferenceList = {
    /**
     * It gets the type of data that can be obtained in getTypeData.
     * @returns {number} ObjectTyp value
     */
    getObjectType: function () {},

    /**
     * It gets the data of the specified index.
     * @param {number} index index
     * @returns {object} data
     */
    getTypeData: function (index) {},

    /**
     * It gets the total number of data.
     * @returns {number} The total number of data
     */
    getTypeCount: function () {},

    /**
     * It gets the total number of data you do not want to see on the menu.
     * @returns {number} The total number of data
     */
    getHiddenCount: function () {},
}

/**
 * To manage the information of AI pattern.
 */
const AIPattern = {
    /**
     * Get the pattern type.
     * @returns {number} PatternType value
     */
    getPatternType: function () {},

    /**
     * Get the pattern information of "Approach".
     * @returns {ApproachPatternInfo} Pattern information of "Approach"
     */
    getApproachPatternInfo: function () {},

    /**
     * Get the pattern information of "Move".
     * @returns {MovePatternInfo} Pattern information of "Move"
     */
    getMovePatternInfo: function () {},

    /**
     * Get the pattern information of "Wait".
     * @returns {WaitPatternInfo} Pattern information of "Wait"
     */
    getWaitPatternInfo: function () {},

    /**
     * It gets the keyword to be used in the custom pattern.
     * @returns {string} keyword
     */
    getCustomKeyword: function () {},

    /**
     * It gets the type that aim. If the one is not checked, the return value is -1.
     * @returns {number} LockonType value
     */
    getLockonType: function () {},

    /**
     * Get a list of "Aim (Unit)".
     * @returns {DataList} list
     */
    getAimUnitList: function () {},

    /**
     * true if the "Aim (Unit)" meets the conditions, otherwise it returns false.
     * @param {Unit} unit unit
     * @returns {boolean} Boolean
     */
    isUnitCondition: function (unit) {},

    /**
     * true if the "Aim (Data)" meets the conditions, otherwise it returns false.
     * @param {Unit} unit unit
     * @returns {boolean} Boolean
     */
    isDataCondition: function (unit) {},

    /**
     * Gets a value indicating "Disallowed Action".
     * @returns {number} AIDisableFlag value
     */
    getAIDisableFlag: function () {},
}

/**
 * To manage the pattern information of "Approach".
 */
const ApproachPatternInfo = {
    /**
     * If you want to act only within the range it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isRangeOnly: function () {},
}

/**
 * To manage the pattern information of "Move".
 */
const MovePatternInfo = {
    /**
     * It gets the type of "Goal".
     * @returns {number} MoveGoalType value
     */
    getMoveGoalType: function () {},

    /**
     * Gets the x-coordinate of the "Goal".
     * @returns {number} x-coordinate
     */
    getMoveGoalX: function () {},

    /**
     * Gets the y-coordinate of the "Goal".
     * @returns {number} y coordinate
     */
    getMoveGoalY: function () {},

    /**
     * It gets the unit to target "Goal".
     * @returns {Unit} unit
     */
    getMoveGoalUnit: function () {},

    /**
     * What a value indicating whether to move to get.
     * @returns {number} MoveAIType value
     */
    getMoveAIType: function () {},
}

/**
 * To manage the "Wait" pattern information.
 */
const WaitPatternInfo = {
    /**
     * If the act is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isWaitOnly: function () {},
}

/**
 * An object that can dynamically create an object.
 */
const ObjectGenerator = {
    /**
     * You actually create an event unit. For example, if you specify a unit acquired from mapData.getListFromUnitGroup (UnitGroup.ENEMYEVENT), it includes a new unit in the list returned by gameSession.getEnemyList.
     * @param {Unit} baseUnit Base units
     * @returns {Unit} It was created unit
     */
    generateUnitFromBaseUnit: function (baseUnit) {},

    /**
     * Create a bookmark unit as a particular type of unit. root.getBaseData (). getBookmarkUnitList () or, to specify the acquired unit in mapData.getListFromUnitGroup (UnitGroup.BOOKMARK). List returned by these functions are the same. To call this function, the editor game options of "Display bookmark tab when selecting unit" must be valid.
     * @param {Unit} baseUnit Base units
     * @param {number} unitType UnitType value
     * @returns {Unit} It was created unit
     */
    generateUnitFromBookmarkUnit: function (baseUnit, unitType) {},

    /**
     * Create an empty unit with the given id. There is no need to create mocks in the database beforehand.
     * @param {number} id ID of the new unit
     * @returns {Unit} It was created unit
     */
    generateBlankPlayer: function (id) {},

    /**
     * Create a unit from the page information of reinforcements.
     * @param {ReinforcementPage} page Page data
     * @returns {Unit} It was created unit
     */
    generateUnitFromRefinforcementPage: function (page) {},

    /**
     * The contents of the second argument unit are copied to the first argument unit. The data that is not copied are "ID", "Current Position", "Importance", "Action Pattern", and "Appearance Condition".
     * @param {Unit} srcUnit The unit to copy. No changes are made to this unit.
     * @param {Unit} destUnit The unit to copy. No changes are made to this unit.
     * @param {number} flags Copy option. Currently can be 0 or 1. If 1, the copied unit can also have unique weapons.
     */
    copyUnit: function (srcUnit, destUnit, flags) {},

    /**
     * Destroys the created unit.
     * @param {Unit} Unit to be destroyed
     */
    deleteUnit: function (Unit) {},
}

/**
 * An object that can be dynamically executed the event command.
 */
const EventGenerator = {
    /**
     * The unit on the base, and set so as to be able to run the "Show Message" of the event command.
     * @param {string} message Target text
     * @param {number} pos MessagePos value representing the display position
     * @param {Unit} unit The target unit
     */
    messageShowUnit: function (message, pos, unit) {},

    /**
     * The unit on the base, and set so as to be able to run the "Show Message" of the event command. Facial expression ID can be specified.
     * @param {string} message Target text
     * @param {number} pos MessagePos value representing the display position
     * @param {number} facialId Facial expression ID
     * @param {Unit} unit The target unit
     */
    messageShowUnitEx: function (message, pos, facialId, unit) {},

    /**
     * Based on the NPC, and set so as to be able to run the "Show Message" of the event command.
     * @param {string} message Target text
     * @param {number} pos MessagePos value representing the display position
     * @param {Npc} npc Target NPC
     */
    messageShowNpc: function (message, pos, npc) {},

    /**
     * Based on the NPC, and set so as to be able to run the "Show Message" of the event command. Facial expression ID can be specified.
     * @param {string} message Target text
     * @param {number} pos MessagePos value representing the display position
     * @param {number} facialId Facial expression ID
     * @param {Npc} npc Target NPC
     */
    messageShowNpcEx: function (message, pos, facialId, npc) {},

    /**
     * Set to be able to run "Erase Message" of the event command.
     * @param {boolean} isTop true if you want to erase the top, false otherwise.
     * @param {boolean} isCenter true if you want to erase the center, false otherwise.
     * @param {boolean} isBottom true if you want to erase the lower part, false otherwise.
     */
    messageErase: function (isTop, isCenter, isBottom) {},

    /**
     * Set to be able to run "Narration Message" of the event command.
     * @param {string} message Target text
     * @param {number} pos MessagePos value representing the display position
     * @param {boolean} isWindowShow true If you sign in to post a letter in the middle, false otherwise.
     */
    messageTerop: function (message, pos, isWindowShow) {},

    /**
     * The unit on the base, and set so as to be able to run the "Simple Message" of the event command.
     * @param {string} message Target text
     * @param {Unit} unit The target unit
     */
    stillMessageUnit: function (message, unit) {},

    /**
     * Based on the NPC, and set so as to be able to run the "Simple Message" of the event command.
     * @param {string} message Target text
     * @param {Npc} npc The target unit
     */
    stillMessageNpc: function (message, npc) {},

    /**
     * Set to be able to run "Message Scroll" of the event command.
     * @param {string} message Target text
     * @param {number} x x-coordinate
     * @param {number} speed SpeedType value that represents the speed
     * @param {boolean} isStaffRoll true when working as a staff roll, false otherwise.
     * @param {boolean} isCenterShow true to display in the center, false otherwise.
     */
    messageScroll: function (message, x, speed, isStaffRoll, isCenterShow) {},

    /**
     * Set to be able to run "Message Title" of the event command.
     * @param {string} message Target text
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {boolean} isCenterShow true to display in the center, false otherwise.
     */
    messageTitle: function (message, x, y, isCenterShow) {},

    /**
     * Set to be able to run "Info Window" of the event command.
     * @param {string} message Target text
     * @param {number} infoType InfoWindowType value that represents the type of information
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {boolean} isCenterShow true to display in the center, false otherwise.
     */
    infoWindow: function (message, infoType, x, y, isCenterShow) {},

    /**
     * Set to be able to run "Scroll Screen" of the event command.
     * @param {number} x x-coordinate of the target
     * @param {number} y y coordinates of the target
     * @param {number} speedType SpeedType value that represents the speed
     * @param {boolean} isWait true If you want to wait until the process is complete, false otherwise.
     */
    screenScroll: function (x, y, speedType, isWait) {},

    /**
     * Set to be able to run "Screen Effect" of the event command.
     * @param {boolean} isChange true if you want to change the color, false otherwise.
     * @param {number} color Color values
     * @param {number} alpha Transparency of color
     * @param {number} speed SpeedType value that represents the speed
     * @param {number} effectType EffectRangeType value representing the range of color change
     * @param {boolean} isWait true If you want to wait until the process is complete, false otherwise.
     */
    screenEffect: function (
        isChange,
        color,
        alpha,
        speed,
        effectType,
        isWait
    ) {},

    /**
     * Set to be able to run "Change Background" of the event command.
     * @param {number} backgroundChangeType BackgroundChangeType value that represents the type of change
     * @param {ResourceHandle} handle Of the background image resource handle
     * @param {number} graphicsType GraphicsType value that represents the type of image
     * @param {number} backgroundTransitiontype BackgroundTransitionType representing the transition
     */
    backgroundChange: function (
        backgroundChangeType,
        handle,
        graphicsType,
        backgroundTransitiontype
    ) {},

    /**
     * Set to be able to run "Play Music" of the event command.
     * @param {ResourceHandle} handle The music of the resource handle
     * @param {number} musicPlayType MusicPlayType value that represents the type of reproduction
     */
    musicPlay: function (handle, musicPlayType) {},

    /**
     * Set to be able to run "Stop Music" of the event command.
     * @param {number} type MusicStopType value representing the stop format
     * @param {number} speedType SpeedType value that represents the speed
     */
    musicStop: function (type, speedType) {},

    /**
     * Set to be able to run "Play Sound" of the event command.
     * @param {ResourceHandle} handle Sound effects resource handle
     * @param {number} id ID to be assigned
     */
    soundPlay: function (handle, id) {},

    /**
     * Set to be able to run "Stop Stop" of the event command.
     * @param {number} id ID of the sound effects to stop
     * @param {boolean} isAllStop If you want to stop all of the sound effects are true, false otherwise.
     */
    soundStop: function (id, isAllStop) {},

    /**
     * Set to be able to run "Play Animation" of the event command.
     * @param {Anime} anime Anime
     * @param {number} x x-coordinate to be displayed destination
     * @param {number} y y coordinates to be displayed destination
     * @param {boolean} isCenterShow true to display in the center, false otherwise.
     * @param {number} option AnimePlayType value
     * @param {number} id ID to be set in order to identify the anime
     */
    animationPlay: function (anime, x, y, isCenterShow, option, id) {},

    /**
     * Set to be able to run "Stop Animation" of the event command.
     * @param {number} id ID to be assigned
     * @param {boolean} isAllStop If you want to all stop it is true, false otherwise.
     */
    animationStop: function (id, isAllStop) {},

    /**
     * Set to be able to run "Change Scene" of the event command.
     * @param {number} type SceneType value that represents the type of scene
     */
    sceneChange: function (type) {},

    /**
     * Set to be able to run "Wait" of the event command.
     * @param {number} counter Frame value
     */
    wait: function (counter) {},

    /**
     * Set to be able to run "Remove Unit" of the event command.
     * @param {Unit} unit unit
     * @param {number} directionType DirectionType value
     * @param {number} option RemoveOption value
     */
    unitRemove: function (unit, directionType, option) {},

    /**
     * Set to be able to run "Unit Affiliation" of the event command.
     * @param {Unit} unit unit
     * @param {number} unitType UnitType value
     */
    unitAssign: function (unit, unitType) {},

    /**
     * Set to be able to run "Increase Gold" of the event command.
     * @param {number} gold Gold to increase or decrease
     * @param {number} increaseType IncreaseType value representing how to increase or decrease
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    goldChange: function (gold, increaseType, isSkipMode) {},

    /**
     * The stock to base, and set so as to be able to run the "Increase Item" of the event command.
     * @param {Item} item The target item
     * @param {number} increaseType IncreaseType value representing how to increase or decrease
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    stockItemChange: function (item, increaseType, isSkipMode) {},

    /**
     * The unit on the base, and set so as to be able to run the "Increase Item" of the event command.
     * @param {Unit} unit The target unit
     * @param {Item} item The target item
     * @param {number} increaseType IncreaseType value representing how to increase or decrease
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    unitItemChange: function (unit, item, increaseType, isSkipMode) {},

    /**
     * Set to be able to run "Increase Parameters" of the event command.
     * @param {Unit} unit The target unit
     * @param {Parameter} doping Parameters
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    parameterChange: function (unit, doping, isSkipMode) {},

    /**
     * Set to be able to run "Add Skills" of the event command.
     * @param {Unit} unit The target unit
     * @param {Skill} skill Subject skills
     * @param {number} increaseType IncreaseType value representing how to increase or decrease
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    skillChange: function (unit, skill, increaseType, isSkipMode) {},

    /**
     * Set to be able to run "Heal HP" of the event command.
     * @param {Unit} unit The target unit
     * @param {Anime} anime Recovery anime
     * @param {number} value Recovery value
     * @param {number} recoveryType RecoveryType value that represents the way of recovery
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    hpRecovery: function (unit, anime, value, recoveryType, isSkipMode) {},

    /**
     * Set to be able to run "Reduce HP" of the event command. Damage will surely hit.
     * @param {Unit} unit Unit damaged
     * @param {Anime} anime Damage animation
     * @param {number} value Damage value
     * @param {number} damageType DamageType value that represents how to give of damage
     * @param {Unit} launchUnit Unit that was the source of damage
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    damageHit: function (
        unit,
        anime,
        value,
        damageType,
        launchUnit,
        isSkipMode
    ) {},

    /**
     * Set to be able to run "Reduce HP" of the event command.
     * @param {Unit} unit Unit damaged
     * @param {Anime} anime Damage animation
     * @param {number} value Damage value
     * @param {number} damageType DamageType value that represents how to give of damage
     * @param {number} hit Accuracy
     * @param {Unit} launchUnit Unit that was the source of damage
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    damageHitEx: function (
        unit,
        anime,
        value,
        damageType,
        hit,
        launchUnit,
        isSkipMode
    ) {},

    /**
     * Set to be able to run "Get Experience" of the event command.
     * @param {Unit} unit The target unit
     * @param {number} exp Learning experience
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    experiencePlus: function (unit, exp, isSkipMode) {},

    /**
     * Set to be able to run "Get Experience" of the event command.
     * @param {Unit} unit The target unit
     * @param {number} exp Learning experience
     * @param {number} type ExperiencePlusType value
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    experiencePlusEx: function (unit, exp, type, isSkipMode) {},

    /**
     * Set to be able to run "Class Change" of the event command.
     * @param {Unit} unit The target unit
     * @param {Class} cls Target class
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    classChange: function (unit, cls, isSkipMode) {},

    /**
     * Set to be able to run "Use Item" of the event command.
     * @param {Unit} src Unit to use the item
     * @param {Unit} dest Unit the item is used
     * @param {Item} item Items to be used
     * @param {number} x x coordinate to use and where the items
     * @param {number} y y coordinate to use and where the items
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    itemUse: function (src, dest, item, x, y, isSkipMode) {},

    /**
     * Set to be able to run "Force Battle" of the event command.
     * @param {Unit} src Unit to launch an attack
     * @param {Unit} dest Unit attacked
     * @param {number} battleType Value representing a battle format
     * @param {boolean} isExperienceEnabled true if to take into account the experience value, false otherwise.
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    forceBattle: function (
        src,
        dest,
        battleType,
        isExperienceEnabled,
        isSkipMode
    ) {},

    /**
     * Set to be able to run "Show Chapter" of the event command.
     * @param {string} chapterName A string that represents the chapter name
     * @param {string} mapName A string that represents the map name
     * @param {boolean} isMapInfo true if you want to use the data of the map information, false otherwise.
     */
    chapterShow: function (chapterName, mapName, isMapInfo) {},

    /**
     * Set to be able to run "Chapter Complete" of the event command.
     * @param {number} mapId Map ID
     * @param {number} actionType RestSaveType value that indicates the save format
     * @param {boolean} isLogo If you want to display a logo is true, false otherwise.
     */
    victoryMap: function (mapId, actionType, isLogo) {},

    /**
     * Set to be able to run "Focus on Location" of the event command.
     * @param {number} x x coordinate to focus
     * @param {number} y y coordinates to focus
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    locationFocus: function (x, y, isSkipMode) {},

    /**
     * Set to be able to run "Change Map Chip" of the event command.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {boolean} isLayer true If you want to configure transparent chips, false otherwise.
     * @param {ResourceHandle} handle Resource handle
     */
    mapChipChange: function (x, y, isLayer, handle) {},

    /**
     * Set to be able to run "Map Scroll" of the event command.
     * @param {number} speedType SpeedType value that represents the speed
     * @param {boolean} isWait true If you want to wait until the process is complete, false otherwise.
     * @param {boolean} isStopKey true If you want to make is to stop the scroll in the decision key, false otherwise.
     */
    mapScroll: function (speedType, isWait, isStopKey) {},

    /**
     * Set to be able to run "Change Unit State" of the event command.
     * @param {Unit} unit unit
     * @param {number} flags UnitStateChangeFlag value
     * @param {number} value The value to be set
     */
    unitStateChange: function (unit, flags, value) {},

    /**
     * Set to be able to run "Increase Bonus" of the event command.
     * @param {number} bonus Bonus
     * @param {number} increaseType IncreaseType value representing how to increase or decrease
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    bonusChange: function (bonus, increaseType, isSkipMode) {},

    /**
     * Set to be able to run "Increase Item Drops" of the event command.
     * @param {Unit} unit unit
     * @param {number} increaseType IncreaseType value representing how to increase or decrease
     * @param {Trophy} trophy Trophy
     */
    trophyChange: function (unit, increaseType, trophy) {},

    /**
     * Set to be able to run "Change Item Durability" of the event command.
     * @param {Unit} unit Unit carrying the items
     * @param {Unit} item Item you want to change the endurance
     * @param {number} durability The value of endurance
     * @param {number} increaseType IncreaseType value
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    itemDurabilityChange: function (
        unit,
        item,
        durability,
        increaseType,
        isSkipMode
    ) {},

    /**
     * Set to the event command "Change Item Durability" it can be executed in the stock base.
     * @param {Unit} item Item you want to change the endurance
     * @param {number} durability The value of endurance
     * @param {number} increaseType IncreaseType value
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    stockDurabilityChange: function (
        item,
        durability,
        increaseType,
        isSkipMode
    ) {},

    /**
     * Set to be able to run "Inflict State" of the event command.
     * @param {Unit} unit Unit to receive the state
     * @param {StateInvocation} obj State invoked object
     * @param {number} increaseType IncreaseType value
     * @param {Unit} launchUnit Unit that was the source that gives the state
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    unitStateAddition: function (
        unit,
        obj,
        increaseType,
        launchUnit,
        isSkipMode
    ) {},

    /**
     * Set to be able to run "Unit Slide" of the event command.
     * @param {Unit} unit unit
     * @param {number} directionType DirectionType value
     * @param {number} pixelIndex Index indicating the number of pixels
     * @param {number} slideType SlideType value
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    unitSlide: function (
        unit,
        directionType,
        pixelIndex,
        slideType,
        isSkipMode
    ) {},

    /**
     * Set to be able to run "Unit Fusion" of the event command.
     * @param {Unit} unit unit
     * @param {Unit} targetUnit The target unit. Valid in FusionActionType.CATCH and FusionActionType.TRADE.
     * @param {Fusion} fusion Fusion. Enabled by FusionActionType.CATCH.
     * @param {number} direction DirectionType value. Valid in FusionActionType.RELEASE.
     * @param {number} fusionActiontype FusionActionType value
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    unitFusion: function (
        unit,
        targetUnit,
        fusion,
        direction,
        fusionActiontype,
        isSkipMode
    ) {},

    /**
     * Set to be able to run "Unit Transformation" of the event command.
     * @param {Unit} unit unit
     * @param {Metamorphoze} metamorphoze Morphological change data
     * @param {number} metamorphozeActiontype MetamorphozeActionType value
     * @param {boolean} isSkipMode If you want to display the image is true, false otherwise.
     */
    unitMetamorphoze: function (
        unit,
        metamorphoze,
        metamorphozeActiontype,
        isSkipMode
    ) {},

    /**
     * Set to be able to run "Control Map Pos" of the event command.
     * @param {Unit} unit unit
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {object} obj Anime or resource handle
     */
    mapPosOperation: function (unit, x, y, obj) {},

    /**
     * Set to be able to run "Execute Script" of the event command.
     * @param {Unit} unit Specify units that can be retrieved via original data.
     * @param {string} code Specifies the code to be executed. Object names and properties cannot be specified.
     */
    scriptExecuteCode: function (unit, code) {},

    /**
     * Create an event to be established from the set event command, and executes it.
     * @returns {Event} Events created
     */
    execute: function () {},

    /**
     * Resets the set event command.
     */
    reset: function () {},
}

/**
 * To manage the information about the resource handle.
 */
const ResourceHandle = {
    /**
     * It gets the type of handle.
     * @returns {number} Kind of handle
     */
    getHandleType: function () {},

    /**
     * It gets the resource ID.
     * @returns {number} Resource ID
     */
    getResourceId: function () {},

    /**
     * It gets the index of color.
     * @returns {number} The index of color
     */
    getColorIndex: function () {},

    /**
     * Gets the x-coordinate on the resource.
     * @returns {number} x-coordinate
     */
    getSrcX: function () {},

    /**
     * Gets the y-coordinate on the resource.
     * @returns {number} y coordinate
     */
    getSrcY: function () {},

    /**
     * true if the specified handle and the contents are the same, otherwise it returns false.
     * @param {ResourceHandle} destHandle Handle to be compared
     * @returns {boolean} Boolean
     */
    isEqualHandle: function (destHandle) {},

    /**
     * If an empty handle is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isNullHandle: function () {},
}

/**
 * To manage the information about the parameters.
 */
const Parameter = {
    /**
     * It gets the specified parameters.
     * @param {number} index Index of the parameter
     * @returns {number} Parameter values
     */
    getAssistValue: function (index) {},

    /**
     * Set the specified parameters.
     * @param {number} index Index of the parameter
     * @param {number} value Parameter values
     */
    setAssistValue: function (index, value) {},
}

/**
 * Calculate object management.
 */
const Calculation = {
    /**
     * It gets the specified parameters.
     * @param {number} index Index of the parameter
     * @returns {number} Parameter values
     */
    getValue: function (index) {},

    /**
     * It gets the operator.
     * @param {number} index Index of the parameter
     * @returns {number} OperatorSymbol value
     */
    getOperatorSymbol: function (index) {},

    /**
     * It gets the parameter type in "Child".
     * @param {number} index Index of the parameter
     * @returns {number} ParameterType value
     */
    getParameterType: function (index) {},

    /**
     * It gets the parameter index in "Child".
     * @param {number} index Index of the parameter
     * @returns {number} Parameter values
     */
    getParameterValue: function (index) {},

    /**
     * It gets the operator in "Child".
     * @param {number} index Index of the parameter
     * @returns {number} OperatorSymbol value
     */
    getParameterOperatorSymbol: function (index) {},

    /**
     * If you want to see the "Child" it is true, otherwise it returns false.
     * @param {number} index Index of the parameter
     * @returns {boolean} Boolean
     */
    isChildCheck: function (index) {},
}

/**
 * To manage the data conditions.
 */
const Aggregation = {
    /**
     * It gets the number of objects.
     * @returns {number} The number of objects
     */
    getObjectCount: function () {},

    /**
     * It gets the object.
     * @param {number} index index
     * @returns {object} object
     */
    getObjectData: function (index) {},

    /**
     * It gets the format of the object.
     * @param {number} index index
     * @returns {number} ObjectType value
     */
    getObjectType: function (index) {},

    /**
     * If you meet the conditions true, otherwise it returns false.
     * @param {Unit} unit Unit to verify the conditions
     * @returns {boolean} Boolean
     */
    isCondition: function (unit) {},

    /**
     * If you meet the conditions true, otherwise it returns false.
     * @param {object} data Unit to verify the conditions
     * @param {Weapon} weapon Assume weapon as in equipment
     * @returns {boolean} Boolean
     */
    isConditionFromWeapon: function (data, weapon) {},

    /**
     * And how to get a value that indicates whether to confirm the condition.
     * @returns {number} MatchType value
     */
    getMatchType: function () {},
}

/**
 * To manage the correction status.
 */
const SupportStatus = {
    /**
     * Get the "Pow Plus".
     * @returns {number} Attack correction
     */
    getPower: function () {},

    /**
     * Get the "Def Plus".
     * @returns {number} Defense correction
     */
    getDefense: function () {},

    /**
     * Get the "Hit Plus".
     * @returns {number} Hit correction
     */
    getHit: function () {},

    /**
     * Get the "Avo Plus".
     * @returns {number} Avoid correction
     */
    getAvoid: function () {},

    /**
     * Get the "Crt Plus".
     * @returns {number} Critical correction
     */
    getCritical: function () {},

    /**
     * Get the "Crt Avo Plus".
     * @returns {number} Critical avoid correction
     */
    getCriticalAvoid: function () {},

    /**
     * Get the "Agility".
     * @returns {number} Agility
     */
    getAgility: function () {},
}

/**
 * To manage the information about the trophy.
 */
const Trophy = {
    /**
     * It gets a value that indicates the contents of the trophy.
     * @returns {number} TrophyFlag value
     */
    getFlag: function () {},

    /**
     * It gets the item.
     * @returns {Item} item
     */
    getItem: function () {},

    /**
     * Get the gold.
     * @returns {number} gold
     */
    getGold: function () {},

    /**
     * Get the bonus.
     * @returns {number} Bonus
     */
    getBonus: function () {},

    /**
     * If the trophy immediately available true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isImmediately: function () {},

    /**
     * Set the initial endurance value of items that can be obtained in getItem.
     * @param {number} limit Endurance
     */
    setLimit: function (limit) {},
}

/**
 * To manage the inventory of items.
 */
const Inventory = {
    /**
     * It gets the current inventory.
     * @returns {number} The value of stock
     */
    getAmount: function () {},

    /**
     * Set the new stock.
     * @param {number} value The value of stock
     */
    setAmount: function (value) {},
}

/**
 * To manage the information about the remuneration of the quest.
 */
const QuestReward = {
    /**
     * It gets a value that indicates the type of reward.
     * @returns {number} RewardType value
     */
    getType: function () {},

    /**
     * It gets the item.
     * @returns {Item} item
     */
    getItem: function () {},

    /**
     * Get the gold.
     * @returns {number} gold
     */
    getGold: function () {},

    /**
     * Get the bonus.
     * @returns {number} Bonus
     */
    getBonus: function () {},

    /**
     * It gets the text.
     * @returns {string} text
     */
    getText: function () {},

    /**
     * It gets a number.
     * @returns {number} Numeric value
     */
    getValue: function () {},
}

/**
 * It gets the prototype information.
 */
const PrototypeInfo = {
    /**
     * It gets the name.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * A description to get.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of "Face Graphic".
     * @returns {ResourceHadle} Resource handle of "Face Graphic"
     */
    getFaceResourceHandle: function () {},

    /**
     * It gets an array of initial parameters.
     * @returns {object} It gets an array.
     */
    getInitialArray: function () {},

    /**
     * It gets the growth value setting of a prototype information.
     * @param {number} lv level
     * @returns {object} Array of growth value
     */
    getGrowthArray: function (lv) {},
}

/**
 * To manage the methods related to fusion.
 */
const UnitStyle = {
    /**
     * It gets the unit associated with the object.
     * @returns {Unit} unit
     */
    getSourceUnit: function () {},

    /**
     * Currently, to get the fusion that is associated with the unit.
     * @returns {Fusion} Fusion
     */
    getFusionData: function () {},

    /**
     * Currently, to get the parent unit the unit is to catch.
     * @returns {Unit} unit
     */
    getFusionChild: function () {},

    /**
     * Currently, to get the parent unit that catch the unit.
     * @returns {Unit} unit
     */
    getFusionParent: function () {},

    /**
     * Set the fusion to be associated with the unit.
     * @param {Fusion} fusion Fusion
     */
    setFusionData: function (fusion) {},

    /**
     * Set the child unit that was caught.
     * @param {Unit} unit unit
     */
    setFusionChild: function (unit) {},

    /**
     * Set the catch parent unit.
     * @param {Unit} unit unit
     */
    setFusionParent: function (unit) {},

    /**
     * setFusionData, clears setFusionChild, the settings of setFusionParent.
     */
    clearFusionInfo: function () {},

    /**
     * Set the fusion to be used for "Fusion Attack".
     * @param {Fusion} fusion Fusion
     */
    startFusionAttack: function (fusion) {},

    /**
     * It calls when you exit "Fusion Attack".
     */
    endFusionAttack: function () {},

    /**
     * Gets the fusion set in startFusionAttack.
     * @returns {Fusion} Fusion
     */
    getFusionAttackData: function () {},

    /**
     * Currently, to get the "Transform" data that is associated with the unit.
     * @returns {Metamorphoze} "Transform" data
     */
    getMetamorphozeData: function () {},

    /**
     * Associate with the unit and set the "Transform" data.
     * @param {Metamorphoze} metamorphoze "Transform" data
     */
    setMetamorphozeData: function (metamorphoze) {},

    /**
     * Clears have been set "Transform" data.
     */
    clearMetamorphozeData: function () {},

    /**
     * It gets the number of elapsed turn from the "Transform".
     * @returns {number} Number of turns
     */
    getMetamorphozeTurn: function () {},

    /**
     * Set the number of elapsed turn from the "Transform".
     * @param {number} turn Number of turns
     */
    setMetamorphozeTurn: function (turn) {},

    /**
     * Get the class prior to the "Transform".
     * @returns {Class} class
     */
    getSourceClass: function () {},
}

/**
 * To manage the information on the State invoking object.
 */
const StateInvocation = {
    /**
     * Gets the state to be activated.
     * @returns {State} State
     */
    getState: function () {},

    /**
     * It gets the type of trigger percentage.
     * @returns {number} InvocationType value
     */
    getInvocationType: function () {},

    /**
     * It gets the value of the trigger percentage.
     * @returns {number} Trigger percentage of the value
     */
    getInvocationValue: function () {},
}

/**
 * To manage the information on the State invoking object.
 */
const StateGroup = {
    /**
     * If you want to target all of the bad state is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isAllBadState: function () {},

    /**
     * Get a list of the state.
     * @returns {ReferenceList} List of state
     */
    getStateReferenceList: function () {},
}

/**
 * It gets the state information that has been set in the unit.
 */
const TurnState = {
    /**
     * Get the "Duration in turns" of the state.
     * @returns {number} turn
     */
    getTurn: function () {},

    /**
     * Set the "Duration in turns" of the state.
     * @param {number} turn turn
     */
    setTurn: function (turn) {},

    /**
     * Gets the current number of times of "Auto Removal Condition" of the state.
     * @returns {number} Number of times
     */
    getRemovalCount: function () {},

    /**
     * It sets the current number of times of "Auto Removal Condition" of the state.
     * @param {number} count Number of times
     */
    setRemovalCount: function (count) {},

    /**
     * Get the relevant state.
     * @returns {State} State
     */
    getState: function () {},

    /**
     * It gets the doping information that takes into account the elapsed turn.
     * @returns {Parameter} Doping information
     */
    getDopingParameter: function () {},

    /**
	 * Set the state to any value./p>

	 * @param {boolean} locked true or fakse
	 */
    setLocked: function (locked) {},

    /**
     * Gets the value set in the state.
     * @returns {boolean} true or fakse
     */
    isLocked: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the information of the motion ID.
 */
const MotionIdCollection = {
    /**
     * It gets the motion ID warrior system.
     * @param {number} type MotionFighter value
     * @returns {number} Motion ID
     */
    getFighterId: function (type) {},

    /**
     * It gets the motion ID of archers system.
     * @param {number} type MotionArcher value
     * @returns {number} Motion ID
     */
    getArcherId: function (type) {},

    /**
     * It gets the motion ID of Mage system.
     * @param {number} type MotionMage value
     * @returns {number} Motion ID
     */
    getMageId: function (type) {},
}

/**
 * To manage the information on the screen effect.
 */
const ScreenEffect = {
    /**
     * It gets the color.
     * @returns {number} color
     */
    getColor: function () {},

    /**
     * It sets the color.
     * @param {number} color color
     */
    setColor: function (color) {},

    /**
     * It gets the alpha value.
     * @returns {number} Alpha value
     */
    getAlpha: function () {},

    /**
     * Set the alpha value.
     * @param {number} alpha Alpha value
     */
    setAlpha: function (alpha) {},

    /**
     * It gets the range.
     * @returns {number} EffectRangeType value
     */
    getRange: function () {},

    /**
     * Set the range.
     * @param {number} range EffectRangeType value
     */
    setRange: function (range) {},

    /**
     * It resets the information.
     */
    resetEffect: function () {},
}

/**
 * To manage the information of the save file.
 */
const SaveFileInfo = {
    /**
     * It gets the play time.
     * @returns {number} Play time
     */
    getPlayTime: function () {},

    /**
     * It gets the number of elapsed turn.
     * @returns {number} Elapsed number of turns
     */
    getTurnCount: function () {},

    /**
     * Get the degree of difficulty.
     * @returns {Difficulty} difficulty
     */
    getDifficulty: function () {},

    /**
     * Get the gold.
     * @returns {number} gold
     */
    getGold: function () {},

    /**
     * Get the bonus.
     * @returns {number} Bonus
     */
    getBonus: function () {},

    /**
     * It gets the scene type.
     * @returns {number} SceneType value
     */
    getSceneType: function () {},

    /**
     * Get the map information.
     * @returns {MapData} Map information
     */
    getMapInfo: function () {},

    /**
     * true if the file requires a clear, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isCompleteFile: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the information about the clipping region.
 */
const ClippingArea = {
    /**
     * Gets the clipping x coordinate.
     * @returns {number} x-coordinate
     */
    getClippingX: function () {},

    /**
     * It gets the clipping y coordinates.
     * @returns {number} y coordinate
     */
    getClippingY: function () {},

    /**
     * It gets the clipping width.
     * @returns {number} width
     */
    getClippingWidth: function () {},

    /**
     * It gets the clipping height.
     * @returns {number} height
     */
    getClippingHeight: function () {},
}

/**
 * To manage the information of formatted text.
 */
const FormattedText = {
    /**
     * It sets the display range of characters in the text.
     * @param {number} start start point
     * @param {number} end end point
     */
    setValidArea: function (start, end) {},

    /**
     * Set the text color and opacity to the specified range.
     * @param {number} start start point
     * @param {number} end end point
     * @param {number} color color
     * @param {number} alpha Opacity
     */
    setColorAlpha: function (start, end, color, alpha) {},

    /**
     * Set the font to the specified range.
     * @param {number} start start point
     * @param {number} end end point
     * @param {object} font font
     */
    setFont: function (start, end, font) {},

    /**
     * Set the font size of the specified range.
     * @param {number} start start point
     * @param {number} end end point
     * @param {number} size size
     */
    setFontSize: function (start, end, size) {},

    /**
     * Set a value that indicates the font weight of the specified range.
     * @param {number} start start point
     * @param {number} end end point
     * @param {number} weight Set 1.
     */
    setFontWeight: function (start, end, weight) {},

    /**
     * Set a value that indicates the font style to the specified range.
     * @param {number} start start point
     * @param {number} end end point
     * @param {number} style If you want to italic is 0, if you want to italics will be set to 1.
     */
    setFontStyle: function (start, end, style) {},

    /**
     * Set the cancellation line to the specified range.
     * @param {number} start start point
     * @param {number} end end point
     */
    setStrikethrough: function (start, end) {},

    /**
     * It sets the underline to the specified range.
     * @param {number} start start point
     * @param {number} end end point
     */
    setUnderline: function (start, end) {},

    /**
     * Draw a preformatted text.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} color color
     * @param {number} alpha Opacity
     */
    drawFormattedText: function (x, y, color, alpha) {},
}

/**
 * Defines what special effects will be applied when the Image object specified in setImage or setImageParts is finally drawn.
 */
const GraphicsComposition = {
    /**
     * Specifies the Image object to which the special effect will be applied. Call this method or setImageParts first.
     * @param {Image} bitmap Image Object
     */
    setImage: function (bitmap) {},

    /**
     * Specifies the Image object to which the special effect will be applied. The special effect is applied to the specified area.
     * @param {Image} bitmap Image Object
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     * @param {number} width width
     * @param {number} height height
     */
    setImageParts: function (bitmap, x, y, width, height) {},

    /**
     * Adjust the saturation.
     * @param {float} value Set the value from 0.0 to 1.0.
     */
    setSaturation: function (value) {},

    /**
     * Adjust the brightness.
     * @param {float} value Set the value from 0.0 to 2.0.
     */
    setBrightness: function (value) {},

    /**
     * Apply Gaussian Blur.
     * @param {float} value Specifies the blur intensity, which can be greater than 1.0.
     */
    setGaussianBlur: function (value) {},

    /**
     * Apply Direction Blur.
     * @param {float} value Specifies the blur intensity, which can be greater than 1.0.
     */
    setDirectionBlur: function (value) {},

    /**
     * Rotates the hue.
     * @param {float} value Set the value from 0.0 to 360.0.
     */
    setHueRotation: function (value) {},

    /**
     * Specifies color intensity.
     * @param {float} r Specifies the intensity of the red color; can be greater than 1.0.
     * @param {float} g Specifies the intensity of the green color; can be greater than 1.0.
     * @param {float} b Specifies the intensity of the blue color; can be greater than 1.0.
     * @param {float} a Specify opacity value from 0.0 to 1.0.
     */
    setColorChannel: function (r, g, b, a) {},

    /**
     * Apply 2D Affine Transform.
     * @param {GraphicsMatrix} matrix Specifies the Matrix object that defines the affine transformation.
     */
    setAffin: function (matrix) {},

    /**
     * Overlays another Image object on the object specified in setImage or setImageParts.
     * @param {Image} bitmap Overlapping Image Objects
     * @param {number} blendType BlendType value that defines how to blend
     * @param {float} alpha Specifies the opacity of the blend, with a value from 0.0 to 1.0.
     */
    setBlendBitmap: function (bitmap, blendType, alpha) {},

    /**
     * Combine setImage, or special effect calls after setImageParts. After combining, you can call the special effect method to pass it to the setComposition of the Image object or call composite again.
     * @param {number} mode CompositeMode value representing how to combine
     */
    composite: function (mode) {},

    /**
     * Initialize the order of special effects.
     */
    reset: function () {},
}

/**
 * Defines the matrix to be specified for 2D affine transformations.
 */
const GraphicsMatrix = {
    /**
     * Set values directly into the matrix without using the simplification method.
     * @param {float} a a
     * @param {float} b b
     * @param {float} c c
     * @param {float} d d
     * @param {float} e e
     * @param {float} f f
     */
    setPrimitive: function (a, b, c, d, e, f) {},

    /**
     * Sets the scaling factor.
     * @param {float} sx Specifies the scaling factor in the x-direction.
     * @param {float} sy Specifies the scaling factor in the y-direction.
     * @param {float} centerX Specifies the center in x-coordinate.
     * @param {float} centerY Specifies the center in y-coordinate.
     */
    setScale: function (sx, sy, centerX, centerY) {},

    /**
     * Sets the rotation.
     * @param {float} angle Sets the rotation angle.
     * @param {float} centerX Specifies the center of rotation in x-coordinates.
     * @param {float} centerY Specifies the center of rotation in y-coordinates.
     */
    setRotation: function (angle, centerX, centerY) {},

    /**
     * Sets the shear.
     * @param {float} angleX Sets the rotation angle in the x direction.。
     * @param {float} angleY Sets the rotation angle in the y direction.
     * @param {float} centerX Specifies the center of the shear in x-coordinate.
     * @param {float} centerY Specifies the center of the shear in y-coordinate.
     */
    setSkew: function (angleX, angleY, centerX, centerY) {},

    /**
     * Creates a new matrix by multiplying it with an existing matrix.
     * @param {GraphicsMatrix} matrix existing matrix
     * @returns {GraphicsMatrix} new matrix
     */
    multiply: function (matrix) {},
}

/**
 * To manage the methods needed to figure drawing.
 */
const GraphicsCanvas = {
    /**
     * Create a GraphicsGradient object.
     * @returns {GraphicsGradient} GraphicsGradient object
     */
    createGradient: function () {},

    /**
     * Create a GraphicsFigure object.
     * @returns {GraphicsFigure} GraphicsFigure object
     */
    createFigure: function () {},

    /**
     * Creates a textual GraphicsFigure object.
     * @param {string} text Text
     * @param {Font} font Font
     * @returns {GraphicsFigure} GraphicsFigure Object
     */
    createTextFigure: function (text, font) {},

    /**
     * Draw a rectangle.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} nWidth width
     * @param {number} nHeight height
     */
    drawRectangle: function (x, y, nWidth, nHeight) {},

    /**
     * It draws a rounded rectangle.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} nWidth width
     * @param {number} nHeight height
     * @param {number} radiusX 1/4 of the X radius
     * @param {number} radiusY 1/4 of the Y radius
     */
    drawRoundedRectangle: function (x, y, nWidth, nHeight, radiusX, radiusY) {},

    /**
     * Draw the ellipse.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} nWidth width
     * @param {number} nHeight height
     */
    drawEllipse: function (x, y, nWidth, nHeight) {},

    /**
     * Draw a straight line.
     * @param {number} x1 x coordinate of the start point
     * @param {number} y1 y coordinate of the start point
     * @param {number} x2 x coordinate of the end point
     * @param {number} y2 y coordinate of the end point
     * @param {number} weight The size of the straight line
     */
    drawLine: function (x1, y1, x2, y2, weight) {},

    /**
     * Draw a figure.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {GraphicsFigure} figure GraphicsFigure object
     */
    drawFigure: function (x, y, figure) {},

    /**
     * Set the information of the contour.
     * @param {number} nColor color
     * @param {number} nAlpha Alpha value
     * @param {number} weight The size of the contour
     * @param {boolean} isStrokeFirst true to draw in advance the profile from the inside, false otherwise
     */
    setStrokeInfo: function (nColor, nAlpha, weight, isStrokeFirst) {},

    /**
     * Set the inside of color.
     * @param {number} nColor color
     * @param {number} nAlpha Alpha value
     */
    setFillColor: function (nColor, nAlpha) {},

    /**
     * Instead of setFillColor, and set the Gradient object to fill the interior.
     * @param {GraphicsGradient} gradient GraphicsGradient object
     */
    setGradient: function (gradient) {},

    /**
     * Set the magnification. The default value is 100.
     * @param {number} scale Expansion rate
     */
    setScale: function (scale) {},

    /**
     * Set the rotation rate. The default value is 0.
     * @param {number} degree Turnover rate
     */
    setDegree: function (degree) {},
}

/**
 * You manage your own shapes made up of straight lines and Bezier curves.
 */
const GraphicsFigure = {
    /**
     * To start the configuration of the graphic.
     * @param {number} x x coordinate of the start point
     * @param {number} y y coordinate of the start point
     */
    beginFigure: function (x, y) {},

    /**
     * Quit the configuration of the graphics.
     */
    endFigure: function () {},

    /**
     * Add a straight line.
     * @param {number} x x coordinate of the end point
     * @param {number} y y coordinate of the end point
     */
    addLine: function (x, y) {},

    /**
     * Add a Bezier curve.
     * @param {number} x1 x-coordinate of the first control point
     * @param {number} y1 y coordinate of the first control point
     * @param {number} x2 x-coordinate of the second control point
     * @param {number} y2 y-coordinate of the second control point
     * @param {number} x3 x coordinate of the end point
     * @param {number} y3 y coordinate of the end point
     */
    addBezier: function (x1, y1, x2, y2, x3, y3) {},

    /**
     * Add the arc.
     * @param {number} x1 x coordinate of the end point
     * @param {number} y1 y coordinate of the end point
     * @param {number} radiusX x radius of the arc
     * @param {number} radiusY y radius of the arc
     */
    addArc: function (x1, y1, radiusX, radiusY) {},
}

/**
 * To manage composed of gradation in multiple colors.
 */
const GraphicsGradient = {
    /**
     * To start the configuration of the gradient.
     * @param {number} type GradientType value
     */
    beginGradient: function (type) {},

    /**
     * Exit the configuration of the gradient.
     */
    endGradient: function () {},

    /**
     * Add a color. You can call up to five times.
     * @param {number} color color
     * @param {number} alpha Alpha value
     */
    addColor: function (color, alpha) {},
}

/**
 * You can add a decorative when the unit on the map is drawn in the game side.
 */
const GraphicsDecoration = {
    /**
     * Start the decoration.
     */
    beginDecoration: function () {},

    /**
     * Exit the decoration.
     */
    endDecoration: function () {},

    /**
     * Add the hp drawing.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} colorIndex Index of the color
     */
    addHp: function (x, y, colorIndex) {},

    /**
     * Add the gauge drawing.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} nCount The length of the gauge. 1 or 2
     */
    addGauge: function (x, y, nCount) {},

    /**
     * Add the image drawing. You can specify such as an image of MaterialManager.createImage.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} xSrc Drawing the source of x-coordinate
     * @param {number} ySrc Drawing the source of the y coordinate
     * @param {number} width width
     * @param {number} height height
     * @param {Image} img Image object
     */
    addImage: function (x, y, xSrc, ySrc, width, height, img) {},

    /**
     * Add a drawing of the square.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} width width
     * @param {number} height height
     */
    addRectangle: function (x, y, width, height) {},

    /**
     * Rounded corners and add the drawing of the square.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} width width
     * @param {number} height height
     * @param {number} radiusX 1/4 of the X radius
     * @param {number} radiusY 1/4 of the Y radius
     */
    addRoundedRectangle: function (x, y, width, height, radiusX, radiusY) {},

    /**
     * Add a drawing of an ellipse.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} width width
     * @param {number} height height
     */
    addEllipse: function (x, y, width, height) {},

    /**
     * Add a drawing of a straight line.
     * @param {number} x x coordinate of the start point
     * @param {number} y y coordinate of the start point
     * @param {number} x2 x coordinate of the end point
     * @param {number} y2 y coordinate of the end point
     * @param {number} weight The size of the straight line
     */
    addLine: function (x, y, x2, y2, weight) {},

    /**
     * Add a specific object type, such as state and fusion.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} type Object Type
     * @param {boolean} isCounterEnabled true if to take into account the value of setCounterMax, false otherwise.
     */
    addObjectType: function (x, y, type, isCounterEnabled) {},

    /**
     * Set the information of the contour.
     * @param {number} nColor color
     * @param {number} nAlpha Alpha value
     * @param {number} weight The size of the contour
     * @param {boolean} isStrokeFirst true to draw in advance the profile from the inside, false otherwise
     */
    setStrokeInfo: function (nColor, nAlpha, weight, isStrokeFirst) {},

    /**
     * Set the inside of color.
     * @param {number} nColor color
     * @param {number} nAlpha Alpha value
     */
    setFillColor: function (nColor, nAlpha) {},

    /**
     * The size of the class is to set the offset in the case of L or more size.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} width width
     * @param {number} height height
     */
    setLargeSize: function (x, y, width, height) {},

    /**
     * Set the animation interval of the object to be identified by addObjectType.
     * @param {number} value interval
     */
    setCounterMax: function (value) {},
}

/**
 * It manages one of the command data in the backlog.
 */
const BacklogCommand = {
    /**
     * It gets the text.
     * @returns {string} text
     */
    getText: function () {},

    /**
     * It gets a value that indicates the position at which to draw the text.
     * @returns {number} MessagePos value
     */
    getTextPosValue: function () {},

    /**
     * Gets a value indicating a target to issue a message.
     * @returns {number} SpeakerType value
     */
    getSpeakerType: function () {},

    /**
     * It gets the unit.
     * @returns {Unit} unit
     */
    getUnit: function () {},

    /**
     * Get the NPC.
     * @returns {Npc} NPC
     */
    getNpc: function () {},

    /**
     * It gets the expression ID of the face image.
     * @returns {number} Facial expression ID
     */
    getFacialExpressionId: function () {},

    /**
     * Get CharIllust.
     * @param {number} id Facial expression ID
     * @returns {Image} CharIllust
     */
    getCharIllustImage: function (id) {},

    /**
     * It gets the type of command.
     * @returns {number} CommandType value
     */
    getCommandType: function () {},
}

/**
 * It manages the movement point on the map.
 */
const MapSimulator = {
    /**
     * To start the search the current position of the unit to the base.
     * @param {Unit} unit unit
     * @param {number} moveMaxCount Search size of the value to be
     */
    startSimulation: function (unit, moveMaxCount) {},

    /**
     * The specified position and spacing to start the search on the base.
     * @param {number} x x-coordinate
     * @param {number} y y coordinate
     * @param {number} startRange Starting position
     * @param {number} endRange End position
     */
    startSimulationRange: function (x, y, startRange, endRange) {},

    /**
     * Based on the current position and the range of the weapons of the unit to start the search.
     * @param {Unit} unit unit
     * @param {number} moveMaxCount Search size of the value to be
     * @param {number} startRange Start range of weapons
     * @param {number} endRange End range of the weapon
     */
    startSimulationWeapon: function (
        unit,
        moveMaxCount,
        startRange,
        endRange
    ) {},

    /**
     * The current position and the range of the weapon of all units on the base to start the search.
     * @param {number} unitFilter UnitFilterFlag value
     */
    startSimulationWeaponAll: function (unitFilter) {},

    /**
     * Only constant around a specified unit do the marking. It must have previously startSimulationWeaponAll is called.
     * @param {Unit} unit unit
     */
    startSimulationWeaponPlus: function (unit) {},

    /**
     * In startSimulation system of call, so that you do not take into account the unit that exist on the map.
     */
    disableMapUnit: function () {},

    /**
     * In startSimulation system of call, so that you do not take into account the terrain effect.
     */
    disableTerrain: function () {},

    /**
     * In startSimulation system of call, so that you do not take into account the "Passable Terrain" Settings.
     */
    disableRestrictedPass: function () {},

    /**
     * It returns an array that has been generated internally by startSimulation (Range). This array contains the index on the map that exists within the scope of the search.
     * @returns {object} Array
     */
    getSimulationIndexArray: function () {},

    /**
     * startSimulationWeapon (All, Plus) by returns an array that has been generated internally. This array contains the index on the map that exists within the scope of the search.
     * @returns {object} Array
     */
    getSimulationWeaponIndexArray: function () {},

    /**
     * From the index on the map, to get the movement points for that index.
     * @param {number} mapIndex index
     * @returns {number} Movement Points
     */
    getSimulationMovePoint: function (mapIndex) {},

    /**
     * From the index on the map, to get the direction with respect to the index.
     * @param {number} mapIndex index
     * @returns {number} DirectionType value
     */
    getSimulationDirection: function (mapIndex) {},

    /**
     * If the index on the map has already been marked true, otherwise it returns false.
     * @param {number} mapIndex index
     * @returns {boolean} Boolean
     */
    isSimulationMark: function (mapIndex) {},

    /**
     * Set the mark that indicates the pre-survey for the index on the map.
     * @param {number} mapIndex index
     * @param {boolean} flag true if you want to pre-mark, false otherwise.
     */
    setSimulationMark: function (mapIndex, flag) {},

    /**
     * All the marks the set to release.
     */
    resetSimulationMark: function () {},

    /**
     * It gets the total number of valid search results. This total is intended to be specified in the length of the loop statement.
     * @returns {number} The number of loop
     */
    getLoopCount: function () {},

    /**
     * It gets the moving point from the loop index.
     * @param {number} loopIndex Loop index
     * @returns {number} Movement Points
     */
    getMovePointFromLoopIndex: function (loopIndex) {},

    /**
     * It gets the position index from the loop index.
     * @param {number} loopIndex Loop index
     * @returns {number} Location index
     */
    getPosIndexFromLoopIndex: function (loopIndex) {},

    /**
     * Returns the search value specified in the startSimulation.
     * @returns {number} Search value
     */
    getAreaValue: function () {},
}

/**
 * To manage the unit.
 */
const Unit = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It sets the name of this data.
     * @param {string} name given names
     */
    setName: function (name) {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * Set the description of this data.
     * @param {string} description Explanatory text
     */
    setDescription: function (description) {},

    /**
     * It gets the resource handle of "Face Graphic".
     * @returns {ResourceHandle} Resource handle of "Face Graphic"
     */
    getFaceResourceHandle: function () {},

    /**
     * Change the "Face Graphic".
     * @param {ResourceHandle} handle Resource handle of "Face Graphic"
     */
    setFaceResourceHandle: function (handle) {},

    /**
     * It gets the origin information of the unit. In the enemy unit, or units are arranged from the beginning to the map, or use the determination of such unit or that appeared in the event.
     * @returns {number} UnitGroup value
     */
    getUnitGroup: function () {},

    /**
     * Unit has met the "Appearance Condition", check to see not become more disabled state. Used by the acquired unit mainly in mapData.getListFromUnitGroup (UnitGroup.ENEMYEVENT).
     * @returns {boolean} Unit has met the "Appearance Condition", true case, is not the case in the case yet valid returns false.
     */
    isGeneratable: function () {},

    /**
     * Get the ID that can be confirmed on the editor. For enemy units, getId returns 65536, but this method returns 0.
     * @returns {number} Zero-based unit ID
     */
    getBaseId: function () {},

    /**
     * This method is called for units created by selecting "Create Player as Enemy". Get the ID of the original player.
     * @returns {number} player ID
     */
    getImportSrcId: function () {},

    /**
     * Get the class of the unit.
     * @returns {Class} Class of unit
     */
    getClass: function () {},

    /**
     * Set the class of the unit.
     * @param {Class} cls Class of unit
     */
    setClass: function (cls) {},

    /**
     * Set the "Importance" of the unit.
     * @returns {number} ImportanceType value
     */
    getImportance: function () {},

    /**
     * It sets the importance of the unit.
     * @param {number} importance ImportanceType value
     */
    setImportance: function (importance) {},

    /**
     * Get the "Char Illust".
     * @param {number} id Facial expression ID
     * @returns {Image} Standing picture image
     */
    getCharIllustImage: function (id) {},

    /**
     * It gets the resource handle of the battle music.
     * @returns {ResourceHandle} Resource handle
     */
    getBattleMusicHandle: function () {},

    /**
     * true if you continue to play even after the end of combat, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isBattleMusicContinue: function () {},

    /**
     * It gets the color of motion.
     * @returns {number} Motion of color
     */
    getOriginalMotionColor: function () {},

    /**
     * Sets the color of the motion.
     * @param {number} colorIndex Motion of color
     */
    setOriginalMotionColor: function (colorIndex) {},

    /**
     * It gets the resource handle that represents the reference position of the character chip.
     * @returns {ResourceHandle} Resource handle
     */
    getCharChipResourceHandle: function () {},

    /**
     * "Cut-in" Gets the animation.
     * @param {number} attackTemplate AttackTemplateType value
     * @param {number} type The value of such MotionFighter
     * @returns {Anime} Anime
     */
    getCutinAnime: function (attackTemplate, type) {},

    /**
     * "Cut-in (Skill)" Gets the animation.
     * @param {number} attackTemplate AttackTemplateType value
     * @param {number} type The value of such MotionFighter
     * @param {Skill} skill skill
     * @returns {Anime} Anime
     */
    getCutinAnimeFromSkill: function (attackTemplate, type, skill) {},

    /**
     * If the unit is a guest character true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGuest: function () {},

    /**
     * Returns true if the unit was created by deriving it from a bookmarks unit, false otherwise.
     * @returns {boolean} Boolean
     */
    isBookmark: function () {},

    /**
     * It gets the level.
     */
    getLv: function () {},

    /**
     * To set the level.
     * @param {number} lv level
     */
    setLv: function (lv) {},

    /**
     * Get the experience value.
     * @returns {number} Experience point
     */
    getExp: function () {},

    /**
     * Set the experience value.
     * @param {number} exp Experience point
     */
    setExp: function (exp) {},

    /**
     * Get the HP.
     * @returns {number} HP
     */
    getHp: function () {},

    /**
     * Set the HP.
     * @param {number} hp HP
     */
    setHp: function (hp) {},

    /**
     * It gets the parameters in the specified index.
     * @param {number} index index
     * @returns {number} Parameters
     */
    getParamValue: function (index) {},

    /**
     * It gets the parameters for the specified index.
     * @param {number} index index
     * @param {number} value Parameters
     */
    setParamValue: function (index, value) {},

    /**
     * It gets the item at a specified index.
     * @param {number} index index
     * @returns {Item} item
     */
    getItem: function (index) {},

    /**
     * Sets the item at a specified index.
     * @param {number} index index
     * @param {Item} item item
     */
    setItem: function (index, item) {},

    /**
     * To release the item at the specified index.
     * @param {number} index index
     * @returns {Item} De-Items
     */
    clearItem: function (index) {},

    /**
     * Get a list of "Optional Skills".
     * @returns {ReferenceList} List of "Optional Skills"
     */
    getSkillReferenceList: function () {},

    /**
     * Get the "Growth Rates".
     * @returns {Parameter} growth rate
     */
    getGrowthBonus: function () {},

    /**
     * Get the "Unit Event" at the specified index.
     * @param {number} index index
     * @returns {Event} "Unit Event"
     */
    getUnitEvent: function (index) {},

    /**
     * It gets the total number of "Unit Event".
     * @returns {number} Total
     */
    getUnitEventCount: function () {},

    /**
     * Get a list of "Item Drops".
     * @returns {DataList} List of "Item Drops"
     */
    getDropTrophyList: function () {},

    /**
     * Create a currently valid AI pattern information.
     * @returns {AIPattern} AI pattern information
     */
    createAIPattern: function () {},

    /**
     * It gets the already created AI pattern information.
     * @returns {AIPattern} AI pattern information
     */
    getAIPattern: function () {},

    /**
     * Get the "Support Data" at the specified index.
     * @param {number} index index
     * @returns {SupportData} "Support Data"
     */
    getSupportData: function (index) {},

    /**
     * It gets the total number of "Support Data".
     * @returns {number} Total
     */
    getSupportDataCount: function () {},

    /**
     * Get the "Skills Learned" at the specified index.
     * @param {number} index index
     * @returns {NewSkill} "Skills Learned"
     */
    getNewSkill: function (index) {},

    /**
     * It gets the total number of "Skills Learned".
     * @returns {number} Total
     */
    getNewSkillCount: function () {},

    /**
     * It gets the ID of the class group 1.
     * @returns {number} ID
     */
    getClassGroupId1: function () {},

    /**
     * It gets the ID of the class group 2.
     * @returns {number} ID
     */
    getClassGroupId2: function () {},

    /**
     * Set the ID of the class group 1.
     * @param {number} id ID of the class group 1
     */
    setClassGroupId1: function (id) {},

    /**
     * Set the ID of the class group 2.
     * @param {number} id ID of the class group 2
     */
    setClassGroupId2: function (id) {},

    /**
     * It gets the number of times you have Advances.
     * @returns {number} Number of times
     */
    getClassUpCount: function () {},

    /**
     * Set the number of times Advances.
     * @param {number} count Number of times
     */
    setClassUpCount: function (count) {},

    /**
     * It gets the method related to fusion.
     * @returns {UnitStyle} Method on Fusion
     */
    getUnitStyle: function () {},

    /**
     * It gets the x position on the map.
     * @returns {number} x position
     */
    getMapX: function () {},

    /**
     * Set the x position on the map.
     * @param {number} x x position
     */
    setMapX: function (x) {},

    /**
     * It gets the y position on the map.
     * @returns {number} y position
     */
    getMapY: function () {},

    /**
     * It sets the y position on the map.
     * @param {number} y y position
     */
    setMapY: function (y) {},

    /**
     * It gets a value that has to slide in the x-direction.
     * @returns {number} x
     */
    getSlideX: function () {},

    /**
     * Set the value to slide in the x-direction.
     * @param {number} x x position
     */
    setSlideX: function (x) {},

    /**
     * It gets a value that has to slide in the y-direction.
     * @returns {number} y
     */
    getSlideY: function () {},

    /**
     * Set the value to slide in the y-direction.
     * @param {number} y y position
     */
    setSlideY: function (y) {},

    /**
     * It gets the unit type that represents and friendly and enemy forces.
     * @returns {number} Unit type
     */
    getUnitType: function () {},

    /**
     * It gets the direction of the unit.
     * @returns {number} DirectionType value
     */
    getDirection: function () {},

    /**
     * Set the direction of the unit.
     * @param {number} directionType DirectionType value
     */
    setDirection: function (directionType) {},

    /**
     * Get the survival status of the unit.
     * @returns {number} AliveType value
     */
    getAliveState: function () {},

    /**
     * Set the survival status of the unit.
     * @param {number} aliveType AliveType value
     */
    setAliveState: function (aliveType) {},

    /**
     * Get the sortie state of the unit.
     * @returns {number} SortieType value
     */
    getSortieState: function () {},

    /**
     * Set the sortie state of the unit.
     * @param {number} sortieType SortieType value
     */
    setSortieState: function (sortieType) {},

    /**
     * It gets the value for the action order.
     * @returns {number} OrderMarkType value
     */
    getOrderMark: function () {},

    /**
     * Set the value for the action order.
     * @param {number} orderMarkType OrderMarkType value
     */
    setOrderMark: function (orderMarkType) {},

    /**
     * Then Returns the number of turns to allow the generation of "Act Again".
     * @returns {number} Number of turns
     */
    getReactionTurnCount: function () {},

    /**
     * Then set the number of turns to allow the generation of "Act Again".
     * @param {number} value Number of turns
     */
    setReactionTurnCount: function (value) {},

    /**
     * When the unit reaches the current position, to get the spent moving force.
     * @returns {number} "Mov Consumed"
     */
    getMostResentMov: function () {},

    /**
     * When the unit reaches the current position, and set the consumption was the moving force.
     * @param {number} value "Mov Consumed"
     */
    setMostResentMov: function (value) {},

    /**
     * If the unit can display a range of movement rather than wait type is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isMovePanelVisible: function () {},

    /**
     * Get a list of the state.
     * @returns {DataList} List of state
     */
    getTurnStateList: function () {},

    /**
     * 0x08 You can set a value greater than or equal. If the value is set unit in MapSimulator.startSimulation method it is treated as a wall.
     * @param {number} flag UnitFilterFlag.OPTIONAL etc.
     */
    setOptionalFilterFlag: function (flag) {},

    /**
     * It gets the flag that has been set in the setOptionalFilterFlag. Since the flag is cleared when the startSimulation method returns the control, it does not have much to call this function.
     * @returns {number} flag
     */
    getOptionalFilterFlag: function () {},

    /**
     * Normally, a unit occupies only one tile on the map, but you can occupy multiple tiles by calling this method.
     * @param {object} arr Arrays like [[0, 1], [0, -1]]
     */
    setMultiTileArray: function (arr) {},

    /**
     * Gets an array of occupied tiles.
     * @returns {object} Arrays like [[0, 1], [0, -1]]
     */
    getMultiTileArray: function () {},

    /**
     * If you are in the standby state is true, otherwise specify the false.
     * @param {boolean} flag Boolean
     */
    setWait: function (flag) {},

    /**
     * If is in the standby state is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isWait: function () {},

    /**
     * If you want to hide state is true, otherwise specify the false.
     * @param {boolean} flag Boolean
     */
    setInvisible: function (flag) {},

    /**
     * If a non-display state is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isInvisible: function () {},

    /**
     * If you want to invulnerable state is true, otherwise specify the false.
     * @param {boolean} flag Boolean
     */
    setImmortal: function (flag) {},

    /**
     * If it is invulnerable state it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isImmortal: function () {},

    /**
     * true if you want to retreat possible state, otherwise specify the false. Setting of the guest unit is disabled.
     * @param {boolean} flag Boolean
     */
    setInjury: function (flag) {},

    /**
     * true If you are a retractable state, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isInjury: function () {},

    /**
     * If you want to bad-state guard condition is true, otherwise specify the false.
     * @param {boolean} flag Boolean
     */
    setBadStateGuard: function (flag) {},

    /**
     * If you are a bad state guard state true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isBadStateGuard: function () {},

    /**
     * If you want to act stop state is true, specifies the false otherwise.
     * @param {boolean} flag Boolean
     */
    setActionStop: function (flag) {},

    /**
     * true if the action is in a stopped state, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isActionStop: function () {},

    /**
     * If you want to catch state by "Fusion Attack" it is true, otherwise specify the false.
     * @param {boolean} flag Boolean
     */
    setSyncope: function (flag) {},

    /**
     * true if it is a catch state by "Fusion Attack", otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isSyncope: function () {},

    /**
     * It gets the resource handle of the active custom CharChip.
     * @returns {ResourceHandle} Resource handle
     */
    getCustomCharChipHandle: function () {},

    /**
     * It gets the keywords for the active custom CharChip.
     * @returns {string} keyword
     */
    getCustomCharChipKeyword: function () {},

    /**
     * It gets an object that own drawing the CharChip of this unit. Game.exe calls the moveCustomCharChip and drawCustomCharChip of this object.
     * @returns {object} object
     */
    getCustomRenderer: function () {},

    /**
     * It sets the object to its own drawing the CharChip of this unit. Object of argument must inherit the BaseCustomCharChip. When you call the method, it will be called setupCustomCharChip. Even root.setGlobalCustomRenderer has been called, this custom drawing takes precedence. You can remove the custom drawing by specifying the {}.
     * @param {object} obj object
     */
    setCustomRenderer: function (obj) {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the class.
 */
const Class = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getCharChipResourceHandle: function () {},

    /**
     * Get a list of "Equipable Weapons".
     * @returns {ReferenceList} List of "Equipable Weapons"
     */
    getEquipmentWeaponTypeReferenceList: function () {},

    /**
     * It returns a flag indicating whether the class is equipped with a combat motion of any system.
     * @returns {number} ClassMotionFlag value
     */
    getClassMotionFlag: function () {},

    /**
     * Get the class type.
     * @returns {ClassType} Class type
     */
    getClassType: function () {},

    /**
     * The class will examine whether belonging to the specified class type.
     * @param {ClassType} classType Class type
     * @returns {boolean} true if you belong, otherwise it returns false.
     */
    isClassTypeMatched: function (classType) {},

    /**
     * Get the class option.
     * @returns {number} ClassOptionFlag value
     */
    getClassOption: function () {},

    /**
     * Get the "Optional Exp".
     * @returns {number} "Optional Exp"
     */
    getBonusExp: function () {},

    /**
     * "Low", Gets a value that represents the "High".
     * @returns {number} ClassRank value
     */
    getClassRank: function () {},

    /**
     * Get the "Growth Bonus".
     * @returns {Parameter} "Growth Bonus"
     */
    getGrowthBonus: function () {},

    /**
     * Get the "Parameter Bonus".
     * @returns {Parameter} "Parameter Bonus"
     */
    getParameterBonus: function () {},

    /**
     * Get the "Optional Skills".
     * @returns {ReferenceList} Skills list
     */
    getSkillReferenceList: function () {},

    /**
     * It gets the animation data that can be handled by the specified weapon system.
     * @param {number} type WeaponCategoryType value
     * @returns {Anime} Animation data
     */
    getClassAnime: function (type) {},

    /**
     * It gets a collection of motion ID.
     * @returns {MotionIdCollection} Collection of motion ID
     */
    getMotionIdCollection: function () {},

    /**
     * Get the "Max Parameters" of class.
     * @param {number} index index
     * @returns {number} "Max Parameters"
     */
    getMaxParameter: function (index) {},

    /**
     * Get the "Max Level" of class.
     * @returns {number} level. If -1, referring to the value of configuration
     */
    getMaxLv: function () {},

    /**
     * It gets the prototype information.
     * @returns {PrototypeInfo} Prototype information
     */
    getPrototypeInfo: function () {},

    /**
     * Gets a value indicating the loop sequence of characters chip.
     * @returns {number} CharChipLoopType value
     */
    getCharChipLoopType: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the weapon.
 */
const Weapon = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * Get the weapon of resources handle at the time of the battle.
     * @returns {ResourceHandle} Resource handle
     */
    getRealWeaponResourceHandle: function () {},

    /**
     * It gets the animation of "Magical Weapon".
     * @returns {Anime} Anime
     */
    getMagicAnime: function () {},

    /**
     * Get the "Price".
     * @returns {number} "Price"
     */
    getGold: function () {},

    /**
     * Get the upper limit of "Uses".
     * @returns {number} The upper limit of "Uses"
     */
    getLimitMax: function () {},

    /**
     * Get current of the "Uses".
     * @returns {number} Current of "Uses"
     */
    getLimit: function () {},

    /**
     * Get the weight.
     * @returns {number} weight
     */
    getWeight: function () {},

    /**
     * true if it is a "Important Item", otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isImportance: function () {},

    /**
     * true to prohibit the exchange of this item, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isTradeDisabled: function () {},

    /**
     * Always returns true.
     * @returns {boolean} Boolean
     */
    isWeapon: function () {},

    /**
     * Always returns false.
     * @returns {boolean} Boolean
     */
    isWand: function () {},

    /**
     * Get the power.
     * @returns {number} power
     */
    getPow: function () {},

    /**
     * It gets the range of start.
     * @returns {number} Range
     */
    getStartRange: function () {},

    /**
     * It gets the range of the end.
     * @returns {number} Range
     */
    getEndRange: function () {},

    /**
     * Get the hit rate.
     * @returns {number} Accuracy
     */
    getHit: function () {},

    /**
     * Get the critical rate.
     * @returns {number} Critical rate
     */
    getCritical: function () {},

    /**
     * Get the "Weapon Option".
     * @returns {number} WeaponOption value
     */
    getWeaponOption: function () {},

    /**
     * Get the weapon of the system.
     * @returns {number} WeaponCategoryType value
     */
    getWeaponCategoryType: function () {},

    /**
     * Get the "Attack Count".
     * @returns {number} "Attack Count"
     */
    getAttackCount: function () {},

    /**
     * true if the "One Way" is set, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isOneSide: function () {},

    /**
     * If the effect of the weapon is reversed it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isReverseWeapon: function () {},

    /**
     * Weapons will examine whether belonging to the specified weapon type.
     * @param {WeaponType} weaponType Weapon Type
     * @returns {boolean} true if you belong, otherwise it returns false.
     */
    isWeaponTypeMatched: function (weaponType) {},

    /**
     * Get the weapon type.
     * @returns {WeaponType} Weapon Type
     */
    getWeaponType: function () {},

    /**
     * Change current of the "Uses".
     * @param {number} limit Endurance
     */
    setLimit: function (limit) {},

    /**
     * Get the "Growth Bonus".
     * @returns {Parameter} "Growth Bonus"
     */
    getGrowthBonus: function () {},

    /**
     * Get the "Parameter Bonus".
     * @returns {Parameter} "Parameter Bonus"
     */
    getParameterBonus: function () {},

    /**
     * Gets the conditions object that represents the "Effective".
     * @returns {Aggregation} Condition object
     */
    getEffectiveAggregation: function () {},

    /**
     * Get the "Optional Skills".
     * @returns {ReferenceList} Skills list
     */
    getSkillReferenceList: function () {},

    /**
     * Gets the conditions object that represents the "Users".
     * @returns {Aggregation} Condition object
     */
    getAvailableAggregation: function () {},

    /**
     * It gets a collection of motion ID.
     * @returns {MotionIdCollection} Collection of motion ID
     */
    getMotionIdCollection: function () {},

    /**
     * Gets the state triggered object on "Optional State".
     * @returns {StateInvocation} State invoked object
     */
    getStateInvocation: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the item.
 */
const Item = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * Get the "Price".
     * @returns {number} "Price"
     */
    getGold: function () {},

    /**
     * Get the upper limit of "Uses".
     * @returns {number} The upper limit of "Uses"
     */
    getLimitMax: function () {},

    /**
     * Get current of the "Uses".
     * @returns {number} Current of "Uses"
     */
    getLimit: function () {},

    /**
     * Get the weight.
     * @returns {number} weight
     */
    getWeight: function () {},

    /**
     * true if it is a "Important Item", otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isImportance: function () {},

    /**
     * true to prohibit the exchange of this item, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isTradeDisabled: function () {},

    /**
     * Always returns true.
     * @returns {boolean} Boolean
     */
    isWeapon: function () {},

    /**
     * If you are a cane item true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isWand: function () {},

    /**
     * Get the "Exp Gain".
     * @returns {number} Learning experience
     */
    getExp: function () {},

    /**
     * It gets the type of item.
     * @returns {number} Types of items
     */
    getItemType: function () {},

    /**
     * Gets a value indicating the type of the target.
     * @returns {number} UnitFilterFlag value
     */
    getFilterFlag: function () {},

    /**
     * Get the "Animation".
     * @returns {Anime} Anime
     */
    getItemAnime: function () {},

    /**
     * Get the weapon type.
     * @returns {WeaponType} Weapon Type
     */
    getWeaponType: function () {},

    /**
     * Change current of the "Uses".
     * @param {number} limit Endurance
     */
    setLimit: function (limit) {},

    /**
     * It gets the value of the range of use of the item.
     * @returns {number} Use a range of values
     */
    getRangeValue: function () {},

    /**
     * It gets the type of use range of items.
     * @returns {number} Kind of use range
     */
    getRangeType: function () {},

    /**
     * "HP Recovery" to get the information about the item.
     * @returns {RecoveryItemInfo} "HP Recovery" information about the item
     */
    getRecoveryInfo: function () {},

    /**
     * "Full Recovery" to get the information about the item.
     * @returns {EntireRecoveryItemInfo} "Full Recovery" information about the item
     */
    getEntireRecoveryInfo: function () {},

    /**
     * "Damage" to get the information about the item.
     * @returns {DamageItemInfo} "Damage" information about the item
     */
    getDamageInfo: function () {},

    /**
     * "Class Change" to get the information about the item.
     * @returns {ClassChangeItemInfo} "Class Change" information about the item
     */
    getClassChangeInfo: function () {},

    /**
     * Get the "Stat Boosting" data.
     * @returns {DopingParameter} "Stat Boosting" data
     */
    getDopingParameter: function () {},

    /**
     * Get the information about the "Learn Skill".
     * @returns {SkillChangeItemInfo} "Learn Skill" information about the
     */
    getSkillChangeInfo: function () {},

    /**
     * "Unlock" to get the information about the item.
     * @returns {KeyItemInfo} "Unlock" information about the item
     */
    getKeyInfo: function () {},

    /**
     * "Teleportation" to get the information about the item.
     * @returns {TeleportationItemInfo} "Teleportation" information about the item
     */
    getTeleportationInfo: function () {},

    /**
     * "Resurrection" to get the information about the item.
     * @returns {ResurrectionItemInfo} "Resurrection" information about the item
     */
    getResurrectionInfo: function () {},

    /**
     * "Repair" to get the information about the item.
     * @returns {DurabilityItemInfo} "Repair" information about the item
     */
    getDurabilityInfo: function () {},

    /**
     * "Steal" to get the information about the item.
     * @returns {StealItemInfo} "Steal" information about the item
     */
    getStealInfo: function () {},

    /**
     * "Inflict State" to get the information about the item.
     * @returns {StateItemInfo} "Inflict State" information about the item
     */
    getStateInfo: function () {},

    /**
     * "Cure State" to get the information about the item.
     * @returns {StateRecoveryItemInfo} "Cure State" information about the item
     */
    getStateRecoveryInfo: function () {},

    /**
     * "Switch" to get the information about the item.
     * @returns {SwitchItemInfo} "Switch" information about the item
     */
    getSwitchInfo: function () {},

    /**
     * "Fusion" to get the information about the item.
     * @returns {FusionItemInfo} "Fusion" information about the item
     */
    getFusionInfo: function () {},

    /**
     * "Transform" to get the information about the item.
     * @returns {MetamorphozeItemInfo} "Transform" information about the item
     */
    getMetamorphozeInfo: function () {},

    /**
     * "Custom" Gets a string about the item.
     * @returns {string} "Custom" string about the item
     */
    getCustomKeyword: function () {},

    /**
     * Get the "Growth Bonus".
     * @returns {Parameter} "Growth Bonus"
     */
    getGrowthBonus: function () {},

    /**
     * Get the "Parameter Bonus".
     * @returns {Parameter} "Parameter Bonus"
     */
    getParameterBonus: function () {},

    /**
     * Get the "Optional Skills".
     * @returns {DataList} Skills list
     */
    getSkillReferenceList: function () {},

    /**
     * It gets the conditions object that represents the private information.
     * @returns {Aggregation} Condition object
     */
    getAvailableAggregation: function () {},

    /**
     * Get the information of "Guard State".
     * @returns {StateGroup} Information of "Guard State"
     */
    getStateGroup: function () {},

    /**
     * Get the "Effective Targets" to check the item use.
     * @returns {Aggregation} Condition object
     */
    getTargetAggregation: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * And management skills information.
 */
const Skill = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * true if you want to display at the time of activation is, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isSkillDisplayable: function () {},

    /**
     * It gets a value that represents the "Skill Type".
     * @returns {number} SkillType value
     */
    getSkillType: function () {},

    /**
     * It gets a number of skills.
     * @returns {number} Numeric value
     */
    getSkillValue: function () {},

    /**
     * It gets the sub-numerical skills. For example, in the skills to steal, it returns the type to steal in getSkillValue, returns the experience value in getSkillSubValue.
     * @returns {number} Sub-numeric
     */
    getSkillSubValue: function () {},

    /**
     * It gets the type of "Activation Rate".
     * @returns {number} InvocationType value
     */
    getInvocationType: function () {},

    /**
     * It gets the value of "Activation Rate".
     * @returns {number} The value of "Activation Rate"
     */
    getInvocationValue: function () {},

    /**
     * It gets the value of the range.
     * @returns {number} The range of values
     */
    getRangeValue: function () {},

    /**
     * The scope of the type you get.
     * @returns {number} Range of types
     */
    getRangeType: function () {},

    /**
     * It gets the animation that is displayed when the map battle.
     * @returns {Anime} Anime
     */
    getEasyAnime: function () {},

    /**
     * It gets the animation that is displayed at the time of real combat.
     * @returns {Anime} Anime
     */
    getRealAnime: function () {},

    /**
     * Get the support status.
     * @returns {SupportStats} Support status
     */
    getSupportStatus: function () {},

    /**
     * Get the "Parameter Bonus".
     * @returns {Parameter} "Parameter Bonus"
     */
    getParameterBonus: function () {},

    /**
     * Get a list of "Transform" to allow.
     * @returns {ReferenceList} list
     */
    getDataReferenceList: function () {},

    /**
     * If you do not want to see on the menu true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isHidden: function () {},

    /**
     * Get the "Effective Targets" to confirm the skill trigger.
     * @returns {Aggregation} Condition object
     */
    getTargetAggregation: function () {},

    /**
     * It gets the custom of the keyword.
     * @returns {string} Custom keyword
     */
    getCustomKeyword: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the state information.
 */
const State = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * Get the "Duration in turns" of the state.
     * @returns {number} Number of turns
     */
    getTurn: function () {},

    /**
     * Get the "Auto Reovery" value.
     * @returns {number} Numeric value
     */
    getAutoRecoveryValue: function () {},

    /**
     * Get the "Seal".
     * @returns {number} BadStateFlag value
     */
    getBadStateFlag: function () {},

    /**
     * Get the option.
     * @returns {number} BadStateOption value
     */
    getBadStateOption: function () {},

    /**
     * It gets the animation that is displayed in the map.
     * @returns {Anime} Anime
     */
    getEasyAnime: function () {},

    /**
     * It gets the animation that is displayed at the time of real combat.
     * @returns {Anime} Anime
     */
    getRealAnime: function () {},

    /**
     * Each time the turn has elapsed, to get the either reduce how much the doping information.
     * @returns {number} Decrease in value
     */
    getTurnChangeValue: function () {},

    /**
     * It gets the value of "Auto Removal Condition".
     * @returns {number} StateAutoRemovalFlowEntry value
     */
    getAutoRemovalType: function () {},

    /**
     * It gets the number of times of "Auto Removal Condition".
     * @returns {number} Number of times
     */
    getAutoRemovalValue: function () {},

    /**
     * If treated as a bad state true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isBadState: function () {},

    /**
     * If you do not want to see on the menu true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isHidden: function () {},

    /**
     * Get the doping information.
     * @returns {Parameter} Doping information
     */
    getDopingParameter: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the terrain information.
 */
const Terrain = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the image of the map chip image.
     * @returns {Image} Image of map chip image
     */
    getMapChipImage: function () {},

    /**
     * Get the evasion rate.
     * @returns {number} Evasion rate
     */
    getAvoid: function () {},

    /**
     * It gets the defense force.
     * @returns {number} Defense force
     */
    getDef: function () {},

    /**
     * Get the Maboryoku.
     * @returns {number} Maboryoku
     */
    getMdf: function () {},

    /**
     * Get the "Auto Reovery".
     * @returns {number} Spontaneous recovery
     */
    getAutoRecoveryValue: function () {},

    /**
     * It gets the battle background image.
     * @param {number} colorIndex Index indicating the color
     * @returns {Image} image
     */
    getBattleBackgroundImage: function (colorIndex) {},

    /**
     * The unit to the base to get the "Mov Consumed".
     * @param {object} unit unit
     * @returns {number} Consumption moving force
     */
    getMovePoint: function (unit) {},

    /**
     * Get the "Mov Consumed" based on the ID of the "Move Types".
     * @param {number} moveTypeId ID of "Move Types"
     * @returns {number} "Mov Consumed"
     */
    getMovePointFromMoveTypeId: function (moveTypeId) {},

    /**
     * Get the "Optional Skills".
     * @returns {DataList} "Optional Skills"
     */
    getSkillReferenceList: function () {},

    /**
     * Get the "Passable Conditions".
     * @returns {Aggregation} Condition object
     */
    getPassableAggregation: function () {},

    /**
     * Get the "Terrain Group".
     * @returns {TerrainGroup} "Terrain Group"
     */
    getTerrainGroup: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the terrain group.
 */
const TerrainGroup = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},
}

/**
 * To manage the class group information.
 */
const ClassGroup = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the total number of entries in the class group.
     * @returns {number} Total
     */
    getClassGroupEntryCount: function () {},

    /**
     * It gets the entry of the class group.
     * @param {number} index index
     * @returns {ClassGroupEntry} entry
     */
    getClassGroupEntryData: function (index) {},
}

/**
 * To manage the information of the class group entry.
 */
const ClassGroupEntry = {
    /**
     * It gets the object class.
     * @returns {Class} class
     */
    getClass: function () {},

    /**
     * Switches required to Advances Make sure whether it is on.
     * @returns {boolean} If the switch is on true, otherwise it returns false.
     */
    isGlobalSwitchOn: function () {},

    /**
     * And obtain the necessary parameters to Advances.
     * @param {number} index index
     * @returns {number} Parameter values
     */
    getParameterValue: function (index) {},

    /**
     * It gets the condition value required for Advances.
     * @param {number} index index
     * @returns {number} OverUnder value
     */
    getConditionValue: function (index) {},
}

/**
 * To manage the class type of information.
 */
const ClassType = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * It gets the ID of "Move Types".
     * @returns {number} ID of "Move Types"
     */
    getMoveTypeId: function () {},

    /**
     * true if to take into account the bonus of terrain effect, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isTerrainBonusEnabled: function () {},

    /**
     * It gets the resource handle of the sound effect at the time of movement.
     * @returns {ResourceHandle} Resource handle
     */
    getMoveSoundHandle: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the weapon type of information.
 */
const WeaponType = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * Get the weapon of the system.
     * @returns {number} WeaponCategoryType value
     */
    getWeaponCategoryType: function () {},

    /**
     * Get the "Broken Weapon".
     * @returns {Weapon} weapon
     */
    getBreakedWeapon: function () {},

    /**
     * If you want to display in the stock exchange it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isStockTradeVisible: function () {},

    /**
     * true If you reduce the time hit only durable, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isHitDecrement: function () {},

    /**
     * It gets the number of "Compatibility".
     * @returns {number} The number of "Compatibility"
     */
    getCompatibleCount: function () {},

    /**
     * It gets the data of "Compatibility".
     * @param {number} index index
     * @returns {CompatibleData} Data of "Compatibility"
     */
    getCompatibleData: function (index) {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the information of "Difficulty".
 */
const Difficulty = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * Get the "Basic Exp".
     * @returns {number} "Basic Exp"
     */
    getBaseExperience: function () {},

    /**
     * Get the option.
     * @returns {number} DifficultyFlag value
     */
    getDifficultyOption: function () {},

    /**
     * Get a list of "Default Enabled Fusion".
     * @returns {ReferenceList} Fusion list
     */
    getFusionReferenceList: function () {},

    /**
     * Display conditions will confirm whether it is turned on.
     * @returns {boolean} In the case of on-true, otherwise it returns false.
     */
    isGlobalSwitchOn: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the information of the NPC.
 */
const Npc = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getFaceResourceHandle: function () {},

    /**
     * Get the Standing picture image.
     * @param {number} id Facial expression ID
     * @returns {Image} Standing picture image
     */
    getCharIllustImage: function (id) {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the information of the race.
 */
const Race = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the information of fusion.
 */
const Fusion = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * Get the "Type".
     * @returns {number} FusionType value
     */
    getFusionType: function () {},

    /**
     * It gets the type of unit to allow fusion.
     * @returns {number} UnitFilterFlag value
     */
    getFilterFlag: function () {},

    /**
     * It gets the name of the "Catch" command.
     * @returns {string} given names
     */
    getCatchName: function () {},

    /**
     * It gets the description of the "Release" command.
     * @returns {string} Explanatory text
     */
    getReleaseName: function () {},

    /**
     * It gets the description of the "Trade" command.
     * @returns {string} Explanatory text
     */
    getTradeName: function () {},

    /**
     * If you want to allow the unit exchange is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isUnitTradable: function () {},

    /**
     * If you want to allow the item exchange is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isItemTradable: function () {},

    /**
     * Gets a value indicating the processing of post-release.
     * @returns {number} FusionReleaseType value
     */
    getFusionReleaseType: function () {},

    /**
     * If the ability comparison to fusion is satisfied true, otherwise it returns false.
     * @param {Unit} src unit
     * @param {Unit} dest Partner unit
     * @returns {boolean} Boolean
     */
    compareUnitCapacity: function (src, dest) {},

    /**
     * If the Fusion can condition is satisfied it is true, otherwise it returns false.
     * @param {Unit} src unit
     * @returns {boolean} Boolean
     */
    isSrcCondition: function (src) {},

    /**
     * If the conditions to be fusion is satisfied true, otherwise it returns false.
     * @param {Unit} dest unit
     * @returns {boolean} Boolean
     */
    isDestCondition: function (dest) {},

    /**
     * It gets the calculated object of the midst of fusion.
     * @returns {Calculation} Calculation object
     */
    getStatusCalculation: function () {},

    /**
     * It gets the calculated object of when to launch the "Fusion Attack".
     * @returns {Calculation} Calculation object
     */
    getAttackCalculation: function () {},

    /**
     * It gets a flag that represents the skills to incorporate at the time of fusion.
     * @returns {number} ObjectFlag value
     */
    getSkillIncludedObjectFlag: function () {},

    /**
     * Get the "Transform" data to be executed after fusion.
     * @returns {Metamorphoze} "Transform" data
     */
    getMetamorphozeData: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the information of the morphological changes.
 */
const Metamorphoze = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * Get the class of "Transform".
     * @returns {Class} class
     */
    getClass: function () {},

    /**
     * Get the "Play when Transformed".
     * @returns {Anime} Anime
     */
    getChangeAnime: function () {},

    /**
     * Get the "Play when Canceled".
     * @returns {Anime} Anime
     */
    getCancelAnime: function () {},

    /**
     * It gets a flag that indicates the cancellation of the kind.
     * @returns {number} MetamorphozeCancelFlag
     */
    getCancelFlag: function () {},

    /**
     * Cancel Gets the number of turns that occur.
     * @returns {number} Number of turns
     */
    getCancelTurn: function () {},

    /**
     * It gets the command name of the cancellation.
     * @returns {string} Command name
     */
    getCancelManualName: function () {},

    /**
     * If the parameter condition is satisfied it is true, otherwise it returns false.
     * @param {Unit} unit unit
     * @returns {boolean} Boolean
     */
    isParameterCondition: function (unit) {},

    /**
     * If the data condition is satisfied it is true, otherwise it returns false.
     * @param {Unit} unit unit
     * @returns {boolean} Boolean
     */
    isDataCondition: function (unit) {},

    /**
     * It gets the number of "Item Conversion".
     * @returns {number} The number of "Item Conversion"
     */
    getConvertItemCount: function () {},

    /**
     * Get the "Before".
     * @param {number} index index
     * @returns {Item} item
     */
    getConvertItemSrc: function (index) {},

    /**
     * Get the "After".
     * @param {number} index index
     * @returns {Item} item
     */
    getConvertItemDest: function (index) {},

    /**
     * Get a list of states to be granted after the transformation.
     * @returns {ReferenceList} list of states
     */
    getStateReferenceList: function () {},

    /**
     * Get the value that will be corrected while transforming.
     * @returns {Calculation} Calculation Object
     */
    getStatusCalculation: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the compatibility data.
 */
const CompatibleData = {
    /**
     * Compatibility Gets a good valid object.
     * @returns {object} Enable object
     */
    getSrcObject: function () {},

    /**
     * It gets the correction status.
     * @returns {SupportStatus} Correction status
     */
    getSupportStatus: function () {},
}

/**
 * To manage the assistance data.
 */
const SupportData = {
    /**
     * It gets the unit of support subject.
     * @returns {Unit} unit
     */
    getUnit: function () {},

    /**
     * true if the set global switches is turned on, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isGlobalSwitchOn: function () {},

    /**
     * It gets the correction status.
     * @returns {boolean} Correction status
     */
    isVariableOn: function () {},

    /**
     * If the condition indicated by the variable is satisfied true, otherwise it returns false.
     * @returns {SupportStatus} Boolean
     */
    getSupportStatus: function () {},
}

/**
 * To manage the learning skills.
 */
const NewSkill = {
    /**
     * Learning can get the skills.
     * @returns {Skill} skill
     */
    getSkill: function () {},

    /**
     * A level that you can learn to get.
     * @returns {number} level
     */
    getLv: function () {},
}

/**
 * To manage the shop data.
 */
const ShopData = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * Constitute the shop screen to get the "Shop Layout".
     * @returns {ShopLayout} "Shop Layout"
     */
    getShopLayout: function () {},

    /**
     * It gets an array of items arranged in the store.
     * @returns {object} Array
     */
    getShopItemArray: function () {},

    /**
     * It gets an array of stock items.
     * @returns {object} Array
     */
    getInventoryNumberArray: function () {},

    /**
     * Always returned true.
     * @returns {boolean} Boolean
     */
    isShopDisplayable: function () {},
}

/**
 * To manage the original data.
 */
const OriginalData = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * Get the original content.
     * @returns {OriginalContent} Original content
     */
    getOriginalContent: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the original content.
 */
const OriginalContent = {
    /**
     * It gets the unit.
     * @returns {Unit} unit
     */
    getUnit: function () {},

    /**
     * Get the class.
     * @returns {Class} class
     */
    getClass: function () {},

    /**
     * It gets the item.
     * @returns {Item} item
     */
    getItem: function () {},

    /**
     * Get the skills.
     * @returns {Skill} skill
     */
    getSkill: function () {},

    /**
     * It gets the state.
     * @returns {State} State
     */
    getState: function () {},

    /**
     * It gets the animation.
     * @returns {Anime} Anime
     */
    getAnime: function () {},

    /**
     * It gets a number.
     * @param {number} n index
     * @returns {number} Numeric value
     */
    getValue: function (n) {},

    /**
     * Get the "Multiple Data".
     * @returns {Aggregation} Condition object
     */
    getTargetAggregation: function () {},

    /**
     * It gets the keyword.
     * @returns {string} keyword
     */
    getCustomKeyword: function () {},
}

/**
 * To manage the information of the map.
 */
const MapData = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the description of this data.
     * @returns {string} Explanatory text
     */
    getDescription: function () {},

    /**
     * It gets the resource handle of this data.
     * @returns {ResourceHandle} Resource handle
     */
    getIconResourceHandle: function () {},

    /**
     * Get the map name.
     * @returns {string} Map name
     */
    getMapName: function () {},

    /**
     * It gets the width of the map.
     * @returns {number} Map of width
     */
    getMapWidth: function () {},

    /**
     * It gets the height of the map.
     * @returns {number} The height of the map
     */
    getMapHeight: function () {},

    /**
     * Get the "Chapter".
     * @returns {number} "Chapter"
     */
    getChapterNumber: function () {},

    /**
     * Get the "Max Units".
     * @returns {number} "Max Units"
     */
    getSortieMaxCount: function () {},

    /**
     * Gets the x-coordinate of the sortie position.
     * @param {number} index index
     * @returns {number} x-coordinate
     */
    getSortiePosX: function (index) {},

    /**
     * Gets the y-coordinate of the sortie position.
     * @param {number} index index
     * @returns {number} y coordinate
     */
    getSortiePosY: function (index) {},

    /**
     * And the index acquisition shows the color of the map.
     * @returns {number} Index indicating the color
     */
    getMapColorIndex: function () {},

    /**
     * Get the "Fixed Background" image.
     * @returns {Image} background image
     */
    getFixedBackgroundImage: function () {},

    /**
     * It gets the resource handle of "Player Phase" BGM.
     * @returns {ResourceHandle} Resource handle
     */
    getPlayerTurnMusicHandle: function () {},

    /**
     * It gets the resource handle of "Enemy Phase" BGM.
     * @returns {ResourceHandle} Resource handle
     */
    getEnemyTurnMusicHandle: function () {},

    /**
     * It gets the resource handle of "Ally Phase" BGM.
     * @returns {ResourceHandle} Resource handle
     */
    getAllyTurnMusicHandle: function () {},

    /**
     * It gets the resource handle of "Player Battle" BGM.
     * @returns {ResourceHandle} Resource handle
     */
    getPlayerBattleMusicHandle: function () {},

    /**
     * It gets the resource handle of "Enemy Battle" BGM.
     * @returns {ResourceHandle} Resource handle
     */
    getEnemyBattleMusicHandle: function () {},

    /**
     * It gets the resource handle of "Ally Battle" BGM.
     * @returns {ResourceHandle} Resource handle
     */
    getAllyBattleMusicHandle: function () {},

    /**
     * It gets the resource handle of "Battle Prep" BGM.
     * @returns {ResourceHandle} Resource handle
     */
    getBattleSetupMusicHandle: function () {},

    /**
     * It gets the total number of appearance position of reinforcements.
     * @returns {number} The total number of appearance position of the reinforcements
     */
    getReinforcementPosCount: function () {},

    /**
     * It gets the appearance position of the reinforcements.
     * @param {number} index index
     * @returns {ReinforcementPos} Appeared position of the reinforcements
     */
    getReinforcementPos: function (index) {},

    /**
     * It gets the total number of "Fixed Units" unit.
     * @returns {number} Total
     */
    getForceSortieCount: function () {},

    /**
     * It gets the data related to "Fixed Units".
     * @param {number} index index
     * @returns {ForceSortie} Data on the "Fixed Units"
     */
    getForceSortie: function (index) {},

    /**
     * Gets the conditions object that represents the "Sortie Restriction".
     * @returns {Aggregation} Condition object
     */
    getSortieAggregation: function () {},

    /**
     * It gets the table of "Local Switches".
     * @returns {SwitchTable} table
     */
    getLocalSwitchTable: function () {},

    /**
     * It gets the type of map.
     * @returns {number} MapType value
     */
    getMapType: function () {},

    /**
     * true if the "Display Battle Prep" is set, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isBattleSetupScreenDisplayable: function () {},

    /**
     * If If you want to map scroll is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isMapScroll: function () {},

    /**
     * It gets a string that represents the "Victory conditions".
     * @param {number} index index
     * @returns {string} A string that represents the "Victory conditions"
     */
    getVictoryCondition: function (index) {},

    /**
     * It gets a string that represents the "Defeat conditions".
     * @param {number} index index
     * @returns {string} A string that represents the "Defeat conditions"
     */
    getDefeatCondition: function (index) {},

    /**
     * It sets the string that represents the "Victory conditions".
     * @param {number} index index
     * @param {string} victoryCondition A string that represents the "Victory conditions"
     */
    setVictoryCondition: function (index, victoryCondition) {},

    /**
     * It sets the string that represents the "Defeat conditions".
     * @param {number} index index
     * @param {string} defeatCondition A string that represents the "Defeat conditions"
     */
    setDefeatCondition: function (index, defeatCondition) {},

    /**
     * Get a list of shop data.
     * @returns {DataList} List of shop data
     */
    getShopDataList: function () {},

    /**
     * Specify to get a list of units such as UnitGroup.ENEMY. Acquired unit in UnitGroup.EVENTENEMY can be used as unit.isGeneratable. In addition, the unit can be specified to mapData.generateUnitFromBaseUnit.
     * @param {number} unitGroup UnitGroup value
     * @returns {DataList} List of unit
     */
    getListFromUnitGroup: function (unitGroup) {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}

/**
 * To manage the position information of the reinforcements.
 */
const ReinforcementPos = {
    /**
     * Gets the x-coordinate of the appearance position of the reinforcements.
     * @returns {number} x-coordinate
     */
    getX: function () {},

    /**
     * Gets the y-coordinate of the appearance position of the reinforcements.
     * @returns {number} y coordinate
     */
    getY: function () {},

    /**
     * It gets the number of reinforcements data.
     * @returns {number} The number of reinforcements data
     */
    getReinforcementPageCount: function () {},

    /**
     * Get the reinforcements data.
     * @param {number} index index
     * @returns {ReinforcementPage} Reinforcements data
     */
    getReinforcementPage: function (index) {},
}

/**
 * To manage the page information of reinforcements.
 */
const ReinforcementPage = {
    /**
     * It gets the direction in which the reinforcements appear.
     * @returns {number} direction
     */
    getDirectionType: function () {},

    /**
     * Get the "Start Turn".
     * @returns {number} Start turn
     */
    getStartTurn: function () {},

    /**
     * Get the "End Turn".
     * @returns {number} Exit turn
     */
    getEndTurn: function () {},

    /**
     * The kind of turn to get.
     * @returns {number} TurnType
     */
    getTurnType: function () {},

    /**
     * If you want to appear in a vacant lot point if you can not appeared true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isForce: function () {},

    /**
     * If treated as a relative turn true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isRelativeTurn: function () {},

    /**
     * If the reinforcements meets the appearance conditions true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isCondition: function () {},

    /**
     * Gets the unit appeared schedule.
     * @returns {Unit} unit
     */
    getSourceUnit: function () {},
}

/**
 * To manage the data of "Fixed Units".
 */
const ForceSortie = {
    /**
     * It gets the unit of "Fixed Units" object.
     * @returns {Unit} unit
     */
    getUnit: function () {},

    /**
     * It gets the number of "Fixed" of the unit.
     * @returns {number} Number of "Fixed"
     */
    getNumber: function () {},
}

/**
 * Manage map color.
 */
const MapColor = {
    /**
     * Get the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} Name
     */
    getName: function () {},

    /**
     * Get the color of this data.
     * @returns {number} Color
     */
    getColor: function () {},

    /**
     * Get the opacity of this data.
     * @returns {number} Opacity
     */
    getAlpha: function () {},
}

/**
 * To manage the information of the additional motion.
 */
const OriginalMotion = {
    /**
     * It gets the ID of this data. Returns more than 100 of value. ID can be specified, such as in getFrameCount of Anime object.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * Get the attack type.
     * @returns {number} AttackTemplateType value
     */
    getAttackTemplateType: function () {},

    /**
     * It gets the motion type. Motion type, "Wait" and "Move", represents the like "Direct Attack".
     * @returns {number} MotionCategoryType value
     */
    getMotionCategoryType: function () {},
}

/**
 * To manage the animation information. Anime is either the motion or the effect.
 */
const Anime = {
    /**
     * It gets the ID of this data.
     * @returns {number} ID
     */
    getId: function () {},

    /**
     * Get the name of this data.
     * @returns {string} given names
     */
    getName: function () {},

    /**
     * It gets the type of animation.
     * @returns {number} AnimeType value
     */
    getAnimeType: function () {},

    /**
     * It gets the template value of anime.
     * @returns {number} AttackTemplateType value
     */
    getAttackTemplateType: function () {},

    /**
     * Get the silhouette value of the weapon.
     * @returns {number} WeaponSilhouetteType value
     */
    getWeaponSilhouetteType: function () {},

    /**
     * If the weapon is disabled true, otherwise it returns false.
     * @param {number} motionId ID of motion
     * @returns {boolean} Boolean
     */
    isWeaponDisabled: function (motionId) {},

    /**
     * If you do not want to erase the weapon at the time hit of indirect attack it is true, otherwise it returns false.
     * @param {number} motionId ID of motion
     * @returns {boolean} Boolean
     */
    isHitLossDisabled: function (motionId) {},

    /**
     * If the magic actuation animation is disabled true, otherwise it returns false.
     * @param {number} motionId ID of motion
     * @returns {boolean} Boolean
     */
    isInvocationDisabled: function (motionId) {},

    /**
     * It gets the size of the motion.
     * @returns {number} The size of the motion
     */
    getSize: function () {},

    /**
     * If you want to allow the inversion at the time of real combat is true, otherwise it returns false. Always in the case of motion is returned true.
     * @returns {boolean} Boolean
     */
    isMirrorAllowed: function () {},

    /**
     * If you want to see the effect in front of the combat UI is true, otherwise it returns false. Always in the case of motion is returned true.
     * @returns {boolean} Boolean
     */
    isFrontDisplayable: function () {},

    /**
     * Get the "Y Pos Rate (%)" in "Enemy Offset".
     * @returns {number} value
     */
    getEnemyOffsetWeight: function () {},

    /**
     * If you want to disable "Enemy Offset" it is true, otherwise it returns false.
     * @returns {boolean} Boolean
     */
    isEnemyOffsetDisabled: function () {},

    /**
     * It gets the number of motion.
     * @returns {number} The number of motion
     */
    getMotionCount: function () {},

    /**
     * It gets the ID of the motion from the index of the motion.
     * @param {number} index The index of motion
     * @returns {number} ID of motion
     */
    getMotionIdFromIndex: function (index) {},

    /**
     * It gets the type of motion in the specified motion.
     * @param {number} motionId ID of motion
     * @returns {number} MotionCategoryType value
     */
    getMotionCategoryType: function (motionId) {},

    /**
     * true if the motion type of the specified motion is an absolute format, otherwise it returns false.
     * @param {number} motionId ID of motion
     * @returns {boolean} Boolean
     */
    isAbsoluteMotion: function (motionId) {},

    /**
     * true if the specified motion is one that has been added its own is, otherwise it returns false. Internally, motionId has to determine whether more than 100.
     * @param {number} motionId ID of motion
     * @returns {boolean} Boolean
     */
    isMotionIdOriginal: function (motionId) {},

    /**
     * It gets the number of frames in the specified motion.
     * @param {number} motionId ID of motion
     * @returns {number} The number of frames
     */
    getFrameCount: function (motionId) {},

    /**
     * It gets the number of sprites that exist in the specified frame.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {number} The number of sprites
     */
    getSpriteCount: function (motionId, frameIndex) {},

    /**
     * It gets the set counter value in the frame.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {number} Counter value
     */
    getFrameCounterValue: function (motionId, frameIndex) {},

    /**
     * It gets the loop value that is set in the frame.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {number} MagicLoop value
     */
    getLoopValue: function (motionId, frameIndex) {},

    /**
     * If the frame is set to hit true, otherwise it returns false.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {boolean} Boolean
     */
    isHitFrame: function (motionId, frameIndex) {},

    /**
     * If the frame is set to the start position of throwing / projection true, otherwise it returns false.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {boolean} Boolean
     */
    isThrowFrame: function (motionId, frameIndex) {},

    /**
     * If the brightness in the frame is set true, otherwise it returns false.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {boolean} Boolean
     */
    isBrightFrame: function (motionId, frameIndex) {},

    /**
     * If the sound effect is set to frame true, otherwise it returns false.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {boolean} Boolean
     */
    isSoundFrame: function (motionId, frameIndex) {},

    /**
     * It gets the resource handle of the sound effects.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {ResourceHandle} Sound effects resource handle
     */
    getSoundHandle: function (motionId, frameIndex) {},

    /**
     * If you want to change the brightness is true, otherwise it returns false.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {boolean} Boolean
     */
    isScreenColorOverlay: function (motionId, frameIndex) {},

    /**
     * It gets the color of brightness.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {number} color
     */
    getScreenColor: function (motionId, frameIndex) {},

    /**
     * It gets the transparency of brightness.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {number} Transparency
     */
    getScreenColorAlpha: function (motionId, frameIndex) {},

    /**
     * It gets the change rate of the brightness.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {number} SpeedType value
     */
    getScreenColorChangeSpeedType: function (motionId, frameIndex) {},

    /**
     * It gets the effective range of brightness.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {number} EffectRangeType value
     */
    getScreenColorEffectRangeType: function (motionId, frameIndex) {},

    /**
     * It gets the image of the background animation.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {object} image
     */
    getBackgroundAnimeImage: function (motionId, frameIndex) {},

    /**
     * It gets the transparency of the background animation.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {number} Transparency
     */
    getBackgroundAnimeAlpha: function (motionId, frameIndex) {},

    /**
     * It gets the effective range of the background animation.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {number} EffectRangeType value
     */
    getBackgroundAnimeRangeType: function (motionId, frameIndex) {},

    /**
     * If the enemy offset is set to frame true, otherwise it returns false.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {boolean} Boolean
     */
    isEnemyOffsetFrame: function (motionId, frameIndex) {},

    /**
     * Gets the x-coordinate of the enemy offset.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {number} x-coordinate
     */
    getEnemyOffsetX: function (motionId, frameIndex) {},

    /**
     * Gets the y-coordinate in enemy offset.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {number} y coordinate
     */
    getEnemyOffsetY: function (motionId, frameIndex) {},

    /**
     * If you want to reverse the enemy true, otherwise it returns false.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {boolean} Boolean
     */
    isEnemyOffsetReverse: function (motionId, frameIndex) {},

    /**
     * Get the "Damage Motion Number".
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {number} x-coordinate
     */
    getEnemyDamageMotionValue: function (motionId, frameIndex) {},

    /**
     * It gets the custom parameters for the specified frame.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @returns {object} Custom parameters
     */
    getFrameCustom: function (motionId, frameIndex) {},

    /**
     * It gets the type of the sprite of the image.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} spriteIndex The index of the sprite
     * @returns {number} GraphicsType value
     */
    getSpriteGraphicsType: function (motionId, frameIndex, spriteIndex) {},

    /**
     * It gets the type of sprite.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} spriteIndex The index of the sprite
     * @returns {number} SpriteType value
     */
    getSpriteType: function (motionId, frameIndex, spriteIndex) {},

    /**
     * It gets the index corresponding from the type of sprite.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} spriteType SpriteType value
     * @returns {number} The index of the sprite
     */
    getSpriteIndexFromType: function (motionId, frameIndex, spriteType) {},

    /**
     * Gets the x-coordinate of the sprite.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} spriteIndex The index of the sprite
     * @returns {number} x-coordinate
     */
    getSpriteX: function (motionId, frameIndex, spriteIndex) {},

    /**
     * Gets the y-coordinate of the sprite.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} spriteIndex The index of the sprite
     * @returns {number} y coordinate
     */
    getSpriteY: function (motionId, frameIndex, spriteIndex) {},

    /**
     * It gets the width of the sprite.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} spriteIndex The index of the sprite
     * @returns {number} width
     */
    getSpriteWidth: function (motionId, frameIndex, spriteIndex) {},

    /**
     * It gets the height of the sprite.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} spriteIndex The index of the sprite
     * @returns {number} height
     */
    getSpriteHeight: function (motionId, frameIndex, spriteIndex) {},

    /**
     * It gets the alpha value of sprite.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} spriteIndex The index of the sprite
     * @returns {number} Alpha value
     */
    getSpriteAlpha: function (motionId, frameIndex, spriteIndex) {},

    /**
     * It gets the angle of the sprite.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} spriteIndex The index of the sprite
     * @returns {number} angle
     */
    getSpriteDegree: function (motionId, frameIndex, spriteIndex) {},

    /**
     * If the sprite is inverted true, otherwise it returns false.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} spriteIndex The index of the sprite
     * @returns {boolean} Boolean
     */
    isSpriteReverse: function (motionId, frameIndex, spriteIndex) {},

    /**
     * It gets the resource handle that represents the image of the sprite.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} spriteIndex The index of the sprite
     * @returns {ResourceHandle} Resource handle
     */
    getSpriteGraphicsHandle: function (motionId, frameIndex, spriteIndex) {},

    /**
     * If the focus falls on the sprite true, otherwise it returns false.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} spriteIndex The index of the sprite
     * @returns {boolean} Boolean
     */
    isFocusSprite: function (motionId, frameIndex, spriteIndex) {},

    /**
     * It gets the index on the weapon of the image.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} weaponIndex The index of weapons
     * @returns {number} The index on the image
     */
    getWeaponSrcXPlus: function (motionId, frameIndex, weaponIndex) {},

    /**
     * It gets the name of the additional sprite.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} spriteIndex The index of weapons
     * @returns {string} Sprite name
     */
    getSpriteName: function (motionId, frameIndex, spriteIndex) {},

    /**
     * If the sprite is valid true, otherwise it returns false.
     * @param {number} motionId ID of motion
     * @param {number} frameIndex The index of the frame
     * @param {number} spriteIndex The index of weapons
     * @returns {boolean} Boolean
     */
    isSpriteEnabled: function (motionId, frameIndex, spriteIndex) {},

    /**
     * It gets the total of resources that this animation is included. Add sprite and background animation will also be taken into account.
     * @returns {number} The number of resources
     */
    getIncludedResourceCount: function () {},

    /**
     * It gets the custom parameters.
     * @returns {object} Custom parameters
     */
    custom: function () {},
}
