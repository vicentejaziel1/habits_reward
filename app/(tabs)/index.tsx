import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, FAB, Provider as PaperProvider, Appbar, Modal, Portal, TextInput, Button, Menu } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { addHabit, getAllHabits, deleteHabit, markHabitAsDone } from '../db/habits'
export default function App() {
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [points, setPoints] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    const habitsData = await getAllHabits();
    setItems(habitsData);
  };

  const addItem = () => {
    const newItem = {
      name,
      time,
      points,
    };
    addHabit(newItem);
    fetchHabits();
    setVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setTime('');
    setPoints('');
  };

  const showMenu = (item) => {
    setSelectedItem(item);
    setMenuVisible(true);
  };

  const hideMenu = () => {
    setMenuVisible(false);
  };

  const markAsDone = (item) => {
    markHabitAsDone(item);
    fetchHabits();
    hideMenu();
  };

  const deleteItem = (item) => {
    deleteHabit(item);
    fetchHabits();
    hideMenu();
  };

  const onDismissTimePicker = () => {
    setTimePickerVisible(false);
  };

  const onConfirmTimePicker = ({ hours, minutes }) => {
    setTime(`${hours}:${minutes < 10 ? '0' + minutes : minutes}`);
    setTimePickerVisible(false);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.Content title="Habits" titleStyle={styles.headerTitle} />
        </Appbar.Header>

        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Menu
              visible={menuVisible && selectedItem === item}
              onDismiss={hideMenu}
              anchor={
                <List.Item
                  style={styles.item}
                  title={item.name}
                  description={item.time}
                  left={() => <List.Icon color={item.status == 'done' ? '#6200ee': ''} icon="check-circle" />}
                  onPress={() => showMenu(item)}
                />
              }
            >
              <Menu.Item onPress={() => markAsDone(item)} title="Done" />
              <Menu.Item onPress={() => deleteItem(item)} title="Delete habit" />
            </Menu>
          )}
        />

        <FAB
          style={styles.fab}
          small
          icon="plus"
          onPress={() => setVisible(true)}
        />

        <Portal>
          <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modal}>
            <TextInput
              label="Nombre"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              label="Puntos"
              value={points}
              onChangeText={setPoints}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button onPress={() => setTimePickerVisible(true)} style={styles.inputTime}>
              {time || 'Choose time'}
            </Button>
            <Button mode="contained" onPress={addItem} style={styles.button}>
              Add habit
            </Button>
            <Button mode="contained" onPress={() => setVisible(false)} style={styles.button}>
              Exit
            </Button>
          </Modal>

          <TimePickerModal
            visible={timePickerVisible}
            onDismiss={onDismissTimePicker}
            onConfirm={onConfirmTimePicker}
            hours={12} // default hours value
            minutes={0} // default minutes value
            label="Selecciona la hora"
          />
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#6200ee',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200ee',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  input: {
    marginBottom: 10
  },
  item: {
    marginLeft: 15
  },
  inputTime: {
    marginBottom: 10,
    backgroundColor: '#6200ee'
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioLabel: {
    marginLeft: 10,
  },
  button: {
    marginTop: 20,
  },
});