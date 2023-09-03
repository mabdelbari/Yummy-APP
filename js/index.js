var nameSearchInput = document.getElementById('nameSearch');
var letterSearchInput = document.getElementById('letterSearch');

var nameField, emailField, phoneField, ageField, passField, confirmPassField;
var isNameFieldFocused, isEmailFieldFocused, isPhoneFieldFocused, isAgeFieldFocused, isPassFieldFocused, isconfirmPassFieldFocused = false


var nameRegex = /^[a-z]{1,}(?:\s[a-z]{2,})*$/i;
var emailRegex = /^[\w\-\.]+@(\w+\-?\w+\.){1,3}[\w-]{2,4}$/i;
var phoneRegex = /^[\+]?[(]?[\d]{3}[)]?[-\s\.]?[\d]{3}[-\s\.]?[\d]{4,6}$/;
var ageRegex = /^([1-9][0-9]|[1][0-9][0-9]|200)$/; // AGe should be greater than or equal 10
// Password must contain at least two uppercase, two lowercase, two digits, two special characters and with no whitespaces
var PassRegex = /^(?=(?:.*?[0-9]){2})(?=(?:.*?[a-z]){2})(?=(?:.*?[A-Z]){2})(?=(?:.*?[^a-zA-Z0-9]){2})(?!.*\s).{8,30}$/;

$(document).ready(() => {
    searchMealByName("");

    closeSideNavbar($(".collapse-button"));

    var timer
    nameSearchInput.addEventListener('input', function () {
        clearInterval(timer);
        timer = setTimeout(() => {
            searchMealByName(this.value);
        }, 500);
    })


    letterSearchInput.addEventListener('input', function () {
        clearInterval(timer);
        timer = setTimeout(() => {
            searchMealByLetter(this.value);
        }, 500);
    })


    $('.expand-button').click(function () {
        openSideNavbar(this);
    })

    $('.collapse-button').click(function () {
        closeSideNavbar(this);
    })


    $('.nav-links li').eq(0).click(showSearchInputs); // Search Nav Link
    $('.nav-links li').eq(1).click(getCategories); // Categories Nav Link
    $('.nav-links li').eq(2).click(getAreas); // Area Nav Link
    $('.nav-links li').eq(3).click(getIngredients); // Ingredients Nav link
    $('.nav-links li').eq(4).click(showContactUS); // ContactUs Nav Link

})


function openSideNavbar(e) {
    $('nav').animate({ left: 0 }, 500);
    $(e).removeClass('d-block');
    $(e).addClass('d-none');
    $('.collapse-button').removeClass('d-none');
    $('.collapse-button').addClass('d-block');


    for (let i = 0; i < 5; i++) {
        $('.nav-links .nav-item').eq(i).animate({
            top: 0
        }, (i + 5) * 100);
    }

}

function closeSideNavbar(e) {
    $('nav').animate({ left: -$('.collapse-menu').outerWidth(true) }, 500);
    $(e).removeClass('d-block');
    $(e).addClass('d-none');
    $('.expand-button').addClass('d-block');
    $('.expand-button').removeClass('d-none');

    for (let i = 4, j = 0; i >= 0; i--, j++) {
        $('.nav-links .nav-item').eq(i).animate({
            top: 400
        }, (j + 5) * 100);
    }
}

function displayMeals(meals) {
    let dataContainer = ``;

    for (let i = 0; i < meals.length; i++) {
        dataContainer += `
        <div class="col-md-3">
            <div onclick="getMealDetails(${meals[i].idMeal})" class="meal rounded position-relative overflow-hidden">
                <img src="${meals[i].strMealThumb}"
                    class="w-100 rounded" alt="" loading="lazy">
                <div
                    class="overlay position-absolute top-100 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-center">
                    <h4>${meals[i].strMeal}</h4>
                </div>
            </div>
        </div>
        `
    }

    $('#data-container').html(dataContainer);
}

function displayMealDetails(mealDetails) {
    let mealTagsArray = (mealDetails.strTags) ? mealDetails.strTags.split(",") : [];
    let mealRecipes = ``;
    let mealTagsHTML = ``;
    let dataContainer = ``;


    for (let i = 1; i <= 20; i++) {
        let strIngre = "strIngredient" + i;
        let strMeasure = "strMeasure" + i;
        if (mealDetails[strIngre] && mealDetails[strMeasure]) {
            mealRecipes += `
            <li class="py-1 px-2 rounded bg-info-subtle text-info-emphasis">${mealDetails[strMeasure]} ${mealDetails[strIngre]}</li>
            `
        }

    }

    for (let i = 0; i < mealTagsArray.length; i++) {
        mealTagsHTML += `
        <div class="py-1 px-2 rounded bg-danger-subtle text-danger-emphasis">${mealTagsArray[i]}</div>
        `
    }

    dataContainer = `
    <div class="col-md-4">
        <img src="${mealDetails.strMealThumb}" class="w-100 rounded"
            alt="" loading="lazy">
        <h2 class="text-white">${mealDetails.strMeal}</h2>
    </div>
    <div class="col-md-8">
        <div class="meal-details text-white">
            <div class="meal-instructions">
                <h2 class="fw-medium">Instructions</h2>
                <p>${mealDetails.strInstructions}</p>
            </div>
            <div class="meal-area">
                <h3><span class="fw-bold">Area : </span>${mealDetails.strArea}</h3>
            </div>
            <div class="meal-category">
                <h3><span class="fw-bold">Category : </span>${mealDetails.strCategory}</h3>
            </div>
            <div class="meal-recipes">
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex column-gap-3 row-gap-3 flex-wrap px-2 my-4">
                    ${mealRecipes}
                </ul>
            </div>
            <div class="meal-tags">
                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex column-gap-3 row-gap-3 flex-wrap px-2 my-4">
                    ${mealTagsHTML}
                </ul>
            </div>
            <a href="${mealDetails.strSource}" target="_blank" class="btn btn-success">Source</a>
            <a href="${mealDetails.strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>
        </div >
    </div >
    `;

    $('#data-container').html(dataContainer);
}

