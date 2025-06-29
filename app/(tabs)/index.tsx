import { StyleSheet, View } from 'react-native';

export default function BlueSquareScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.blueSquare} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  blueSquare: {
    width: 200,
    height: 200,
    backgroundColor: '#1E90FF', // Dodger Blue
  },
});
