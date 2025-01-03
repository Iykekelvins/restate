import {
	ActivityIndicator,
	FlatList,
	Image,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppwrite } from '@/lib/useAppwrite';
import { getProperties } from '@/lib/appwrite';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Cards';

import icons from '@/constants/icons';
import Search from '@/components/Search';
import Filters from '@/components/Filters';
import NoResults from '@/components/NoResults';

export default function Explore() {
	const params = useLocalSearchParams<{ query?: string; filter?: string }>();

	const {
		data: properties,
		loading,
		refetch,
	} = useAppwrite({
		fn: getProperties,
		params: {
			query: params.query!,
			filter: params.filter!,
			limit: 20,
		},
		skip: true,
	});

	const handleCardPress = (id: string) =>
		router.push({
			pathname: '/properties/[id]',
			params: { id },
		});

	useEffect(() => {
		refetch({
			query: params.query!,
			filter: params?.query ? '' : params.filter!,
			limit: 20,
		});
	}, [params.filter, params.query]);

	return (
		<SafeAreaView className='bg-white h-full'>
			<FlatList
				data={properties}
				renderItem={({ item }) => (
					<Card item={item} onPress={() => handleCardPress(item.$id)} />
				)}
				keyExtractor={(item) => item.$id.toString()}
				numColumns={2}
				contentContainerClassName='pb-32'
				columnWrapperClassName='flex gap-5 px-5'
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					loading ? (
						<ActivityIndicator className='text-primary-300 mt-5' size='large' />
					) : (
						<NoResults />
					)
				}
				ListHeaderComponent={
					<View className='px-5'>
						<View className='flex flex-row items-center justify-between mt-5'>
							<TouchableOpacity
								className='flex flex-row items-center justify-center bg-primary-200 rounded-full size-11'
								onPress={() => router.back()}>
								<Image source={icons.backArrow} className='size-5' />
							</TouchableOpacity>

							<Text className='text-base mr-2 text-center font-rubik-medium text-black-300'>
								Search for Your Ideal Home
							</Text>

							<Image source={icons.bell} className='w-6 h-6' />
						</View>
						<Search />

						<View className='mt-5'>
							<Filters />

							<Text className='text-xl font-rubik-bold text-black-300 mt-5'>
								Found {properties?.length}{' '}
								{`${
									properties?.length === 0 || properties?.length! > 1
										? 'Properties'
										: 'Property'
								}`}
							</Text>
						</View>
					</View>
				}
			/>
			<StatusBar />
		</SafeAreaView>
	);
}
