import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Player from '../entities/Player';

interface PlayerStatsDisplayProps {
  player: Player;
}

const PlayerStatsDisplay: React.FC<PlayerStatsDisplayProps> = ({
  player
}) => {
  // Format percentages for better display
  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Stats</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statsColumn}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Health:</Text>
            <Text style={styles.statValue}>{player.getHealth()} / {player.getMaxHealth()}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Shield:</Text>
            <Text style={styles.statValue}>{player.getShield()}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Level:</Text>
            <Text style={styles.statValue}>{player.getLevel()}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Experience:</Text>
            <Text style={styles.statValue}>{player.getExperience()} / {player.getExperienceToNextLevel()}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Gold:</Text>
            <Text style={styles.statValue}>{player.getGold()}</Text>
          </View>
        </View>

        <View style={styles.statsColumn}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Attack:</Text>
            <Text style={styles.statValue}>{player.getAttackPower()}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Dodge Rate:</Text>
            <Text style={styles.statValue}>{formatPercent(player.getDodgeRate())}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Crit Rate:</Text>
            <Text style={styles.statValue}>{formatPercent(player.getCritRate())}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Enemies Defeated:</Text>
            <Text style={styles.statValue}>{player.getTotalEnemiesDefeated()}</Text>
          </View>

          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total XP Gained:</Text>
            <Text style={styles.statValue}>{player.getTotalExperienceGained()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statsColumn: {
    flex: 1,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#1E90FF',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E90FF',
  },
});

export default PlayerStatsDisplay;
