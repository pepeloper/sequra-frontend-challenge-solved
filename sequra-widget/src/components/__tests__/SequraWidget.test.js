import { mount } from '@vue/test-utils'
import { beforeEach } from 'vitest'
import SequraWidget from '../SequraWidget.ce.vue'

global.fetch = vi.fn()

function createFetchResponse(data, httpStatus = 200) {
  return {
    status: httpStatus,
    json: () => new Promise((resolve) => resolve(data)),
  }
}

describe('SequraWidget', () => {

  beforeEach(() => {
    global.fetch.mockReset()
    fetch.mockResolvedValue(createFetchResponse([
      {
        "instalment_count": 3,
        "instalment_amount": { "string": "133,33 €" },
        "instalment_fee": { "string": "5 €" },
        "instalment_total": { "string": "138,33 €" },
      },
      {
        "instalment_count": 6,
        "instalment_amount": { "string": "66,66 €" },
        "instalment_fee": { "string": "5 €" },
        "instalment_total": { "string": "71,66 €" },
      },
    ]))
  })

  test('mount component', () => {
    expect(SequraWidget).toBeTruthy()

    const wrapper = mount(SequraWidget, {
      props: {
        totalWithTax: 40000,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(fetch.calls.length).toBe(2)
  })

  test('calculate the credit agreement on load', () => {
    const wrapper = mount(SequraWidget, {
      props: {
        totalWithTax: 40000,
      },
    })

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/credit_agreements?totalWithTax=40000')
  })

  test('send event on load', () => {
    const wrapper = mount(SequraWidget, {
      props: {
        totalWithTax: 55000,
      },
    })

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/events', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type: 'simulatorInstalmentTotalInitialized', totalWithTax: 55000, context: 'checkoutWidget' }),
    })
  })

  test('re-calculate credit agreement on prop change', async () => {
    const wrapper = mount(SequraWidget, {
      props: {
        totalWithTax: 55000,
      },
    })

    await wrapper.setProps({ totalWithTax: 20000 })

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/credit_agreements?totalWithTax=20000')
  })

  test('send event on prop change', async () => {
    const wrapper = mount(SequraWidget, {
      props: {
        totalWithTax: 55000,
      },
    })

    await wrapper.setProps({ totalWithTax: 20000 })

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/events', {
      method: 'post',
      body: JSON.stringify({ type: 'simulatorInstalmentTotalChanged', totalWithTax: 20000, context: 'checkoutWidget' }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
  })

  test('open modal set to true by clicking on more info', async () => {
    const wrapper = mount(SequraWidget, {
      props: {
        totalWithTax: 40000,
      },
    })

    const button = await wrapper.find('.sequra__widget__modal__button')
    button.trigger('click')

    expect(wrapper.vm.modalIsOpened).toBeTruthy()
  })

  test('it doesnt render or make api calls if total with tax is not set with a number', () => {
    expect(SequraWidget).toBeTruthy()

    const wrapper = mount(SequraWidget, {
      props: {
        totalWithTax: null,
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.vm.widgetError).toBeTruthy()
    expect(fetch.calls.length).toBe(0)
  })

  test('set error properly if totalWithTax is changed to not a number', async () => {
    const wrapper = mount(SequraWidget, {
      props: {
        totalWithTax: 40000,
      },
    })

    expect(wrapper.vm.widgetError).toBeFalsy()

    await wrapper.setProps({ totalWithTax: null })

    expect(wrapper.vm.widgetError).toBeTruthy()
  })
})