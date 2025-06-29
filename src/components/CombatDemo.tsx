import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Player from '../entities/Player';
import Enemy, { EnemyDifficulty } from '../entities/Enemy';
import { Ability } from '../entities/Entity';

// Define some sample abilities
const healOnAttackAbility: Ability = {
  name: 'Life Steal',
  description: 'Heal for 10% of damage dealt',
  onAttack: (entity, target) => {
    const healAmount = Math.floor(entity.getAttackPower() * 0.1);
    entity.heal(healAmount);
  }
};

const shieldOnKillAbility: Ability = {
  name: 'Shield Surge',
  description: 'Gain shield when defeating an enemy',
  onKill: (entity, target) => {
    entity.restoreShield(10);
  }
};

export default function CombatDemo() {
  // Create player and enemy
  const [player, setPlayer] = useState<Player>(new Player());
  const [enemy, setEnemy] = useState<Enemy>(
    new Enemy('Red Square', EnemyDifficulty.NORMAL, 1, null, '#FF0000')
  );

  // Combat state
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [combatEnded, setCombatEnded] = useState<boolean>(false);
  const [turnCount, setTurnCount] = useState<number>(0);
  const [winner, setWinner] = useState<string | null>(null);

  // Initialize combat
  useEffect(() => {
    // Add abilities to player
    player.addAbility(healOnAttackAbility);
    player.addAbility(shieldOnKillAbility);

    // Add initial combat log
    setCombatLog([
      'Combat started!',
      `Player: Health ${player.getHealth()}, Shield ${player.getShield()}, Attack ${player.getAttackPower()}`,
      `Enemy: Health ${enemy.getHealth()}, Shield ${enemy.getShield()}, Attack ${enemy.getAttackPower()}`
    ]);
  }, []);

  // Perform a single turn of combat
  const performTurn = () => {
    if (combatEnded) return;

    const newLogs: string[] = [];
    setTurnCount(turnCount + 1);
    newLogs.push(`--- Turn ${turnCount + 1} ---`);

    // Player attacks enemy
    const playerDamage = player.attack(enemy);
    newLogs.push(`Player attacks for ${playerDamage} damage!`);

    // Check if enemy is defeated
    if (enemy.isDead()) {
      newLogs.push(`Enemy defeated!`);
      newLogs.push(`Player gained ${enemy.getExperienceReward()} experience and ${enemy.getGoldReward()} gold!`);

      // Player gains rewards
      const leveledUp = player.gainExperience(enemy.getExperienceReward());
      player.gainGold(enemy.getGoldReward());

      if (leveledUp) {
        newLogs.push(`Player leveled up to level ${player.getLevel()}!`);
      }

      setCombatEnded(true);
      setWinner('Player');
      setCombatLog([...combatLog, ...newLogs]);
      return;
    }

    // Enemy attacks player
    const enemyDamage = enemy.attack(player);
    newLogs.push(`Enemy attacks for ${enemyDamage} damage!`);

    // Check if player is defeated
    if (player.isDead()) {
      newLogs.push(`Player defeated!`);
      setCombatEnded(true);
      setWinner('Enemy');
      setCombatLog([...combatLog, ...newLogs]);
      return;
    }

    // Update status
    newLogs.push(`Player: Health ${player.getHealth()}, Shield ${player.getShield()}`);
    newLogs.push(`Enemy: Health ${enemy.getHealth()}, Shield ${enemy.getShield()}`);

    setCombatLog([...combatLog, ...newLogs]);
  };

  // Start a new combat
  const startNewCombat = () => {
    // Create new player and enemy
    const newPlayer = new Player();
    newPlayer.addAbility(healOnAttackAbility);
    newPlayer.addAbility(shieldOnKillAbility);

    const enemyLevel = Math.floor(Math.random() * 3) + 1;
    const enemyDifficulties = [
      EnemyDifficulty.EASY,
      EnemyDifficulty.NORMAL,
      EnemyDifficulty.HARD
    ];
    const randomDifficulty = enemyDifficulties[Math.floor(Math.random() * enemyDifficulties.length)];

    const newEnemy = new Enemy('Red Square', randomDifficulty, enemyLevel, null, '#FF0000');

    // Reset combat state
    setPlayer(newPlayer);
    setEnemy(newEnemy);
    setCombatLog([
      'Combat started!',
      `Player: Health ${newPlayer.getHealth()}, Shield ${newPlayer.getShield()}, Attack ${newPlayer.getAttackPower()}`,
      `Enemy: Level ${enemyLevel} ${randomDifficulty} - Health ${newEnemy.getHealth()}, Shield ${newEnemy.getShield()}, Attack ${newEnemy.getAttackPower()}`
    ]);
    setCombatEnded(false);
    setTurnCount(0);
    setWinner(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Combat Demo</Text>

      {/* Entity displays */}
      <View style={styles.entitiesContainer}>
        <View style={styles.entityContainer}>
          <View style={[styles.square, { backgroundColor: player.getColor() }]} />
          <Text style={styles.entityTitle}>Player</Text>
          <Text>Level: {player.getLevel()}</Text>
          <Text>Health: {player.getHealth()}/{player.getMaxHealth()}</Text>
          <Text>Shield: {player.getShield()}/{player.getMaxShield()}</Text>
          <Text>Gold: {player.getGold()}</Text>
        </View>

        <View style={styles.entityContainer}>
          <View style={[styles.square, { backgroundColor: enemy.getColor() }]} />
          <Text style={styles.entityTitle}>{enemy.getEnemyType()}</Text>
          <Text>Level: {enemy.getLevel()} ({enemy.getDifficulty()})</Text>
          <Text>Health: {enemy.getHealth()}/{enemy.getMaxHealth()}</Text>
          <Text>Shield: {enemy.getShield()}/{enemy.getMaxShield()}</Text>
          <Text>XP Reward: {enemy.getExperienceReward()}</Text>
        </View>
      </View>

      {/* Combat controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.button, combatEnded ? styles.buttonDisabled : {}]}
          onPress={performTurn}
          disabled={combatEnded}
        >
          <Text style={styles.buttonText}>Perform Turn</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={startNewCombat}
        >
          <Text style={styles.buttonText}>New Combat</Text>
        </TouchableOpacity>
      </View>

      {/* Combat result */}
      {winner && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{winner} wins!</Text>
        </View>
      )}

      {/* Combat log */}
      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Combat Log</Text>
        <View style={styles.log}>
          {combatLog.map((log, index) => (
            <Text key={index} style={styles.logEntry}>{log}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  entitiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  entityContainer: {
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '45%',
  },
  entityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  square: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  logContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  log: {
    flex: 1,
  },
  logEntry: {
    marginBottom: 4,
  },
});
