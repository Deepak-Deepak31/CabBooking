import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { onValue, ref, update } from 'firebase/database';
import { database } from '@/config/initialize';

interface BookedCab {
  id: string;
  companyName: string;
  carModel: string;
  bookingTime: string;
  status: 'Active' | 'Completed' | 'Cancelled';
}

const BookedCabItem = ({ cab, onStateChange }: { cab: BookedCab; onStateChange: (cab: BookedCab) => void }) => (
  <TouchableOpacity style={styles.cabItem}>
    <View style={styles.cabIconContainer}>
      <Ionicons name="car" size={30} color="#4c669f" />
    </View>
    <View style={styles.cabDetails}>
      <Text style={styles.companyName}>{cab.companyName}</Text>
      <Text style={styles.carModel}>{cab.carModel}</Text>
      <Text style={styles.bookingTime}>Booked on: {new Date(cab.bookingTime).toLocaleString()}</Text>
    </View>
    <View style={[styles.statusBadge, { backgroundColor: cab.status === 'Active' ? '#4CAF50' : cab.status === 'Completed' ? '#FFC107' : '#F44336' }]}>
      <Text style={styles.statusText}>{cab.status}</Text>
    </View>
    <TouchableOpacity onPress={() => onStateChange(cab)}>
      <Ionicons name="ellipsis-vertical" size={24} color="#4c669f" />
    </TouchableOpacity>
  </TouchableOpacity>
);

const MyCabScreen = () => {
  const [bookedCabs, setBookedCabs] = useState<BookedCab[]>([]);

  // Function to change the state of a booked cab
  const changeCabState = (cab: BookedCab) => {
    Alert.alert(
      "Change Booking State",
      "Select the new state for this booking:",
      [
        {
          text: "Active",
          onPress: () => updateCabState(cab, 'Active'),
        },
        {
          text: "Completed",
          onPress: () => updateCabState(cab, 'Completed'),
        },
        {
          text: "Cancelled",
          onPress: () => updateCabState(cab, 'Cancelled'),
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  // Function to update the cab state in Firebase and local state
  const updateCabState = async (cab: BookedCab, newStatus: 'Active' | 'Completed' | 'Cancelled') => {
    console.log(`Attempting to update cab ${cab.id} status to ${newStatus}`);
    try {
      const cabRef = ref(database, `bookedCabs/${cab.id}`);

      await update(cabRef, { status: newStatus });
      console.log(`Successfully updated cab ${cab.id} status to ${newStatus} in database`);

      setBookedCabs(prevCabs =>
        prevCabs.map(c =>
          c.id === cab.id ? { ...c, status: newStatus } : c
        )
      );

      console.log(`Updated cab ${cab.id} status in local state`);
      Alert.alert("Success", `Booking status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating cab state:', error);
      Alert.alert("Error", "Failed to update booking status. Please try again.");
    }
  };

  useEffect(() => {
    const bookedCabsRef = ref(database, 'bookedCabs');
    const unsubscribe = onValue(bookedCabsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const cabsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        console.log(`BoOKED CABS :`, cabsArray);
        setBookedCabs(cabsArray);
      } else {
        setBookedCabs([]);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>My Booked Cabs</Text>
      </LinearGradient>
      {bookedCabs.length > 0 ? (
        <FlatList
          data={bookedCabs}
          renderItem={({ item }) => <BookedCabItem cab={item} onStateChange={changeCabState} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="car-outline" size={80} color="#ccc" />
          <Text style={styles.emptyStateText}>No cabs booked yet</Text>
          <Text style={styles.emptyStateSubText}>Your bookings will appear here</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F5',
  },
  headerGradient: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  listContainer: {
    padding: 15,
  },
  cabItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cabIconContainer: {
    backgroundColor: '#F0F0F5',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cabDetails: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  carModel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  bookingTime: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptyStateSubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  }
});

export default MyCabScreen;