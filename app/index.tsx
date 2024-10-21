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

  const getAnimeList = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://api.jikan.moe/v4/anime`);
      const { data } = await response.json();
      setAnimeList(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAnimeList();
  }, []);

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size={50} color="#000ff" />
      ) : (
        <>
          <FlatList
            data={animeList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  router.navigate(`/anime/${item.mal_id}`);
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
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
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text style={{ overflow: "scroll" }}>
                      genre : {item.genres.map((e) => e.name).join(", ")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => `${item.mal_id}`}
          />
        </>
      )}
    </View>
  );
}
