<template>
<div class="tabbed-ui">
    <v-tabs v-model="currentTab" height="48" show-arrows class="flex-grow">
        <v-tab v-for="(tab, index) in tabsCopy" :key="`t-${index}`" class="pr-1">
            <div class="tab-line" :style="'background-color: ' +  tab.colorcode"></div>
            <div class="tab-content d-flex flex-column" style="width: 100%">
                <span class="tab-title">
                    WO#{{ tab.WorkOrderNumber }}
                    <v-icon :color="woIsActive(tab) ? 'success' : 'error'" small style="margin: -2px 0 0 -1px;">{{ woIsActive(tab) ? 'mdi-play' : 'mdi-pause' }}</v-icon>
                </span>
                <span class="tab-subtitle">{{ tab.Tenant }}</span>
            </div>
            <v-btn x-small icon class="ml-1" @click.prevent="closeTab(index, $event)">
                <v-icon x-small>mdi-close</v-icon>
            </v-btn>
        </v-tab>
    </v-tabs>
    <v-tabs-items v-model="currentTab" style="height: 100%">
        <v-tab-item v-for="(tab, index) in tabsCopy" :key="`ti-${index}`" style="height: 100%" transition="fade">
            <v-row no-gutters style="height: 100%">
                <v-col cols="12" md="7" lg="8" xl="9">
                    <div class="mt-4">
                        <FormWorkOrder title="test" :wo="tab" width="900" class="mx-auto pb-2" :busy="busy" @ready="$emit('woReady', tab)" @submit="$emit('woSubmit', $event)" @start="$emit('woStart', tab)" @pause="$emit('woPause', tab)" @complete="$emit('woComplete', tab)" />
                        <div class="text-center">
                            <p v-if="tab.CustomerApprovalSignaturePicture.data.length" class="text-caption font-weight-bold">
                                <v-icon color="success">mdi-check</v-icon> Customer Signature on record.
                                <br>
                                <v-btn text x-small @click="$emit('woClearSignature', tab)">
                                    <v-icon x-small color="error" class="mr-1">mdi-cancel</v-icon> Clear Signature
                                </v-btn>
                            </p>
                            <v-btn depressed @click="$emit('woIncomplete', tab)">Unable to complete</v-btn>
                        </div>

                    </div>
                </v-col>
                <v-col cols="12" md="5" lg="4" xl="3" class="pt-4">
                    <TimeEntries :entries="tab.TimeEntries" @delete="$emit('teDelete', $event)" @edit="$emit('teEdit', $event)" />
                </v-col>
            </v-row>
        </v-tab-item>
    </v-tabs-items>
    <ModalConfirm v-if="tabsCopy[tabToClose]" v-model="confirmDialog" @confirm="onConfirmRemove(tabsCopy[tabToClose])" :title="`Close WO#${tabsCopy[tabToClose].WorkOrderNumber}`" :message="`Are you sure you want to remove <strong>WO#${tabsCopy[tabToClose].WorkOrderNumber}</strong> from your queue?`" confirmText="Yes" cancelText="No" maxWidth="320" />
</div>
</template>

<script>
import ModalConfirm from "../paradym/modals/ModalConfirm";
import TimeEntries from "../pmc/TimeEntries";
import FormWorkOrder from "../pmc/FormWorkOrder";
export default {
    name: 'TabbedUI',
    components: {
        ModalConfirm,
        TimeEntries,
        FormWorkOrder
    },
    props: {
        tabs: Array,
        busy: Boolean,
    },
    data() {
        return {
            tabsCopy: this.tabs,
            currentTab: 0,
            confirmDialog: false,
            tabToClose: 0,
            entries: [{
                user: 'Test',
                date: '1/4/2022',
                time: '2 hrs',
            }]
        }
    },
    watch: {
        tabs(newValue) {
            this.tabsCopy = JSON.parse(JSON.stringify(newValue))
        }
    },
    methods: {
        onConfirmRemove(wo) {
            this.confirmDialog = false
            this.$emit('woRemove', wo)

        },
        closeTab(index, e) {
            this.tabToClose = index
            this.confirmDialog = true
            e.stopPropagation()
        },
        addTab() {
            this.tabs.push({
                name: 'newTab'
            })
            this.currentTab = this.tabs.length - 1
        },
        woIsActive(wo) {
            return wo.JobStatus == 'Active'
        },
        selectWOByID(id) {
            let foundTab = this.tabs.findIndex(tab => tab.WOID == id)
            if (foundTab >= 0)
                this.currentTab = foundTab
        },
    }
}
</script>

<style lang="scss">
.tabbed-ui {
    flex-grow: 1;
    height: 100%;
    padding-top: 4px;
    display: flex;
    flex-direction: column;

    .v-tabs {
        flex-grow: 0;
    }

    .v-tabs-items {
        flex-grow: 1;
    }

    .v-tab {
        align-items: flex-start;
        padding-top: 6px;
        max-width: 200px;
        flex-grow: 1;
        overflow-x: hidden;
        text-align: left;

        span {
            white-space: nowrap;
        }

        div {
            overflow: hidden;
        }

        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        margin-left: 2px;
        margin-right: 2px;
        box-shadow: 0px -1px 2px rgba(0, 0, 0, 0.15);
        margin-top: 4px;
        border-bottom: unset;
        text-align: left;
        letter-spacing: 0;
        min-width: unset !important;
    }

    .tab-subtitle {
        font-weight: normal;
        font-size: 11px;
        text-transform: none;
    }
}

.theme--dark .tabbed-ui {
    .v-tabs-slider {
        background-color: #1E1E1E;
    }

    &,
    .v-tabs-bar {
        background-color: #404040;
    }

    .v-tab {
        background-color: #2E2E2E;
    }

    .v-tab--active {
        background-color: #1E1E1E;
        color: white;
    }
}

.theme--light .tabbed-ui {
    .v-tabs-slider {
        background-color: white;
    }

    &,
    .v-tabs-bar {
        background-color: #bababa;
    }

    .v-tab {
        background-color: #ededed;
    }

    .v-tab--active {
        background-color: white;
    }
}

.tab-line {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
}

.tab-content {
    padding-top: 3px;
}
</style>
