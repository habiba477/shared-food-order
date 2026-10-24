
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { colors, spacing, radius } from '../theme/theme';

const initialNotifications = [
  {
    id: 'n1',
    type: 'invitation',
    title: 'Group order invitation',
    message: 'You have been invited to join a group food order.',
    time: '10 minutes ago',
    read: false,
    icon: '👥',
  },
  {
    id: 'n2',
    type: 'order',
    title: 'Order confirmed',
    message: 'Your food order has been confirmed successfully.',
    time: '1 hour ago',
    read: false,
    icon: '✅',
  },
  {
    id: 'n3',
    type: 'update',
    title: 'Group order update',
    message: 'Your group order details have been updated.',
    time: 'Yesterday',
    read: true,
    icon: '🔔',
  },
  {
    id: 'n4',
    type: 'promotion',
    title: 'Discover new restaurants',
    message: 'Explore restaurants and share a meal with friends.',
    time: '2 days ago',
    read: true,
    icon: '🍔',
  },
];

export default function NotificationsScreen({ onBack }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            Stay updated with your orders
          </Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View>
          <Text style={styles.summaryTitle}>Your notifications</Text>
          <Text style={styles.summaryText}>
            {unreadCount === 0
              ? 'You are all caught up!'
              : `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`}
          </Text>
        </View>

        {unreadCount > 0 && (
          <Pressable
            onPress={markAllAsRead}
            style={styles.markAllButton}
            accessibilityRole="button"
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {notifications.map((notification) => (
          <Pressable
            key={notification.id}
            onPress={() => markAsRead(notification.id)}
            style={[
              styles.notificationCard,
              !notification.read && styles.unreadCard,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`${notification.title}. ${notification.read ? 'Read' : 'Unread'}. Tap to mark as read.`}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.notificationIcon}>
                {notification.icon}
              </Text>
            </View>

            <View style={styles.notificationContent}>
              <View style={styles.titleRow}>
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>

                {!notification.read && (
                  <View style={styles.unreadDot} />
                )}
              </View>

              <Text style={styles.message}>
                {notification.message}
              </Text>

              <Text style={styles.time}>
                {notification.time}
              </Text>

              <Text style={styles.readHint}>
                {notification.read
                  ? 'Read'
                  : 'Tap to mark as read'}
              </Text>
            </View>
          </Pressable>
        ))}

        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>
              No notifications
            </Text>
            <Text style={styles.emptyMessage}>
              New updates will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 32,
    lineHeight: 36,
    color: colors.text,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  summaryText: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  markAllButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  markAllText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  list: {
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  unreadCard: {
    backgroundColor: '#FFF7ED',
    borderColor: colors.primaryTint,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 22,
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  message: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  time: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  readHint: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
  },
  emptyMessage: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
