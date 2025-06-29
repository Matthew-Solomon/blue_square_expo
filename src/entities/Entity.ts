import { ImageSourcePropType } from 'react-native';

/**
 * Represents a special ability or upgrade that an entity can have
 */
export interface Ability {
  name: string;
  description: string;
  onAttack?: (entity: Entity, target: Entity) => void;
  onDamaged?: (entity: Entity, attacker: Entity, damage: number) => void;
  onKill?: (entity: Entity, target: Entity) => void;
  onLevelUp?: (entity: Entity) => void;
  passive?: (entity: Entity) => void;
}

/**
 * Base Entity class that both player and enemies can inherit from
 */
export default class Entity {
  // Basic stats
  protected health: number;
  protected maxHealth: number;
  protected shield: number;
  protected maxShield: number;
  protected dodgeRate: number;
  protected critRate: number;
  protected attackPower: number;

  // Level and progression
  protected level: number;
  protected experience: number;
  protected experienceToNextLevel: number;

  // Visual representation
  protected spriteImage: ImageSourcePropType;
  protected color: string;

  // Special abilities
  protected abilities: Ability[];

  // Combat tracking
  protected kills: number;
  protected damageDealt: number;
  protected damageTaken: number;

  /**
   * Create a new Entity
   */
  constructor(
    health: number,
    shield: number,
    dodgeRate: number,
    critRate: number,
    attackPower: number,
    spriteImage: ImageSourcePropType,
    color: string = '#1E90FF'
  ) {
    // Initialize basic stats
    this.health = health;
    this.maxHealth = health;
    this.shield = shield;
    this.maxShield = shield;
    this.dodgeRate = dodgeRate;
    this.critRate = critRate;
    this.attackPower = attackPower;

    // Initialize level and progression
    this.level = 1;
    this.experience = 0;
    this.experienceToNextLevel = 100;

    // Initialize visual representation
    this.spriteImage = spriteImage;
    this.color = color;

    // Initialize special abilities
    this.abilities = [];

    // Initialize combat tracking
    this.kills = 0;
    this.damageDealt = 0;
    this.damageTaken = 0;
  }

  /**
   * Attack another entity
   *
   * @param target The entity to attack
   * @returns The amount of damage dealt
   */
  attack(target: Entity): number {
    // Calculate base damage
    let damage = this.attackPower;

    // Check for critical hit
    const isCritical = Math.random() < this.critRate;
    if (isCritical) {
      damage *= 2; // Double damage on critical hit
    }

    // Apply damage to target
    const actualDamage = target.takeDamage(damage);
    this.damageDealt += actualDamage;

    // Check if target was defeated
    if (target.isDead()) {
      this.kills++;
      this.onKill(target);
    }

    // Trigger abilities that activate on attack
    this.abilities.forEach(ability => {
      if (ability.onAttack) {
        ability.onAttack(this, target);
      }
    });

    return actualDamage;
  }

  /**
   * Take damage, accounting for shields and dodge chance
   *
   * @param amount Amount of damage to potentially take
   * @returns The actual amount of damage taken
   */
  takeDamage(amount: number): number {
    // Check for dodge
    if (Math.random() < this.dodgeRate) {
      return 0; // Dodged the attack
    }

    // Apply shield reduction
    let actualDamage = amount;
    if (this.shield > 0) {
      if (this.shield >= actualDamage) {
        this.shield -= actualDamage;
        actualDamage = 0; // Shield absorbed all damage
      } else {
        actualDamage -= this.shield;
        this.shield = 0;
      }
    }

    // Apply damage to health
    if (actualDamage > 0) {
      this.health = Math.max(0, this.health - actualDamage);
      this.damageTaken += actualDamage;
    }

    // Trigger abilities that activate on being damaged
    this.abilities.forEach(ability => {
      if (ability.onDamaged) {
        ability.onDamaged(this, this, actualDamage);
      }
    });

    return actualDamage;
  }

