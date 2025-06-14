import React, {useEffect, useState} from 'react';
import {View, Text, Alert, SafeAreaView, StyleSheet, ActivityIndicator, ScrollView, RefreshControl} from 'react-native';
import * as Location from 'expo-location';

const openWeatherKey = '53450d75bf80d360e99fbe8398854588';

const Weather = () => {
    const [forecast, setForecast] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadForecast = async () => {
        setRefreshing(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            setRefreshing(false);
            return;
        }

        let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
        let url = `https://api.openweathermap.org/data/2.5/onecall?units=metric&exclude=minutely,hourly,alerts&lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${openWeatherKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok){
            Alert.alert('Error', 'Failed to fetch weather data');
        } else {
            setForecast(data);
        }
        setRefreshing(false);
    };

    useEffect(() => {
        loadForecast();
    }, []);

    if(!forecast) {
        return (
            <SafeAreaView style={styles.loading}>
                <ActivityIndicator size='large' />
            </SafeAreaView>
        );
    }

    // Example: const current = forecast.current.weather[0];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={loadForecast}
                    />
                }
                style={{marginTop: 50}}
            >   
                <Text style={styles.title}>
                    Current Weather
                </Text>
                <Text style={{alignItems: 'center', textAlign: 'center'}}>
                    Your Location
                </Text>
                <View>
                    <Text style={styles.text}></Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Weather;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
});