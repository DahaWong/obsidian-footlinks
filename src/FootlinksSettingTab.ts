import { PluginSettingTab, Setting } from "obsidian";

export default class FootlinksSettingTab extends PluginSettingTab {
	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		// containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

		new Setting(containerEl)
			.setName("Footlinks seperator")
			.setDesc("Seperates the footlinks area from main body")
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
		// 	.setName("Choose footlinks style")
		// 	.addDropdown((dropdown) => {
		// 		dropdown.addOption("Single brackets", "test display");
		// 	});
	}
}
