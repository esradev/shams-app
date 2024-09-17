import React, { useEffect, useState } from "react";
import {
  Text,
  StatusBar,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

const CategoryPosts = () => {
  const { id } = useLocalSearchParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    // Fetch category details
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `https://shams-almaarif.com/wp-json/wp/v2/categories/${id}`
        );
        setCategory(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // Fetch posts and set the total number of pages
  const fetchPosts = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        `https://shams-almaarif.com/wp-json/wp/v2/posts?categories=${id}&page=${page}&per_page=10&orderby=date&order=asc`
      );
      setPosts(response.data);
      setTotalPages(Number(response.headers["x-wp-totalpages"])); // Capture total pages
    } catch (err) {
      setError(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [id, page]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text>Loading...</Text>
        <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text>Error: {error.message}</Text>
        <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
      </SafeAreaView>
    );
  }

  // Render pagination links
  const renderPaginationLinks = () => {
    const links = [];
    for (let i = 1; i <= totalPages; i++) {
      links.push(
        <TouchableOpacity
          key={i}
          className={`rounded-sm ${
            page === i ? "bg-green-500" : "bg-gray-200"
          } p-2 mx-2 mb-6`}
          onPress={() => setPage(i)} // Set page when link is clicked
        >
          <Text
            className={`text-lg font-bold text-center ${
              page === i ? "text-white" : "text-black"
            }`}
            style={{ color: page === i ? "#fff" : "#000" }}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    return <View className="flex flex-row justify-center mt-4">{links}</View>;
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <View>
          <Text className="text-2xl font-bold">{category?.name}</Text>
          <Text className="text-lg">{category?.description}</Text>

          {isFetching ? (
            // Show skeletons when posts are loading
            <Text>Loading...</Text>
          ) : (
            <View className="flex gap-4 flex-col my-4">
              {posts.map((post) => (
                <View
                  key={post.id}
                  className="flex truncate rounded-md border border-gray-200 bg-white p-4"
                >
                  <Link href={`/posts/${post.id}`}>
                    <Text className="flex font-bold text-xl text-gray-900 hover:text-gray-600">
                      {post.title.rendered}
                    </Text>
                  </Link>
                  {post?.meta["date-of-the-lesson"] && (
                    <Text className="text-sm text-gray-500">
                      {post?.meta["date-of-the-lesson"]}
                    </Text>
                  )}
                </View>
              ))}

              {renderPaginationLinks()}
            </View>
          )}
        </View>
      </ScrollView>

      <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
    </SafeAreaView>
  );
};

export default CategoryPosts;
