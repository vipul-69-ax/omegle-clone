import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, FlatList } from 'react-native';

const predefinedRoles = [
  'Software Developer',
  'Hardware Engineer',
  'Project Manager',
  'UI/UX Designer',
  'Data Scientist',
  'Quality Assurance',
  'DevOps Engineer',
];

interface RoleSelectorProps {
  onSelectRole: (role: string) => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  const [customRole, setCustomRole] = useState('');

  const renderRoleItem = ({ item }: { item: string }) => (
    <Pressable style={styles.roleItem} onPress={() => onSelectRole(item)}>
      <Text style={styles.roleText}>{item}</Text>
    </Pressable>
  );

  const handleAddCustomRole = () => {
    if (customRole.trim()) {
      onSelectRole(customRole.trim());
      setCustomRole('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Role</Text>
      <View>
      <FlatList
        data={predefinedRoles}
        renderItem={renderRoleItem}
        keyExtractor={(item) => item}
        style={styles.roleList}
      />
      </View>
      <View style={styles.customRoleContainer}>
        <TextInput
          style={styles.customRoleInput}
          placeholder="Enter custom role"
          placeholderTextColor="#999"
          value={customRole}
          onChangeText={setCustomRole}
        />
        <Pressable style={styles.addButton} onPress={handleAddCustomRole}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
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
    color: '#FFFFFF',
    marginBottom: 16,
  },
  roleList: {
    marginBottom: 16,
  },
  roleItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  roleText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  customRoleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customRoleInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#FFFFFF',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});