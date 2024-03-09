import { Editor, MarkdownView, Plugin } from 'obsidian';
import {DEFAULT_SETTINGS, ObsidianR2Settings, SettingTab} from './settings';
import Uploader from './uploader';

export default class ObsidianR2 extends Plugin {
  settings: ObsidianR2Settings;
  uploader: Uploader;

  async onload() {
    await this.initSettings();
    this.initFileHandler();
    this.uploader = new Uploader(this.settings);
  }

  async initSettings() {
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...await this.loadData(),
    }
    this.addSettingTab(new SettingTab(this.app, this));
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  initFileHandler() {
    this.registerEvent(
      this.app.workspace.on('editor-paste',
      (e: ClipboardEvent) => this.uploadHandler(e, e.clipboardData?.files as FileList))
    );
    this.registerEvent(
      this.app.workspace.on('editor-drop',
      (e: DragEvent) => this.uploadHandler(e, e.dataTransfer?.files as FileList))
    );
  }

  async uploadHandler(e: ClipboardEvent | DragEvent, files: FileList) {
    if (!files || !files.length) return;

    e.preventDefault()

    for (let i=0; i<files.length; i++) {
      const temp = this.getUploadingTemplate(files[i].name)
      this.getEditor().replaceSelection(temp);

      try {
        const url = await this.uploader.upload(files[i]);
        const fileTemp = this.getFileTemplate(files[i], url)
        this.replaceFirstOccurrence(temp, fileTemp);
      } catch (error) {
        const errorTemp = this.getUploadErrorTemplate(files[i].name, error)
        this.replaceFirstOccurrence(temp, errorTemp)
      }
    }
  }

  private getEditor(): Editor {
    const mdView = this.app.workspace.getActiveViewOfType(MarkdownView)
    return mdView!.editor
  }

  private getUploadingTemplate(name: string) {
    const id = (Math.random() + 1).toString(36).substring(2, 7)
    return (`<div class="file-embed mod-empty-attachment">Uploading...(${name})[${id}]</div>\n`);
  }

  private getUploadErrorTemplate(name : string, error: string) {
    return (`<div class="file-embed mod-empty-attachment error">Upload file error(${name})[${error}]</div>\n`);
  }

  private getFileTemplate(file: File, url: string) {
    const type = file.type.split('/')[0];
    const name = file.name;
    switch (type) {
      case 'image':
        return (`![](${url})`);
      case 'video':
        return (`<video src="${url}" controls />`);
      case 'audio':
        return (`<audio src="${url}" controls />`);
      default:
        return (`<div class="file-embed uploaded-file"><a href="${url}" target="_blank">${name}</a></div>\n`);
    }
  }

  private replaceFirstOccurrence(target: string, replacement: string) {
    const editor = this.getEditor();
    const lines = editor.getValue().split('\n')
    target = target.replace(/\n/g, '')
    for (let i = 0; i < lines.length; i += 1) {
      const ch = lines[i].indexOf(target)
      if (ch !== -1) {
        const from = { line: i, ch }
        const to = { line: i, ch: ch + target.length }
        editor.replaceRange(replacement, from, to)
        break
      }
    }
  }
}
