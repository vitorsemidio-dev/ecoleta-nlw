import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';

import api from '../../services/api';

Icon.loadFont();

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface Point {
  id: number;
  image: string;
  name: string;
  latitude: number;
  longitude: number;
}

const Point = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [seletedItems, setSeletedItems] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  const navigation = useNavigation();

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetail(id: number) {
    navigation.navigate('Detail', { point_id: id });
  }

  function handleSeletedItem(id: number) {
    const alreadySeleted = seletedItems.findIndex(item => item === id);

    if (alreadySeleted >= 0) {
      const filteredItems = seletedItems.filter(item => item !== id);
      setSeletedItems(filteredItems);
    } else {
      setSeletedItems([...seletedItems, id]);
    }
  }

  useEffect(() => {
    api.get('items').then(response => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Ops...!', 'Precisamos de sua permissão para obter a localização');
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setInitialPosition([latitude, longitude]);
    }


    loadPosition();
  }, []);

  useEffect(() => {
    api.get('points', {
      params: {
        city: 'Rio de Janeiro',
        uf: 'RJ',
        items: [6, 7],
      }
    }).then((response) => {
      setPoints(response.data);
    })
  }, []);

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb46" />
          {/* <Text>back</Text> */}
        </TouchableOpacity>

        <Text style={styles.title}>
          Bem vindo.
        </Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>

        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && (
            <MapView
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
              style={styles.map}>
                {points.map(point => (
                  <Marker
                    key={String(point.id)}
                    onPress={() => handleNavigateToDetail(point.id)}
                    style={styles.mapMarker}
                    coordinate={{
                      latitude: point.latitude,
                      longitude: point.longitude,
                    }}
                  >
                    <View style={styles.mapMarkerContainer}>
                      <Image 
                        style={styles.mapMarkerImage}
                        source={{
                          uri: point.image
                        }} 
                      />
                      <Text style={styles.mapMarkerTitle}>{point.name}</Text>

                    </View>
                  </Marker>
                ))}
              </MapView>
          )}
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >

          {items.map(({ id, image_url, title }) => (
            <TouchableOpacity
              key={String(id)}
              style={[
                styles.item,
                seletedItems.includes(id) ? styles.selectedItem : {},
              ]}
              onPress={() => handleSeletedItem(id)}
              activeOpacity={0.6}
            >
              <SvgUri width={42} height={42} uri={ image_url } />
              <Text style={styles.itemTitle}>{ title }</Text>
            </TouchableOpacity>
          ))}

        </ScrollView>


      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight,
  },

  title: {
    fontSize: 20,
    // fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#F0F0F5',
    fontSize: 16,
    marginTop: 4,
    // fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80, 
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    // fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
    textAlign: 'center',
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
  },

  item: {
    backgroundColor: '#83838e',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2,
    backgroundColor: '#eee',
  },

  itemTitle: {
    // fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default Point;