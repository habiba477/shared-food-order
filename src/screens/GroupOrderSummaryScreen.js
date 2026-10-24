import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import AppButton from '../components/AppButton';
import { colors, radius, spacing, typography } from '../theme/theme';
import { formatPrice } from '../utils/format';

const demo = [
  { participant: 'Layla', items: [{ name: 'Classic Koshary', quantity: 1, price: 4500 }] },
  { participant: 'Omar', items: [{ name: 'Lemon Mint', quantity: 2, price: 3000 }] },
];

export default function GroupOrderSummaryScreen({ cartItems = [], isGroupOrder = false, restaurantName = 'Cairo Koshary House', onBack, onContinue }) {
  const people = [{ participant: 'You', items: cartItems }, ...(isGroupOrder ? demo : [])];
  const subtotal = people.reduce((sum, person) => sum + person.items.reduce((inner, item) => inner + item.price * item.quantity, 0), 0);
  const deliveryFee = 2500;
  const serviceFee = 500;
  return (
    <ScreenContainer>
      <ScreenHeader title="Order summary" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>READY FOR CHECKOUT</Text>
          <Text style={styles.title}>{restaurantName}</Text>
          <Text style={styles.subtitle}>{isGroupOrder ? 'A combined view of each participant’s order.' : 'Your order is ready for the next step.'}</Text>
          {isGroupOrder && <View style={styles.groupPill}><Text style={styles.groupPillText}>GROUP ORDER · SAMPLE MODE</Text></View>}
        </View>
        {people.map((person) => {
          const personTotal = person.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          return (
            <View key={person.participant} style={styles.card}>
              <View style={styles.personHeader}>
                <Text style={styles.personName}>{person.participant}</Text>
                <Text style={styles.personTotal}>{formatPrice(personTotal)}</Text>
              </View>
              {person.items.length === 0 ? <Text style={styles.muted}>No items added yet.</Text> : person.items.map((item, index) => (
                <View key={`${person.participant}-${item.cartItemId ?? item.name}-${index}`} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.quantity} × {item.name}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                </View>
              ))}
            </View>
          );
        })}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment breakdown</Text>
          <View style={styles.priceRow}><Text style={styles.mutedDark}>Food subtotal</Text><Text style={styles.value}>{formatPrice(subtotal)}</Text></View>
          <View style={styles.priceRow}><Text style={styles.mutedDark}>Delivery fee (demo)</Text><Text style={styles.value}>{formatPrice(deliveryFee)}</Text></View>
          <View style={styles.priceRow}><Text style={styles.mutedDark}>Service fee (demo)</Text><Text style={styles.value}>{formatPrice(serviceFee)}</Text></View>
          <View style={[styles.priceRow, styles.grandTotal]}><Text style={styles.grandLabel}>Total</Text><Text style={styles.grandValue}>{formatPrice(subtotal + deliveryFee + serviceFee)}</Text></View>
          <Text style={styles.note}>Prototype only — no payment will be collected.</Text>
        </View>
        <AppButton title="Add delivery address" onPress={onContinue} />
      </ScrollView>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  hero: { paddingVertical: spacing.sm },
  eyebrow: { ...typography.eyebrow, color: colors.primary, marginBottom: spacing.xs },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs, lineHeight: 22 },
  groupPill: { alignSelf: 'flex-start', marginTop: spacing.md, backgroundColor: colors.primaryTint, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  groupPillText: { ...typography.label, color: colors.primary },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  personHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  personName: { ...typography.heading, color: colors.text },
  personTotal: { ...typography.label, color: colors.primary },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  itemName: { ...typography.body, color: colors.text, flex: 1 },
  itemPrice: { ...typography.label, color: colors.text },
  sectionTitle: { ...typography.heading, color: colors.text, marginBottom: spacing.md },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  muted: { ...typography.body, color: colors.textMuted },
  mutedDark: { ...typography.body, color: colors.textMuted },
  value: { ...typography.body, color: colors.text, fontWeight: '600' },
  grandTotal: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: spacing.sm, paddingTop: spacing.md },
  grandLabel: { ...typography.heading, color: colors.text },
  grandValue: { ...typography.heading, color: colors.primary, fontSize: 20 },
  note: { ...typography.label, color: colors.textMuted, marginTop: spacing.md },
});
