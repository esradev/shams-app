import React, { useEffect, useState } from "react";
import { Text, View, StatusBar } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

const CategoryPosts = () => {
  const { id } = useLocalSearchParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Get category details and posts from the WordPress REST API
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `https://shams-almaarif.com/wp-json/wp/v2/categories/${id}`
        );
        setCategory(response.data);
      } catch (err) {
        setError(err as any);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();

    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `https://shams-almaarif.com/wp-json/wp/v2/posts?categories=${id}`
        );
        setPosts(response.data);
      } catch (err) {
        setError(err as any);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [id]);

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

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold">{category?.name}</Text>
      <Text className="text-lg">{category?.description}</Text>
      {posts.map((post) => (
        <Text key={post.id} className="text-base">
          {post.title.rendered}
        </Text>
      ))}
      <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
    </SafeAreaView>
  );
};

export default CategoryPosts;
