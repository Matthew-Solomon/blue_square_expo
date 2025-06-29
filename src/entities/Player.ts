import { ImageSourcePropType } from 'react-native';
import Entity from './Entity';

/**
 * Player class that extends the base Entity class
 */
export default class Player extends Entity {
  // Player-specific properties
  private gold: number;
  private totalExperienceGained: number;
  private totalEnemiesDefeated: number;
  private highestLevel: number;

  /**
   * Create a new Player
   */
  constructor(
    health: number = 100,
    shield: number = 20,
    dodgeRate: number = 0.1,
    critRate: number = 0.05,
    attackPower: number = 15,
    spriteImage: ImageSourcePropType = undefined,
    color: string = '#1E90FF' // Default blue color
  ) {
    super(health, shield, dodgeRate, critRate, attackPower, spriteImage, color);

    // Initialize player-specific properties
    this.gold = 0;
    this.totalExperienceGained = 0;
    this.totalEnemiesDefeated = 0;
    this.highestLevel = 1;
  }

  /**
   * Override the gainExperience method to track total experience gained
   */
  gainExperience(amount: number): boolean {
    this.totalExperienceGained += amount;
    return super.gainExperience(amount);
  }

  /**
   * Override the levelUp method to track highest level
   */
  levelUp(): void {
    super.levelUp();
    if (this.level > this.highestLevel) {
      this.highestLevel = this.level;
    }
  }

  /**
   * Override the onKill method to track total enemies defeated and gain gold
   */
  onKill(target: Entity): void {
    super.onKill(target);
    this.totalEnemiesDefeated++;

    // Gain gold based on enemy level (assuming target has a getLevel method)
    const goldGained = target.getLevel() * 10;
    this.gainGold(goldGained);
  }

  /**
   * Gain gold
   */
  gainGold(amount: number): void {
    this.gold += amount;
  }

  /**
   * Spend gold if player has enough
   *
   * @param amount Amount of gold to spend
   * @returns Whether the transaction was successful
   */
  spendGold(amount: number): boolean {
    if (this.gold >= amount) {
      this.gold -= amount;
      return true;
    }
    return false;
  }

  // Player-specific getters
  getGold(): number { return this.gold; }
  getTotalExperienceGained(): number { return this.totalExperienceGained; }
  getTotalEnemiesDefeated(): number { return this.totalEnemiesDefeated; }
  getHighestLevel(): number { return this.highestLevel; }
}
