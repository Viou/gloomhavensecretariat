import { ConnectionPositionPair } from "@angular/cdk/overlay";
import { settingsManager } from "src/app/game/businesslogic/SettingsManager";
import { Spoilable } from "src/app/game/model/Spoilable";

export function ghsUnit(): number {
  return +window.getComputedStyle(document.body).getPropertyValue('--ghs-width').replace(/[^\d\+]/g, '') / +window.getComputedStyle(document.body).getPropertyValue('--ghs-factor');
}

export function ghsHasSpoilers(items: Spoilable[]): boolean {
  return items.some((spoilable) => spoilable.spoiler && settingsManager.settings.spoilers.indexOf(spoilable.name) == -1);
}

export function ghsIsSpoiled(spoilable: Spoilable): boolean {
  return !spoilable.spoiler || settingsManager.settings.spoilers.indexOf('[ALL]') != -1 || settingsManager.settings.spoilers.indexOf(spoilable.name) != -1;
}

export function ghsNotSpoiled(items: Spoilable[]): Spoilable[] {
  return items.filter((spoilable) => !ghsIsSpoiled(spoilable));
}

export function ghsValueSign(value: number, empty: boolean = false): string {
  if (value > 0) {
    return "+" + value;
  } else if (empty && value == 0) {
    return "-";
  } else {
    return "" + value;
  }
}


export function ghsDefaultDialogPositions(defaultDirection: 'right' | 'left' | 'center' = 'right'): ConnectionPositionPair[] {
  const factor_x = 1.5;
  const factor_y = 3;

  const right = [ // top right
    new ConnectionPositionPair(
      { originX: 'end', originY: 'top' },
      { overlayX: 'start', overlayY: 'top' }, ghsUnit() * factor_x, ghsUnit() * -factor_y),

    // center right
    new ConnectionPositionPair(
      { originX: 'end', originY: 'center' },
      { overlayX: 'start', overlayY: 'center' }),

    // bottom right
    new ConnectionPositionPair(
      { originX: 'end', originY: 'bottom' },
      { overlayX: 'start', overlayY: 'bottom' }, ghsUnit() * factor_x, ghsUnit() * factor_y)];

  const left = [
    // top left
    new ConnectionPositionPair(
      { originX: 'start', originY: 'top' },
      { overlayX: 'end', overlayY: 'top' }, ghsUnit() * -factor_x, ghsUnit() * -factor_y),

    // center left
    new ConnectionPositionPair(
      { originX: 'start', originY: 'center' },
      { overlayX: 'end', overlayY: 'center' }),

    // bottom left
    new ConnectionPositionPair(
      { originX: 'start', originY: 'bottom' },
      { overlayX: 'end', overlayY: 'bottom' }, ghsUnit() * -factor_x, ghsUnit() * factor_y)];

  const center = [
    // center top
    new ConnectionPositionPair(
      { originX: 'center', originY: 'bottom' },
      { overlayX: 'center', overlayY: 'top' }, 0, ghsUnit() * factor_y),

    // center center
    new ConnectionPositionPair(
      { originX: 'center', originY: 'center' },
      { overlayX: 'center', overlayY: 'center' }),

    // center bottom
    new ConnectionPositionPair(
      { originX: 'center', originY: 'top' },
      { overlayX: 'center', overlayY: 'bottom' }, 0, ghsUnit() * -factor_y)];

  switch (defaultDirection) {
    case 'right':
      return [...right, ...left, ...center];
    case 'left':
      return [...left, ...right, ...center];
    case 'center':
      return [...center, ...left, ...right];
  }

}