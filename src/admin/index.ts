import type { BaseProvider } from './providers'
import type { FieldDescription } from './fields/FieldDescription'

export abstract class BaseAdmin {
  provider!: BaseProvider

  fields!: FieldDescription[]
}