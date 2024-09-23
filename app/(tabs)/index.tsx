import React, { useEffect, useState } from "react";
import { Text, FlatList, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import axios from "axios";
import LoadingSpinner from "@/components/LoadingSpinner";
import PostCard from "@/components/PostCard";
import { Href } from "expo-router";

const App = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get all categories from the WordPress REST API
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://shams-almaarif.com/wp-json/wp/v2/categories?per_page=100"
        );
        // Just get the categories that have posts and is the child and not have children
        const filteredCategories = response.data.filter(
          (category: { count: number; parent: number; id: number }) =>
            category.count > 0 && category.parent !== 0
        );

        setCategories(filteredCategories);
      } catch (err) {
        setError(err as any);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white p-4">
        <LoadingSpinner />
        <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-red-500 text-lg font-bold text-center mb-4 w-full">
          Error: {error?.message}
        </Text>
        <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
      </SafeAreaView>
    );
  }

  const renderItem = ({
    item,
  }: {
    item: { id: number; name: string; count: number };
  }) => (
    <PostCard
      key={item.id}
      href={`/category/${item.id}` as Href<string | { id: number }>}
      title={`${item.name} `}
      desc={`${item.count} جلسه `}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
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
