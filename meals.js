// The built-in meal library that suggestions come from.
//
// Each meal: n name, d short description, s meal times (b breakfast, l lunch, d dinner),
// x what it contains (for diets and allergies), g what it's good for, f how it tastes, i main ingredients
// (matched against "foods to avoid").
//
// Contains: M beef/lamb, P pork, C chicken/turkey, F fish, S shellfish, D dairy, E egg,
//           G gluten, N nuts/peanuts, Y soy
// Good for: p high protein, k high calorie, c high carb, f high fiber, i iron-rich,
//           a high fat, l breastfeeding support, w warm & comforting, z freezes well, h easy to eat one-handed,
//           t lighter, q quick to make
// Flavor:   s savory, w sweet, m mild & gentle, h spicy, t bright & tangy, c cheesy & creamy, e fresh & herby

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
  { id: "q", label: "Quick to make" },
];

// Postpartum appetites can be small, so flavor matters as much as nutrition.
export const FLAVORS = [
  { id: "s", label: "Savory" },
  { id: "w", label: "Sweet" },
  { id: "m", label: "Mild & gentle" },
  { id: "h", label: "Spicy" },
  { id: "t", label: "Bright & tangy" },
  { id: "c", label: "Cheesy & creamy" },
  { id: "e", label: "Fresh & herby" },
];

export const SLOTS = [
  { id: "breakfast", label: "Breakfast", code: "b" },
  { id: "lunch", label: "Lunch", code: "l" },
  { id: "dinner", label: "Dinner", code: "d" },
];

