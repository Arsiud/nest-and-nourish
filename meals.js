// The built-in meal library that suggestions come from.
//
// Each meal: n name, d short description, s meal times (b breakfast, l lunch, d dinner),
// x what it contains (for diets and allergies), g what it's good for, i main ingredients
// (matched against "foods to avoid").
//
// Contains: M beef/lamb, P pork, C chicken/turkey, F fish, S shellfish, D dairy, E egg,
//           G gluten, N nuts/peanuts, Y soy
// Good for: p high protein, k high calorie, c high carb, f high fiber, i iron-rich,
//           a high fat, l breastfeeding support, w warm & comforting, z freezes well, h easy to eat one-handed,
//           t lighter

export const DIETS = [
  { id: "vegetarian", label: "Vegetarian", excludes: "MPCFS" },
  { id: "vegan", label: "Vegan", excludes: "MPCFSDE" },
  { id: "pescatarian", label: "Pescatarian", excludes: "MPC" },
  { id: "gluten", label: "Gluten-free", excludes: "G" },
  { id: "dairy", label: "Dairy-free", excludes: "D" },
  { id: "nuts", label: "Nut-free", excludes: "N" },
  { id: "egg", label: "Egg-free", excludes: "E" },
  { id: "soy", label: "Soy-free", excludes: "Y" },
  { id: "pork", label: "No pork", excludes: "P" },
  { id: "shellfish", label: "No shellfish", excludes: "S" },
  { id: "fish", label: "No fish", excludes: "F" },
];

export const GOALS = [
  { id: "p", label: "High protein" },
  { id: "k", label: "High calorie" },
  { id: "c", label: "High carb" },
  { id: "a", label: "High fat" },
  { id: "f", label: "High fiber" },
  { id: "i", label: "Iron-rich" },
  { id: "l", label: "Breastfeeding support" },
  { id: "w", label: "Warm & comforting" },
  { id: "z", label: "Freezes well" },
  { id: "h", label: "One-handed" },
  { id: "t", label: "Lighter" },
];

export const SLOTS = [
  { id: "breakfast", label: "Breakfast", code: "b" },
  { id: "lunch", label: "Lunch", code: "l" },
  { id: "dinner", label: "Dinner", code: "d" },
];

