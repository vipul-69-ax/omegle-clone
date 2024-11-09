import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, Pressable } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { Video } from 'expo-av';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@/components/UploadHelpers';
import { Ionicons } from '@expo/vector-icons';

export function ReviewStep() {
  const { watch } = useFormContext();
  
  return (
    <ScrollView style={styles.step}>
      <Text style={styles.stepTitle}>Review Your Project</Text>
      <Card>
        <CardHeader>
          <CardTitle>{watch('basicinfo.name')}</CardTitle>
          <CardDescription>{watch('basicinfo.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Text style={styles.reviewLabel}>Date Range:</Text>
          <Text style={styles.reviewText}>{`${watch('details.startDate').toDateString()} to ${watch('details.endDate').toDateString()}`}</Text>
          <Text style={styles.reviewLabel}>Technologies:</Text>
          <View style={styles.techContainer}>
            {watch('details.technologies').map((tech, index) => (
              <Badge key={index}>{tech}</Badge>
            ))}
          </View>
          <Text style={styles.reviewLabel}>Team Members:</Text>
          {watch('team.team').map((member, index) => (
            <Text key={index} style={styles.reviewText}>{`${member.name} - ${member.role}`}</Text>
          ))}
          <Text style={styles.reviewLabel}>Media:</Text>
          <ScrollView horizontal style={styles.mediaPreviewContainer}>
            {watch('links').map((item, index) => (
              <Pressable style={styles.linkItem} key={index}>
              <Ionicons name="link" size={20} color="#007AFF" style={{marginRight:8}} />
              <Text style={{color:"#007AFF"}}>{item.title}</Text>
            </Pressable>
            ))}
          </ScrollView>
        </CardContent>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  step: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 20,
    marginBottom:100
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  reviewLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  reviewText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mediaPreviewContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mediaPreview: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mediaPreviewImage: {
    width: '100%',
    height: '100%',
  },
  mediaPreviewVideo: {
    width: '100%',
    height: '100%',
  },
});