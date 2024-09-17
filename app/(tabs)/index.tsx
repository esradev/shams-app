import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

import axios from "axios";

const App = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get all categories from the WordPress REST API
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://shams-almaarif.com/wp-json/wp/v2/categories?per_page=100"
        );
        // Just get the categories that have posts
        const filteredCategories = response.data.filter(
          (category) => category.count > 0
        );
        setCategories(filteredCategories);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white p-4">
        <Text>Loading...</Text>
        <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white p-4">
        <Text>Error: {error.message}</Text>
        <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="flex truncate rounded-md border border-gray-200 bg-white p-4 mb-2"
      onPress={() => {}}
    >
      <Link
        href={`/category/${item.id}`}
        className="flex flex-col justify-between items-center content-center align-middle"
      >
        <Text className="flex font-bold text-xl text-gray-900 hover:text-gray-600">
          {item.name}{" "}
        </Text>
        <Text className="text-sm text-gray-500">{item.count} جلسه </Text>
      </Link>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 ibg-white">
      <View className="p-4 mb-12">
        <Text className="text-lg font-bold mb-4 text-center">
          دروس استاد آیت الله سید محمد رضا حسینی آملی (حفظه الله)
        </Text>
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
    </SafeAreaView>
  );
};

export default App;
