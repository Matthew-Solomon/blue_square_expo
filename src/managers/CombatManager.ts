import { Alert } from 'react-native';
import Enemy from '../entities/Enemy';
import Player from '../entities/Player';

export enum CombatAction {
  ATTACK = 'attack',
  DEFEND = 'defend',
  USE_ITEM = 'use_item',
  RUN = 'run'
}

export enum CombatResult {
  ONGOING = 'ongoing',
  PLAYER_VICTORY = 'player_victory',
  PLAYER_DEFEAT = 'player_defeat',
  PLAYER_ESCAPED = 'player_escaped'
}

export interface CombatTurn {
  action: CombatAction;
  actorName: string;
  targetName: string;
  damage: number;
  isCritical: boolean;
  isDodged: boolean;
  message: string;
}

export interface CombatState {
  isPlayerTurn: boolean;
  currentEnemy: Enemy | null;
  turns: CombatTurn[];
  result: CombatResult;
  playerDefending: boolean;
}

class CombatManager {
  private player: Player;
  private enemy: Enemy | null = null;
  private state: CombatState;
  private onStateChange: ((state: CombatState) => void) | null = null;

  constructor(player: Player) {
    this.player = player;
    this.state = {
      isPlayerTurn: true,
      currentEnemy: null,
      turns: [],
      result: CombatResult.ONGOING,
      playerDefending: false
    };
  }

  public setOnStateChangeListener(listener: (state: CombatState) => void): void {
    this.onStateChange = listener;
  }

  private updateState(newState: Partial<CombatState>): void {
    this.state = { ...this.state, ...newState };
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }

  public startCombat(enemy: Enemy): void {
    this.enemy = enemy;
    this.updateState({
      currentEnemy: enemy,
      isPlayerTurn: true,
      turns: [],
      result: CombatResult.ONGOING,
      playerDefending: false
    });
  }

  public getCurrentState(): CombatState {
    return this.state;
  }

  public performAction(action: CombatAction): void {
    if (!this.enemy || this.state.result !== CombatResult.ONGOING) {
      return;
    }

    if (this.state.isPlayerTurn) {
      this.performPlayerAction(action);
    }
  }

  private performPlayerAction(action: CombatAction): void {
    if (!this.enemy) return;

    let turn: CombatTurn | null = null;

    switch (action) {
      case CombatAction.ATTACK:
        turn = this.handlePlayerAttack();
        break;
      case CombatAction.DEFEND:
        turn = this.handlePlayerDefend();
        break;
      case CombatAction.USE_ITEM:
        turn = this.handlePlayerUseItem();
        break;
      case CombatAction.RUN:
        turn = this.handlePlayerRun();
        break;
    }

    if (turn) {
      const updatedTurns = [...this.state.turns, turn];
      this.updateState({ turns: updatedTurns });

      // Check if combat is over after player's turn
      if (this.enemy.getHealth() <= 0) {
        this.handleEnemyDefeat();
      } else if (this.state.result === CombatResult.PLAYER_ESCAPED) {
        // Combat ended due to player escaping
        return;
      } else {
        // Enemy's turn
        setTimeout(() => {
          this.updateState({ isPlayerTurn: false });
          this.performEnemyAction();
        }, 1000);
      }
    }
  }

  private handlePlayerAttack(): CombatTurn {
    if (!this.enemy) throw new Error("No enemy in combat");

    const isCritical = Math.random() < this.player.getCritRate();
    const isDodged = Math.random() < this.enemy.getDodgeRate();

    let damage = 0;
    let message = '';

    if (isDodged) {
      message = `${this.player.getName()} attacked but ${this.enemy.getName()} dodged!`;
    } else {
      damage = this.player.getAttackPower() * (isCritical ? 2 : 1);
      this.enemy.takeDamage(damage);

      if (isCritical) {
        message = `${this.player.getName()} landed a critical hit on ${this.enemy.getName()} for ${damage} damage!`;
      } else {
        message = `${this.player.getName()} attacked ${this.enemy.getName()} for ${damage} damage.`;
      }
    }

    return {
      action: CombatAction.ATTACK,
      actorName: this.player.getName(),
      targetName: this.enemy.getName(),
      damage,
      isCritical,
      isDodged,
      message
    };
  }

