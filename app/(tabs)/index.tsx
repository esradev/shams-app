import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, FlatList, StatusBar } from "react-native";
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
        setCategories(response.data);
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
      className="bg-amber-50 rounded-sm my-2 p-4 items-center flex flex-col columns-2"
      onPress={() => {}}
    >
      <Link href={`/category/${item.id}`} className="text-base">
        {item.name}
      </Link>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white p-4">
      <Text className="text-lg font-bold mb-4 text-center">
        دروس استاد آیت الله سید محمد رضا حسینی آملی (حفظه الله)
      </Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />
      <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
    </SafeAreaView>
  );
};

export default App;
