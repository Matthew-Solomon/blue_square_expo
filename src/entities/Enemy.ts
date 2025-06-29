import { ImageSourcePropType } from 'react-native';
import Entity from './Entity';

/**
 * Difficulty levels for enemies
 */
export enum EnemyDifficulty {
  EASY = 'Easy',
  NORMAL = 'Normal',
  HARD = 'Hard',
  BOSS = 'Boss'
}

/**
 * Enemy class that extends the base Entity class
 */
export default class Enemy extends Entity {
  // Enemy-specific properties
  private difficulty: EnemyDifficulty;
  private experienceReward: number;
  private goldReward: number;
  private enemyType: string;

  /**
   * Create a new Enemy
   */
  constructor(
    enemyType: string,
    difficulty: EnemyDifficulty,
    level: number = 1,
    spriteImage: ImageSourcePropType = null,
    color: string = '#FF4500' // Default orange-red color
  ) {
    // Calculate stats based on difficulty and level
    const stats = Enemy.calculateStats(difficulty, level);

    super(
      stats.health,
      stats.shield,
      stats.dodgeRate,
      stats.critRate,
      stats.attackPower,
      spriteImage,
      color
    );

    // Initialize enemy-specific properties
    this.difficulty = difficulty;
    this.enemyType = enemyType;
    this.experienceReward = stats.experienceReward;
    this.goldReward = stats.goldReward;

    // Set the enemy's level
    this.level = level;

    // Adjust experience needed for next level based on difficulty
    this.experienceToNextLevel = 100 * level * this.getDifficultyMultiplier();
  }

  /**
   * Calculate enemy stats based on difficulty and level
   */
  private static calculateStats(difficulty: EnemyDifficulty, level: number): {
    health: number;
    shield: number;
    dodgeRate: number;
    critRate: number;
    attackPower: number;
    experienceReward: number;
    goldReward: number;
    isAggressive: boolean;
  } {
    // Base stats
    let health = 50;
    let shield = 10;
    let dodgeRate = 0.05;
    let critRate = 0.03;
    let attackPower = 10;
    let experienceReward = 20;
    let goldReward = 5;
    let isAggressive = false;

    // Apply difficulty multipliers
    switch (difficulty) {
      case EnemyDifficulty.EASY:
        // Easy enemies are weaker but give less rewards
        health *= 0.8;
        shield *= 0.7;
        attackPower *= 0.8;
        experienceReward *= 0.8;
        goldReward *= 0.8;
        break;

      case EnemyDifficulty.NORMAL:
        // Normal enemies are balanced
        break;

      case EnemyDifficulty.HARD:
        // Hard enemies are stronger and give better rewards
        health *= 1.5;
        shield *= 1.3;
        dodgeRate *= 1.2;
        critRate *= 1.2;
        attackPower *= 1.3;
        experienceReward *= 1.5;
        goldReward *= 1.5;
        isAggressive = true;
        break;

      case EnemyDifficulty.BOSS:
        // Bosses are much stronger and give excellent rewards
        health *= 3;
        shield *= 2;
        dodgeRate *= 1.5;
        critRate *= 1.5;
        attackPower *= 2;
        experienceReward *= 3;
        goldReward *= 3;
        isAggressive = true;
        break;
    }

    // Apply level scaling
    health = Math.floor(health * (1 + (level - 1) * 0.2));
    shield = Math.floor(shield * (1 + (level - 1) * 0.1));
    attackPower = Math.floor(attackPower * (1 + (level - 1) * 0.15));
    experienceReward = Math.floor(experienceReward * (1 + (level - 1) * 0.3));
    goldReward = Math.floor(goldReward * (1 + (level - 1) * 0.25));

    return {
      health,
      shield,
      dodgeRate,
      critRate,
      attackPower,
      experienceReward,
      goldReward,
      isAggressive
    };
  }

  /**
   * Get the difficulty multiplier for various calculations
   */
  private getDifficultyMultiplier(): number {
    switch (this.difficulty) {
      case EnemyDifficulty.EASY:
        return 0.8;
      case EnemyDifficulty.NORMAL:
        return 1.0;
      case EnemyDifficulty.HARD:
        return 1.5;
      case EnemyDifficulty.BOSS:
        return 2.5;
      default:
        return 1.0;
    }
  }

  /**
   * Get the experience reward for defeating this enemy
   */
  getExperienceReward(): number {
    return this.experienceReward;
  }

  /**
   * Get the gold reward for defeating this enemy
   */
  getGoldReward(): number {
    return this.goldReward;
  }

  /**
   * Get the enemy type
   */
  getEnemyType(): string {
    return this.enemyType;
  }

  /**
   * Get the difficulty level
   */
  getDifficulty(): EnemyDifficulty {
    return this.difficulty;
  }
}
