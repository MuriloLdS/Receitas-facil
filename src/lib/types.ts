// Types para o app de receitas

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export type SubscriptionPlan = 'free' | 'premium';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: SubscriptionPlan;
  recipesUsed: number;
  maxRecipes: number;
}

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export interface Recipe {
  id: string;
  title: string;
  mealType: MealType;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  isHealthy?: boolean;
  tags?: string[];
}

export interface WeeklyMealPlan {
  id: string;
  dayOfWeek: string;
  breakfast: Recipe | null;
  lunch: Recipe | null;
  dinner: Recipe | null;
}

export const INGREDIENTS_DATABASE: Ingredient[] = [
  // Proteínas (20 itens)
  { id: '1', name: 'Frango', category: 'Proteínas', icon: '🍗' },
  { id: '2', name: 'Carne Bovina', category: 'Proteínas', icon: '🥩' },
  { id: '3', name: 'Carne Suína', category: 'Proteínas', icon: '🥓' },
  { id: '4', name: 'Peixe', category: 'Proteínas', icon: '🐟' },
  { id: '5', name: 'Camarão', category: 'Proteínas', icon: '🦐' },
  { id: '6', name: 'Ovos', category: 'Proteínas', icon: '🥚' },
  { id: '7', name: 'Queijo Mussarela', category: 'Proteínas', icon: '🧀' },
  { id: '8', name: 'Queijo Parmesão', category: 'Proteínas', icon: '🧀' },
  { id: '9', name: 'Queijo Cheddar', category: 'Proteínas', icon: '🧀' },
  { id: '10', name: 'Presunto', category: 'Proteínas', icon: '🥓' },
  { id: '11', name: 'Salsicha', category: 'Proteínas', icon: '🌭' },
  { id: '12', name: 'Bacon', category: 'Proteínas', icon: '🥓' },
  { id: '13', name: 'Atum', category: 'Proteínas', icon: '🐟' },
  { id: '14', name: 'Sardinha', category: 'Proteínas', icon: '🐟' },
  { id: '15', name: 'Linguiça', category: 'Proteínas', icon: '🌭' },
  { id: '16', name: 'Peru', category: 'Proteínas', icon: '🦃' },
  { id: '17', name: 'Salame', category: 'Proteínas', icon: '🥓' },
  { id: '18', name: 'Mortadela', category: 'Proteínas', icon: '🥓' },
  { id: '19', name: 'Tofu', category: 'Proteínas', icon: '🥡' },
  { id: '20', name: 'Grão de Bico', category: 'Proteínas', icon: '🫘' },
  
  // Carboidratos (25 itens)
  { id: '21', name: 'Arroz Branco', category: 'Carboidratos', icon: '🍚' },
  { id: '22', name: 'Arroz Integral', category: 'Carboidratos', icon: '🍚' },
  { id: '23', name: 'Macarrão', category: 'Carboidratos', icon: '🍝' },
  { id: '24', name: 'Macarrão Integral', category: 'Carboidratos', icon: '🍝' },
  { id: '25', name: 'Pão Francês', category: 'Carboidratos', icon: '🥖' },
  { id: '26', name: 'Pão de Forma', category: 'Carboidratos', icon: '🍞' },
  { id: '27', name: 'Pão Integral', category: 'Carboidratos', icon: '🍞' },
  { id: '28', name: 'Batata', category: 'Carboidratos', icon: '🥔' },
  { id: '29', name: 'Batata Doce', category: 'Carboidratos', icon: '🍠' },
  { id: '30', name: 'Mandioca', category: 'Carboidratos', icon: '🥔' },
  { id: '31', name: 'Farinha de Trigo', category: 'Carboidratos', icon: '🌾' },
  { id: '32', name: 'Aveia', category: 'Carboidratos', icon: '🌾' },
  { id: '33', name: 'Granola', category: 'Carboidratos', icon: '🥣' },
  { id: '34', name: 'Cereal', category: 'Carboidratos', icon: '🥣' },
  { id: '35', name: 'Biscoito', category: 'Carboidratos', icon: '🍪' },
  { id: '36', name: 'Torrada', category: 'Carboidratos', icon: '🍞' },
  { id: '37', name: 'Tapioca', category: 'Carboidratos', icon: '🥞' },
  { id: '38', name: 'Polenta', category: 'Carboidratos', icon: '🌽' },
  { id: '39', name: 'Quinoa', category: 'Carboidratos', icon: '🌾' },
  { id: '40', name: 'Cuscuz', category: 'Carboidratos', icon: '🌾' },
  { id: '41', name: 'Nhoque', category: 'Carboidratos', icon: '🥟' },
  { id: '42', name: 'Lasanha', category: 'Carboidratos', icon: '🍝' },
  { id: '43', name: 'Pizza', category: 'Carboidratos', icon: '🍕' },
  { id: '44', name: 'Tortilha', category: 'Carboidratos', icon: '🌮' },
  { id: '45', name: 'Pão de Queijo', category: 'Carboidratos', icon: '🧀' },
  
  // Vegetais (30 itens)
  { id: '46', name: 'Tomate', category: 'Vegetais', icon: '🍅' },
  { id: '47', name: 'Alface', category: 'Vegetais', icon: '🥬' },
  { id: '48', name: 'Cebola', category: 'Vegetais', icon: '🧅' },
  { id: '49', name: 'Cenoura', category: 'Vegetais', icon: '🥕' },
  { id: '50', name: 'Brócolis', category: 'Vegetais', icon: '🥦' },
  { id: '51', name: 'Couve-flor', category: 'Vegetais', icon: '🥦' },
  { id: '52', name: 'Abobrinha', category: 'Vegetais', icon: '🥒' },
  { id: '53', name: 'Berinjela', category: 'Vegetais', icon: '🍆' },
  { id: '54', name: 'Pimentão', category: 'Vegetais', icon: '🫑' },
  { id: '55', name: 'Pepino', category: 'Vegetais', icon: '🥒' },
  { id: '56', name: 'Espinafre', category: 'Vegetais', icon: '🥬' },
  { id: '57', name: 'Couve', category: 'Vegetais', icon: '🥬' },
  { id: '58', name: 'Repolho', category: 'Vegetais', icon: '🥬' },
  { id: '59', name: 'Rúcula', category: 'Vegetais', icon: '🥬' },
  { id: '60', name: 'Agrião', category: 'Vegetais', icon: '🥬' },
  { id: '61', name: 'Beterraba', category: 'Vegetais', icon: '🥕' },
  { id: '62', name: 'Rabanete', category: 'Vegetais', icon: '🥕' },
  { id: '63', name: 'Nabo', category: 'Vegetais', icon: '🥕' },
  { id: '64', name: 'Abóbora', category: 'Vegetais', icon: '🎃' },
  { id: '65', name: 'Milho', category: 'Vegetais', icon: '🌽' },
  { id: '66', name: 'Ervilha', category: 'Vegetais', icon: '🫛' },
  { id: '67', name: 'Vagem', category: 'Vegetais', icon: '🫛' },
  { id: '68', name: 'Cogumelo', category: 'Vegetais', icon: '🍄' },
  { id: '69', name: 'Alho', category: 'Vegetais', icon: '🧄' },
  { id: '70', name: 'Gengibre', category: 'Vegetais', icon: '🫚' },
  { id: '71', name: 'Batata Inglesa', category: 'Vegetais', icon: '🥔' },
  { id: '72', name: 'Chuchu', category: 'Vegetais', icon: '🥒' },
  { id: '73', name: 'Quiabo', category: 'Vegetais', icon: '🥒' },
  { id: '74', name: 'Jiló', category: 'Vegetais', icon: '🥒' },
  { id: '75', name: 'Acelga', category: 'Vegetais', icon: '🥬' },
  
  // Laticínios (15 itens)
  { id: '76', name: 'Leite Integral', category: 'Laticínios', icon: '🥛' },
  { id: '77', name: 'Leite Desnatado', category: 'Laticínios', icon: '🥛' },
  { id: '78', name: 'Leite Condensado', category: 'Laticínios', icon: '🥛' },
  { id: '79', name: 'Creme de Leite', category: 'Laticínios', icon: '🥛' },
  { id: '80', name: 'Iogurte Natural', category: 'Laticínios', icon: '🥛' },
  { id: '81', name: 'Iogurte Grego', category: 'Laticínios', icon: '🥛' },
  { id: '82', name: 'Manteiga', category: 'Laticínios', icon: '🧈' },
  { id: '83', name: 'Margarina', category: 'Laticínios', icon: '🧈' },
  { id: '84', name: 'Requeijão', category: 'Laticínios', icon: '🧈' },
  { id: '85', name: 'Cream Cheese', category: 'Laticínios', icon: '🧀' },
  { id: '86', name: 'Queijo Cottage', category: 'Laticínios', icon: '🧀' },
  { id: '87', name: 'Queijo Ricota', category: 'Laticínios', icon: '🧀' },
  { id: '88', name: 'Queijo Minas', category: 'Laticínios', icon: '🧀' },
  { id: '89', name: 'Nata', category: 'Laticínios', icon: '🥛' },
  { id: '90', name: 'Chantilly', category: 'Laticínios', icon: '🥛' },
  
  // Frutas (25 itens)
  { id: '91', name: 'Banana', category: 'Frutas', icon: '🍌' },
  { id: '92', name: 'Maçã', category: 'Frutas', icon: '🍎' },
  { id: '93', name: 'Morango', category: 'Frutas', icon: '🍓' },
  { id: '94', name: 'Laranja', category: 'Frutas', icon: '🍊' },
  { id: '95', name: 'Limão', category: 'Frutas', icon: '🍋' },
  { id: '96', name: 'Abacaxi', category: 'Frutas', icon: '🍍' },
  { id: '97', name: 'Manga', category: 'Frutas', icon: '🥭' },
  { id: '98', name: 'Mamão', category: 'Frutas', icon: '🍈' },
  { id: '99', name: 'Melancia', category: 'Frutas', icon: '🍉' },
  { id: '100', name: 'Melão', category: 'Frutas', icon: '🍈' },
  { id: '101', name: 'Uva', category: 'Frutas', icon: '🍇' },
  { id: '102', name: 'Pêra', category: 'Frutas', icon: '🍐' },
  { id: '103', name: 'Pêssego', category: 'Frutas', icon: '🍑' },
  { id: '104', name: 'Ameixa', category: 'Frutas', icon: '🍑' },
  { id: '105', name: 'Kiwi', category: 'Frutas', icon: '🥝' },
  { id: '106', name: 'Abacate', category: 'Frutas', icon: '🥑' },
  { id: '107', name: 'Coco', category: 'Frutas', icon: '🥥' },
  { id: '108', name: 'Maracujá', category: 'Frutas', icon: '🍈' },
  { id: '109', name: 'Goiaba', category: 'Frutas', icon: '🍈' },
  { id: '110', name: 'Acerola', category: 'Frutas', icon: '🍒' },
  { id: '111', name: 'Cereja', category: 'Frutas', icon: '🍒' },
  { id: '112', name: 'Framboesa', category: 'Frutas', icon: '🫐' },
  { id: '113', name: 'Mirtilo', category: 'Frutas', icon: '🫐' },
  { id: '114', name: 'Amora', category: 'Frutas', icon: '🫐' },
  { id: '115', name: 'Tangerina', category: 'Frutas', icon: '🍊' },
  
  // Temperos e Condimentos (20 itens)
  { id: '116', name: 'Sal', category: 'Temperos', icon: '🧂' },
  { id: '117', name: 'Pimenta do Reino', category: 'Temperos', icon: '🌶️' },
  { id: '118', name: 'Pimenta Vermelha', category: 'Temperos', icon: '🌶️' },
  { id: '119', name: 'Orégano', category: 'Temperos', icon: '🌿' },
  { id: '120', name: 'Manjericão', category: 'Temperos', icon: '🌿' },
  { id: '121', name: 'Salsa', category: 'Temperos', icon: '🌿' },
  { id: '122', name: 'Cebolinha', category: 'Temperos', icon: '🌿' },
  { id: '123', name: 'Coentro', category: 'Temperos', icon: '🌿' },
  { id: '124', name: 'Alecrim', category: 'Temperos', icon: '🌿' },
  { id: '125', name: 'Tomilho', category: 'Temperos', icon: '🌿' },
  { id: '126', name: 'Cominho', category: 'Temperos', icon: '🌿' },
  { id: '127', name: 'Páprica', category: 'Temperos', icon: '🌶️' },
  { id: '128', name: 'Curry', category: 'Temperos', icon: '🌶️' },
  { id: '129', name: 'Açafrão', category: 'Temperos', icon: '🌿' },
  { id: '130', name: 'Canela', category: 'Temperos', icon: '🌿' },
  { id: '131', name: 'Cravo', category: 'Temperos', icon: '🌿' },
  { id: '132', name: 'Noz Moscada', category: 'Temperos', icon: '🌰' },
  { id: '133', name: 'Louro', category: 'Temperos', icon: '🍃' },
  { id: '134', name: 'Colorau', category: 'Temperos', icon: '🌶️' },
  { id: '135', name: 'Mostarda', category: 'Temperos', icon: '🌭' },
  
  // Molhos e Óleos (15 itens)
  { id: '136', name: 'Azeite', category: 'Molhos e Óleos', icon: '🫒' },
  { id: '137', name: 'Óleo de Soja', category: 'Molhos e Óleos', icon: '🛢️' },
  { id: '138', name: 'Óleo de Girassol', category: 'Molhos e Óleos', icon: '🛢️' },
  { id: '139', name: 'Vinagre', category: 'Molhos e Óleos', icon: '🧴' },
  { id: '140', name: 'Molho de Tomate', category: 'Molhos e Óleos', icon: '🍅' },
  { id: '141', name: 'Ketchup', category: 'Molhos e Óleos', icon: '🍅' },
  { id: '142', name: 'Maionese', category: 'Molhos e Óleos', icon: '🥚' },
  { id: '143', name: 'Shoyu', category: 'Molhos e Óleos', icon: '🥢' },
  { id: '144', name: 'Molho Inglês', category: 'Molhos e Óleos', icon: '🧴' },
  { id: '145', name: 'Molho de Pimenta', category: 'Molhos e Óleos', icon: '🌶️' },
  { id: '146', name: 'Molho Barbecue', category: 'Molhos e Óleos', icon: '🍖' },
  { id: '147', name: 'Molho Branco', category: 'Molhos e Óleos', icon: '🥛' },
  { id: '148', name: 'Molho Pesto', category: 'Molhos e Óleos', icon: '🌿' },
  { id: '149', name: 'Azeite de Dendê', category: 'Molhos e Óleos', icon: '🫒' },
  { id: '150', name: 'Óleo de Coco', category: 'Molhos e Óleos', icon: '🥥' },
  
  // Grãos e Leguminosas (15 itens)
  { id: '151', name: 'Feijão Preto', category: 'Grãos', icon: '🫘' },
  { id: '152', name: 'Feijão Carioca', category: 'Grãos', icon: '🫘' },
  { id: '153', name: 'Feijão Branco', category: 'Grãos', icon: '🫘' },
  { id: '154', name: 'Lentilha', category: 'Grãos', icon: '🫘' },
  { id: '155', name: 'Ervilha Seca', category: 'Grãos', icon: '🫛' },
  { id: '156', name: 'Soja', category: 'Grãos', icon: '🫘' },
  { id: '157', name: 'Amendoim', category: 'Grãos', icon: '🥜' },
  { id: '158', name: 'Castanha de Caju', category: 'Grãos', icon: '🌰' },
  { id: '159', name: 'Castanha do Pará', category: 'Grãos', icon: '🌰' },
  { id: '160', name: 'Amêndoa', category: 'Grãos', icon: '🌰' },
  { id: '161', name: 'Nozes', category: 'Grãos', icon: '🌰' },
  { id: '162', name: 'Avelã', category: 'Grãos', icon: '🌰' },
  { id: '163', name: 'Pistache', category: 'Grãos', icon: '🌰' },
  { id: '164', name: 'Semente de Girassol', category: 'Grãos', icon: '🌻' },
  { id: '165', name: 'Semente de Abóbora', category: 'Grãos', icon: '🎃' },
  
  // Doces e Açúcares (10 itens)
  { id: '166', name: 'Açúcar', category: 'Doces', icon: '🍬' },
  { id: '167', name: 'Açúcar Mascavo', category: 'Doces', icon: '🍬' },
  { id: '168', name: 'Mel', category: 'Doces', icon: '🍯' },
  { id: '169', name: 'Chocolate', category: 'Doces', icon: '🍫' },
  { id: '170', name: 'Chocolate em Pó', category: 'Doces', icon: '🍫' },
  { id: '171', name: 'Cacau em Pó', category: 'Doces', icon: '🍫' },
  { id: '172', name: 'Geleia', category: 'Doces', icon: '🍓' },
  { id: '173', name: 'Doce de Leite', category: 'Doces', icon: '🥛' },
  { id: '174', name: 'Nutella', category: 'Doces', icon: '🍫' },
  { id: '175', name: 'Pasta de Amendoim', category: 'Doces', icon: '🥜' },
];

