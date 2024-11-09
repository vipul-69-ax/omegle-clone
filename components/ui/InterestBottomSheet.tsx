import React, { useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { BlurView } from 'expo-blur'
import { BottomSheetModal, BottomSheetFlatList } from '@gorhom/bottom-sheet'

const predefinedInterests = [
  'Computer Science', 'Engineering', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Psychology', 'Sociology', 'Economics', 'Business', 'Law', 'Medicine', 'Nursing',
  'Education', 'Art', 'Music', 'Literature', 'History', 'Philosophy', 'Political Science',
  'Environmental Science', 'Data Science', 'Artificial Intelligence', 'Machine Learning',
  'Cybersecurity', 'Robotics', 'Biotechnology', 'Neuroscience', 'Astrophysics', 'Linguistics',
  'Anthropology', 'Architecture', 'Design', 'Environmental Engineering', 'Genetics',
  'Geography', 'Geology', 'Healthcare Management', 'Human Resources', 'Information Technology',
  'International Relations', 'Marketing', 'Nanotechnology', 'Oceanography', 'Paleontology',
  'Renewable Energy', 'Social Work', 'Statistics', 'Urban Planning', 'Veterinary Medicine',
  'Zoology', 'Agriculture', 'Botany', 'Ecology', 'Public Health', 'Sports Science',
  'Humanities', 'Religious Studies', 'Cultural Studies', 'Fashion', 'Film Studies',
  'Journalism', 'Media Studies', 'Game Design', 'Graphic Design', 'Animation', 'Theology',
  'Classical Studies', 'Music Therapy', 'Speech Therapy', 'Occupational Therapy',
  'Astrobiology', 'Cognitive Science', 'Digital Arts', 'Forensic Science',
  'Hospitality Management', 'Supply Chain Management', 'Quantum Computing',
  'Data Analytics', 'Behavioral Science', 'Educational Technology', 'Industrial Engineering',
  'Applied Mathematics', 'Social Psychology', 'Bioinformatics', 'Public Administration',
  'Ethics', 'Organizational Behavior', 'Systems Engineering', 'Biomedical Engineering',
  'Creative Writing', 'Gender Studies', 'Public Policy', 'Civil Engineering',
  'Chemical Engineering', 'Aerospace Engineering', 'Materials Science',
  'Transportation Engineering', 'Actuarial Science', 'Meteorology', 'Cartography',
  'Library Science', 'Military Science', 'Occupational Health', 'Quantum Physics',
  'Strategic Studies', 'Risk Management', 'Telecommunications', 'User Experience (UX) Design'
];

interface InterestsBottomSheetProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>
  onSelectInterest: (interest: string) => void
  selectedInterests: string[]
}

export default function InterestsBottomSheet({ 
  bottomSheetModalRef,
  onSelectInterest, 
  selectedInterests 
}: InterestsBottomSheetProps) {
  const renderItem = useCallback(({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.interestItem,
        selectedInterests.includes(item) && styles.selectedInterest
      ]}
      onPress={() => onSelectInterest(item)}
    >
      <Text style={[
        styles.interestText,
        selectedInterests.includes(item) && styles.selectedInterestText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  ), [onSelectInterest, selectedInterests])

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={['70%']}
      backgroundComponent={({ style }) => (
        <BlurView intensity={100} style={[style, styles.blurView]} tint="dark" />
      )}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Select your interests.</Text>
        <Text style={styles.subtitle}>Please select atleast one interest to proceed.</Text>
        <BottomSheetFlatList
          data={predefinedInterests}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          contentContainerStyle={styles.interestList}
          numColumns={3}
        />
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => bottomSheetModalRef.current?.close()}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  )
}

const styles = StyleSheet.create({
  blurView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#BBBBBB',
    marginBottom: 20,
  },
  interestList: {
    paddingBottom: 20,
  },
  interestItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginBottom: 10,
    marginRight: 10,
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  selectedInterest: {
    backgroundColor: '#0A84FF',
  },
  interestText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedInterestText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#0A84FF',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
})