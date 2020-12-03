import FootlinksSettingTab from "./FootlinksSettingTab";
import { Plugin, Notice } from "obsidian";

interface MarkdownLink {
	text: string;
	url: string;
}

export default class FootlinksPlugin extends Plugin {
	public extractedLinks: Array<MarkdownLink> = [];
	public footSeperator: string = "";
	public re: RegExp;

	onload() {
		this.addRibbonIcon("dice", "Footlinks", () => {
			this.generateFootlinks();
		});

		this.addCommand({
			id: "footlinks-current-page-shortcut",
			name: "Refactor current page",
			callback: () => this.generateFootlinks(),
		});

		this.addCommand({
			id: "footlinks-global-shortcut",
			name: "Generate footlinks on current page",
			callback: () => this.generateFootlinks(),
		});

		this.addSettingTab(new FootlinksSettingTab(this.app, this));
	}

	generateFootlinks() {
		// this.re = /\[(.*?)\]\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*?))\)/gi;
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
				new Notice("No legal links found.");
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
		let newContent = content.replace(this.re, "[$1]");
		newContent += footlinks;
		return newContent;
	}

	formatLinks(links: Array<MarkdownLink>): string {
		let footlinks = "";
		let linkTexts = links.map((link) => `[${link.text}]: ${link.url}\n`);
		linkTexts = linkTexts.filter((text, pos) => {
			return linkTexts.indexOf(text) == pos;
		});
		const seperator = `${this.footSeperator}\n\n`;
		footlinks = linkTexts.reduce((prev, current) => prev + current, seperator);
		return footlinks;
	}
}
