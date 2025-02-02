import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { IconButton } from 'react-native-paper';
interface ListItem {
  id: string;
  name: string;
  description: string;
}

export default function TabOneScreen() {
  const [items, setItems] = useState<ListItem[]>([]);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Set the title for this screen
    navigation.setOptions({
      title: 'To-Do Tasks', 
    });

    const loadItems = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('items');
        if (storedItems) setItems(JSON.parse(storedItems));
      } catch (error) {
        Alert.alert('Error', 'Failed to load items');
      }
    };

    loadItems();
  }, [navigation]);

  const deleteItem = async (id: string) => {
    console.log('Deleting item with ID:', id); // Add this log to confirm deletion
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    await AsyncStorage.setItem('items', JSON.stringify(newItems));
  };
  

  // const confirmDelete = (id: string) => {
  //   console.log('Confirm delete called for item ID:', id); // Add this log to confirm
  //   Alert.alert(
  //     'Delete Item',
  //     'Are you sure you want to delete this item?',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       { text: 'Delete', onPress: () => deleteItem(id) }
  //     ]
  //   );
  // };

  const confirmDelete = (id: string) => {
    console.log('Confirm delete called for item ID:', id); // Test without Alert
    deleteItem(id);
  };
  
  

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemSubtitle}>{item.description}</Text>
            </View>
            <View style={styles.itemActions}>
              <Link href={`/add-item?id=${item.id}`} asChild>
                <Pressable style={styles.actionButton}>
                  <Ionicons name="pencil" size={20} color="#4a90e2" />
                </Pressable>
              </Link>
              <IconButton
                    icon="delete"
                    size={24}
                    onPress={() => {
                      console.log('Delete button pressed');
                      confirmDelete(item.id);
                    }}
                    iconColor="#ff3b30"
                    style={styles.actionButton}
                  />
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />

      <Link href="/add-item" asChild>
        <Pressable style={styles.fab}>
          <Ionicons name="add" size={28} color="white" />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 16,
  },
  actionButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