  private handlePlayerDefend(): CombatTurn {
    this.updateState({ playerDefending: true });

    return {
      action: CombatAction.DEFEND,
      actorName: this.player.getName(),
      targetName: this.player.getName(),
      damage: 0,
      isCritical: false,
      isDodged: false,
      message: `${this.player.getName()} takes a defensive stance.`
    };
  }

  private handlePlayerUseItem(): CombatTurn {
    // For now, just implement a simple healing potion
    const healAmount = Math.floor(this.player.getMaxHealth() * 0.3);
    this.player.heal(healAmount);

    return {
      action: CombatAction.USE_ITEM,
      actorName: this.player.getName(),
      targetName: this.player.getName(),
      damage: -healAmount, // Negative damage represents healing
      isCritical: false,
      isDodged: false,
      message: `${this.player.getName()} used a healing potion and recovered ${healAmount} health.`
    };
  }

  private handlePlayerRun(): CombatTurn {
    const escapeChance = 0.5; // 50% chance to escape
    const escaped = Math.random() < escapeChance;

    if (escaped) {
      this.updateState({ result: CombatResult.PLAYER_ESCAPED });

      return {
        action: CombatAction.RUN,
        actorName: this.player.getName(),
        targetName: '',
        damage: 0,
        isCritical: false,
        isDodged: false,
        message: `${this.player.getName()} successfully escaped from battle!`
      };
    } else {
      return {
        action: CombatAction.RUN,
        actorName: this.player.getName(),
        targetName: '',
        damage: 0,
        isCritical: false,
        isDodged: false,
        message: `${this.player.getName()} tried to escape but failed!`
      };
    }
  }

  private performEnemyAction(): void {
    if (!this.enemy) return;

    setTimeout(() => {
      const turn = this.handleEnemyAttack();
      const updatedTurns = [...this.state.turns, turn];

      this.updateState({
        turns: updatedTurns,
        isPlayerTurn: true,
        playerDefending: false
      });

      // Check if combat is over after enemy's turn
      if (this.player.getHealth() <= 0) {
        this.handlePlayerDefeat();
      }
    }, 1000);
  }

  private handleEnemyAttack(): CombatTurn {
    if (!this.enemy) throw new Error("No enemy in combat");

    const isDodged = Math.random() < this.player.getDodgeRate();
    const isCritical = Math.random() < this.enemy.getCritRate();

    let damage = 0;
    let message = '';

    if (isDodged) {
      message = `${this.enemy.getName()} attacked but ${this.player.getName()} dodged!`;
    } else {
      damage = this.enemy.getAttackPower() * (isCritical ? 2 : 1);

      // Reduce damage if player is defending
      if (this.state.playerDefending) {
        damage = Math.floor(damage * 0.5);
        message = `${this.enemy.getName()} attacked ${this.player.getName()} for ${damage} damage (reduced by defense).`;
      } else {
        if (isCritical) {
          message = `${this.enemy.getName()} landed a critical hit on ${this.player.getName()} for ${damage} damage!`;
        } else {
          message = `${this.enemy.getName()} attacked ${this.player.getName()} for ${damage} damage.`;
        }
      }

      this.player.takeDamage(damage);
    }

    return {
      action: CombatAction.ATTACK,
      actorName: this.enemy.getName(),
      targetName: this.player.getName(),
      damage,
      isCritical,
      isDodged,
      message
    };
  }

  private handleEnemyDefeat(): void {
    if (!this.enemy) return;

    const expGained = this.enemy.getExperienceValue();
    const goldGained = this.enemy.getGoldValue();

    this.player.gainExperience(expGained);
    this.player.gainGold(goldGained);
    this.player.incrementEnemiesDefeated();

    this.updateState({ result: CombatResult.PLAYER_VICTORY });

    Alert.alert(
      "Victory!",
      `You defeated ${this.enemy.getName()}!\nGained ${expGained} XP and ${goldGained} gold.`,
      [{ text: "Continue", style: "default" }]
    );
  }

  private handlePlayerDefeat(): void {
    this.updateState({ result: CombatResult.PLAYER_DEFEAT });

    Alert.alert(
      "Defeat",
      "You have been defeated!",
      [{ text: "Return to Home", style: "default" }]
    );
  }

  public resetCombat(): void {
    this.enemy = null;
    this.updateState({
      currentEnemy: null,
      isPlayerTurn: true,
      turns: [],
      result: CombatResult.ONGOING,
      playerDefending: false
    });
  }
}

export default CombatManager;
