import FootlinksSettingTab from "./FootlinksSettingTab";
import FootlinksSetting from "./FootlinksSetting";
import { Plugin, Notice, addIcon } from "obsidian";
import { MarkdownView } from "obsidian";

interface MarkdownLink {
  text: string;
  url: string;
}

addIcon(
  "footlinks-icon",
  '<path d="M22.3680891,66 C24.5772281,66 26.3680891,67.790861 26.3680891,70 L26.3680891,80 C26.3680891,82.209139 24.5772281,84 22.3680891,84 L13,84 C10.790861,84 9,82.209139 9,80 L9,70 C9,67.790861 10.790861,66 13,66 L22.3680891,66 Z M32.2112675,76.6666667 C33.4325168,76.6666667 34.422535,77.6501662 34.422535,78.8633744 C34.422535,80.0765826 33.4325168,81.0600821 32.2112675,81.0600821 C30.9900182,81.0600821 30,80.0765826 30,78.8633744 C30,77.6501662 30.9900182,76.6666667 32.2112675,76.6666667 Z M89,71 C89.5522847,71 90,71.4477153 90,72 L90,77 C90,77.5522847 89.5522847,78 89,78 L41,78 C40.4477153,78 40,77.5522847 40,77 L40,72 C40,71.4477153 40.4477153,71 41,71 L89,71 Z M32.2112675,68 C33.4325168,68 34.422535,68.9834995 34.422535,70.1967077 C34.422535,71.4099159 33.4325168,72.3934154 32.2112675,72.3934154 C30.9900182,72.3934154 30,71.4099159 30,70.1967077 C30,68.9834995 30.9900182,68 32.2112675,68 Z M22.3680891,41 C24.5772281,41 26.3680891,42.790861 26.3680891,45 L26.3680891,55 C26.3680891,57.209139 24.5772281,59 22.3680891,59 L13,59 C10.790861,59 9,57.209139 9,55 L9,45 C9,42.790861 10.790861,41 13,41 L22.3680891,41 Z M32.2112675,51.6666667 C33.4325168,51.6666667 34.422535,52.6501662 34.422535,53.8633744 C34.422535,55.0765826 33.4325168,56.0600821 32.2112675,56.0600821 C30.9900182,56.0600821 30,55.0765826 30,53.8633744 C30,52.6501662 30.9900182,51.6666667 32.2112675,51.6666667 Z M89,46 C89.5522847,46 90,46.4477153 90,47 L90,52 C90,52.5522847 89.5522847,53 89,53 L41,53 C40.4477153,53 40,52.5522847 40,52 L40,47 C40,46.4477153 40.4477153,46 41,46 L89,46 Z M32.2112675,43 C33.4325168,43 34.422535,43.9834995 34.422535,45.1967077 C34.422535,46.4099159 33.4325168,47.3934154 32.2112675,47.3934154 C30.9900182,47.3934154 30,46.4099159 30,45.1967077 C30,43.9834995 30.9900182,43 32.2112675,43 Z M22.3680891,16 C24.5772281,16 26.3680891,17.790861 26.3680891,20 L26.3680891,30 C26.3680891,32.209139 24.5772281,34 22.3680891,34 L13,34 C10.790861,34 9,32.209139 9,30 L9,20 C9,17.790861 10.790861,16 13,16 L22.3680891,16 Z M32.2112675,26.6666667 C33.4325168,26.6666667 34.422535,27.6501662 34.422535,28.8633744 C34.422535,30.0765826 33.4325168,31.0600821 32.2112675,31.0600821 C30.9900182,31.0600821 30,30.0765826 30,28.8633744 C30,27.6501662 30.9900182,26.6666667 32.2112675,26.6666667 Z M89,21 C89.5522847,21 90,21.4477153 90,22 L90,27 C90,27.5522847 89.5522847,28 89,28 L41,28 C40.4477153,28 40,27.5522847 40,27 L40,22 C40,21.4477153 40.4477153,21 41,21 L89,21 Z M32.2112675,18 C33.4325168,18 34.422535,18.9834995 34.422535,20.1967077 C34.422535,21.4099159 33.4325168,22.3934154 32.2112675,22.3934154 C30.9900182,22.3934154 30,21.4099159 30,20.1967077 C30,18.9834995 30.9900182,18 32.2112675,18 Z" fill="currentColor"></path>',
);

export default class FootlinksPlugin extends Plugin {
  public setting: FootlinksSetting;
  public extractedLinks: Array<MarkdownLink> = [];
  public re: RegExp;
  public seperator: string;

  async onload() {
    this.setting = new FootlinksSetting();
    await this.loadSetting();
    if (this.setting.showIcon) {
      this.addRibbonIcon("footlinks-icon", "Footlinks", () => {
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
    this.re =
      /\[([^\[\]]+?)\]\((https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%\._\+~#=]{1,256}\.[a-zA-Z0-9\(\)]{1,6}?(?:\/(.*?(\(.*?\))*.*?)*?(\.\w{1,6})?)*?)\)/gi;
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) {
      new Notice("No active markdown view found.");
      return;
    }
    const source = view.editor;
    const sourceContent = source.getValue();
    this.seperator = this.makeSeperator(sourceContent);
    const extractedLinks = this.extractLinks(sourceContent) ?? null;
    if (extractedLinks) {
      const newContent = this.refactorContent(sourceContent, extractedLinks);
      source.setValue(newContent);
    }
  }

  extractLinks(text: string): Array<MarkdownLink> | undefined {
    const extractedLinks: Array<MarkdownLink> = [];

    if (text) {
      let match = this.re.exec(text);

      if (!match) {
        new Notice("No legal links found on this page.");
        return;
      }

      while (match !== null) {
        extractedLinks.push({ text: match[1], url: match[2] });
        match = this.re.exec(text);
      }

      return extractedLinks;
    }
    new Notice("This page is still empty.");
  }

  refactorContent(content: string, links: Array<MarkdownLink>): string {
    const footlinks = this.formatLinks(links);
    let newContent = content
      .replace(this.re, "[$1]") // Remove urls in main text
      .trimEnd()
      .replace(/\] ?\[/g, "]  ["); // Obsidian parses [x][y] as a footnote, so we add two spaces in between to fix in the case of adjacent link texts.
    newContent += footlinks;
    return newContent;
  }

  formatLinks(links: Array<MarkdownLink>): string {
    let footlinks = "";
    let linkTexts = links.map((link) => `[${link.text}]: ${link.url}\n`);
    linkTexts = linkTexts.filter((text, pos) => {
      return linkTexts.indexOf(text) === pos;
    });

    footlinks = linkTexts.reduce(
      (prev, current) => prev + current,
      this.seperator,
    );
    return footlinks;
  }

  makeSeperator(content: string): string {
    const footlinkRegx: RegExp = /\[.*?\]: /g;
    return content.match(footlinkRegx)
      ? "\n"
      : `\n\n${this.setting.footSeperator}\n\n`;
  }
}
