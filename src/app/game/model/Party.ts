import { GameCharacterModel } from "./Character";
import { GameScenarioModel } from "./data/ScenarioData";
import { Identifier } from "./Identifier";

export class Party {

  id: number = 0;
  name: string = "";
  edition: string | undefined;
  location: string = "";
  notes: string = "";
  achievements: string = "";
  reputation: number = 0;
  prosperity: number = 0;
  scenarios: GameScenarioModel[] = [];
  manualScenarios: GameScenarioModel[] = [];
  campaignMode: boolean = false;
  globalAchievements: string = "";
  treasures: Identifier[] = [];
  donations: number = 0;
  characters: GameCharacterModel[] = [];

}