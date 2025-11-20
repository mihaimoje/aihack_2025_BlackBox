import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { RadarChart } from '@salmonco/react-native-radar-chart';

export default function ExploreStatsScreen() {
  const data = [
    { label: 'Strength', value: 0 },
    { label: 'Intelligence', value: 0 },
    { label: 'Health', value: 0 },
    { label: 'Charisma', value: 0 },
    { label: 'Creativity', value: 0 },
  ];

  const size = 385;       // chart size
  const iconSize = 36;
  const radiusOffset = 26;

  const getIconSource = (label: string) => {
    switch (label) {
      case 'Strength':
        return require('../../assets/images/strength.png');
      case 'Intelligence':
        return require('../../assets/images/intelligence.png');
      case 'Health':
        return require('../../assets/images/health.png');
      case 'Charisma':
        return require('../../assets/images/charisma.png');
      case 'Creativity':
        return require('../../assets/images/creativity.png');
      default:
        return require('../../assets/images/strength.png');
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.chartWrapper, { width: size, height: size }]}>
        <RadarChart
          data={data}
          maxValue={10}
          size={size}
          scale={1}

          // only draw the web lines, no solid pie fill
          fillColor="#013220"
          fillOpacity={0} // ⬅️ make background of chart transparent over your dark green

          // concentric rings (web circles)
          stroke={['#1c5a37', '#1c5a37', '#1c5a37', '#1c5a37', '#1c5a37']}
          strokeWidth={[1.5, 1.5, 1.5, 1.5, 1.8]}  // ⬅️ thicker web lines
          strokeOpacity={[1, 1, 1, 1, 1]}

          // labels – we hide them because you have icons
          labelColor="transparent"
          labelSize={0}
          labelFontFamily="System"
          labelDistance={1.1}

          // data polygon (currently collapsed to center because value=0)
          dataFillColor="#00FFAA"
          dataFillOpacity={0}        // ⬅️ no filled polygon for now
          dataStroke="#00FFAA"
          dataStrokeWidth={2}
          dataStrokeOpacity={1}

          // radial division lines between stats
          divisionStroke="#1c5a37"
          divisionStrokeWidth={1.5}
          divisionStrokeOpacity={1}

          isCircle
        />

        {/* Icons around the chart */}
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
              ]}
            >
              <Image
                source={getIconSource(item.label)}
                style={{
                  width: iconSize,
                  height: iconSize,
                  resizeMode: 'contain',
                  tintColor: '#fff',
                }}
              />
            </View>
          );
        })}
      </View>

      {/* Icons row below chart */}
      <View style={styles.iconsRow}>
        {data.map(item => (
          <View key={item.label} style={styles.iconBlock}>
            <Image
              source={getIconSource(item.label)}
              style={{
                width: iconSize,
                height: iconSize,
                resizeMode: 'contain',
                tintColor: '#fff',
              }}
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
    alignItems: 'center',
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
