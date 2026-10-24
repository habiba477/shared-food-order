
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import AppButton from '../components/AppButton';
import ScreenContainer from '../components/ScreenContainer';
import { colors, spacing, radius, typography } from '../theme/theme';

export default function SettingsScreen({
  onBack,
  onSignOut,
}) {
  const [notificationsEnabled, setNotificationsEnabled] =
    useState(true);

  const [orderUpdatesEnabled, setOrderUpdatesEnabled] =
    useState(true);

  const [groupInvitationsEnabled, setGroupInvitationsEnabled] =
    useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => onSignOut?.(),
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>PREFERENCES</Text>

          <Text style={styles.title}>Settings</Text>

          <Text style={styles.subtitle}>
            Customize your Shared Food Order experience.
          </Text>
        </View>

        {/* Notifications settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Notifications
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>
                Push Notifications
              </Text>

              <Text style={styles.description}>
                Enable or disable app notifications.
              </Text>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: colors.border,
                true: colors.primaryTint,
              }}
              thumbColor={
                notificationsEnabled
                  ? colors.primary
                  : colors.disabledText
              }
              accessibilityLabel="Push notifications"
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>
                Order Updates
              </Text>

              <Text style={styles.description}>
                Receive updates about your orders.
              </Text>
            </View>

            <Switch
              value={orderUpdatesEnabled}
              onValueChange={setOrderUpdatesEnabled}
              disabled={!notificationsEnabled}
              trackColor={{
                false: colors.border,
                true: colors.primaryTint,
              }}
              thumbColor={
                orderUpdatesEnabled && notificationsEnabled
                  ? colors.primary
                  : colors.disabledText
              }
              accessibilityLabel="Order updates"
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>
                Group Invitations
              </Text>

              <Text style={styles.description}>
                Receive invitations to group orders.
              </Text>
            </View>

            <Switch
              value={groupInvitationsEnabled}
              onValueChange={setGroupInvitationsEnabled}
              disabled={!notificationsEnabled}
              trackColor={{
                false: colors.border,
                true: colors.primaryTint,
              }}
              thumbColor={
                groupInvitationsEnabled && notificationsEnabled
                  ? colors.primary
                  : colors.disabledText
              }
              accessibilityLabel="Group invitations"
            />
          </View>
        </View>

        {/* Account settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Account
          </Text>

          <Text style={styles.accountDescription}>
            Sign out of your current account on this device.
          </Text>

          <View style={styles.signOutButton}>
            <AppButton
              title="Sign Out"
              variant="outline"
              onPress={handleSignOut}
            />
          </View>
        </View>

        <View style={styles.backButton}>
          <AppButton
            title="Back"
            variant="outline"
            onPress={onBack}
          />
        </View>

        <Text style={styles.footer}>
          Shared Food Order
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  header: {
    marginBottom: spacing.lg,
  },

  eyebrow: {
    ...typography.eyebrow,
    color: colors.primary,
  },

  title: {
    ...typography.title,
    color: colors.text,
    marginTop: spacing.xs,
  },

  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  sectionTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.md,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },

  settingText: {
    flex: 1,
  },

  settingTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },

  description: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
  },

  accountDescription: {
    ...typography.body,
    color: colors.textMuted,
  },

  signOutButton: {
    marginTop: spacing.md,
  },

  backButton: {
    marginTop: spacing.xs,
  },

  footer: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.lg,
  },
});
