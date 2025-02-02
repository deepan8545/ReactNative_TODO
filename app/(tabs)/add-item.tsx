import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface ListItem {
  id: string;
  name: string;
  description: string;
}

export default function AddItemScreen() {
  const params = useLocalSearchParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (params.id) {
      loadItemForEditing();
    }
  }, [params.id]);

  const loadItemForEditing = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('items');
      if (storedItems) {
        const items: ListItem[] = JSON.parse(storedItems);
        const item = items.find(i => i.id === params.id);
        if (item) {
          setName(item.name);
          setDescription(item.description);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load item for editing');
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const storedItems = await AsyncStorage.getItem('items');
      const items: ListItem[] = storedItems ? JSON.parse(storedItems) : [];

      if (params.id) {
        // Update existing item
        const updatedItems = items.map(item => 
          item.id === params.id ? { ...item, name, description } : item
        );
        await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
      } else {
        // Create new item
        const newItem = {
          id: Date.now().toString(),
          name,
          description,
        };
        await AsyncStorage.setItem('items', JSON.stringify([...items, newItem]));
      }

      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save item');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input} 
        placeholder="Item name"
        value={name}
        onChangeText={setName}
        autoFocus
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {params.id ? 'Update Item' : 'Add Item'}
        </Text>
      </Pressable>

      <Pressable style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color="#666" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
});