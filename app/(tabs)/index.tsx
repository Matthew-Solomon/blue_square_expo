import { StyleSheet, View, SafeAreaView } from 'react-native';
import CombatDemo from '../../src/components/CombatDemo';

export default function GameScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <CombatDemo />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
