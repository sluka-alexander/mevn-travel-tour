<template>
  <div>
    <div class="container">
      <div class="title-item">
        <transition name="animate" appear enter-active-class="animated fadeInRight fast">
        <div>
          {{ $t('titleRoute.newTour') }}
        </div>
        </transition>
        <transition name="animate" appear enter-active-class="animated zoomInDown fast">
        <div class="icon icon_new"></div>
        </transition>
      </div>
      <transition name="animate" appear enter-active-class="animated zoomIn faster">
        <form @submit.prevent="addTour" class="form"
              :class="{'form_dark-theme' : this.$store.state.isDarkTheme}">
          <div class="form__item"
               :class="{'form__item_err' : $v.tour.name.$error}">
            <label for="name">{{ $t('form.titleInput.name') }}</label>
            <transition name="animate" appear enter-active-class="animated flash delay-1s">
              <input
                type="text"
                id="name"
                v-model.trim="tour.name"
                :placeholder="$t('form.placeholder')"
                @blur="$v.tour.name.$touch()"
                :class="{'animated shake': $v.tour.name.$error}">
            </transition>
            <div class="error" v-if="!$v.tour.name.required">
              {{ $t('validates.field') }}
            </div>
            <div class="error" v-if="!$v.tour.name.minLength">
              {{ $t('validates.min') }}
              {{$v.tour.name.$params.minLength.min}}
            </div>
            <div class="error" v-if="!$v.tour.name.maxLength">
              {{ $t('validates.max') }}
              {{$v.tour.name.$params.maxLength.max}}
            </div>
          </div>
          <div class="form__item">
            <label for="category">{{ $t('form.titleInput.category') }}</label>
            <select type="text"
                    id="category"
                    v-model.trim="tour.category"
                    @blur="$v.tour.category.$touch()"
                    >
              <option>{{ $t('category.nature') }}</option>
              <option>{{ $t('category.snow') }}</option>
              <option>{{ $t('category.waterfall') }}</option>
              <option>{{ $t('category.mountain') }}</option>
            </select>
          </div>
          <div class="form__item"
               :class="{'form__item_err' : $v.tour.desc.$error}">
            <label for="desc">{{ $t('form.titleInput.desc') }}</label>
            <input
              id="desc"
              v-model.trim="tour.desc"
              :placeholder="$t('form.placeholder')"
              @blur="$v.tour.desc.$touch()"
              :class="{'animated shake': $v.tour.desc.$error}">
            <div class="error" v-if="!$v.tour.desc.required">
              {{ $t('validates.field') }}
            </div>
            <div class="error" v-if="!$v.tour.desc.minLength">
              {{ $t('validates.max') }}
              {{$v.tour.desc.$params.minLength.min}}
            </div>
            <div class="error" v-if="!$v.tour.desc.maxLength">
              {{ $t('validates.max') }}
              {{$v.tour.desc.$params.maxLength.max}}
            </div>
          </div>
          <div class="form__item"
               :class="{'form__item_err' : $v.tour.price.$error}">
            <label for="price">{{ $t('form.titleInput.price') }}</label>
            <input
              type="number"
              id="price"
              v-model.trim="tour.price"
              :placeholder="$t('form.placeholder')"
              @blur="$v.tour.price.$touch()"
              :class="{'animated shake': $v.tour.price.$error}">
            <div class="error" v-if="!$v.tour.price.required">
              {{ $t('validates.field') }}
            </div>
            <div class="error" v-if="!$v.tour.price.maxLength">
              {{ $t('validates.max') }}
              {{$v.tour.price.$params.maxLength.max}}
            </div>
          </div>
          <div v-if="$v.$invalid" class="button button_no-active">
            {{ $t('btn.addTour') }}
          </div>
          <button v-else type="submit" class="button">
            {{ $t('btn.addTour') }}
          </button>
        </form>
      </transition>
    </div>
  </div>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators';

export default {
  name: 'NewTour',
  data() {
    return {
      tour: {
        name: null,
        category: 'Nature',
        desc: null,
        price: null,
      },
    };
  },
  validations: {
    tour: {
      name: { required, minLength: minLength(3), maxLength: maxLength(16) },
      category: { required },
      desc: { required, minLength: minLength(10), maxLength: maxLength(30) },
      price: { required, maxLength: maxLength(5) },
    },
  },
  methods: {
    addTour() {
      const data = {
        name: this.tour.name,
        category: this.tour.category,
        desc: this.tour.desc,
        price: this.tour.price,
      };
      this.$store.dispatch('newTour', data).then(() => {
        this.$router.push({ name: 'Tours' });
      }).catch(error => {
        console.error(error);
      });
    },
  },
};
</script>
