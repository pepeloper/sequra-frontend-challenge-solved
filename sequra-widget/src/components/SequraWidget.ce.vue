<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import SequraApi from '../services/SequraApi'
import SequraWidgetModal from './SequraWidgetModal.vue';

const props = defineProps({
  totalWithTax: Number,
})

const sequraApi = new SequraApi()

const selectedCreditAgreement = ref(null)
const creditAgreements = ref([])
const modalIsOpened = ref(false)
const widgetError = ref(false)

const creditAgreement = computed(() => creditAgreements.value.find(creditAgreement => creditAgreement.instalment_count === selectedCreditAgreement.value) || null)

const calculateCreditAgreement = async () => {
  try {
    const response = await sequraApi.creditAgreement(props.totalWithTax)
    creditAgreements.value = response
    selectedCreditAgreement.value = response[0].instalment_count
  } catch (error) {
    widgetError.value = true
  }
}

const openModal = () => modalIsOpened.value = true

if (!parseInt(props.totalWithTax)) {
  widgetError.value = true
  console.error(`Total with tax must be a Number. ${props.totalWithTax} given.`)
} else {
  calculateCreditAgreement()
  sequraApi.event('simulatorInstalmentTotalInitialized', { totalWithTax: props.totalWithTax })
}

watch(() => props.totalWithTax, () => {
  if (!parseInt(props.totalWithTax)) {
    console.error(`Total with tax must be a Number. ${props.totalWithTax} given.`)
    widgetError.value = true
    return
  }

  calculateCreditAgreement()
  sequraApi.event('simulatorInstalmentTotalChanged', { totalWithTax: props.totalWithTax })
})
</script>
<template>
  <div v-if="!widgetError" class="sequra__widget">
    <div class="sequra__widget__heading">
      <p>Págalo en</p>
      <button class="sequra__widget__modal__button" type="button" @click="openModal">más info</button>
    </div>
    <div class="sequra__widget__content">
      <select name="credit-agreement" id="sequra__credit__agreement__selector" v-model="selectedCreditAgreement">
        <option :value="creditAgreement.instalment_count" v-for="creditAgreement in creditAgreements">
          {{ creditAgreement.instalment_count }} cuotas de {{ creditAgreement.instalment_total.string }} /mes
        </option>
      </select>
    </div>
    <SequraWidgetModal :is-open="modalIsOpened" :credit-agreement="creditAgreement" @close="modalIsOpened = false"/>
  </div>
</template>
<style>
.sequra__widget {
  width: 100%;
  border: 1px solid rgb(150, 150, 150);
  margin-top: 1rem;
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
}

.sequra__widget .sequra__widget__heading {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sequra__widget .sequra__widget__heading > p {
  margin: 0;
}

.sequra__widget .sequra__widget__heading > button {
  appearance: none;
  border: 0;
  background: transparent;
  text-decoration: underline;
}

.sequra__widget .sequra__widget__content {
  width: 100%;
  margin-top: 1rem;
}

.sequra__widget .sequra__widget__content > select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(150, 150, 150);
}

.sequra__widget__modal__overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000da;
  z-index: 10;
}

.sequra__widget__modal {
  text-align: center;
  background-color: white;
  width: 400px;
  padding: 1.5rem 2rem;
  border-radius: 20px;
  z-index: 20;
}

.sequra__widget__modal .sequra__widget__modal__body {
  text-align: left;
}

.sequra__widget__modal .sequra__widget__modal__header {
  font-size: 1.25rem;
}
</style>