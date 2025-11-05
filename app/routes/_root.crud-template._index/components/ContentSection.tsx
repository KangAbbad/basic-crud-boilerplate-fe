import { DataCard } from './DataCard'
import { useDataList, useFilteredDataList } from '../stores/crud-template.store'

export function ContentSection() {
  const dataList = useDataList()
  const sortedAndFilteredDataList = useFilteredDataList()

  if (dataList.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4">
        <div className="text-center py-12">
          <p className="text-lg">No data yet</p>
          <p className="text-gray-500 text-sm">Create new data to get started</p>
        </div>
      </div>
    )
  }

  if (sortedAndFilteredDataList.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4">
        <div className="text-center py-12">
          <p className="text-lg">No results found</p>
          <p className="text-gray-500 text-sm">Try searching for something else or adjust the filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {sortedAndFilteredDataList.map((data) => (
        <DataCard key={data.id} data={data} />
      ))}
    </div>
  )
}
