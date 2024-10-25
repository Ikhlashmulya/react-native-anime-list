import { useThemeColor } from "@/hooks/useThemeColor";
import { AnimeDto } from "@/type/anime-dto";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Anime() {
  const { id } = useLocalSearchParams();
  const [anime, setAnime] = useState<AnimeDto | undefined>(undefined);
  const textColor = useThemeColor({}, "text");

  const getAnime = async () => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
      const { data } = await response.json();
      setAnime(data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    } finally {
    }
  };

  useEffect(() => {
    getAnime();
  }, []);

  return (
    <>
      {anime ? (
        <ScrollView>
          <View
            style={{
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Image
              source={anime.images["jpg"].image_url}
              style={{ width: 160, height: 240 }}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                marginVertical: 10,
                color: textColor,
              }}
            >
              {anime.title}
            </Text>
          </View>
          <View style={{ padding: 10 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                width: "100%",
                borderBottomWidth: 1,
                borderBottomColor: textColor,
                marginBottom: 15,
                color: textColor,
              }}
            >
              Synopsis
            </Text>
            <Text style={{ color: textColor }}>{anime.synopsis}</Text>
          </View>
        </ScrollView>
      ) : (
        <ActivityIndicator style={{ marginTop: 20 }} size={50} color="#000ff" />
      )}
    </>
  );
}
