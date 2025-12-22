import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, User, ChefHat } from 'lucide-react-native';
import { Recipe } from '../types/recipe';
import { theme } from '../theme';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{recipe.title}</Text>
          {recipe.isPrivate === 1 && (
            <View style={styles.privateBadge}>
              <Text style={styles.privateBadgeText}>PRIVATE</Text>
            </View>
          )}
        </View>
        <View style={styles.timeContainer}>
          <Clock size={14} color={theme.colors.neutral.medium} />
          <Text style={styles.timeText}>{recipe.cookingTime}</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {recipe.description}
      </Text>

      {/* Card Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.creatorInfo}>
          <View style={styles.avatar}>
            <User size={16} color={theme.colors.neutral.medium} />
          </View>
          <View>
            <Text style={styles.creatorName}>{recipe.creator}</Text>
            <View style={styles.creatorTypeContainer}>
              <ChefHat size={12} color={theme.colors.neutral.medium} />
              <Text style={styles.creatorType}>{recipe.creatorType}</Text>
            </View>
          </View>
        </View>
        <View style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Recipe</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF', // Menggunakan putih solid untuk kartu
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  titleContainer: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  title: {
    fontSize: 18,
    fontFamily: theme.font.bold,
    color: theme.colors.neutral.dark,
  },
  privateBadge: {
    backgroundColor: theme.colors.primary.bg, // Menggunakan warna dari tema
    borderColor: theme.colors.primary.light,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  privateBadgeText: {
    fontSize: 10,
    fontFamily: theme.font.bold,
    color: theme.colors.primary.dark, // Menggunakan warna dari tema
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.bg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  timeText: {
    fontSize: 12,
    marginLeft: 4,
    color: theme.colors.neutral.medium,
    fontFamily: theme.font.medium,
  },
  description: {
    fontSize: 14,
    color: theme.colors.neutral.medium,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
    fontFamily: theme.font.regular,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.light,
    paddingTop: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.neutral.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
  },
  creatorName: {
    fontSize: 14,
    fontFamily: theme.font.bold,
    color: theme.colors.neutral.dark,
  },
  creatorTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  creatorType: {
    fontSize: 12,
    color: theme.colors.neutral.medium,
    marginLeft: 4,
    fontFamily: theme.font.regular,
  },
  viewButton: {
    backgroundColor: theme.colors.primary.bg,
    borderColor: theme.colors.primary.light,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  viewButtonText: {
    color: theme.colors.primary.dark,
    fontSize: 12,
    fontFamily: theme.font.bold,
  },
});

export default RecipeCard;