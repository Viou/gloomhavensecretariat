import { Dialog } from '@angular/cdk/dialog';
import { ConnectionPositionPair, Overlay } from '@angular/cdk/overlay';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { gameManager, GameManager } from 'src/app/game/businesslogic/GameManager';
import { settingsManager, SettingsManager } from 'src/app/game/businesslogic/SettingsManager';
import { Character } from 'src/app/game/model/Character';
import { Element } from 'src/app/game/model/Element';
import { GameState } from 'src/app/game/model/Game';
import { Monster } from 'src/app/game/model/Monster';
import { MainMenuComponent, SubMenu } from './menu/menu';

@Component({
  selector: 'ghs-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {

  @Input() standalone: boolean = false;
  @ViewChild('mainMenuButton') mainMenuButton!: ElementRef;
  gameManager: GameManager = gameManager;
  settingsManager: SettingsManager = settingsManager;
  GameState = GameState;
  WebSocket = WebSocket;

  SubMenu = SubMenu;
  menuState: SubMenu = SubMenu.main;

  elements: Element[] = [Element.fire, Element.ice, Element.air, Element.earth, Element.light, Element.dark];

  init: boolean = false;
  hintState: string = "";

  constructor(private dialog: Dialog, private overlay: Overlay) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.init = true;
    }, settingsManager.settings.disableAnimations ? 0 : 1500);

    gameManager.uiChange.subscribe({
      next: () => {
        if (this.hintStateValue() != this.hintState) {
          this.init = false;
          setTimeout(() => {
            this.hintState = this.hintStateValue();
            this.init = true;
          }, settingsManager.settings.disableAnimations ? 0 : 500);
        }
      }
    })
  }

  syncing(): boolean {
    return window.document.body.classList.contains('server-sync');
  }

  hintStateValue(): string {
    if (gameManager.game.figures.every((figure) => !(figure instanceof Character) && !(figure instanceof Monster))) {
      return 'characters';
    } else if (!gameManager.game.scenario && gameManager.game.figures.every((figure) => !(figure instanceof Monster))) {
      return 'scenario';
    } else if (gameManager.game.figures.every((figure) => !(figure instanceof Monster) || figure.entities.length == 0)) {
      return 'addMonsterEntities';
    } else if (gameManager.game.figures.some((figure) => figure.active)) {
      return gameManager.game.round < 3 ? 'active-full' : 'active';
    } else if (gameManager.game.state == GameState.draw) {
      if (gameManager.game.figures.some((figure) => figure instanceof Character && !figure.exhausted && figure.health > 0 && settingsManager.settings.initiativeRequired && figure.initiative <= 0)) {
        return gameManager.game.round < 3 ? 'draw-full' : 'draw-short';
      }
      return 'draw';
    } else if (gameManager.game.state == GameState.next) {
      return 'next';
    }

    return "";
  }

  openMenu(event: any, menu: SubMenu | undefined = undefined) {
    this.dialog.open(MainMenuComponent, {
      panelClass: 'dialog',
      data: { subMenu: menu != undefined && menu | SubMenu.main, standalone: this.standalone },
      maxWidth: '90vw',
      positionStrategy: this.overlay.position().flexibleConnectedTo(this.mainMenuButton).withPositions([
        new ConnectionPositionPair(
          { originX: 'end', originY: 'top' },
          { overlayX: 'start', overlayY: 'top' })]).withDefaultOffsetX(10)
    });
  }

}

