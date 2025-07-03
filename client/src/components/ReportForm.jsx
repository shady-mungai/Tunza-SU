import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const categories = ['Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'Other'];
const priorities = ['Low', 'Medium', 'High', 'Urgent'];

const ReportForm = ({ visible, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState(priorities[0]);
  const [imageUri, setImageUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!title || !description || !location) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    const reportData = {
      title,
      description,
      location,
      category,
      priority,
      estimated_completion_date: estimatedCompletionDate,
      image_url: imageUri,
    };
    try {
      await onSubmit(reportData);
      setTitle('');
      setDescription('');
      setLocation('');
      setCategory(categories[0]);
      setPriority(priorities[0]);
      setEstimatedCost('');
      setEstimatedCompletionDate('');
      setImageUri('');
      onClose();
    } catch (e) {
      setError('Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.title}>Submit a New Report</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Title*"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Description*"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Location*"
              value={location}
              onChangeText={setLocation}
            />
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerRow}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pickerOption, category === cat && styles.pickerSelected]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={category === cat ? styles.pickerSelectedText : styles.pickerText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.pickerRow}>
              {priorities.map((pri) => (
                <TouchableOpacity
                  key={pri}
                  style={[styles.pickerOption, priority === pri && styles.pickerSelected]}
                  onPress={() => setPriority(pri)}
                >
                  <Text style={priority === pri ? styles.pickerSelectedText : styles.pickerText}>{pri}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Button title="Pick Image" onPress={handlePickImage} />
              <Button title="Take Photo" onPress={handleTakePhoto} />
            </View>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={{ width: '100%', height: 180, borderRadius: 8, marginBottom: 12 }} resizeMode="cover" />
            ) : null}
            <View style={styles.buttonRow}>
              <Button title="Cancel" onPress={onClose} color="#6b7280" disabled={loading} />
              <Button title={loading ? "Submitting..." : "Submit"} onPress={handleSubmit} disabled={loading} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2563eb',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  label: {
    fontWeight: '500',
    marginBottom: 4,
    color: '#374151',
  },
  pickerRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  pickerOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  pickerSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  pickerText: {
    color: '#374151',
  },
  pickerSelectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default ReportForm; 