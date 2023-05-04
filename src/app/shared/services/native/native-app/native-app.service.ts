import { Injectable, Output, EventEmitter, NgZone } from '@angular/core';
import { Store } from '@ngxs/store';
import { BatteryInfo, Device, DeviceId, DeviceInfo, GetLanguageCodeResult } from '@capacitor/device';
import { App, AppInfo, AppState, URLOpenListenerEvent } from '@capacitor/app';
import { AppLauncher } from '@capacitor/app-launcher';
import { SetAppActiveState } from 'src/app/store/application/application.actions';
import { AppActiveState } from 'src/app/store/application/application.const';

@Injectable({
    providedIn: 'root'
})
export class NativeAppService {
    @Output() appStateChange = new EventEmitter<AppActiveState>();

    constructor(
        private readonly store: Store,
        private zone: NgZone,
    ) { }

    // async initNative() {
    //     const appUrlOpen = await App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
    //         console.log('appUrlOpen listener init');
    //         this.zone.run(() => {
    //             console.log('appUrlOpen zone run');
    //             const slug = event.url.split(".app").pop();
    //             console.log(slug);
    //         });
    //     });
    //     const appStateChange = await App.addListener('appStateChange', (state: AppState) => {
    //         const activeState = state.isActive ? AppActiveState.FOREGROUND : AppActiveState.BACKGROUND;
    //         this.appStateChange.emit(activeState);
    //         this.store.dispatch(new SetAppActiveState(activeState));
    //     });

    //     return { appUrlOpen, appStateChange };
    // }

    // async canOpenUrl(url: string): Promise<{ value: boolean }> {
    //     return AppLauncher.canOpenUrl({ url });
    // }

    async exitApp(): Promise<void> {
        return App.exitApp();
    }
    async getLaunchUrl(): Promise<string> {
        const result = await App.getLaunchUrl();

        return result.url;
    }
    async getAppActiveState(): Promise<AppActiveState> {
        return new Promise<AppActiveState>(async (resolve, reject) => {
            try {
                const appState = await App.getState();
                resolve(appState.isActive ? AppActiveState.FOREGROUND : AppActiveState.BACKGROUND);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Open an app with the given URL
     * @param url url to check
     * @returns Promise of boolean
     */
    async openUrl(url: string): Promise<{ completed: boolean }> {
        return AppLauncher.openUrl({ url });
    }

    /**
     * Get App UUID
     * @returns Promise of boolean
     */
    async getDeviceId(): Promise<DeviceId> {
        return Device.getId();
    }

    /**
     * Obtains device Info
     * @returns Promise of DeviceInfo
     */
    async getDeviceInfo(): Promise<DeviceInfo> {
        return Device.getInfo();
    }

    /**
     * Obtains device battery Info
     * @returns Promise of DeviceBatteryInfo
     */
    async getDeviceBatteryInfo(): Promise<BatteryInfo> {
        return Device.getBatteryInfo();
    }

    /**
     * Obtains device Language Info
     * @returns Promise of DeviceLanguageCodeResult
     */
    async getDeviceLanguageCode(): Promise<GetLanguageCodeResult> {
        return Device.getLanguageCode();
    }
    /**
     * Obtains App Info
     * @returns Promise of AppInfo
     */
    async getAppInfo(): Promise<AppInfo> {
        return App.getInfo();
    }
}