function displayCategories(categories) {
    let dataContainer = ``;

    for (let i = 0; i < categories.length; i++) {
        dataContainer += `
        <div class="col-md-3">
            <div onclick="getCategoryMeals('${categories[i].strCategory}')" class="category rounded position-relative overflow-hidden">
                <img src="${categories[i].strCategoryThumb}" class="w-100 rounded" alt="" loading="lazy">
                <div
                    class="overlay position-absolute top-100 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center p-2">
                    <h4>${categories[i].strCategory}</h4>
                    <p>${categories[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>
        `
    }

    $('#data-container').html(dataContainer);
}

function displayAreas(areas) {
    let dataContainer = ``;

    for (let i = 0; i < areas.length; i++) {
        dataContainer += `
        <div class="col-md-3">
            <div onclick="getAreaMeals('${areas[i].strArea}')" class="area text-white text-center">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${areas[i].strArea}</h3>
            </div>
        </div>
        `
    }

    $('#data-container').html(dataContainer);
}

function displayIngredients(ingredients) {
    let dataContainer = ``;

    for (let i = 0; i < ingredients.length; i++) {
        dataContainer += `
        <div class="col-md-3">
            <div onclick="getIngredientMeals('${ingredients[i].strIngredient}')" class="ingredient text-white text-center">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${ingredients[i].strIngredient}</h3>
                <p>${ingredients[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>
        `
    }

    $('#data-container').html(dataContainer);
}



async function getMealDetails(mealID) {
    $('#loading-screen').fadeIn(300);

    $('#search-inputs').slideUp(500);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(r => r.json())

    displayMealDetails(response.meals[0]);
    $('#loading-screen').fadeOut(500);
}

async function getCategories() {
    $('#loading-screen').fadeIn(300);

    $('#search-inputs').slideUp(500);

    closeSideNavbar($(".collapse-button"));

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
        .then(r => r.json())

    displayCategories(response.categories);
    $('#loading-screen').fadeOut(500);
}

async function getCategoryMeals(categoryName) {
    $('#loading-screen').fadeIn(300);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`)
        .then(r => r.json())

    displayMeals(response.meals);
    $('#loading-screen').fadeOut(500);
}

async function getAreas() {
    $('#loading-screen').fadeIn(300);

    $('#search-inputs').slideUp(500);

    closeSideNavbar($(".collapse-button"));

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
        .then(r => r.json())

    displayAreas(response.meals);
    $('#loading-screen').fadeOut(500);

}

async function getAreaMeals(areaName) {
    $('#loading-screen').fadeIn(300);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`)
        .then(r => r.json())

    displayMeals(response.meals);
    $('#loading-screen').fadeOut(500);

}

async function getIngredients() {
    $('#loading-screen').fadeIn(300);

    $('#search-inputs').slideUp(500);

    closeSideNavbar($(".collapse-button"));

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
        .then(r => r.json())

    displayIngredients(response.meals.slice(0, 25));
    $('#loading-screen').fadeOut(500);
}

