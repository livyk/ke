import { BaseProvider } from 'admin/providers'

export class PatientProvider extends BaseProvider {
  url = '/patients/'

  writableFields = ['first_name', 'last_name', 'birth_date', 'age', 'user']

  readOnlyFields = []
}