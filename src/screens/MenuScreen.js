
import { useState } from 'react';
import {
  Alert,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import EmptyState from '../components/EmptyState';
import FoodDetailsModal from '../components/FoodDetailsModal';
import FormMessage from '../components/FormMessage';
import MenuItemRow from '../components/MenuItemRow';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';

import {
  getMenuSections,
  getProviderById,
} from '../repositories/restaurantRepository';
import { colors, spacing, typography } from '../theme/theme';

export default function MenuScreen({
  providerId,
  onBack,
  onAddToCart,
  onViewCart,
}) {
  const [selectedItem, setSelectedItem] = useState(null);

  const provider = getProviderById(providerId);
  const sections = getMenuSections(providerId);
  const restaurantAvailable = provider ? provider.isAvailable : true;

  const handleAddToCart = (item) => {
    if (!restaurantAvailable || !item.isAvailable) {
      Alert.alert(
        'Item unavailable',
        'This item cannot be ordered right now.'
      );
      return;
    }

    onAddToCart?.(item);
    setSelectedItem(null);

    Alert.alert(
      'Added to cart',
      `${item.name} was added to your cart.`,
      [
        {
          text: 'Keep browsing',
          style: 'cancel',
        },
        {
          text: 'View cart',
          onPress: () => onViewCart?.(),
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title={provider ? `${provider.name} menu` : 'Menu'}
        onBack={onBack}
      />

      {!restaurantAvailable && (
        <View style={styles.banner}>
          <FormMessage message="This restaurant is unavailable right now. This menu is read-only, and items can't be ordered." />
        </View>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.menuItemId}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        renderSectionHeader={({ section }) => (
          <Text
            style={styles.sectionTitle}
            accessibilityRole="header"
          >
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => (
          <MenuItemRow
            item={item}
            onPress={() => setSelectedItem(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No menu yet"
            message="This restaurant has not added any items."
          />
        }
      />

      <FoodDetailsModal
        item={selectedItem}
        restaurantAvailable={restaurantAvailable}
        onClose={() => setSelectedItem(null)}
        onAddToCart={handleAddToCart}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  separator: {
    height: spacing.sm + 2,
  },
});
