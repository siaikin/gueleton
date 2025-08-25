import React, { useState, useEffect } from 'react'
import { Gueleton } from 'unplugin-gueleton/client/react'

interface Game {
  id: number
  name: string
  genre?: string[]
  developers?: string[]
  publishers?: string[]
  releaseDates?: Record<string, string>
}

const ReactPlayground: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'overlay' | 'inPlace'>('overlay')
  const [fuzzy, setFuzzy] = useState(1)

  const [fetchDelay, setFetchDelay] = useState(
    localStorage.getItem('fetchDelay') ? Number(localStorage.getItem('fetchDelay')) : 0
  )
  useEffect(() => localStorage.setItem('fetchDelay', String(fetchDelay)), [fetchDelay])

  const [list, setList] = useState<Game[]>([])

  const handleRefresh = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://api.sampleapis.com/switch/games')
      const data = await response.json()
      setList(data.slice(0, 48))

      if (fetchDelay) {
        await new Promise((resolve) => setTimeout(resolve, fetchDelay * 1000))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleRefresh()
  }, [])

  return (
    <div className="h-screen flex flex-col gap-2 p-2">
      <div className="flex gap-2">
        <button 
          className="border border-slate-600 px-2 py-1 bg-slate-500 text-slate-100 cursor-pointer" 
          onClick={handleRefresh}
        >
          Refresh
        </button>

        <label className="border border-slate-600 px-2 py-1 flex items-center gap-1">
          Loading
          <input 
            type="checkbox" 
            checked={loading}
            onChange={(e) => setLoading(e.target.checked)}
          />
        </label>

        <label className="border border-slate-600 px-2 py-1 flex items-center gap-1">
          Fuzzy
          <input 
            type="range" 
            min="0" 
            max="10"
            value={fuzzy}
            onChange={(e) => setFuzzy(Number(e.target.value))}
          />
          <span>({fuzzy})</span>
        </label>

        <span className="flex-auto" />

        <label className="border border-slate-600 px-2 py-1 flex items-center gap-1">
          Type
          <select 
            value={type}
            onChange={(e) => setType(e.target.value as 'overlay' | 'inPlace')}
          >
            <option value="overlay">Overlay</option>
            <option value="inPlace">In-place</option>
          </select>
        </label>
      </div>

      <div className="flex gap-2">
        <label className="border border-slate-600 px-2 py-1 flex items-center gap-1">
          Fetch Delay
          <input 
            type="range" 
            min="0" 
            max="12"
            value={fetchDelay}
            onChange={(e) => setFetchDelay(Number(e.target.value))}
          />
          <span>({fetchDelay}s)</span>
        </label>
      </div>

      <Gueleton 
        dataKey="switchGameList" 
        data={list} 
        loading={loading} 
        type={type} 
        fuzzy={fuzzy} 
      >
        {({ data }) => (
          <div className="flex-auto overflow-x-auto border">
            {data?.map((item) => (
              <div 
                key={item.id}
                className="p-4 border-b border-slate-200 hover:bg-slate-50 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {/* Game Icon/Avatar */}
                  <div 
                    className="size-16 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 flex-shrink-0 shadow-sm" 
                    data-gueleton-bone 
                  />
                  
                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    {/* Game Title */}
                    <h1 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2" data-gueleton-bone>
                      {item.name}
                    </h1>
                    
                    {/* Genre Tags */}
                    {item.genre?.length && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.genre.map((g) => (
                          <span 
                            key={g}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium" 
                            data-gueleton-bone
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Developer & Publisher Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-sm">
                      {item.developers?.length && (
                        <div>
                          <span className="text-slate-500 font-medium">开发商:</span>
                          <span className="text-slate-700 ml-1" data-gueleton-bone>
                            {item.developers.join(', ')}
                          </span>
                        </div>
                      )}
                      {item.publishers?.length && (
                        <div>
                          <span className="text-slate-500 font-medium">发行商:</span>
                          <span className="text-slate-700 ml-1" data-gueleton-bone>
                            {item.publishers.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Release Dates */}
                    {item.releaseDates && (
                      <div className="bg-slate-50 rounded-lg p-3">
                        <h4 className="text-sm font-semibold text-slate-600 mb-2">发布日期</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {Object.entries(item.releaseDates).map(([region, date]) => (
                            <div key={region} className="flex flex-col">
                              <span className="text-slate-500 font-medium capitalize">{region}</span>
                              <span className="text-slate-700" data-gueleton-bone>{String(date)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Game ID Badge */}
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-mono">
                      #{item.id}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Gueleton>
    </div>
  )
}

export default ReactPlayground

// 使用说明：
// 1. 这个组件展示了如何在 React + TypeScript 项目中使用 Gueleton
// 2. 主要功能包括：
//    - 加载状态管理
//    - 数据获取和展示
//    - 骨架屏效果配置（type 和 fuzzy 参数）
// 3. 在真实项目中使用时，需要：
//    - 安装 unplugin-gueleton 包
//    - 在构建工具中配置 unplugin-gueleton 插件
//    - 从 'unplugin-gueleton/react' 导入 Gueleton 组件
// 4. data-gueleton-bone 属性用于标记骨架屏元素
