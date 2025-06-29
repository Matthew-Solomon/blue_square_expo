import { StyleSheet, SafeAreaView } from 'react-native';
import SplitScreenLayout from '../../src/components/SplitScreenLayout';

export default function GameScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <SplitScreenLayout />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