const RAW = [
  // Breakfast
  { n: "Veggie egg scramble", d: "Soft scrambled eggs with spinach, peppers and cheddar", s: "b", x: "DE", g: "ptq", f: "sm", i: "eggs, spinach, bell peppers, cheddar" },
  { n: "Breakfast burritos", d: "Eggs, sausage, potatoes and cheese in tortillas, wrapped to freeze", s: "bl", x: "PDEG", g: "pkzha", f: "sh", i: "eggs, pork sausage, potatoes, cheese, flour tortillas" },
  { n: "Overnight oats with chia and berries", d: "Ready in the fridge, eaten cold, one jar at a time", s: "b", x: "DG", g: "fclhq", f: "w", i: "oats, milk, chia seeds, berries, maple syrup" },
  { n: "Lactation cookies", d: "Oat cookies with flax and brewer's yeast", s: "b", x: "DEG", g: "lkczha", f: "w", i: "oats, flaxseed, brewer's yeast, butter, eggs, flour, chocolate chips" },
  { n: "Greek yogurt parfaits", d: "Yogurt layered with granola, berries and honey", s: "b", x: "DGN", g: "phtq", f: "wc", i: "greek yogurt, granola, berries, honey, almonds" },
  { n: "Baked apple-cinnamon oatmeal", d: "A pan of soft baked oats to slice and reheat", s: "b", x: "DEGN", g: "flcwz", f: "wm", i: "oats, apples, milk, eggs, walnuts, cinnamon" },
  { n: "Spinach and feta egg muffins", d: "Mini frittatas baked in a muffin tin", s: "b", x: "DE", g: "phzt", f: "se", i: "eggs, spinach, feta" },
  { n: "Banana-walnut muffins", d: "Moist muffins, a dozen to freeze", s: "b", x: "DEGN", g: "ckzha", f: "w", i: "bananas, walnuts, flour, eggs, butter" },
  { n: "Sweet potato and black bean hash with eggs", d: "Crispy sweet potatoes, beans and peppers topped with fried eggs", s: "bl", x: "E", g: "fipc", f: "sh", i: "sweet potatoes, black beans, peppers, onions, eggs" },
  { n: "Warm oats with dates and ghee", d: "Steel-cut oats with dates, ghee and cardamom, a traditional postpartum breakfast", s: "b", x: "DG", g: "wlfika", f: "wm", i: "steel-cut oats, dates, ghee, cardamom, milk" },
  { n: "Chicken and ginger congee", d: "Silky rice porridge with shredded chicken and ginger", s: "bld", x: "C", g: "wt", f: "ms", i: "rice, chicken, ginger, scallions" },
  { n: "Sausage, egg and hash brown casserole", d: "A hearty bake that feeds a crowd", s: "b", x: "PDE", g: "pkzwa", f: "sc", i: "pork sausage, eggs, hash browns, cheddar, milk" },
  { n: "Avocado toast with eggs", d: "Whole-grain toast, mashed avocado and jammy eggs", s: "bl", x: "EG", g: "pfhaq", f: "st", i: "bread, avocado, eggs" },
  { n: "Cottage cheese protein pancakes", d: "Fluffy pancakes with a protein boost, freeze and toast", s: "b", x: "DEG", g: "pcz", f: "w", i: "cottage cheese, eggs, flour, oats" },
  { n: "Whole-wheat freezer waffles", d: "Pop in the toaster straight from the freezer", s: "b", x: "DEG", g: "czh", f: "wm", i: "whole-wheat flour, eggs, milk, butter" },
  { n: "Smoothie packs", d: "Bagged spinach, banana, oats and peanut butter, just add milk and blend", s: "b", x: "DGN", g: "flhczaq", f: "w", i: "spinach, banana, oats, peanut butter, milk" },
  { n: "Tofu veggie scramble", d: "Turmeric tofu with peppers, onions and greens", s: "b", x: "Y", g: "pit", f: "s", i: "tofu, peppers, onions, spinach, turmeric" },
  { n: "Quiche Lorraine", d: "Bacon, gruyère and egg custard in a flaky crust", s: "bl", x: "PDEG", g: "pkza", f: "sc", i: "eggs, bacon, gruyere, cream, pie crust" },
  { n: "Garden vegetable frittata", d: "Eggs baked with zucchini, tomatoes and herbs", s: "bld", x: "DE", g: "ptz", f: "se", i: "eggs, zucchini, tomatoes, parmesan" },
  { n: "Coconut chia pudding with mango", d: "Creamy, dairy-free and ready to grab", s: "b", x: "", g: "fhtaq", f: "wt", i: "chia seeds, coconut milk, mango" },
  { n: "Bagels with lox and cream cheese", d: "Smoked salmon, cream cheese, capers and red onion", s: "bl", x: "DFG", g: "phaq", f: "st", i: "bagels, smoked salmon, cream cheese, capers, red onion" },
  { n: "French toast bake", d: "Brioche soaked overnight and baked with cinnamon", s: "b", x: "DEG", g: "ckwz", f: "w", i: "brioche, eggs, milk, cinnamon, maple syrup" },
  { n: "Peanut butter banana toast", d: "Simple, filling and quick", s: "b", x: "GN", g: "kchaq", f: "w", i: "bread, peanut butter, banana, honey" },
  { n: "Shakshuka with crusty bread", d: "Eggs poached in spiced tomato sauce", s: "bld", x: "EG", g: "piw", f: "sht", i: "eggs, tomatoes, peppers, onions, cumin, bread" },
  { n: "Breakfast sandwiches", d: "Egg, cheese and turkey sausage on English muffins, wrapped to freeze", s: "b", x: "CDEG", g: "phzka", f: "sc", i: "eggs, cheddar, turkey sausage, english muffins" },
  { n: "Lactation energy bites", d: "No-bake oat, flax and peanut butter bites", s: "bl", x: "DGN", g: "lkhzaq", f: "w", i: "oats, flaxseed, peanut butter, honey, chocolate chips" },
  { n: "Cottage cheese fruit bowls", d: "Cottage cheese with fruit, nuts and a drizzle of honey", s: "b", x: "DN", g: "pthq", f: "wm", i: "cottage cheese, peaches, berries, pecans, honey" },
  { n: "Hard-boiled eggs and fruit", d: "A ready-to-eat box of peeled eggs and cut fruit", s: "bl", x: "E", g: "phtq", f: "m", i: "eggs, fruit" },
  { n: "Fruit and cheese platter", d: "Cut fruit, cheeses and crackers for grazing", s: "bl", x: "DG", g: "thaq", f: "wc", i: "fruit, cheese, crackers" },
  { n: "Homemade granola bars", d: "Chewy oat bars with nuts and dried fruit", s: "b", x: "GN", g: "ckhzla", f: "w", i: "oats, almonds, honey, dried cranberries" },

  // Lunch
  { n: "Chicken salad croissants", d: "Creamy chicken salad with grapes and celery", s: "l", x: "CDEG", g: "phaq", f: "cm", i: "chicken, mayonnaise, celery, grapes, croissants" },
  { n: "Turkey avocado wraps", d: "Turkey, avocado, cheese and greens rolled up", s: "l", x: "CDG", g: "phaq", f: "s", i: "turkey, avocado, cheese, lettuce, tortillas" },
  { n: "Chicken noodle soup", d: "Classic, gentle and good for the freezer", s: "ld", x: "CG", g: "wzt", f: "ms", i: "chicken, egg noodles, carrots, celery, onions" },
  { n: "Lentil soup", d: "Hearty lentils with carrots, tomatoes and cumin", s: "ld", x: "", g: "fipwz", f: "se", i: "lentils, carrots, tomatoes, onions, cumin" },
  { n: "Black bean soup", d: "Smoky blended black beans with lime", s: "ld", x: "", g: "ficwz", f: "sht", i: "black beans, onions, garlic, cumin, lime" },
  { n: "White bean minestrone", d: "Vegetable soup with beans and small pasta", s: "ld", x: "G", g: "fwzt", f: "se", i: "white beans, pasta, tomatoes, zucchini, carrots" },
  { n: "Butternut squash soup with bread", d: "Velvety squash soup with a loaf of crusty bread", s: "ld", x: "DG", g: "wztfa", f: "wcm", i: "butternut squash, cream, onions, bread" },
  { n: "Chickpea quinoa salad", d: "Quinoa, chickpeas, cucumber, tomatoes and feta", s: "l", x: "D", g: "fpitq", f: "te", i: "quinoa, chickpeas, cucumber, tomatoes, feta" },
  { n: "Grilled chicken Caesar salad", d: "Romaine, grilled chicken, parmesan and croutons", s: "ld", x: "CDEFG", g: "ptaq", f: "tc", i: "chicken, romaine, parmesan, croutons, anchovies" },
  { n: "Tuna salad sandwiches", d: "Light tuna salad on whole-grain bread", s: "l", x: "FEG", g: "phaq", f: "st", i: "tuna, mayonnaise, celery, bread" },
  { n: "Hummus and veggie plate with pita", d: "Hummus, cut vegetables, olives and warm pita", s: "l", x: "G", g: "fthaq", f: "te", i: "chickpeas, tahini, sesame, cucumber, carrots, pita" },
  { n: "Egg salad sandwiches", d: "Soft egg salad on toasted bread", s: "l", x: "EG", g: "phaq", f: "cm", i: "eggs, mayonnaise, bread" },
  { n: "Ginger chicken and rice soup", d: "Light broth with chicken, rice and plenty of ginger", s: "ld", x: "C", g: "wzt", f: "ms", i: "chicken, rice, ginger, carrots" },
  { n: "Beef and barley soup", d: "Tender beef, barley and vegetables", s: "ld", x: "MG", g: "piwz", f: "s", i: "beef, barley, carrots, celery, onions" },
  { n: "Roasted veggie grain bowls", d: "Brown rice, roasted vegetables, chickpeas and tahini", s: "ld", x: "", g: "fct", f: "se", i: "brown rice, sweet potatoes, broccoli, chickpeas, tahini, sesame" },
  { n: "Turkey chili", d: "Lean turkey, beans and tomatoes, mild or spicy", s: "ld", x: "C", g: "pfiwz", f: "sh", i: "ground turkey, kidney beans, tomatoes, onions, chili powder" },
  { n: "Baked mac and cheese", d: "Creamy, cheesy and baked golden", s: "ld", x: "DG", g: "kcwza", f: "cm", i: "macaroni, cheddar, milk, butter, breadcrumbs" },
  { n: "Caprese paninis", d: "Mozzarella, tomato and basil pressed on ciabatta", s: "l", x: "DG", g: "hq", f: "ce", i: "mozzarella, tomatoes, basil, ciabatta" },
  { n: "Bone broth with rice noodles and greens", d: "Sipping broth with noodles, greens and a soft egg", s: "ld", x: "CE", g: "wit", f: "ms", i: "chicken bone broth, rice noodles, bok choy, eggs" },
  { n: "Falafel pitas with tzatziki", d: "Crispy falafel, cucumber, tomatoes and yogurt sauce", s: "ld", x: "DG", g: "fpa", f: "te", i: "chickpeas, pita, yogurt, cucumber, tomatoes" },
  { n: "Salmon cakes with lemon yogurt sauce", d: "Pan-crisped salmon patties", s: "ld", x: "FDEG", g: "pza", f: "st", i: "salmon, breadcrumbs, eggs, yogurt, lemon" },
  { n: "Soba noodle salad with edamame", d: "Cold buckwheat noodles, edamame and sesame dressing", s: "l", x: "YG", g: "pft", f: "te", i: "soba noodles, edamame, carrots, soy sauce, sesame" },
  { n: "Chicken quesadillas", d: "Chicken, peppers and melty cheese, cut in wedges", s: "ld", x: "CDG", g: "pkhaq", f: "cs", i: "chicken, cheese, peppers, flour tortillas" },
  { n: "Loaded baked potatoes", d: "Baked potatoes with broccoli, cheddar and sour cream", s: "ld", x: "D", g: "kcwa", f: "cs", i: "potatoes, broccoli, cheddar, sour cream" },
  { n: "Split pea soup with ham", d: "Thick, smoky and freezer-friendly", s: "ld", x: "P", g: "pfiwz", f: "s", i: "split peas, ham, carrots, onions" },
  { n: "Spinach and ricotta stuffed shells", d: "Pasta shells baked in marinara", s: "ld", x: "DEG", g: "kczwa", f: "cm", i: "pasta shells, ricotta, spinach, mozzarella, marinara" },

  // Dinner
  { n: "Grilled chicken with roasted potatoes and green beans", d: "Simple, wholesome plate", s: "dl", x: "C", g: "pt", f: "se", i: "chicken, potatoes, green beans" },
  { n: "Classic beef lasagna", d: "Layers of meat sauce, ricotta and mozzarella", s: "d", x: "MDEG", g: "kpczwa", f: "sc", i: "ground beef, lasagna noodles, ricotta, mozzarella, marinara" },
  { n: "Vegetable lasagna", d: "Spinach, zucchini and mushrooms with ricotta", s: "d", x: "DEG", g: "kczw", f: "ce", i: "lasagna noodles, spinach, zucchini, mushrooms, ricotta, mozzarella" },
  { n: "Beef stew", d: "Slow-simmered beef with carrots and potatoes", s: "d", x: "MG", g: "piwz", f: "s", i: "beef, potatoes, carrots, onions, flour" },
  { n: "Chicken pot pie", d: "Creamy chicken and vegetables under a flaky crust", s: "d", x: "CDG", g: "kwza", f: "cm", i: "chicken, peas, carrots, cream, pie crust" },
  { n: "Shepherd's pie", d: "Savory ground beef and vegetables under mashed potatoes", s: "d", x: "MD", g: "piwzka", f: "sm", i: "ground beef, potatoes, peas, carrots, butter" },
  { n: "Baked ziti", d: "Pasta in meat sauce baked with mozzarella", s: "d", x: "MDG", g: "kczwa", f: "sc", i: "ziti, ground beef, marinara, ricotta, mozzarella" },
  { n: "Chicken enchiladas", d: "Corn tortillas filled with chicken, baked in red sauce", s: "d", x: "CD", g: "pkz", f: "sh", i: "chicken, corn tortillas, enchilada sauce, cheese" },
  { n: "Sweet potato and black bean enchiladas", d: "Hearty vegetarian enchiladas", s: "d", x: "D", g: "fcz", f: "sh", i: "sweet potatoes, black beans, corn tortillas, cheese" },
  { n: "Salmon with rice and roasted broccoli", d: "Baked salmon, rich in omega-3s", s: "d", x: "F", g: "ptaq", f: "te", i: "salmon, rice, broccoli, lemon" },
  { n: "Teriyaki chicken with rice and vegetables", d: "Sticky-sweet chicken, rice and stir-fried veggies", s: "d", x: "CYG", g: "pc", f: "ws", i: "chicken, soy sauce, rice, broccoli, carrots" },
  { n: "Beef and broccoli with rice", d: "Takeout-style stir-fry", s: "d", x: "MYG", g: "pic", f: "s", i: "beef, broccoli, soy sauce, rice, garlic" },
  { n: "Spaghetti and meatballs", d: "A big pot of meatballs in marinara with pasta", s: "d", x: "MDEG", g: "kcpza", f: "sm", i: "spaghetti, ground beef, breadcrumbs, eggs, parmesan, marinara" },
  { n: "Chicken tikka masala with rice", d: "Chicken in a creamy spiced tomato sauce", s: "d", x: "CD", g: "pkwza", f: "cs", i: "chicken, yogurt, tomatoes, cream, rice, garam masala" },
  { n: "Chana masala", d: "Chickpea curry with rice", s: "dl", x: "", g: "fipwz", f: "sh", i: "chickpeas, tomatoes, onions, ginger, rice" },
  { n: "Red lentil dal with rice", d: "Gentle, golden lentils cooked with turmeric", s: "dl", x: "", g: "fipwz", f: "ms", i: "red lentils, turmeric, ginger, coconut oil, rice" },
  { n: "Thai chicken coconut curry", d: "Chicken and vegetables in coconut curry with rice", s: "d", x: "CF", g: "pwa", f: "hs", i: "chicken, coconut milk, curry paste, fish sauce, rice" },
  { n: "Pulled pork sandwiches with coleslaw", d: "Slow-cooked pork, buns and crunchy slaw", s: "dl", x: "PEG", g: "pkza", f: "ws", i: "pork shoulder, bbq sauce, buns, cabbage, mayonnaise" },
  { n: "Slow-cooker beef chili", d: "Beef and bean chili with toppings", s: "dl", x: "M", g: "pifwz", f: "sh", i: "ground beef, kidney beans, tomatoes, onions, chili powder" },
  { n: "White chicken chili", d: "Chicken, white beans, green chiles and cream cheese", s: "dl", x: "CD", g: "pfwza", f: "cs", i: "chicken, white beans, green chiles, cream cheese" },
  { n: "Roast chicken with root vegetables", d: "Whole roasted chicken with carrots, parsnips and potatoes", s: "d", x: "C", g: "pw", f: "se", i: "chicken, carrots, parsnips, potatoes" },
  { n: "Pot roast", d: "Fork-tender beef with potatoes and carrots", s: "d", x: "M", g: "piwz", f: "sm", i: "beef chuck, potatoes, carrots, onions" },
  { n: "Turkey meatloaf with mashed potatoes", d: "Comfort-food classic", s: "d", x: "CDEG", g: "pkwza", f: "sm", i: "ground turkey, breadcrumbs, eggs, potatoes, butter, milk" },
  { n: "Stuffed peppers", d: "Bell peppers filled with beef, rice and cheese", s: "d", x: "MD", g: "piz", f: "s", i: "bell peppers, ground beef, rice, tomatoes, cheese" },
  { n: "Chicken and wild rice soup", d: "Creamy, hearty and freezer-friendly", s: "dl", x: "CDG", g: "wz", f: "cm", i: "chicken, wild rice, cream, carrots, celery, flour" },
  { n: "Shrimp tacos", d: "Spiced shrimp, cabbage and lime crema", s: "d", x: "SD", g: "pt", f: "th", i: "shrimp, corn tortillas, cabbage, sour cream, lime" },
  { n: "Fish tacos with cabbage slaw", d: "Flaky white fish with a crunchy slaw", s: "d", x: "F", g: "pt", f: "te", i: "white fish, corn tortillas, cabbage, lime" },
  { n: "Pasta primavera", d: "Pasta tossed with spring vegetables and parmesan", s: "d", x: "DG", g: "ct", f: "e", i: "pasta, zucchini, peppers, peas, parmesan" },
  { n: "Pesto chicken pasta", d: "Basil pesto, chicken and cherry tomatoes", s: "d", x: "CDGN", g: "kcpa", f: "ec", i: "pasta, chicken, basil pesto, pine nuts, parmesan, tomatoes" },
  { n: "Eggplant parmesan", d: "Breaded eggplant layered with marinara and mozzarella", s: "d", x: "DEG", g: "kza", f: "cs", i: "eggplant, breadcrumbs, eggs, marinara, mozzarella" },
  { n: "Chicken parmesan", d: "Crispy chicken with marinara and pasta", s: "d", x: "CDEG", g: "pka", f: "cs", i: "chicken, breadcrumbs, eggs, marinara, mozzarella, pasta" },
  { n: "Stuffed sweet potatoes", d: "Baked sweet potatoes with black beans, corn and salsa", s: "dl", x: "", g: "fci", f: "ws", i: "sweet potatoes, black beans, corn, salsa" },
  { n: "Tofu stir-fry with peanut sauce", d: "Crispy tofu and vegetables over rice", s: "d", x: "YNG", g: "pfa", f: "sw", i: "tofu, peanut butter, soy sauce, broccoli, peppers, rice" },
  { n: "Taco night kit", d: "Seasoned beef, shells and all the toppings", s: "d", x: "MD", g: "pkhaq", f: "sh", i: "ground beef, taco shells, cheese, lettuce, tomatoes, sour cream" },
  { n: "Chicken fajitas", d: "Sizzling chicken, peppers and onions with tortillas", s: "d", x: "CG", g: "ptq", f: "sh", i: "chicken, peppers, onions, flour tortillas" },
  { n: "Moroccan chickpea stew", d: "Chickpeas, sweet potatoes and apricots, warmly spiced", s: "dl", x: "", g: "fiwz", f: "ws", i: "chickpeas, sweet potatoes, tomatoes, dried apricots, cumin" },
  { n: "Seaweed soup (miyeok-guk)", d: "Korean postpartum tradition: brothy seaweed soup with beef", s: "ld", x: "MY", g: "iwlt", f: "sm", i: "seaweed, beef, soy sauce, garlic, sesame oil, sesame" },
  { n: "Sesame oil ginger chicken", d: "Warming chicken braised with ginger and sesame oil, a confinement classic", s: "d", x: "C", g: "wpia", f: "sm", i: "chicken, ginger, sesame oil, sesame, rice wine" },
  { n: "Pozole rojo", d: "Pork and hominy stew in red chile broth", s: "dl", x: "P", g: "wpza", f: "sh", i: "pork, hominy, dried chiles, cabbage, radishes" },
  { n: "Jambalaya", d: "Rice with chicken, sausage and shrimp", s: "d", x: "CPS", g: "pck", f: "sh", i: "rice, chicken, andouille sausage, shrimp, peppers" },
  { n: "Sheet-pan sausage, peppers and potatoes", d: "Easy one-pan dinner", s: "d", x: "P", g: "pkaq", f: "s", i: "italian sausage, peppers, onions, potatoes" },
  { n: "Mushroom risotto", d: "Creamy arborio rice with mushrooms and parmesan", s: "d", x: "D", g: "cwka", f: "cm", i: "arborio rice, mushrooms, parmesan, butter" },
  { n: "Pierogi with onions and sour cream", d: "Potato-cheese dumplings pan-fried with onions", s: "d", x: "DEG", g: "ckza", f: "cm", i: "pierogi, potatoes, cheese, onions, sour cream" },
  { n: "Chicken and dumplings", d: "Creamy stew with soft dumplings", s: "d", x: "CDG", g: "wkza", f: "cm", i: "chicken, flour, milk, carrots, celery" },
  { n: "Homemade pizza night", d: "Two pizzas, or dough and toppings to bake fresh", s: "dl", x: "DG", g: "kca", f: "cs", i: "pizza dough, mozzarella, tomato sauce" },

  // Quick and delicious: simple for helpers to make, full of flavor for a mom who doesn't feel like eating
  // Breakfast
  { n: "Jammy eggs with buttered toast soldiers", d: "Six-and-a-half-minute eggs, flaky salt and everything seasoning", s: "b", x: "DEG", g: "phq", f: "sm", i: "eggs, bread, butter, everything bagel seasoning" },
  { n: "Ham and cheese breakfast sliders", d: "Sweet rolls with ham, eggs and melty swiss, brushed with honey-mustard butter", s: "bl", x: "PDEG", g: "pkzhq", f: "swc", i: "hawaiian rolls, ham, eggs, swiss cheese, butter, dijon" },
  { n: "Sheet-pan blueberry pancakes", d: "One pan, cut into squares, warm with maple syrup", s: "b", x: "DEG", g: "czq", f: "w", i: "flour, eggs, milk, blueberries, maple syrup" },
  { n: "One-bowl banana bread", d: "Brown sugar, cinnamon and very ripe bananas", s: "b", x: "DEG", g: "ckzhq", f: "wm", i: "bananas, flour, eggs, butter, brown sugar" },
  { n: "Pumpkin chocolate chip muffins", d: "Soft, spiced and freezer-friendly", s: "b", x: "DEG", g: "czhq", f: "w", i: "pumpkin, flour, eggs, chocolate chips, cinnamon" },
  { n: "Egg and cheese breakfast tacos", d: "Soft scrambled eggs and cheddar in warm corn tortillas with salsa", s: "b", x: "DE", g: "phq", f: "shc", i: "eggs, cheddar, corn tortillas, salsa" },
  { n: "Chorizo and potato breakfast skillet", d: "Crispy potatoes, chorizo and fried eggs", s: "b", x: "PE", g: "pkwaq", f: "sh", i: "chorizo, potatoes, onions, eggs" },
  { n: "Biscuits and sausage gravy", d: "Canned biscuits and a peppery cream gravy, ready in 20 minutes", s: "b", x: "PDG", g: "kwaq", f: "sc", i: "biscuits, pork sausage, milk, flour, black pepper" },
  { n: "Strawberry cream cheese French toast roll-ups", d: "Rolled, dipped in cinnamon sugar and pan-fried", s: "b", x: "DEG", g: "ckq", f: "wc", i: "bread, cream cheese, strawberries, eggs, cinnamon sugar" },
  { n: "Cottage cheese and tomato toast", d: "Thick toast, cottage cheese, juicy tomatoes, olive oil and pepper", s: "bl", x: "DG", g: "ptq", f: "ste", i: "bread, cottage cheese, tomatoes, olive oil" },
  { n: "Sardines on buttered toast with lemon", d: "A nutrient-dense classic: omega-3s, calcium and protein in five minutes", s: "bl", x: "FDG", g: "paiq", f: "st", i: "sardines, sourdough, butter, lemon, parsley" },
  { n: "Apple pie overnight oats", d: "Oats with grated apple, cinnamon and a little brown sugar", s: "b", x: "DG", g: "flhq", f: "wm", i: "oats, milk, apples, cinnamon, brown sugar" },
  { n: "Peanut butter chocolate overnight oats", d: "Tastes like dessert, keeps her full", s: "b", x: "DGN", g: "lkhaq", f: "w", i: "oats, milk, peanut butter, cocoa, maple syrup" },
  { n: "Strawberry banana yogurt smoothies", d: "Blended and bottled, easy to sip", s: "b", x: "D", g: "thq", f: "wm", i: "strawberries, banana, yogurt, milk, honey" },
  { n: "Mango lassi smoothies", d: "Mango, yogurt and a pinch of cardamom", s: "b", x: "D", g: "thq", f: "wt", i: "mango, yogurt, milk, cardamom" },
  { n: "Cheesy grits with a fried egg", d: "Butter, sharp cheddar and a runny egg on top", s: "b", x: "DE", g: "kwcq", f: "scm", i: "grits, cheddar, butter, eggs" },
  { n: "Hash brown egg nests", d: "Crispy hash brown cups baked with an egg and cheese", s: "b", x: "DE", g: "phzq", f: "sc", i: "hash browns, eggs, cheddar" },
  { n: "Warm coconut rice pudding", d: "Creamy and gently sweet with cardamom and cinnamon", s: "bl", x: "", g: "cwq", f: "wm", i: "rice, coconut milk, cardamom, cinnamon, maple syrup" },
  { n: "Honey butter cornbread muffins", d: "Golden, tender and great with soup", s: "bl", x: "DEG", g: "chzq", f: "wm", i: "cornmeal, flour, eggs, butter, honey" },
  { n: "Ricotta toast with honey and berries", d: "Whipped ricotta, warm honey and fresh fruit", s: "b", x: "DG", g: "htq", f: "wc", i: "bread, ricotta, honey, berries" },
  { n: "Warm apple compote over yogurt", d: "Cinnamon apples simmered soft, spooned over full-fat yogurt", s: "b", x: "D", g: "wtq", f: "wm", i: "apples, cinnamon, yogurt, maple syrup" },
  { n: "Huevos rancheros", d: "Fried eggs on tortillas with beans, salsa and cotija", s: "bl", x: "DE", g: "pfq", f: "sht", i: "eggs, corn tortillas, black beans, salsa, cotija" },
  { n: "Egg drop soup", d: "Silky ribbons of egg in hot chicken broth with ginger and scallion", s: "bld", x: "CE", g: "pwtlq", f: "ms", i: "chicken broth, eggs, ginger, scallions" },
  { n: "Maple turkey sausage patties", d: "Homemade patties with sage and a touch of maple, freeze to reheat", s: "b", x: "C", g: "pzhq", f: "swe", i: "ground turkey, maple syrup, sage" },
  { n: "Pumpkin spice chia pudding", d: "Like pumpkin pie in a jar", s: "b", x: "D", g: "fhq", f: "w", i: "chia seeds, milk, pumpkin, maple syrup, cinnamon" },
  { n: "Soft scrambled eggs with smoked salmon", d: "Creamy eggs folded with smoked salmon and chives", s: "b", x: "DEF", g: "paq", f: "sc", i: "eggs, smoked salmon, cream cheese, chives" },

  // Lunch
  { n: "Rotisserie chicken BLT wraps", d: "Chicken, bacon, lettuce, tomato and mayo", s: "l", x: "CPEG", g: "phq", f: "s", i: "rotisserie chicken, bacon, lettuce, tomatoes, mayonnaise, tortillas" },
  { n: "Greek chicken pitas with tzatziki", d: "Rotisserie chicken, cucumber, tomato, feta and garlicky yogurt", s: "ld", x: "CDG", g: "phq", f: "te", i: "rotisserie chicken, pita, yogurt, cucumber, feta" },
  { n: "Buffalo chicken wraps", d: "Spicy chicken, ranch, crunchy lettuce", s: "ld", x: "CDEG", g: "phq", f: "hc", i: "chicken, buffalo sauce, ranch, lettuce, tortillas" },
  { n: "Tomato soup and grilled cheese", d: "Creamy tomato soup with crisp, buttery grilled cheese", s: "ld", x: "DG", g: "kwq", f: "cmt", i: "tomatoes, cream, bread, cheddar, butter" },
  { n: "Creamy sausage tortellini soup", d: "Italian sausage, cheese tortellini and spinach in a creamy broth", s: "ld", x: "PDEG", g: "kwzq", f: "sc", i: "italian sausage, cheese tortellini, spinach, cream" },
  { n: "Chicken tortilla soup", d: "Shredded chicken, beans and tomatoes with lime, avocado and chips", s: "ld", x: "C", g: "pfwzq", f: "sht", i: "chicken, black beans, tomatoes, corn, lime, tortilla chips" },
  { n: "Potato, sausage and kale soup", d: "Creamy, savory and so filling", s: "ld", x: "PD", g: "kwzq", f: "sc", i: "italian sausage, potatoes, kale, cream" },
  { n: "Broccoli cheddar soup", d: "Thick, cheesy and good with crusty bread", s: "ld", x: "DG", g: "wzq", f: "cm", i: "broccoli, cheddar, milk, flour, onions" },
  { n: "Italian wedding soup", d: "Little meatballs, tiny pasta and greens in broth", s: "ld", x: "MDEG", g: "pwzq", f: "se", i: "ground beef, breadcrumbs, eggs, parmesan, pasta, spinach" },
  { n: "Lemon chicken orzo soup", d: "Bright, brothy and comforting", s: "ld", x: "CG", g: "wztq", f: "te", i: "chicken, orzo, lemon, carrots, dill" },
  { n: "Pizza quesadillas", d: "Pepperoni and mozzarella with marinara for dipping", s: "l", x: "PDG", g: "khq", f: "cs", i: "pepperoni, mozzarella, flour tortillas, marinara" },
  { n: "Crispy chicken tenders with honey mustard", d: "Oven-baked panko tenders, easy on a tired appetite", s: "ld", x: "CEG", g: "phq", f: "swm", i: "chicken, panko, eggs, honey, mustard" },
  { n: "Chicken lettuce wraps", d: "Ground chicken with hoisin, garlic and water chestnuts in crisp lettuce", s: "ld", x: "CYG", g: "ptq", f: "sw", i: "ground chicken, hoisin, garlic, water chestnuts, lettuce" },
  { n: "Cold sesame peanut noodles", d: "Slurpy noodles in a sweet-salty peanut sauce", s: "l", x: "YGN", g: "kcq", f: "swh", i: "noodles, peanut butter, soy sauce, sesame, cucumber" },
  { n: "Caprese pasta salad", d: "Pasta, cherry tomatoes, mozzarella pearls, basil and balsamic", s: "l", x: "DG", g: "cq", f: "etc", i: "pasta, tomatoes, mozzarella, basil, balsamic" },
  { n: "Greek orzo salad", d: "Orzo with cucumber, olives, feta and lemon-oregano dressing", s: "l", x: "DG", g: "ctq", f: "te", i: "orzo, cucumber, olives, feta, lemon" },
  { n: "Cucumber cream cheese sandwiches", d: "Soft bread, herbed cream cheese and cucumber, gentle and refreshing", s: "l", x: "DG", g: "htq", f: "me", i: "bread, cream cheese, cucumber, dill" },
  { n: "BBQ chicken flatbread", d: "Smoky-sweet chicken, red onion, mozzarella and cilantro", s: "ld", x: "CDG", g: "pkq", f: "wsc", i: "chicken, bbq sauce, naan, mozzarella, red onion" },
  { n: "Turkey, apple and brie sandwiches", d: "Crisp apple, creamy brie and a smear of fig jam", s: "l", x: "CDG", g: "phq", f: "wc", i: "turkey, apples, brie, fig jam, bread" },
  { n: "Ham and swiss pinwheels", d: "Rolled tortillas sliced into bites, perfect for grazing", s: "l", x: "PDG", g: "hzq", f: "scm", i: "ham, swiss cheese, cream cheese, flour tortillas" },
  { n: "Black bean and cheese quesadillas", d: "Crispy tortillas, beans, cheese and salsa", s: "ld", x: "DG", g: "fkhq", f: "cs", i: "black beans, cheddar, flour tortillas, salsa" },
  { n: "Chicken burrito bowls", d: "Cilantro-lime rice, chicken, beans, corn, salsa and sour cream", s: "ld", x: "CD", g: "pcfq", f: "sht", i: "chicken, rice, black beans, corn, salsa, sour cream" },
  { n: "Easy miso ramen with a soft egg", d: "Instant noodles upgraded with miso broth, greens and a jammy egg", s: "ld", x: "EYG", g: "wq", f: "sm", i: "ramen noodles, miso, eggs, spinach, scallions" },
  { n: "Smashed chickpea salad sandwiches", d: "Like chicken salad, made with chickpeas, lemon and dill", s: "l", x: "EG", g: "fphq", f: "te", i: "chickpeas, mayonnaise, celery, lemon, dill, bread" },
  { n: "Slow-cooker French dip sandwiches", d: "Tender beef, provolone and rich broth for dipping", s: "ld", x: "MDG", g: "piwq", f: "s", i: "beef roast, provolone, rolls, beef broth" },
  { n: "Sloppy joes", d: "Sweet-tangy beef on soft buns", s: "ld", x: "MG", g: "pkzq", f: "ws", i: "ground beef, tomato sauce, brown sugar, buns" },
  { n: "Meatball subs", d: "Frozen or homemade meatballs, marinara and melted provolone", s: "ld", x: "MDEG", g: "pkzq", f: "sc", i: "meatballs, marinara, provolone, hoagie rolls" },
  { n: "Ginger-scallion beef bone broth", d: "Mugs of rich broth to sip between feeds, a traditional recovery food", s: "ld", x: "M", g: "wiltq", f: "sm", i: "beef bone broth, ginger, scallions, salt" },
  { n: "Coconut chicken soup", d: "Chicken in coconut broth with lime and lemongrass", s: "ld", x: "CF", g: "waq", f: "ts", i: "chicken, coconut milk, lime, lemongrass, fish sauce, mushrooms" },
  { n: "Pimento cheese sandwiches", d: "Sharp cheddar, pimentos and mayo on soft bread", s: "l", x: "DEG", g: "khq", f: "cs", i: "cheddar, pimentos, mayonnaise, bread" },

  // Dinner
  { n: "Honey garlic chicken thighs", d: "Sticky, glossy chicken from one pan, with rice", s: "d", x: "CYG", g: "pq", f: "ws", i: "chicken thighs, honey, garlic, soy sauce, rice" },
  { n: "Lemon-herb sheet-pan chicken and potatoes", d: "Everything roasted together with lemon, garlic and oregano", s: "d", x: "C", g: "pq", f: "te", i: "chicken thighs, potatoes, lemon, garlic, oregano" },
  { n: "Slow-cooker salsa chicken tacos", d: "Two ingredients in the crockpot, shred and serve", s: "d", x: "C", g: "pzq", f: "ht", i: "chicken, salsa, corn tortillas, lime" },
  { n: "Slow-cooker pepperoncini pot roast", d: "Melt-in-your-mouth beef with butter, ranch seasoning and pepperoncini", s: "d", x: "MD", g: "piwzq", f: "st", i: "beef chuck, butter, ranch seasoning, pepperoncini" },
  { n: "Creamy Tuscan chicken", d: "Seared chicken in a garlicky cream sauce with sun-dried tomatoes and spinach", s: "d", x: "CD", g: "paq", f: "ces", i: "chicken, cream, parmesan, sun-dried tomatoes, spinach, garlic" },
  { n: "Garlic butter steak bites with mashed potatoes", d: "Seared steak cubes in garlic butter", s: "d", x: "MD", g: "pikq", f: "s", i: "sirloin, butter, garlic, potatoes" },
  { n: "Korean beef rice bowls", d: "Ground beef in a sweet soy-ginger glaze over rice", s: "d", x: "MYG", g: "picq", f: "ws", i: "ground beef, soy sauce, brown sugar, ginger, rice" },
  { n: "One-pot cheeseburger pasta", d: "A grown-up hamburger helper, cheesy and comforting", s: "d", x: "MDG", g: "kcpzq", f: "csm", i: "ground beef, pasta, cheddar, milk" },
  { n: "Taco soup", d: "Dump-and-simmer beef, beans, corn and tomatoes", s: "dl", x: "MD", g: "pfzwq", f: "hs", i: "ground beef, beans, corn, tomatoes, taco seasoning" },
  { n: "Swedish meatballs over egg noodles", d: "Tender meatballs in a creamy, savory gravy", s: "d", x: "MDEG", g: "pkwzq", f: "csm", i: "ground beef, breadcrumbs, eggs, cream, egg noodles" },
  { n: "Chicken alfredo bake", d: "Penne, chicken and broccoli in a creamy parmesan sauce", s: "d", x: "CDG", g: "kcpzq", f: "cm", i: "chicken, penne, cream, parmesan, broccoli" },
  { n: "Sausage and white bean skillet with greens", d: "Garlicky beans, browned sausage and spinach in 20 minutes", s: "d", x: "P", g: "pfiq", f: "se", i: "italian sausage, white beans, spinach, garlic" },
  { n: "Shrimp scampi with linguine", d: "Garlic, butter, lemon and parsley", s: "d", x: "SDG", g: "pq", f: "tes", i: "shrimp, linguine, butter, garlic, lemon" },
  { n: "Garlic butter salmon with asparagus", d: "One sheet pan, 15 minutes", s: "d", x: "FD", g: "paq", f: "te", i: "salmon, asparagus, butter, garlic, lemon" },
  { n: "Lemony baked cod with buttery crumbs", d: "Flaky white fish under a crisp topping, very gentle", s: "d", x: "FDG", g: "ptq", f: "tem", i: "cod, panko, butter, lemon, parsley" },
  { n: "Sweet and sour chicken", d: "Crispy chicken with peppers and pineapple in a tangy sauce, over rice", s: "d", x: "CE", g: "pcq", f: "wt", i: "chicken, eggs, cornstarch, pineapple, peppers, ketchup, rice" },
  { n: "Cashew chicken", d: "Takeout-style chicken and cashews in a savory glaze", s: "d", x: "CYNG", g: "pq", f: "sw", i: "chicken, cashews, soy sauce, garlic, rice" },
  { n: "Ground turkey and sweet potato skillet", d: "Smoky spiced turkey, sweet potatoes and peppers", s: "d", x: "C", g: "pfq", f: "sh", i: "ground turkey, sweet potatoes, peppers, smoked paprika" },
  { n: "Cheesy chicken, broccoli and rice casserole", d: "A cozy one-dish bake", s: "d", x: "CDG", g: "kwzq", f: "cm", i: "chicken, rice, broccoli, cheddar, cream of chicken soup" },
  { n: "Chicken spaghetti", d: "Southern-style cheesy chicken and spaghetti bake", s: "d", x: "CDG", g: "kczq", f: "cm", i: "chicken, spaghetti, cheddar, cream of chicken soup, tomatoes" },
  { n: "Beef and bean freezer burritos", d: "A dozen wrapped burritos to microwave any time", s: "dl", x: "MDG", g: "pfzhq", f: "sh", i: "ground beef, refried beans, cheddar, flour tortillas" },
  { n: "Chili mac", d: "Chili and macaroni, topped with melted cheddar", s: "d", x: "MDG", g: "kpzwq", f: "sc", i: "ground beef, macaroni, beans, tomatoes, cheddar" },
  { n: "Slow-cooker pork carnitas", d: "Orange and garlic pork, crisped under the broiler, for tacos or bowls", s: "d", x: "P", g: "pzq", f: "ts", i: "pork shoulder, orange, garlic, cumin, corn tortillas" },
  { n: "BBQ pulled chicken sliders", d: "Crockpot chicken in barbecue sauce on slider buns", s: "dl", x: "CG", g: "pzhq", f: "ws", i: "chicken, bbq sauce, slider buns" },
  { n: "Pork tenderloin with apples and onions", d: "Roasted together, sweet and savory", s: "d", x: "P", g: "ptq", f: "ws", i: "pork tenderloin, apples, onions, thyme" },
  { n: "Ranch pork chops and potatoes", d: "Sheet-pan chops and potatoes with ranch seasoning", s: "d", x: "PD", g: "pq", f: "se", i: "pork chops, potatoes, ranch seasoning, butter" },
  { n: "Sheet-pan chicken shawarma bowls", d: "Spiced chicken, rice, cucumber-tomato salad and garlic yogurt", s: "d", x: "CD", g: "pq", f: "ets", i: "chicken thighs, cumin, paprika, rice, yogurt, cucumber" },
  { n: "One-pot Greek lemon chicken and rice", d: "Chicken and rice baked in lemony broth", s: "d", x: "C", g: "pcwq", f: "te", i: "chicken thighs, rice, lemon, garlic, oregano" },
  { n: "Black bean tacos with lime crema", d: "Crispy-edged beans, slaw and a cool lime sauce", s: "d", x: "D", g: "fcq", f: "th", i: "black beans, corn tortillas, cabbage, sour cream, lime" },
  { n: "Vegetable fried rice", d: "Leftover rice, eggs, peas and carrots in 15 minutes", s: "d", x: "EYG", g: "cq", f: "s", i: "rice, eggs, peas, carrots, soy sauce" },
  { n: "Creamy tomato tortellini bake", d: "Cheese tortellini in tomato cream sauce under bubbly mozzarella", s: "d", x: "DEG", g: "kczq", f: "ct", i: "cheese tortellini, marinara, cream, mozzarella" },
  { n: "Sheet-pan gnocchi with sausage and peppers", d: "Crispy gnocchi roasted with everything else", s: "d", x: "PEG", g: "kcq", f: "s", i: "gnocchi, italian sausage, peppers, onions" },
  { n: "Pasta e fagioli", d: "Hearty bean and pasta soup with parmesan rind", s: "dl", x: "G", g: "fwzq", f: "se", i: "pasta, cannellini beans, tomatoes, carrots, celery" },
  { n: "Spaghetti carbonara", d: "Bacon, egg and pecorino in 20 minutes", s: "d", x: "PDEG", g: "kaq", f: "sc", i: "spaghetti, bacon, eggs, pecorino" },
  { n: "One-pot beef stroganoff", d: "Beef and mushrooms in a sour cream sauce over egg noodles", s: "d", x: "MDEG", g: "pkwq", f: "csm", i: "beef, mushrooms, sour cream, egg noodles" },
  { n: "Slow-cooker garlic chicken with gravy", d: "Bone-in thighs cooked low with garlic until they fall apart", s: "d", x: "CG", g: "pwzq", f: "sm", i: "chicken thighs, garlic, chicken broth, flour" },
  { n: "Beef and liver meatballs", d: "A little liver hidden in savory meatballs, for iron and B12 without the taste", s: "d", x: "MDEG", g: "pizq", f: "se", i: "ground beef, beef liver, breadcrumbs, eggs, parmesan" },
  { n: "Slow-cooker braised short ribs", d: "Fall-apart beef in a rich tomato-garlic sauce, over mashed potatoes", s: "d", x: "M", g: "piawq", f: "s", i: "beef short ribs, tomatoes, garlic, onions" },
  { n: "Hamburger steaks with onion gravy", d: "Diner comfort food with mashed potatoes", s: "d", x: "MG", g: "pwq", f: "sm", i: "ground beef, onions, beef broth, flour" },
  { n: "Bruschetta chicken", d: "Chicken topped with tomatoes, basil, mozzarella and balsamic", s: "d", x: "CD", g: "ptq", f: "te", i: "chicken, tomatoes, basil, mozzarella, balsamic" },
  { n: "Easy lo mein", d: "Noodles and vegetables in a savory-sweet sauce", s: "d", x: "EYG", g: "cq", f: "sw", i: "lo mein noodles, soy sauce, cabbage, carrots" },
  { n: "Baked ravioli", d: "Frozen ravioli layered with sauce and cheese, no boiling", s: "d", x: "DEG", g: "kczq", f: "cm", i: "frozen ravioli, marinara, mozzarella" },
  { n: "Arroz con pollo", d: "Chicken and saffron-tinted rice with peas, all in one pot", s: "d", x: "C", g: "pcwzq", f: "se", i: "chicken, rice, peas, peppers, saffron" },
  { n: "Kielbasa, potatoes and green beans", d: "A sheet-pan supper with smoky sausage", s: "d", x: "P", g: "kq", f: "s", i: "kielbasa, potatoes, green beans" },
  { n: "Turkey and stuffing casserole", d: "Thanksgiving in a dish", s: "d", x: "CDEG", g: "kwzq", f: "sm", i: "turkey, stuffing mix, green beans, cream of chicken soup" },
  { n: "Mild chicken korma", d: "Chicken in a gentle, creamy cashew-yogurt sauce with rice", s: "d", x: "CDN", g: "pwaq", f: "cm", i: "chicken, yogurt, cashews, cream, garam masala, rice" },
  { n: "Baked chicken taquitos", d: "Crispy rolled tortillas with cheesy chicken, dip in salsa or guac", s: "d", x: "CD", g: "hzq", f: "sc", i: "chicken, cream cheese, corn tortillas, cheddar" },
];

