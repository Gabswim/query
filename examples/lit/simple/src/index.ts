import { QueryClient } from '@tanstack/query-core'
import { LitElement, html, render } from 'lit'
import { QueryController, setQueryClient } from '@tanstack/lit-query'
import { customElement } from 'lit/decorators.js'

const queryClient = new QueryClient()
setQueryClient(queryClient)

export default function App() {
  return html` <example-app></example-app> `
}

@customElement('example-app')
export class ExampleAppElement extends LitElement {
  private todoQuery = new QueryController(this, () => ({
    queryKey: ['repoData'],
    queryFn: async () => {
      const response = await fetch(
        'https://api.github.com/repos/TanStack/query',
      )

      return await response.json()
    },
  }))

  render() {
    const { isPending, error, data, isFetching } = this.todoQuery.result

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return html`
      <div>
        <h1>${data.full_name}</h1>
        <p>${data.description}</p>
        <strong>👀 ${data.subscribers_count}</strong>${' '}
        <strong>✨ ${data.stargazers_count}</strong>${' '}
        <strong>🍴 ${data.forks_count}</strong>
        <div>${isFetching ? 'Updating...' : ''}</div>
      </div>
    `
  }
}

const rootElement = document.getElementById('root') as HTMLElement
render(App(), rootElement)