  /**
   * Check if the entity is dead
   */
  isDead(): boolean {
    return this.health <= 0;
  }

  /**
   * Gain experience points
   *
   * @param amount Amount of experience to gain
   * @returns Whether the entity leveled up
   */
  gainExperience(amount: number): boolean {
    this.experience += amount;

    // Check for level up
    if (this.experience >= this.experienceToNextLevel) {
      this.levelUp();
      return true;
    }

    return false;
  }

  /**
   * Level up the entity
   */
  levelUp(): void {
    this.level++;
    this.experience -= this.experienceToNextLevel;
    this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5); // Increase XP needed for next level

    // Improve stats
    this.maxHealth = Math.floor(this.maxHealth * 1.2);
    this.health = this.maxHealth;
    this.maxShield = Math.floor(this.maxShield * 1.1);
    this.shield = this.maxShield;
    this.attackPower = Math.floor(this.attackPower * 1.15);

    // Trigger abilities that activate on level up
    this.abilities.forEach(ability => {
      if (ability.onLevelUp) {
        ability.onLevelUp(this);
      }
    });
  }

  /**
   * Add an ability to the entity
   *
   * @param ability The ability to add
   */
  addAbility(ability: Ability): void {
    this.abilities.push(ability);

    // Immediately apply passive effect if it exists
    if (ability.passive) {
      ability.passive(this);
    }
  }

  /**
   * Called when this entity defeats another entity
   *
   * @param target The defeated entity
   */
  onKill(target: Entity): void {
    // Trigger abilities that activate on kill
    this.abilities.forEach(ability => {
      if (ability.onKill) {
        ability.onKill(this, target);
      }
    });
  }

  /**
   * Heal the entity
   *
   * @param amount Amount of health to restore
   * @returns The actual amount healed
   */
  heal(amount: number): number {
    const oldHealth = this.health;
    this.health = Math.min(this.maxHealth, this.health + amount);
    return this.health - oldHealth;
  }

  /**
   * Restore shield
   *
   * @param amount Amount of shield to restore
   * @returns The actual amount restored
   */
  restoreShield(amount: number): number {
    const oldShield = this.shield;
    this.shield = Math.min(this.maxShield, this.shield + amount);
    return this.shield - oldShield;
  }

  // Getters
  getHealth(): number { return this.health; }
  getMaxHealth(): number { return this.maxHealth; }
  getShield(): number { return this.shield; }
  getMaxShield(): number { return this.maxShield; }
  getDodgeRate(): number { return this.dodgeRate; }
  getCritRate(): number { return this.critRate; }
  getAttackPower(): number { return this.attackPower; }
  getLevel(): number { return this.level; }
  getExperience(): number { return this.experience; }
  getExperienceToNextLevel(): number { return this.experienceToNextLevel; }
  getSpriteImage(): ImageSourcePropType { return this.spriteImage; }
  getColor(): string { return this.color; }
  getAbilities(): Ability[] { return [...this.abilities]; }
  getKills(): number { return this.kills; }
  getDamageDealt(): number { return this.damageDealt; }
  getDamageTaken(): number { return this.damageTaken; }

  // Setters for modifying stats (useful for upgrades)
  setMaxHealth(value: number): void {
    this.maxHealth = value;
    if (this.health > this.maxHealth) this.health = this.maxHealth;
  }
  setMaxShield(value: number): void {
    this.maxShield = value;
    if (this.shield > this.maxShield) this.shield = this.maxShield;
  }
  setDodgeRate(value: number): void { this.dodgeRate = Math.min(0.9, Math.max(0, value)); } // Cap at 90%
  setCritRate(value: number): void { this.critRate = Math.min(0.9, Math.max(0, value)); } // Cap at 90%
  setAttackPower(value: number): void { this.attackPower = value; }
  setColor(value: string): void { this.color = value; }
  setSpriteImage(value: ImageSourcePropType): void { this.spriteImage = value; }
}
