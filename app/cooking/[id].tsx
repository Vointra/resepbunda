import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Bookmark, Flame, ChefHat, CheckCircle, Circle } from 'lucide-react-native';
import { Recipe } from '../../src/types/recipe';
import { querySql } from '../../src/services/db/client';
import { theme } from '../../src/theme';

const CookingModeScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (id) {
          const result = await querySql<Recipe>('SELECT * FROM recipes WHERE id = ?', [parseInt(id, 10)]);
          if (result.length > 0) {
            setRecipe(result[0]);
          }
        }
      } catch (e) {
        console.error('Failed to fetch recipe for cooking mode', e);
      }
    };
    fetchRecipe();
    setCheckedIngredients([]);
  }, [id]);

  const toggleIngredientCheck = (index: number) => {
    setCheckedIngredients(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  if (!recipe) {
    return <View style={styles.loadingContainer}><Text style={{color: theme.colors.neutral.medium}}>Loading Cooking Mode...</Text></View>;
  }

  const ingredients: string[] = JSON.parse(recipe.ingredients || '[]');
  const steps: string[] = JSON.parse(recipe.steps || '[]');

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.neutral.dark} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Cooking Mode</Text>
          <Text style={styles.headerSubtitle}>{recipe.title}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.heroImage}>
          <ChefHat size={40} color={theme.colors.neutral.medium} />
          <View style={styles.heroOverlay} />
        </View>

        <View style={styles.contentPadding}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: theme.colors.primary.bg }]}>
                <Bookmark size={18} color={theme.colors.primary.DEFAULT} />
              </View>
              <Text style={styles.sectionTitle}>Preparation Check</Text>
            </View>
            <Text style={styles.sectionDescription}>Check the items you have ready:</Text>
            {ingredients.map((ing, idx) => {
              const isChecked = checkedIngredients.includes(idx);
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.checkItem, isChecked && styles.checkedItem]}
                  onPress={() => toggleIngredientCheck(idx)}
                >
                  {isChecked ? (
                    <CheckCircle size={20} color={theme.colors.primary.DEFAULT} />
                  ) : (
                    <Circle size={20} color={theme.colors.neutral.light} />
                  )}
                  <Text style={[styles.checkItemText, isChecked && styles.checkedItemText]}>{ing}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: theme.colors.primary.bg }]}>
                <Flame size={18} color={theme.colors.primary.DEFAULT} />
              </View>
              <Text style={styles.sectionTitle}>Cooking Instructions</Text>
            </View>

            <View style={styles.stepsContainer}>
              {steps.map((step, idx) => (
                <View key={idx} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                </View>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.finishButton}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.finishButtonText}>Finish Cooking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.neutral.bg },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.neutral.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  backButton: { padding: theme.spacing.xs, marginRight: theme.spacing.sm, marginLeft: -theme.spacing.xs },
  headerTitle: { fontSize: 18, fontFamily: theme.font.bold, color: theme.colors.neutral.dark },
  headerSubtitle: { fontSize: 12, fontFamily: theme.font.regular, color: theme.colors.neutral.medium },
  scrollContainer: { flex: 1 },
  contentPadding: { padding: theme.spacing.md },
  heroImage: {
    height: 160,
    backgroundColor: theme.colors.neutral.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  sectionTitle: { fontSize: 18, fontFamily: theme.font.bold, color: theme.colors.neutral.dark },
  sectionDescription: { fontSize: 12, color: theme.colors.neutral.medium, marginBottom: theme.spacing.sm, fontFamily: theme.font.regular, fontStyle: 'italic' },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    backgroundColor: theme.colors.neutral.bg,
    marginBottom: theme.spacing.xs,
  },
  checkedItem: { backgroundColor: theme.colors.primary.bg, borderColor: theme.colors.primary.light },
  checkItemText: { flex: 1, marginLeft: theme.spacing.sm, fontSize: 14, fontFamily: theme.font.regular, color: theme.colors.neutral.dark },
  checkedItemText: { textDecorationLine: 'line-through', color: theme.colors.neutral.medium },
  stepsContainer: { position: 'relative', paddingLeft: theme.spacing.md, paddingTop: theme.spacing.sm, borderLeftWidth: 2, borderLeftColor: theme.colors.neutral.light, marginLeft: 5 },
  stepItem: { flexDirection: 'row', marginBottom: theme.spacing.lg, alignItems: 'flex-start' },
  stepNumber: {
    position: 'absolute',
    left: -16,
    top: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primary.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  stepNumberText: { color: 'white', fontFamily: theme.font.bold, fontSize: 12 },
  stepContent: {
    flex: 1,
    backgroundColor: theme.colors.neutral.bg,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginLeft: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
  },
  stepText: { fontSize: 15, lineHeight: 22, color: theme.colors.neutral.medium, fontFamily: theme.font.regular },
  finishButton: {
    backgroundColor: theme.colors.neutral.dark,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  finishButtonText: { color: 'white', fontSize: 16, fontFamily: theme.font.bold },
});

export default CookingModeScreen;