
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, CloudRain, CloudSnow, Sun, Droplet, Wind, Thermometer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
}

const mockWeatherData: WeatherData = {
  location: 'New York',
  temperature: 22,
  condition: 'Sunny',
  humidity: 45,
  windSpeed: 12,
  icon: 'sunny'
};

const WeatherWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch from a weather API here
    const fetchWeather = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Use mock data for demo
        setWeatherData(mockWeatherData);
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sunny':
        return <Sun className="h-12 w-12 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-12 w-12 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="h-12 w-12 text-blue-400" />;
      case 'snowy':
        return <CloudSnow className="h-12 w-12 text-blue-200" />;
      default:
        return <Sun className="h-12 w-12 text-yellow-500" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium">Weather</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-4 w-20" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ) : weatherData ? (
          <div>
            <h3 className="text-lg font-semibold mb-2">{weatherData.location}</h3>
            <div className="flex justify-between items-center mb-2">
              {getWeatherIcon(weatherData.icon)}
              <div className="text-3xl font-bold">{weatherData.temperature}°</div>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{weatherData.condition}</p>
            <div className="flex justify-between text-sm pt-2 border-t">
              <div className="flex items-center">
                <Droplet className="h-4 w-4 mr-1" />
                <span>{weatherData.humidity}%</span>
              </div>
              <div className="flex items-center">
                <Wind className="h-4 w-4 mr-1" />
                <span>{weatherData.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Could not load weather data
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
