import { GameMonsterEntityModel, MonsterEntity } from "./MonsterEntity";
import { Ability } from "./Ability";
import { Figure } from "./Figure";
import { MonsterData } from "./data/MonsterData";
import { gameManager } from "../businesslogic/GameManager";
import { SummonColor } from "./Summon";

export class Monster extends MonsterData implements Figure {

  summonColor: SummonColor = SummonColor.blue;

  // from figure
  level: number;
  off: boolean = false;
  active: boolean = false;
  drawExtra: boolean = false;

  getInitiative(): number {
    const ability: Ability | undefined = gameManager.monsterManager.getAbility(this);
    return gameManager.gameplayFigure(this) && ability && ability.initiative || 100;
  }

  // Monster
  ability: number = -1;
  abilities: number[] = [];
  entities: MonsterEntity[] = [];
  isAlly: boolean = false;

  constructor(monsterData: MonsterData, level: number = 1) {
    super(monsterData.name, monsterData.count, monsterData.baseStat, monsterData.stats, monsterData.edition, monsterData.deck, monsterData.boss, monsterData.flying, monsterData.thumbnail, monsterData.thumbnailUrl, monsterData.spoiler);
    this.errors = monsterData.errors;
    this.level = level;
    if (monsterData.baseStat) {
      for (let stat of monsterData.stats) {
        if (!stat.health && stat.health != 0) {
          stat.health = monsterData.baseStat.health || 0;
        }
        if (!stat.movement && stat.movement != 0) {
          stat.movement = monsterData.baseStat.movement || 0;
        }
        if (!stat.attack && stat.attack != 0) {
          stat.attack = monsterData.baseStat.attack || 0;
        }
        if (!stat.range && stat.range != 0) {
          stat.range = monsterData.baseStat.range || 0;
        }
        if (!stat.actions) {
          stat.actions = Object.assign([], monsterData.baseStat.actions);
        }
        if (!stat.immunities) {
          stat.immunities = Object.assign([], monsterData.baseStat.immunities);
        }
        if (!stat.special) {
          stat.special = [];
          if (monsterData.baseStat.special) {
            for (let special of monsterData.baseStat.special) {
              stat.special.push(Object.assign([], special));
            }
          }
        }
        if (!stat.note) {
          stat.note = monsterData.baseStat.note;
        }
        if (!stat.type) {
          stat.type = monsterData.baseStat.type;
        }
      }
    }
  }

  toModel(): GameMonsterModel {
    return new GameMonsterModel(this.name, this.edition, this.level, this.off, this.active, this.drawExtra, this.ability, this.abilities, this.entities.map((value) => value.toModel()), this.isAlly)
  }


  fromModel(model: GameMonsterModel) {
    this.edition = model.edition;
    if (!this.edition) {
      const monsterData = gameManager.monstersData().find((monsterData) => monsterData.name == model.name);
      if (monsterData) {
        this.edition = monsterData.edition;
      } else {
        this.edition = "";
      }
    }
    this.level = model.level;
    this.off = model.off;
    this.active = model.active;
    this.drawExtra = model.drawExtra;
    this.abilities = model.abilities && model.abilities.length > 0 && model.abilities || gameManager.abilities(this) && gameManager.abilities(this).map((ability, index) => index) || [];
    this.ability = model.ability;
    this.entities = this.entities.filter((monsterEntity) => model.entities.map((gmem) => gmem.number).indexOf(monsterEntity.number) != -1);
    model.entities.forEach((value) => {
      let entity = this.entities.find((monsterEntity) => monsterEntity.number == value.number) as MonsterEntity;
      if (!entity) {
        entity = new MonsterEntity(value.number, value.type, this);
        this.entities.push(entity);
      }
      entity.fromModel(value);
    })
    this.isAlly = model.isAlly;
  }
}

export class GameMonsterModel {
  name: string;
  edition: string;
  level: number;
  off: boolean;
  active: boolean;
  drawExtra: boolean;
  ability: number;
  abilities: number[];
  entities: GameMonsterEntityModel[];
  isAlly: boolean;

  constructor(name: string,
    edition: string,
    level: number,
    off: boolean,
    active: boolean,
    drawExtra: boolean,
    ability: number,
    abilities: number[],
    entities: GameMonsterEntityModel[],
    isAlly: boolean) {
    this.name = name;
    this.edition = edition;
    this.level = level;
    this.off = off;
    this.active = active;
    this.drawExtra = drawExtra;
    this.ability = ability;
    this.abilities = abilities;
    this.entities = entities;
    this.isAlly = isAlly;
  }
}