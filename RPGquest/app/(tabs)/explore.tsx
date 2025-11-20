import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { RadarChart } from '@salmonco/react-native-radar-chart';

export default function ExploreStatsScreen() {
  const data = [
    { label: "Strength", value: 0 },
    { label: "Intelligence", value: 0 },
    { label: "Health", value: 0 },
    { label: "Charisma", value: 0 },
    { label: "Creativity", value: 0 },
  ];

  const size = 385;                
  const iconSize = 36;            
  const radiusOffset = 22;         

  const getIconSource = (label: string) => {
    switch (label) {
      case 'Strength': return require('../../assets/images/strength.png');
      case 'Intelligence': return require('../../assets/images/intelligence.png');
      case 'Health': return require('../../assets/images/health.png');
      case 'Charisma': return require('../../assets/images/charisma.png');
      case 'Creativity': return require('../../assets/images/creativity.png');
      default: return require('../../assets/images/strength.png');
    }
  };

  return (
    <View style={styles.container}>
     
      <View style={[styles.chartWrapper, { width: size, height: size }]}>
        <RadarChart
          data={data}
          maxValue={10}
          size={size}

          /* remove title */
          labelColor="transparent"
          labelSize={0}

          
          dataFillColor="#013220"    // fill color -> dark green (same as background)
          dataFillOpacity={1}
          fillColor="#013220"
          fillOpacity={1}

          dataStroke="#00FFAA"
          dataStrokeWidth={2}

       
          showArea={true}
          showPoints={false}
          pointRadius={0}
          showDots={false}
          dotRadius={0}
          pointColor="transparent"
          dotColor="transparent"
          renderPoint={() => null}
          renderDot={() => null}

          /* tooverride red */
          style={{ backgroundColor: 'transparent' }}
          chartBackgroundColor="#013220"
          backgroundColor="#013220"
          gridColor="#013220"
          gridLabelColor="transparent"
          showGrid={false}

          
          options={{
            backgroundColor: '#013220',
            grid: { color: '#013220'
              
             },
            showDots: false,
            showGrid: false,
            fillColor: '#013220',
            fillOpacity: 1,
          }}
        />

        {/*icons on chart    */}
        {data.map((item, index) => {

          const angle = (index / data.length) * (Math.PI * 2) - Math.PI / 2;
          const radius = size / 2 - radiusOffset;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <View
              key={item.label}
              style={[
                styles.iconContainer,
                {
                  left: size / 2 + x - iconSize / 2,
                  top: size / 2 + y - iconSize / 2,
                  width: iconSize,
                  height: iconSize,
                },
              ]}>
              <Image
                source={getIconSource(item.label)}
                style={{ width: iconSize, height: iconSize, resizeMode: 'contain', tintColor: '#fff' }} // added tintColor
              />
            </View>
          );
        })}
      </View>

      {}
      <View style={styles.iconsRow}>
        {data.map(item => (
          <View key={item.label} style={styles.iconBlock}>
            <Image
              source={getIconSource(item.label)}
              style={{ width: iconSize, height: iconSize, resizeMode: 'contain', tintColor: '#fff' }} // added tintColor
            />
            <Text style={styles.iconLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#013220', 
    alignItems: 'center',        // horizontally
    justifyContent: 'center',   
    paddingVertical: 20,
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12, 
  },
  iconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconsRow: {
    marginTop: 36, 
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  iconBlock: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 6,
  },
  iconLabel: {
    fontSize: 10,
    color: 'white',
    marginTop: 4,
    textAlign: 'center',
  },
});