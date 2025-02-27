import { Dialog } from '@angular/cdk/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CharacterManager } from 'src/app/game/businesslogic/CharacterManager';
import { GameManager, gameManager } from 'src/app/game/businesslogic/GameManager';
import { SettingsManager, settingsManager } from 'src/app/game/businesslogic/SettingsManager';
import { ConditionType } from 'src/app/game/model/Condition';
import { EntityValueFunction } from 'src/app/game/model/Entity';
import { GameState } from 'src/app/game/model/Game';
import { Objective } from 'src/app/game/model/Objective';
import { ghsDefaultDialogPositions, ghsValueSign } from '../../helper/Static';
import { EntityMenuDialogComponent } from '../entity-menu/entity-menu-dialog';

@Component({
  selector: 'ghs-objective',
  templateUrl: './objective.html',
  styleUrls: ['./objective.scss']
})
export class ObjectiveComponent {

  @Input() objective!: Objective;

  @ViewChild('objectiveTitle', { static: false }) titleInput!: ElementRef;
  @ViewChild('objectiveName') objectiveName!: ElementRef;

  characterManager: CharacterManager = gameManager.characterManager;

  gameManager: GameManager = gameManager;
  settingsManager: SettingsManager = settingsManager;
  GameState = GameState;
  ConditionType = ConditionType;
  health: number = 0;


  constructor(private element: ElementRef, private dialog: Dialog, private overlay: Overlay) { }

  exhausted() {
    gameManager.stateManager.before(this.objective.exhausted ? "unsetObjectiveExhausted" : "setObjectiveExhausted", this.objective.title || this.objective.name);
    this.objective.exhausted = !this.objective.exhausted;
    if (this.objective.exhausted) {
      this.objective.off = true;
      this.objective.active = false;
    } else {
      this.objective.off = false;
    }
    gameManager.sortFigures();
    gameManager.stateManager.after();
  }

  maxHealth(): number {
    return EntityValueFunction(this.objective.maxHealth + "");
  }

  toggleFigure(): void {
    if ((gameManager.game.state == GameState.draw || settingsManager.settings.initiativeRequired && this.objective.initiative <= 0) && !this.objective.exhausted && this.objective.health > 0) {
      //
    } else {
      gameManager.stateManager.before(this.objective.active ? "unsetActive" : "setActive", this.objective.title || this.objective.name);
      gameManager.roundManager.toggleFigure(this.objective);
      gameManager.stateManager.after(250);
    }
  }

  dragInitiativeMove(value: number) {
    if (value > 99) {
      value = 99;
    } else if (value < 0) {
      value = 0;
    }

    if (value == 0 && settingsManager.settings.initiativeRequired) {
      value = 1;
    }

    this.objective.initiative = value;
  }

  dragInitiativeEnd(value: number) {
    if (value > 99) {
      value = 99;
    } else if (value < 0) {
      value = 0;
    }

    if (value == 0 && settingsManager.settings.initiativeRequired) {
      value = 1;
    }

    gameManager.stateManager.before("setObjectiveInitiative", this.objective.title || this.objective.name, "" + value);
    this.objective.initiative = value;
    gameManager.sortFigures();
    gameManager.stateManager.after();
  }

  dragHpMove(value: number) {
    const dragFactor = 4 * this.element.nativeElement.offsetWidth / window.innerWidth;
    this.health = Math.floor(value / dragFactor);
    if (this.objective.health + this.health > this.objective.maxHealth) {
      this.health = EntityValueFunction("" + this.objective.maxHealth) - this.objective.health;
    } else if (this.objective.health + this.health < 0) {
      this.health = - this.objective.health;
    }
  }

  dragHpEnd(value: number) {
    if (this.health != 0) {
      gameManager.stateManager.before("changeObjectiveHP", this.objective.title || this.objective.name, ghsValueSign(this.health));
      gameManager.entityManager.changeHealth(this.objective, this.health);
      if (this.objective.health <= 0 || this.objective.exhausted && this.health >= 0 && this.objective.health > 0) {
        this.exhausted();
      }
      this.health = 0;
    }
    gameManager.stateManager.after();
  }

  openEntityMenu(event: any): void {
    this.dialog.open(EntityMenuDialogComponent, {
      panelClass: 'dialog', data: {
        entity: this.objective,
        figure: this.objective
      },
      positionStrategy: this.overlay.position().flexibleConnectedTo(this.objectiveName).withPositions(ghsDefaultDialogPositions())
    });
  }
}