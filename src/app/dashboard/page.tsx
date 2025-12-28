'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  ChefHat, 
  Crown, 
  Coffee, 
  Sun, 
  Moon, 
  Sparkles,
  LogOut,
  Plus,
  X,
  Clock,
  TrendingUp,
  BookOpen,
  Star,
  Search,
  Calendar,
  Heart,
  Flame,
  Leaf,
  MessageSquare,
  History,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Info,
  Lightbulb,
  Edit2,
  Save,
  Loader2
} from 'lucide-react';
import { User, MealType, Ingredient, Recipe, INGREDIENTS_DATABASE, HEALTHY_RECIPES_DATABASE, FREE_PLAN_LIMIT, PREMIUM_PRICE, WeeklyMealPlan } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type ViewMode = 'create' | 'search' | 'weekly';

interface SearchHistory {
  id: string;
  query: string;
  timestamp: number;
  mealType: MealType;
}

interface RecipeSuggestion {
  name: string;
  matchPercentage: number;
  missingIngredients: string[];
}

// Banco de dados de receitas tradicionais brasileiras e internacionais com imagens reais
const TRADITIONAL_RECIPES = {
  breakfast: [
    {
      name: 'Panquecas Americanas',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
      ingredients: ['farinha', 'ovos', 'leite', 'açúcar'],
      prepTime: '25 min',
      difficulty: 'easy' as const,
      calories: 320
    },
    {
      name: 'Omelete Recheada',
      image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&h=600&fit=crop',
      ingredients: ['ovos', 'queijo', 'presunto', 'tomate'],
      prepTime: '15 min',
      difficulty: 'easy' as const,
      calories: 280
    },
    {
      name: 'Tapioca Recheada',
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&h=600&fit=crop',
      ingredients: ['tapioca', 'queijo', 'coco', 'leite condensado'],
      prepTime: '20 min',
      difficulty: 'easy' as const,
      calories: 350
    },
    {
      name: 'Pão na Chapa com Ovo',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop',
      ingredients: ['pão', 'ovos', 'manteiga', 'queijo'],
      prepTime: '10 min',
      difficulty: 'easy' as const,
      calories: 290
    }
  ],
  lunch: [
    {
      name: 'Arroz com Feijão e Bife Acebolado',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
      ingredients: ['arroz', 'feijão', 'carne', 'cebola'],
      prepTime: '45 min',
      difficulty: 'medium' as const,
      calories: 580
    },
    {
      name: 'Frango Grelhado com Legumes',
      image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop',
      ingredients: ['frango', 'cenoura', 'brócolis', 'batata'],
      prepTime: '40 min',
      difficulty: 'medium' as const,
      calories: 420
    },
    {
      name: 'Macarrão à Bolonhesa',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
      ingredients: ['macarrão', 'carne moída', 'tomate', 'cebola'],
      prepTime: '35 min',
      difficulty: 'easy' as const,
      calories: 520
    },
    {
      name: 'Peixe Assado com Batatas',
      image: 'https://images.unsplash.com/photo-1580959375944-c6d8f8c6e7d7?w=800&h=600&fit=crop',
      ingredients: ['peixe', 'batata', 'limão', 'alho'],
      prepTime: '50 min',
      difficulty: 'medium' as const,
      calories: 380
    },
    {
      name: 'Strogonoff de Frango',
      image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=600&fit=crop',
      ingredients: ['frango', 'creme de leite', 'champignon', 'batata palha'],
      prepTime: '30 min',
      difficulty: 'easy' as const,
      calories: 480
    }
  ],
  dinner: [
    {
      name: 'Sopa de Legumes',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop',
      ingredients: ['cenoura', 'batata', 'abóbora', 'cebola'],
      prepTime: '35 min',
      difficulty: 'easy' as const,
      calories: 180
    },
    {
      name: 'Sanduíche Natural',
      image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&h=600&fit=crop',
      ingredients: ['pão integral', 'frango', 'alface', 'tomate'],
      prepTime: '15 min',
      difficulty: 'easy' as const,
      calories: 320
    },
    {
      name: 'Salada Caesar com Frango',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop',
      ingredients: ['alface', 'frango', 'parmesão', 'croutons'],
      prepTime: '25 min',
      difficulty: 'easy' as const,
      calories: 380
    },
    {
      name: 'Risoto de Cogumelos',
      image: 'https://images.unsplash.com/photo-1476124369491-c4ca6e8e0b8f?w=800&h=600&fit=crop',
      ingredients: ['arroz arbóreo', 'cogumelos', 'queijo', 'vinho branco'],
      prepTime: '40 min',
      difficulty: 'medium' as const,
      calories: 450
    }
  ]
};

