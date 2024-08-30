import React, { useState, useEffect, }from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FlatGrid } from 'react-native-super-grid';
import { PaperProvider, Appbar, FAB, Avatar, Menu, Portal, Modal, TextInput, Button } from 'react-native-paper';
import { addReward, getAllRewards, deleteReward } from '../db/rewards'
import { buyReward, getBalance } from '../db/balances';

export default function Example() {
  const [items, setItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [balance, setBalance] = useState(0)

  useFocusEffect(() => {
    fetchBalance();
  });

  const fetchBalance = async () => {
    const balance = await getBalance();
    setBalance(balance)
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    const rewardsData = await getAllRewards();
    setItems(rewardsData);
  };

  const addItem = () => {
    const newItem = {
      name,
      cost,
    };
    addReward(newItem);
    fetchHabits();
    setVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setCost('');
  };

  const showMenu = (item) => {
    setSelectedItem(item);
    setMenuVisible(true);
  };

  const hideMenu = () => {
    setMenuVisible(false);
    setSelectedItem(null);
    console.log('se muestra', menuVisible);
  };

  const buy = (item) => {
    buyReward(item);
    fetchBalance();
    hideMenu();
  };

  const deleteItem = (item) => {
    deleteReward(item);
    fetchHabits();
    hideMenu();
  };


  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.Content title="Rewards" titleStyle={styles.headerTitle} />
        </Appbar.Header>
        <FlatGrid
          itemDimension={100}
          data={items}
          style={styles.gridView}
          spacing={10}
          renderItem={({ item }) => (
          <Menu
            visible={menuVisible && selectedItem === item}
            onDismiss={hideMenu}
            anchor={
              <TouchableOpacity onPress={() => showMenu(item)}>
              <View style={[styles.itemContainer, { backgroundColor: '#6200ee' }]}>
                <Avatar.Icon size={80} icon="trophy" />
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDescription}>{`Cost: ${item.cost}`}</Text>
              </View>
            </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => buy(item)} title="Buy" />
            <Menu.Item onPress={() => deleteItem(item)} title="Delete reward" />
          </Menu>
          )}
        />
      </View>
      <FAB
        style={styles.fab}
        small
        icon="plus"
        onPress={() => setVisible(true)}
      />
      <FAB
        style={styles.points}
        label={`Points: ${balance}`}
        small
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
              value={cost}
              onChangeText={setCost}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button mode="contained" onPress={addItem} style={styles.button}>
              Add Reward
            </Button>
            <Button mode="contained" onPress={() => setVisible(false)} style={styles.button}>
              Exit
            </Button>
          </Modal>
        </Portal>
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
  gridView: {
    marginTop: 10,
    flex: 1
  },
  itemContainer: {
    borderRadius: 5,
    padding: 10,
    height: 150,
    alignItems: 'center'
  },
  itemName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    margin: 3
  },
  itemDescription: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200ee',
  },
  points: {
    position: 'absolute',
    left: 25,
    width: 200,
    bottom: 16
  },
  input: {
    marginBottom: 10
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
  },
});