import React, { useEffect, useState } from "react";
import { Text, StatusBar, ScrollView, View } from "react-native";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

import Pagination from "../../components/Pagination";
import LoadingSpinner from "@/components/LoadingSpinner";
import PostCardLoading from "@/components/PostCardLoading";

interface ErrorType {
  message: string;
}

interface CategoryType {
  name: string;
  description: string;
}

interface PostType {
  id: number;
  title: { rendered: string };
  meta: { "date-of-the-lesson"?: string };
}

const CategoryPosts = () => {
  const { id } = useLocalSearchParams();
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorType | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);
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
        setError(err as any);
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
        `https://shams-almaarif.com/wp-json/wp/v2/posts?categories=${id}&page=${page}&per_page=20&orderby=date&order=asc`
      );
      setPosts(response.data);
      setTotalPages(Number(response.headers["x-wp-totalpages"])); // Capture total pages
    } catch (err) {
      setError(err as any);
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
        <LoadingSpinner />
        <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500 text-lg font-bold text-center mb-4 w-full">
          Error: {error?.message}
        </Text>
        <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <View>
          <Text className="text-2xl font-bold">{category?.name}</Text>
          <Text className="text-lg">{category?.description}</Text>

          {isFetching ? (
            <PostCardLoading count={[1, 2, 3, 4, 5, 6, 7, 8, 9]} />
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

              {Pagination({ page, setPage, totalPages })}
            </View>
          )}
        </View>
      </ScrollView>

      <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
    </SafeAreaView>
  );
};

export default CategoryPosts;
