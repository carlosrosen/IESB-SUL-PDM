import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
import { colors } from "../constants/colors";

export default function DonutChart({ data, totalLabel = "Total", size = 200, strokeWidth = 30 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const halfSize = size / 2;
  const totalValue = data.reduce((acc, item) => acc + item.value, 0);
  let cumulativeValue = 0;

  return (
    <View style={{ marginTop: 10 ,marginBottom: 30, width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${halfSize}, ${halfSize}`}>
          {totalValue === 0 ? (
            <Circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke={colors.inactive}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
          ) : (
            data.map((slice, index) => {
              if (slice.value <= 0) return null;
              const slicePercentage = slice.value / totalValue;
              const strokeDashoffset = circumference - slicePercentage * circumference;
              const startAngle = (cumulativeValue / totalValue) * 360;
              cumulativeValue += slice.value;
              return (
                <Circle
                  key={index}
                  cx="50%"
                  cy="50%"
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  rotation={startAngle}
                  origin={`${halfSize}, ${halfSize}`}
                />
              );
            })
          )}
        </G>
      </Svg>
      <View style={styles.centerTextContainer}>
        <Text style={styles.centerLabel}>{totalLabel}</Text>
        <Text style={styles.centerValue}>
          {totalValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  centerLabel: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: "500",
  },
  centerValue: {
    fontSize: 18,
    color: colors.primaryText,
    fontWeight: "bold",
  },
});
