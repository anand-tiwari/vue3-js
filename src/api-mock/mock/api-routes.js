const routes = [
  {
    method: 'GET',
    url:
      '/backend/search/products?page=1&searchTerm=samsung&channelId=web&showFacet=false',
    response: {
      code: 200,
      status: 'OK',
      data: {
        products: [
          {
            id: 'MTA-0309242',
            sku: 'WAS-60006-00011',
            merchantCode: 'WAS-60006',
            status: 'AVAILABLE',
            name: 'Yuna Big Product'
          }
        ]
      }
    }
  }
]
export default routes
