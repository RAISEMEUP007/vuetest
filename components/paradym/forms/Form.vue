<template>
<v-sheet class="form pa-4" rounded :class="{ 'form-outlined': outlined, 'elevation-2': elevated }" :style="{ 'width': computedWidth }">
    <v-form ref="form" v-model="valid" :disabled="disabled" @submit.prevent="formAction">
        <!-- Busy Indicator -->
        <v-progress-linear v-if="busy && outlined" indeterminate class="mb-4" :style="outlined ? 'margin: -24px -20px -18px -20px; width: calc(100% + 40px);' : ''" />

        <!-- Slot: Header -->
        <slot name="header">
            <div :class="{'mb-8': logo && !title, 'mb-4': title}">
                <!-- Logo -->
                <v-img v-if="logo" :src="logo" max-width="128" class="mx-auto" :class="{'mb-4': title}" />
                <!-- Title -->
                <h1 v-if="title" class="text-h5 font-weight-bold mb-6" v-text="title" />
            </div>
        </slot>

        <!-- Slot: Default -->
        <slot></slot>

        <!-- Error -->
        <v-alert v-if="error" type="error" dense text dismissible>
            {{ error }}
        </v-alert>

        <!-- Slot: BeforeSubmit -->
        <slot name="beforeSubmit"></slot>

        <!-- Slot: Submit Button -->
        <slot name="submit">
            <div class="d-flex justify-end" style="max-width: 100%;">
                <v-btn v-if="hasCancelListener" class="flex-grow-1 mr-2 mb-2" large depressed :disabled="disabled || busy" @click="$emit('cancel')">Cancel</v-btn>
                <v-btn class="flex-grow-1 mb-2" :class="{'ml-2': hasCancelListener }" large depressed type="submit" color="primary" :disabled="disabled || busy" :loading="busy && !outlined">{{ buttonText }}</v-btn>
            </div>
        </slot>

        <!-- Slot: Footer -->
        <slot name="footer"></slot>

    </v-form>
</v-sheet>
</template>

<script>
export default {
    name: 'Form',
    props: {
        disabled: Boolean,
        busy: Boolean,
        title: String,
        logo: String,
        outlined: Boolean,
        elevated: Boolean,
        width: [Number, String],
        buttonText: {
            type: String,
            default: 'Submit',
        },
        error: String,
    },
    mounted() {
        this.loaded = true
        console.log("IN MOUNTED");
    },
    data() {
        return {
            loaded: false,
            valid: false,
            rules: {
                required: value => !!value || 'Required.',
                email: value => {
                    if (value == '' || value == null) return true
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Invalid e-mail.'
                },
            },
        }
    },
    computed: {
        computedWidth() {
            if (this.loaded && this.$vuetify.breakpoint.xsOnly)
                return '100%'
            else if (!isNaN(this.width))
                return this.width + 'px'
            else
                return this.width
        },
        hasCancelListener() {
            return !!(this.$listeners && this.$listeners.cancel)
        },
    },
    methods: {
        async formAction() {
            await this.$refs.form.validate()
            if (this.valid) {
                this.$emit('submit')
            }
        },
    }
}
</script>

<style lang="scss">
.form {
    max-width: 100%;
    min-width: 200px;

    .v-alert {
        font-size: 15px;
    }
}

.form-outlined {
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    padding: 24px 24px 18px 24px;
}

.theme--dark .form-outlined {
    border-color: rgba(255, 255, 255, 0.1);
}

.theme--light .form-outlined {
    border-color: rgb(218, 220, 224);
}
</style>
