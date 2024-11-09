import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { useFormContext, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input } from '@/components/UploadHelpers';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';

export function DetailsStep() {
  const { control, formState: { errors } } = useFormContext();
  const keyboard = useAnimatedKeyboard();
  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -keyboard.height.value/3 }],
    };
  });
  return (
    <Animated.View style={[styles.step,translateStyle]}>
      <Text style={styles.stepTitle}>Project Details</Text>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <View>
            <Text style={styles.dateLabel}>Start Date:</Text>
            <DateTimePicker
              value={value}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => onChange(selectedDate || value)}
              style={styles.datePicker}
            />
          </View>
        )}
        name="details.startDate"
      />
      {errors.details?.startDate && <Text style={styles.errorText}>{errors.details.startDate.message}</Text>}
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <View>
            <Text style={styles.dateLabel}>End Date:</Text>
            <DateTimePicker
              value={value}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => onChange(selectedDate || value)}
              style={styles.datePicker}
            />
          </View>
        )}
        name="details.endDate"
      />

      {errors.details?.endDate && <Text style={styles.errorText}>{errors.details.endDate.message}</Text>}
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="Technologies (comma-separated)"
            onBlur={onBlur}
            onChangeText={(text) => onChange(text.split(',').map(t => t.trim()))}
            value={value.join(', ')}
            error={errors.details?.technologies?.message}
          />
        )}
        name="details.technologies"
      />
    </Animated.View>
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
  dateLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  datePicker: {
    borderRadius: 8,
    marginBottom: 16,
    padding:4
  },
  errorText: {
    color: '#FF4136',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
});