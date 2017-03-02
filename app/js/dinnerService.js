// Here we create an Angular service that we will use for our
// model. In your controllers (or other services) you can include the
// dependency on any service you need. Angular will insure that the
// service is created first time it is needed and then just reuse it
// the next time.
dinnerPlannerApp.factory('Dinner', function($resource,$cookieStore) {
    if(typeof($cookieStore.get("guests")) == 'undefined'){
            console.log("HEJ");
        $cookieStore.put("guests",0);
    }
    if(typeof($cookieStore.get("dishIds")) == 'undefined'){
        console.log("HEJ");
        $cookieStore.put("dishIds",[]);
    }



    this.setNumberOfGuests = function(num) {
        $cookieStore.put("guests",num);
        numberOfGuest = num;
    }
    this.getNumberOfGuests = function() {
        return numberOfGuest;
    }

    //getAllDishes
    //example call: Dinner.DishSearch.get({query:'hummus',type:'appetizer'})
    this.DishSearch = $resource('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search', {}, {
        get: {
            headers: {
                'X-Mashape-Key': 'Qu9grxVNWpmshA4Kl9pTwyiJxVGUp1lKzrZjsnghQMkFkfA4LB'
            }
        }
    });

    //getdish
    //example call: Dinner.Dish.get({id:583901}).
    this.Dish = $resource('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/:id/information', {}, {
        get: {
            headers: {
                'X-Mashape-Key': 'Qu9grxVNWpmshA4Kl9pTwyiJxVGUp1lKzrZjsnghQMkFkfA4LB'
            }
        }
    });

    this.Joke = $resource('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/jokes/random', {}, {
        get: {
            headers:{
                'X-Mashape-Key': 'Qu9grxVNWpmshA4Kl9pTwyiJxVGUp1lKzrZjsnghQMkFkfA4LB'

            }
        }
    });

    // TODO in Lab 5: Add your model code from previous labs
    // feel free to remove above example code
    // you will need to modify the model (getDish and getAllDishes)
    // a bit to take the advantage of Angular resource service
    // check lab 5 instructions for details
    //Returns all the dishes on the menu.
    this.getFullMenu = function() {
        return selectedDishesFull;
    }

    this.createFullMenu = function() {
        if(selectedDishes.length == 0 ){
            return;
        }
        selectedDishes.forEach(dishId =>{
            this.Dish.get({id:dishId},function(dish){
                selectedDishesFull.push(dish);
            },function(error){
                console.log(error);
            })
        })
    }
    this.getAllIngredients = function() {
        var ingredientsList = [];
        selectedDishesFull.forEach(dish => {
            ingredientsList = ingredientsList.concat(dish.extendedIngredients);
        });
        return ingredientsList;
    }

    this.getTotalMenuPrice = function() {
        if (numberOfGuest == 0 || selectedDishesFull.length == 0) {
            return 0;
        }
        var allIngredients = this.getAllIngredients();
        var sum = 0;
        selectedDishesFull.forEach(dish => {
            sum += this.dishCost(dish);
        });
        return sum;
    }

    this.addDishToMenu = function(id) {
        var index = selectedDishes.indexOf(parseInt(id, 10));
        if (index != -1) {
            return 0;
        }
        this.Dish.get({id:id},function(data){
            $cookieStore.remove("dishIds",selectedDishes);
            selectedDishes.push(id);
            $cookieStore.put("dishIds",selectedDishes);
            selectedDishesFull.push(data);
            //return data;
        },function(data){
            console.log("Error");
        });
    }
        //Removes dish from menu
    this.removeDishFromMenu = function(id) {
        var index = selectedDishes.indexOf(id);
        if (index == -1) {
            return; //is not in list
        }
        var fullIndex = selectedDishesFull.map(function(element) {
            return element.id;
        }).indexOf(id);
        $cookieStore.remove("dishIds");
        selectedDishes.splice(index, 1);
        $cookieStore.put("dishIds",selectedDishes);
        selectedDishesFull.splice(fullIndex, 1);
        return;
    }
        //we know it is added, so we just return it from selectedDishesFull
    this.getSelDish = function(id) {
        var fullIndex = selectedDishesFull.map(function(element) {
            return element.id;
        }).indexOf(id);
        return selectedDishesFull[fullIndex];
    }
        //Cost for one portion of a dish
    this.oneDishCost = function(dish) {
        var sum = 0;
        dish.extendedIngredients.forEach(ingredient => {
            sum += ingredient.amount;
        });
        sum = Math.round(sum * 100) / 100;
        return sum;
    }

    this.dishCost = function(dish) {
        var sum = this.oneDishCost(dish);
        return sum * numberOfGuest;
    }

    var numberOfGuest = $cookieStore.get("guests");
    //console.log(numberOfGuest); //should be 0 later
    var selectedDishes = $cookieStore.get("dishIds");
    //console.log(selectedDishes);
    var selectedDishesFull = []
        //console.log(selectedDishesFull);
    this.createFullMenu();
        //console.log(selectedDishesFull);

        // Angular service needs to return an object that has all the
        // methods created in it. You can consider that this is instead
        // of calling var model = new DinnerModel() we did in the previous labs
        // This is because Angular takes care of creating it when needed.
    return this;
});
