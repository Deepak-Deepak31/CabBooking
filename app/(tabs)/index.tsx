import { useState, useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, StatusBar, Text, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
// import { cabs } from '@/constants/data';
import CabItem from '@/components/CabItem';
import CabDetailModal from '@/components/CabDetailModal';
import { Ionicons } from '@expo/vector-icons';
import { equalTo, get, onValue, orderByChild, push, query, ref, set } from 'firebase/database';
import { database } from '@/config/initialize';

interface Cab {
  id: string;
  companyName: string;
  carModel: string;
  passengers: number;
  rating: number;
  costPerHour: number;
}

export default function HomeScreen() {
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [selectedCab, setSelectedCab] = useState(cabs[0] || {});
  const [modalVisible, setModalVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleCabPress = (cab: any) => {
    setSelectedCab(cab);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCab(cabs[0]);
  };

  const checkActiveBookings = async () => {
    const bookingsRef = ref(database, 'bookedCabs');
    const activeBookingsQuery = query(
      bookingsRef,
      orderByChild('status'),
      equalTo('Active')
    );

    const snapshot = await get(activeBookingsQuery);
    return snapshot.size || 0;
  };

  const handleBookCab = async () => {
    if (!selectedCab) return;

    try {
      const activeBookingsCount = await checkActiveBookings();

      if (activeBookingsCount >= 2) {
        Alert.alert(
          'Booking Limit Reached',
          'You can only have 2 active bookings at a time. Please cancel an existing booking to make a new one.'
        );
        return;
      }

      Alert.alert("Booking Confirmation", "Are you sure you want to book this cab?",
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Book',
            onPress: async () => {
              try {
                const bookingsRef = ref(database, 'bookedCabs');
                const newBookingRef = push(bookingsRef);

                const bookingData = {
                  cabId: selectedCab.id,
                  companyName: selectedCab.companyName,
                  carModel: selectedCab.carModel,
                  bookingTime: new Date().toISOString(),
                  status: 'Active'
                };

                await set(newBookingRef, bookingData);

                Alert.alert('Booking Successful', `You have booked ${selectedCab.companyName}`);
                handleCloseModal();

              } catch (error) {
                console.error('Error booking cab:', error);
                Alert.alert('Booking Failed', 'There was an error while booking the cab. Please try again.');
              }
            },
            style: 'default',
          },
        ],
      );
    } catch (error) {
      console.error('Error checking active bookings:', error);
      Alert.alert('Error', 'Unable to check current bookings. Please try again.');
    }
  };

  useEffect(() => {
    const cabsRef = ref(database, 'cabs');
    const unsubscribe = onValue(cabsRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Raw data from Firebase:', data);

      if (data) {
        const cabsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        console.log('Processed cabs array:', cabsArray);
        setCabs(cabsArray);
      } else {
        console.log('No data received from Firebase');
        setCabs([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('Cabs:', cabs);
  }, [cabs]);

  const renderCabItem = ({ item, index }: { item: any, index: number }) => {
    console.log('Rendering item:', item, 'at index:', index);
    if (!item) {
      console.log('Item is undefined at index:', index);
      return null;
    }

    return (
      <Animated.View
        style={{
          opacity: scrollY.interpolate({
            inputRange: [-1, 0, 100 * index, 100 * (index + 2)],
            outputRange: [1, 1, 1, 0],
          }),
          transform: [{
            scale: scrollY.interpolate({
              inputRange: [-1, 0, 100 * index, 100 * (index + 1)],
              outputRange: [1, 1, 1, 0.8],
            }),
          }],
        }}
      >
        <CabItem
          cab={item}
          onPress={() => handleCabPress(item)}
        />
      </Animated.View>
    );
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 100],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={StyleSheet.absoluteFill}
        />
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        <Animated.Text style={[styles.title, {
          fontSize: scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [32, 24],
            extrapolate: 'clamp',
          }),
        }]}>
          Available Cabs
        </Animated.Text>
        <Ionicons name="car" size={32} color="white" style={styles.icon} />
      </Animated.View>
      {
        Array.isArray(cabs) && cabs.length > 0 ?
          <Animated.FlatList
            data={cabs}
            renderItem={renderCabItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          /> : <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={80} color="#ccc" />
            <Text style={styles.emptyStateText}>No cabs available</Text>
            <Text style={styles.emptyStateSubText}>Please check back later</Text>
          </View>
      }
      {selectedCab && (
        <CabDetailModal
          cab={selectedCab}
          visible={modalVisible}
          onClose={handleCloseModal}
          onBook={handleBookCab}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F5',
  },
  header: {
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  title: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  icon: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  listContent: {
    padding: 15,
    paddingTop: 10,
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
  },
});