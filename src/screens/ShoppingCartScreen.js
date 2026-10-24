import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import AppButton from '../components/AppButton';
import { colors, radius, spacing, typography } from '../theme/theme';
import { formatPrice } from '../utils/format';

// Sample contributions are for the prototype only. They are not synced from other devices.
const demoContributions = [
  { id: 'demo-layla', name: 'Layla', itemId: 'demo-koshary', nameOfItem: 'Classic Koshary', price: 4500, quantity: 1 },
  { id: 'demo-omar', name: 'Omar', itemId: 'demo-lemon', nameOfItem: 'Lemon Mint', price: 3000, quantity: 2 },
];

function ItemRow({ item, onDecrease, onIncrease, onRemove, editable = true }) {
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{formatPrice(item.price)} each</Text>
        <Text style={styles.lineTotal}>{formatPrice(item.price * item.quantity)}</Text>
      </View>
      {editable ? (
        <View style={styles.controls}>
          <Pressable accessibilityRole="button" accessibilityLabel={`Decrease ${item.name}`} style={styles.quantityButton} onPress={onDecrease}>
            <Text style={styles.quantityButtonText}>−</Text>
          </Pressable>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={`Increase ${item.name}`} style={styles.quantityButton} onPress={onIncrease}>
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${item.name}`} onPress={onRemove} style={styles.removeButton}>
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.demoQuantity}>× {item.quantity}</Text>
      )}
    </View>
  );
}

export default function ShoppingCartScreen({
  cartItems = [],
  isGroupOrder = false,
  onBack,
  onChangeQuantity,
  onRemoveItem,
  onContinue,
  onBrowseMenu,
  userName = 'You',
  restaurantName = 'Your restaurant',
}) {
  const ownTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const demoTotal = isGroupOrder
    ? demoContributions.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;
  const total = ownTotal + demoTotal;
  const hasItems = cartItems.length > 0 || (isGroupOrder && demoContributions.length > 0);

  return (
    <ScreenContainer>
      <ScreenHeader title="Shopping cart" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.eyebrow}>{isGroupOrder ? 'GROUP ORDER' : 'YOUR ORDER'}</Text>
          <Text style={styles.title}>{restaurantName}</Text>
          <Text style={styles.subtitle}>
            {isGroupOrder ? 'Everyone’s selections, organized by participant.' : 'Review your selected food before continuing.'}
          </Text>
        </View>

        {!hasItems ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.subtitle}>Choose something tasty from the menu to get started.</Text>
            <AppButton title="Browse menu" onPress={onBrowseMenu} />
          </View>
        ) : (
          <>
            <View style={styles.sectionCard}>
              <View style={styles.participantHeading}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{userName.slice(0, 1).toUpperCase()}</Text></View>
                <View style={styles.participantCopy}>
                  <Text style={styles.participantName}>{userName} (you)</Text>
                  <Text style={styles.muted}>{cartItems.length} item type{cartItems.length === 1 ? '' : 's'}</Text>
                </View>
                <Text style={styles.subtotal}>{formatPrice(ownTotal)}</Text>
              </View>
              {cartItems.length ? cartItems.map((item) => (
                <ItemRow
                  key={item.cartItemId}
                  item={item}
                  onDecrease={() => onChangeQuantity(item.cartItemId, -1)}
                  onIncrease={() => onChangeQuantity(item.cartItemId, 1)}
                  onRemove={() => onRemoveItem(item.cartItemId)}
                />
              )) : <Text style={styles.emptyOwn}>You haven’t added any items yet.</Text>}
            </View>

            {isGroupOrder && (
              <View style={styles.sectionCard}>
                <View style={styles.participantHeading}>
                  <View style={[styles.avatar, styles.demoAvatar]}><Text style={styles.avatarText}>L</Text></View>
                  <View style={styles.participantCopy}>
                    <Text style={styles.participantName}>Layla</Text>
                    <Text style={styles.muted}>Sample participant · demo data</Text>
                  </View>
                  <Text style={styles.subtotal}>{formatPrice(4500)}</Text>
                </View>
                <ItemRow item={{ name: 'Classic Koshary', price: 4500, quantity: 1 }} editable={false} />
                <View style={styles.participantHeading}>
                  <View style={[styles.avatar, styles.demoAvatar2]}><Text style={styles.avatarText}>O</Text></View>
                  <View style={styles.participantCopy}>
                    <Text style={styles.participantName}>Omar</Text>
                    <Text style={styles.muted}>Sample participant · demo data</Text>
                  </View>
                  <Text style={styles.subtotal}>{formatPrice(6000)}</Text>
                </View>
                <ItemRow item={{ name: 'Lemon Mint', price: 3000, quantity: 2 }} editable={false} />
              </View>
            )}

            <View style={styles.totalCard}>
              <View style={styles.totalRow}><Text style={styles.totalLabel}>Food subtotal</Text><Text style={styles.totalValue}>{formatPrice(total)}</Text></View>
              <Text style={styles.muted}>Delivery and final fees are shown in the order summary.</Text>
            </View>
            <AppButton title="Review group order" onPress={onContinue} />
            <AppButton title="Continue shopping" variant="secondary" onPress={onBrowseMenu} />
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  intro: { marginBottom: spacing.xs },
  eyebrow: { ...typography.eyebrow, color: colors.primary, marginBottom: spacing.xs },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs, lineHeight: 22 },
  sectionCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  participantHeading: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  demoAvatar: { backgroundColor: '#DBEAFE' },
  demoAvatar2: { backgroundColor: '#F3E8FF' },
  avatarText: { color: colors.primary, fontWeight: '700' },
  participantCopy: { flex: 1 },
  participantName: { ...typography.heading, fontSize: 16, color: colors.text },
  muted: { ...typography.label, color: colors.textMuted, marginTop: 2 },
  subtotal: { ...typography.label, color: colors.text, fontSize: 14 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm },
  itemInfo: { flex: 1 },
  itemName: { ...typography.body, color: colors.text, fontWeight: '600' },
  itemPrice: { ...typography.label, color: colors.textMuted, marginTop: 3 },
  lineTotal: { ...typography.label, color: colors.primary, marginTop: 4 },
  controls: { alignItems: 'center', gap: spacing.xs },
  quantityButton: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  quantityButtonText: { color: colors.text, fontSize: 20, lineHeight: 22 },
  quantity: { ...typography.label, color: colors.text, minWidth: 20, textAlign: 'center' },
  removeButton: { padding: 4 },
  removeText: { ...typography.label, color: colors.danger },
  demoQuantity: { ...typography.label, color: colors.textMuted },
  totalCard: { padding: spacing.md, backgroundColor: colors.primaryTint, borderRadius: radius.md, gap: spacing.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { ...typography.heading, color: colors.text },
  totalValue: { ...typography.heading, color: colors.primary, fontSize: 20 },
  emptyCard: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, alignItems: 'center', gap: spacing.md, borderWidth: 1, borderColor: colors.border },
  emptyEmoji: { fontSize: 42 },
  emptyTitle: { ...typography.heading, color: colors.text },
  emptyOwn: { ...typography.body, color: colors.textMuted, paddingVertical: spacing.sm },
});