// Banco de receitas prontas e saudáveis
export const HEALTHY_RECIPES_DATABASE: Recipe[] = [
  // Café da Manhã
  {
    id: 'h1',
    title: 'Bowl de Aveia com Frutas Vermelhas',
    mealType: 'breakfast',
    ingredients: ['Aveia', 'Morango', 'Mirtilo', 'Banana', 'Mel', 'Iogurte Grego'],
    instructions: [
      'Cozinhe a aveia em água ou leite desnatado por 5 minutos',
      'Corte as frutas em pedaços pequenos',
      'Monte o bowl com a aveia, frutas por cima',
      'Adicione uma colher de iogurte grego e mel a gosto',
      'Sirva imediatamente'
    ],
    prepTime: '15 min',
    difficulty: 'easy',
    calories: 320,
    protein: 12,
    carbs: 58,
    fats: 6,
    isHealthy: true,
    tags: ['Vegetariano', 'Rico em Fibras', 'Antioxidante']
  },
  {
    id: 'h2',
    title: 'Omelete de Claras com Espinafre',
    mealType: 'breakfast',
    ingredients: ['Ovos', 'Espinafre', 'Tomate', 'Cebola', 'Azeite', 'Sal', 'Pimenta do Reino'],
    instructions: [
      'Separe as claras de 3 ovos e bata levemente',
      'Refogue o espinafre com cebola em azeite',
      'Adicione as claras batidas na frigideira',
      'Coloque tomate picado por cima',
      'Deixe cozinhar até firmar e dobre ao meio',
      'Tempere com sal e pimenta'
    ],
    prepTime: '12 min',
    difficulty: 'easy',
    calories: 180,
    protein: 22,
    carbs: 8,
    fats: 7,
    isHealthy: true,
    tags: ['Alto Proteína', 'Baixo Carboidrato', 'Vegetariano']
  },
  {
    id: 'h3',
    title: 'Panqueca de Banana e Aveia',
    mealType: 'breakfast',
    ingredients: ['Banana', 'Ovos', 'Aveia', 'Canela', 'Mel'],
    instructions: [
      'Amasse 2 bananas maduras em um bowl',
      'Adicione 2 ovos e 3 colheres de aveia',
      'Misture bem e adicione canela a gosto',
      'Aqueça uma frigideira antiaderente',
      'Despeje pequenas porções da massa',
      'Vire quando começar a fazer bolhas',
      'Sirva com mel'
    ],
    prepTime: '18 min',
    difficulty: 'easy',
    calories: 280,
    protein: 14,
    carbs: 42,
    fats: 8,
    isHealthy: true,
    tags: ['Sem Glúten', 'Vegetariano', 'Energético']
  },
  {
    id: 'h4',
    title: 'Smoothie Verde Detox',
    mealType: 'breakfast',
    ingredients: ['Espinafre', 'Banana', 'Abacaxi', 'Gengibre', 'Água de Coco'],
    instructions: [
      'Lave bem as folhas de espinafre',
      'Corte a banana e o abacaxi em pedaços',
      'Rale um pedaço pequeno de gengibre',
      'Coloque tudo no liquidificador com água de coco',
      'Bata até ficar homogêneo',
      'Sirva gelado'
    ],
    prepTime: '8 min',
    difficulty: 'easy',
    calories: 150,
    protein: 3,
    carbs: 35,
    fats: 1,
    isHealthy: true,
    tags: ['Vegano', 'Detox', 'Hidratante']
  },

  // Almoço
  {
    id: 'h5',
    title: 'Salmão Grelhado com Legumes',
    mealType: 'lunch',
    ingredients: ['Peixe', 'Brócolis', 'Cenoura', 'Abobrinha', 'Limão', 'Azeite', 'Alho'],
    instructions: [
      'Tempere o salmão com limão, sal e pimenta',
      'Grelhe o salmão por 4 minutos de cada lado',
      'Cozinhe os legumes no vapor por 8 minutos',
      'Refogue o alho no azeite e adicione aos legumes',
      'Sirva o salmão com os legumes ao lado',
      'Finalize com um fio de azeite'
    ],
    prepTime: '25 min',
    difficulty: 'medium',
    calories: 420,
    protein: 38,
    carbs: 22,
    fats: 20,
    isHealthy: true,
    tags: ['Ômega 3', 'Alto Proteína', 'Baixo Carboidrato']
  },
  {
    id: 'h6',
    title: 'Frango Grelhado com Quinoa e Salada',
    mealType: 'lunch',
    ingredients: ['Frango', 'Quinoa', 'Alface', 'Tomate', 'Pepino', 'Limão', 'Azeite'],
    instructions: [
      'Tempere o peito de frango com limão, alho e ervas',
      'Grelhe o frango por 6 minutos de cada lado',
      'Cozinhe a quinoa em água por 15 minutos',
      'Prepare a salada com alface, tomate e pepino',
      'Tempere a salada com azeite e limão',
      'Monte o prato com frango, quinoa e salada'
    ],
    prepTime: '30 min',
    difficulty: 'medium',
    calories: 480,
    protein: 45,
    carbs: 38,
    fats: 15,
    isHealthy: true,
    tags: ['Alto Proteína', 'Completo', 'Sem Glúten']
  },
  {
    id: 'h7',
    title: 'Bowl Mediterrâneo de Grão de Bico',
    mealType: 'lunch',
    ingredients: ['Grão de Bico', 'Tomate', 'Pepino', 'Cebola', 'Azeite', 'Limão', 'Salsa'],
    instructions: [
      'Cozinhe o grão de bico até ficar macio',
      'Pique tomate, pepino e cebola em cubos',
      'Misture todos os vegetais com o grão de bico',
      'Tempere com azeite, limão, sal e pimenta',
      'Adicione salsa picada',
      'Deixe descansar por 10 minutos antes de servir'
    ],
    prepTime: '20 min',
    difficulty: 'easy',
    calories: 350,
    protein: 15,
    carbs: 48,
    fats: 12,
    isHealthy: true,
    tags: ['Vegano', 'Rico em Fibras', 'Mediterrâneo']
  },
  {
    id: 'h8',
    title: 'Wrap de Frango com Vegetais',
    mealType: 'lunch',
    ingredients: ['Frango', 'Tortilha', 'Alface', 'Tomate', 'Cenoura', 'Iogurte Grego'],
    instructions: [
      'Cozinhe e desfiie o peito de frango',
      'Rale a cenoura e pique os vegetais',
      'Aqueça a tortilha integral levemente',
      'Espalhe iogurte grego na tortilha',
      'Adicione frango e vegetais',
      'Enrole bem e corte ao meio'
    ],
    prepTime: '15 min',
    difficulty: 'easy',
    calories: 380,
    protein: 32,
    carbs: 35,
    fats: 12,
    isHealthy: true,
    tags: ['Prático', 'Alto Proteína', 'Portátil']
  },

  // Jantar
  {
    id: 'h9',
    title: 'Sopa de Lentilha com Vegetais',
    mealType: 'dinner',
    ingredients: ['Lentilha', 'Cenoura', 'Cebola', 'Tomate', 'Alho', 'Azeite', 'Louro'],
    instructions: [
      'Refogue cebola e alho no azeite',
      'Adicione cenoura e tomate picados',
      'Acrescente a lentilha e água',
      'Coloque folha de louro e temperos',
      'Cozinhe por 30 minutos até a lentilha amolecer',
      'Sirva quente com salsa picada'
    ],
    prepTime: '40 min',
    difficulty: 'easy',
    calories: 280,
    protein: 18,
    carbs: 45,
    fats: 5,
    isHealthy: true,
    tags: ['Vegano', 'Rico em Fibras', 'Reconfortante']
  },
  {
    id: 'h10',
    title: 'Peixe Assado com Batata Doce',
    mealType: 'dinner',
    ingredients: ['Peixe', 'Batata Doce', 'Limão', 'Alecrim', 'Azeite', 'Alho'],
    instructions: [
      'Corte a batata doce em rodelas',
      'Tempere o peixe com limão, alho e alecrim',
      'Disponha batata e peixe em assadeira',
      'Regue com azeite',
      'Asse a 200°C por 25 minutos',
      'Sirva com salada verde'
    ],
    prepTime: '35 min',
    difficulty: 'medium',
    calories: 390,
    protein: 35,
    carbs: 40,
    fats: 10,
    isHealthy: true,
    tags: ['Assado', 'Completo', 'Rico em Vitaminas']
  },
  {
    id: 'h11',
    title: 'Stir Fry de Tofu com Vegetais',
    mealType: 'dinner',
    ingredients: ['Tofu', 'Brócolis', 'Pimentão', 'Cenoura', 'Shoyu', 'Gengibre', 'Alho'],
    instructions: [
      'Corte o tofu em cubos e doure na frigideira',
      'Reserve o tofu e refogue os vegetais',
      'Adicione alho e gengibre ralados',
      'Retorne o tofu à frigideira',
      'Adicione shoyu e misture bem',
      'Cozinhe por mais 3 minutos e sirva'
    ],
    prepTime: '20 min',
    difficulty: 'medium',
    calories: 320,
    protein: 22,
    carbs: 28,
    fats: 14,
    isHealthy: true,
    tags: ['Vegano', 'Oriental', 'Alto Proteína']
  },
  {
    id: 'h12',
    title: 'Omelete de Forno com Vegetais',
    mealType: 'dinner',
    ingredients: ['Ovos', 'Brócolis', 'Tomate', 'Cebola', 'Queijo Cottage', 'Manjericão'],
    instructions: [
      'Bata 6 ovos com queijo cottage',
      'Pique os vegetais em pedaços pequenos',
      'Misture os vegetais aos ovos',
      'Despeje em forma untada',
      'Asse a 180°C por 25 minutos',
      'Polvilhe manjericão fresco antes de servir'
    ],
    prepTime: '30 min',
    difficulty: 'easy',
    calories: 290,
    protein: 28,
    carbs: 12,
    fats: 16,
    isHealthy: true,
    tags: ['Vegetariano', 'Alto Proteína', 'Prático']
  }
];

export const FREE_PLAN_LIMIT = 3;
export const PREMIUM_PRICE = 19.90;
