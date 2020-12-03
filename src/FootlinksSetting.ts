export default class FootLinksSetting {
	public footSeperator: string;
	public showIcon: boolean;
	public needGlobalRefactor: boolean;
	public refactorInterval: number | null; // in minutes

	constructor() {
		this.footSeperator = "";
		this.showIcon = true;
		this.needGlobalRefactor = false;
		this.refactorInterval = null;
	}
}
