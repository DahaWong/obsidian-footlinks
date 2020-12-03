import FootlinkSettingTab from "./FootlinkSettingTab";
import { Plugin, Notice } from "obsidian";

export default class FootlinkPlugin extends Plugin {
	public extractedLinks: Object[] = [];
	public footerSeperator: string = "";

	onload() {
		this.addRibbonIcon("dice", "Footlink", () => {
			this.filterLinks();
			const footLinks = this.formatLinks(this.extractedLinks);
			// this.saveToClipboard(linkRefs);
			this.formatMainBody();
			this.createFootlinkArea(footLinks);
		});
		this.addSettingTab(new FootlinkSettingTab(this.app, this));
	}

	filterLinks(): void {
		const activeLeaf = this.app.workspace.activeLeaf ?? null;
		const data: string = activeLeaf.view.data;
		this.extractedLinks = [];

		if (data) {
			const re: RegExp = /(\[.*?\])\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*?))\)/gm;
			let match = re.exec(data);

			if (!match) {
				new Notice("No legal links found.");
			}

			do {
				this.extractedLinks.push({ text: match[1], url: match[2] });
			} while ((match = re.exec(data)) !== null);
		} else {
			new Notice("This document is still empty.");
		}
	}

	formatLinks(links: Object[]): string {
		let footLinks = "";
		for (let link of links) {
			const i = links.indexOf(link);
			footLinks += i === 0 ? `${this.footerSeperator}\n` : "";
			footLinks += `${link.text}: ${link.url}\n`;
		}
		return footLinks;
	}

	formatMainBody() {
		const activeLeaf = this.app.workspace.activeLeaf ?? null;
		const source = activeLeaf.view.sourceMode;
		const re: RegExp = /(\[.*?\])\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*?))\)/gi;
		const sourceContent = source.get();
		const newContent = sourceContent.replace(re, "$1");
		source.set(newContent, false);
	}

	saveToClipboard(formatedData: string): boolean {
		if (formatedData.length > 0) {
			navigator.clipboard.writeText(formatedData);
			return true;
		} else {
			return false;
		}
	}

	createFootlinkArea(footLinks: string) {
		const activeLeaf = this.app.workspace.activeLeaf ?? null;
		const source = activeLeaf.view.sourceMode;
		const sourceContent = source.get();
		const newContent = sourceContent + footLinks;
		source.set(newContent, false);
	}
}
