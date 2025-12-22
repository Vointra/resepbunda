import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Share2, Heart, Clock, Flame, User, ChefHat } from 'lucide-react-native';
import { Recipe } from '../../src/types/recipe';
import { querySql } from '../../src/services/db/client';
import { theme } from '../../src/theme';

const RecipeDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (id) {
          const result = await querySql<Recipe>('SELECT * FROM recipes WHERE id = ?', [parseInt(id, 10)]);
          if (result.length > 0) {
            setRecipe(result[0]);
          } else {
            console.warn('Recipe not found');
          }
        }
      } catch (e) {
        console.error('Failed to fetch recipe details', e);
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{color: theme.colors.neutral.medium, fontFamily: theme.font.regular}}>Loading Recipe...</Text>
      </View>
    );
  }

  const ingredients: string[] = JSON.parse(recipe.ingredients || '[]');

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: recipe.title, headerShown: false }} />

      <ScrollView>
        <View style={styles.heroImage}>
          <ChefHat size={64} color={theme.colors.neutral.medium} />
          <View style={styles.heroOverlay} />
        </View>

        <View style={styles.contentBody}>
          <View style={styles.titleSection}>
            <View style={{flex: 1}}>
              <Text style={styles.categoryBadge}>{recipe.category.toUpperCase()}</Text>
              <Text style={styles.title}>{recipe.title}</Text>
              <Text style={styles.creatorText}>by <Text style={{fontFamily: theme.font.bold}}>{recipe.creator}</Text></Text>
            </View>
            {recipe.rating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {recipe.rating}</Text>
              </View>
            )}
          </View>

          <View style={styles.statsRow}>
            <StatItem icon={<Clock size={18} color={theme.colors.primary.DEFAULT} />} label="Time" value={recipe.cookingTime} />
            <StatItem icon={<Flame size={18} color={theme.colors.primary.DEFAULT} />} label="Calories" value={recipe.calories || 'N/A'} />
            <StatItem icon={<User size={18} color={theme.colors.primary.DEFAULT} />} label="Servings" value="2 People" />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{recipe.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients ({ingredients.length})</Text>
            <View style={styles.ingredientsList}>
              {ingredients.map((ing, idx) => (
                <View key={idx} style={styles.ingredientItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.ingredientText}>{ing}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.headerButton}>
            <Share2 size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerButton, isBookmarked && { backgroundColor: theme.colors.primary.DEFAULT }]}
            onPress={() => setIsBookmarked(!isBookmarked)}
          >
            <Heart size={20} color="white" fill={isBookmarked ? "white" : "none"} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push(`/cooking/${recipe.id}`)}
        >
          <ChefHat size={20} color="white" />
          <Text style={styles.fabText}>Start Cooking</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const StatItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <View style={styles.statItem}>
      <View style={styles.statIcon}>{icon}</View>
      <View>
        <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.bg,
  },
  header: {
    position: 'absolute',
    top: 50, // Adjust as needed for status bar
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.xs,
  },
  heroImage: {
    height: 280,
    backgroundColor: theme.colors.neutral.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  contentBody: {
    backgroundColor: '#FFFFFF',
    marginTop: -theme.spacing.lg,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    paddingBottom: 100, // Space for FAB
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  categoryBadge: {
    backgroundColor: theme.colors.primary.bg,
    color: theme.colors.primary.dark,
    fontSize: 10,
    fontFamily: theme.font.bold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.xs,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontFamily: theme.font.bold,
    color: theme.colors.neutral.dark,
    marginBottom: 4,
  },
  creatorText: {
    fontSize: 14,
    color: theme.colors.neutral.medium,
    fontFamily: theme.font.regular,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.light, // Consistent color
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  ratingText: {
    color: theme.colors.primary.dark,
    fontFamily: theme.font.bold,
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.neutral.light,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    backgroundColor: theme.colors.primary.bg,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.neutral.medium,
    fontFamily: theme.font.bold,
  },
  statValue: {
    fontSize: 14,
    fontFamily: theme.font.bold,
    color: theme.colors.neutral.dark,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.font.bold,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.neutral.medium,
    fontFamily: theme.font.regular,
  },
  ingredientsList: {
    marginTop: theme.spacing.xs,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.bg,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary.DEFAULT,
    marginRight: theme.spacing.sm,
  },
  ingredientText: {
    fontSize: 14,
    color: theme.colors.neutral.dark,
    fontFamily: theme.font.medium,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    paddingBottom: 30, // Extra padding for home bar
    backgroundColor: 'transparent'
  },
  fab: {
    backgroundColor: theme.colors.primary.DEFAULT,
    height: 56,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fabText: {
    color: 'white',
    fontSize: 16,
    fontFamily: theme.font.bold,
    marginLeft: theme.spacing.xs,
  },
});

export default RecipeDetailScreen;