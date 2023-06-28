var c=0;
//--------------getting json data by xmlhttp request-------------------
let xmlhttp = new XMLHttpRequest();
xmlhttp.open('get', 'products.json', true);
xmlhttp.send();
xmlhttp.onload = function () {
    if (this.readyState == 4 && this.status == 200) {
        var items = JSON.parse(this.responseText);
        loadbutton = document.getElementById("load");
        product_price_data = items["price"];
        //console.log(items)
        display_products();

        //---------Event listener for sorting using price--------------------
        document.getElementById("sortby-price").addEventListener("click", function () {
            document.getElementById("sortby-price").classList.add("active")
            document.getElementById("sortby-new").classList.remove("active")
            items.sort(PriceSortOrder("price", "listed-price"));
            display_products();
        });

        //---------Event listener for sorting using newest first--------------------
        document.getElementById('sortby-new').addEventListener("click", function () {
            document.getElementById("sortby-new").classList.add("active")
            document.getElementById("sortby-price").classList.remove("active")
            items.sort(NewSortOrder("product_label"));
            display_products();
        });

        //------------------function to display products data from json-------------------
        function display_products() {
            var jsonlength = (items.length / 9);
            var display_Elements = 9;
            var count = 0;
            var counter_json = 1;
            let output = "";
            let output_html_product = "";
            if (items.lenght <= 9) {
                display_Elements = items.length;
                loadProducts();
                document.getElementById("load").style.display = "none";
            }
            //-----------function to load 9 products eact time---------------------------
            function loadProducts() {
                for (var i = count; i < display_Elements; i++) {
                    product = items[i];
                    product_price_data = product.price;
                    output_html_product += getProductHtml(output, product);
                    count++;
                }
                console.log(count)
                document.getElementById("results-display").innerHTML = `Showing 1 – ${display_Elements} of ${items.length} results for “Phone”`
                document.getElementById("mobile-results-display").innerHTML = `Showing 1 – ${display_Elements} of ${items.length} results for “Phone”`
                display_Elements += 9;
                counter_json += 1;
                document.getElementById("products-data").innerHTML = output_html_product;
            }
            loadProducts();

            //-----------loading more products on click---------------------------------
            if (document.getElementById("load").style.display != "none") {
                loadbutton.addEventListener("click", function(){
                    if (jsonlength > counter_json) {
                        loadProducts();
                    }
                    else {
                        for (var i = count; i < items.length; i++) {
                            product = items[i];
                            console.log(product);
                            product_price_data = product.price;
                            output_html_product += getProductHtml(output, product);
                            count++;
                        }
                        document.getElementById("results-display").innerHTML = `Showing 1 – ${items.length} of ${items.length} results for “Phone”`
                        document.getElementById("mobile-results-display").innerHTML = `Showing 1 – ${items.length} of ${items.length} results for “Phone”`
                        if (count == items.length) {
                            document.getElementById("load").style.display = "none";
                            //document.getElementById("scroll").style.top = "0px";
                        }
                        document.getElementById("products-data").innerHTML = output_html_product;
                    }
                });
                document.getElementById("scroll").addEventListener("click",function(){
                        //document.body.scrollTop = 0;
                        document.documentElement.scrollTop=0;
                });

            }
        }
//---------------------function for brand name filter-----------------------------------------
        var brands = document.getElementsByClassName('brand-name')
        for(let i=0; i<brands.length; i++){
            card=items[i];
            var brand_arr =[]
            brands[i].addEventListener('click', function(){
                if(brands[i].checked){
                    brand_arr.push(brands[i].name)
                }
                else{
                    var index = brand_arr.indexOf(brands[i].name)
                    brand_arr.splice(index,1)
                }
                
                var new_data=[]
                for(let j=0;j<brand_arr.length;j++){
                    let result=card.filter(cards => cards[brands] == brand_arr[j]);
                    new_data=[...new_data,...result];
                }
                console.log(new_data);
                display_products(new_data);
                if(brand_arr.length== 0){
                    display_products();
                }
                
            })

        }
    }
}


//-----------------------------getProduct data Function------------------------------------
function getProductHtml(output, product) {

    output += `<div class="products">

                    <div class="wishlist-icon">
                        <p class="heart-icon"><i class="fa-regular fa-heart" onclick="wishlist(this);"></i></p>
                        ${fecthingLabels(product.product_label)}
                    </div>
                    <div class="product-image-container">
                        <img class="product-image" src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="mobilebutton">
                        <button class="addtocart" onclick="addtocart()">Add to Cart</button>
                        <button class="viewgallery">View Gallery</button>
                    </div>
                    <div class="product-details">
                        <p class="product-name">${product.name} (${product.color}, ${product.RAM})</p>
                    </div>
                    <div class="rating">
                        ${getrating(product.rating)}
                    </div>
                    <span class="review-count">(${product.reviews})</span>
                    <div class="price flex-container">
                        <p class="listprice">$${product_price_data["listed-price"]}</p>
                        <del class="saleprice">$${product_price_data["sale-price"]}</del>
                        <p class="offer">${getDiscount(product_price_data)}% off</p>
                    </div>
                </div>`
    return output;
}


