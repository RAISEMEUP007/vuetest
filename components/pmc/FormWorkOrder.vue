<template>
<Form class="form-work-order" width="100%" :busy="busy" :error="error" :disabled="disabled" buttonText="Save" @submit="onSubmit">
    <template v-slot:header>
        <div class="mb-4">
            <div class="d-flex justify-space-between">
                
                <h1 class="text-h5 font-weight-bold mb-0 text-uppercase">
                    WO#{{ workOrder.WorkOrderNumber.toString() }} -
                    <span :class="{'success--text': isActive, 'error--text': !isActive }">
                        {{ isActive ? 'Active' : 'Paused' }}
                    </span>
                </h1>
                <div>
                    <span v-if="isActive" class="text-caption mt-1">Running for <span class="success--text">{{ timeRunning }}</span></span>
                    <v-tooltip left :color="isActive ? 'error' : 'success'">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn :disabled="busy" :color="isActive ? 'error' : 'success'" icon class="ml-1" v-bind="attrs" v-on="on" @click="isActive ? $emit('pause') : $emit('start')">
                                <v-icon large>{{ isActive ? 'mdi-pause' : 'mdi-play' }}</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ isActive ? 'Pause Work Order' : 'Start Work Order' }}</span>
                    </v-tooltip>
                </div>
            </div>
            <p class="mb-8">
                {{ workOrder.DescriptionofWorkProblem }}
            </p>
        </div>
    </template>
    <!-- Pause/Start Button(s) -->
    <!-- Title -->
    <!-- Description -->
    <v-row>
        <v-col cols="12" md="4">
            <!-- Date -->
            <DateInput :value="woDate" label="Date" disabled textType />
        </v-col>
        <v-col cols="12" md="4">
            <!-- Time -->
            <TimeInput :value="workOrder.WOTime" label="Time" disabled />
        </v-col>
        <v-col cols="12" md="4">
            <!-- Contact Person -->
            <v-text-field :value="workOrder.ContactPerson" label="Contact Person" class="mb-4" color="primary" outlined dense hide-details="auto" :rules="[rules.max100]" disabled validate-on-blur />
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12" md="4">
            <!-- Tenant -->
            <v-text-field :value="workOrder.Tenant" label="Tenant" class="mb-4" color="primary" outlined dense hide-details="auto" :rules="[rules.max50]" disabled validate-on-blur />
        </v-col>
        <v-col cols="12" md="4">
            <!-- Building -->
            <v-text-field v-model="workOrder.Building" label="Building" class="mb-4" color="primary" outlined dense hide-details="auto" :rules="[rules.max50]" disabled validate-on-blur />
        </v-col>
        <v-col cols="12" md="4">
            <!-- PO# For Parts -->
            <v-text-field v-model="workOrder.poforparts" label="PO# For Parts" class="mb-4" color="primary" outlined dense hide-details="auto" :rules="[rules.max50]" validate-on-blur />
        </v-col>
    </v-row>

    <v-row>
        <v-col cols="12" md="6">
            <!-- Work Performed -->
            <v-textarea v-model="workOrder.Comments" label="Work Order Comments" class="mb-4" color="primary" outlined dense hide-details="auto" :rules="[rules.max500]" no-resize validate-on-blur />
        </v-col>
        <v-col cols="12" md="6">
            <!-- Materials Used -->
            <v-textarea v-model="workOrder.MaterialsUsed" label="Materials Used" class="mb-4" color="primary" outlined dense hide-details="auto" :rules="[rules.max500]" no-resize validate-on-blur />
        </v-col>
    </v-row> 

    <template v-slot:footer>
        <v-btn v-if="signed" block large depressed class="mb-2" color="success" :disabled="busy" @click="$emit('complete')">
            Complete Work Order
        </v-btn>
        <v-btn v-else block large depressed class="mb-2" color="secondary" :disabled="disabled || busy" @click="$emit('ready')">Ready for Customer Signature</v-btn>
    </template>
</Form>
</template>

<script>
import moment from 'moment'
import TimeInput from "../paradym/TimeInput"
import DateInput from "../paradym/DateInput"
import Form from "../paradym/forms/Form.vue"
export default {
    name: 'FormWorkOrder',
    components: {
        TimeInput,
        DateInput,
        Form
    },
    props: {
        wo: {
            type: Object,
            default: () => {
                return this.newWorkOrder()
            }
        },
        // Base Form
        disabled: Boolean,
        busy: Boolean,
        title: String,
        width: [Number, String],
        error: String,
    },
    watch: {
        wo(newValue) {
            this.workOrder = JSON.parse(JSON.stringify(newValue))
            this.setWoDate()
        }
    },
    created() {
        this.setWoDate()
    },
    mounted() {
        setTimeout(() => {
            this.timeRunning = '0 minute(s)'
            this.timer = setInterval(this.updateTimeRunning, 1000)
        }, 1000)

    },
    beforeUnmount() {
        clearInterval(this.timer)
    },
    data() {
        return {
            workOrder: JSON.parse(JSON.stringify(this.wo)),
            woDate: null,
            timer: null,
            timeRunning: '0 minute(s)',
            rules: {
                required: value => !!value || 'Required.',
                max50: v => v == null || v.length <= 50 || 'Max 50 characters.',
                max100: v => v == null || v.length <= 100 || 'Max 100 characters.',
                max500: v => v == null || v.length <= 500 || 'Max 500 characters.',
            }
        }
    },
    computed: {
        isActive() {
            return this.workOrder.JobStatus == 'Active'
        },
        signed() {
            return this.workOrder.CustomerApprovalSignaturePicture.data.length
        },
    },
    methods: {
        setWoDate() {
            if (this.workOrder.WODate) {
                // Convert 'MM/DD/YYYY to 'YYYY-MM-DD'
                this.woDate = moment(this.workOrder.WODate).format('YYYY-MM-DD')
            }
        },
        newWorkOrder() {
            return {
                WODate: null,
                WOTime: null,
                ContactPerson: 'null',
                Tenant: null,
                Building: null,
                poforparts: null,
                Comments: null,
                MaterialsUsed: null,
            }
        },
        onSubmit() {
            let woToSubmit = JSON.parse(JSON.stringify(this.workOrder))
            // Convert 'YYYY-MM-DD' to 'MM/DD/YYYY
            woToSubmit.WODate = moment(this.woDate).format('MM/DD/YYYY')
            delete woToSubmit.ContactPerson
            delete woToSubmit.Tenant

            this.$emit('submit', woToSubmit)
        },
        timeSince(date) {
            let last = moment(date)
            let now = moment()
            let diffInHours = now.diff(last, 'hours')
            let diffInMinutes = now.diff(last, 'minutes')
            if (diffInHours)
                return `${diffInHours} hour(s) ${diffInMinutes} minute(s)`
            else
                return `${diffInMinutes} minute(s)`
        },
        updateTimeRunning() {
            this.timeRunning = this.timeSince(this.workOrder.lastActivated)
        }
    }
}
</script>
