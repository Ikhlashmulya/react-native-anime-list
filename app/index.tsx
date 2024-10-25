import { useThemeColor } from "@/hooks/useThemeColor";
import { AnimeDto } from "@/type/anime-dto";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function index() {
  const [animeList, setAnimeList] = useState<AnimeDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const bgColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const getAnimeList = async () => {
    if (!hasMore) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?page=${page}`
      );
      const json = await response.json();
      setHasMore(json.pagination.has_next_page);
      setAnimeList((prevData) => [...prevData, ...json.data]);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onEndReached = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    getAnimeList();
  }, [page]);

  return (
    <View>
      <FlatList
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator
              style={{ marginTop: 20 }}
              size={50}
              color="#000ff"
            />
          ) : (
            <></>
          )
        }
        data={animeList}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              router.navigate(`/anime/${item.mal_id}`);
            }}
          >
            <View
              style={{
                backgroundColor: bgColor,
                flexDirection: "row",
                gap: 10,
                padding: 10,
                flex: 1,
              }}
            >
              <Image
                source={item.images["jpg"].image_url}
                style={{ width: 70, height: 100 }}
                contentFit="cover"
              />
              <View style={{ width: "100%", paddingEnd: 100 }}>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    flexWrap: "wrap",
                    color: textColor,
                  }}
                >
                  {item.title}
                </Text>
                <Text style={{ color: textColor }}>
                  genre : {item.genres.map((e) => e.name).join(", ")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => `${item.mal_id}`}
      />
    </View>
  );
}
