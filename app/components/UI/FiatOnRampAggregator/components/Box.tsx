import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { colors } from '../../../../styles/common';
import CustomText from '../../../Base/Text';
// TODO: Convert into typescript and correctly type optionals
const Text = CustomText as any;

const styles = StyleSheet.create({
	wrapper: {
		padding: 16,
		borderWidth: 1.5,
		borderColor: colors.grey100,
		borderRadius: 8,
	},
	label: {
		marginVertical: 8,
	},
	highlighted: {
		borderColor: colors.blue,
	},
});

interface Props {
	highlighted?: boolean;
	label?: string;
	style?: StyleProp<ViewStyle>;
	onPress?: () => any;
}

const Box: React.FC<Props> = ({ highlighted, label, style, onPress, ...props }: Props) => (
	<>
		{Boolean(label) && (
			<Text black style={styles.label}>
				{label}
			</Text>
		)}
		<TouchableOpacity disabled={!onPress} onPress={onPress}>
			<View style={[styles.wrapper, highlighted && styles.highlighted, style]} {...props} />
		</TouchableOpacity>
	</>
);

export default Box;