// Meals with an id ("lib-0", "lib-1", …) and their meal times as slot ids.
const SLOT_BY_CODE = Object.fromEntries(SLOTS.map((s) => [s.code, s.id]));
export const MEALS = RAW.map((m, i) => ({
  id: `lib-${i}`, name: m.n, desc: m.d, contains: m.x, goals: m.g, flavors: m.f, ingredients: m.i,
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

// Library meals that fit her diets and foods to avoid, best match for her goals and flavors first.
export function suggest(prefs = {}) {
  const banned = new Set(DIETS.filter((d) => prefs.diet?.includes(d.id)).flatMap((d) => [...d.excludes]));
  const avoid = avoidWords(prefs.avoid);
  const goals = prefs.goals || [], flavors = prefs.flavors || [];
  return MEALS
    .filter((m) => ![...m.contains].some((c) => banned.has(c)) && !avoid.some((w) => mentions(m, w)))
    .map((m) => ({ ...m, matched: goals.filter((g) => m.goals.includes(g)), tasty: flavors.filter((f) => m.flavors.includes(f)) }))
    .sort((a, b) => b.matched.length + b.tasty.length - a.matched.length - a.tasty.length
      || a.id.localeCompare(b.id, undefined, { numeric: true }));
}

// For a dish she typed herself: which "foods to avoid" it mentions (a warning, not a block).
export function avoidHits(dish, prefs = {}) {
  return avoidWords(prefs.avoid).filter((w) => mentions({ name: dish.name, ingredients: dish.desc || "" }, w));
}