const RAW = [
  // Breakfast
  { n: "Veggie egg scramble", d: "Soft scrambled eggs with spinach, peppers and cheddar", s: "b", x: "DE", g: "pt", i: "eggs, spinach, bell peppers, cheddar" },
  { n: "Breakfast burritos", d: "Eggs, sausage, potatoes and cheese in tortillas, wrapped to freeze", s: "bl", x: "PDEG", g: "pkzha", i: "eggs, pork sausage, potatoes, cheese, flour tortillas" },
  { n: "Overnight oats with chia and berries", d: "Ready in the fridge, eaten cold, one jar at a time", s: "b", x: "DG", g: "fclh", i: "oats, milk, chia seeds, berries, maple syrup" },
  { n: "Lactation cookies", d: "Oat cookies with flax and brewer's yeast", s: "b", x: "DEG", g: "lkczha", i: "oats, flaxseed, brewer's yeast, butter, eggs, flour, chocolate chips" },
  { n: "Greek yogurt parfaits", d: "Yogurt layered with granola, berries and honey", s: "b", x: "DGN", g: "pht", i: "greek yogurt, granola, berries, honey, almonds" },
  { n: "Baked apple-cinnamon oatmeal", d: "A pan of soft baked oats to slice and reheat", s: "b", x: "DEGN", g: "flcwz", i: "oats, apples, milk, eggs, walnuts, cinnamon" },
  { n: "Spinach and feta egg muffins", d: "Mini frittatas baked in a muffin tin", s: "b", x: "DE", g: "phzt", i: "eggs, spinach, feta" },
  { n: "Banana-walnut muffins", d: "Moist muffins, a dozen to freeze", s: "b", x: "DEGN", g: "ckzha", i: "bananas, walnuts, flour, eggs, butter" },
  { n: "Sweet potato and black bean hash with eggs", d: "Crispy sweet potatoes, beans and peppers topped with fried eggs", s: "bl", x: "E", g: "fipc", i: "sweet potatoes, black beans, peppers, onions, eggs" },
  { n: "Warm oats with dates and ghee", d: "Steel-cut oats with dates, ghee and cardamom, a traditional postpartum breakfast", s: "b", x: "DG", g: "wlfika", i: "steel-cut oats, dates, ghee, cardamom, milk" },
  { n: "Chicken and ginger congee", d: "Silky rice porridge with shredded chicken and ginger", s: "bld", x: "C", g: "wt", i: "rice, chicken, ginger, scallions" },
  { n: "Sausage, egg and hash brown casserole", d: "A hearty bake that feeds a crowd", s: "b", x: "PDE", g: "pkzwa", i: "pork sausage, eggs, hash browns, cheddar, milk" },
  { n: "Avocado toast with eggs", d: "Whole-grain toast, mashed avocado and jammy eggs", s: "bl", x: "EG", g: "pfha", i: "bread, avocado, eggs" },
  { n: "Cottage cheese protein pancakes", d: "Fluffy pancakes with a protein boost, freeze and toast", s: "b", x: "DEG", g: "pcz", i: "cottage cheese, eggs, flour, oats" },
  { n: "Whole-wheat freezer waffles", d: "Pop in the toaster straight from the freezer", s: "b", x: "DEG", g: "czh", i: "whole-wheat flour, eggs, milk, butter" },
  { n: "Smoothie packs", d: "Bagged spinach, banana, oats and peanut butter, just add milk and blend", s: "b", x: "DGN", g: "flhcza", i: "spinach, banana, oats, peanut butter, milk" },
  { n: "Tofu veggie scramble", d: "Turmeric tofu with peppers, onions and greens", s: "b", x: "Y", g: "pit", i: "tofu, peppers, onions, spinach, turmeric" },
  { n: "Quiche Lorraine", d: "Bacon, gruyère and egg custard in a flaky crust", s: "bl", x: "PDEG", g: "pkza", i: "eggs, bacon, gruyere, cream, pie crust" },
  { n: "Garden vegetable frittata", d: "Eggs baked with zucchini, tomatoes and herbs", s: "bld", x: "DE", g: "ptz", i: "eggs, zucchini, tomatoes, parmesan" },
  { n: "Coconut chia pudding with mango", d: "Creamy, dairy-free and ready to grab", s: "b", x: "", g: "fhta", i: "chia seeds, coconut milk, mango" },
  { n: "Bagels with lox and cream cheese", d: "Smoked salmon, cream cheese, capers and red onion", s: "bl", x: "DFG", g: "pha", i: "bagels, smoked salmon, cream cheese, capers, red onion" },
  { n: "French toast bake", d: "Brioche soaked overnight and baked with cinnamon", s: "b", x: "DEG", g: "ckwz", i: "brioche, eggs, milk, cinnamon, maple syrup" },
  { n: "Peanut butter banana toast", d: "Simple, filling and quick", s: "b", x: "GN", g: "kcha", i: "bread, peanut butter, banana, honey" },
  { n: "Shakshuka with crusty bread", d: "Eggs poached in spiced tomato sauce", s: "bld", x: "EG", g: "piw", i: "eggs, tomatoes, peppers, onions, cumin, bread" },
  { n: "Breakfast sandwiches", d: "Egg, cheese and turkey sausage on English muffins, wrapped to freeze", s: "b", x: "CDEG", g: "phzka", i: "eggs, cheddar, turkey sausage, english muffins" },
  { n: "Lactation energy bites", d: "No-bake oat, flax and peanut butter bites", s: "bl", x: "DGN", g: "lkhza", i: "oats, flaxseed, peanut butter, honey, chocolate chips" },
  { n: "Cottage cheese fruit bowls", d: "Cottage cheese with fruit, nuts and a drizzle of honey", s: "b", x: "DN", g: "pth", i: "cottage cheese, peaches, berries, pecans, honey" },
  { n: "Hard-boiled eggs and fruit", d: "A ready-to-eat box of peeled eggs and cut fruit", s: "bl", x: "E", g: "pht", i: "eggs, fruit" },
  { n: "Fruit and cheese platter", d: "Cut fruit, cheeses and crackers for grazing", s: "bl", x: "DG", g: "tha", i: "fruit, cheese, crackers" },
  { n: "Homemade granola bars", d: "Chewy oat bars with nuts and dried fruit", s: "b", x: "GN", g: "ckhzla", i: "oats, almonds, honey, dried cranberries" },

  // Lunch
  { n: "Chicken salad croissants", d: "Creamy chicken salad with grapes and celery", s: "l", x: "CDEG", g: "pha", i: "chicken, mayonnaise, celery, grapes, croissants" },
  { n: "Turkey avocado wraps", d: "Turkey, avocado, cheese and greens rolled up", s: "l", x: "CDG", g: "pha", i: "turkey, avocado, cheese, lettuce, tortillas" },
  { n: "Chicken noodle soup", d: "Classic, gentle and good for the freezer", s: "ld", x: "CG", g: "wzt", i: "chicken, egg noodles, carrots, celery, onions" },
  { n: "Lentil soup", d: "Hearty lentils with carrots, tomatoes and cumin", s: "ld", x: "", g: "fipwz", i: "lentils, carrots, tomatoes, onions, cumin" },
  { n: "Black bean soup", d: "Smoky blended black beans with lime", s: "ld", x: "", g: "ficwz", i: "black beans, onions, garlic, cumin, lime" },
  { n: "White bean minestrone", d: "Vegetable soup with beans and small pasta", s: "ld", x: "G", g: "fwzt", i: "white beans, pasta, tomatoes, zucchini, carrots" },
  { n: "Butternut squash soup with bread", d: "Velvety squash soup with a loaf of crusty bread", s: "ld", x: "DG", g: "wztfa", i: "butternut squash, cream, onions, bread" },
  { n: "Chickpea quinoa salad", d: "Quinoa, chickpeas, cucumber, tomatoes and feta", s: "l", x: "D", g: "fpit", i: "quinoa, chickpeas, cucumber, tomatoes, feta" },
  { n: "Grilled chicken Caesar salad", d: "Romaine, grilled chicken, parmesan and croutons", s: "ld", x: "CDEFG", g: "pta", i: "chicken, romaine, parmesan, croutons, anchovies" },
  { n: "Tuna salad sandwiches", d: "Light tuna salad on whole-grain bread", s: "l", x: "FEG", g: "pha", i: "tuna, mayonnaise, celery, bread" },
  { n: "Hummus and veggie plate with pita", d: "Hummus, cut vegetables, olives and warm pita", s: "l", x: "G", g: "ftha", i: "chickpeas, tahini, sesame, cucumber, carrots, pita" },
  { n: "Egg salad sandwiches", d: "Soft egg salad on toasted bread", s: "l", x: "EG", g: "pha", i: "eggs, mayonnaise, bread" },
  { n: "Ginger chicken and rice soup", d: "Light broth with chicken, rice and plenty of ginger", s: "ld", x: "C", g: "wzt", i: "chicken, rice, ginger, carrots" },
  { n: "Beef and barley soup", d: "Tender beef, barley and vegetables", s: "ld", x: "MG", g: "piwz", i: "beef, barley, carrots, celery, onions" },
  { n: "Roasted veggie grain bowls", d: "Brown rice, roasted vegetables, chickpeas and tahini", s: "ld", x: "", g: "fct", i: "brown rice, sweet potatoes, broccoli, chickpeas, tahini, sesame" },
  { n: "Turkey chili", d: "Lean turkey, beans and tomatoes, mild or spicy", s: "ld", x: "C", g: "pfiwz", i: "ground turkey, kidney beans, tomatoes, onions, chili powder" },
  { n: "Baked mac and cheese", d: "Creamy, cheesy and baked golden", s: "ld", x: "DG", g: "kcwza", i: "macaroni, cheddar, milk, butter, breadcrumbs" },
  { n: "Caprese paninis", d: "Mozzarella, tomato and basil pressed on ciabatta", s: "l", x: "DG", g: "h", i: "mozzarella, tomatoes, basil, ciabatta" },
  { n: "Bone broth with rice noodles and greens", d: "Sipping broth with noodles, greens and a soft egg", s: "ld", x: "CE", g: "wit", i: "chicken bone broth, rice noodles, bok choy, eggs" },
  { n: "Falafel pitas with tzatziki", d: "Crispy falafel, cucumber, tomatoes and yogurt sauce", s: "ld", x: "DG", g: "fpa", i: "chickpeas, pita, yogurt, cucumber, tomatoes" },
  { n: "Salmon cakes with lemon yogurt sauce", d: "Pan-crisped salmon patties", s: "ld", x: "FDEG", g: "pza", i: "salmon, breadcrumbs, eggs, yogurt, lemon" },
  { n: "Soba noodle salad with edamame", d: "Cold buckwheat noodles, edamame and sesame dressing", s: "l", x: "YG", g: "pft", i: "soba noodles, edamame, carrots, soy sauce, sesame" },
  { n: "Chicken quesadillas", d: "Chicken, peppers and melty cheese, cut in wedges", s: "ld", x: "CDG", g: "pkha", i: "chicken, cheese, peppers, flour tortillas" },
  { n: "Loaded baked potatoes", d: "Baked potatoes with broccoli, cheddar and sour cream", s: "ld", x: "D", g: "kcwa", i: "potatoes, broccoli, cheddar, sour cream" },
  { n: "Split pea soup with ham", d: "Thick, smoky and freezer-friendly", s: "ld", x: "P", g: "pfiwz", i: "split peas, ham, carrots, onions" },
  { n: "Spinach and ricotta stuffed shells", d: "Pasta shells baked in marinara", s: "ld", x: "DEG", g: "kczwa", i: "pasta shells, ricotta, spinach, mozzarella, marinara" },

  // Dinner
  { n: "Grilled chicken with roasted potatoes and green beans", d: "Simple, wholesome plate", s: "dl", x: "C", g: "pt", i: "chicken, potatoes, green beans" },
  { n: "Classic beef lasagna", d: "Layers of meat sauce, ricotta and mozzarella", s: "d", x: "MDEG", g: "kpczwa", i: "ground beef, lasagna noodles, ricotta, mozzarella, marinara" },
  { n: "Vegetable lasagna", d: "Spinach, zucchini and mushrooms with ricotta", s: "d", x: "DEG", g: "kczw", i: "lasagna noodles, spinach, zucchini, mushrooms, ricotta, mozzarella" },
  { n: "Beef stew", d: "Slow-simmered beef with carrots and potatoes", s: "d", x: "MG", g: "piwz", i: "beef, potatoes, carrots, onions, flour" },
  { n: "Chicken pot pie", d: "Creamy chicken and vegetables under a flaky crust", s: "d", x: "CDG", g: "kwza", i: "chicken, peas, carrots, cream, pie crust" },
  { n: "Shepherd's pie", d: "Savory ground beef and vegetables under mashed potatoes", s: "d", x: "MD", g: "piwzka", i: "ground beef, potatoes, peas, carrots, butter" },
  { n: "Baked ziti", d: "Pasta in meat sauce baked with mozzarella", s: "d", x: "MDG", g: "kczwa", i: "ziti, ground beef, marinara, ricotta, mozzarella" },
  { n: "Chicken enchiladas", d: "Corn tortillas filled with chicken, baked in red sauce", s: "d", x: "CD", g: "pkz", i: "chicken, corn tortillas, enchilada sauce, cheese" },
  { n: "Sweet potato and black bean enchiladas", d: "Hearty vegetarian enchiladas", s: "d", x: "D", g: "fcz", i: "sweet potatoes, black beans, corn tortillas, cheese" },
  { n: "Salmon with rice and roasted broccoli", d: "Baked salmon, rich in omega-3s", s: "d", x: "F", g: "pta", i: "salmon, rice, broccoli, lemon" },
  { n: "Teriyaki chicken with rice and vegetables", d: "Sticky-sweet chicken, rice and stir-fried veggies", s: "d", x: "CYG", g: "pc", i: "chicken, soy sauce, rice, broccoli, carrots" },
  { n: "Beef and broccoli with rice", d: "Takeout-style stir-fry", s: "d", x: "MYG", g: "pic", i: "beef, broccoli, soy sauce, rice, garlic" },
  { n: "Spaghetti and meatballs", d: "A big pot of meatballs in marinara with pasta", s: "d", x: "MDEG", g: "kcpza", i: "spaghetti, ground beef, breadcrumbs, eggs, parmesan, marinara" },
  { n: "Chicken tikka masala with rice", d: "Chicken in a creamy spiced tomato sauce", s: "d", x: "CD", g: "pkwza", i: "chicken, yogurt, tomatoes, cream, rice, garam masala" },
  { n: "Chana masala", d: "Chickpea curry with rice", s: "dl", x: "", g: "fipwz", i: "chickpeas, tomatoes, onions, ginger, rice" },
  { n: "Red lentil dal with rice", d: "Gentle, golden lentils cooked with turmeric", s: "dl", x: "", g: "fipwz", i: "red lentils, turmeric, ginger, coconut oil, rice" },
  { n: "Thai chicken coconut curry", d: "Chicken and vegetables in coconut curry with rice", s: "d", x: "CF", g: "pwa", i: "chicken, coconut milk, curry paste, fish sauce, rice" },
  { n: "Pulled pork sandwiches with coleslaw", d: "Slow-cooked pork, buns and crunchy slaw", s: "dl", x: "PEG", g: "pkza", i: "pork shoulder, bbq sauce, buns, cabbage, mayonnaise" },
  { n: "Slow-cooker beef chili", d: "Beef and bean chili with toppings", s: "dl", x: "M", g: "pifwz", i: "ground beef, kidney beans, tomatoes, onions, chili powder" },
  { n: "White chicken chili", d: "Chicken, white beans, green chiles and cream cheese", s: "dl", x: "CD", g: "pfwza", i: "chicken, white beans, green chiles, cream cheese" },
  { n: "Roast chicken with root vegetables", d: "Whole roasted chicken with carrots, parsnips and potatoes", s: "d", x: "C", g: "pw", i: "chicken, carrots, parsnips, potatoes" },
  { n: "Pot roast", d: "Fork-tender beef with potatoes and carrots", s: "d", x: "M", g: "piwz", i: "beef chuck, potatoes, carrots, onions" },
  { n: "Turkey meatloaf with mashed potatoes", d: "Comfort-food classic", s: "d", x: "CDEG", g: "pkwza", i: "ground turkey, breadcrumbs, eggs, potatoes, butter, milk" },
  { n: "Stuffed peppers", d: "Bell peppers filled with beef, rice and cheese", s: "d", x: "MD", g: "piz", i: "bell peppers, ground beef, rice, tomatoes, cheese" },
  { n: "Chicken and wild rice soup", d: "Creamy, hearty and freezer-friendly", s: "dl", x: "CDG", g: "wz", i: "chicken, wild rice, cream, carrots, celery, flour" },
  { n: "Shrimp tacos", d: "Spiced shrimp, cabbage and lime crema", s: "d", x: "SD", g: "pt", i: "shrimp, corn tortillas, cabbage, sour cream, lime" },
  { n: "Fish tacos with cabbage slaw", d: "Flaky white fish with a crunchy slaw", s: "d", x: "F", g: "pt", i: "white fish, corn tortillas, cabbage, lime" },
  { n: "Pasta primavera", d: "Pasta tossed with spring vegetables and parmesan", s: "d", x: "DG", g: "ct", i: "pasta, zucchini, peppers, peas, parmesan" },
  { n: "Pesto chicken pasta", d: "Basil pesto, chicken and cherry tomatoes", s: "d", x: "CDGN", g: "kcpa", i: "pasta, chicken, basil pesto, pine nuts, parmesan, tomatoes" },
  { n: "Eggplant parmesan", d: "Breaded eggplant layered with marinara and mozzarella", s: "d", x: "DEG", g: "kza", i: "eggplant, breadcrumbs, eggs, marinara, mozzarella" },
  { n: "Chicken parmesan", d: "Crispy chicken with marinara and pasta", s: "d", x: "CDEG", g: "pka", i: "chicken, breadcrumbs, eggs, marinara, mozzarella, pasta" },
  { n: "Stuffed sweet potatoes", d: "Baked sweet potatoes with black beans, corn and salsa", s: "dl", x: "", g: "fci", i: "sweet potatoes, black beans, corn, salsa" },
  { n: "Tofu stir-fry with peanut sauce", d: "Crispy tofu and vegetables over rice", s: "d", x: "YNG", g: "pfa", i: "tofu, peanut butter, soy sauce, broccoli, peppers, rice" },
  { n: "Taco night kit", d: "Seasoned beef, shells and all the toppings", s: "d", x: "MD", g: "pkha", i: "ground beef, taco shells, cheese, lettuce, tomatoes, sour cream" },
  { n: "Chicken fajitas", d: "Sizzling chicken, peppers and onions with tortillas", s: "d", x: "CG", g: "pt", i: "chicken, peppers, onions, flour tortillas" },
  { n: "Moroccan chickpea stew", d: "Chickpeas, sweet potatoes and apricots, warmly spiced", s: "dl", x: "", g: "fiwz", i: "chickpeas, sweet potatoes, tomatoes, dried apricots, cumin" },
  { n: "Seaweed soup (miyeok-guk)", d: "Korean postpartum tradition: brothy seaweed soup with beef", s: "ld", x: "MY", g: "iwlt", i: "seaweed, beef, soy sauce, garlic, sesame oil, sesame" },
  { n: "Sesame oil ginger chicken", d: "Warming chicken braised with ginger and sesame oil, a confinement classic", s: "d", x: "C", g: "wpia", i: "chicken, ginger, sesame oil, sesame, rice wine" },
  { n: "Pozole rojo", d: "Pork and hominy stew in red chile broth", s: "dl", x: "P", g: "wpza", i: "pork, hominy, dried chiles, cabbage, radishes" },
  { n: "Jambalaya", d: "Rice with chicken, sausage and shrimp", s: "d", x: "CPS", g: "pck", i: "rice, chicken, andouille sausage, shrimp, peppers" },
  { n: "Sheet-pan sausage, peppers and potatoes", d: "Easy one-pan dinner", s: "d", x: "P", g: "pka", i: "italian sausage, peppers, onions, potatoes" },
  { n: "Mushroom risotto", d: "Creamy arborio rice with mushrooms and parmesan", s: "d", x: "D", g: "cwka", i: "arborio rice, mushrooms, parmesan, butter" },
  { n: "Pierogi with onions and sour cream", d: "Potato-cheese dumplings pan-fried with onions", s: "d", x: "DEG", g: "ckza", i: "pierogi, potatoes, cheese, onions, sour cream" },
  { n: "Chicken and dumplings", d: "Creamy stew with soft dumplings", s: "d", x: "CDG", g: "wkza", i: "chicken, flour, milk, carrots, celery" },
  { n: "Homemade pizza night", d: "Two pizzas, or dough and toppings to bake fresh", s: "dl", x: "DG", g: "kca", i: "pizza dough, mozzarella, tomato sauce" },
];