// Função para buscar receita tradicional baseada nos ingredientes
async function fetchTraditionalRecipe(ingredients: string[], mealType: MealType): Promise<Recipe> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const ingredientNames = ingredients.join(', ');
  const recipes = TRADITIONAL_RECIPES[mealType];
  
  // Seleciona receita aleatória do tipo de refeição
  const selectedRecipe = recipes[Math.floor(Math.random() * recipes.length)];
  
  // Gera instruções detalhadas
  const instructions = [
    `Separe todos os ingredientes: ${ingredientNames}. Lave bem os ingredientes frescos em água corrente.`,
    `Prepare os ingredientes principais: corte em pedaços uniformes para garantir cozimento homogêneo.`,
    `Tempere com sal, pimenta-do-reino e ervas frescas a gosto.`,
    `Aqueça uma panela em fogo médio com 2 colheres de sopa de azeite.`,
    `Adicione os ingredientes e refogue por 5-7 minutos, mexendo ocasionalmente.`,
    `Cozinhe até atingir a textura e sabor desejados, ajustando o tempero conforme necessário.`,
    `Finalize com um toque de limão ou ervas frescas picadas.`,
    `Sirva imediatamente em pratos aquecidos. Bom apetite!`
  ];
  
  return {
    id: Date.now().toString(),
    title: selectedRecipe.name,
    mealType,
    ingredients,
    instructions,
    prepTime: selectedRecipe.prepTime,
    difficulty: selectedRecipe.difficulty,
    calories: selectedRecipe.calories,
    protein: Math.round(selectedRecipe.calories * 0.25 / 4),
    carbs: Math.round(selectedRecipe.calories * 0.45 / 4),
    fats: Math.round(selectedRecipe.calories * 0.30 / 9),
    isHealthy: true,
    tags: ['Tradicional', 'Caseiro', 'Nutritivo'],
    imageUrl: selectedRecipe.image
  };
}

