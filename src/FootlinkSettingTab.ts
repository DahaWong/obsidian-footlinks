import { PluginSettingTab, Setting } from "obsidian";

export default class FootlinkSettingTab extends PluginSettingTab {
	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		// containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

		new Setting(containerEl)
			.setName("Footlink seperator")
			.setDesc("Seperates the footlink area from main body")
			.addText((text) =>
				text
					.setPlaceholder("None")
					.setValue("")
					.onChange((value) => {
						// console.log("Secret: " + value);
					})
			);

		new Setting(containerEl)
			.setName("Show icon in side menu")
			.addToggle((toggle) => {
				toggle.setValue(false);
				// .onchange(()=>{})
			});

		// new Setting(containerEl)
		// 	.setName("Choose footlink style")
		// 	.addDropdown((dropdown) => {
		// 		dropdown.addOption("Single brackets", "test display");
		// 	});
	}
}
