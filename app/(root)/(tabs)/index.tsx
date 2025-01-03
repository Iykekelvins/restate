import {
	ActivityIndicator,
	FlatList,
	Image,
	Pressable,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppwrite } from '@/lib/useAppwrite';
import { getLatestProperties, getProperties } from '@/lib/appwrite';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, FeaturedCard } from '@/components/Cards';
import { useGlobalContext } from '@/lib/global-provider';

import icons from '@/constants/icons';
import Search from '@/components/Search';
import Filters from '@/components/Filters';
import NoResults from '@/components/NoResults';

export default function Index() {
	const { user } = useGlobalContext();
	const params = useLocalSearchParams<{ query?: string; filter?: string }>();

	const { data: latestProperties, loading: latestPropertiesLoading } = useAppwrite({
		fn: getLatestProperties,
	});

	const {
		data: properties,
		loading,
		refetch,
	} = useAppwrite({
		fn: getProperties,
		params: {
			query: params.query!,
			filter: params.filter!,
			limit: 6,
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
			limit: 6,
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
							<View className='flex flex-row items-center'>
								<Image
									source={{ uri: user?.avatar }}
									className='size-12 rounded-full'
								/>
								<View className='flex flex-col items-start ml-2 justify-center'>
									<Text className='text-xs font-rubik text-black-100'>
										Good Morning
									</Text>
									<Text className='text-base font-rubik-medium text-black-300'>
										{user?.name}
									</Text>
								</View>
							</View>

							<Image source={icons.bell} className='size-6' />
						</View>

						<Search />

						<View className='my-5'>
							<View className='flex flex-row items-center justify-between'>
								<Text className='text-xl font-rubik-bold text-black-300'>
									Featured
								</Text>
								<TouchableOpacity>
									<Text className='text-base font-rubik-bold text-primary-300'>
										See All
									</Text>
								</TouchableOpacity>
							</View>

							{latestPropertiesLoading ? (
								<ActivityIndicator className='text-primary-300 mt-5' size='large' />
							) : !latestProperties || latestProperties.length === 0 ? (
								<NoResults />
							) : (
								<FlatList
									data={latestProperties}
									renderItem={({ item }) => (
										<FeaturedCard
											item={item}
											onPress={() => handleCardPress(item.$id)}
										/>
									)}
									keyExtractor={(item) => item.$id.toString()}
									horizontal
									showsHorizontalScrollIndicator={false}
									contentContainerClassName='flex gap-5 mt-5'
									bounces={false}
								/>
							)}
						</View>

						<View className='my-5'>
							<View className='flex flex-row items-center justify-between'>
								<Text className='text-xl font-rubik-bold text-black-300'>
									Our Recommendations
								</Text>
								<TouchableOpacity>
									<Text className='text-base font-rubik-bold text-primary-300'>
										See All
									</Text>
								</TouchableOpacity>
							</View>
							<Filters />
						</View>
					</View>
				}
			/>
			<StatusBar />
		</SafeAreaView>
	);
}
