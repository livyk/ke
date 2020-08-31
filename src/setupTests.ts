/* eslint max-classes-per-file: 0 */

import { configure } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import axios from 'axios'

import { BaseWizard, BaseWizardStep } from './WizardMaster/interfaces'
import { ChakraUINotifier } from './common/notifier'
import { TextWidget } from './DetailView/widgets/TextWidget'
import { BaseAdmin } from './admin/index'
import { BaseProvider } from './admin/providers/index'

configure({ adapter: new Adapter() })

const testNotifier = new ChakraUINotifier(jest.fn())

class TestAdmin extends BaseAdmin {
  baseUrl = 'https://test.com/test'

  permissions = undefined

  verboseName = 'Test verbose name'

  list_filters = []

  list_filter_templates = []

  list_fields = [
    {
      Header: 'Id',
      accessor: 'id',
    },
  ]

  detail_fields = [
    {
      name: 'patient.last_name',
      helpText: 'Test help text',
      widget: TextWidget,
      layout: { x: 1, y: 3, w: 1, h: 2, static: true },
    },
  ]

  wizards = []
}

const testAdmin = new TestAdmin()

const mockedHTTP = axios.create({})
mockedHTTP.defaults = { baseURL: 'https://test.com/' }

class TestProvider extends BaseProvider {
  constructor() {
    super(mockedHTTP)
  }
}

const testProvider = new TestProvider()

class TestWizardStep extends BaseWizardStep {
  widgets = testAdmin.detail_fields
}

const testWizardStep = new TestWizardStep('test_wizard_step')

class TestWizard extends BaseWizard {
  stateWidgetMapping = {
    begin: testWizardStep,
  }

  machine = {
    begin: {
      forward: 'test',
    },
  }
}

const testWizard = new TestWizard('Test Wizard')

const dataMockResponse = [{ id: '100500', test: 'key' }]

const mockPagination = {
  page: 100500,
  perPage: 100500,
  count: 100500,
  nextUrl: '',
  prevUrl: '',
}

export { testAdmin, testProvider, testNotifier, testWizard, testWizardStep, dataMockResponse, mockPagination }
