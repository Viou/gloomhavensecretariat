import { Component, isDevMode, OnInit } from '@angular/core';
import { gameManager } from './game/businesslogic/GameManager';
import { settingsManager, SettingsManager } from './game/businesslogic/SettingsManager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'gloomhavensecretariat';

  settingsManager: SettingsManager = settingsManager;

  ngOnInit(): void {
    this.applyFhStyle();
    gameManager.uiChange.subscribe({
      next: () => {
        this.applyFhStyle();
        this.applyAnimations();
      }
    })


    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'z' && !event.shiftKey) {
        gameManager.stateManager.undo();
      } else if (event.ctrlKey && event.key === 'y' || event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'z') {
        gameManager.stateManager.redo();
      }
    })
  }

  applyFhStyle() {
    if (settingsManager.settings.fhStyle) {
      document.body.classList.add('fh');
    } else {
      document.body.classList.remove('fh');
    }
  }

  applyAnimations() {
    if (settingsManager.settings.disableAnimations) {
      document.body.classList.add('no-animations');
    } else {
      document.body.classList.remove('no-animations');
    }
  }

  isAppDevMode(): boolean {
    return isDevMode();
  }

  onRightClick() {
    if (!this.isAppDevMode() && !settingsManager.settings.debugRightClick) {
      return false;
    }
    return true;
  }
}