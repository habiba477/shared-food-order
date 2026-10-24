
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, radius, spacing, typography } from '../theme/theme';
import { formatPrice } from '../utils/format';
import AppButton from './AppButton';
import StatusBadge from './StatusBadge';

export default function FoodDetailsModal({
  item,
  restaurantAvailable = true,
  onClose,
  onAddToCart,
}) {
  const itemOrderable = Boolean(
    item && restaurantAvailable && item.isAvailable
  );

  return (
    <Modal
      visible={Boolean(item)}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
        accessibilityLabel="Close food details"
      >
        {/* Prevent taps inside the sheet from closing the modal. */}
        <Pressable
          style={styles.sheet}
          onPress={() => {}}
        >
          {item && (
            <View>
              <Text style={styles.category}>
                {item.category.toUpperCase()}
              </Text>

              <Text
                style={styles.name}
                accessibilityRole="header"
              >
                {item.name}
              </Text>

              <Text style={styles.price}>
                {formatPrice(item.price)}
              </Text>

              <View style={styles.badgeRow}>
                {restaurantAvailable ? (
                  <StatusBadge isAvailable={item.isAvailable} />
                ) : (
                  <Text style={styles.restaurantNote}>
                    Restaurant unavailable: this item can't be ordered right now.
                  </Text>
                )}
              </View>

              <Text style={styles.description}>
                {item.description}
              </Text>

              {itemOrderable && (
                <View style={styles.buttonSpacing}>
                  <AppButton
                    title="Add to cart"
                    onPress={() => onAddToCart?.(item)}
                  />
                </View>
              )}

              <View style={styles.buttonSpacing}>
                <AppButton
                  title="Close"
                  variant="secondary"
                  onPress={onClose}
                />
              </View>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    padding: spacing.lg,
    borderTopLeftRadius: radius.md + 6,
    borderTopRightRadius: radius.md + 6,
    backgroundColor: colors.surface,
  },
  category: {
    ...typography.eyebrow,
    color: colors.primary,
  },
  name: {
    ...typography.title,
    color: colors.text,
    marginTop: spacing.xs,
  },
  price: {
    ...typography.heading,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  badgeRow: {
    marginTop: spacing.sm,
  },
  restaurantNote: {
    ...typography.label,
    color: colors.danger,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    marginVertical: spacing.md,
  },
  buttonSpacing: {
    marginTop: spacing.sm,
  },
});
