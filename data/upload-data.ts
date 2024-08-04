import { ref, set } from 'firebase/database';
import { database } from '@/config/initialize';

import { cabs, bookedCabs } from '@/constants/data';

export const uploadData = async () => {
    try {
        // Upload cabs data
        await set(ref(database, 'cabs'), cabs);
        console.log('Cabs data uploaded successfully');

        // Upload bookedCabs data
        await set(ref(database, 'bookedCabs'), bookedCabs);
        console.log('Booked cabs data uploaded successfully');
    } catch (error) {
        console.error('Error uploading data:', error);
    }
};