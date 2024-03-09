import ObsidianR2 from './main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export interface ObsidianR2Settings {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  domain: string;
}

export const DEFAULT_SETTINGS: ObsidianR2Settings = {
  accountId: '',
  accessKeyId: '',
  secretAccessKey: '',
  bucket: 'obsidian',
  domain: '[yours].r2.dev'
}

export class SettingTab extends PluginSettingTab {
  plugin: ObsidianR2;
  settings: ObsidianR2Settings;

  constructor(app: App, plugin: ObsidianR2) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName('Account ID')
      .addText(text => text
        .setValue(this.plugin.settings.accountId)
        .onChange(async (value) => {
          this.plugin.settings.accountId = value;
          await this.plugin.saveSettings();
        }))

    new Setting(containerEl)
      .setName('Access Key ID')
      .addText(text => text
        .setValue(this.plugin.settings.accessKeyId)
        .onChange(async (value) => {
          this.plugin.settings.accessKeyId = value;
          await this.plugin.saveSettings();
        }))

    new Setting(containerEl)
      .setName('Secret Access Key')
      .addText(text => text
        .setValue(this.plugin.settings.secretAccessKey)
        .onChange(async (value) => {
          this.plugin.settings.secretAccessKey = value;
          await this.plugin.saveSettings();
        }))

    new Setting(containerEl)
      .setName('Bucket')
      .addText(text => text
        .setValue(this.plugin.settings.bucket)
        .onChange(async (value) => {
          this.plugin.settings.bucket = value;
          await this.plugin.saveSettings();
        }))
    
    new Setting(containerEl)
      .setName('Domain')
      .addText(text => text
        .setValue(this.plugin.settings.domain)
        .onChange(async (value) => {
          this.plugin.settings.domain = value;
          await this.plugin.saveSettings();
        }))
  }
}