// Meals with an id ("lib-0", "lib-1", …) and their meal times as slot ids.
const SLOT_BY_CODE = Object.fromEntries(SLOTS.map((s) => [s.code, s.id]));
export const MEALS = RAW.map((m, i) => ({
  id: `lib-${i}`, name: m.n, desc: m.d, contains: m.x, goals: m.g, ingredients: m.i,
  slots: [...m.s].map((c) => SLOT_BY_CODE[c]).sort((a, b) => slotOrder(a) - slotOrder(b)),
}));

export function slotOrder(slot) { return SLOTS.findIndex((s) => s.id === slot); }

// Words from "foods to avoid" ("no onions, mushrooms; shellfish") that a meal mentions.
export function avoidWords(text) {
  return (text || "").toLowerCase().split(/[,;\n]+|\band\b/).map((w) => w.replace(/^\s*no\s+/, "").trim()).filter((w) => w.length > 1);
}
function mentions(meal, word) {
  const hay = `${meal.name} ${meal.ingredients}`.toLowerCase();
  const stem = word.replace(/(es|s)$/, "");   // "onions" finds "onion"
  return hay.includes(stem);
}

// Library meals that fit her diets and foods to avoid, best match for her goals first.
export function suggest(prefs = {}) {
  const banned = new Set(DIETS.filter((d) => prefs.diet?.includes(d.id)).flatMap((d) => [...d.excludes]));
  const avoid = avoidWords(prefs.avoid);
  const goals = prefs.goals || [];
  return MEALS
    .filter((m) => ![...m.contains].some((c) => banned.has(c)) && !avoid.some((w) => mentions(m, w)))
    .map((m) => ({ ...m, matched: goals.filter((g) => m.goals.includes(g)) }))
    .sort((a, b) => b.matched.length - a.matched.length || a.id.localeCompare(b.id, undefined, { numeric: true }));
}

// For a dish she typed herself: which "foods to avoid" it mentions (a warning, not a block).
export function avoidHits(dish, prefs = {}) {
  return avoidWords(prefs.avoid).filter((w) => mentions({ name: dish.name, ingredients: dish.desc || "" }, w));
}
