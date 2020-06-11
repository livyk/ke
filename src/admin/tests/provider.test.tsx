import axios from 'axios'
import { BaseProvider, Filter } from '../providers/index'

const filterWithOperation = {
  filterName: 'id',
  value: 'test12345',
  filterOperation: 'equals',
}

const defaultFilter = {
  filterName: 'first_name',
  value: 'Test',
  filterOperation: undefined,
}

const mockedHTTP = axios.create({})
mockedHTTP.defaults = { baseURL: 'https://test.com/' }

class TestProvider extends BaseProvider {
  constructor() {
    super(mockedHTTP)
  }
}

const provider = new TestProvider()

test('Provider get filter query with filter operation', () => {
  const expectedResult = ['id__equals', 'test12345']

  const result = provider.getFilterQuery(filterWithOperation)

  expect(result).toEqual(expectedResult)
})

test('Provder get filter query without filter operation', () => {
  const expectedResult = ['first_name', 'Test']

  const result = provider.getFilterQuery(defaultFilter)

  expect(result).toEqual(expectedResult)
})

test.each([
  [[{ id: 'id', value: filterWithOperation }], 'https://test.com/test-url/?id__equals=test12345'],
  [[{ id: 'id', value: defaultFilter }], 'https://test.com/test-url/?first_name=Test'],
])('Provider get url', (tableFilterObject, expectedResult) => {
  const resourceUrl = 'https://test.com/test-url/'
  const resourceFilters: Filter[] = []
  const result = provider.getUrl(resourceUrl, resourceFilters, tableFilterObject)

  expect(result).toBe(expectedResult)
})