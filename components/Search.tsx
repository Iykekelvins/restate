import { useState } from 'react';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';

import icons from '@/constants/icons';

const Search = () => {
	const path = usePathname();
	const params = useLocalSearchParams<{ query?: string }>();
	const [search, setSearch] = useState(params.query);

	const debouncedSearch = useDebouncedCallback(
		(value: string) => router.setParams({ query: value }),
		500
	);

	const handleSearch = (value: string) => {
		setSearch(value);
		debouncedSearch(value);
	};

	return (
		<View className='flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2'>
			<View className='flex-1 flex flex-row items-center justify-start z-50'>
				<Image source={icons.search} className='size-5' />
				<TextInput
					value={search}
					onChangeText={handleSearch}
					placeholder='Search for anything'
					className='text-sm font-rubik text-black-300 ml-2 w-full'
					placeholderTextColor='#666876'
				/>
			</View>

			<TouchableOpacity>
				<Image source={icons.filter} className='size-5' />
			</TouchableOpacity>
		</View>
	);
};

export default Search;
