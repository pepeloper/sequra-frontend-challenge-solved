export default class SequraApi {
  async creditAgreement(totalWithTax) {
    const url = `${import.meta.env.VITE_API_BASE_URL}/credit_agreements?totalWithTax=${encodeURIComponent(totalWithTax)}`

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async event(type, payload) {
    if (!type) {
      throw "Missing type"
    }

    const url = `${import.meta.env.VITE_API_BASE_URL}/events`
    try {
      const response = await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, ...payload, context: 'checkoutWidget' }),
      })

      if (response.status !== 200) {
        throw response.statusText
      }

      return true
    } catch (error) {
      console.error('EVENT API ERROR: [REPORT PROPERLY]', error)
    }
  }
}