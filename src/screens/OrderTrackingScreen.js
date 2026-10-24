import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import ScreenHeader from '../components/ScreenHeader';
import AppButton from '../components/AppButton';
import { colors, radius, spacing, typography } from '../theme/theme';

const statuses = [
  { title: 'Order confirmed', detail: 'Your order has been placed in the demo.', time: 'Just now' },
  { title: 'Preparing your food', detail: 'The restaurant is preparing the items.', time: 'Next' },
  { title: 'Out for delivery', detail: 'A courier is on the way.', time: 'Later' },
  { title: 'Delivered', detail: 'Enjoy your meal!', time: 'Final step' },
];

export default function OrderTrackingScreen({ onBack, address, onFinish }) {
  const [activeStep, setActiveStep] = useState(0);
  return (
    <ScreenContainer>
      <ScreenHeader title="Order tracking" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.successIcon}><Text style={styles.successIconText}>✓</Text></View>
          <Text style={styles.title}>Order placed!</Text>
          <Text style={styles.subtitle}>Reference #MM-2048 · This is a simulated order status.</Text>
          <View style={styles.etaCard}>
            <Text style={styles.etaLabel}>ESTIMATED DELIVERY</Text>
            <Text style={styles.etaValue}>{activeStep >= 3 ? 'Delivered' : activeStep === 2 ? 'On the way' : '30–40 min'}</Text>
          </View>
        </View>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapIcon}>⌖</Text>
          <Text style={styles.mapTitle}>Live map preview</Text>
          <Text style={styles.mapText}>Google Maps / courier location will be connected in a later phase.</Text>
          <View style={styles.fakeRoad}><View style={styles.fakeRoadLine} /><View style={styles.pin}><Text style={styles.pinText}>●</Text></View></View>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order progress</Text>
          {statuses.map((status, index) => {
            const complete = index < activeStep;
            const current = index === activeStep;
            return (
              <View key={status.title} style={styles.timelineRow}>
                <View style={styles.timelineRail}>
                  <View style={[styles.dot, complete && styles.dotComplete, current && styles.dotCurrent]}>
                    {complete ? <Text style={styles.check}>✓</Text> : null}
                  </View>
                  {index < statuses.length - 1 && <View style={[styles.line, index < activeStep && styles.lineComplete]} />}
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.statusHeading}>
                    <Text style={[styles.statusTitle, !complete && !current && styles.pending]}>{status.title}</Text>
                    <Text style={styles.statusTime}>{complete ? 'Done' : current ? 'Now' : status.time}</Text>
                  </View>
                  <Text style={styles.statusDetail}>{status.detail}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery destination</Text>
          <Text style={styles.addressName}>{address?.recipient || 'Recipient not set'}</Text>
          <Text style={styles.addressText}>{[address?.street, address?.building && `Building ${address.building}`, address?.apartment && `Apartment ${address.apartment}`].filter(Boolean).join(', ') || 'Sample delivery address'}</Text>
          {address?.phone ? <Text style={styles.addressText}>{address.phone}</Text> : null}
        </View>
        {activeStep < statuses.length - 1 ? (
          <Pressable style={styles.demoAdvance} onPress={() => setActiveStep((step) => Math.min(step + 1, statuses.length - 1))} accessibilityRole="button">
            <Text style={styles.demoAdvanceText}>Demo: advance to next status →</Text>
          </Pressable>
        ) : (
          <View style={styles.deliveredBanner}><Text style={styles.deliveredText}>Your demo order is marked as delivered.</Text></View>
        )}
        <AppButton title="Back to home" onPress={onFinish} />
      </ScrollView>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  hero: { alignItems: 'center', paddingVertical: spacing.md },
  successIcon: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.successTint, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  successIconText: { color: colors.success, fontSize: 30, fontWeight: '700' },
  title: { ...typography.title, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs, lineHeight: 22 },
  etaCard: { marginTop: spacing.md, width: '100%', backgroundColor: colors.primaryTint, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  etaLabel: { ...typography.eyebrow, color: colors.primary },
  etaValue: { ...typography.title, color: colors.primary, marginTop: spacing.xs },
  mapPlaceholder: { minHeight: 190, backgroundColor: '#E8EFE8', borderRadius: radius.md, padding: spacing.md, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  mapIcon: { color: colors.primary, fontSize: 32 },
  mapTitle: { ...typography.heading, color: colors.text, marginTop: spacing.xs },
  mapText: { ...typography.label, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs, maxWidth: 270, lineHeight: 18 },
  fakeRoad: { position: 'absolute', width: '120%', height: 30, backgroundColor: '#FFFFFF', transform: [{ rotate: '-12deg' }], bottom: 25, alignItems: 'center', justifyContent: 'center' },
  fakeRoadLine: { width: '100%', borderTopWidth: 2, borderColor: '#D1D5DB', borderStyle: 'dashed' },
  pin: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', right: '25%', top: -8 },
  pinText: { color: colors.onPrimary, fontSize: 12 },
  card: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  sectionTitle: { ...typography.heading, color: colors.text, marginBottom: spacing.md },
  timelineRow: { flexDirection: 'row', minHeight: 70 },
  timelineRail: { alignItems: 'center', width: 28, marginRight: spacing.sm },
  dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  dotComplete: { backgroundColor: colors.success, borderColor: colors.success },
  dotCurrent: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  check: { color: colors.onPrimary, fontSize: 12, fontWeight: '700' },
  line: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 2 },
  lineComplete: { backgroundColor: colors.success },
  timelineContent: { flex: 1, paddingBottom: spacing.md },
  statusHeading: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  statusTitle: { ...typography.body, color: colors.text, fontWeight: '700', flex: 1 },
  pending: { color: colors.textMuted, fontWeight: '400' },
  statusTime: { ...typography.label, color: colors.textMuted },
  statusDetail: { ...typography.label, color: colors.textMuted, lineHeight: 18, marginTop: 3 },
  addressName: { ...typography.body, color: colors.text, fontWeight: '700' },
  addressText: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs, lineHeight: 21 },
  demoAdvance: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  demoAdvanceText: { ...typography.label, color: colors.primary },
  deliveredBanner: { backgroundColor: colors.successTint, borderRadius: radius.md, padding: spacing.md },
  deliveredText: { ...typography.body, color: colors.success, textAlign: 'center', fontWeight: '600' },
});