//---------------------------------labels fecthing function-------------------------------
function fecthingLabels(labels) {
    let labelsHTML = ''
    labels.forEach(element => {
        if (element === "SALE") {
            labelsHTML += `<p class="labels_sale">${element}</p>`;
        }
        else if (element === "NEW") {
            labelsHTML += `<p class="labels_new">${element}</p>`;
        }
        // else {
        //     labelsHTML += `<p class="labels_out">${element}</p>`;
        // }
    });
    return labelsHTML;
}

//--------------------------------rating fecting function---------------------------------
function getrating(rating) {
    let i, rate = '';
    for (i = 1; i <= rating; i++) {
        rate += `<span class="each-star"><i class="fa fa-star checked" aria-hidden="true"></i></span>`;
    }
    for (i = rating + 1; i <= 5; i++) {
        rate += `<span class="each-star"><i class="fa fa-star" aria-hidden="true"></i></span>`;
    }
    return rate;
}

//-----------------------------------Discount calculating function-------------------------
function getDiscount(product_price_data) {
    let listed_price = parseFloat(product_price_data["listed-price"]);
    let sale_price = parseFloat(product_price_data["sale-price"]);
    let discount;
    discount = ((sale_price - listed_price) / sale_price) * 100;
    fixed_discount = discount.toFixed(0);
    return fixed_discount;
}

//---------------------------------price range filter---------------------------------------
const rangeInput = document.querySelectorAll(".range-input input"),
    priceInput = document.querySelectorAll(".price-input input"),
    range = document.querySelector(".slider .progress");
let priceGap = 1000;
priceInput.forEach(input => {
    input.addEventListener("input", e => {
        let minPrice = parseInt(priceInput[0].value),
            maxPrice = parseInt(priceInput[1].value);

        if ((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max) {
            if (e.target.className === "input-min") {
                rangeInput[0].value = minPrice;
                range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
            } else {
                rangeInput[1].value = maxPrice;
                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
            }
        }
    });
});

rangeInput.forEach(input => {
    input.addEventListener("input", e => {
        let minVal = parseInt(rangeInput[0].value),
            maxVal = parseInt(rangeInput[1].value);

        if ((maxVal - minVal) < priceGap) {
            if (e.target.className === "range-min") {
                rangeInput[0].value = maxVal - priceGap
            } else {
                rangeInput[1].value = minVal + priceGap;
            }
        } else {
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            range.style.left = ((minVal / rangeInput[0].max) * 100) + "%";
            range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        }
    });
});

// -------------------------------------add to cart function-----------------------------
const cart = document.getElementById('cart');
const mobileCart = document.getElementById('mobile-cart')
let increment = 0;
function addtocart() {
    increment += 1;
    cart.style.backgroundColor="#FF3465";
    mobileCart.style.backgroundColor="#FF3465";
    cart.innerHTML = increment;
    mobileCart.innerHTML = increment;
}

//----------------------------------------Sort By Price funtion-----------------------------------
function PriceSortOrder(nestedObj, property) {
    return function (a, b) {
        console.log(a, b)
        a1 = parseInt(a[nestedObj][property]);
        b1 = parseInt(b[nestedObj][property]);
        if (a1 < b1) {
            return -1;
        } else if (a1 > b1) {
            return 1;
        } else {
            return 0;
        }
    }
}

//-----------------------------------------Sort By New function-------------------------------
function NewSortOrder(property) {
    return function (a, b) {
        if (a[property] != '' && b[property] != '') {
            if (a[property] > b[property]) {
                return 1;
            } else if (a[property] < b[property]) {
                return -1;
            }
            return 0;
        }
    }
}


//------------------------------------------ Wishlist Function--------------------------------------
function wishlist(a) {
    
    for (const className in a.classList) {
        const element = a.classList[className];
        if (element === "fa-regular") {
            a.classList.remove("fa-regular");
            a.classList.add("fa-solid");
            a.classList.add("heart");
            c=c+1;
        } else if (element === "fa-solid") {
            a.classList.add("fa-regular");
            a.classList.remove("fa-solid");
            a.classList.remove("heart");
            c=c-1;
        }
    }
    if(c!=0)
    {
        document.getElementById("wishlist").style.display="initial";
        document.getElementById("wishlist").innerHTML=c;
        document.getElementById("mobile-wishlist").style.display="initial";
        document.getElementById("mobile-wishlist").innerHTML=c;
        // document.getElementById("wishlist").style.backgroundColor="FF3465";
    }
    else{
        document.getElementById("wishlist").style.display="none";
        document.getElementById("mobile-wishlist").style.display="none";
    }
}




