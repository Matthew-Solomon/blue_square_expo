import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Enemy from '../entities/Enemy';
import Player from '../entities/Player';
import CombatManager, { CombatAction, CombatResult, CombatState } from '../managers/CombatManager';

interface CombatInterfaceProps {
  player: Player;
  enemy: Enemy;
  onCombatEnd: (result: CombatResult) => void;
}

const CombatInterface: React.FC<CombatInterfaceProps> = ({ player, enemy, onCombatEnd }) => {
  const [combatManager] = useState<CombatManager>(() => new CombatManager(player));
  const [combatState, setCombatState] = useState<CombatState>({
    isPlayerTurn: true,
    currentEnemy: enemy,
    turns: [],
    result: CombatResult.ONGOING,
    playerDefending: false
  });

  useEffect(() => {
    // Initialize combat
    combatManager.setOnStateChangeListener(setCombatState);
    combatManager.startCombat(enemy);

    return () => {
      // Cleanup
      combatManager.setOnStateChangeListener(null);
    };
  }, [enemy, player]);

  useEffect(() => {
    // Check if combat has ended
    if (combatState.result !== CombatResult.ONGOING) {
      onCombatEnd(combatState.result);
    }
  }, [combatState.result, onCombatEnd]);

  const handleAction = (action: CombatAction) => {
    if (combatState.isPlayerTurn) {
      combatManager.performAction(action);
    }
  };

  const renderCombatLog = () => {
    return (
      <ScrollView style={styles.combatLog}>
        {combatState.turns.map((turn, index) => (
          <Text key={index} style={styles.logEntry}>
            {turn.message}
          </Text>
        ))}
      </ScrollView>
    );
  };

  const renderActionButtons = () => {
    // Only show action buttons if it's the player's turn and combat is ongoing
    if (!combatState.isPlayerTurn || combatState.result !== CombatResult.ONGOING) {
      return (
        <View style={styles.waitingMessage}>
          <Text style={styles.waitingText}>
            {combatState.result !== CombatResult.ONGOING
              ? "Combat ended"
              : "Enemy is taking action..."}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAction(CombatAction.ATTACK)}
        >
          <Text style={styles.buttonText}>Attack</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAction(CombatAction.DEFEND)}
        >
          <Text style={styles.buttonText}>Defend</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAction(CombatAction.USE_ITEM)}
        >
          <Text style={styles.buttonText}>Use Item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAction(CombatAction.RUN)}
        >
          <Text style={styles.buttonText}>Run</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCombatants = () => {
    return (
      <View style={styles.combatantsContainer}>
        <View style={styles.combatant}>
          <Text style={styles.combatantName}>{player.getName()}</Text>
          <Text style={styles.healthText}>
            HP: {player.getHealth()}/{player.getMaxHealth()}
          </Text>
        </View>

        <View style={styles.vsContainer}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        <View style={styles.combatant}>
          <Text style={styles.combatantName}>{enemy.getName()}</Text>
          <Text style={styles.healthText}>
            HP: {enemy.getHealth()}/{enemy.getMaxHealth()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderCombatants()}
      {renderCombatLog()}
      {renderActionButtons()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  combatantsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  combatant: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    minWidth: 120,
  },
  combatantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  healthText: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  vsContainer: {
    padding: 10,
  },
  vsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  combatLog: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    maxHeight: 200,
  },
  logEntry: {
    marginBottom: 5,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  waitingMessage: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  waitingText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CombatInterface;
