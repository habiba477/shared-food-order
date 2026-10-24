
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { colors, spacing, radius } from '../theme/theme';

const initialOrders = [
  {
    id: 'ORD-1001',
    restaurant: 'Burger House',
    items: '2 Burgers, 1 Fries, 2 Drinks',
    date: 'Oct 20, 2026',
    total: 420,
    status: 'Completed',
  },
  {
    id: 'ORD-1002',
    restaurant: 'Pizza Corner',
    items: '1 Large Pizza, 1 Garlic Bread',
    date: 'Oct 18, 2026',
    total: 350,
    status: 'Completed',
  },
  {
    id: 'ORD-1003',
    restaurant: 'Pasta Place',
    items: '2 Pasta Meals',
    date: 'Oct 15, 2026',
    total: 280,
    status: 'Cancelled',
  },
];

export default function OrderHistoryScreen({ onBack, onReorder }) {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Completed', 'Cancelled'];

  const filteredOrders =
    selectedFilter === 'All'
      ? initialOrders
      : initialOrders.filter(
          (order) => order.status === selectedFilter
        );

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

        <View>
          <Text style={styles.title}>Order History</Text>
          <Text style={styles.subtitle}>
            Your previous food orders
          </Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {filters.map((filter) => {
          const isSelected = selectedFilter === filter;

          return (
            <Pressable
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[
                styles.filterButton,
                isSelected && styles.selectedFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  isSelected && styles.selectedFilterText,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.orderList}
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptyText}>
              Your orders in this category will appear here.
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderTop}>
                <View style={styles.restaurantIcon}>
                  <Text style={styles.foodEmoji}>🍔</Text>
                </View>

                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>
                    {order.restaurant}
                  </Text>
                  <Text style={styles.orderId}>{order.id}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    order.status === 'Completed'
                      ? styles.completedBadge
                      : styles.cancelledBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      order.status === 'Completed'
                        ? styles.completedText
                        : styles.cancelledText,
                    ]}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.items}>{order.items}</Text>
              <Text style={styles.date}>{order.date}</Text>

              <View style={styles.orderBottom}>
                <View>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.total}>
                    EGP {order.total}
                  </Text>
                </View>

                <Pressable
                  onPress={() => {
                    if (onReorder) {
                      onReorder(order);
                    }
                  }}
                  style={styles.reorderButton}
                >
                  <Text style={styles.reorderText}>Reorder</Text>
                </Pressable>
              </View>
            </View>
          ))
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
    marginBottom: spacing.lg,
    gap: spacing.sm,
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
    color: colors.text,
    lineHeight: 36,
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
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedFilter: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  selectedFilterText: {
    color: colors.onPrimary,
  },
  orderList: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  restaurantIcon: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodEmoji: {
    fontSize: 24,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  orderId: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  completedBadge: {
    backgroundColor: colors.successTint,
  },
  cancelledBadge: {
    backgroundColor: colors.dangerTint,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  completedText: {
    color: colors.success,
  },
  cancelledText: {
    color: colors.danger,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  items: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  total: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginTop: 3,
  },
  reorderButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
  reorderText: {
    color: colors.onPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
