import { Injectable, Inject, Renderer2, RendererFactory2, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as Color from 'color';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { StrapiService } from '../strapi/strapi.service';

const defaults = {
    primary: '#3880ff',
    secondary: '#0cd1e8',
    tertiary: '#7044ff',
    info: '#03a9f4',
    success: '#C0E89D',
    warning: '#F9EE72',
    danger: '#F97070',
    dark: '#222428',
    medium: '#989aa2',
    light: '#f4f5f8'
};
function CSSTextGenerator(colors: { primary: any; secondary: any; tertiary: any; info: any; success: any; warning: any; danger: any; dark: any; medium: any; light: any; }) {
    colors = { ...defaults, ...colors };

    const {
        primary,
        secondary,
        tertiary,
        info,
        success,
        warning,
        danger,
        dark,
        medium,
        light
    } = colors;

    const shadeRatio = 0.1;
    const tintRatio = 0.1;
    const shadowRatio = 0.5;

    return `
    // --ion-color-base: ${primary};

    // --ion-color-contrast: ${dark};
    // --ion-text-color: ${dark};
    // --ion-text-color-lv2: ${Color(dark).lighten(1.7)};
    // --ion-text-color-lv3: ${Color(dark).lighten(3)};
    // --ion-text-color-lv4: ${Color(dark).lighten(5)};
    // --ion-text-color-lv5: ${Color(dark).lighten(7)};


    // --ion-item-text-color: ${contrast(dark, 0.3)};
    // --ion-item-background-color: ${Color(light).lighten(0.1)};


    // --ion-tabbar-text-color-active: ${primary};
    // --ion-tabbar-background-color: ${Color(light).lighten(0.05)};


    // --ion-toolbar-text-color: ${contrast(dark, 0.1)};
    // --ion-toolbar-background-color: ${light};
    // --background: ${Color(light).lighten(0.1)};

    // --ion-background-color: ${Color(light).lighten(0.1)};
    // --color-selected: ${dark};

    --ion-color-primary: ${primary};
    --ion-color-primary-rgb: 56,128,255;
    // --ion-color-primary-contrast: ${contrast(primary)};
    // --ion-color-primary-contrast-rgb: 255,255,255;
    --ion-color-primary-shade:  ${Color(primary).darken(shadeRatio)};
    --ion-color-primary-tint:  ${Color(primary).lighten(tintRatio)};
    --ion-color-primary-shadow:  ${Color(primary).lighten(shadeRatio)};

    --ion-color-secondary: ${secondary};
    --ion-color-secondary-rgb: 12,209,232;
    // --ion-color-secondary-contrast: ${Color(secondary).lighten(10)};
    // --ion-color-secondary-contrast-rgb: 255,255,255;
    --ion-color-secondary-shade:  ${Color(secondary).darken(shadeRatio)};
    --ion-color-secondary-tint: ${Color(secondary).lighten(tintRatio)};
    --ion-color-secondary-shadow: ${Color(secondary).lighten(shadeRatio)};

    --ion-color-tertiary:  ${tertiary};
    --ion-color-tertiary-rgb: 112,68,255;
    --ion-color-tertiary-contrast: ${contrast(tertiary)};
    --ion-color-tertiary-contrast-rgb: 255,255,255;
    --ion-color-tertiary-shade: ${Color(tertiary).darken(shadeRatio)};
    --ion-color-tertiary-tint:  ${Color(tertiary).lighten(tintRatio)};
    --ion-color-tertiary-shadow:  ${Color(tertiary).lighten(shadowRatio)};

    --ion-color-info: ${info};
    --ion-color-info-rgb: 16,220,96;
    // --ion-color-info-contrast: ${Color(info).lighten(10)};
    // --ion-color-info-contrast-rgb: 255,255,255;
    --ion-color-info-shade: ${Color(info).darken(shadeRatio)};
    --ion-color-info-tint: ${Color(info).lighten(tintRatio)};
    --ion-color-info-shadow: ${Color(info).lighten(shadowRatio)};

    --ion-color-success: ${success};
    --ion-color-success-rgb: 16,220,96;
    // --ion-color-success-contrast: ${contrast(success)};
    // --ion-color-success-contrast-rgb: 255,255,255;
    --ion-color-success-shade: ${Color(success).darken(shadeRatio)};
    --ion-color-success-tint: ${Color(success).lighten(tintRatio)};
    --ion-color-success-shadow: ${Color(success).lighten(shadowRatio)};

    --ion-color-warning: ${warning};
    --ion-color-warning-rgb: 255,206,0;
    // --ion-color-warning-contrast: ${contrast(warning)};
    // --ion-color-warning-contrast-rgb: 255,255,255;
    --ion-color-warning-shade: ${Color(warning).darken(shadeRatio)};
    --ion-color-warning-tint: ${Color(warning).lighten(tintRatio)};
    --ion-color-warning-shadow: ${Color(warning).lighten(shadowRatio)};

    --ion-color-danger: ${danger};
    --ion-color-danger-rgb: 245,61,61;
    // --ion-color-danger-contrast: ${Color(danger).lighten(10)};
    // --ion-color-danger-contrast-rgb: 255,255,255;
    --ion-color-danger-shade: ${Color(danger).darken(shadeRatio)};
    --ion-color-danger-tint: ${Color(danger).lighten(tintRatio)};
    --ion-color-danger-shadow: ${Color(danger).lighten(0.2)};

    --ion-color-dark: ${dark};
    --ion-color-dark-rgb: 34,34,34;
    // --ion-color-dark-contrast: ${Color(dark).lighten(10)};
    // --ion-color-dark-contrast-rgb: 255,255,255;
    --ion-color-dark-shade: ${Color(dark).darken(shadeRatio)};
    --ion-color-dark-tint: ${Color(dark).lighten(tintRatio)};
    --ion-color-dark-shadow: ${Color(dark).lighten(shadowRatio)};

    --ion-color-medium: ${medium};
    --ion-color-medium-rgb: 152,154,162;
    // --ion-color-medium-contrast: ${contrast(medium)};
    // --ion-color-medium-contrast-rgb: 255,255,255;
    --ion-color-medium-shade: ${Color(medium).darken(shadeRatio)};
    --ion-color-medium-tint: ${Color(medium).lighten(tintRatio)};
    --ion-color-medium-shadow: ${Color(medium).lighten(shadowRatio)};

    --ion-color-light: ${light};
    --ion-color-light-rgb: 244,244,244;
    // --ion-color-light-contrast: ${contrast(light)};
    // --ion-color-light-contrast-rgb: 0,0,0;
    --ion-color-light-shade: ${Color(light).darken(shadeRatio)};
    --ion-color-light-tint: ${Color(light).lighten(tintRatio)};
    --ion-color-light-shadow: ${Color(light).lighten(shadowRatio)};`;
}
function contrast(color: { isDark: () => any; lighten: (arg0: number) => any; darken: (arg0: number) => any; }, ratio = 0.8) {
    color = Color(color);
    return color.isDark() ? color.lighten(ratio) : color.darken(ratio);
}

@Injectable({
    providedIn: 'root'
})
export class ThemeService implements OnDestroy {

    private readonly ngUnsubscribe = new Subject();

    renderer: Renderer2;

    constructor(
        private renderFactory: RendererFactory2,
        @Inject(DOCUMENT) private document: Document,
        private strapi: StrapiService,
        private store: Store
    ) {
        this.renderer = this.renderFactory.createRenderer(null, null);
    }
    initTheme() {
        const theme = this.store.selectSnapshot<string>((state: { themeState: { theme: any; }; }) => state.themeState.theme);
        if (theme !== null) {
            this.strapi.getAppTheme()
                .pipe(
                    takeUntil(this.ngUnsubscribe),
                ).subscribe((theme: any) => {
                    this.setTheme(theme.data.attributes);
                    // this.store.dispatch(new ThemeActions.SetTheme(theme.data.attributes));
                });
        }
    }

    setTheme(theme: { primary: any; secondary: any; tertiary: any; info: any; success: any; warning: any; danger: any; dark: any; medium: any; light: any; }) {
        const customColors = {
            primary: `#${theme?.primary}`,
            secondary: `#${theme?.secondary}`,
            tertiary: `#${theme?.tertiary}`,
            info: `#${theme?.info}`,
            success: `#${theme?.success}`,
            warning: `#${theme?.warning}`,
            danger: `#${theme?.danger}`,
            dark: `#${theme?.dark}`,
            medium: `#${theme?.medium}`,
            light: `#${theme?.light}`,
            // primary: '#512DA8',
            // secondary: '#FF5722',
            // tertiary: '#D1C4E9',
            // info: '#03a9f4',
            // success: '#2dd36f',
            // warning: '#ffc409',
            // danger: '#eb445a',
            // dark: '#000000',
            // medium: '#92949c',
            // light: '#f4f5f8'
        };
        const cssText = CSSTextGenerator(customColors);
        // console.log(cssText)
        this.setGlobalCSS(cssText);
    }

    private setGlobalCSS(css: string) {
        this.document.documentElement.style.cssText = css;
    }

    enableDark() {
        this.renderer.addClass(this.document.body, 'dark-theme');
    }
    enableLight() {
        this.renderer.removeClass(this.document.body, 'dark -theme');
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}
