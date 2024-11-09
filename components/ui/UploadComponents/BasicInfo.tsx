import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/UploadHelpers';

export function BasicInfoStep() {
  const { control, formState: { errors } } = useFormContext();

  return (
    <View style={styles.step}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Project Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.basicinfo?.name?.message}
          />
        )}
        name="basicinfo.name"
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Project Description"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline
            numberOfLines={4}
            error={errors.basicinfo?.description?.message}
          />
        )}
        name="basicinfo.description"
      />
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
});