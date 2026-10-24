
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import AppButton from '../components/AppButton';
import CuisineChip from '../components/CuisineChip';
import FeaturedCard from '../components/FeaturedCard';
import ScreenContainer from '../components/ScreenContainer';
import SearchBar from '../components/SearchBar';

import {
  getCuisines,
  getFeaturedProviders,
} from '../repositories/restaurantRepository';

import { colors, spacing, typography } from '../theme/theme';

export default function HomeScreen({
  user,
  onSearchPress,
  onCuisinePress,
  onBrowsePress,
  onProviderPress,
  onGroupOrderPress,
  onOrderHistoryPress,
  onNotificationsPress,
  onProfilePress,
  onSettingsPress,
}) {
  const cuisines = getCuisines();
  const featured = getFeaturedProviders();

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <View style={styles.padded}>
          <Text style={styles.eyebrow}>
            SHARED FOOD ORDER
          </Text>

          <Text style={styles.greeting}>
            Hello, {user?.displayName || 'there'}
          </Text>

          <Text style={styles.subtitle}>
            What are we ordering today?
          </Text>

          <View style={styles.search}>
            <SearchBar onPress={onSearchPress} />
          </View>
        </View>

        {/* Cuisines */}
        <Text style={[styles.sectionTitle, styles.padded]}>
          Explore cuisines
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {cuisines.map((cuisine) => (
            <CuisineChip
              key={cuisine.name}
              variant="tile"
              label={cuisine.name}
              icon={cuisine.icon}
              onPress={() => onCuisinePress(cuisine.name)}
            />
          ))}
        </ScrollView>

        {/* Featured restaurants */}
        <Text style={[styles.sectionTitle, styles.padded]}>
          Featured restaurants
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {featured.map((provider) => (
            <FeaturedCard
              key={provider.providerId}
              provider={provider}
              onPress={() => onProviderPress(provider.providerId)}
            />
          ))}
        </ScrollView>

        {/* Main actions */}
        <View style={styles.padded}>
          <AppButton
            title="Browse All Restaurants"
            onPress={onBrowsePress}
          />

          {/* Group orders */}
          <View style={styles.groupLink}>
            <Text style={styles.groupText}>
              Ordering with friends?
            </Text>

            <AppButton
              title="Start or Join a Group"
              variant="text"
              onPress={onGroupOrderPress}
            />
          </View>

          {/* Profile */}
          <View style={styles.actionButton}>
            <AppButton
              title="My Profile"
              variant="outline"
              onPress={onProfilePress}
            />
          </View>

          {/* Order history */}
          <View style={styles.actionButton}>
            <AppButton
              title="View Order History"
              variant="outline"
              onPress={onOrderHistoryPress}
            />
          </View>

          {/* Notifications */}
          <View style={styles.actionButton}>
            <AppButton
              title="View Notifications"
              variant="outline"
              onPress={onNotificationsPress}
            />
          </View>

          {/* Settings */}
          <View style={styles.actionButton}>
            <AppButton
              title="Settings"
              variant="outline"
              onPress={onSettingsPress}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  padded: {
    paddingHorizontal: spacing.md,
  },

  eyebrow: {
    ...typography.eyebrow,
    color: colors.primary,
  },

  greeting: {
    ...typography.title,
    color: colors.text,
    marginTop: spacing.xs,
  },

  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  search: {
    marginTop: spacing.lg,
  },

  sectionTitle: {
    ...typography.heading,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  row: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm + 2,
  },

  groupLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },

  groupText: {
    ...typography.body,
    color: colors.textMuted,
  },

  actionButton: {
    marginTop: spacing.md,
  },
});
