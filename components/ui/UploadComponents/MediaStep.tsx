import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, TextInput, Dimensions, Alert } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { width } from '@/constants/Screen';

export function MediaStep() {
  const { setValue, watch, formState: { errors }, getValues } = useFormContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  const addLink = () => {
    if (title && link) {
      const newLink = { title, link };
      setValue('links', [...watch('links', []), newLink]);
      setIsModalVisible(false);
      console.log(getValues("links"))
      setTitle('');
      setLink('');
    }
  };

  const removeLink = (index: number) => {
    Alert.alert(
      "Remove Link",
      "Are you sure you want to remove this link?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Remove",
          onPress: () => {
            const currentLinks = [...watch('links', [])];
            currentLinks.splice(index, 1);
            setValue('links', currentLinks);
            console.log(getValues("links"));
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>Project Links</Text>
      <Pressable 
        style={styles.mediaButton} 
        onPress={() => setIsModalVisible(true)}
        accessibilityLabel="Add a new link"
      >
        <Ionicons name="link" size={24} color="#007AFF" />
        <Text style={styles.mediaButtonText}>Add Link</Text>
      </Pressable>
      {errors.links && <Text style={styles.errorText}>{errors.links.message}</Text>}
      <ScrollView style={styles.mediaPreviewContainer}>
        {watch('links', []).map((item, index) => (
          <Pressable style={styles.linkItem} key={index}>
          <Ionicons name="link" size={20} color="#007AFF" style={{marginRight:8}} />
          <Text style={{color:"#007AFF"}}>{item.title}</Text>
          <Entypo name="cross" size={20} color="#007AFF" style={{position:"absolute", right:4}} onPress={()=>removeLink(index)} />
        </Pressable>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a new link</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              accessibilityLabel="Enter link title"
            />
            <TextInput
              style={styles.input}
              placeholder="Link"
              placeholderTextColor="#999"
              value={link}
              onChangeText={setLink}
              accessibilityLabel="Enter link URL"
            />
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setIsModalVisible(false)}
                accessibilityLabel="Cancel adding link"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={[styles.button, styles.addButton]} 
                onPress={addLink}
                accessibilityLabel="Add link"
              >
                <Text style={styles.addButtonText}>Add Link</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  mediaButtonText: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 8,
  },
  errorText: {
    color: '#FF4136',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  mediaPreviewContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mediaPreview: {
    width: 150,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  linkTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  linkUrl: {
    fontSize: 14,
    color: '#007AFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    color: '#FFFFFF',
    backgroundColor: '#2C2C2C',
    
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding:4,
    width:width-40
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#333333',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});