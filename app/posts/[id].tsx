import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderHTML from "react-native-render-html";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Audio } from "expo-av";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";
import * as FileSystem from "expo-file-system";

interface ErrorType {
  message: string;
}

interface PostType {
  title: { rendered: string };
  content: { rendered: string };
  meta: { "the-audio-of-the-lesson": string };
}

const PostDetail = () => {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorType | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fileUri, setFileUri] = useState<string | null>(null);

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

  useEffect(() => {
    const loadSound = async () => {
      if (fileUri) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: fileUri },
          { shouldPlay: false }
        );
        setSound(sound);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setCurrentTime(status.positionMillis);
            setDuration(status.durationMillis || 0);
          }
        });
      } else if (post?.meta["the-audio-of-the-lesson"]) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: post.meta["the-audio-of-the-lesson"] },
          { shouldPlay: false }
        );
        setSound(sound);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setCurrentTime(status.positionMillis);
            setDuration(status.durationMillis || 0);
          }
        });
      }
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [post, fileUri]);

  useEffect(() => {
    const checkFileExists = async () => {
      const directoryUri = FileSystem.documentDirectory + "shams_app/";
      const fileUri = directoryUri + `${id}.mp3`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        setFileUri(fileUri);
      }
    };

    checkFileExists();
  }, [id]);

  const handleDownload = async () => {
    if (post?.meta["the-audio-of-the-lesson"]) {
      const uri = post.meta["the-audio-of-the-lesson"];
      const directoryUri = FileSystem.documentDirectory + "shams_app/";
      const fileUri = directoryUri + `${id}.mp3`;

      try {
        // Ensure the directory exists
        const dirInfo = await FileSystem.getInfoAsync(directoryUri);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(directoryUri, {
            intermediates: true,
          });
        }

        // Download the file
        const { uri: downloadedUri } = await FileSystem.downloadAsync(
          uri,
          fileUri
        );
        console.log(`File downloaded to: ${downloadedUri}`);

        // Verify the file exists
        const fileInfo = await FileSystem.getInfoAsync(downloadedUri);
        if (fileInfo.exists) {
          setFileUri(downloadedUri);
          Alert.alert(
            "Download complete",
            `File downloaded to ${downloadedUri}`
          );
        } else {
          Alert.alert("Download failed", "File does not exist after download.");
        }
      } catch (error) {
        console.error("Download error:", error);
        Alert.alert(
          "Download failed",
          "An error occurred while downloading the file."
        );
      }
    }
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const handleForward = async () => {
    if (sound) {
      const newPosition = currentTime + 30000; // Forward 30 seconds
      await sound.setPositionAsync(newPosition);
    }
  };

  const handleBackward = async () => {
    if (sound) {
      const newPosition = currentTime - 30000; // Backward 30 seconds
      await sound.setPositionAsync(newPosition);
    }
  };

  const formatTime = (timeMillis: number) => {
    const totalSeconds = timeMillis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          padding: 16,
        }}
      >
        <LoadingSpinner />
        <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          padding: 16,
        }}
      >
        <Text
          style={{
            color: "red",
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 16,
            width: "100%",
          }}
        >
          Error: {error?.message}
        </Text>
        <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold">{post?.title.rendered}</Text>
        <RenderHTML
          contentWidth={400} // Adjust contentWidth based on your layout
          source={{
            html:
              post?.content.rendered ||
              `<h2>متأسفانه هنوز متن این جلسه کامل نشده است.</h2>`,
          }}
          baseStyle={{
            fontSize: 18,
            lineHeight: 26,
            color: "#333",
          }}
        />
        <StatusBar barStyle="dark-content" backgroundColor="#16a34a" />
      </ScrollView>

      {post?.meta["the-audio-of-the-lesson"] && (
        <View className="absolute bottom-0 w-full bg-gray-100 p-4 border-t border-gray-300">
          <View className="flex flex-row justify-around mb-2">
            <TouchableOpacity onPress={handleBackward}>
              <MaterialIcons name="replay-30" size={30} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePlayPause}>
              {isPlaying ? (
                <MaterialIcons
                  name="pause-circle-outline"
                  size={30}
                  color="black"
                />
              ) : (
                <MaterialIcons
                  name="play-circle-outline"
                  size={30}
                  color="black"
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForward}>
              <MaterialIcons name="forward-30" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDownload}>
              <MaterialIcons name="downloading" size={30} color="black" />
            </TouchableOpacity>
          </View>

          <View className="flex flex-row items-center justify-between mb-2">
            <Text>{formatTime(currentTime)}</Text>
            <Slider
              style={{ flex: 1, marginHorizontal: 8 }}
              minimumValue={0}
              maximumValue={duration}
              value={currentTime}
              onValueChange={handleSeek}
              minimumTrackTintColor="#16a34a"
              maximumTrackTintColor="gray"
              thumbTintColor="#16a34a"
            />
            <Text>{formatTime(duration)}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default PostDetail;
