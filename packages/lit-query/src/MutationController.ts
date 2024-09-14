import { MutationObserver } from '@tanstack/query-core'
import { getQueryClient } from './queryClientHelper'
import type {
  DefaultError,
  MutationObserverOptions,
  MutationObserverResult,
} from '@tanstack/query-core'
import type { ReactiveController, ReactiveControllerHost } from 'lit'

export type { MutationObserverOptions }

// TODO: Proper JSDoc descriptions
/**
 * MutationController is a class that integrates a mutation-based data fetching system
 * into a Lit component as a ReactiveController.
 *
 * @template TData - ~~The data type returned by the mutation function.~~
 * @template TError - ~~The error type for mutation errors.~~
 * @template TVariables - ~~The data variables to be used in the component.~~
 * @template TContext - ~~The context returned by the mutation (may differ from TData).~~
 */
export class MutationController<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
> implements ReactiveController
{
  /**
   * The result of the mutation observer, containing data and error information.
   */
  result: MutationObserverResult<TData, TError, TVariables, TContext>

  /**
   * The internal mutation observer responsible for managing the mutation.
   */
  private mutationObserver: MutationObserver<
    TData,
    TError,
    TVariables,
    TContext
  >

  /**
   * Creates a new MutationController instance.
   *
   * @param host - The host component to which this controller is added.
   * @param options - A function that provides MutationObserverOptions for the mutation.
   * @link [MutationObserverOptions API Docs](). //TODO: Add the correct doc
   */
  constructor(
    private host: ReactiveControllerHost,
    private options: () => MutationObserverOptions<
      TData,
      TError,
      TVariables,
      TContext
    >,
  ) {
    this.host.addController(this)

    // Initialize the MutationObserver with default options.
    const mutationClient = getQueryClient()
    const defaultOption = this.getDefaultOptions()
    this.mutationObserver = new MutationObserver(mutationClient, defaultOption)

    // FIXME: does not exist
    // Get an optimistic result based on the default options.
    this.result = this.mutationObserver.getCurrentResult()
  }

  /**
   * Unsubscribe function to remove the observer when the component disconnects.
   */
  private unsubscribe() {
    // We set the unsubscribe function when hostConnected is invoked
  }

  /**
   * Invoked when the host component updates.
   * Updates the mutation observer options with default options.
   */
  hostUpdate() {
    const defaultOption = this.getDefaultOptions()
    this.mutationObserver.setOptions(defaultOption)
  }

  /**
   * Invoked when the host component is connected.
   * Subscribes to the mutation observer and updates the result.
   */
  hostConnected() {
    this.unsubscribe = this.mutationObserver.subscribe((result) => {
      this.result = result
      this.host.requestUpdate()
    })
  }

  /**
   * Invoked when the host component is disconnected.
   * Unsubscribes from the mutation observer to clean up.
   */
  hostDisconnected() {
    this.unsubscribe()
  }

  /**
   * Retrieves the default mutation options by combining the user-provided options
   * with the default options from the mutation client.
   *
   * @returns The default mutation options.
   */
  private getDefaultOptions() {
    const mutationClient = getQueryClient()
    const defaultOption = mutationClient.defaultMutationOptions(this.options())
    return defaultOption
  }
}
