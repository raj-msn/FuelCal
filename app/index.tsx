import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  useColorScheme,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  kilometers: 'fuelcal_kilometers',
  consumption: 'fuelcal_consumption',
  cost: 'fuelcal_cost',
  people: 'fuelcal_people',
  currency: 'fuelcal_currency',
  fuelUnit: 'fuelcal_fuel_unit',
};

// Currency configuration
const CURRENCY_SYMBOLS = {
  AED: 'د.إ',
  INR: '₹',
};

type Currency = 'AED' | 'INR';
type FuelUnit = 'L/100km' | 'km/L';

export default function Index() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Refs for input fields
  const kmRef = useRef<TextInput>(null);
  const consumptionRef = useRef<TextInput>(null);
  const costRef = useRef<TextInput>(null);
  const peopleRef = useRef<TextInput>(null);

  // State for input values
  const [kilometers, setKilometers] = useState('');
  const [fuelConsumption, setFuelConsumption] = useState('');
  const [petrolCost, setPetrolCost] = useState('');
  const [numPeople, setNumPeople] = useState('1');

  // State for preferences
  const [currency, setCurrency] = useState<Currency>('AED');
  const [fuelUnit, setFuelUnit] = useState<FuelUnit>('L/100km');

  // Load saved values on mount
  useEffect(() => {
    const loadSavedValues = async () => {
      try {
        const savedKm = await AsyncStorage.getItem(STORAGE_KEYS.kilometers);
        const savedConsumption = await AsyncStorage.getItem(STORAGE_KEYS.consumption);
        const savedCost = await AsyncStorage.getItem(STORAGE_KEYS.cost);
        const savedPeople = await AsyncStorage.getItem(STORAGE_KEYS.people);
        const savedCurrency = await AsyncStorage.getItem(STORAGE_KEYS.currency);
        const savedFuelUnit = await AsyncStorage.getItem(STORAGE_KEYS.fuelUnit);

        if (savedKm) setKilometers(savedKm);
        if (savedConsumption) setFuelConsumption(savedConsumption);
        if (savedCost) setPetrolCost(savedCost);
        if (savedPeople) setNumPeople(savedPeople);
        if (savedCurrency) setCurrency(savedCurrency as Currency);
        if (savedFuelUnit) setFuelUnit(savedFuelUnit as FuelUnit);
      } catch (error) {
        console.error('Error loading saved values:', error);
      }
    };

    loadSavedValues();
  }, []);

  // Save values whenever they change
  useEffect(() => {
    if (kilometers) AsyncStorage.setItem(STORAGE_KEYS.kilometers, kilometers);
  }, [kilometers]);

  useEffect(() => {
    if (fuelConsumption) AsyncStorage.setItem(STORAGE_KEYS.consumption, fuelConsumption);
  }, [fuelConsumption]);

  useEffect(() => {
    if (petrolCost) AsyncStorage.setItem(STORAGE_KEYS.cost, petrolCost);
  }, [petrolCost]);

  useEffect(() => {
    if (numPeople) AsyncStorage.setItem(STORAGE_KEYS.people, numPeople);
  }, [numPeople]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.currency, currency);
  }, [currency]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEYS.fuelUnit, fuelUnit);
  }, [fuelUnit]);

  // Toggle currency
  const toggleCurrency = () => {
    setCurrency(prev => prev === 'AED' ? 'INR' : 'AED');
  };

  // Clear all values except fuel cost and preferences
  const clearValues = () => {
    setKilometers('');
    setFuelConsumption('');
    setNumPeople('1');
    // Clear from storage too
    AsyncStorage.removeItem(STORAGE_KEYS.kilometers);
    AsyncStorage.removeItem(STORAGE_KEYS.consumption);
    AsyncStorage.removeItem(STORAGE_KEYS.people);
    // Note: petrolCost, currency, and fuelUnit are preserved
  };

  // Calculate results
  const results = useMemo(() => {
    const km = parseFloat(kilometers) || 0;
    const consumption = parseFloat(fuelConsumption) || 0;
    const cost = parseFloat(petrolCost) || 0;
    const people = parseInt(numPeople) || 1;

    // Calculate total fuel used (L) based on selected unit
    let totalFuelUsed: number;
    if (fuelUnit === 'L/100km') {
      // Liters per 100km: fuel = (km / 100) * consumption
      totalFuelUsed = (km / 100) * consumption;
    } else {
      // Kilometers per liter: fuel = km / consumption
      totalFuelUsed = consumption > 0 ? km / consumption : 0;
    }

    // Calculate total cost
    const totalCost = totalFuelUsed * cost;

    // Calculate cost per person
    const costPerPerson = totalCost / Math.max(1, people);

    return {
      totalFuelUsed: totalFuelUsed.toFixed(2),
      totalCost: totalCost.toFixed(2),
      costPerPerson: costPerPerson.toFixed(2),
    };
  }, [kilometers, fuelConsumption, petrolCost, numPeople, fuelUnit]);

  // Get current currency symbol
  const currencySymbol = CURRENCY_SYMBOLS[currency];

  // Dynamic styles based on theme
  const containerStyle = [
    styles.container,
    { backgroundColor: isDark ? '#0a0a0a' : '#f5f5f7' }
  ];

  const cardStyle = [
    styles.card,
    {
      backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
      shadowColor: isDark ? '#000000' : '#000000',
    }
  ];

  const inputStyle = [
    styles.input,
    {
      backgroundColor: isDark ? '#2c2c2e' : '#f0f0f5',
      color: isDark ? '#ffffff' : '#000000',
      borderColor: isDark ? '#3a3a3c' : '#e0e0e5',
    }
  ];453126
  const textColor = { color: isDark ? '#ffffff' : '#000000' };
  const labelColor = { color: isDark ? '#a0a0a5' : '#6e6e73' };

  return (
    <SafeAreaView style={containerStyle}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Clear and Currency Buttons */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, textColor]}>FuelCal</Text>
              <Text style={[styles.subtitle, labelColor]}>
                @raj_msn
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={[styles.clearButton, { backgroundColor: isDark ? '#2c2c2e' : '#f0f0f5' }]}
                onPress={clearValues}
              >
                <Text style={[styles.clearButtonText, labelColor]}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.currencyButton, { backgroundColor: isDark ? '#2c2c2e' : '#f0f0f5' }]}
                onPress={toggleCurrency}
              >
                <Text style={[styles.currencyText, textColor]}>{currencySymbol}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Input Card */}
          <View style={cardStyle}>
            <Text style={[styles.sectionTitle, textColor]}>Trip Details</Text>

            {/* Kilometers */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, labelColor]}>Kilometers Traveled</Text>
              <TextInput
                ref={kmRef}
                style={inputStyle}
                value={kilometers}
                onChangeText={setKilometers}
                placeholder="112"
                placeholderTextColor={isDark ? '#6e6e73' : '#a0a0a5'}
                keyboardType="decimal-pad"
                returnKeyType="next"
                onSubmitEditing={() => consumptionRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            {/* Fuel Consumption with Unit Selector */}
            <View style={styles.inputGroup}>
              <View style={styles.labelWithControl}>
                <Text style={[styles.label, labelColor]}>
                  Avg. Fuel Consumption
                </Text>
                {/* Segmented Control for Fuel Unit */}
                <View style={[styles.segmentedControl, { borderColor: isDark ? '#3a3a3c' : '#e0e0e5' }]}>
                  <TouchableOpacity
                    style={[
                      styles.segment,
                      styles.segmentLeft,
                      fuelUnit === 'L/100km' && styles.segmentActive,
                    ]}
                    onPress={() => setFuelUnit('L/100km')}
                  >
                    <Text style={[
                      styles.segmentText,
                      { color: isDark ? '#a0a0a5' : '#6e6e73' },
                      fuelUnit === 'L/100km' && styles.segmentTextActive,
                    ]}>
                      L/100km
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.segment,
                      styles.segmentRight,
                      fuelUnit === 'km/L' && styles.segmentActive,
                    ]}
                    onPress={() => setFuelUnit('km/L')}
                  >
                    <Text style={[
                      styles.segmentText,
                      { color: isDark ? '#a0a0a5' : '#6e6e73' },
                      fuelUnit === 'km/L' && styles.segmentTextActive,
                    ]}>
                      km/L
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TextInput
                ref={consumptionRef}
                style={inputStyle}
                value={fuelConsumption}
                onChangeText={setFuelConsumption}
                placeholder={fuelUnit === 'L/100km' ? '7.5' : '13'}
                placeholderTextColor={isDark ? '#6e6e73' : '#a0a0a5'}
                keyboardType="decimal-pad"
                returnKeyType="next"
                onSubmitEditing={() => costRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            {/* Petrol Cost */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, labelColor]}>
                Petrol Cost per Liter ({currencySymbol})
              </Text>
              <TextInput
                ref={costRef}
                style={inputStyle}
                value={petrolCost}
                onChangeText={setPetrolCost}
                placeholder="1.85"
                placeholderTextColor={isDark ? '#6e6e73' : '#a0a0a5'}
                keyboardType="decimal-pad"
                returnKeyType="next"
                onSubmitEditing={() => peopleRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            {/* Number of People */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, labelColor]}>Number of People</Text>
              <TextInput
                ref={peopleRef}
                style={inputStyle}
                value={numPeople}
                onChangeText={setNumPeople}
                placeholder="1"
                placeholderTextColor={isDark ? '#6e6e73' : '#a0a0a5'}
                keyboardType="number-pad"
                returnKeyType="done"
              />
            </View>
          </View>

          {/* Results Card */}
          <View style={cardStyle}>
            <Text style={[styles.sectionTitle, textColor]}>Results</Text>

            {/* Total Fuel Used */}
            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel, labelColor]}>
                Total Fuel Used
              </Text>
              <Text style={[styles.resultValue, textColor]}>
                {results.totalFuelUsed} L
              </Text>
            </View>

            {/* Total Cost */}
            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel, labelColor]}>Total Cost</Text>
              <Text style={[styles.resultValue, textColor]}>
                {currencySymbol} {results.totalCost}
              </Text>
            </View>

            {/* Cost Per Person - Highlighted */}
            <View style={[styles.resultRow, styles.highlightedResult]}>
              <Text style={[styles.resultLabel, styles.highlightedLabel]}>
                Cost Per Person
              </Text>
              <Text style={[styles.costPerPerson, styles.highlightedValue]}>
                {currencySymbol} {results.costPerPerson}
              </Text>
            </View>
          </View>

          {/* Footer spacing */}
          <View style={styles.footer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  clearButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  currencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  currencyText: {
    fontSize: 20,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelWithControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  segmentLeft: {
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  segmentRight: {
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  segmentActive: {
    backgroundColor: '#007AFF',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '500',
  },
  segmentTextActive: {
    color: '#ffffff',
  },
  input: {
    fontSize: 17,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#3a3a3c',
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  highlightedResult: {
    marginTop: 8,
    paddingTop: 20,
    paddingBottom: 4,
    borderBottomWidth: 0,
  },
  highlightedLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  highlightedValue: {
    color: '#007AFF',
  },
  costPerPerson: {
    fontSize: 32,
    fontWeight: '700',
  },
  footer: {
    height: 20,
  },
});
