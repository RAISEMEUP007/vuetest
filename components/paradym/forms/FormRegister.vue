<template>
  <Form class="form-register" :outlined="outlined" :title="title" :width="width"
    :logo="logo" :busy="busy" :error="error" :disabled="disabled" :elevated="elevated"
    :buttonText="buttonText" @submit="onSubmit">

    <!-- Slot: Default -->
    <slot></slot>

    <!-- Slot: BeforeSubmit -->
    <template v-slot:beforeSubmit>
      <slot name="beforeSubmit"></slot>
    </template>

    <!-- Email -->
    <v-text-field v-model="email" label="Email address" autocomplete="off"
      class="mb-4" color="primary" validate-on-blur
      outlined dense hide-details="auto" :prepend-inner-icon="icons ? 'mdi-email' : ''"
      :rules="[rules.required, rules.email]" />

    <!-- Password -->
    <v-text-field ref="pw" v-model="password" label="Password" autocomplete="off"
      class="mb-4" color="primary" validate-on-blur
      outlined dense hide-details="auto" :prepend-inner-icon="icons ? 'mdi-lock' : ''"
      :type="showPassword ? 'text' : 'password'"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="confirm ? [rules.required, rules.passwordsMatch] : [rules.required]"
      @click:append="showPassword = !showPassword"
      @blur="confirm ? $refs.pw2.validate() : ''" />

    <!-- Confirm Password -->
    <v-text-field ref="pw2" v-if="confirm" v-model="passwordConfirm" label="Confirm Password" autocomplete="off"
      class="mb-4" color="primary" validate-on-blur
      outlined dense hide-details="auto" :prepend-inner-icon="icons ? 'mdi-lock' : ''"
      :type="showPasswordConfirm ? 'text' : 'password'"
      :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
      :rules="[rules.required, rules.passwordsMatch]"
      @click:append="showPasswordConfirm = !showPasswordConfirm"
      @blur="$refs.pw.validate()" />

    <!-- Name -->
    <v-text-field v-model="name" label="Name" class="mb-4" color="primary"
      outlined dense hide-details="auto" :prepend-inner-icon="icons ? 'mdi-account' : ''" />

    <!-- Footer -->
    <template v-slot:footer>
      <div class="text-center" v-if="loginURL">
        <p class="text--secondary mb-0">Already registered?</p>
        <v-btn text type="submit" color="primary" :to="loginURL">Sign In</v-btn>
      </div>
      <slot name="footer"></slot>
    </template>

  </Form>
</template>

<script>
export default {
  name: 'formRegister',
  props: {
    loginURL: String,
    icons: Boolean,
    confirm: Boolean,
    // Base Form
    disabled: Boolean,
    busy: Boolean,
    title: String,
    logo: String,
    outlined: Boolean,
    elevated: Boolean,
    width: [Number, String],
    buttonText: {
      type: String,
      default: 'Sign Up',
    },
    error: String,
  },
  data() {
    return {
      // Form fields
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
      // Options
      showPassword: false,
      showPasswordConfirm: false,
      // Rules
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          if (value == '' || value == null) return true
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        passwordsMatch: value => (this.password == this.passwordConfirm) || 'Password doesn\'t match',
      },
    }
  },
  methods: {
    onSubmit() {
      this.$emit('submit', { email: this.email, password: this.password, name: this.name })
    }
  }
}
</script>
