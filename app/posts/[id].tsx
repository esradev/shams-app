import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StatusBar,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderHTML from "react-native-render-html";

const PostDetail = () => {
  const { width } = useWindowDimensions();

  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `https://shams-almaarif.com/wp-json/wp/v2/posts/${id}`
        );
        setPost(response.data);
      } catch (err) {
        setError(err as any);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4 mb-8">
        {/*  Show breadcrumbs */}
        <View className="flex border-b border-gray-200 bg-white">
          <View className="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8 flex-row">
            <View className="flex">
              <View className="flex items-center">
                <Link href={`/`} className="text-gray-400 hover:text-gray-500">
                  <Text className="sr-only">صفحه اصلی</Text>
                </Link>
              </View>
            </View>
            {/*  @todo: Add categories here*/}
            <View className="flex">
              <View className="flex items-center">
                <Text>{post?.title.rendered}</Text>
              </View>
            </View>
          </View>
        </View>
        <Text className="text-2xl font-bold">{post?.title.rendered}</Text>
        <RenderHTML
          contentWidth={width}
          source={{ html: post?.content.rendered }}
          baseStyle={{ fontSize: 16, lineHeight: 24, color: "#333" }}
        />
        <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostDetail;