async function getIngredientMeals(ingredientName) {
    $('#loading-screen').fadeIn(300);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientName.replace(" ", "_")}`)
        .then(r => r.json())

    displayMeals(response.meals);
    $('#loading-screen').fadeOut(500);
}

async function searchMealByName(name) {
    $('#loading-screen').fadeIn(300);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
        .then(r => r.json())

    response.meals ? displayMeals(response.meals) : displayMeals([]);
    $('#loading-screen').fadeOut(500);
}

async function searchMealByLetter(letter) {
    if (/^[a-zA-Z]$/.test(letter)) {

        $('#loading-screen').fadeIn(300);

        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
            .then(r => r.json())

        displayMeals(response.meals);
        $('#loading-screen').fadeOut(500);
    }
}

function showSearchInputs() {
    $('#nameSearch').val('');
    $('#letterSearch').val('');
    $('#search-inputs').slideDown(500);

    $('#data-container').html('');

    closeSideNavbar($(".collapse-button"));
}

function showContactUS() {

    $('#search-inputs').slideUp(500);

    closeSideNavbar($(".collapse-button"));

    let dataContainer = `
    <div class="contactUs min-vh-100 d-flex justify-content-center align-items-center">
        <div class="container w-75">
            <div class="row gy-4">
                <div class="col-md-6">
                    <input type="text" id="nameField" class="form-control" placeholder="Enter Your Name">
                    <div id="nameAlert" class="alert alert-danger w-100 mt-2 text-center">
                        Special characters and numbers not allowed
                    </div>
                </div>
                <div class="col-md-6">
                    <input type="email" id="emailField" class="form-control" placeholder="Enter Your Email">
                    <div id="emailAlert" class="alert alert-danger w-100 mt-2 text-center">
                        Email not valid *example@yyy.zzz
                    </div>
                </div>
                <div class="col-md-6">
                    <input type="text" id="phoneField" class="form-control" placeholder="Enter Your Phone">
                    <div id="phoneAlert" class="alert alert-danger w-100 mt-2 text-center">
                        Enter valid Phone Number
                    </div>
                </div>
                <div class="col-md-6">
                    <input type="number" id="ageField" class="form-control" placeholder="Enter Your Age">
                    <div id="ageAlert" class="alert alert-danger w-100 mt-2 text-center">
                        Enter a valid age <br/>
                        Age should be greater than or equal 10
                    </div>
                </div>
                <div class="col-md-6">
                    <input type="password" id="passField" class="form-control" placeholder="Enter Your Password">
                    <div id="passAlert" class="alert alert-danger w-100 mt-2 text-center">
                        Password must contain at least two uppercase, two lowercase, two digits, two special characters and without whitespaces
                    </div>
                </div>
                <div class="col-md-6">
                    <input type="password" id="confirmPassField" class="form-control" placeholder="Confirm Password">
                    <div id="confirmPassAlert" class="alert alert-danger w-100 mt-2 text-center">
                        Password Doesn't Match
                    </div>
                </div>
                <button id="submitBtn" class="btn btn-outline-danger px-2 mt-3 mx-auto w-auto"
                    disabled="true">Submit</button>
            </div>
        </div>

    </div>
    `

    $('#data-container').html(dataContainer);

    nameField = document.getElementById('nameField');
    emailField = document.getElementById('emailField');
    phoneField = document.getElementById('phoneField');
    ageField = document.getElementById('ageField');
    passField = document.getElementById('passField');
    confirmPassField = document.getElementById('confirmPassField');

    nameField.addEventListener('input', validateContactForm);
    nameField.addEventListener('focus', () => {
        isNameFieldFocused = true
    });
    emailField.addEventListener('input', validateContactForm);
    emailField.addEventListener('focus', () => {
        isEmailFieldFocused = true;
    });
    phoneField.addEventListener('input', validateContactForm);
    phoneField.addEventListener('focus', () => {
        isPhoneFieldFocused = true;
    });
    ageField.addEventListener('input', validateContactForm);
    ageField.addEventListener('focus', () => {
        isAgeFieldFocused = true;
    });
    passField.addEventListener('input', validateContactForm);
    passField.addEventListener('focus', () => {
        isPassFieldFocused = true;
    });
    confirmPassField.addEventListener('input', validateContactForm);
    confirmPassField.addEventListener('focus', () => {
        isconfirmPassFieldFocused = true;
    });
}

// Validation

function validateField(field, regex) {
    if (regex.test(field.value)) {
        return true;
    } else {
        return false;
    }
}

function validateContactForm() {
    if (isNameFieldFocused) {
        if (!validateField(nameField, nameRegex)) {
            $('#nameAlert').addClass('d-block');
        } else {
            $('#nameAlert').removeClass('d-block');
        }
    }

    if (isEmailFieldFocused) {
        if (!validateField(emailField, emailRegex)) {
            $('#emailAlert').addClass('d-block');
        } else {
            $('#emailAlert').removeClass('d-block');
        }
    }

    if (isPhoneFieldFocused) {
        if (!validateField(phoneField, phoneRegex)) {
            $('#phoneAlert').addClass('d-block');
        } else {
            $('#phoneAlert').removeClass('d-block');
        }
    }

    if (isAgeFieldFocused) {
        if (!validateField(ageField, ageRegex)) {
            $('#ageAlert').addClass('d-block');
        } else {
            $('#ageAlert').removeClass('d-block');
        }
    }

    if (isPassFieldFocused) {
        if (!validateField(passField, PassRegex)) {
            $('#passAlert').addClass('d-block');
        } else {
            $('#passAlert').removeClass('d-block');
        }

    }

    if (isconfirmPassFieldFocused) {
        if (!(passField.value == confirmPassField.value)) {
            $('#confirmPassAlert').addClass('d-block');
        } else {
            $('#confirmPassAlert').removeClass('d-block');
        }
    }

    if (validateField(nameField, nameRegex) &&
        validateField(emailField, emailRegex) &&
        validateField(phoneField, phoneRegex) &&
        validateField(ageField, ageRegex) &&
        validateField(passField, PassRegex) &&
        (passField.value == confirmPassField.value)
    ) {
        $('#submitBtn').removeAttr('disabled');
    } else {
        $('#submitBtn').attr('disabled', 'true');
    }

}