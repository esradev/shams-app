import { View } from "react-native";

const PostCardLoading = ({ count }: { count: any[] }) => {
  return (
    <View className="animate-pulse flex gap-4 flex-col my-4">
      {count.map((_: any, index: number) => (
        <View
          key={index}
          className="flex truncate rounded-md border border-gray-200 bg-white p-4"
        >
          <View className="flex font-bold text-xl bg-gray-300 w-full h-6"></View>
          <View className="bg-gray-300 w-1/2 h-4 mt-2"></View>
        </View>
      ))}
    </View>
  );
};

export default PostCardLoading;
