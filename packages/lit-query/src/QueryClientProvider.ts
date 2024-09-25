import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { provide } from '@lit/context'
import { QueryClient } from '@tanstack/query-core'
import { QueryContext } from './context.js'

/**
 * Definition for the properties provided by the query client mixin class.
 */
export interface QueryContextProps {
  /**
   * Tanstack Query Client
   */
  queryClient: QueryClient
}

/**
 * Generic constructor definition
 */
export type Constructor<T = object> = new (...args: Array<any>) => T

/**
 * Query Client Context as mixin class.
 * Extend this mixin class to make any LitElement class a context provider.
 *
 * @param Base - The base class to extend. Must be or inherit LitElement.
 * @returns Class extended with query client context provider property.
 */
export const QueryClientMixin = <T extends Constructor<LitElement>>(
  Base: T,
) => {
  class QueryClientContextProvider extends Base implements QueryContextProps {
    /**
     * The query client provided as a context.
     * May be overridden to set a custom configuration.
     */
    @provide({ context: QueryContext })
    @state()
    queryClient = new QueryClient()

    connectedCallback(): void {
      super.connectedCallback()
      this.queryClient.mount()
    }

    disconnectedCallback(): void {
      super.disconnectedCallback()
      this.queryClient.unmount()
    }
  }

  // Cast return type to the mixin's interface intersected with the Base type
  return QueryClientContextProvider as Constructor<QueryContextProps> & T
}

/**
 * Query client context provided as a Custom Component.
 * Place any components that should use the query client context as children.
 */
@customElement('query-client-provider')
export class QueryClientProvider extends QueryClientMixin(LitElement) {
  render() {
    return html`<slot></slot>`
  }
}