import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CabDetailModal = ({ cab, visible, onClose, onBook }: { cab: any, visible: boolean, onClose: () => void, onBook: () => void }) => {
    const [animation] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        Animated.timing(animation, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [SCREEN_WIDTH, 0],
    });

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <BlurView intensity={20} style={StyleSheet.absoluteFill} />
            <View style={styles.centeredView}>
                <Animated.View style={[styles.modalView, { transform: [{ translateY }] }]}>
                    <LinearGradient
                        colors={['#4c669f', '#3b5998', '#192f6a']}
                        style={styles.headerGradient}
                    >
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                        <View style={styles.header}>
                            <Ionicons name="car" size={50} color="#fff" />
                            <Text style={styles.companyName}>{cab.companyName}</Text>
                        </View>
                    </LinearGradient>
                    <View style={styles.detailsContainer}>
                        <DetailItem icon="car-sport" label="Car Model" value={cab.carModel} />
                        <DetailItem icon="people" label="Passengers" value={cab.passengers} />
                        <DetailItem icon="star" label="Rating" value={cab.rating} />
                        <DetailItem icon="cash" label="Cost/Hour" value={`$${cab.costPerHour}`} />
                    </View>
                    <TouchableOpacity style={styles.bookButton} onPress={onBook}>
                        <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const DetailItem = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
    <View style={styles.detailItem}>
        <View style={styles.iconContainer}>
            <Ionicons name={icon} size={24} color="#4c669f" />
        </View>
        <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '100%',
        maxHeight: '80%',
    },
    headerGradient: {
        width: '100%',
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        zIndex: 1,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    companyName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
    },
    detailsContainer: {
        width: '100%',
        padding: 20,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        padding: 10,
        marginRight: 15,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    bookButton: {
        backgroundColor: '#4c669f',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bookButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CabDetailModal;