import { Component, Input } from "@angular/core";
import { settingsManager, SettingsManager } from "src/app/game/businesslogic/SettingsManager";
import { AttackModifier, AttackModifierEffect, AttackModifierEffectType, AttackModifierType } from "src/app/game/model/AttackModifier";

@Component({
  selector: 'ghs-attackmodifier-effects',
  templateUrl: './attackmodifier-effects.html',
  styleUrls: ['./attackmodifier-effects.scss']
})
export class AttackModifierEffectsComponent {

  @Input() offsetWidth!: number;
  @Input() attackModifier!: AttackModifier;
  @Input() effects!: AttackModifierEffect[];
  @Input() newStyle: boolean = false;

  settingsManager: SettingsManager = settingsManager;

  AttackModifierType = AttackModifierType;
  AttackModifierEffectType = AttackModifierEffectType;
  invertIcons: AttackModifierEffectType[] = [AttackModifierEffectType.attack, AttackModifierEffectType.heal, AttackModifierEffectType.range, AttackModifierEffectType.retaliate, AttackModifierEffectType.shield, AttackModifierEffectType.target];

  getTarget(effect: AttackModifierEffect): string {
    if (effect.effects) {
      const specialTarget = effect.effects.find((subEffect) => subEffect.type == AttackModifierEffectType.specialTarget);
      if (specialTarget) {
        return 'game.specialTarget.' + specialTarget.value;
      }
      const customValue = effect.effects.find((subEffect) => subEffect.type == AttackModifierEffectType.custom)
      if (customValue) {
        return customValue.value;
      }
    }
    return "";
  }

  isGhsSvg(type: AttackModifierEffectType) {
    return this.invertIcons.indexOf(type) != -1;
  }
}