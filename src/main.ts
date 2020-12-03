import FootlinksSettingTab from "./FootlinksSettingTab";
import FootlinksSetting from "./FootlinksSetting";
import { Plugin, Notice } from "obsidian";

interface MarkdownLink {
	text: string;
	url: string;
}

export default class FootlinksPlugin extends Plugin {
	public setting: FootlinksSetting;
	public extractedLinks: Array<MarkdownLink> = [];
	public re: RegExp;

	async onload() {
		this.setting = new FootlinksSetting();
		await this.loadSetting();
		if (this.setting.showIcon) {
			this.addRibbonIcon("dice", "Footlinks", () => {
				this.generateFootlinks();
			});
		}

		this.addCommand({
			id: "footlinks-current-shortcut",
			name: "Refactor current page",
			callback: () => this.generateFootlinks(),
		});

		// this.addCommand({
		// 	id: "footlinks-global-shortcut",
		// 	name: "Refactor all pages",
		// 	callback: () => this.generateFootlinks(),
		// });

		this.addSettingTab(new FootlinksSettingTab(this.app, this));
	}

	async loadSetting() {
		const loadedSetting = await this.loadData();
		if (loadedSetting) {
			this.setting.footSeperator = loadedSetting.footSeperator;
			this.setting.needGlobalRefactor = loadedSetting.needGlobalRefactor;
			this.setting.refactorInterval = loadedSetting.refactorInterval;
			this.setting.showIcon = loadedSetting.showIcon;
		} else {
			this.saveData(this.setting);
		}
	}

	generateFootlinks() {
		this.re = /\[(.*?)\]\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}(\/.*?\)?(\.\w{1,6})?)*?)\)/gi;
		const activeLeaf = this.app.workspace.activeLeaf ?? null;
		const source = activeLeaf.view.sourceMode;
		const sourceContent = source.get();
		const extractedLinks = this.extractLinks(sourceContent) ?? null;
		if (extractedLinks) {
			const newContent = this.refactorContent(sourceContent, extractedLinks);
			source.set(newContent, false);
		}
	}

	extractLinks(text: string): Array<MarkdownLink> | void {
		let extractedLinks: Array<MarkdownLink> = [];

		if (text) {
			let match = this.re.exec(text);

			if (!match) {
				new Notice("No legal links found on this page.");
				return;
			}

			do {
				extractedLinks.push({ text: match[1], url: match[2] });
			} while ((match = this.re.exec(text)) !== null);

			return extractedLinks;
		} else {
			new Notice("Page is still empty.");
		}
	}

	refactorContent(content: string, links: Array<MarkdownLink>): string {
		const footlinks = this.formatLinks(links);
		let newContent = content.replace(this.re, "[$1]").trimEnd();
		newContent += footlinks;
		return newContent;
	}

	formatLinks(links: Array<MarkdownLink>): string {
		let footlinks = "";
		let linkTexts = links.map((link) => `[${link.text}]: ${link.url}\n`);
		linkTexts = linkTexts.filter((text, pos) => {
			return linkTexts.indexOf(text) == pos;
		});
		const seperator = `\n\n${this.setting.footSeperator}\n\n`;
		footlinks = linkTexts.reduce((prev, current) => prev + current, seperator);
		return footlinks;
	}
}
