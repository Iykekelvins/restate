import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const PropertyDetails = () => {
	const { id } = useLocalSearchParams();
	return (
		<View>
			<Text>PropertyDetails {id}</Text>
		</View>
	);
};

export default PropertyDetails;
