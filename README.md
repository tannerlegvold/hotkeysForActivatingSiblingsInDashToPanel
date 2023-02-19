# hotkeysForActivatingSiblingsInDashToPanel
A Gnome Extension that adds keybindings (hotkeys) that activate the window sibling to the current window in the Dash to Panel taskbar. Assumes Dash to Panel is already installed.

To install
```
cd ~/.local/share/gnome-shell/extensions
sudo git clone https://github.com/tannerlegvold/hotkeysForActivatingSiblingsInDashToPanel.git hotkeysForActivatingSiblingsInDashToPanel@tannerlegvold.gmail.com
```
To uninstall
```
cd ~/.local/share/gnome-shell/extensions
sudo rm -rf hotkeysForActivatingSiblingsInDashToPanel@tannerlegvold.gmail.com
```
To change the keybindings change them in 
```
~/.local/share/gnome-shell/extensions/hotkeysForActivatingSiblingsInDashToPanel@tannerlegvold.gmail.com/schemas/org.gnome.shell.extensions.hotkeysForActivatingSiblingsInDashToPanel.gschema.xml
```
then run
```
cd ~/.local/share/gnome-shell/extensions/hotkeysForActivatingSiblingsInDashToPanel@tannerlegvold.gmail.com
glib-compile-schemas schemas/
```
to compile the changes. Then hit `Alt + F2` then `r` then `Enter` to load the changes into Gnome Shell. And maybe reenable the extension.

These instructions are somewhat untested so YMMV.
