import { mount } from '@vue/test-utils'
import SequraWidgetModal from '../SequraWidgetModal.vue'


describe('SequraWidgetModal', () => {

  test('mount component', () => {
    expect(SequraWidgetModal).toBeTruthy()

    const wrapper = mount(SequraWidgetModal, {
      props: {
        creditAgreement: {
          "instalment_count": 3,
          "instalment_amount": { "string": "133,33 €" },
          "instalment_fee": { "string": "5 €" },
          "instalment_total": { "string": "138,33 €" },
        },
        isOpen: true,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})