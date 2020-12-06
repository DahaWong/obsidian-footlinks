import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import FootlinksPlugin from "./main";

export default class FootlinksSettingTab extends PluginSettingTab {
	private readonly plugin: FootlinksPlugin;
	public seperatorSetting: Setting;
	public iconSetting: Setting;
	public refactorSetting: Setting;
	public refactorIntervalSetting: Setting;

	constructor(app: App, plugin: FootlinksPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Footlinks seperator")
			.setDesc("Seperates the footlinks area from main body")
			.addText((text) =>
				text
					.setPlaceholder("None")
					.setValue(this.plugin.setting.footSeperator)
					.onChange((value) => {
						this.plugin.setting.footSeperator = value;
						this.plugin.saveData(this.plugin.setting);
						text.setValue(value);
					})
			);

		new Setting(containerEl)
			.setName("Show icon in left side menu")
			.addToggle((toggle) => {
				toggle.setValue(this.plugin.setting.showIcon).onChange((value) => {
					this.plugin.setting.showIcon = value;
					this.plugin.saveData(this.plugin.setting);
					new Notice(
						`Reload the app to see icon ${value ? "added" : "removed"}.`
					);
				});
			});

		// new Setting(containerEl)
		// 	.setName("Choose a footlinks style")
		// 	.addDropdown((dropdown) => {
		// 		dropdown.addOption("Single brackets", "test display");
		// 	});
	}
}
