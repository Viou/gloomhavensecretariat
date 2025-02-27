import { Dialog } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { GameManager, gameManager } from 'src/app/game/businesslogic/GameManager';
import { SettingsManager, settingsManager } from 'src/app/game/businesslogic/SettingsManager';
import { Character } from 'src/app/game/model/Character';
import { ConditionType } from 'src/app/game/model/Condition';
import { EntityValueFunction } from 'src/app/game/model/Entity';
import { GameState } from 'src/app/game/model/Game';
import { Summon, SummonState } from 'src/app/game/model/Summon';
import { ghsDefaultDialogPositions, ghsValueSign } from 'src/app/ui/helper/Static';
import { EntityMenuDialogComponent } from '../../entity-menu/entity-menu-dialog';

@Component({
  selector: 'ghs-summon-entity',
  templateUrl: './summon.html',
  styleUrls: ['./summon.scss']
})
export class SummonEntityComponent implements OnInit {

  @ViewChild('standee') standee!: ElementRef;

  @Input() character!: Character;
  @Input() summon!: Summon;
  SummonState = SummonState;
  ConditionType = ConditionType;
  health: number = 0;
  maxHp: number = 0;
  attack: number = 0;
  movement: number = 0;
  range: number = 0;
  levelDialog: boolean = false;
  gameManager: GameManager = gameManager;
  settingsManager: SettingsManager = settingsManager;

  constructor(private element: ElementRef, private dialog: Dialog, private overlay: Overlay) {
  }

  ngOnInit(): void {
    if (this.summon.init) {
      setTimeout(() => {
        this.open();
      }, settingsManager.settings.disableAnimations ? 0 : 500)
    }
  }

  dragHpMove(value: number) {
    const dragFactor = 20 * this.element.nativeElement.offsetWidth / window.innerWidth;
    this.health = Math.floor(value / dragFactor);
    if (this.summon.health + this.health > this.summon.maxHealth) {
      this.health = EntityValueFunction("" + this.summon.maxHealth) - this.summon.health;
    } else if (this.summon.health + this.health < 0) {
      this.health = - this.summon.health;
    }
  }

  dragHpEnd(value: number) {
    if (this.health != 0) {
      gameManager.stateManager.before("changeSummonHp", "data.character." + this.character.name, "data.summon." + this.summon.name, ghsValueSign(this.health));
      gameManager.entityManager.changeHealth(this.summon, this.health);
      if (this.summon.health <= 0 || this.summon.dead && this.health >= 0 && this.summon.health > 0) {
        this.dead();
      }
      this.health = 0;
      this.health = 0;
    }
    gameManager.stateManager.after();
  }

  dead() {
    gameManager.stateManager.before("summonDead", "data.character." + this.character.name, "data.summon." + this.summon.name);
    this.summon.dead = true;

    if (gameManager.game.state == GameState.draw || this.summon.entityConditions.length == 0 || this.summon.entityConditions.every((entityCondition) => entityCondition.types.indexOf(ConditionType.turn) == -1 && entityCondition.types.indexOf(ConditionType.apply) == -1)) {
      setTimeout(() => {
        gameManager.characterManager.removeSummon(this.character, this.summon);
        gameManager.stateManager.after();
      }, settingsManager.settings.disableAnimations ? 0 : 1500);
    }

    gameManager.stateManager.after();
  }

  open(): void {
    const dialogRef = this.dialog.open(EntityMenuDialogComponent, {
      panelClass: 'dialog',
      data: {
        entity: this.summon,
        figure: this.character
      },
      positionStrategy: this.overlay.position().flexibleConnectedTo(this.standee).withPositions(ghsDefaultDialogPositions())
    });

    dialogRef.closed.subscribe({
      next: () => {
        if (this.summon.dead) {
          this.element.nativeElement.classList.add('dead');
        }
      }
    })
  }

}