

// After changes you must save then reload Gnome Shell
// Do this with Alt + F2 then r then Enter

const GETTEXT_DOMAIN = 'my-indicator-extension';

const { GObject, St } = imports.gi;
const Meta = imports.gi.Meta;
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Shell = imports.gi.Shell;
const WindowManager = imports.ui.windowManager;
const Mainloop = imports.mainloop;
const Signals = imports.signals;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();
// const Utils = Me.imports.utils;

const _ = ExtensionUtils.gettext;

function getSettings() {
  let GioSSS = Gio.SettingsSchemaSource;
  let schemaSource = GioSSS.new_from_directory(
    Me.dir.get_child("schemas").get_path(),
    GioSSS.get_default(),
    false
  );
  let schemaObj = schemaSource.lookup(
    'org.gnome.shell.extensions.hotkeysForActivatingSiblingsInDashToPanel', true);
  if (!schemaObj) {
    throw new Error('cannot find schemas');
  }
  return new Gio.Settings({ settings_schema : schemaObj });
}

// Taken from https://github.com/home-sweet-gnome/dash-to-panel/blob/master/utils.js#L395
// That version isn't tested, it has an obvious problem
// I made the obvious fix and now it works
var activateSiblingWindow = function(windows, direction, startWindow) {
    let windowIndex = windows.indexOf(global.display.focus_window);
    let nextWindowIndex = windowIndex < 0 ?
                          startWindow ? windows.indexOf(startWindow) : 0 : 
                          windowIndex + (direction == 'left' ? -1 : 1);

    if (nextWindowIndex == windows.length) {
        nextWindowIndex = 0;
    } else if (nextWindowIndex < 0) {
        nextWindowIndex = windows.length - 1;
    }

    if (windowIndex != nextWindowIndex) {
        Main.activateWindow(windows[nextWindowIndex]);
    }
};

// timeBetweenChecks should be given in milliseconds
function waitForDashToPanelThenEnable(timeBetweenChecks){
    if(global.dashToPanel){
		// See this for more on keybindings https://www.youtube.com/watch?v=L6ewpCMkrRE
		let settings = getSettings();
      	let mode = Shell.ActionMode.ALL;
		let flag = Meta.KeyBindingFlags.NONE;
		Main.wm.addKeybinding("activate-left", settings, flag, mode, () => {
		    console.log('tannerLog: activate-left');
		    let windows = global.dashToPanel.panels[0].taskbar.getAppInfos().reduce((ws, appInfo) => ws.concat(appInfo.windows), []);
		    activateSiblingWindow(windows, 'left');
		});
		Main.wm.addKeybinding("activate-right", settings, flag, mode, () => {
		    console.log('tannerLog: activate-right');
		    let windows = global.dashToPanel.panels[0].taskbar.getAppInfos().reduce((ws, appInfo) => ws.concat(appInfo.windows), []);
		    activateSiblingWindow(windows, 'right');
		});
		// Shift based shortcuts aren't working for me. Perhaps something is already
		// catching them on my system... if so, how to find out what
		// Main.wm.addKeybinding("swap-left", settings, flag, mode, () => {
		    // console.log('tannerLog: shortcut is working');
		// });
		// Main.wm.addKeybinding("swap-right", settings, flag, mode, () => {
		    // console.log('tannerLog: shortcut is working');
		// });
    }
    else{
    	console.log("tannerLog: still waiting")
        // setTimeout(waitForDashToPanel(timeBetweenChecks), timeBetweenChecks);
        Mainloop.timeout_add(1000, () => waitForDashToPanelThenEnable(timeBetweenChecks));
    }
}


// This is how you get the currently focused window I think
// global.display.get_focus_window()

// This is how you focus a window named myWindow
// myWindow.activate(global.get_current_time())

// This is how you get the list of windows in the same workspace as myWindow
// myWindow.get_display().get_workspace_manager().get_active_workspace().list_window()

// Note: eval(``) is very powerful

class Extension {
    constructor(uuid) {
        console.log("tannerLogConstructor");
    
        this._uuid = uuid;

        ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
    }

    // This is run whenever the extension is enabled
    // (eg through the desktop app)
    enable() {
        console.log("tannerLogEnabled");
    	waitForDashToPanelThenEnable(50);
    }

    // This is run whenever the extension is disabled
    disable() {
    	Main.wm.removeKeybinding("activate-left");
        Main.wm.removeKeybinding("activate-right");
        // Main.wm.removeKeybinding("swap-left");
        // Main.wm.removeKeybinding("swap-right");
    }
}

// This is run when the extension is first enabled
function init(meta) {
    return new Extension(meta.uuid);
}
