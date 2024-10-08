// A way of sending data between components or grandchildren to grandparent.
// We emit data to it and listen using eventBus.$on to push that data to a data() array.
var eventBus = new Vue()

// Product Component (Child of Root), contains Product Tabs (Grandchild of Root), Product Tabs contains Product Reviews (either 'show reviews' or 'make review' (Great Grandchild of Root))
Vue.component('product',{
  props: {
    premium: {
      type: Boolean,
      required: true
    },
    cart: {
      type: Array,
      required: true
    } 
  },
  template: `
    <div class="product">
        
        <div class="product-image">
            <img :src="image" />
        </div>

        <div class="product-info">
            <p class="product-title">{{ title }}</p>
            <p v-if="inStock">In Stock</p>
            <!-- <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p> -->
            <p v-else>Out of Stock</p>
            <p>Shipping: {{ shipping }}</p>
                        
            <!-- for loop over items -->
            <ul> 
                <li v-for="detail in details">{{ detail }}</li>
            </ul>

            <div v-for="(variant, index) in variants" 
                :key="variant.variantId"
                class="color-box"
                :style="{ backgroundColor: variant.variantColor }"
                @mouseover="updateProduct(index)">
                <!-- @mouseover is the same as v-on:mouseover -->                 
            </div>        
            
            <!-- on click, fire this method -->
            <button @click="addToCart" 
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">
              Add to Cart
            </button>
            
            <button v-if="cartHasContents" @click="clearCart"
                    class="clear-cart-btn">
              Clear Cart
            </button>
        </div>

        <div class="tabs">
          <product-tabs :reviews="reviews"></product-tabs>
        </div>
    </div> 
  `,
  data() {
    return {
      product: 'Socks',
      brand: 'Vue Mastery',
      selectedVariant: 0,
      cartHasContents: false,
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: 'assets/vmSocks-green-onWhite.jpg',
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: 'assets/vmSocks-blue-onWhite.jpg',
          variantQuantity: 0
        }
      ],
      reviews: []      
    }
  }, 

  methods: { 
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
      this.cartHasContents = true
    },
    updateProduct(index) {
      this.selectedVariant = index
    },
    clearCart() {
      this.$emit('clear-cart', null)
      this.cartHasContents = false
    }
  },

  // runs everytime its dependencies changed.  Also they're cached.
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      if(this.premium){
        return "Free"
      } 
        return 2.99
    },
  },

  mounted() { //logic to run as soon as component is mounted to DOM
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview)
    })
  }
})

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
    
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
      
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
      </p>

      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

       <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      this.errors = [] //clear out errors array

      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name, 
          review: this.review,
          rating: this.rating
        }
        //send this review object to parent
        eventBus.$emit('review-submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
      } else {
        if (!this.name) this.errors.push("Name required.")
        if (!this.review) this.errors.push("Review required.")
        if (!this.rating) this.errors.push("Rating required.")
      }
      
    }
  }
})

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: true
    }
  },
  template: `
    <div class="reviews">
      <div class="tabs">
        <span class="tab"
              :class="{ activeTab: selectedTab === tab}"
              v-for="(tab, index) in tabs" 
              :key="index"
              @click="selectedTab = tab">
          {{ tab }}
        </span>
      </div>

       <div v-show="selectedTab === 'Reviews'">
          <p v-if="!reviews.length" style="text-align: center;">There are no reviews yet.</p>
          <ul v-else>
            <li v-for="review in reviews">
              <p>{{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p><i>'{{ review.review }}'</i></p>
            </li>
          </ul>
        </div>

    
          <product-review 
            v-show="selectedTab === 'Make a Review'">
          </product-review>
    
    </div>
  `,  
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  },
  mounted() { //logic to run as soon as component is mounted to DOM, also can use as a global catcher
    eventBus.$on('review-submitted', productReview => {
      this.selectedTab = 'Reviews'
    })
  }
})

//ROOT
var app = new Vue({
    el: '#app',
    data: {
      premium: true,
      cart: []
    },
    methods: {
      updateCart(id) {
        this.cart.push(id)
      },
      clearCart() {
        this.cart = []
      }
    }    
  })
  
  