// Função para gerar sugestões de receitas baseadas nos ingredientes selecionados
function generateRecipeSuggestions(selectedIngredients: string[]): RecipeSuggestion[] {
  if (selectedIngredients.length === 0) return [];

  const selectedNames = INGREDIENTS_DATABASE
    .filter(ing => selectedIngredients.includes(ing.id))
    .map(ing => ing.name.toLowerCase());

  const suggestions: RecipeSuggestion[] = [];

  // Analisa receitas do banco de dados
  HEALTHY_RECIPES_DATABASE.forEach(recipe => {
    const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
    const matchingIngredients = selectedNames.filter(ing => 
      recipeIngredients.some(recIng => recIng.includes(ing) || ing.includes(recIng))
    );
    
    if (matchingIngredients.length > 0) {
      const matchPercentage = Math.round((matchingIngredients.length / recipeIngredients.length) * 100);
      const missingIngredients = recipeIngredients.filter(recIng => 
        !selectedNames.some(ing => recIng.includes(ing) || ing.includes(recIng))
      );

      suggestions.push({
        name: recipe.title,
        matchPercentage,
        missingIngredients: missingIngredients.slice(0, 3)
      });
    }
  });

  return suggestions.sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 5);
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('create');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [recipeSuggestions, setRecipeSuggestions] = useState<RecipeSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMealPlan[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [showGoogleSearch, setShowGoogleSearch] = useState(false);
  const [googleSearchQuery, setGoogleSearchQuery] = useState('');
  const [editingMeal, setEditingMeal] = useState<{ dayId: string; mealType: MealType } | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/');
          return;
        }

        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
          plan: 'free',
          recipesUsed: 0,
          maxRecipes: FREE_PLAN_LIMIT
        };

        setUser(userData);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/');
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuth();

    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
    
    const savedWeeklyPlan = localStorage.getItem('weeklyPlan');
    if (savedWeeklyPlan) {
      setWeeklyPlan(JSON.parse(savedWeeklyPlan));
    } else {
      const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
      const initialPlan = days.map((day, index) => ({
        id: `day-${index}`,
        dayOfWeek: day,
        breakfast: null,
        lunch: null,
        dinner: null
      }));
      setWeeklyPlan(initialPlan);
    }
  }, [router]);

  useEffect(() => {
    if (weeklyPlan.length > 0) {
      localStorage.setItem('weeklyPlan', JSON.stringify(weeklyPlan));
    }
  }, [weeklyPlan]);

  useEffect(() => {
    if (selectedIngredients.length > 0) {
      const suggestions = generateRecipeSuggestions(selectedIngredients);
      setRecipeSuggestions(suggestions);
    } else {
      setRecipeSuggestions([]);
    }
  }, [selectedIngredients]);

  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  const addToSearchHistory = (query: string, mealType: MealType) => {
    if (!query.trim()) return;
    
    const newSearch: SearchHistory = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: Date.now(),
      mealType
    };
    
    setSearchHistory(prev => [newSearch, ...prev.filter(s => s.query !== query.trim())].slice(0, 10));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const loadSearchFromHistory = (search: SearchHistory) => {
    setSearchQuery(search.query);
    setSelectedMealType(search.mealType);
    setShowSearchHistory(false);
  };

  const openGoogleSearch = (recipeName: string) => {
    setGoogleSearchQuery(recipeName);
    setShowGoogleSearch(true);
  };

  const toggleIngredient = (ingredientId: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  const generateRecipes = async () => {
    if (!user) return;

    if (user.plan === 'free' && user.recipesUsed >= user.maxRecipes) {
      setShowUpgradeModal(true);
      return;
    }

    if (selectedIngredients.length < 2) {
      toast.error('Selecione pelo menos 2 ingredientes!');
      return;
    }

    setIsGenerating(true);

    const selectedIngredientNames = INGREDIENTS_DATABASE
      .filter(ing => selectedIngredients.includes(ing.id))
      .map(ing => ing.name);

    // Gera 3 receitas tradicionais com imagens reais
    const recipe1 = await fetchTraditionalRecipe(selectedIngredientNames, selectedMealType);
    const recipe2 = await fetchTraditionalRecipe(selectedIngredientNames.slice(0, Math.max(3, selectedIngredientNames.length - 1)), selectedMealType);
    const recipe3 = await fetchTraditionalRecipe([selectedIngredientNames[0], ...selectedIngredientNames.slice(2)], selectedMealType);

    const mockRecipes: Recipe[] = [recipe1, recipe2, recipe3];

    setGeneratedRecipes(mockRecipes);

    const updatedUser = {
      ...user,
      recipesUsed: user.recipesUsed + 1
    };
    setUser(updatedUser);

    setIsGenerating(false);
  };

  const upgradeToPremium = () => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      plan: 'premium' as const,
      maxRecipes: Infinity
    };
    setUser(updatedUser);
    setShowUpgradeModal(false);
    toast.success('Upgrade para Premium realizado com sucesso!');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) {
      toast.error('Por favor, escreva seu feedback antes de enviar.');
      return;
    }
    
    console.log('Feedback enviado:', feedbackText);
    
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackText('');
      setFeedbackSubmitted(false);
    }, 2000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      addToSearchHistory(query, selectedMealType);
    }
  };

  const filteredHealthyRecipes = HEALTHY_RECIPES_DATABASE.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         recipe.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedMealType && viewMode === 'search') {
      return matchesSearch && recipe.mealType === selectedMealType;
    }
    
    return matchesSearch;
  });

  const addRecipeToWeeklyPlan = (dayId: string, mealType: MealType, recipe: Recipe) => {
    setWeeklyPlan(prev => prev.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          [mealType]: recipe
        };
      }
      return day;
    }));
    setSelectedRecipe(null);
  };

  const removeRecipeFromWeeklyPlan = (dayId: string, mealType: MealType) => {
    setWeeklyPlan(prev => prev.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          [mealType]: null
        };
      }
      return day;
    }));
  };

  const startEditingMeal = (dayId: string, mealType: MealType, currentText: string) => {
    setEditingMeal({ dayId, mealType });
    setEditingText(currentText);
  };

  const saveEditedMeal = () => {
    if (!editingMeal || !editingText.trim()) return;

    const customRecipe: Recipe = {
      id: `custom-${Date.now()}`,
      title: editingText.trim(),
      mealType: editingMeal.mealType,
      ingredients: [],
      instructions: [],
      prepTime: '-',
      difficulty: 'easy',
      isHealthy: false
    };

    addRecipeToWeeklyPlan(editingMeal.dayId, editingMeal.mealType, customRecipe);
    setEditingMeal(null);
    setEditingText('');
  };

  const cancelEditing = () => {
    setEditingMeal(null);
    setEditingText('');
  };

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const mealTypes: { type: MealType; label: string; icon: any }[] = [
    { type: 'breakfast', label: 'Café da Manhã', icon: Coffee },
    { type: 'lunch', label: 'Almoço', icon: Sun },
    { type: 'dinner', label: 'Jantar', icon: Moon }
  ];

  const groupedIngredients = INGREDIENTS_DATABASE.reduce((acc, ingredient) => {
    if (!acc[ingredient.category]) {
      acc[ingredient.category] = [];
    }
    acc[ingredient.category].push(ingredient);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background atrativo com imagens de comida - MUITO MAIS NÍTIDO */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/70 via-pink-900/70 to-purple-900/70 dark:from-gray-900/85 dark:via-gray-800/85 dark:to-gray-900/85"></div>
        <div 
          className="absolute inset-0 opacity-50 dark:opacity-25 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop')`,
            filter: 'blur(0px)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                    ReceitaFácil
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Olá, {user.name}!</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                
                {user.plan === 'free' ? (
                  <Button
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white gap-2 shadow-lg"
                  >
                    <Crown className="w-4 h-4" />
                    <span className="hidden sm:inline">Upgrade Premium</span>
                  </Button>
                ) : (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white gap-1 px-3 py-1 shadow-lg">
                    <Crown className="w-3 h-3" />
                    Premium
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {user.plan === 'free' && (
              <div className="mt-3 p-3 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 rounded-xl shadow-md">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Receitas usadas hoje: {user.recipesUsed}/{user.maxRecipes}
                  </span>
                  <span className="text-orange-600 dark:text-orange-400 font-semibold">
                    {user.maxRecipes - user.recipesUsed} restantes
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* View Mode Selector */}
            <Card className="p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-2xl border-2 border-white/50 dark:border-gray-700/50">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">O que você quer fazer hoje?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setViewMode('create')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                    viewMode === 'create'
                      ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/30 dark:to-pink-900/30 scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800 bg-white dark:bg-gray-800'
                  }`}
                >
                  <Sparkles className={`w-8 h-8 mx-auto mb-2 ${
                    viewMode === 'create' ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'
                  }`} />
                  <p className={`font-semibold ${
                    viewMode === 'create' ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Criar Receita
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Com seus ingredientes</p>
                </button>

                <button
                  onClick={() => setViewMode('search')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                    viewMode === 'search'
                      ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 bg-white dark:bg-gray-800'
                  }`}
                >
                  <Search className={`w-8 h-8 mx-auto mb-2 ${
                    viewMode === 'search' ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                  }`} />
                  <p className={`font-semibold ${
                    viewMode === 'search' ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Receitas Saudáveis
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Prontas e nutritivas</p>
                </button>

                <button
                  onClick={() => setViewMode('weekly')}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                    viewMode === 'weekly'
                      ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 bg-white dark:bg-gray-800'
                  }`}
                >
                  <Calendar className={`w-8 h-8 mx-auto mb-2 ${
                    viewMode === 'weekly' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                  }`} />
                  <p className={`font-semibold ${
                    viewMode === 'weekly' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Plano Semanal
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Organize sua semana</p>
                </button>
              </div>
            </Card>

            {/* Create Recipe Mode */}
            {viewMode === 'create' && (
              <>
                {/* Meal Type Selection */}
                <Card className="p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-2xl border-2 border-white/50 dark:border-gray-700/50">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Escolha a refeição</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {mealTypes.map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        onClick={() => setSelectedMealType(type)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                          selectedMealType === type
                            ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/30 dark:to-pink-900/30 scale-105'
                            : 'border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${
                          selectedMealType === type ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400'
                        }`} />
                        <p className={`font-semibold ${
                          selectedMealType === type ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {label}
                        </p>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Ingredients Selection */}
                <Card className="p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-2xl border-2 border-white/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Seus ingredientes</h2>
                    {selectedIngredients.length > 0 && (
                      <Badge variant="secondary" className="text-sm dark:bg-gray-700 dark:text-gray-300 shadow-md">
                        {selectedIngredients.length} selecionados
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-6">
                    {Object.entries(groupedIngredients).map(([category, ingredients]) => (
                      <div key={category}>
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                          {category}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {ingredients.map((ingredient) => (
                            <button
                              key={ingredient.id}
                              onClick={() => toggleIngredient(ingredient.id)}
                              className={`p-3 rounded-xl border-2 transition-all duration-300 shadow-md hover:shadow-lg ${
                                selectedIngredients.includes(ingredient.id)
                                  ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/30 dark:to-pink-900/30 scale-105'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800 bg-white dark:bg-gray-800 hover:scale-105'
                              }`}
                            >
                              <div className="text-3xl mb-1">{ingredient.icon}</div>
                              <p className={`text-xs font-medium ${
                                selectedIngredients.includes(ingredient.id)
                                  ? 'text-orange-600 dark:text-orange-400'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {ingredient.name}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={generateRecipes}
                    disabled={isGenerating || selectedIngredients.length < 2}
                    className="w-full mt-6 h-14 bg-gradient-to-r from-orange-400 to-pink-600 hover:from-orange-500 hover:to-pink-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Criando receitas tradicionais...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Gerar Receitas Tradicionais
                      </>
                    )}
                  </Button>
                </Card>

                {/* Generated Recipes */}
                {generatedRecipes.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white dark:text-gray-100 drop-shadow-lg">Suas receitas personalizadas</h2>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                        {generatedRecipes.length} receitas geradas
                      </Badge>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {generatedRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} onSearchGoogle={openGoogleSearch} showDetailedInstructions showCalories />
                      ))}
                    </div>
                  </div>
                )}

                {/* Recipe Suggestions */}
                {recipeSuggestions.length > 0 && (
                  <Card className="p-6 bg-gradient-to-br from-blue-50/95 to-cyan-50/95 dark:from-blue-900/40 dark:to-cyan-900/40 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-800 shadow-2xl rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Sugestões de Receitas</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Baseadas nos seus ingredientes selecionados</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {recipeSuggestions.map((suggestion, idx) => (
                        <div key={idx} className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-all">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">{suggestion.name}</h4>
                            <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 shadow-sm">
                              {suggestion.matchPercentage}% compatível
                            </Badge>
                          </div>
                          {suggestion.missingIngredients.length > 0 && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Faltam: {suggestion.missingIngredients.join(', ')}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            )}

            {/* Search Healthy Recipes Mode */}
            {viewMode === 'search' && (
              <>
                <Card className="p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-2xl border-2 border-white/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Leaf className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Receitas Saudáveis</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Prontas, nutritivas e deliciosas</p>
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar por nome, ingrediente ou tag..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => setShowSearchHistory(true)}
                      className="pl-10 pr-10 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-400 dark:focus:border-green-600 dark:bg-gray-900 dark:text-gray-100 shadow-md"
                    />
                    {searchHistory.length > 0 && (
                      <button
                        onClick={() => setShowSearchHistory(!showSearchHistory)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <History className="w-5 h-5" />
                      </button>
                    )}

                    {showSearchHistory && searchHistory.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-10 max-h-64 overflow-y-auto">
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pesquisas Recentes</span>
                          <button
                            onClick={clearSearchHistory}
                            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Limpar
                          </button>
                        </div>
                        {searchHistory.map((search) => (
                          <button
                            key={search.id}
                            onClick={() => loadSearchFromHistory(search)}
                            className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <History className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">{search.query}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                                {mealTypes.find(m => m.type === search.mealType)?.label}
                              </Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {mealTypes.map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        onClick={() => setSelectedMealType(type)}
                        className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                          selectedMealType === type
                            ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 scale-105'
                            : 'border-gray-200 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${
                          selectedMealType === type ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                        }`} />
                        <span className={`font-semibold text-sm ${
                          selectedMealType === type ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {filteredHealthyRecipes.length} receitas encontradas
                  </p>
                </Card>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHealthyRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} showNutrition onSearchGoogle={openGoogleSearch} />
                  ))}
                </div>
              </>
            )}

            {/* Weekly Meal Plan Mode */}
            {viewMode === 'weekly' && (
              <>
                <Card className="p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-2xl border-2 border-white/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Planejamento Semanal</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Organize suas refeições da semana - editável e salvo automaticamente</p>
                    </div>
                  </div>
                </Card>

                <div className="space-y-4">
                  {weeklyPlan.map((day) => (
                    <Card key={day.id} className="p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-2xl border-2 border-white/50 dark:border-gray-700/50">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{day.dayOfWeek}</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {mealTypes.map(({ type, label, icon: Icon }) => (
                          <div key={type} className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm shadow-md">
                            <div className="flex items-center gap-2 mb-3">
                              <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                              <span className="font-semibold text-gray-700 dark:text-gray-300">{label}</span>
                            </div>
                            
                            {editingMeal?.dayId === day.id && editingMeal?.mealType === type ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  placeholder="Digite o nome da refeição..."
                                  className="min-h-[80px] text-sm dark:bg-gray-900 dark:text-gray-100"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    onClick={saveEditedMeal}
                                    size="sm"
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <Save className="w-4 h-4 mr-1" />
                                    Salvar
                                  </Button>
                                  <Button
                                    onClick={cancelEditing}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            ) : day[type] ? (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{day[type]!.title}</p>
                                {day[type]!.prepTime && day[type]!.prepTime !== '-' && (
                                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    {day[type]!.prepTime}
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => startEditingMeal(day.id, type, day[type]!.title)}
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  >
                                    <Edit2 className="w-4 h-4 mr-1" />
                                    Editar
                                  </Button>
                                  <Button
                                    onClick={() => removeRecipeFromWeeklyPlan(day.id, type)}
                                    variant="ghost"
                                    size="sm"
                                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    Remover
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Button
                                  onClick={() => {
                                    setSelectedMealType(type);
                                    setSelectedRecipe({ dayId: day.id, mealType: type } as any);
                                  }}
                                  variant="outline"
                                  className="w-full border-dashed border-2 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Adicionar Receita
                                </Button>
                                <Button
                                  onClick={() => startEditingMeal(day.id, type, '')}
                                  variant="outline"
                                  className="w-full border-dashed border-2 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                  <Edit2 className="w-4 h-4 mr-1" />
                                  Digitar Manualmente
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>

                {selectedRecipe && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <Card className="max-w-4xl w-full p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl my-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          Escolha uma receita para {mealTypes.find(m => m.type === selectedMealType)?.label}
                        </h3>
                        <button
                          onClick={() => setSelectedRecipe(null)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                        {HEALTHY_RECIPES_DATABASE
                          .filter(r => r.mealType === selectedMealType)
                          .map((recipe) => (
                            <div
                              key={recipe.id}
                              onClick={() => {
                                const dayId = (selectedRecipe as any).dayId;
                                addRecipeToWeeklyPlan(dayId, selectedMealType, recipe);
                              }}
                              className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-all shadow-md hover:shadow-lg"
                            >
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{recipe.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <Clock className="w-4 h-4" />
                                {recipe.prepTime}
                              </div>
                              {recipe.tags && (
                                <div className="flex flex-wrap gap-1">
                                  {recipe.tags.map((tag, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Google Search Modal */}
      {showGoogleSearch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-6xl w-full h-[90vh] p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Pesquisa no Google</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Buscando: {googleSearchQuery}</p>
                </div>
              </div>
              <button
                onClick={() => setShowGoogleSearch(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-inner">
              <iframe
                src={`https://www.google.com/search?igu=1&q=${encodeURIComponent(googleSearchQuery + ' receita')}`}
                className="w-full h-full"
                title="Pesquisa Google"
              />
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-start gap-2 shadow-md">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900 dark:text-blue-300">
                Você está navegando no Google dentro do app. Clique em qualquer resultado para ver mais detalhes sobre a receita.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Feedback Button */}
      <button
        onClick={() => setShowFeedbackModal(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center z-40 group"
        title="Enviar Feedback"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="absolute right-14 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          Enviar Feedback
        </span>
      </button>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Seu Feedback</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Ajude-nos a melhorar</p>
                </div>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!feedbackSubmitted ? (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Compartilhe suas ideias, sugestões ou problemas. Sua opinião é muito importante para nós!
                </p>
                
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Digite seu feedback aqui..."
                  className="w-full h-32 p-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-xl focus:border-blue-400 dark:focus:border-blue-600 focus:outline-none resize-none text-sm shadow-inner"
                />

                <Button
                  onClick={handleFeedbackSubmit}
                  className="w-full mt-4 h-11 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Enviar Feedback
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Star className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Obrigado!</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Seu feedback foi enviado com sucesso. Vamos analisar e trabalhar nas melhorias!
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl relative">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Upgrade para Premium
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Você atingiu o limite do plano gratuito
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Receitas Ilimitadas</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gere quantas receitas quiser, sem limites</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <BookOpen className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Biblioteca de Receitas Premium</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Acesso a receitas exclusivas e gourmet</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Star className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Receitas Personalizadas Avançadas</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">IA avançada com sugestões nutricionais e substituições inteligentes</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Planejamento de Refeições Semanal</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Organize suas refeições da semana com lista de compras automática</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-4 mb-6 border border-purple-100 dark:border-purple-800 shadow-inner">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Apenas</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  R$ {PREMIUM_PRICE.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">por mês</p>
              </div>
            </div>

            <Button
              onClick={upgradeToPremium}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Crown className="w-5 h-5 mr-2" />
              Assinar Premium Agora
            </Button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Cancele quando quiser, sem compromisso
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}

// Recipe Card Component
function RecipeCard({ recipe, showNutrition = false, showDetailedInstructions = false, showCalories = false, onSearchGoogle }: { recipe: Recipe; showNutrition?: boolean; showDetailedInstructions?: boolean; showCalories?: boolean; onSearchGoogle?: (recipeName: string) => void }) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (index: number) => {
    setCompletedSteps(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Card className="p-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-2xl hover:shadow-3xl transition-all overflow-hidden border-2 border-white/50 dark:border-gray-700/50">
      {/* Imagem da receita */}
      {recipe.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-xl font-bold text-white drop-shadow-lg">{recipe.title}</h3>
          </div>
        </div>
      )}

      <div className="p-6">
        {!recipe.imageUrl && (
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{recipe.title}</h3>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 flex-wrap mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {recipe.prepTime}
          </div>
          <Badge variant="secondary" className="capitalize dark:bg-gray-700 dark:text-gray-300 shadow-sm">
            {recipe.difficulty === 'easy' ? 'Fácil' : recipe.difficulty === 'medium' ? 'Médio' : 'Difícil'}
          </Badge>
          {recipe.isHealthy && (
            <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 shadow-sm">
              <Heart className="w-3 h-3 mr-1" />
              Saudável
            </Badge>
          )}
        </div>

        {(showNutrition || showCalories) && recipe.calories && (
          <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl shadow-inner">
            <div className="text-center">
              <Flame className="w-4 h-4 mx-auto text-orange-600 dark:text-orange-400 mb-1" />
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{recipe.calories}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">kcal</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{recipe.protein}g</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Proteína</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{recipe.carbs}g</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{recipe.fats}g</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Gordura</p>
            </div>
          </div>
        )}

        {recipe.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 text-xs shadow-sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <span>Ingredientes:</span>
              <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300 shadow-sm">
                {recipe.ingredients.length} itens
              </Badge>
            </h4>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((ing, idx) => (
                <Badge key={idx} variant="outline" className="bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 shadow-sm">
                  {ing}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>Modo de preparo:</span>
                {showDetailedInstructions && (
                  <Badge className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs shadow-sm">
                    Detalhado
                  </Badge>
                )}
              </h4>
              {onSearchGoogle && (
                <Button
                  onClick={() => onSearchGoogle(recipe.title)}
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm"
                >
                  <Search className="w-3 h-3" />
                  Buscar no Google
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {recipe.instructions.map((instruction, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 p-3 rounded-lg transition-all cursor-pointer shadow-sm hover:shadow-md ${
                    completedSteps.includes(idx)
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                  onClick={() => toggleStep(idx)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {completedSteps.includes(idx) ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center shadow-sm">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{idx + 1}</span>
                      </div>
                    )}
                  </div>
                  <p className={`text-sm flex-1 ${
                    completedSteps.includes(idx)
                      ? 'text-green-700 dark:text-green-300 line-through'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {instruction}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-start gap-2 shadow-sm">
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 dark:text-blue-300">
                Clique nos passos para marcá-los como concluídos e acompanhar seu progresso!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
