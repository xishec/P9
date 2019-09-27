import { Component } from '@angular/core';

import { ShortcutManagerService } from 'src/app/services/shortcut-manager/shortcut-manager.service';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { ColorType } from 'src/constants/color-constants';
import { Color } from '../../../classes/Color';

interface IconStyle {
    backgroundColor: string;
}

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent {
    selectedColor: ColorType = ColorType.primaryColor;
    previewColor = new Color().hex;

    constructor(private colorToolService: ColorToolService, private shortcutManagerService: ShortcutManagerService) {}

    onClickColorQueueButton(color: string): void {
        this.changeColor(color);
    }

    changeColor(previewColor: string): void {
        this.previewColor = previewColor.slice(0, 6);
    }

    onCancel(): void {
        this.colorToolService.changeCurrentShowColorPalette(false);
        this.colorToolService.changeSelectedColor(undefined);
    }

    getUserColorIcon(): IconStyle {
        return {
            backgroundColor: '#' + this.previewColor.slice(0, 6) + this.getOpacity(),
        };
    }

    onFocus() {
        this.shortcutManagerService.changeIsOnInput(true);
    }

    onFocusOut() {
        this.shortcutManagerService.changeIsOnInput(false);
    }
}
