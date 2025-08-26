import { createSignal, createEffect, onMount, For, Show, type Component } from 'solid-js'
import { Gueleton } from 'unplugin-gueleton/client/solid-js'

interface Game {
  id: number
  name: string
  genre?: string[]
  developers?: string[]
  publishers?: string[]
  releaseDates?: Record<string, string>
}

export const SolidjsPlayground: Component = () => {
  const [loading, setLoading] = createSignal(false)
  const [type, setType] = createSignal<'overlay' | 'inPlace'>('overlay')
  const [fuzzy, setFuzzy] = createSignal(1)
  const [fetchDelay, setFetchDelay] = createSignal(
    localStorage.getItem('fetchDelay') ? Number(localStorage.getItem('fetchDelay')) : 0
  )
  const [list, setList] = createSignal<Game[]>([])

  // Watch fetchDelay changes and save to localStorage
  createEffect(() => {
    localStorage.setItem('fetchDelay', String(fetchDelay()))
  })

  const handleRefresh = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://api.sampleapis.com/switch/games')
      const data = await response.json()
      setList(data.slice(0, 48))

      if (fetchDelay()) {
        await new Promise((resolve) => setTimeout(resolve, fetchDelay() * 1000))
      }
    } finally {
      setLoading(false)
    }
  }

  onMount(handleRefresh)

  return (
    <div class="h-screen flex flex-col gap-2 p-2">
      <div class="flex gap-2">
        <button 
          class="border border-slate-600 px-2 py-1 bg-slate-500 text-slate-100 cursor-pointer" 
          onClick={handleRefresh}
        >
          Refresh
        </button>

        <label class="border border-slate-600 px-2 py-1 flex items-center gap-1">
          Loading
          <input 
            type="checkbox" 
            checked={loading()} 
            onChange={(e) => setLoading(e.currentTarget.checked)}
          />
        </label>

        <label class="border border-slate-600 px-2 py-1 flex items-center gap-1">
          Fuzzy
          <input 
            type="range" 
            min="0" 
            max="10" 
            value={fuzzy()} 
            onInput={(e) => setFuzzy(Number(e.currentTarget.value))}
          />
          <span>({fuzzy()})</span>
        </label>

        <span class="flex-auto" />

        <label class="border border-slate-600 px-2 py-1 flex items-center gap-1">
          Type
          <select 
            value={type()} 
            onChange={(e) => setType(e.currentTarget.value as 'overlay' | 'inPlace')}
          >
            <option value="overlay">Overlay</option>
            <option value="inPlace">In-place</option>
          </select>
        </label>
      </div>

      <div class="flex gap-2">
        <label class="border border-slate-600 px-2 py-1 flex items-center gap-1">
          Fetch Delay
          <input 
            type="range" 
            min="0" 
            max="12" 
            value={fetchDelay()} 
            onInput={(e) => setFetchDelay(Number(e.currentTarget.value))}
          />
          <span>({fetchDelay()}s)</span>
        </label>
      </div>

      <Gueleton 
        dataKey="switchGameList" 
        data={list()} 
        loading={loading()} 
        type={type()} 
        fuzzy={fuzzy()}
      >
        {({ data }) => (
          <div class="flex-auto overflow-x-auto border">
            <For each={list()}>
          {(item) => (
            <div class="p-4 border-b border-slate-200 hover:bg-slate-50 transition-all duration-200 hover:shadow-sm">
              <div class="flex items-start gap-4">
                {/* Game Icon/Avatar */}
                <div class="size-16 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex-shrink-0 shadow-sm" data-gueleton-bone />
                
                {/* Main Content */}
                <div class="flex-1 min-w-0">
                  {/* Game Title */}
                  <h1 class="text-xl font-bold text-slate-800 mb-2 line-clamp-2" data-gueleton-bone>
                    {item.name}
                  </h1>
                  
                  {/* Genre Tags */}
                  <Show when={item.genre?.length}>
                    <div class="flex flex-wrap gap-1 mb-3">
                      <For each={item.genre}>
                        {(g) => (
                          <span 
                            class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium" 
                            data-gueleton-bone
                          >
                            {g}
                          </span>
                        )}
                      </For>
                    </div>
                  </Show>
                  
                  {/* Developer & Publisher Info */}
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-sm">
                    <Show when={item.developers?.length}>
                      <div>
                        <span class="text-slate-500 font-medium">开发商:</span>
                        <span class="text-slate-700 ml-1" data-gueleton-bone>
                          {item.developers!.join(', ')}
                        </span>
                      </div>
                    </Show>
                    <Show when={item.publishers?.length}>
                      <div>
                        <span class="text-slate-500 font-medium">发行商:</span>
                        <span class="text-slate-700 ml-1" data-gueleton-bone>
                          {item.publishers!.join(', ')}
                        </span>
                      </div>
                    </Show>
                  </div>
                  
                  {/* Release Dates */}
                  <Show when={item.releaseDates}>
                    <div class="bg-slate-50 rounded-lg p-3">
                      <h4 class="text-sm font-semibold text-slate-600 mb-2">发布日期</h4>
                      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <For each={Object.entries(item.releaseDates || {})}>
                          {([region, date]) => (
                            <div class="flex flex-col">
                              <span class="text-slate-500 font-medium capitalize">{region}</span>
                              <span class="text-slate-700" data-gueleton-bone>{String(date)}</span>
                            </div>
                          )}
                        </For>
                      </div>
                    </div>
                  </Show>
                </div>
                
                {/* Game ID Badge */}
                <div class="flex-shrink-0">
                  <span class="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-mono">
                    #{item.id}
                  </span>
                </div>
              </div>
            </div>
          )}
            </For>
            </div>
        )}
      </Gueleton>
    </div>
  )
}

export default SolidjsPlayground
