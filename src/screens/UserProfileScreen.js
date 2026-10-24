
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import AppButton from '../components/AppButton';
import ScreenContainer from '../components/ScreenContainer';
import { colors, spacing, radius, typography } from '../theme/theme';

export default function UserProfileScreen({
  user,
  onBack,
  onSave,
}) {
  const [displayName, setDisplayName] = useState(
    user?.displayName || ''
  );

  const [email, setEmail] = useState(
    user?.email || ''
  );

  const handleSave = () => {
    const cleanName = displayName.trim();
    const cleanEmail = email.trim();

    if (!cleanName || !cleanEmail) {
      Alert.alert(
        'Missing information',
        'Please enter both your name and email address.'
      );
      return;
    }

    onSave?.({
      ...user,
      displayName: cleanName,
      email: cleanEmail,
    });

    Alert.alert(
      'Profile updated',
      'Your profile information has been saved.'
    );
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>YOUR ACCOUNT</Text>

          <Text style={styles.title}>My Profile</Text>

          <Text style={styles.subtitle}>
            Manage your personal information.
          </Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(displayName.trim().charAt(0) || 'U').toUpperCase()}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Display Name</Text>

          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter your name"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            accessibilityLabel="Display name"
          />

          <Text style={styles.label}>Email Address</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Email address"
          />

          <View style={styles.saveButton}>
            <AppButton
              title="Save Changes"
              onPress={handleSave}
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

  avatar: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryTint,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },

  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: 15,
    marginBottom: spacing.lg,
  },

  saveButton: {
    marginTop: spacing.xs,
  },

  backButton: {
    marginTop: spacing.md,
  },
});
