import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Cab {
    id: string;
    companyName: string;
    carModel: string;
    passengers: number;
    rating: number;
    costPerHour: number;
}

const CabItem = ({ cab, onPress }: { cab: Cab, onPress: () => void }) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.iconContainer}>
            <Ionicons name="car" size={30} color="#007AFF" />
        </View>
        <View style={styles.infoContainer}>
            <Text style={styles.companyName}>{cab.companyName}</Text>
            <Text style={styles.carModel}>{cab.carModel}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#007AFF" />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
    },
    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    carModel: {
        fontSize: 14,
        color: '#666',
    },
});

export default CabItem;